import { store } from '../data/store';
import type { Tile, Unit, City } from '../data/types';
import { mapPosToTile as map_pos_to_tile } from '../data/map';
import { tileCity as tile_city } from '../data/tile';
import { tileGetKnown as tile_get_known, TILE_UNKNOWN, TILE_KNOWN_UNSEEN } from '../data/tile';
import { WRAP_X, WRAP_Y, wrapHasFlag as wrap_has_flag } from '../data/map';
import { clientState as client_state, C_S_RUNNING } from '../client/clientState';
import { globalEvents } from '../core/events';
import { logNormal, logError } from '../core/log';
import { LAYER_COUNT, LAYER_SPECIAL1, LAYER_CITY1, LAYER_GOTO, type SpriteEntry } from './tilespec';
import { FC_WRAP, DIVIDE } from '../utils/helpers';
import { mapToNativePos, nativeToMapPos } from '../data/map';
import { RENDERER_2DCANVAS } from '../core/constants';
import { get_drawable_unit, init_game_unit_panel } from '../core/control/unitFocus';
import { draw_fog_of_war } from '../ui/options';
import { check_request_goto_path } from '../core/control/mapClick';
import { init_chatbox } from '../core/messages';
import { setKeyboardInput } from '../core/control/controlState';
import { active_city } from '../ui/cityDialogState';
import {
  map_select_active,
  map_select_setting_enabled,
  map_select_x,
  map_select_y,
  mouse_x,
  mouse_y,
} from './mapctrl';

// Aliases for snake_case usage in this file
const MAP_TO_NATIVE_POS = mapToNativePos;
const NATIVE_TO_MAP_POS = nativeToMapPos;

// Imports from sibling modules (avoid bare-reference globals in IIFE bundle)
import {
  sprites_init,
  init_cache_sprites,
  mapview_put_tile,
  mapview_put_city_bar,
  mapview_put_border_line,
  mapview_put_goto_line,
  mapview_put_tile_label,
  canvas_put_select_rectangle,
  canvas_put_rectangle,
} from './mapview';
import { fill_sprite_array } from './tilespec';
import { tileset_tile_width, tileset_tile_height } from './tilesetConfig';


export let mapview: {
  width: number;
  height: number;
  gui_x0: number;
  gui_y0: number;
  store_width: number;
  store_height: number;
  [key: string]: unknown;
} = { width: 0, height: 0, gui_x0: 0, gui_y0: 0, store_width: 0, store_height: 0 };
export let mapdeco_highlight_table: Record<string, boolean> = {};
export let mapdeco_crosshair_table: Record<string, boolean> = {};
export let last_redraw_time: number = 0;
export const MAPVIEW_REFRESH_INTERVAL: number = 10;

export let dirty_tiles: { [key: number]: boolean } = {};
export let dirty_all: boolean = true;
export let dirty_count: number = 0;
export const DIRTY_FULL_THRESHOLD: number = 64;

export function mark_tile_dirty(tile_id: number): void {
  if (dirty_all) return;
  dirty_tiles[tile_id] = true;
  dirty_count++;
  if (dirty_count > DIRTY_FULL_THRESHOLD) {
    dirty_all = true;
  }
}

export function mark_all_dirty(): void {
  dirty_all = true;
}

export function clear_dirty(): void {
  dirty_tiles = {};
  dirty_count = 0;
  dirty_all = false;
}

export let mapview_slide: {
  active: boolean;
  dx: number;
  dy: number;
  i: number;
  max: number;
  slide_time: number;
  start?: number;
} = {
  active: false,
  dx: 0,
  dy: 0,
  i: 0,
  max: 100,
  slide_time: 700,
};


export function mapdeco_init(): void {
  mapdeco_highlight_table = {};
  mapdeco_crosshair_table = {};

  init_game_unit_panel();
  init_chatbox();
  setKeyboardInput(true);
}

/**************************************************************************
  Centers the mapview around (map_x, map_y).
**************************************************************************/
export function center_tile_mapcanvas_2d(ptile: { x: number; y: number }): void {
  const r = map_to_gui_pos(ptile['x'], ptile['y']);
  let gui_x = r['gui_dx'];
  let gui_y = r['gui_dy'];

  gui_x -= (mapview['width']! - tileset_tile_width) >> 1;
  gui_y -= (mapview['height']! - tileset_tile_height) >> 1;

  set_mapview_origin(gui_x, gui_y);
}

/**************************************************************************
  Centers the mapview around tile with given id.
**************************************************************************/
export function center_tile_id(ptile_id: number): void {
  const ptile = store.tiles[ptile_id];
  center_tile_mapcanvas_2d(ptile);
}


/****************************************************************************
  Translate from a cartesian system to the GUI system.  This function works
  on vectors, meaning it can be passed a (dx,dy) pair and will return the
  change in GUI coordinates corresponding to this vector.  It is thus more
  general than map_to_gui_pos.

  Note that a gui_to_map_vector function is not possible, since the
  resulting map vector may differ based on the origin of the gui vector.
  Note that is function is for isometric tilesets only.
****************************************************************************/
export function map_to_gui_vector(map_dx: number, map_dy: number): { gui_dx: number; gui_dy: number } {
  /*
   * Convert the map coordinates to isometric GUI
   * coordinates.  We'll make tile map(0,0) be the origin, and
   * transform like this:
   *
   *                     3
   * 123                2 6
   * 456 -> becomes -> 1 5 9
   * 789                4 8
   *                     7
   */

  const gui_dx = ((map_dx - map_dy) * tileset_tile_width) >> 1;
  const gui_dy = ((map_dx + map_dy) * tileset_tile_height) >> 1;
  return { 'gui_dx': gui_dx, 'gui_dy': gui_dy };
}

/****************************************************************************
  Change the mapview origin, clip it, and update everything.
****************************************************************************/
export function set_mapview_origin(gui_x0: number, gui_y0: number): void {
  /* Normalize (wrap) the mapview origin. */
  const r = normalize_gui_pos(gui_x0, gui_y0);
  gui_x0 = r['gui_x'];
  gui_y0 = r['gui_y'];

  base_set_mapview_origin(gui_x0, gui_y0);
}

/****************************************************************************
  Move the GUI origin to the given normalized, clipped origin.  This may
  be called many times when sliding the mapview.
****************************************************************************/
export function base_set_mapview_origin(gui_x0: number, gui_y0: number): void {
  /* We need to calculate the vector of movement of the mapview.  So
   * we find the GUI distance vector and then use this to calculate
   * the original mapview origin relative to the current position.  Thus
   * if we move one tile to the left, even if this causes GUI positions
   * to wrap the distance vector is only one tile. */
  const g = normalize_gui_pos(gui_x0, gui_y0);
  gui_x0 = g['gui_x'];
  gui_y0 = g['gui_y'];

  mapview['gui_x0'] = gui_x0;
  mapview['gui_y0'] = gui_y0;
  dirty_all = true;
}

/****************************************************************************
  Normalize (wrap) the GUI position.  This is equivalent to a map wrapping,
  but in GUI coordinates so that pixel accuracy is preserved.
****************************************************************************/
export function normalize_gui_pos(gui_x: number, gui_y: number): { gui_x: number; gui_y: number } {
  let map_x: number, map_y: number, nat_x: number, nat_y: number, gui_x0_temp: number, gui_y0_temp: number, diff_x: number, diff_y: number;

  /* Convert the (gui_x, gui_y) into a (map_x, map_y) plus a GUI offset
   * from this tile. */
  const r = gui_to_map_pos(gui_x, gui_y);
  map_x = r['map_x'];
  map_y = r['map_y'];


  const s = map_to_gui_pos(map_x, map_y);
  gui_x0_temp = s['gui_dx'];
  gui_y0_temp = s['gui_dy'];

  diff_x = gui_x - gui_x0_temp;
  diff_y = gui_y - gui_y0_temp;


  /* Perform wrapping without any realness check.  It's important that
   * we wrap even if the map position is unreal, which normalize_map_pos
   * doesn't necessarily do. */
  const t = MAP_TO_NATIVE_POS(map_x, map_y);
  nat_x = t['nat_x'];
  nat_y = t['nat_y'];

  if (wrap_has_flag(WRAP_X)) {
    nat_x = FC_WRAP(nat_x, store.mapInfo!['xsize']);
  }
  if (wrap_has_flag(WRAP_Y)) {
    nat_y = FC_WRAP(nat_y, store.mapInfo!['ysize']);
  }

  const u = NATIVE_TO_MAP_POS(nat_x, nat_y);
  map_x = u['map_x'];
  map_y = u['map_y'];

  /* Now convert the wrapped map position back to a GUI position and add the
   * offset back on. */
  const v = map_to_gui_pos(map_x, map_y);
  gui_x = v['gui_dx'];
  gui_y = v['gui_dy'];

  gui_x += diff_x;
  gui_y += diff_y;

  return { 'gui_x': gui_x, 'gui_y': gui_y };
}

/****************************************************************************
  Translate from gui to map coordinate systems.  See map_to_gui_pos().

  Note that you lose some information in this conversion.  If you convert
  from a gui position to a map position and back, you will probably not get
  the same value you started with.
****************************************************************************/
export function gui_to_map_pos(gui_x: number, gui_y: number): { map_x: number; map_y: number } {

  const W = tileset_tile_width;
  const H = tileset_tile_height;

  /* The basic operation here is a simple pi/4 rotation; however, we
   * have to first scale because the tiles have different width and
   * height.  Mathematically, this looks like
   *   | 1/W  1/H | |x|    |x`|
   *   |          | | | -> |  |
   *   |-1/W  1/H | |y|    |y`|
   *
   * Where W is the tile width and H the height.
   *
   * In simple terms, this is
   *   map_x = [   x / W + y / H ]
   *   map_y = [ - x / W + y / H ]
   * where [q] stands for integer part of q.
   *
   * Here the division is proper mathematical floating point division.
   *
   * A picture demonstrating this can be seen at
   * http://bugs.freeciv.org/Ticket/Attachment/16782/9982/grid1.png.
   *
   * We have to subtract off a half-tile in the X direction before doing
   * the transformation.  This is because, although the origin of the tile
   * is the top-left corner of the bounding box, after the transformation
   * the top corner of the diamond-shaped tile moves into this position.
   *
   * The calculation is complicated somewhat because of two things: we
   * only use integer math, and C integer division rounds toward zero
   * instead of rounding down.
   *
   * For another example of this math, see canvas_to_city_pos().
   */

  gui_x -= W >> 1;
  const map_x = DIVIDE(gui_x * H + gui_y * W, W * H);
  const map_y = DIVIDE(gui_y * W - gui_x * H, W * H);

  return { 'map_x': map_x, 'map_y': map_y };
}


/****************************************************************************
  Translate from map to gui coordinate systems.

  GUI coordinates are comparable to canvas coordinates but extend in all
  directions.  gui(0,0) == map(0,0).
****************************************************************************/
export function map_to_gui_pos(map_x: number, map_y: number): { gui_dx: number; gui_dy: number } {
  /* Since the GUI origin is the same as the map origin we can just do a
   * vector conversion. */
  return map_to_gui_vector(map_x, map_y);
}


/**************************************************************************
  Update (refresh) the map canvas starting at the given tile (in map
  coordinates) and with the given dimensions (also in map coordinates).

  In iso view, we have to use the Painter's Algorithm to draw the tiles
  in back first.  When we draw a tile, we tell the GUI which part of
  the tile to draw - which is necessary unless we have an extra
  buffering step.

  After refreshing the backing store tile-by-tile, we write the store
  out to the display if write_to_screen is specified.

  x, y, width, and height are in map coordinates; they need not be
  normalized or even real.
**************************************************************************/
export function update_map_canvas(canvas_x: number, canvas_y: number, width: number, height: number): void {
  let gui_x0: number, gui_y0: number;

  gui_x0 = mapview['gui_x0']! + canvas_x;
  gui_y0 = mapview['gui_y0']! + canvas_y;

  /* Clear the area, if the mapview extends beyond map borders.
   *
   * This is necessary since some parts of the rectangle
   * may not actually have any tiles drawn on them.  This will happen when
   * the mapview is large enough so that the tile is visible in multiple
   * locations.  In this case it will only be drawn in one place.
   *
   * Of course it's necessary to draw to the whole area to cover up any old
   * drawing that was done there. */
  const r = base_canvas_to_map_pos(0, 0);
  const s = base_canvas_to_map_pos(mapview['width']!, 0);
  const t = base_canvas_to_map_pos(0, mapview['height']!);
  const u = base_canvas_to_map_pos(mapview['width']!, mapview['height']!);
  if (r['map_x'] < 0 || r['map_x'] > store.mapInfo!['xsize'] || r['map_y'] < 0 || r['map_y'] > store.mapInfo!['ysize'] ||
    s['map_x'] < 0 || s['map_x'] > store.mapInfo!['xsize'] || s['map_y'] < 0 || s['map_y'] > store.mapInfo!['ysize'] ||
    t['map_x'] < 0 || t['map_x'] > store.mapInfo!['xsize'] || t['map_y'] < 0 || t['map_y'] > store.mapInfo!['ysize'] ||
    u['map_x'] < 0 || u['map_x'] > store.mapInfo!['xsize'] || u['map_y'] < 0 || u['map_y'] > store.mapInfo!['ysize']) {
    canvas_put_rectangle(store.mapviewCanvasCtx!, "rgb(0,0,0)", canvas_x, canvas_y, width, height);
  }

  // mapview_layer_iterate
  for (let layer = 0; layer <= LAYER_COUNT; layer++) {

    // set layer-specific canvas properties here.
    if (layer == LAYER_SPECIAL1) {
      store.mapviewCanvasCtx!.lineWidth = 2;
      store.mapviewCanvasCtx!.lineCap = 'butt';
      if (store.dashedSupport) store.mapviewCanvasCtx!.setLineDash([4, 4]);
    } else if (layer == LAYER_CITY1) {
      if (store.dashedSupport) store.mapviewCanvasCtx!.setLineDash([]);
    }

    //gui_rect_iterate begin
    let gui_x_0 = (gui_x0);
    let gui_y_0 = (gui_y0);
    let gui_x_w = width + (tileset_tile_width >> 1);
    let gui_y_h = height + (tileset_tile_height >> 1);
    if (gui_x_w < 0) {
      gui_x_0 += gui_x_w;
      gui_x_w = -gui_x_w;
    }

    if (gui_y_h < 0) {
      gui_y_0 += gui_y_h;
      gui_y_h = -gui_y_h;
    }

    if (gui_x_w > 0 && gui_y_h > 0) {
      const ptilepcorner: { tile?: (Tile | null)[] } = {};
      let ptile_xi: number, ptile_yi: number, ptile_si: number, ptile_di: number;
      let gui_x: number, gui_y: number;
      const ptile_r1 = 2;
      const ptile_r2 = ptile_r1 * 2;
      const ptile_w = tileset_tile_width;
      const ptile_h = tileset_tile_height;
      const ptile_x0 = Math.floor(((gui_x_0 * ptile_r2) / (ptile_w) - (((gui_x_0 * ptile_r2) < 0 && (gui_x_0 * ptile_r2) % (ptile_w) < 0) ? 1 : 0)) - ptile_r1 / 2);
      const ptile_y0 = Math.floor(((gui_y_0 * ptile_r2) / (ptile_h) - (((gui_y_0 * ptile_r2) < 0 && (gui_y_0 * ptile_r2) % (ptile_h) < 0) ? 1 : 0)) - ptile_r1 / 2);
      const ptile_x1 = Math.floor((((gui_x_0 + gui_x_w) * ptile_r2 + ptile_w - 1) / (ptile_w) - (((((gui_x_0 + gui_x_w) * ptile_r2 + ptile_w - 1) < 0) && (((gui_x_0 + gui_x_w) * ptile_r2 + ptile_w - 1) % (ptile_w) < 0)) ? 1 : 0)) + ptile_r1);
      const ptile_y1 = Math.floor((((gui_y_0 + gui_y_h) * ptile_r2 + ptile_h - 1) / (ptile_h) - (((((gui_y_0 + gui_y_h) * ptile_r2 + ptile_h - 1) < 0) && (((gui_y_0 + gui_y_h) * ptile_r2 + ptile_h - 1) % (ptile_h) < 0)) ? 1 : 0)) + ptile_r1);
      const ptile_count = (ptile_x1 - ptile_x0) * (ptile_y1 - ptile_y0);

      for (let ptile_index = 0; ptile_index < ptile_count; ptile_index++) {
        let ptile: Tile | null = null;
        let pcorner: { tile?: (Tile | null)[] } | null = null;
        ptile_xi = ptile_x0 + (ptile_index % (ptile_x1 - ptile_x0));
        ptile_yi = Math.floor(ptile_y0 + (ptile_index / (ptile_x1 - ptile_x0)));
        ptile_si = ptile_xi + ptile_yi;
        ptile_di = ptile_yi - ptile_xi;
        if ((ptile_xi + ptile_yi) % 2 != 0) {
          continue;
        }

        if (store.mapInfo!['wrap_id'] == 0 && (ptile_si <= 0 || ((ptile_si / 4)) > store.mapInfo!['xsize'])) {
          continue;  // Skip if flat earth without wrapping.
        }

        if (ptile_xi % 2 == 0 && ptile_yi % 2 == 0) {
          if ((ptile_xi + ptile_yi) % 4 == 0) {
            /* Tile */
            ptile = map_pos_to_tile((ptile_si / 4) - 1, (ptile_di / 4));
          } else {
            /* Corner */
            pcorner = ptilepcorner;
            pcorner['tile'] = [];
            pcorner['tile'][0] = map_pos_to_tile(((ptile_si - 6) / 4), ((ptile_di - 2) / 4));
            pcorner['tile'][1] = map_pos_to_tile(((ptile_si - 2) / 4), ((ptile_di - 2) / 4));
            pcorner['tile'][2] = map_pos_to_tile(((ptile_si - 2) / 4), ((ptile_di + 2) / 4));
            pcorner['tile'][3] = map_pos_to_tile(((ptile_si - 6) / 4), ((ptile_di + 2) / 4));
          }
        }

        gui_x = Math.floor(ptile_xi * ptile_w / ptile_r2 - ptile_w / 2);
        gui_y = Math.floor(ptile_yi * ptile_h / ptile_r2 - ptile_h / 2);

        const cx = gui_x - mapview['gui_x0']!;
        const cy = gui_y - mapview['gui_y0']!;


        if (ptile != null) {
          put_one_tile(store.mapviewCanvasCtx!, layer, ptile, cx, cy, null);
        } else if (pcorner != null) {
          put_one_element(store.mapviewCanvasCtx!, layer, null, null, pcorner,
            null, null, cx, cy, null);
        }
      }
    }
  }

  if (map_select_active && map_select_setting_enabled) {
    canvas_put_select_rectangle(store.mapviewCanvasCtx!, map_select_x, map_select_y,
      mouse_x - map_select_x, mouse_y - map_select_y);
  }
}


/**************************************************************************
  Draw some or all of a tile onto the canvas.
**************************************************************************/
export function put_one_tile(pcanvas: CanvasRenderingContext2D, layer: number, ptile: Tile, canvas_x: number, canvas_y: number, citymode: City | null): void {
  if (tile_get_known(ptile) != TILE_UNKNOWN || layer == LAYER_GOTO) {
    put_one_element(pcanvas, layer, ptile, null, null,
      get_drawable_unit(ptile, !!citymode),
      tile_city(ptile), canvas_x, canvas_y, citymode);
  }
}


/**************************************************************************
  Draw one layer of a tile, edge, corner, unit, and/or city onto the
  canvas at the given position.
**************************************************************************/
export function put_one_element(pcanvas: CanvasRenderingContext2D, layer: number, ptile: Tile | null, pedge: unknown, pcorner: { tile?: (Tile | null)[] } | null, punit: Unit | null,
  pcity: City | null, canvas_x: number, canvas_y: number, citymode: City | null): void {
  const tile_sprs = fill_sprite_array(layer, ptile, pedge, pcorner as { tile: (Tile | null)[] } | null, punit, pcity, !!citymode);

  const fog = (ptile != null && draw_fog_of_war
    && TILE_KNOWN_UNSEEN == tile_get_known(ptile));

  put_drawn_sprites(pcanvas, canvas_x, canvas_y, tile_sprs, fog);
}



/**************************************************************************
  Draw an array of drawn sprites onto the canvas.
**************************************************************************/
export function put_drawn_sprites(pcanvas: CanvasRenderingContext2D, canvas_x: number, canvas_y: number, pdrawn: SpriteEntry[], fog: boolean): void {
  for (let i = 0; i < pdrawn.length; i++) {
    const sprite = pdrawn[i] as Record<string, unknown>;
    let offset_x = 0, offset_y = 0;
    if ('offset_x' in sprite) {
      offset_x += sprite['offset_x'] as number;
    }
    if ('offset_y' in sprite) {
      offset_y += sprite['offset_y'] as number;
    }
    if (sprite['key'] == "city_text") {
      mapview_put_city_bar(pcanvas, sprite['city'] as City, canvas_x + offset_x, canvas_y + offset_y);
    } else if (sprite['key'] == "border") {
      mapview_put_border_line(pcanvas, sprite['dir'] as number, sprite['color'] as string, canvas_x, canvas_y);
    } else if (sprite['key'] == "goto_line") {
      mapview_put_goto_line(pcanvas, sprite['goto_dir'] as number, canvas_x, canvas_y);
    } else if (sprite['key'] == "tile_label") {
      mapview_put_tile_label(pcanvas, sprite['tile'] as Tile, canvas_x + offset_x, canvas_y + offset_y);
    } else {
      mapview_put_tile(pcanvas, sprite['key'] as string, canvas_x + offset_x, canvas_y + offset_y);
    }
  }
}


/****************************************************************************
  Finds the map coordinates corresponding to pixel coordinates.  The
  resulting position is unwrapped and may be unreal.
****************************************************************************/
export function base_canvas_to_map_pos(canvas_x: number, canvas_y: number): { map_x: number; map_y: number } {
  return gui_to_map_pos(canvas_x + mapview.gui_x0!,
    canvas_y + mapview.gui_y0!);
}

/**************************************************************************
  Finds the tile corresponding to pixel coordinates.  Returns that tile,
  or NULL if the position is off the map.
**************************************************************************/
export function canvas_pos_to_tile(canvas_x: number, canvas_y: number): Tile | null {
  let map_x: number, map_y: number;

  const r = base_canvas_to_map_pos(canvas_x, canvas_y);
  map_x = r['map_x'];
  map_y = r['map_y'];
  /*FIXME: if (normalize_map_pos(&map_x, &map_y)) {
    return map_pos_to_tile(map_x, map_y);
  } else {
    return null;
  }*/
  return map_pos_to_tile(map_x, map_y);
}

/**************************************************************************
  Updates the entire mapview.
**************************************************************************/
export function update_map_canvas_full(): void {
  if (store.tiles != null && client_state() >= C_S_RUNNING) {
    if (!sprites_init) init_cache_sprites();
    if (active_city != null) return;

    if (mapview_slide['active']) {
      update_map_slide();
    } else {
      update_map_canvas(0, 0, mapview['store_width']!, mapview['store_height']!);
      check_request_goto_path();
    }

    clear_dirty();
    last_redraw_time = new Date().getTime();
  }
}

/**************************************************************************
  Redraw only the tiles that have been marked dirty since the last frame.
  Falls back to a full redraw when too many tiles changed or on scroll.
**************************************************************************/
export function update_map_canvas_dirty(): void {
  if (store.tiles == null || client_state() < C_S_RUNNING) return;
  if (!sprites_init) init_cache_sprites();
  if (active_city != null) return;

  if (mapview_slide['active'] || dirty_all) {
    update_map_canvas_full();
    return;
  }

  if (dirty_count === 0) {
    last_redraw_time = new Date().getTime();
    return;
  }

  const tw = tileset_tile_width;
  const th = tileset_tile_height;

  for (const tid_str in dirty_tiles) {
    const tid = parseInt(tid_str, 10);
    const ptile = store.tiles[tid];
    if (ptile == null) continue;

    const r = map_to_gui_pos(ptile['x'], ptile['y']);
    const cx = r['gui_dx'] - mapview['gui_x0']!;
    const cy = r['gui_dy'] - mapview['gui_y0']!;

    if (cx + tw < 0 || cy + th < 0 ||
      cx > mapview['store_width']! || cy > mapview['store_height']!) {
      continue;
    }

    const pad = tw;
    const rx = cx - pad;
    const ry = cy - pad;
    const rw = tw + pad * 2;
    const rh = th + pad * 2;

    update_map_canvas(
      Math.max(0, rx),
      Math.max(0, ry),
      Math.min(rw, mapview['store_width']! - rx),
      Math.min(rh, mapview['store_height']! - ry)
    );
  }

  clear_dirty();
  last_redraw_time = new Date().getTime();
}

/**************************************************************************
  Possibly update the mapview, if some conditions apply.
  Uses dirty-rect rendering when only a few tiles changed.
**************************************************************************/
export function update_map_canvas_check(): void {
  const time = new Date().getTime() - last_redraw_time;
  if (time > MAPVIEW_REFRESH_INTERVAL && store.renderer == RENDERER_2DCANVAS) {
    if (dirty_all || dirty_count > DIRTY_FULL_THRESHOLD) {
      update_map_canvas_full();
    } else if (dirty_count > 0) {
      update_map_canvas_dirty();
    } else {
      last_redraw_time = new Date().getTime();
    }
  }
  try {
    if (store.renderer == RENDERER_2DCANVAS && window.requestAnimationFrame != null) requestAnimationFrame(update_map_canvas_check);
  } catch (e: unknown) {
    if (e instanceof Error && e.name == 'NS_ERROR_NOT_AVAILABLE') {
      setTimeout(update_map_canvas_check, 100);
    } else {
      throw e;
    }
  }
}

/**************************************************************************
  Renders a single frame in the mapview sliding animation, by clipping a
  region from the buffer_canvas onto the mapview canvas.
**************************************************************************/
export function update_map_slide(): void {
  const elapsed = 1 + new Date().getTime() - mapview_slide['start']!;
  mapview_slide['i'] = Math.floor(mapview_slide['max']
    * (mapview_slide['slide_time']
      - elapsed) / mapview_slide['slide_time']);

  if (mapview_slide['i'] <= 0) {
    mapview_slide['active'] = false;
    return;
  }

  const dx = mapview_slide['dx'];
  const dy = mapview_slide['dy'];
  let sx = 0;
  let sy = 0;

  if (dx >= 0 && dy <= 0) {
    sx = Math.floor((dx * ((mapview_slide['max'] - mapview_slide['i']) / mapview_slide['max'])));
    sy = Math.floor((dy * (-1 * mapview_slide['i'] / mapview_slide['max'])));
  } else if (dx >= 0 && dy >= 0) {
    sx = Math.floor((dx * ((mapview_slide['max'] - mapview_slide['i']) / mapview_slide['max'])));
    sy = Math.floor((dy * ((mapview_slide['max'] - mapview_slide['i']) / mapview_slide['max'])));
  } else if (dx <= 0 && dy >= 0) {
    sx = Math.floor((dx * (-1 * mapview_slide['i'] / mapview_slide['max'])));
    sy = Math.floor((dy * ((mapview_slide['max'] - mapview_slide['i']) / mapview_slide['max'])));
  } else if (dx <= 0 && dy <= 0) {
    sx = Math.floor((dx * (-1 * mapview_slide['i'] / mapview_slide['max'])));
    sy = Math.floor((dy * (-1 * mapview_slide['i'] / mapview_slide['max'])));
  }

  store.mapviewCanvasCtx!.drawImage(store.bufferCanvas!, sx, sy,
    mapview['width']!, mapview['height']!,
    0, 0, mapview['width']!, mapview['height']!);
}

// ---------------------------------------------------------------------------
// Expose to legacy JS / cross-module access (avoids circular dependency)
// ---------------------------------------------------------------------------
(window as unknown as Record<string, unknown>)['mapview'] = mapview;
(window as unknown as Record<string, unknown>)['map_to_gui_pos'] = map_to_gui_pos;

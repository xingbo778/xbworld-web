import { store } from '../data/store';
import type { Tile } from '../data/types';
import { mapPosToTile as map_pos_to_tile } from '../data/map';
import { WRAP_X, WRAP_Y, wrapHasFlag as wrap_has_flag } from '../data/map';
import { FC_WRAP, DIVIDE } from '../utils/helpers';
import { mapToNativePos, nativeToMapPos } from '../data/map';
import { tileset_tile_width, tileset_tile_height } from './tilesetConfig';

// Aliases for snake_case usage in this file
const MAP_TO_NATIVE_POS = mapToNativePos;
const NATIVE_TO_MAP_POS = nativeToMapPos;

// Forward-declared import to break circular dependency: mapview is imported
// lazily from mapviewCommon at call time via a setter.
let _mapview: {
  gui_x0: number;
  gui_y0: number;
  width: number;
  height: number;
  [key: string]: unknown;
};

/** Called by mapviewCommon to inject the mapview reference. */
export function _setMapviewRef(ref: typeof _mapview): void {
  _mapview = ref;
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


/****************************************************************************
  Finds the map coordinates corresponding to pixel coordinates.  The
  resulting position is unwrapped and may be unreal.
****************************************************************************/
export function base_canvas_to_map_pos(canvas_x: number, canvas_y: number): { map_x: number; map_y: number } {
  return gui_to_map_pos(canvas_x + _mapview.gui_x0!,
    canvas_y + _mapview.gui_y0!);
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
  Centers the mapview around (map_x, map_y).
**************************************************************************/
export function center_tile_mapcanvas_2d(ptile: { x: number; y: number }): void {
  const r = map_to_gui_pos(ptile['x'], ptile['y']);
  let gui_x = r['gui_dx'];
  let gui_y = r['gui_dy'];

  gui_x -= (_mapview['width']! - tileset_tile_width) >> 1;
  gui_y -= (_mapview['height']! - tileset_tile_height) >> 1;

  const before = { x0: _mapview['gui_x0'], y0: _mapview['gui_y0'] };
  set_mapview_origin(gui_x, gui_y);
  const after = { x0: _mapview['gui_x0'], y0: _mapview['gui_y0'] };
  console.log('[xbw center] tile=(%d,%d) gui_raw=(%d,%d) mv_wh=(%d,%d) input=(%d,%d) before=(%d,%d) after=(%d,%d)',
    ptile['x'], ptile['y'], r['gui_dx'], r['gui_dy'],
    _mapview['width'], _mapview['height'], gui_x, gui_y,
    before.x0, before.y0, after.x0, after.y0);
}

/**************************************************************************
  Centers the mapview around tile with given id.
**************************************************************************/
export function center_tile_id(ptile_id: number): void {
  const ptile = store.tiles[ptile_id];
  center_tile_mapcanvas_2d(ptile);
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

  _mapview['gui_x0'] = gui_x0;
  _mapview['gui_y0'] = gui_y0;
  // Import would be circular; we set dirty_all via the setter injected below.
  _setDirtyAll(true);
}

// To avoid circular dependency, mapviewCommon injects a setter for dirty_all.
let _setDirtyAll: (val: boolean) => void = () => {};
export function _setDirtyAllSetter(fn: (val: boolean) => void): void {
  _setDirtyAll = fn;
}

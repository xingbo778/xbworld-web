import { init_game_unit_panel } from '../core/control/unitFocus';
import { init_chatbox } from '../core/messages';
import { setKeyboardInput } from '../core/control/controlState';
import { invalidateTerrainNearCache, clearTerrainNearCache } from '../data/terrain';
import { setDebugValue } from '../utils/debugGlobals';
import { mapview } from './mapViewState';
export { mapview } from './mapViewState';

// --- Coordinate functions (extracted to mapCoords.ts) ---
import {
  map_to_gui_vector,
  normalize_gui_pos,
  gui_to_map_pos,
  map_to_gui_pos,
  base_canvas_to_map_pos,
  canvas_pos_to_tile,
  center_tile_mapcanvas_2d,
  center_tile_id,
  set_mapview_origin,
  base_set_mapview_origin,
  _setMapviewRef,
  _setDirtyAllSetter,
} from './mapCoords';

// Re-export coordinate functions so existing importers don't break
export {
  map_to_gui_vector,
  normalize_gui_pos,
  gui_to_map_pos,
  map_to_gui_pos,
  base_canvas_to_map_pos,
  canvas_pos_to_tile,
  center_tile_mapcanvas_2d,
  center_tile_id,
  set_mapview_origin,
  base_set_mapview_origin,
} from './mapCoords';

export let mapdeco_highlight_table: Record<string, boolean> = {};
export let mapdeco_crosshair_table: Record<string, boolean> = {};
export const last_redraw_time: number = 0;
export const MAPVIEW_REFRESH_INTERVAL: number = 10;

export let dirty_tiles: { [key: number]: boolean } = {};
export let dirty_all: boolean = true;
export let dirty_count: number = 0;
export const DIRTY_FULL_THRESHOLD: number = 64;

// Inject mapview reference and dirty_all setter into mapCoords to avoid circular deps
_setMapviewRef(mapview);
_setDirtyAllSetter((val: boolean) => { dirty_all = val; });
// Expose mapview origin for diagnostic tests
setDebugValue('__xbwMapview', { get x0() { return mapview.gui_x0; }, get y0() { return mapview.gui_y0; } });

export function mark_tile_dirty(tile_id: number): void {
  invalidateTerrainNearCache(tile_id);
  if (dirty_all) return;
  dirty_tiles[tile_id] = true;
  dirty_count++;
  if (dirty_count > DIRTY_FULL_THRESHOLD) {
    dirty_all = true;
  }
}

export function mark_all_dirty(): void {
  clearTerrainNearCache();
  dirty_all = true;
}

export function clear_dirty(): void {
  dirty_tiles = {};
  dirty_count = 0;
  dirty_all = false;
}

export const mapview_slide: {
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

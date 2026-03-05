/**
 * Ambient declarations for tileset globals loaded via script tags:
 *   - tileset_config_amplio2.js
 *   - tileset_spec_amplio2.js
 */

declare const MATCH_NONE: number;
declare const MATCH_SAME: number;
declare const MATCH_PAIR: number;
declare const MATCH_FULL: number;
declare const CELL_WHOLE: number;
declare const CELL_CORNER: number;

declare const ts_tiles: Record<string, any>;
declare const dir_ccw: (dir: number) => number;
declare const dir_cw: (dir: number) => number;
declare function fill_irrigation_sprite_array(ptile: any, pcity: any): any[];

declare let map_select_x: number;
declare let map_select_y: number;

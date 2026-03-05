/**
 * Ambient declarations for tileset globals loaded via script tags:
 *   - tileset_config_amplio2.js
 *   - tileset_spec_amplio2.js
 */

// MATCH_* and CELL_* constants: defined locally in tilesetConfig.ts
// and exported from tilespec.ts — no ambient declares needed.

declare const ts_tiles: Record<string, any>;
declare const dir_ccw: (dir: number) => number;
declare const dir_cw: (dir: number) => number;
declare let map_select_x: number;
declare let map_select_y: number;

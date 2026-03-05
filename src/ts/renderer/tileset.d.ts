/**
 * Ambient declarations for tileset globals loaded via script tags:
 *   - tileset_config_amplio2.js
 *   - tileset_spec_amplio2.js
 */

// MATCH_* and CELL_* constants: defined locally in tilesetConfig.ts
// and exported from tilespec.ts — no ambient declares needed.

declare const ts_tiles: Record<string, any>;
// dir_ccw / dir_cw: now imported from data/map.ts in tilespec.ts
declare let map_select_x: number;
declare let map_select_y: number;

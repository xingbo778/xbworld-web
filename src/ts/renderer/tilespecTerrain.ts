import { store } from '../data/store';
import { dirCCW as dir_ccw, dirCW as dir_cw } from '../data/map';
import type { Tile, Terrain } from '../data/types';
import type { SpriteEntry } from './tilespec';
import { MATCH_NONE, MATCH_SAME, MATCH_PAIR, MATCH_FULL, CELL_WHOLE, CELL_CORNER } from './tilespec';
import {
  tileset_tile_height,
  normal_tile_width, normal_tile_height,
  dither_offset_x, dither_offset_y,
  tile_types_setup, cellgroup_map, ts_tiles,
} from './tilesetConfig';

// DIR8 constants - standard Freeciv direction enum
const DIR8_NORTHWEST = 0;
const DIR8_NORTH = 1;
const DIR8_NORTHEAST = 2;
const DIR8_WEST = 3;
const DIR8_EAST = 4;
const DIR8_SOUTHWEST = 5;
const DIR8_SOUTH = 6;
const DIR8_SOUTHEAST = 7;

let num_cardinal_tileset_dirs: number = 4;
let cardinal_tileset_dirs: number[] = [DIR8_NORTH, DIR8_EAST, DIR8_SOUTH, DIR8_WEST];

let NUM_CORNER_DIRS: number = 4;

let DIR4_TO_DIR8: number[] = [DIR8_NORTH, DIR8_SOUTH, DIR8_EAST, DIR8_WEST];

// Precomputed corner cell offsets for CELL_CORNER rendering (avoid per-call allocation)
// Values set lazily from normal_tile_width / normal_tile_height (available at runtime)
let _iso_offsets: readonly (readonly number[])[] | null = null;
function getIsoOffsets(): readonly (readonly number[])[] {
  if (_iso_offsets == null) {
    const W = normal_tile_width;
    const H = normal_tile_height;
    _iso_offsets = [[W / 4, 0], [W / 4, H / 2], [W / 2, H / 4], [0, H / 4]] as const;
  }
  return _iso_offsets;
}

/**************************************************************************
  Return the store.tileset name of the direction. This is similar to
  dir_get_name but you shouldn't change this or all tilesets will break.
**************************************************************************/
function dir_get_tileset_name(dir: number): string {
  switch (dir) {
    case DIR8_NORTH:
      return "n";
    case DIR8_NORTHEAST:
      return "ne";
    case DIR8_EAST:
      return "e";
    case DIR8_SOUTHEAST:
      return "se";
    case DIR8_SOUTH:
      return "s";
    case DIR8_SOUTHWEST:
      return "sw";
    case DIR8_WEST:
      return "w";
    case DIR8_NORTHWEST:
      return "nw";
  }

  return "";
}

/****************************************************************************
  Return a directional string for the cardinal directions. Normally the
  binary value 1000 will be converted into "n1e0s0w0". This is in a
  clockwise ordering.
****************************************************************************/
function cardinal_index_str(idx: number): string {
  let c = "";

  for (let i = 0; i < num_cardinal_tileset_dirs; i++) {
    const value = (idx >> i) & 1;

    c += dir_get_tileset_name(cardinal_tileset_dirs[i]) + value;
  }

  return c;
}

/****************************************************************************
  Add store.sprites for the base tile to the sprite list. This doesn't
  include specials or rivers.
****************************************************************************/
export function fill_terrain_sprite_layer(layer_num: number, ptile: Tile, pterrain: Terrain | undefined, tterrain_near: (Terrain | undefined)[]): SpriteEntry[] {
  /* FIXME: handle blending and darkness. */

  return fill_terrain_sprite_array(layer_num, ptile, pterrain, tterrain_near);

}

/****************************************************************************
  Helper function for fill_terrain_sprite_layer.
****************************************************************************/
export function fill_terrain_sprite_array(l: number, ptile: Tile, pterrain: Terrain | undefined, tterrain_near: (Terrain | undefined)[]): SpriteEntry[] {
  if (pterrain == null) return [];

  const _tts_key = "l" + l + "." + pterrain!['graphic_str'];
  const dlp = tile_types_setup[_tts_key];
  if (dlp == null) {
    return [];
  }

  switch (dlp['sprite_type']) {
    case CELL_WHOLE:
      {
        switch (dlp['match_style']) {
          case MATCH_NONE:
            {
              const result_sprites: SpriteEntry[] = [];
              if (dlp['dither'] == true) {
                for (let i = 0; i < num_cardinal_tileset_dirs; i++) {
                  const near_t = tterrain_near[DIR4_TO_DIR8[i]]!;
                  if (near_t == null || ts_tiles[near_t['graphic_str']] == null) continue;
                  const near_dlp = tile_types_setup["l" + l + "." + near_t['graphic_str']];
                  const terrain_near = (near_dlp['dither'] == true) ? near_t['graphic_str'] : pterrain!['graphic_str'];
                  const dither_tile = i + pterrain!['graphic_str'] + "_" + terrain_near;
                  const x = dither_offset_x[i];
                  const y = dither_offset_y[i];
                  result_sprites.push({ "key": dither_tile, "offset_x": x, "offset_y": y });
                }
                return result_sprites;

              } else {
                return [{ "key": "t.l" + l + "." + pterrain!['graphic_str'] + 1 }];
              }
            }

          case MATCH_SAME:
            {
              let tileno = 0;
              const this_match_type = ts_tiles[pterrain!['graphic_str']]['layer' + l + '_match_type'];

              for (let i = 0; i < num_cardinal_tileset_dirs; i++) {
                const near_t = tterrain_near[i]!;
                if (near_t == null || ts_tiles[near_t['graphic_str']] == null) continue;
                const that = ts_tiles[near_t['graphic_str']]['layer' + l + '_match_type'];
                if (that == this_match_type) {
                  tileno |= 1 << i;
                }
              }
              const gfx_key = "t.l" + l + "." + pterrain!['graphic_str'] + "_" + cardinal_index_str(tileno);
              const y = tileset_tile_height - store.tileset[gfx_key][3];

              return [{ "key": gfx_key, "offset_x": 0, "offset_y": y }];
            }
        }
        break;
      }

    case CELL_CORNER:
      {
        /* Divide the tile up into four rectangular cells. Each of these
         * cells covers one corner, and each is adjacent to 3 different
         * tiles. For each cell we pick a sprite based upon the adjacent
         * terrains at each of those tiles. Thus, we have 8 different store.sprites
         * for each of the 4 cells (32 store.sprites total).
         *
         * These arrays correspond to the direction4 ordering. */

        // dlp is already tile_types_setup[_tts_key] — reuse it instead of rebuilding the key
        const this_match_index = dlp['match_index'][0] ?? -1;
        const that_match_index = dlp['match_index'][1] ?? -1;
        const result_sprites: SpriteEntry[] = [];

        /* Put corner cells */
        const iso_offsets = getIsoOffsets();
        for (let i = 0; i < NUM_CORNER_DIRS; i++) {
          const count = dlp['match_indices'];
          let array_index = 0;
          const dir = dir_ccw(DIR4_TO_DIR8[i]); // Assuming dir_ccw exists
          const x = iso_offsets[i][0];
          const y = iso_offsets[i][1];

          const m = [('l' + l + '.' + tterrain_near[dir_ccw(dir)]!['graphic_str'] in tile_types_setup) ? tile_types_setup['l' + l + '.' + tterrain_near[dir_ccw(dir)]!['graphic_str']]['match_index'][0] : -1,
          ('l' + l + '.' + tterrain_near[dir]!['graphic_str'] in tile_types_setup) ? tile_types_setup['l' + l + '.' + tterrain_near[dir]!['graphic_str']]['match_index'][0] : -1,
          ('l' + l + '.' + tterrain_near[dir_cw(dir)]!['graphic_str'] in tile_types_setup) ? tile_types_setup['l' + l + '.' + tterrain_near[dir_cw(dir)]!['graphic_str']]['match_index'][0] : -1]; // Assuming dir_cw exists

          /* synthesize 4 dimensional array? */
          switch (dlp['match_style']) {
            case MATCH_NONE:
              /* We have no need for matching, just plug the piece in place. */
              break;
            case MATCH_SAME: {
              const b1 = (m[2] != this_match_index) ? 1 : 0;
              const b2 = (m[1] != this_match_index) ? 1 : 0;
              const b3 = (m[0] != this_match_index) ? 1 : 0;
              array_index = array_index * 2 + b1;
              array_index = array_index * 2 + b2;
              array_index = array_index * 2 + b3;
              break;
            }
            case MATCH_PAIR: {
              const b1 = (m[2] == that_match_index) ? 1 : 0;
              const b2 = (m[1] == that_match_index) ? 1 : 0;
              const b3 = (m[0] == that_match_index) ? 1 : 0;
              array_index = array_index * 2 + b1;
              array_index = array_index * 2 + b2;
              array_index = array_index * 2 + b3;
              break;
            }

            case MATCH_FULL:
              {
                const n: number[] = [];
                let j = 0;
                for (; j < 3; j++) {
                  let k = 0;
                  for (; k < count; k++) {
                    n[j] = k; /* default to last entry */
                    if (m[j] == dlp['match_index'][k]) {
                      break;
                    }
                  }
                }
                array_index = array_index * count + n[2];
                array_index = array_index * count + n[1];
                array_index = array_index * count + n[0];
              }
              break;
          };
          array_index = array_index * NUM_CORNER_DIRS + i;
          result_sprites.push({ "key": cellgroup_map[pterrain!['graphic_str'] + "." + array_index] + "." + i, "offset_x": x, "offset_y": y });

        }

        return result_sprites;
      }
  }

  return [];

}

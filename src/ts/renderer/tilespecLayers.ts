import { store } from '../data/store';
import { mapstep } from '../data/map';
import { tileGetKnown as tile_get_known, tileHasExtra as tile_has_extra, tileResource as tile_resource } from '../data/tile';
import { tileTerrain as tile_terrain } from '../data/terrain';
import { isOceanTile as is_ocean_tile } from '../data/terrain';
import type { Tile, City } from '../data/types';
import type { SpriteEntry } from './tilespec';
import { TILE_KNOWN_SEEN, TILE_KNOWN_UNSEEN, TILE_UNKNOWN } from '../data/tile';
import {
  normal_tile_height,
  citybar_offset_x, citybar_offset_y,
  tilelabel_offset_x, tilelabel_offset_y,
} from './tilesetConfig';
import { get_base_flag_sprite } from './tilespecUnits';

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
  Add store.sprites for fog (and some forms of darkness).
****************************************************************************/
export function fill_fog_sprite_array(ptile: Tile | null, pedge: unknown, pcorner: { tile: (Tile | null)[] } | null): SpriteEntry[] {

  let i, tileno = 0;

  if (pcorner == null) return [];

  for (i = 3; i >= 0; i--) {
    const unknown = 0, fogged = 1, known = 2;
    let value = -1;

    if (pcorner['tile'][i] == null) {
      value = unknown;
    } else {
      switch (tile_get_known(pcorner['tile'][i]!)) {
        case TILE_KNOWN_SEEN:
          value = known;
          break;
        case TILE_KNOWN_UNSEEN:
          value = fogged;
          break;
        case TILE_UNKNOWN:
          value = unknown;
          break;
      }
    }
    tileno = tileno * 3 + value;
  }

  if (tileno >= 80) return [];

  return [{ "key": store.fullfog[tileno] }];

}

/****************************************************************************
 ...
****************************************************************************/
export function get_select_sprite(): SpriteEntry {
  // update selected unit sprite 6 times a second.
  const current_select_sprite = (Math.floor(performance.now() * 6 / 1000) % 4);
  return { "key": "unit.select" + current_select_sprite };
}

/****************************************************************************
 ...
****************************************************************************/
export function get_city_info_text(pcity: City): SpriteEntry {
  return {
    "key": "city_text", "city": pcity,
    "offset_x": citybar_offset_x, "offset_y": citybar_offset_y
  };
}

/****************************************************************************
 ...
****************************************************************************/
export function get_tile_label_text(ptile: Tile): SpriteEntry {
  return {
    "key": "tile_label", "tile": ptile,
    "offset_x": tilelabel_offset_x, "offset_y": tilelabel_offset_y
  };
}

/****************************************************************************
 ...
****************************************************************************/
export function get_tile_specials_sprite(ptile: Tile): SpriteEntry | null {
  const extra_id = tile_resource(ptile);

  if (extra_id !== null) {
    const extra = store.extras[extra_id];
    if (extra != null) {
      return { "key": extra['graphic_str'] as string };
    }
  }
  return null;
}

/****************************************************************************
 ...
****************************************************************************/
export function get_tile_river_sprite(ptile: Tile | null): SpriteEntry | null {
  if (ptile == null) {
    return null;
  }

  if (tile_has_extra(ptile, store.extraIds['EXTRA_RIVER'])) {
    let river_str = "";
    for (let i = 0; i < num_cardinal_tileset_dirs; i++) {
      const dir = cardinal_tileset_dirs[i];
      const checktile = mapstep(ptile, dir);
      if (checktile
        && (tile_has_extra(checktile, store.extraIds['EXTRA_RIVER']) || is_ocean_tile(checktile))) {
        river_str = river_str + dir_get_tileset_name(dir) + "1";
      } else {
        river_str = river_str + dir_get_tileset_name(dir) + "0";
      }

    }
    return { "key": "road.river_s_" + river_str };
  }

  const pterrain = tile_terrain(ptile);
  if (pterrain != null && pterrain!['graphic_str'] == "coast") {
    for (let i = 0; i < num_cardinal_tileset_dirs; i++) {
      const dir = cardinal_tileset_dirs[i];
      const checktile = mapstep(ptile, dir);
      if (checktile != null && tile_has_extra(checktile, store.extraIds['EXTRA_RIVER'])) {
        return { "key": "road.river_outlet_" + dir_get_tileset_name(dir) };
      }
    }
  }

  return null;

}

/****************************************************************************
  Returns a list of tiles to draw to render roads, railroads, and maglevs.
  TODO:
    - Support generic road types
    - Properly support generic extra hiding properties
****************************************************************************/
export function fill_path_sprite_array(_ptile: Tile, _pcity: City | null): SpriteEntry[] {
  // Road/rail sprite rendering is not yet implemented (TODO).
  // The result is always [] so skip all computation.
  return [];
}

/***********************************************************************
...
***********************************************************************/
export function fill_goto_line_sprite_array(ptile: Tile): SpriteEntry {
  return { "key": "goto_line", "goto_dir": ptile['goto_dir'] };
}

/***********************************************************************
...
***********************************************************************/
export function get_border_line_sprites(ptile: Tile): SpriteEntry[] {
  const result: SpriteEntry[] = [];

  for (let i = 0; i < num_cardinal_tileset_dirs; i++) {
    const dir = cardinal_tileset_dirs[i];
    const checktile = mapstep(ptile, dir);

    if (checktile != null && checktile['owner'] != null
      && ptile['owner'] != null
      && ptile['owner'] != checktile['owner']
      && ptile['owner'] != 255 /* 255 is a special constant indicating that the tile is not owned by anyone. */
      && store.players[ptile['owner']] != null) {
      const pnation = store.nations[store.players[ptile['owner']]['nation']];
      result.push({
        "key": "border", "dir": dir,
        "color": pnation['color']
      });
    }
  }

  return result;
}

/**************************************************************************
  Fill layer 1 sprite array (fortress background).
**************************************************************************/
export function fill_layer1_sprite_array(ptile: Tile, pcity: City | null): SpriteEntry[] {
  const result_sprites: SpriteEntry[] = [];

  if (pcity == null) {
    if (tile_has_extra(ptile, store.extraIds['EXTRA_FORTRESS'])) {
      result_sprites.push({"key": "base.fortress_bg",
                           "offset_y": -normal_tile_height / 2});
    }
  }

  return result_sprites;
}

/**************************************************************************
  Fill layer 2 sprite array (airbase, buoy, ruins).
**************************************************************************/
export function fill_layer2_sprite_array(ptile: Tile, pcity: City | null): SpriteEntry[] {
  const result_sprites: SpriteEntry[] = [];

  if (pcity == null) {
    if (tile_has_extra(ptile, store.extraIds['EXTRA_AIRBASE'])) {
      result_sprites.push({"key": "base.airbase_mg",
                           "offset_y": -normal_tile_height / 2});
    }
    if (tile_has_extra(ptile, store.extraIds['EXTRA_BUOY'])) {
      result_sprites.push(get_base_flag_sprite(ptile));
      result_sprites.push({"key": "base.buoy_mg",
                           "offset_y": -normal_tile_height / 2});
    }
    if (tile_has_extra(ptile, store.extraIds['EXTRA_RUINS'])) {
      result_sprites.push({"key": "extra.ruins_mg",
                           "offset_y": -normal_tile_height / 2});
    }
  }

  return result_sprites;
}

/**************************************************************************
  Fill layer 3 sprite array (fortress foreground).
**************************************************************************/
export function fill_layer3_sprite_array(ptile: Tile, pcity: City | null): SpriteEntry[] {
  const result_sprites: SpriteEntry[] = [];

  if (pcity == null) {
    if (tile_has_extra(ptile, store.extraIds['EXTRA_FORTRESS'])) {
      result_sprites.push({"key": "base.fortress_fg",
                           "offset_y": -normal_tile_height / 2});
    }
  }

  return result_sprites;
}

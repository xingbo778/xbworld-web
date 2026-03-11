import { store } from '../data/store';
import { clientPlaying } from '../client/clientState';
import { cityTile as city_tile, getCityDxyToIndex as get_city_dxy_to_index } from '../data/city';
import { game_find_city_by_number as find_city_by_number } from '../data/game';
import { unit_type, tile_units, get_unit_anim_offset, unit_has_goto, idex_lookup_unit as find_unit_by_number } from '../data/unit';
import { mapPosToTile as map_pos_to_tile, mapstep, mapDistanceVector as map_distance_vector, dirCCW as dir_ccw, dirCW as dir_cw } from '../data/map';
import { tileGetKnown as tile_get_known, tileHasExtra as tile_has_extra, tileResource as tile_resource } from '../data/tile';
import { tileTerrain as tile_terrain, tileTerrainNear as tile_terrain_near, isOceanTile as is_ocean_tile } from '../data/terrain';
import { unit_is_in_focus, should_ask_server_for_actions } from '../core/control';
import type { Tile, Unit, City, Terrain, Extra, UnitType } from '../data/types';

/** A single sprite entry passed to the renderer. */
export interface SpriteEntry { key?: string | null; [prop: string]: unknown }

import { TILE_KNOWN_SEEN, TILE_KNOWN_UNSEEN, TILE_UNKNOWN } from '../data/tile';
import {
  ACTIVITY_CLEAN, ACTIVITY_MINE, ACTIVITY_PLANT, ACTIVITY_IRRIGATE, ACTIVITY_CULTIVATE,
  ACTIVITY_FORTIFIED, ACTIVITY_BASE, ACTIVITY_SENTRY, ACTIVITY_PILLAGE, ACTIVITY_GOTO,
  ACTIVITY_TRANSFORM, ACTIVITY_FORTIFYING, ACTIVITY_GEN_ROAD, ACTIVITY_CONVERT
} from '../data/fcTypes';
import { ServerSideAgent } from '../data/unit';
import { UTYF_FLAGLESS } from '../data/unittype';

import {
  tileset_tile_height, tileset_name,
  normal_tile_width, normal_tile_height,
  unit_offset_x, unit_offset_y,
  unit_flag_offset_x, unit_flag_offset_y,
  unit_activity_offset_x, unit_activity_offset_y,
  city_flag_offset_x, city_flag_offset_y,
  citybar_offset_x, citybar_offset_y,
  tilelabel_offset_x, tilelabel_offset_y,
  dither_offset_x, dither_offset_y,
  tile_types_setup, cellgroup_map, ts_tiles,
} from './tilesetConfig';
import { draw_units, draw_focus_unit } from '../ui/options';
import { show_citybar } from '../core/control/controlState';
import { active_city } from '../ui/cityDialogState';
import { getTilesetFileExtension } from '../utils/helpers';

// Re-export extracted modules for backwards compatibility
export { assign_nation_color, color_rbg_to_list } from './nationColor';
export {
  get_unit_image_sprite, get_unit_type_image_sprite,
  get_improvement_image_sprite, get_specialist_image_sprite,
  get_technology_image_sprite, get_treaty_agree_thumb_up,
  get_treaty_disagree_thumb_down,
} from './spriteGetters';

// Re-export from tilespecTerrain
export { fill_terrain_sprite_layer, fill_terrain_sprite_array } from './tilespecTerrain';

// Re-export from tilespecUnits
export {
  fill_unit_sprite_array,
  get_unit_nation_flag_sprite, get_unit_stack_sprite, get_unit_hp_sprite,
  get_unit_veteran_sprite, get_unit_activity_sprite, get_unit_agent_sprite,
  get_city_sprite, get_city_flag_sprite, get_base_flag_sprite,
  get_city_occupied_sprite, get_city_food_output_sprite,
  get_city_shields_output_sprite, get_city_trade_output_sprite,
  get_city_invalid_worked_sprite,
} from './tilespecUnits';

// Re-export from tilespecLayers
export {
  fill_fog_sprite_array, fill_path_sprite_array,
  fill_layer1_sprite_array, fill_layer2_sprite_array, fill_layer3_sprite_array,
  fill_goto_line_sprite_array, get_border_line_sprites,
  get_select_sprite, get_city_info_text, get_tile_label_text,
  get_tile_specials_sprite, get_tile_river_sprite,
} from './tilespecLayers';

// Import from extracted modules for use in fill_sprite_array
import { fill_terrain_sprite_layer } from './tilespecTerrain';
import {
  fill_unit_sprite_array, get_city_sprite,
  get_city_food_output_sprite, get_city_shields_output_sprite,
  get_city_trade_output_sprite, get_city_invalid_worked_sprite,
} from './tilespecUnits';
import {
  fill_fog_sprite_array, fill_path_sprite_array,
  fill_layer1_sprite_array, fill_layer2_sprite_array, fill_layer3_sprite_array,
  fill_goto_line_sprite_array, get_border_line_sprites,
  get_select_sprite, get_city_info_text, get_tile_label_text,
  get_tile_specials_sprite, get_tile_river_sprite,
} from './tilespecLayers';

// DIR8 constants - standard Freeciv direction enum
// Must match map.ts Direction enum ordering (Freeciv standard)
const DIR8_NORTHWEST = 0;
const DIR8_NORTH = 1;
const DIR8_NORTHEAST = 2;
const DIR8_WEST = 3;
const DIR8_EAST = 4;
const DIR8_SOUTHWEST = 5;
const DIR8_SOUTH = 6;
const DIR8_SOUTHEAST = 7;

// Access sprites/tileset/fullfog/extraIds through the store (no more window access)

const num_cardinal_tileset_dirs: number = 4;
const cardinal_tileset_dirs: number[] = [DIR8_NORTH, DIR8_EAST, DIR8_SOUTH, DIR8_WEST];

const current_select_sprite: number = 0;
const max_select_sprite: number = 4;

export const explosion_anim_map: { [key: number]: number } = {};

/* Items on the mapview are drawn in layers. Each entry below represents
 * one layer. The names are basically arbitrary and just correspond to
 * groups of elements in fill_sprite_array(). Callers of fill_sprite_array
 * must call it once for each layer. */
const LAYER_TERRAIN1: number = 0;
const LAYER_TERRAIN2: number = 1;
const LAYER_TERRAIN3: number = 2;
const LAYER_ROADS: number = 3;
export const LAYER_SPECIAL1: number = 4;
export const LAYER_CITY1: number = 5;
const LAYER_SPECIAL2: number = 6;
const LAYER_UNIT: number = 7;
const LAYER_FOG: number = 8;
const LAYER_SPECIAL3: number = 9;
const LAYER_TILELABEL: number = 10;
const LAYER_CITYBAR: number = 11;
export const LAYER_GOTO: number = 12;
export const LAYER_COUNT: number = 13;

// these layers are not used at the moment, for performance reasons.
//var LAYER_BACKGROUND = ; (not in use)
//var LAYER_EDITOR = ; (not in use)
//var LAYER_GRID* = ; (not in use)


export const MATCH_NONE: number = 0;
export const MATCH_SAME: number = 1;		/* "boolean" match */
export const MATCH_PAIR: number = 2;
export const MATCH_FULL: number = 3;

export const CELL_WHOLE: number = 0;		/* entire tile */
export const CELL_CORNER: number = 1;	/* corner of tile */


const terrain_match: { [key: string]: number } = {
  "t.l0.hills1": MATCH_NONE,
  "t.l0.mountains1": MATCH_NONE,
  "t.l0.plains1": MATCH_NONE,
  "t.l0.desert1": MATCH_NONE

};

/**************************************************************************
  Returns true iff the store.tileset has graphics for the specified tag.
**************************************************************************/
function tileset_has_tag(tagname: string): boolean {
  return (store.sprites[tagname] != null);
}

/**************************************************************************
  Returns the tag name of the sprite of a ruleset entity where the
  preferred tag name is in the 'graphic_str' field, the fall back tag in
  case the store.tileset don't support the first tag is the 'graphic_alt' field
  and the entity name is stored in the 'name' field.
**************************************************************************/
export function tileset_ruleset_entity_tag_str_or_alt(entity: { graphic_str: string; graphic_alt: string; name: string } | null, kind_name: string): string | null {
  if (entity == null) {
    console.log("No " + kind_name + " to return tag for.");
    return null;
  }

  if (tileset_has_tag(entity['graphic_str'])) {
    return entity['graphic_str'];
  }

  if (tileset_has_tag(entity['graphic_alt'])) {
    return entity['graphic_alt'];
  }

  console.log("No graphic for " + kind_name + " " + entity['name']);
  return null;
}

/**************************************************************************
  Returns the tag name of the graphic showing the specified Extra on the
  map.
**************************************************************************/
function tileset_extra_graphic_tag(extra: Extra | null): string | null {
  return tileset_ruleset_entity_tag_str_or_alt(extra as { graphic_str: string; graphic_alt: string; name: string } | null, "extra");
}

/**************************************************************************
  Returns the tag name of the graphic showing the specified unit type.
**************************************************************************/
export function tileset_unit_type_graphic_tag(utype: UnitType): string | null {
  if (tileset_has_tag(utype['graphic_str'] + "_Idle")) {
    return utype['graphic_str'] + "_Idle";
  }

  if (tileset_has_tag(utype['graphic_alt'] + "_Idle")) {
    return utype['graphic_alt'] + "_Idle";
  }

  console.log("No graphic for unit " + utype['name']);
  return null;
}

/**************************************************************************
  Returns the tag name of the graphic for the unit.
**************************************************************************/
export function tileset_unit_graphic_tag(punit: Unit): string | null {
  /* Currently always uses the default "_Idle" sprite */
  const utype = unit_type(punit);
  if (utype == null) return null;
  return tileset_unit_type_graphic_tag(utype);
}

/**************************************************************************
  Returns the tag name of the graphic showing the specified building.
**************************************************************************/
export function tileset_building_graphic_tag(pimprovement: { graphic_str: string; graphic_alt: string; name: string } | null): string | null {
  return tileset_ruleset_entity_tag_str_or_alt(pimprovement, "building");
}

/**************************************************************************
  Returns the tag name of the graphic showing the specified tech.
**************************************************************************/
export function tileset_tech_graphic_tag(ptech: { graphic_str: string; graphic_alt: string; name: string } | null): string | null {
  return tileset_ruleset_entity_tag_str_or_alt(ptech, "tech");
}

/**************************************************************************
  Returns the tag name of the graphic showing the Extra specified by ID on
  the map.
**************************************************************************/
function tileset_extra_id_graphic_tag(extra_id: number): string | null {
  return tileset_extra_graphic_tag(store.extras[extra_id]);
}

/**************************************************************************
  Returns the tag name of the graphic showing that a unit is building the
  specified Extra.
**************************************************************************/
function tileset_extra_activity_graphic_tag(extra: Extra | null): string | null {
  if (extra == null) {
    console.log("No extra to return tag for.");
    return null;
  }

  if (tileset_has_tag(extra['activity_gfx'] as string)) {
    return extra['activity_gfx'] as string;
  }

  if (tileset_has_tag(extra['act_gfx_alt'] as string)) {
    return extra['act_gfx_alt'] as string;
  }

  if (tileset_has_tag(extra['act_gfx_alt2'] as string)) {
    return extra['act_gfx_alt2'] as string;
  }

  console.log("No activity graphic for extra " + extra['name']);

  return null;
}

/**************************************************************************
  Returns the tag name of the graphic showing that a unit is building the
  Extra specified by the id.
**************************************************************************/
export function tileset_extra_id_activity_graphic_tag(extra_id: number): string | null {
  return tileset_extra_activity_graphic_tag(store.extras[extra_id]);
}

/**************************************************************************
  Returns the tag name of the graphic showing that a unit is removing the
  specified Extra.
**************************************************************************/
function tileset_extra_rmactivity_graphic_tag(extra: Extra | null): string | null {
  if (extra == null) {
    console.log("No extra to return tag for.");
    return null;
  }

  if (tileset_has_tag(extra['rmact_gfx'] as string)) {
    return extra['rmact_gfx'] as string;
  }

  if (tileset_has_tag(extra['rmact_gfx_alt'] as string)) {
    return extra['rmact_gfx_alt'] as string;
  }

  if (tileset_has_tag(extra['rmact_gfx_alt2'] as string)) {
    return extra['rmact_gfx_alt2'] as string;
  }

  console.log("No removal activity graphic for extra " + extra['name']);

  return null;
}

/**************************************************************************
  Returns the tag name of the graphic showing that a unit is removing the
  Extra specified by the id.
**************************************************************************/
export function tileset_extra_id_rmactivity_graphic_tag(extra_id: number): string | null {
  return tileset_extra_rmactivity_graphic_tag(store.extras[extra_id]);
}

/****************************************************************************
  Fill in the sprite array for the given tile, city, and unit.

  ptile, if specified, gives the tile. If specified the terrain and specials
  will be drawn for this tile. In this case (map_x,map_y) should give the
  location of the tile.

  punit, if specified, gives the unit. For tile drawing this should
  generally be get_drawable_unit(); otherwise it can be any unit.

  pcity, if specified, gives the city. For tile drawing this should
  generally be tile_city(ptile); otherwise it can be any city.

  citymode specifies whether this is part of a citydlg. If so some drawing
  is done differently.
****************************************************************************/
export function fill_sprite_array(layer: number, ptile: Tile | null, pedge: unknown, pcorner: { tile: (Tile | null)[] } | null, punit: Unit | null, pcity: City | null, citymode: boolean): SpriteEntry[] {
  const sprite_array: SpriteEntry[] = [];

  switch (layer) {
    case LAYER_TERRAIN1:
      if (ptile != null) {
        const tterrain_near = tile_terrain_near(ptile);
        const pterrain = tile_terrain(ptile);
        sprite_array.push(...fill_terrain_sprite_layer(0, ptile, pterrain, tterrain_near));

      }
      break;

    case LAYER_TERRAIN2:
      if (ptile != null) {
        const tterrain_near = tile_terrain_near(ptile);
        const pterrain = tile_terrain(ptile);
        sprite_array.push(...fill_terrain_sprite_layer(1, ptile, pterrain, tterrain_near));

      }
      break;

    case LAYER_TERRAIN3:
      if (ptile != null) {
        const tterrain_near = tile_terrain_near(ptile);
        const pterrain = tile_terrain(ptile);
        sprite_array.push(...fill_terrain_sprite_layer(2, ptile, pterrain, tterrain_near));

        // fill_irrigation_sprite_array was a legacy extension — removed
      }
      break;

    case LAYER_ROADS:
      if (ptile != null) {
        sprite_array.push(...fill_path_sprite_array(ptile, pcity));
      }
      break;

    case LAYER_SPECIAL1:
      if (ptile != null) {

        const river_sprite = get_tile_river_sprite(ptile);
        if (river_sprite != null) sprite_array.push(river_sprite);

        const spec_sprite = get_tile_specials_sprite(ptile);
        if (spec_sprite != null) sprite_array.push(spec_sprite);


        if (tile_has_extra(ptile, store.extraIds['EXTRA_MINE'])) {
          sprite_array.push({
            "key":
              tileset_extra_id_graphic_tag(store.extraIds['EXTRA_MINE'])
          });
        }
        if (tile_has_extra(ptile, store.extraIds['EXTRA_OIL_WELL'])) {
          sprite_array.push({
            "key":
              tileset_extra_id_graphic_tag(store.extraIds['EXTRA_OIL_WELL'])
          });
        }

        sprite_array.push(...fill_layer1_sprite_array(ptile, pcity));

        if (tile_has_extra(ptile, store.extraIds['EXTRA_HUT'])) {
          sprite_array.push({
            "key":
              tileset_extra_id_graphic_tag(store.extraIds['EXTRA_HUT'])
          });
        }

        if (tile_has_extra(ptile, store.extraIds['EXTRA_POLLUTION'])) {
          sprite_array.push({
            "key":
              tileset_extra_id_graphic_tag(store.extraIds['EXTRA_POLLUTION'])
          });
        }

        if (tile_has_extra(ptile, store.extraIds['EXTRA_FALLOUT'])) {
          sprite_array.push({
            "key":
              tileset_extra_id_graphic_tag(store.extraIds['EXTRA_FALLOUT'])
          });
        }

        sprite_array.push(...get_border_line_sprites(ptile));

      }
      break;

    case LAYER_CITY1:
      if (pcity != null) {
        sprite_array.push(get_city_sprite(pcity));
        if (pcity['unhappy']) {
          sprite_array.push({ "key": "city.disorder" });
        }
      }


      break;

    case LAYER_SPECIAL2:
      if (ptile != null) {
        sprite_array.push(...fill_layer2_sprite_array(ptile, pcity));
      }
      break;

    case LAYER_UNIT: {
      const do_draw_unit = (punit != null && (draw_units || ptile == null || (draw_focus_unit
        && unit_is_in_focus(punit))));

      if (do_draw_unit && active_city == null) {
        const punits = ptile != null ? tile_units(ptile) : null;
        const stacked = (punits != null && punits.length > 1);
        // const backdrop = false; /* !pcity;*/

        if (unit_is_in_focus(punit)) {
          sprite_array.push(get_select_sprite());
        }

        /* TODO: Special case for drawing the selection rectangle. The blinking
        * unit is handled separately, inside get_drawable_unit(). */
        sprite_array.push(...fill_unit_sprite_array(punit, stacked, false));

      }

      /* show explosion animation on current tile.*/
      if (ptile != null && explosion_anim_map[ptile['index']] != null) {
        const explode_step = explosion_anim_map[ptile['index']];
        explosion_anim_map[ptile['index']] = explode_step - 1;
        if (explode_step > 20) {
          sprite_array.push({
            "key": "explode.unit_0",
            "offset_x": unit_offset_x,
            "offset_y": unit_offset_y
          });
        } else if (explode_step > 15) {
          sprite_array.push({
            "key": "explode.unit_1",
            "offset_x": unit_offset_x,
            "offset_y": unit_offset_y
          });
        } else if (explode_step > 10) {
          sprite_array.push({
            "key": "explode.unit_2",
            "offset_x": unit_offset_x,
            "offset_y": unit_offset_y
          });
        } else if (explode_step > 5) {
          sprite_array.push({
            "key": "explode.unit_3",
            "offset_x": unit_offset_x,
            "offset_y": unit_offset_y
          });
        } else if (explode_step > 0) {
          sprite_array.push({
            "key": "explode.unit_4",
            "offset_x": unit_offset_x,
            "offset_y": unit_offset_y
          });
        } else {
          delete explosion_anim_map[ptile['index']];
        }

      }


      break;
    }

    case LAYER_FOG:
      sprite_array.push(...fill_fog_sprite_array(ptile, pedge, pcorner));

      break;

    case LAYER_SPECIAL3:
      if (ptile != null) {
        sprite_array.push(...fill_layer3_sprite_array(ptile, pcity));
      }
      break;

    case LAYER_TILELABEL:
      if (ptile != null && ptile['label'] != null && (ptile['label'] as string).length > 0) {
        sprite_array.push(get_tile_label_text(ptile));
      }
      break;

    case LAYER_CITYBAR:
      if (pcity != null && show_citybar) {
        sprite_array.push(get_city_info_text(pcity));
      }

      if (active_city != null && ptile != null && ptile['worked'] != null
        && active_city['id'] == ptile['worked'] && active_city['output_food'] != null) {
        const ctile = city_tile(active_city)!;
        const d = map_distance_vector(ctile, ptile);
        const idx = get_city_dxy_to_index(d[0], d[1], active_city);

        let food_output = (active_city['output_food'] as number[])[idx];
        let shield_output = (active_city['output_shield'] as number[])[idx];
        let trade_output = (active_city['output_trade'] as number[])[idx];

        /* The ruleset may use large values scaled down to get greater
         * granularity. */
        const gran = (store.gameInfo?.['granularity'] as number) ?? 1;
        food_output = Math.floor(food_output / gran);
        shield_output = Math.floor(shield_output / gran);
        trade_output = Math.floor(trade_output / gran);

        sprite_array.push(get_city_food_output_sprite(food_output));
        sprite_array.push(get_city_shields_output_sprite(shield_output));
        sprite_array.push(get_city_trade_output_sprite(trade_output));
      } else if (active_city != null && ptile != null && ptile['worked'] != 0) {
        sprite_array.push(get_city_invalid_worked_sprite());
      }
      break;

    case LAYER_GOTO:
      if (ptile != null && ptile['goto_dir'] != null) {
        sprite_array.push(fill_goto_line_sprite_array(ptile));
      }

      if (ptile != null && (ptile['nuke'] as number) > 0) {
        (ptile as Record<string, unknown>)['nuke'] = (ptile['nuke'] as number) - 1;
        sprite_array.push({
          "key": "explode.nuke",
          "offset_x": -45,
          "offset_y": -45
        });
      }

      break;
  }


  return sprite_array;

}

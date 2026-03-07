import { store } from '../data/store';
import { clientPlaying } from '../client/clientState';
import { cityTile as city_tile } from '../data/city';
import { unit_type, tile_units, get_unit_anim_offset, unit_has_goto } from '../data/unit';
import { unit_is_in_focus, should_ask_server_for_actions } from '../core/control';
import type { Tile, Unit, City } from '../data/types';
import type { BitVector } from '../utils/bitvector';
import type { SpriteEntry } from './tilespec';
import { tileset_unit_graphic_tag, tileset_extra_id_activity_graphic_tag, tileset_extra_id_rmactivity_graphic_tag } from './tilespec';
import {
  ACTIVITY_CLEAN, ACTIVITY_MINE, ACTIVITY_PLANT, ACTIVITY_IRRIGATE, ACTIVITY_CULTIVATE,
  ACTIVITY_FORTIFIED, ACTIVITY_BASE, ACTIVITY_SENTRY, ACTIVITY_PILLAGE, ACTIVITY_GOTO,
  ACTIVITY_TRANSFORM, ACTIVITY_FORTIFYING, ACTIVITY_GEN_ROAD, ACTIVITY_CONVERT
} from '../data/fcTypes';
import { ServerSideAgent } from '../data/unit';
import { UTYF_FLAGLESS } from '../data/unittype';
import {
  unit_offset_x, unit_offset_y,
  unit_flag_offset_x, unit_flag_offset_y,
  unit_activity_offset_x, unit_activity_offset_y,
  city_flag_offset_x, city_flag_offset_y,
  normal_tile_height, normal_tile_width,
} from './tilesetConfig';
import { tileGetKnown as tile_get_known } from '../data/tile';

// SSA constants from ServerSideAgent enum
const SSA_NONE = ServerSideAgent.NONE;
const SSA_AUTOWORKER = ServerSideAgent.AUTOWORKER;
const SSA_AUTOEXPLORE = ServerSideAgent.AUTOEXPLORE;

/**************************************************************************
 ...
**************************************************************************/
export function fill_unit_sprite_array(punit: Unit, stacked: boolean, backdrop: boolean): SpriteEntry[] {
  const unit_offset = get_unit_anim_offset(punit);
  const result: SpriteEntry[] = [get_unit_nation_flag_sprite(punit),
  {
    "key": tileset_unit_graphic_tag(punit),
    "offset_x": unit_offset['x'] + unit_offset_x,
    "offset_y": unit_offset['y'] - unit_offset_y
  }];
  const activities = get_unit_activity_sprite(punit);
  if (activities != null) {
    activities['offset_x'] = (activities['offset_x'] as number) + unit_offset['x'];
    activities['offset_y'] = (activities['offset_y'] as number) + unit_offset['y'];
    result.push(activities);
  }
  const agent = get_unit_agent_sprite(punit);
  if (agent != null) {
    agent['offset_x'] = (agent['offset_x'] as number) + unit_offset['x'];
    agent['offset_y'] = (agent['offset_y'] as number) + unit_offset['y'];
    result.push(agent);
  }

  if (should_ask_server_for_actions(punit)) {
    result.push({
      "key": "unit.action_decision_want",
      "offset_x": unit_activity_offset_x + unit_offset['x'],
      "offset_y": -unit_activity_offset_y + unit_offset['y'],
    });
  }

  result.push(get_unit_hp_sprite(punit));
  if (stacked) result.push(get_unit_stack_sprite());
  if (punit['veteran'] > 0) result.push(get_unit_veteran_sprite(punit));

  return result;
}

/***********************************************************************
  Return the flag graphic to be used by the city.
***********************************************************************/
export function get_city_flag_sprite(pcity: City): SpriteEntry {
  const owner_id = pcity['owner'];
  if (owner_id == null) return { "key": "" };
  const owner = store.players[owner_id];
  if (owner == null) return { "key": "" };
  const nation_id = owner['nation'];
  if (nation_id == null) return { "key": "" };
  const nation = store.nations[nation_id];
  if (nation == null) return { "key": "" };
  return {
    "key": "f." + nation['graphic_str'],
    "offset_x": city_flag_offset_x,
    "offset_y": - city_flag_offset_y
  };
}

/***********************************************************************
  Return the flag graphic to be used by the base on tile
***********************************************************************/
export function get_base_flag_sprite(ptile: Tile): SpriteEntry {
  const owner_id = ptile['extras_owner'] as number | undefined;
  if (owner_id == null) return { "key": "" };
  const owner = store.players[owner_id];
  if (owner == null) return { "key": "" };
  const nation_id = owner['nation'];
  if (nation_id == null) return { "key": "" };
  const nation = store.nations[nation_id];
  if (nation == null) return { "key": "" };
  return {
    "key": "f." + nation['graphic_str'],
    "offset_x": city_flag_offset_x,
    "offset_y": - city_flag_offset_y
  };
}

/***********************************************************************
  Returns the sprite key for the number of defending units in a city.
***********************************************************************/
export function get_city_occupied_sprite(pcity: City): string {
  const owner_id = pcity['owner'];
  const ptile = city_tile(pcity);
  const punits = tile_units(ptile);

  if (!store.observing && clientPlaying() != null
    && owner_id != clientPlaying()!.playerno && pcity['occupied']) {
    return "citybar.occupied";
  } else if (punits != null && punits.length == 1) {
    return "citybar.occupancy_1";
  } else if (punits != null && punits.length == 2) {
    return "citybar.occupancy_2";
  } else if (punits != null && punits.length >= 3) {
    return "citybar.occupancy_3";
  } else {
    return "citybar.occupancy_0";
  }
}

/***********************************************************************
  ...
***********************************************************************/
export function get_city_food_output_sprite(num: number): SpriteEntry {
  return {
    "key": "city.t_food_" + num,
    "offset_x": normal_tile_width / 4,
    "offset_y": -normal_tile_height / 4
  };
}

/***********************************************************************
...
***********************************************************************/
export function get_city_shields_output_sprite(num: number): SpriteEntry {
  return {
    "key": "city.t_shields_" + num,
    "offset_x": normal_tile_width / 4,
    "offset_y": -normal_tile_height / 4
  };
}

/***********************************************************************
...
***********************************************************************/
export function get_city_trade_output_sprite(num: number): SpriteEntry {
  return {
    "key": "city.t_trade_" + num,
    "offset_x": normal_tile_width / 4,
    "offset_y": -normal_tile_height / 4
  };
}


/***********************************************************************
  Return the sprite for an invalid city worked tile.
***********************************************************************/
export function get_city_invalid_worked_sprite(): SpriteEntry {
  return {
    "key": "grid.unavailable",
    "offset_x": 0,
    "offset_y": 0
  };
}

/***********************************************************************
  ...
***********************************************************************/
export function get_unit_nation_flag_sprite(punit: Unit): SpriteEntry {
  const owner_id = punit['owner'];

  if ((unit_type(punit)?.['flags'] as unknown as BitVector | undefined)?.isSet?.(UTYF_FLAGLESS)
    && clientPlaying() != null
    && owner_id != clientPlaying()!.playerno) {
    return { "key": "" };
  } else {
    const owner = store.players[owner_id];
    const nation_id = owner['nation'];
    const nation = store.nations[nation_id];
    const unit_offset = get_unit_anim_offset(punit);

    return {
      "key": "f.shield." + nation['graphic_str'],
      "offset_x": unit_flag_offset_x + unit_offset['x'],
      "offset_y": - unit_flag_offset_y + unit_offset['y']
    };
  }
}

/***********************************************************************
  ...
***********************************************************************/
export function get_unit_stack_sprite(punit?: Unit): SpriteEntry {
  return {
    "key": "unit.stack",
    "offset_x": unit_flag_offset_x + -25,
    "offset_y": - unit_flag_offset_y - 15
  };
}

/***********************************************************************
  ...
***********************************************************************/
export function get_unit_hp_sprite(punit: Unit): SpriteEntry {
  const hp = punit['hp'];
  const utype = unit_type(punit);
  const max_hp = utype?.['hp'] ?? 1;
  const healthpercent = 10 * Math.floor((10 * hp) / max_hp);
  const unit_offset = get_unit_anim_offset(punit);

  return {
    "key": "unit.hp_" + healthpercent,
    "offset_x": unit_flag_offset_x + -25 + unit_offset['x'],
    "offset_y": - unit_flag_offset_y - 15 + unit_offset['y']
  };
}

/***********************************************************************
  ...
***********************************************************************/
export function get_unit_veteran_sprite(punit: Unit): SpriteEntry {
  return {
    "key": "unit.vet_" + punit['veteran'],
    "offset_x": unit_activity_offset_x - 20,
    "offset_y": - unit_activity_offset_y - 10
  };
}

/***********************************************************************
  ...
***********************************************************************/
export function get_unit_activity_sprite(punit: Unit): SpriteEntry | null {
  if (punit['ssa_controller'] == SSA_AUTOEXPLORE) {
    // FIXME: Currently can't have SSA_AUTOEXPLORE sprite with activity store.sprites
    return null;
  }

  const activity = punit['activity'];
  const act_tgt = punit['activity_tgt'] as number;

  switch (activity) {
    case ACTIVITY_CLEAN:
      return {
        "key": -1 == act_tgt ?
          "unit.pollution" :
          tileset_extra_id_rmactivity_graphic_tag(act_tgt),
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_MINE:
      return {
        "key": -1 == act_tgt ?
          "unit.plant" :
          tileset_extra_id_activity_graphic_tag(act_tgt),
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_PLANT:
      return {
        "key": "unit.plant",
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_IRRIGATE:
      return {
        "key": -1 == act_tgt ?
          "unit.irrigate" :
          tileset_extra_id_activity_graphic_tag(act_tgt),
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_CULTIVATE:
      return {
        "key": "unit.cultivate",
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_FORTIFIED:
      return {
        "key": "unit.fortified",
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_BASE:
      return {
        "key": tileset_extra_id_activity_graphic_tag(act_tgt),
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_SENTRY:
      return {
        "key": "unit.sentry",
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_PILLAGE:
      return {
        "key": "unit.pillage",
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_GOTO:
      return {
        "key": "unit.goto",
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_TRANSFORM:
      return {
        "key": "unit.transform",
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_FORTIFYING:
      return {
        "key": "unit.fortifying",
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_GEN_ROAD:
      return {
        "key": tileset_extra_id_activity_graphic_tag(act_tgt),
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };

    case ACTIVITY_CONVERT:
      return {
        "key": "unit.convert",
        "offset_x": unit_activity_offset_x,
        "offset_y": - unit_activity_offset_y
      };
  }

  if (unit_has_goto(punit)) {
    return {
      "key": "unit.goto",
      "offset_x": unit_activity_offset_x,
      "offset_y": - unit_activity_offset_y
    };
  }

  return null;
}

/***********************************************************************
  ...
***********************************************************************/
export function get_unit_agent_sprite(punit: Unit): SpriteEntry | null {
  switch (punit['ssa_controller']) {
    case SSA_NONE:
      break;
    case SSA_AUTOWORKER:
      return {
        "key": "unit.auto_worker",
        "offset_x": 0,
        "offset_y": 0
      };
    case SSA_AUTOEXPLORE:
      // Treated like an activity in the tilespec format
      return {
        "key": "unit.auto_explore",
        "offset_x": unit_activity_offset_x,
        "offset_y": -unit_activity_offset_y
      };
  }

  return null;
}

/****************************************************************************
  Return the sprite in the city_sprite listing that corresponds to this
  city - based on city style and size.

  See also load_city_sprite, free_city_sprite.
****************************************************************************/
export function get_city_sprite(pcity: City): SpriteEntry {
  let style_id = pcity['style'] as number;
  if (style_id == -1) style_id = 0;   /* Sometimes a player has no city_style. */
  const city_rule = store.cityRules[style_id];
  if (city_rule == null) return { "key": "cd.city_city_0", "offset_x": 0, "offset_y": -unit_offset_y };

  let size = 0;
  if (pcity['size'] >= 4 && pcity['size'] <= 7) {
    size = 1;
  } else if (pcity['size'] >= 8 && pcity['size'] <= 11) {
    size = 2;
  } else if (pcity['size'] >= 12 && pcity['size'] <= 15) {
    size = 3;
  } else if (pcity['size'] >= 16) {
    size = 4;
  }

  const city_walls = pcity['walls'] ? "wall" : "city";

  let tag = city_rule['graphic'] + "_" + city_walls + "_" + size;
  if (store.sprites[tag] == null) {
    tag = city_rule['graphic_alt'] + "_" + city_walls + "_" + size;
  }

  return { "key": tag, "offset_x": 0, "offset_y": -unit_offset_y };
}

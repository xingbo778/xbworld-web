import { store } from '../data/store';
import { unit_owner, get_unit_homecity_name, unit_can_do_action } from '../data/unit';
import { isExtraRemovedBy as is_extra_removed_by, isExtraCausedBy as is_extra_caused_by, extraOwner as extra_owner } from '../data/extra';
import { tileHasExtra as tile_has_extra } from '../data/tile';
import { indexToTile as index_to_tile } from '../data/map';
import { EXTRA_NONE } from '../data/extra';

import { send_request as sendRequest } from '../net/connection';
import {
  packet_unit_get_actions,
} from '../net/packetConstants';
import {
  ERM_PILLAGE,
  ACTION_PILLAGE,
  ERM_CLEAN,
  ACTION_CLEAN,
  EC_IRRIGATION,
  ACTION_IRRIGATE,
  EC_MINE,
  ACTION_MINE,
  EC_BASE,
  ACTION_BASE,
  EC_ROAD,
  ACTION_ROAD,
} from '../data/fcTypes';

const REQEST_PLAYER_INITIATED = 0;

declare const $: any; // Declare jQuery

/**************************************************************************
  Create a button that selects a target unit.

  Needed because of JavaScript's scoping rules.
**************************************************************************/
export function create_select_tgt_unit_button(parent_id: string, actor_unit_id: number,
  target_tile_id: number, target_unit_id: number): any {
  let text: string = "";
  let button: any = {};

  const target_unit = store.units[target_unit_id];

  text += store.unitTypes[target_unit['type']]['name'];

  if (get_unit_homecity_name(target_unit) != null) {
    text += " from " + get_unit_homecity_name(target_unit);
  }

  text += " (";
  text += store.nations[unit_owner(target_unit)!['nation']]['adjective'];
  text += ")";

  button = {
    text: text,
    click: function () {
      const packet = {
        "pid": packet_unit_get_actions,
        "actor_unit_id": actor_unit_id,
        "target_unit_id": target_unit_id,
        "target_tile_id": target_tile_id,
        "target_extra_id": EXTRA_NONE,
        "request_kind": REQEST_PLAYER_INITIATED,
      };
      sendRequest(JSON.stringify(packet));

      $(parent_id).remove();
    }
  };

  /* The button is ready. */
  return button;
}

/**************************************************************************
  List potential extra targets at target_tile
**************************************************************************/
export function list_potential_target_extras(act_unit: any, target_tile: any): any[] {
  const potential_targets: any[] = [];

  for (let i = 0; i < ((store.rulesControl as any)?.num_extra_types ?? 0); i++) {
    const pextra = store.extras[i];

    if (tile_has_extra(target_tile, pextra.id)) {
      /* This extra is at the tile. Can anything be done to it? */
      if ((is_extra_removed_by(pextra, ERM_PILLAGE)
        && unit_can_do_action(act_unit, ACTION_PILLAGE))
        || (is_extra_removed_by(pextra, ERM_CLEAN)
          && unit_can_do_action(act_unit, ACTION_CLEAN))) {
        /* TODO: Add more extra removal actions as they appear. */
        potential_targets.push(pextra);
      }
    } else {
      /* This extra isn't at the tile yet. Can it be created? */
      if (pextra.buildable
        && ((is_extra_caused_by(pextra, EC_IRRIGATION)
          && unit_can_do_action(act_unit, ACTION_IRRIGATE))
          || (is_extra_caused_by(pextra, EC_MINE)
            && unit_can_do_action(act_unit, ACTION_MINE))
          || (is_extra_caused_by(pextra, EC_BASE)
            && unit_can_do_action(act_unit, ACTION_BASE))
          || (is_extra_caused_by(pextra, EC_ROAD)
            && unit_can_do_action(act_unit, ACTION_ROAD)))) {
        /* TODO: add more extra creation actions as they appear. */
        potential_targets.push(pextra);
      }
    }
  }

  return potential_targets;
}

/**************************************************************************
  Create a button that selects a target extra.

  Needed because of JavaScript's scoping rules.
**************************************************************************/
export function create_select_tgt_extra_button(parent_id: string, actor_unit_id: number,
  target_unit_id: number,
  target_tile_id: number, target_extra_id: number): any {
  let text: string = "";
  let button: any = {};

  const target_tile = index_to_tile(target_tile_id);

  text += store.extras[target_extra_id]['name'];

  text += " (";
  if (tile_has_extra(target_tile, target_extra_id)) {
    if (extra_owner(target_tile) != null) {
      text += store.nations[extra_owner(target_tile)['nation']]['adjective'];
    } else {
      text += "target";
    }
  } else {
    text += "create";
  }
  text += ")";

  button = {
    text: text,
    click: function () {
      const packet = {
        "pid": packet_unit_get_actions,
        "actor_unit_id": actor_unit_id,
        "target_unit_id": target_unit_id,
        "target_tile_id": target_tile_id,
        "target_extra_id": target_extra_id,
        "request_kind": REQEST_PLAYER_INITIATED,
      };
      sendRequest(JSON.stringify(packet));

      $(parent_id).remove();
    }
  };

  /* The button is ready. */
  return button;
}

export function select_tgt_unit(actor_unit: any, target_tile: any, potential_tgt_units: any[]): void {
  // TODO: implement
}
export function select_tgt_extra(actor_unit: any, target_unit: any, target_tile: any, potential_tgt_extras: any[]): void {
  // TODO: implement
}

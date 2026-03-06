/**
 * Unit command functions — key_unit_*, request_unit_*.
 *
 * Extracted from core/control.ts
 */

import { store } from '../../data/store';
import { unit_type, tile_units, get_what_can_unit_pillage_from, Order, UnitSSDataType, ServerSideAgent } from '../../data/unit';
import { indexToTile as index_to_tile, mapstep } from '../../data/map';
import { tileCity as tile_city, tileHasExtra as tile_has_extra, tileHasTerritoryClaimingExtra as tile_has_territory_claiming_extra } from '../../data/tile';
import {
  ACTIVITY_IDLE, ACTIVITY_SENTRY, ACTIVITY_FORTIFYING, ACTIVITY_BASE,
  ACTIVITY_IRRIGATE, ACTIVITY_CULTIVATE, ACTIVITY_CLEAN, ACTIVITY_MINE,
  ACTIVITY_PLANT, ACTIVITY_TRANSFORM, ACTIVITY_GEN_ROAD, ACTIVITY_LAST,
  ACTION_PILLAGE, ACTION_JOIN_CITY, ACTION_HOME_CITY, ACTION_UPGRADE_UNIT,
  ACTION_TRANSPORT_BOARD, ACTION_TRANSPORT_DEBOARD, ACTION_TRANSPORT_UNLOAD,
  ACTION_DISBAND_UNIT_RECOVER, ACTION_DISBAND_UNIT, ACTION_NUKE,
} from '../../data/fcTypes';
import { EXTRA_NONE, BASE_GUI_FORTRESS, BASE_GUI_AIRBASE } from '../../data/extra';
import { ACTION_COUNT } from '../../core/constants';
import {
  sendUnitSscsSet, sendUnitOrders, sendUnitChangeActivity,
  sendUnitServerSideAgentSet, sendUnitDoAction, sendCityNameSuggestionReq,
} from '../../net/commands';
import { message_log } from '../../core/messages';
import { E_BEGINNER_HELP, E_BAD_COMMAND } from '../../data/eventConstants';
import { action_decision_clear_want } from './actionSelection';
import { clientIsObserver, clientPlaying } from '../../client/clientState';
import * as S from './controlState';
// Circular imports — OK, only used inside functions at runtime
import { get_units_in_focus, advance_unit_focus, update_unit_focus, update_active_units_dialog, update_unit_order_commands, set_unit_focus_and_redraw, auto_center_on_focus_unit, find_a_focus_unit_tile_to_center_on } from './unitFocus';
import { activate_goto_last, deactivate_goto } from './mapClick';
import { popup_pillage_selection_dialog } from '../../ui/pillageDialog';
import { unit_move_sound_play } from '../../audio/sounds';

const SSA_AUTOEXPLORE = ServerSideAgent.AUTOEXPLORE;
const SSA_AUTOWORKER = ServerSideAgent.AUTOWORKER;
const SSA_NONE = ServerSideAgent.NONE;

const ORDER_MOVE = Order.MOVE;
const ORDER_ACTION_MOVE = Order.ACTION_MOVE;
const ORDER_PERFORM_ACTION = Order.PERFORM_ACTION;

// EXTRA_HUT is set at runtime by server, read lazily
function EXTRA_HUT(): number { return store.extraIds['EXTRA_HUT'] ?? -1; }

import { swal } from '../../components/Dialogs/SwalDialog';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function observerGuard(): boolean {
  return clientIsObserver();
}

export function key_unit_auto_explore() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    request_unit_ssa_set(funits[i], SSA_AUTOEXPLORE);
  }
  setTimeout(update_unit_focus, 700);
}

export function key_unit_load() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    const ptile = index_to_tile(punit['tile']);
    let transporter_unit_id = 0;

    let has_transport_unit = false;
    const units_on_tile = tile_units(ptile) || [];
    for (let r = 0; r < units_on_tile.length; r++) {
      const tunit = units_on_tile[r];
      if (tunit['id'] == punit['id']) continue;
      const ntype = unit_type(tunit) as any;
      if (ntype != null && ntype['transport_capacity'] > 0) {
        has_transport_unit = true;
        transporter_unit_id = tunit['id'];
      }
    }

    if (has_transport_unit && transporter_unit_id > 0 && punit['tile'] > 0) {
      request_unit_do_action(ACTION_TRANSPORT_BOARD, punit['id'],
        transporter_unit_id);
    }
  }
  setTimeout(advance_unit_focus, 700);
}

export function key_unit_unload() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  if (funits.length === 0) return;
  const last_unit = funits[funits.length - 1];
  const units_on_tile = tile_units(index_to_tile(last_unit['tile'])) || [];

  for (let i = 0; i < units_on_tile.length; i++) {
    const punit = units_on_tile[i];

    if (punit['transported'] && punit['transported_by'] > 0
      && clientPlaying() != null && punit['owner'] == clientPlaying().playerno) {
      request_new_unit_activity(punit, ACTIVITY_IDLE, EXTRA_NONE);
      request_unit_do_action(ACTION_TRANSPORT_DEBOARD, punit['id'],
        punit['transported_by']);
    } else {
      request_new_unit_activity(punit, ACTIVITY_IDLE, EXTRA_NONE);
      request_unit_do_action(ACTION_TRANSPORT_UNLOAD,
        punit['transported_by'],
        punit['id']);
    }
  }
  setTimeout(advance_unit_focus, 700);
}

export function key_unit_show_cargo() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  if (funits.length === 0) return;
  const last_unit = funits[funits.length - 1];
  const units_on_tile = tile_units(index_to_tile(last_unit['tile'])) || [];

  S.setCurrentFocus([]);
  for (let i = 0; i < units_on_tile.length; i++) {
    const punit = units_on_tile[i];
    if (punit['transported'] && punit['transported_by'] > 0) {
      S.current_focus.push(punit);
    }
  }
  update_active_units_dialog();
  update_unit_order_commands();
}

export function key_unit_wait() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    S.waiting_units_list.push(punit['id']);
  }
  advance_unit_focus();
}

export function key_unit_noorders() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    punit['done_moving'] = true;
  }

  advance_unit_focus();
}

function set_focus_units_activity(activity: any, target: any = EXTRA_NONE) {
  if (observerGuard()) return;
  for (const punit of get_units_in_focus()) {
    request_new_unit_activity(punit, activity, target);
  }
  setTimeout(update_unit_focus, 700);
}

export function key_unit_idle() {
  set_focus_units_activity(ACTIVITY_IDLE);
}

export function key_unit_sentry() {
  set_focus_units_activity(ACTIVITY_SENTRY);
}

export function key_unit_fortify() {
  set_focus_units_activity(ACTIVITY_FORTIFYING);
}

export function key_unit_fortress() {
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    const ptile = index_to_tile(punit['tile']);

    for (let b = 0; b < S.bases.length; b++) {
      if (S.bases[b]['base']['gui_type'] == BASE_GUI_FORTRESS
        && !tile_has_extra(ptile, S.bases[b])) {
        request_new_unit_activity(punit, ACTIVITY_BASE, S.bases[b]['id']);
      }
    }
  }

  setTimeout(update_unit_focus, 700);
}

export function key_unit_airbase() {
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    const ptile = index_to_tile(punit['tile']);

    for (let b = 0; b < S.bases.length; b++) {
      if (S.bases[b]['base']['gui_type'] == BASE_GUI_AIRBASE
        && !tile_has_extra(ptile, S.bases[b])) {
        request_new_unit_activity(punit, ACTIVITY_BASE, S.bases[b]['id']);
      }
    }
  }

  setTimeout(update_unit_focus, 700);
}

export function key_unit_irrigate() {
  set_focus_units_activity(ACTIVITY_IRRIGATE);
}

export function key_unit_cultivate() {
  set_focus_units_activity(ACTIVITY_CULTIVATE);
}

export function key_unit_clean() {
  set_focus_units_activity(ACTIVITY_CLEAN);
}

export function key_unit_nuke() {
  if (observerGuard()) return;
  activate_goto_last(ORDER_PERFORM_ACTION, ACTION_NUKE);
}

export function key_unit_upgrade() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    const pcity = tile_city(index_to_tile(punit['tile']));
    const target_id = (pcity != null) ? pcity['id'] : 0;
    request_unit_do_action(ACTION_UPGRADE_UNIT, punit['id'], target_id);
  }
  update_unit_focus();
}

export function key_unit_paradrop() {
  if (observerGuard()) return;
  S.setParadropActive(true);
  message_log.update({
    event: E_BEGINNER_HELP,
    message: "Click on the tile to send this paratrooper to."
  });
}

export function key_unit_airlift() {
  if (observerGuard()) return;
  S.setAirliftActive(true);
  message_log.update({
    event: E_BEGINNER_HELP,
    message: "Click on the city to airlift this unit to."
  });
}

export function key_unit_transform() {
  set_focus_units_activity(ACTIVITY_TRANSFORM);
}

export function key_unit_pillage() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    const tgt = get_what_can_unit_pillage_from(punit, null);
    if (tgt.length > 0) {
      if (tgt.length == 1) {
        request_unit_do_action(ACTION_PILLAGE, punit['id'], punit.tile,
          tgt[0]);
      } else {
        popup_pillage_selection_dialog(punit, tgt);
      }
    }
  }
  setTimeout(update_unit_focus, 700);
}

export function key_unit_mine() {
  set_focus_units_activity(ACTIVITY_MINE);
}

export function key_unit_plant() {
  set_focus_units_activity(ACTIVITY_PLANT);
}

export function key_unit_road() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    const ptile = index_to_tile(punit['tile']);

    for (let r = 0; r < S.roads.length; r++) {
      if (!tile_has_extra(ptile, S.roads[r])) {
        request_new_unit_activity(punit, ACTIVITY_GEN_ROAD, S.roads[r]['id']);
      }
    }
  }

  setTimeout(update_unit_focus, 700);
}

export function key_unit_homecity() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    const ptile = index_to_tile(punit['tile']);
    const pcity = tile_city(ptile);

    if (pcity != null) {
      request_unit_do_action(ACTION_HOME_CITY, punit['id'], pcity['id']);
      const el = document.getElementById('order_change_homecity');
      if (el) el.style.display = 'none';
    }
  }
}

export function key_unit_action_select() {
  if (observerGuard()) return;
  if (S.action_tgt_sel_active) {
    S.setActionTgtSelActive(false);
    request_unit_act_sel_vs_own_tile();
  } else {
    S.setActionTgtSelActive(true);
    message_log.update({
      event: E_BEGINNER_HELP,
      message: "Click on a tile to act against it. "
        + "Press 'd' again to act against own tile."
    });
  }
}

export function request_unit_act_sel_vs(ptile: any) {
  const funits = get_units_in_focus();

  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    sendUnitSscsSet(punit['id'], UnitSSDataType.QUEUE, ptile['index']);
  }
}

export function request_unit_act_sel_vs_own_tile() {
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    sendUnitSscsSet(punit['id'], 0, punit['tile']);
  }
}

export function key_unit_auto_work() {
  if (observerGuard()) return;
  const funits = get_units_in_focus();

  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    request_unit_autoworkers(punit);
  }
  setTimeout(update_unit_focus, 700);
}

export function request_unit_cancel_orders(punit: any) {
  if (punit != null && (punit.ssa_controller != SSA_NONE
    || punit.has_orders)) {
    punit.ssa_controller = SSA_NONE;
    punit.has_orders = false;
    sendUnitOrders({
      unit_id: punit.id,
      src_tile: punit.tile,
      length: 0,
      repeat: false,
      vigilant: false,
      dest_tile: punit.tile,
      orders: [],
    });
  }
}

export function request_new_unit_activity(punit: any, activity: any, target: any) {
  request_unit_cancel_orders(punit);
  action_decision_clear_want(punit['id']);
  sendUnitChangeActivity(punit['id'], activity, target);
}

export function request_unit_ssa_set(punit: any, agent: any) {
  if (punit != null) {
    sendUnitServerSideAgentSet(punit['id'], agent);
  }
}

export function request_unit_autoworkers(punit: any) {
  if (punit != null) {
    request_unit_cancel_orders(punit);
    action_decision_clear_want(punit['id']);
    request_unit_ssa_set(punit, SSA_AUTOWORKER);
  }
}

export function request_unit_build_city() {
  if (observerGuard()) return;
  if (S.current_focus.length > 0) {
    const punit = S.current_focus[0];
    if (punit != null) {

      if (punit['movesleft'] == 0) {
        message_log.update({
          event: E_BAD_COMMAND,
          message: "Unit has no moves left to build city"
        });
        return;
      }

      const ptype = unit_type(punit) as any;
      if (ptype != null && (ptype['name'] == "Settlers" || ptype['name'] == "Engineers")) {
        const target_city = tile_city(index_to_tile(punit['tile']));

        if (target_city == null) {
          sendCityNameSuggestionReq(punit['id']);
        } else {
          request_unit_do_action(ACTION_JOIN_CITY, punit.id, target_city.id);
        }
      }
    }
  }
}

export function request_unit_do_action(action_id: any, actor_id: any, target_id: any, sub_tgt_id: any = 0,
  name: string = "") {
  sendUnitDoAction(action_id, actor_id, target_id, sub_tgt_id || 0, name || "");
  action_decision_clear_want(actor_id);
}

export function key_unit_disband() {
  if (observerGuard()) return;

  swal({
    title: "Disband unit?",
    text: "Do you want to destroy this unit?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, disband unit.",
    closeOnConfirm: true
  },
    function () {
      const funits = get_units_in_focus();
      for (let i = 0; i < funits.length; i++) {
        const punit = funits[i];
        const target_city = tile_city(index_to_tile(punit['tile']));

        const action_id = target_city ? ACTION_DISBAND_UNIT_RECOVER : ACTION_DISBAND_UNIT;
        const target_id = target_city ? target_city['id'] : punit['id'];
        request_unit_do_action(action_id, punit['id'], target_id);
      }
      setTimeout(update_unit_focus, 700);
      setTimeout(update_active_units_dialog, 800);
    });

}

export function key_unit_move(dir: number) {
  if (observerGuard()) return;
  if (S.current_focus.length > 0) {
    const punit = S.current_focus[0];
    if (punit == null) {
      return;
    }

    const ptile = index_to_tile(punit['tile']);
    if (ptile == null) {
      return;
    }

    const newtile = mapstep(ptile, dir);
    if (newtile == null) {
      return;
    }

    const order: any = {
      "order": ORDER_ACTION_MOVE,
      "dir": dir,
      "activity": ACTIVITY_LAST,
      "target": 0,
      "sub_target": 0,
      "action": ACTION_COUNT
    };

    if (punit['transported']
      && clientPlaying() != null
      && newtile['units'].every(function (ounit: any) {
        return ounit['owner'] == clientPlaying()?.playerno;
      })
      && (tile_city(newtile) == null
        || tile_city(newtile)!['owner'] == clientPlaying()?.playerno)
      && !tile_has_extra(newtile, EXTRA_HUT())
      && (newtile['extras_owner'] == clientPlaying().playerno
        || !tile_has_territory_claiming_extra(newtile))) {
      order["order"] = ORDER_MOVE;
    }

    sendUnitOrders({
      unit_id: punit['id'],
      src_tile: ptile['index'],
      length: 1,
      repeat: false,
      vigilant: false,
      orders: [order],
      dest_tile: newtile['index'],
    });
    unit_move_sound_play(punit);
  }

  deactivate_goto(true);
}

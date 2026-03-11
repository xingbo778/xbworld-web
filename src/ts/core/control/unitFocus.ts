/**
 * Unit focus management — tracking which units are selected / active.
 *
 * Extracted from core/control.ts
 * UI panel functions moved to unitPanel.ts
 */

import { store } from '../../data/store';
import type { Unit, Tile } from '../../data/types';
import { cityOwnerPlayerId as city_owner_player_id, cityTile as city_tile } from '../../data/city';
import { unit_type, unit_list_size, unit_list_without } from '../../data/unit';
import { game_find_unit_by_number } from '../../data/game';
import { indexToTile as index_to_tile } from '../../data/map';
import { tileCity as tile_city } from '../../data/tile';
import { tile_units } from '../../data/unit';
import { clientIsObserver as client_is_observer, clientPlaying, clientState as client_state, C_S_RUNNING } from '../../client/clientState';
import {
  ACTIVITY_IDLE,
} from '../../data/fcTypes';
import { EXTRA_NONE } from '../../data/extra';
import { IDENTITY_NUMBER_ZERO } from '../../core/constants';
import { ServerSideAgent } from '../../data/unit';
import { close_city_dialog, active_city } from '../../ui/cityDialog';
import { message_log } from '../../core/messages';
import { E_BEGINNER_HELP } from '../../data/eventConstants';
import { auto_center_on_unit } from '../../ui/options';
import * as S from './controlState';
// Circular imports — OK, only used inside functions
import { should_ask_server_for_actions, can_ask_server_for_actions, action_selection_next_in_focus } from './actionSelection';
import { request_new_unit_activity } from './unitCommands';
import { center_tile_mapcanvas } from './mapClick';

// Re-export UI panel functions so existing importers don't break
export { update_unit_order_commands, init_game_unit_panel, update_active_units_dialog } from './unitPanel';
// Import for local use
import { update_active_units_dialog, update_unit_order_commands } from './unitPanel';

const FC_ACTIVITY_IDLE = ACTIVITY_IDLE;
const FC_SSA_NONE = ServerSideAgent.NONE;
const FC_IDENTITY_NUMBER_ZERO = IDENTITY_NUMBER_ZERO;
const FC_EXTRA_NONE = EXTRA_NONE;

// tile_units is already imported from data/unit — alias for readability
const tile_units_func = tile_units;
// map_city_tile is the same as city_tile
const map_city_tile = city_tile;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function get_focus_unit_on_tile(ptile: Tile): Unit | null {
  const funits = get_units_in_focus();
  if (funits == null) return null;

  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    if (punit['tile'] == ptile['index']) {
      return punit;
    }
  }
  return null;
}

export function unit_is_in_focus(cunit: Unit): boolean {
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    if (punit['id'] == cunit['id']) {
      return true;
    }
  }
  return false;
}

export function get_units_in_focus(): Unit[] {
  return S.current_focus;
}

export function unit_focus_urgent(punit: Unit): void {
  if (punit == null || punit['activity'] == null) {
    console.log("unit_focus_urgent(): not a unit");
    console.log(punit);
    return;
  }

  S.urgent_focus_queue.push(punit);
}

export function control_unit_killed(punit: Unit): void {
  if (S.urgent_focus_queue != null) {
    S.setUrgentFocusQueue(unit_list_without(S.urgent_focus_queue, punit));
  }

  if (unit_is_in_focus(punit)) {
    if (S.current_focus.length == 1) {
      advance_unit_focus();
    } else {
      S.setCurrentFocus(unit_list_without(S.current_focus, punit));
    }

    update_active_units_dialog();
    update_unit_order_commands();
  }
}

export function update_unit_focus(): void {
  if (active_city != null) return;

  if (C_S_RUNNING != client_state()) return;

  if (!can_ask_server_for_actions()) {
    if (get_units_in_focus().length < 1) {
      console.log("update_unit_focus(): action selection dialog open for"
        + " unit %d but unit not in focus?",
        S.action_selection_in_progress_for);
    } else {
      return;
    }
  }

  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];

    if (punit['movesleft'] > 0
      && !punit['done_moving']
      && punit['ssa_controller'] == FC_SSA_NONE
      && punit['activity'] == FC_ACTIVITY_IDLE) {
      return;
    }
  }

  advance_unit_focus();
}

export function advance_unit_focus(): void {
  let candidate: Unit | null = null;
  let i: number;

  if (client_is_observer()) return;

  if (S.urgent_focus_queue.length > 0) {
    const focus_tile = (S.current_focus != null && S.current_focus.length > 0
      ? S.current_focus[0]['tile']
      : -1);

    for (i = 0; i < S.urgent_focus_queue.length; i++) {
      const punit = store.units[S.urgent_focus_queue[i]['id']];

      if ((FC_ACTIVITY_IDLE != punit.activity
        || punit.has_orders)
        && !should_ask_server_for_actions(punit)) {
        S.setUrgentFocusQueue(unit_list_without(S.urgent_focus_queue, punit));
        i--;
      } else if (-1 == focus_tile
        || focus_tile == punit['tile']) {
        candidate = punit;
        break;
      } else if (null == candidate) {
        candidate = punit;
      }
    }

    if (null != candidate) {
      S.setUrgentFocusQueue(unit_list_without(S.urgent_focus_queue, candidate));
    }
  }

  if (candidate == null) {
    candidate = find_best_focus_candidate(false);
  }

  if (candidate == null) {
    candidate = find_best_focus_candidate(true);
  }

  if (candidate != null) {
    set_unit_focus_and_redraw(candidate);
  } else {
    S.setCurrentFocus([]);
    update_active_units_dialog();
    const gameUnitOrdersDefault = document.getElementById('game_unit_orders_default');
    if (gameUnitOrdersDefault) gameUnitOrdersDefault.style.display = 'none';

    if (store.gameInfo && store.gameInfo['turn'] <= 1) {
      for (const city_id_str in store.cities) {
        const city_id = parseInt(city_id_str);
        const pcity = store.cities[city_id];
        if (city_owner_player_id(pcity) == clientPlaying()!.playerno) {
          center_tile_mapcanvas(map_city_tile(pcity));
          break;
        }
      }
    }
    const turnDoneBtn = document.getElementById('turn_done_button');
    if (turnDoneBtn) turnDoneBtn.textContent = '✅ Turn Done';
    if (!S.end_turn_info_message_shown) {
      S.setEndTurnInfoMessageShown(true);
      message_log.update({ event: E_BEGINNER_HELP, message: "All units have moved, click the \"Turn Done\" button to end your turn." });
    }
  }
}

export function find_best_focus_candidate(accept_current: boolean): Unit | null {
  let punit: Unit | undefined;
  let i: number;
  if (client_is_observer()) return null;

  const sorted_units: Unit[] = [];
  for (const unit_id_str in store.units) {
    const unit_id = parseInt(unit_id_str);
    punit = store.units[unit_id];
    if (clientPlaying() != null && punit['owner'] == clientPlaying()!.playerno) {
      sorted_units.push(punit);
    }
  }
  sorted_units.sort(unit_distance_compare);

  for (i = 0; i < sorted_units.length; i++) {
    punit = sorted_units[i];
    if ((!unit_is_in_focus(punit) || accept_current)
      && clientPlaying() != null
      && punit['owner'] == clientPlaying()!.playerno
      && ((punit['activity'] == FC_ACTIVITY_IDLE
        && !punit['done_moving']
        && punit['movesleft'] > 0)
        || should_ask_server_for_actions(punit))
      && punit['ssa_controller'] == FC_SSA_NONE
      && S.waiting_units_list.indexOf(punit['id']) < 0
      && !punit['transported']) {
      return punit;
    }
  }

  for (i = 0; i < S.waiting_units_list.length; i++) {
    punit = game_find_unit_by_number(S.waiting_units_list[i]);
    if (punit != null && punit['movesleft'] > 0) {
      S.waiting_units_list.splice(i, 1);
      return punit;
    }
  }

  return null;
}

export function unit_distance_compare(unit_a: Unit, unit_b: Unit): number {
  if (unit_a == null || unit_b == null) return 0;
  const ptile_a = index_to_tile(unit_a['tile']);
  const ptile_b = index_to_tile(unit_b['tile']);

  if (ptile_a == null || ptile_b == null) return 0;

  if (ptile_a['x'] == ptile_b['x'] && ptile_a['y'] == ptile_b['y']) {
    return 0;
  } else if (ptile_a['x'] > ptile_b['x'] || ptile_a['y'] > ptile_b['y']) {
    return 1;
  } else {
    return -1;
  }
}

export function set_unit_focus(punit: Unit | null): void {
  S.setCurrentFocus([]);
  if (punit == null) {
    S.setCurrentFocus([]);
  } else {
    S.current_focus[0] = punit;
    action_selection_next_in_focus(FC_IDENTITY_NUMBER_ZERO);
  }
  update_active_units_dialog();
  update_unit_order_commands();
}

export function set_unit_focus_and_redraw(punit: Unit | null): void {
  S.setCurrentFocus([]);

  if (punit == null) {
    S.setCurrentFocus([]);
  } else {
    S.current_focus[0] = punit;
    action_selection_next_in_focus(FC_IDENTITY_NUMBER_ZERO);
  }

  auto_center_on_focus_unit();
  update_active_units_dialog();
  update_unit_order_commands();
  const ordersDefault = document.getElementById('game_unit_orders_default');
  if (S.current_focus.length > 0 && ordersDefault) ordersDefault.style.display = '';
}

export function set_unit_focus_and_activate(punit: Unit): void {
  set_unit_focus_and_redraw(punit);
  request_new_unit_activity(punit, FC_ACTIVITY_IDLE, FC_EXTRA_NONE);
}

export function city_dialog_activate_unit(punit: Unit): void {
  request_new_unit_activity(punit, FC_ACTIVITY_IDLE, FC_EXTRA_NONE);
  close_city_dialog();
  set_unit_focus_and_redraw(punit);
}

export function auto_center_on_focus_unit(): void {
  if (active_city != null) return;

  const ptile = find_a_focus_unit_tile_to_center_on();

  if (ptile != null && auto_center_on_unit) {
    center_tile_mapcanvas(ptile);
    // update_unit_position was a legacy 3D renderer function — removed
  }
}

export function find_a_focus_unit_tile_to_center_on(): Tile | undefined | null {
  const funit = S.current_focus[0];

  if (funit == null) return null;

  return index_to_tile(funit['tile']);
}

export function find_visible_unit(ptile: Tile | null): Unit | null {
  let i: number;

  if (ptile == null || unit_list_size(tile_units_func(ptile)) == 0) {
    return null;
  }

  const pfocus = get_focus_unit_on_tile(ptile);
  if (pfocus != null) {
    return pfocus;
  }

  if (tile_city(ptile) != null) {
    return null;
  }

  const vunits = tile_units_func(ptile) || [];
  for (i = 0; i < vunits.length; i++) {
    const aunit = vunits[i];
    if (aunit['anim_list'] != null && (aunit['anim_list'] as unknown[]).length > 0) {
      return aunit;
    }
  }

  for (i = 0; i < vunits.length; i++) {
    const tunit = vunits[i];
    if (!tunit['transported']) {
      return tunit;
    }
  }

  return (tile_units_func(ptile) || [])[0];
}

export function get_drawable_unit(ptile: Tile | null, citymode: boolean): Unit | null {
  const punit = find_visible_unit(ptile);

  if (punit == null) return null;

  if (!unit_is_in_focus(punit) || S.current_focus.length > 0) {
    return punit;
  } else {
    return null;
  }
}

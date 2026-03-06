/**
 * Unit packet handlers.
 */
import { store } from '../../data/store';
import { sendUnitGetActions } from '../commands';
import {
  ACTION_ATTACK, ACTION_SUICIDE_ATTACK,
  ACTION_NUKE_UNITS, ACTION_NUKE_CITY, ACTION_NUKE,
  ACTION_SPY_BRIBE_UNIT, ACTION_SPY_INCITE_CITY, ACTION_SPY_INCITE_CITY_ESC,
  ACTION_UPGRADE_UNIT, ACTION_COUNT,
} from '../../data/fcTypes';
import { tileCity } from '../../data/tile';
import { actionProbPossible } from '../../data/actions';
import { EXTRA_NONE } from '../../data/extra';
import { IDENTITY_NUMBER_ZERO } from '../../core/constants';
import { setClientState } from '../../client/clientMain';
import { indexToTile } from '../../data/map';
import { extraByNumber } from '../../data/extra';
import {
  unit_owner, client_remove_unit, update_tile_unit, clear_tile_unit,
  unit_type, update_unit_anim_list, is_unit_visible,
} from '../../data/unit';
import { utype_can_do_action } from '../../data/unittype';
import { mark_tile_dirty } from '../../renderer/mapviewCommon';
import { explosion_anim_map } from '../../renderer/tilespec';
import { game_find_unit_by_number, game_find_city_by_number } from '../../data/game';
import { player_find_unit_by_id } from '../../data/player';
import {
  should_ask_server_for_actions,
  action_selection_no_longer_in_progress,
  action_decision_clear_want,
  action_selection_next_in_focus,
  action_decision_request,
} from '../../core/control/actionSelection';
import {
  update_unit_focus, update_unit_order_commands,
  update_active_units_dialog,
} from '../../core/control/unitFocus';
import { request_unit_do_action } from '../../core/control/unitCommands';
import { current_focus, action_selection_in_progress_for } from '../../core/control/controlState';
import {
  act_sel_queue_done, popup_action_selection, popup_bribe_dialog,
  popup_incite_dialog, popup_unit_upgrade_dlg,
  action_selection_refresh, action_selection_close,
} from '../../ui/actionDialog';

const auto_attack_actions = [
  ACTION_ATTACK, ACTION_SUICIDE_ATTACK,
  ACTION_NUKE_UNITS, ACTION_NUKE_CITY, ACTION_NUKE
];
const REQEST_PLAYER_INITIATED = 0;
const REQEST_BACKGROUND_REFRESH = 1;
const REQEST_BACKGROUND_FAST_AUTO_ATTACK = 2;

export function handle_unit_remove(packet: any): void {
  const punit = game_find_unit_by_number(packet['unit_id']);
  if (punit == null) return;

  if (typeof mark_tile_dirty === 'function' && punit['tile'] != null) {
    mark_tile_dirty(punit['tile']);
  }

  if (action_selection_in_progress_for === punit.id) {
    action_selection_close();
    action_selection_next_in_focus(punit.id);
  }

  clear_tile_unit(punit);
  client_remove_unit(punit);
}

export function handle_unit_info(packet: any): void {
  if (typeof mark_tile_dirty === 'function' && packet['tile'] != null) {
    mark_tile_dirty(packet['tile']);
    const old_unit = store.units[packet['id']];
    if (old_unit != null && old_unit['tile'] !== packet['tile']) {
      mark_tile_dirty(old_unit['tile']);
    }
  }
  handle_unit_packet_common(packet);
}

export function handle_unit_short_info(packet: any): void {
  if (typeof mark_tile_dirty === 'function' && packet['tile'] != null) {
    mark_tile_dirty(packet['tile']);
    const old_unit = store.units[packet['id']];
    if (old_unit != null && old_unit['tile'] !== packet['tile']) {
      mark_tile_dirty(old_unit['tile']);
    }
  }
  handle_unit_packet_common(packet);
}

export function action_decision_handle(punit: any): void {
  for (let a = 0; a < auto_attack_actions.length; a++) {
    const action = auto_attack_actions[a];
    if (utype_can_do_action(unit_type(punit), action) && store.autoAttack) {
      sendUnitGetActions(
        punit['id'], IDENTITY_NUMBER_ZERO,
        punit['action_decision_tile'], EXTRA_NONE,
        REQEST_BACKGROUND_FAST_AUTO_ATTACK
      );
      return;
    }
  }
  action_decision_request(punit);
}

export function action_decision_maybe_auto(
  actor_unit: any, action_probabilities: any,
  target_tile: any, target_extra: any,
  target_unit: any, _target_city: any
): void {
  for (let a = 0; a < auto_attack_actions.length; a++) {
    const action = auto_attack_actions[a];
    if (actionProbPossible(action_probabilities[action]) && store.autoAttack) {
      let target = target_tile['index'];
      if (action === ACTION_NUKE_CITY) {
        const tc = tileCity(target_tile);
        if (!tc) continue;
        target = tc['id'];
      }
      request_unit_do_action(action, actor_unit['id'], target);
      return;
    }
  }
  action_decision_request(actor_unit);
}

export function update_client_state(value: any): void {
  setClientState(value);
}

export function handle_unit_packet_common(packet_unit: any): void {
  const punit = player_find_unit_by_id(
    unit_owner(packet_unit) as any, packet_unit['id']
  );

  if (typeof clear_tile_unit === 'function') {
    clear_tile_unit(punit);
  }

  if (punit == null && game_find_unit_by_number(packet_unit['id']) != null) {
    handle_unit_remove(packet_unit['id']);
  }

  let old_tile: any = null;
  if (punit != null) old_tile = indexToTile(punit['tile']);

  if (store.units[packet_unit['id']] == null) {
    if (should_ask_server_for_actions(packet_unit)) {
      action_decision_handle(packet_unit);
    }
    packet_unit['anim_list'] = [];
    store.units[packet_unit['id']] = packet_unit;
    store.units[packet_unit['id']]['facing'] = 6;
  } else {
    if (punit != null && (punit['action_decision_want'] !== packet_unit['action_decision_want']
         || punit['action_decision_tile'] !== packet_unit['action_decision_tile'])
        && should_ask_server_for_actions(packet_unit)) {
      action_decision_handle(packet_unit);
    }
    if (typeof update_unit_anim_list === 'function') {
      update_unit_anim_list(store.units[packet_unit['id']], packet_unit);
    }
    Object.assign(store.units[packet_unit['id']], packet_unit);
    if (current_focus != null) {
      for (let i = 0; i < current_focus.length; i++) {
        if (current_focus[i]['id'] === packet_unit['id']) {
          Object.assign(current_focus[i], packet_unit);
        }
      }
    }
  }

  update_tile_unit(store.units[packet_unit['id']]);

  if (current_focus != null && current_focus.length > 0
      && current_focus[0]['id'] === packet_unit['id']) {
    update_active_units_dialog();
    update_unit_order_commands();

    if (current_focus[0]['done_moving'] !== packet_unit['done_moving']) {
      update_unit_focus();
    }
  }
}

export function handle_unit_combat_info(packet: any): void {
  const attacker = store.units[packet['attacker_unit_id']];
  const defender = store.units[packet['defender_unit_id']];
  const attacker_hp = packet['attacker_hp'];
  const defender_hp = packet['defender_hp'];

  if (attacker_hp === 0 && is_unit_visible(attacker)) {
    explosion_anim_map[attacker['tile']] = 25;
  }
  if (defender_hp === 0 && is_unit_visible(defender)) {
    explosion_anim_map[defender['tile']] = 25;
  }
}

export function handle_unit_action_answer(packet: any): void {
  const diplomat_id = packet['actor_id'];
  const target_id = packet['target_id'];
  const cost = packet['cost'];
  const action_type = packet['action_type'];

  const target_city = game_find_city_by_number(target_id);
  const target_unit = game_find_unit_by_number(target_id);
  const actor_unit = game_find_unit_by_number(diplomat_id);

  if (actor_unit == null) {
    console.log('Bad actor unit (' + diplomat_id + ') in unit action answer.');
    act_sel_queue_done(diplomat_id);
    return;
  }

  if (packet['request_kind'] !== REQEST_PLAYER_INITIATED) {
    console.log('handle_unit_action_answer(): was asked to not disturb the player. Unimplemented.');
  }

  if (action_type === ACTION_SPY_BRIBE_UNIT) {
    if (target_unit == null) {
      console.log('Bad target unit (' + target_id + ') in unit action answer.');
      act_sel_queue_done(diplomat_id);
    } else {
      popup_bribe_dialog(actor_unit, target_unit, cost, action_type);
    }
    return;
  } else if (action_type === ACTION_SPY_INCITE_CITY
             || action_type === ACTION_SPY_INCITE_CITY_ESC) {
    if (target_city == null) {
      console.log('Bad target city (' + target_id + ') in unit action answer.');
      act_sel_queue_done(diplomat_id);
    } else {
      popup_incite_dialog(actor_unit, target_city, cost, action_type);
    }
    return;
  } else if (action_type === ACTION_UPGRADE_UNIT) {
    if (target_city == null) {
      console.log('Bad target city (' + target_id + ') in unit action answer.');
      act_sel_queue_done(diplomat_id);
    } else {
      popup_unit_upgrade_dlg(actor_unit, target_city, cost, action_type);
    }
    return;
  } else if (action_type === ACTION_COUNT) {
    console.log('unit_action_answer: Server refused to respond.');
  } else {
    console.log('unit_action_answer: Invalid answer.');
  }
  act_sel_queue_done(diplomat_id);
}

export function handle_unit_actions(packet: any): void {
  const actor_unit_id = packet['actor_unit_id'];
  const target_unit_id = packet['target_unit_id'];
  const target_city_id = packet['target_city_id'];
  const target_tile_id = packet['target_tile_id'];
  const target_extra_id = packet['target_extra_id'];
  const action_probabilities = packet['action_probabilities'];

  const pdiplomat = game_find_unit_by_number(actor_unit_id);
  const target_unit = game_find_unit_by_number(target_unit_id);
  const target_city = game_find_city_by_number(target_city_id);
  const ptile = indexToTile(target_tile_id);
  const target_extra = extraByNumber(target_extra_id);

  let hasActions = false;

  if (pdiplomat != null && ptile != null) {
    action_probabilities.forEach(function(prob: any) {
      if (actionProbPossible(prob)) {
        hasActions = true;
      }
    });
  }

  switch (packet['request_kind']) {
  case REQEST_PLAYER_INITIATED:
    if (hasActions) {
      popup_action_selection(pdiplomat!, action_probabilities,
                               ptile, target_extra, target_unit ?? null, target_city ?? null);
    } else {
      action_selection_no_longer_in_progress(actor_unit_id);
      action_decision_clear_want(actor_unit_id);
      action_selection_next_in_focus(actor_unit_id);
    }
    break;
  case REQEST_BACKGROUND_REFRESH:
    action_selection_refresh(pdiplomat!,
                               target_city ?? null, target_unit ?? null, ptile ?? null,
                               target_extra,
                               action_probabilities);
    break;
  case REQEST_BACKGROUND_FAST_AUTO_ATTACK:
    action_decision_maybe_auto(pdiplomat, action_probabilities,
                                 ptile, target_extra,
                                 target_unit, target_city);
    break;
  default:
    console.log('handle_unit_actions(): unrecognized request_kind %d',
                packet['request_kind']);
    break;
  }
}

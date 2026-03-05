/**
 * Packet handler migrations from packhand.js — COMPLETE replacement.
 *
 * Phase 5: All 135 handle_* functions from packhand.js are now in TypeScript.
 * This file also contains the PacketRouter (packet_hand_table + client_handle_packet).
 *
 * Handler categories:
 *   - Pure data: simple assignment to globals, no side effects
 *   - With UI calls: calls update_*, show_*, swal, etc. via (window as any)
 *   - With jQuery: uses $() — replaced with native DOM
 *
 * Module-local state (previously in packhand.js):
 *   - terrain_control, roads[], bases[], page_msg{}
 */

import { packet_client_info, packet_conn_pong, packet_unit_get_actions } from './packetConstants';
import { send_request, clinet_debug_collect } from './connection';
import {
  GUI_WEB,
  ACTION_ATTACK, ACTION_SUICIDE_ATTACK,
  ACTION_NUKE_UNITS, ACTION_NUKE_CITY, ACTION_NUKE,
  ACTION_SPY_BRIBE_UNIT, ACTION_SPY_INCITE_CITY, ACTION_SPY_INCITE_CITY_ESC,
  ACTION_UPGRADE_UNIT, ACTION_COUNT,
  VUT_ADVANCE, REQ_RANGE_PLAYER,
  EC_BASE, EC_ROAD,
} from '../data/fcTypes';
import { TECH_KNOWN, A_NONE } from '../data/tech';
import { EXTRA_NONE, isExtraCausedBy } from '../data/extra';
import { IDENTITY_NUMBER_ZERO, RENDERER_2DCANVAS } from '../core/constants';
import { E_SCRIPT, E_UNDEFINED } from '../data/eventConstants';
import { store } from '../data/store';
import { mapInitTopology, mapAllocate } from '../data/map';
import { BitVector } from '../utils/bitvector';
import { stringUnqualify } from '../utils/helpers';
import { freelog } from '../core/log';
import { C_S_RUNNING, C_S_PREPARING, C_S_OVER, clientState, clientIsObserver } from '../client/clientState';
import { setClientState as set_client_state } from '../client/clientMain';
import { setPhaseStart, requestObserveGame } from '../client/clientCore';
import { set_client_page, get_client_page, PAGE_MAIN, PAGE_NETWORK, PAGE_START } from '../core/pages';
import { valid_player_by_number, player_find_unit_by_id } from '../data/player';
import { game_find_city_by_number, game_find_unit_by_number, update_game_status_panel } from '../data/game';
import {
  unit_owner, client_remove_unit, update_tile_unit, clear_tile_unit,
  unit_type, update_unit_anim_list, reset_unit_anim_list, is_unit_visible,
} from '../data/unit';
import { utype_can_do_action } from '../data/unittype';
import { improvements_init } from '../data/improvement';
import { mark_tile_dirty, mark_all_dirty, mapdeco_init, update_map_canvas_check } from '../renderer/mapviewCommon';
import { assign_nation_color } from '../renderer/tilespec';
import { play_sound } from '../audio/sounds';
import { add_chatbox_text, chatbox_clip_messages, wait_for_text } from '../core/messages';
import { update_player_info_pregame, update_game_info_pregame } from '../core/pregame';
import {
  should_ask_server_for_actions,
  action_selection_no_longer_in_progress,
  action_decision_clear_want,
  action_selection_next_in_focus,
  action_decision_request,
} from '../core/control/actionSelection';
import {
  get_units_in_focus, update_unit_focus, update_unit_order_commands,
  auto_center_on_focus_unit, update_active_units_dialog,
} from '../core/control/unitFocus';
import { request_unit_do_action } from '../core/control/unitCommands';
import { update_goto_path } from '../core/control/mapClick';
import { update_net_income } from '../ui/rates';
import { show_city_dialog_by_id, city_name_dialog } from '../ui/cityDialog';
import { update_tech_screen, queue_tech_gained_dialog } from '../ui/techDialog';
import {
  show_diplomacy_dialog, accept_treaty, cancel_meeting,
  discard_diplomacy_dialogs, show_diplomacy_clauses, remove_clause,
} from '../ui/diplomacy';
import {
  act_sel_queue_done, popup_action_selection, popup_bribe_dialog,
  popup_incite_dialog, popup_unit_upgrade_dlg, popup_sabotage_dialog,
  action_selection_actor_unit, action_selection_target_city,
  action_selection_target_unit, action_selection_target_tile,
  action_selection_target_extra, action_selection_refresh,
  action_selection_close,
} from '../ui/actionDialog';

// ============================================================================
// Module-local state (was var in packhand.js)
// ============================================================================
export let terrain_control: any = {};
let roads: any[] = [];
let bases: any[] = [];
let page_msg: any = {};

// Also expose these so legacy JS can access them
// Constants (were const in packhand.js)
const auto_attack_actions = [
  ACTION_ATTACK, ACTION_SUICIDE_ATTACK,
  ACTION_NUKE_UNITS, ACTION_NUKE_CITY, ACTION_NUKE
];
const REQEST_PLAYER_INITIATED = 0;
const REQEST_BACKGROUND_REFRESH = 1;
const REQEST_BACKGROUND_FAST_AUTO_ATTACK = 2;

// ============================================================================
// Batch 1: Freeze/thaw handlers
// ============================================================================

export function handle_processing_started(_packet: any): void {
  (window as any).client_frozen = true;
}

export function handle_processing_finished(_packet: any): void {
  (window as any).client_frozen = false;
}

export function handle_investigate_started(_packet: any): void { /* no-op */ }
export function handle_investigate_finished(_packet: any): void { /* no-op */ }

export function handle_freeze_hint(_packet: any): void {
  (window as any).client_frozen = true;
}

export function handle_thaw_hint(_packet: any): void {
  (window as any).client_frozen = false;
}

export function handle_freeze_client(_packet: any): void {
  (window as any).client_frozen = true;
}

export function handle_thaw_client(_packet: any): void {
  (window as any).client_frozen = false;
}

// ============================================================================
// Batch 2: Pure data assignment — ruleset handlers
// ============================================================================

export function handle_ruleset_terrain(packet: any): void {
  if (packet['name'] === 'Lake') packet['graphic_str'] = packet['graphic_alt'];
  if (packet['name'] === 'Glacier') packet['graphic_str'] = 'tundra';
  store.terrains[packet['id']] = packet;
}

export function handle_ruleset_resource(packet: any): void {
  (window as any).resources[packet['id']] = packet;
}

export function handle_ruleset_game(packet: any): void {
  (window as any).game_rules = packet;
}

export function handle_ruleset_specialist(packet: any): void {
  (window as any).specialists[packet['id']] = packet;
}

export function handle_ruleset_nation_groups(packet: any): void {
  (window as any).nation_groups = packet['groups'];
}

export function handle_ruleset_nation(packet: any): void {
  store.nations[packet['id']] = packet;
}

export function handle_ruleset_city(packet: any): void {
  (window as any).city_rules[packet['style_id']] = packet;
}

export function handle_ruleset_government(packet: any): void {
  store.governments[packet['id']] = packet;
}

export function handle_ruleset_summary(packet: any): void {
  (window as any).ruleset_summary = packet['text'];
}

export function handle_ruleset_description_part(packet: any): void {
  if ((window as any).ruleset_description == null) {
    (window as any).ruleset_description = packet['text'];
  } else {
    (window as any).ruleset_description += packet['text'];
  }
}

export function handle_ruleset_action(packet: any): void {
  (window as any).actions[packet['id']] = packet;
  packet['enablers'] = [];
}

export function handle_ruleset_goods(packet: any): void {
  (window as any).goods[packet['id']] = packet;
}

export function handle_ruleset_clause(packet: any): void {
  (window as any).clause_infos[packet['type']] = packet;
}

export function handle_game_info(packet: any): void {
  store.gameInfo = packet;

  // When joining an already-running game (turn > 0), the server does NOT send
  // start_phase (pid 126).  Detect this case and force-transition to C_S_RUNNING
  // so the game page is displayed.
  if (
    packet.turn > 0 &&
    typeof clientState === 'function' &&
    clientState() !== C_S_RUNNING
  ) {
    // Defer slightly so that remaining init packets (players, tiles) arrive first.
    setTimeout(() => {
      if (clientState() !== C_S_RUNNING) {
        (window as any).observing = true;
        set_client_state(C_S_RUNNING);
      }
    }, 2000);
  }
}

export function handle_calendar_info(packet: any): void {
  store.calendarInfo = packet;
}

export function handle_spaceship_info(_packet: any): void {
  // spaceship/spacerace feature removed
}

export function handle_ruleset_effect(packet: any): void {
  if ((window as any).effects[packet['effect_type']] == null) {
    (window as any).effects[packet['effect_type']] = [];
  }
  (window as any).effects[packet['effect_type']].push(packet);
}

export function handle_new_year(packet: any): void {
  store.gameInfo['year'] = packet['year'];
  store.gameInfo['fragments'] = packet['fragments'];
  store.gameInfo['turn'] = packet['turn'];
}

export function handle_timeout_info(packet: any): void {
  (window as any).last_turn_change_time = Math.ceil(packet['last_turn_change_time']);
  (window as any).seconds_to_phasedone = Math.floor(packet['seconds_to_phasedone']);
  (window as any).seconds_to_phasedone_sync = new Date().getTime();
}

export function handle_trade_route_info(packet: any): void {
  if ((window as any).city_trade_routes[packet['city']] == null) {
    (window as any).city_trade_routes[packet['city']] = {};
  }
  (window as any).city_trade_routes[packet['city']][packet['index']] = packet;
}

export function handle_endgame_player(packet: any): void {
  (window as any).endgame_player_info.push(packet);
}

export function handle_unknown_research(packet: any): void {
  delete (window as any).research_data[packet['id']];
}

// ============================================================================
// Batch 3: Ruleset handlers with logic
// ============================================================================

export function handle_ruleset_unit(packet: any): void {
  if (packet['name'] != null && packet['name'].indexOf('?unit:') === 0) {
    packet['name'] = packet['name'].replace('?unit:', '');
  }
  packet['flags'] = new BitVector(packet['flags']);
  store.unitTypes[packet['id']] = packet;
}

export function handle_web_ruleset_unit_addition(packet: any): void {
  // Convert utype_actions array to BitVector (matches legacy webclient.min.js behaviour)
  if (packet['utype_actions'] != null) {
    packet['utype_actions'] = new BitVector(packet['utype_actions']);
  }
  if (store.unitTypes[packet['id']] != null) {
    Object.assign(store.unitTypes[packet['id']], packet);
  }
}

/**
 * Recreate the old req[] field of ruleset_tech packets.
 * This makes it possible to delay research_reqs support.
 */
export function recreate_old_tech_req(packet: any): void {
  packet['req'] = [];
  if (packet['research_reqs']) {
    for (let i = 0; i < packet['research_reqs'].length; i++) {
      const requirement = packet['research_reqs'][i];
      if (requirement.kind === VUT_ADVANCE
          && requirement.range === REQ_RANGE_PLAYER
          && requirement.present) {
        packet['req'].push(requirement.value);
      }
    }
  }
  // Fill in A_NONE just in case XBWorld assumes its size is 2.
  while (packet['req'].length < 2) {
    packet['req'].push(A_NONE ?? 0);
  }
}

export function handle_ruleset_tech(packet: any): void {
  if (packet['name'] != null && packet['name'].indexOf('?tech:') === 0) {
    packet['name'] = packet['name'].replace('?tech:', '');
  }
  store.techs[packet['id']] = packet;
  recreate_old_tech_req(packet);
}

export function handle_ruleset_tech_class(_packet: any): void { /* TODO */ }
export function handle_ruleset_tech_flag(_packet: any): void { /* TODO */ }

export function handle_ruleset_terrain_control(packet: any): void {
  terrain_control = packet;
  (window as any).terrain_control = packet;
  (window as any).SINGLE_MOVE = packet['move_fragments'];
}

export function handle_ruleset_building(packet: any): void {
  store.improvements[packet['id']] = packet;
}

export function handle_ruleset_unit_class(packet: any): void {
  packet['flags'] = new BitVector(packet['flags']);
  (window as any).unit_classes[packet['id']] = packet;
}

export function handle_ruleset_disaster(_packet: any): void { /* TODO */ }
export function handle_ruleset_trade(_packet: any): void { /* TODO */ }
export function handle_rulesets_ready(_packet: any): void { /* TODO */ }
export function handle_ruleset_choices(_packet: any): void { /* TODO */ }
export function handle_game_load(_packet: any): void { /* TODO */ }
export function handle_ruleset_unit_flag(_packet: any): void { /* TODO */ }
export function handle_ruleset_unit_class_flag(_packet: any): void { /* TODO */ }
export function handle_ruleset_unit_bonus(_packet: any): void { /* TODO */ }
export function handle_ruleset_terrain_flag(_packet: any): void { /* TODO */ }
export function handle_ruleset_impr_flag(_packet: any): void { /* TODO */ }
export function handle_ruleset_government_ruler_title(_packet: any): void { /* TODO */ }

export function handle_ruleset_base(packet: any): void {
  for (let i = 0; i < store.rulesControl['num_extra_types']; i++) {
    if (isExtraCausedBy(store.extras[i], EC_BASE)
        && store.extras[i]['base'] == null) {
      store.extras[i]['base'] = packet;
      (store.extras as any)[store.extras[i]['rule_name']]['base'] = packet;
      return;
    }
  }
  console.log("Didn't find Extra to put Base on");
  console.log(packet);
}

export function handle_ruleset_road(packet: any): void {
  for (let i = 0; i < store.rulesControl['num_extra_types']; i++) {
    if (isExtraCausedBy(store.extras[i], EC_ROAD)
        && store.extras[i]['road'] == null) {
      store.extras[i]['road'] = packet;
      (store.extras as any)[store.extras[i]['rule_name']]['road'] = packet;
      return;
    }
  }
  console.log("Didn't find Extra to put Road on");
  console.log(packet);
}

export function handle_ruleset_action_enabler(packet: any): void {
  const paction = (window as any).actions[packet.enabled_action];
  if (paction === undefined) {
    console.log("Unknown action " + packet.action + " for enabler ");
    console.log(packet);
    return;
  }
  paction.enablers.push(packet);
}

export function handle_ruleset_extra(packet: any): void {
  packet['causes'] = new BitVector(packet['causes']);
  packet['rmcauses'] = new BitVector(packet['rmcauses']);
  packet['name'] = stringUnqualify(packet['name']);
  store.extras[packet['id']] = packet;
  (store.extras as any)[packet['rule_name']] = packet;

  if (isExtraCausedBy(packet, EC_ROAD) && packet['buildable']) {
    roads.push(packet);
  }
  if (isExtraCausedBy(packet, EC_BASE) && packet['buildable']) {
    bases.push(packet);
  }

  if (packet['rule_name'] === 'Railroad') (window as any)['EXTRA_RAIL'] = packet['id'];
  else if (packet['rule_name'] === 'Oil Well') (window as any)['EXTRA_OIL_WELL'] = packet['id'];
  else (window as any)['EXTRA_' + packet['rule_name'].toUpperCase()] = packet['id'];
}

export function handle_ruleset_counter(_packet: any): void { /* TODO */ }
export function handle_ruleset_extra_flag(_packet: any): void { /* TODO */ }
export function handle_ruleset_nation_sets(_packet: any): void { /* TODO */ }
export function handle_ruleset_style(_packet: any): void { /* TODO */ }
export function handle_nation_availability(_packet: any): void { /* TODO */ }
export function handle_ruleset_music(_packet: any): void { /* TODO */ }
export function handle_ruleset_multiplier(_packet: any): void { /* TODO */ }
export function handle_ruleset_action_auto(_packet: any): void { /* TODO */ }
export function handle_ruleset_achievement(_packet: any): void { /* TODO */ }
export function handle_achievement_info(_packet: any): void { /* TODO */ }
export function handle_team_name_info(_packet: any): void { /* TODO */ }
export function handle_popup_image(_packet: any): void { /* TODO */ }
export function handle_worker_task(_packet: any): void { /* TODO */ }
export function handle_play_music(_packet: any): void { /* TODO */ }

// ============================================================================
// Batch 4: Handlers with UI calls (call legacy UI functions via window)
// ============================================================================

export function handle_server_join_reply(packet: any): void {
  if (packet['you_can_join']) {
    store.client.conn.established = true;
    store.client.conn.id = packet['conn_id'];

    if (get_client_page() === PAGE_MAIN
        || get_client_page() === PAGE_NETWORK) {
      set_client_page(PAGE_START);
    }

    const client_info = {
      'pid': packet_client_info,
      'gui': GUI_WEB,
      'emerg_version': 0,
      'distribution': ''
    };
    send_request(JSON.stringify(client_info));
    set_client_state(C_S_PREPARING);

    const urlAction = (window as any).$.getUrlVar('action');
    const urlRuleset = (window as any).$.getUrlVar('ruleset');
    if ((urlAction === 'new' || urlAction === 'hack') && urlRuleset != null) {
      (window as any).change_ruleset(urlRuleset);
    }

    if ((window as any).autostart) {
      if ((window as any).loadTimerId === -1) {
        wait_for_text('You are logged in as', (window as any).pregame_start_game);
      } else {
        wait_for_text('Load complete', (window as any).pregame_start_game);
      }
    } else if ((window as any).observing) {
      wait_for_text('You are logged in as', requestObserveGame);
    }
  } else {
    (window as any).swal('You were rejected from the game.', (packet['message'] || ''), 'error');
    store.client.conn.id = -1;
    set_client_page(PAGE_MAIN);
  }
}

export function handle_conn_info(packet: any): void {
  let pconn = find_conn_by_id(packet['id']);

  if (packet['used'] === false) {
    if (pconn == null) {
      freelog((window as any).LOG_VERBOSE, 'Server removed unknown connection ' + packet['id']);
      return;
    }
    client_remove_cli_conn(pconn);
    pconn = null;
  } else {
    const pplayer = valid_player_by_number(packet['player_num']);
    packet['playing'] = pplayer;

    if (packet['id'] === store.client.conn.id) {
      if (store.client.conn.player_num == null
          || store.client.conn.player_num !== packet['player_num']) {
        discard_diplomacy_dialogs();
      }
      store.client.conn = packet;
    }
    conn_list_append(packet);
  }

  if (packet['id'] === store.client.conn.id) {
    if (store.client.conn.playing !== packet['playing']) {
      set_client_state(C_S_PREPARING);
    }
  }
}

export function handle_tile_info(packet: any): void {
  if (store.tiles != null) {
    packet['extras'] = new BitVector(packet['extras']);

    Object.assign(store.tiles[packet['tile']], packet);

    if (typeof mark_tile_dirty === 'function') {
      mark_tile_dirty(packet['tile']);
    }
  }
}

export function handle_chat_msg(packet: any): void {
  let message = packet['message'];
  const conn_id = packet['conn_id'];
  const event = packet['event'];
  const ptile = packet['tile'];

  if (message == null) return;
  if (event == null || event < 0 || event >= E_UNDEFINED) {
    console.log('Undefined message event type');
    console.log(packet);
    packet['event'] = E_UNDEFINED;
  }

  if (store.connections[conn_id] != null) {
    if (!(window as any).is_longturn()) {
      message = '<b>' + store.connections[conn_id]['username'] + ':</b>' + message;
    }
  } else if (packet['event'] === E_SCRIPT) {
    const regxp = /\n/gi;
    message = message.replace(regxp, '<br>\n');
    (window as any).show_dialog_message('Message for you:', message);
    return;
  } else {
    if (message.indexOf('/metamessage') !== -1) return;
    if (message.indexOf('Metaserver message string') !== -1) return;

    if (ptile != null && ptile > 0) {
      message = "<span class='chatbox_text_tileinfo' "
          + "onclick='center_tile_id(" + ptile + ");'>" + message + '</span>';
    }
  }

  packet['message'] = message;
  add_chatbox_text(packet);
}

export function handle_early_chat_msg(packet: any): void {
  handle_chat_msg(packet);
}

export function handle_city_info(packet: any): void {
  if (typeof mark_tile_dirty === 'function' && packet['tile'] != null) {
    mark_tile_dirty(packet['tile']);
  }

  packet['name'] = decodeURIComponent(packet['name']);
  packet['improvements'] = new BitVector(packet['improvements']);
  packet['city_options'] = new BitVector(packet['city_options']);
  packet['unhappy'] = (window as any).city_unhappy(packet);

  if (store.cities[packet['id']] == null) {
    const pcity = packet;
    store.cities[packet['id']] = packet;
    if (C_S_RUNNING === clientState() && !(window as any).observing && (window as any).benchmark_start === 0
        && !clientIsObserver() && packet['owner'] === store.client.conn.playing.playerno) {
      show_city_dialog_by_id(packet['id']);
    }
  } else {
    Object.assign(store.cities[packet['id']], packet);
  }

  const pcity = store.cities[packet['id']];
  // shield_stock / production changes tracked for animation
  pcity['shield_stock_changed'] = false;
  pcity['production_changed'] = false;
}

export function handle_city_nationalities(packet: any): void {
  if (store.cities[packet['id']] != null) {
    Object.assign(store.cities[packet['id']], packet);
  }
}

export function handle_city_rally_point(packet: any): void {
  if (store.cities[packet['id']] != null) {
    Object.assign(store.cities[packet['id']], packet);
  }
}

export function handle_web_city_info_addition(packet: any): void {
  if (store.cities[packet['id']] != null) {
    Object.assign(store.cities[packet['id']], packet);
  }
  // Trigger UI update after city info is complete
  if (typeof (window as any).update_city_info_dialog === 'function') {
    (window as any).update_city_info_dialog();
  }
}

export function handle_city_short_info(packet: any): void {
  if (typeof mark_tile_dirty === 'function' && packet['tile'] != null) {
    mark_tile_dirty(packet['tile']);
  }

  packet['name'] = decodeURIComponent(packet['name']);
  packet['improvements'] = new BitVector(packet['improvements']);

  if (store.cities[packet['id']] == null) {
    store.cities[packet['id']] = packet;
  } else {
    Object.assign(store.cities[packet['id']], packet);
  }
}

export function handle_city_update_counters(packet: any): void {
  if (store.cities[packet['id']] != null) {
    store.cities[packet['id']]['counters'] = packet['counters'];
  }
}

export function handle_city_update_counter(_packet: any): void { /* TODO */ }

export function handle_player_info(packet: any): void {
  // Decode the nation name
  if (packet['name'] != null) {
    packet['name'] = decodeURIComponent(packet['name']);
  }

  store.players[packet['playerno']] = Object.assign(
    store.players[packet['playerno']] || {},
    packet
  );

  // Convert bitfield arrays to BitVector so legacy JS can call .isSet().
  // The server sends these as plain arrays; without conversion, nation.js
  // (and control.js / hotseat.js) crash with "flags.isSet is not a function".
  const p = store.players[packet['playerno']];
  if (p['flags'] != null && !(p['flags'] instanceof BitVector)) {
    p['flags'] = new BitVector(p['flags']);
  }
  if (p['gives_shared_vision'] != null && !(p['gives_shared_vision'] instanceof BitVector)) {
    p['gives_shared_vision'] = new BitVector(p['gives_shared_vision']);
  }

  if (store.client.conn.playing != null
      && packet['playerno'] === store.client.conn.playing['playerno']) {
    store.client.conn.playing = store.players[packet['playerno']];
  }
}

export function handle_web_player_info_addition(packet: any): void {
  Object.assign(store.players[packet['playerno']], packet);

  if (store.client.conn.playing != null) {
    if (packet['playerno'] === store.client.conn.playing['playerno']) {
      store.client.conn.playing = store.players[packet['playerno']];
      update_game_status_panel();
      update_net_income();
    }
  }
  update_player_info_pregame();

  if ((window as any).is_tech_tree_init && (window as any).tech_dialog_active) update_tech_screen();

  assign_nation_color(store.players[packet['playerno']]['nation']);
}

export function handle_player_remove(packet: any): void {
  delete store.players[packet['playerno']];
  update_player_info_pregame();
}

export function handle_conn_ping(packet: any): void {
  (window as any).ping_last = new Date().getTime();
  const pong_packet = { 'pid': packet_conn_pong };
  send_request(JSON.stringify(pong_packet));
}

export function handle_set_topology(_packet: any): void { /* TODO */ }

export function handle_map_info(packet: any): void {
  store.mapInfo = packet;
  mapInitTopology(false);
  mapAllocate();
  mapdeco_init();

}

export function handle_authentication_req(packet: any): void {
  (window as any).show_auth_dialog(packet);
}

export function handle_server_shutdown(_packet: any): void { /* TODO */ }

export function handle_nuke_tile_info(packet: any): void {
  const ptile = (window as any).index_to_tile(packet['tile']);
  ptile['nuke'] = 60;
  play_sound('LrgExpl.ogg');
}

export function handle_city_remove(packet: any): void {
  (window as any).remove_city(packet['city_id']);
}

export function handle_connect_msg(packet: any): void {
  add_chatbox_text(packet);
}

export function handle_server_info(packet: any): void {
  if (packet['emerg_version'] > 0) {
    console.log('Server has version %d.%d.%d.%d%s',
      packet.major_version, packet.minor_version, packet.patch_version,
      packet.emerg_version, packet.version_label);
  } else {
    console.log('Server has version %d.%d.%d%s',
      packet.major_version, packet.minor_version, packet.patch_version,
      packet.version_label);
  }
}

export function handle_city_name_suggestion_info(packet: any): void {
  packet['name'] = decodeURIComponent(packet['name']);
  city_name_dialog(packet['name'], packet['unit_id']);
}

export function handle_city_sabotage_list(packet: any): void {
  if (packet['request_kind'] !== REQEST_PLAYER_INITIATED) {
    console.log('handle_city_sabotage_list(): was asked to not disturb the player. Unimplemented.');
  }
  popup_sabotage_dialog(
    game_find_unit_by_number(packet['actor_id']),
    game_find_city_by_number(packet['city_id']),
    new BitVector(packet['improvements']),
    packet['act_id']
  );
}

export function handle_player_attribute_chunk(_packet: any): void { /* no-op */ }

export function handle_unit_remove(packet: any): void {
  const punit = game_find_unit_by_number(packet['unit_id']);
  if (punit == null) return;

  if (typeof mark_tile_dirty === 'function' && punit['tile'] != null) {
    mark_tile_dirty(punit['tile']);
  }

  if ((window as any).action_selection_in_progress_for === punit.id) {
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

/**
 * Handle action decision for a unit — check auto-attack actions first,
 * then fall back to requesting player decision.
 */
export function action_decision_handle(punit: any): void {
  for (let a = 0; a < auto_attack_actions.length; a++) {
    const action = auto_attack_actions[a];
    if (utype_can_do_action(unit_type(punit), action) && (window as any).auto_attack) {
      const packet = {
        'pid':             packet_unit_get_actions,
        'actor_unit_id':   punit['id'],
        'target_unit_id':  IDENTITY_NUMBER_ZERO,
        'target_tile_id':  punit['action_decision_tile'],
        'target_extra_id': EXTRA_NONE,
        'request_kind':    REQEST_BACKGROUND_FAST_AUTO_ATTACK,
      };
      send_request(JSON.stringify(packet));
      return;
    }
  }
  action_decision_request(punit);
}

/**
 * Do an auto action or request that the player makes a decision
 * for the specified unit.
 */
export function action_decision_maybe_auto(
  actor_unit: any, action_probabilities: any,
  target_tile: any, target_extra: any,
  target_unit: any, _target_city: any
): void {
  for (let a = 0; a < auto_attack_actions.length; a++) {
    const action = auto_attack_actions[a];
    if ((window as any).action_prob_possible(action_probabilities[action]) && (window as any).auto_attack) {
      let target = target_tile['index'];
      if (action === ACTION_NUKE_CITY) {
        const tc = (window as any).tile_city(target_tile);
        if (!tc) continue;
        target = tc['id'];
      }
      request_unit_do_action(action, actor_unit['id'], target);
      return;
    }
  }
  action_decision_request(actor_unit);
}

/**
 * Simple wrapper: update_client_state -> set_client_state.
 */
export function update_client_state(value: any): void {
  set_client_state(value);
}

export function handle_unit_packet_common(packet_unit: any): void {
  const punit = player_find_unit_by_id(
    unit_owner(packet_unit), packet_unit['id']
  );

  // Clear old tile reference before updating
  if (typeof clear_tile_unit === 'function') {
    clear_tile_unit(punit);
  }

  if (punit == null && game_find_unit_by_number(packet_unit['id']) != null) {
    // Unit changed owner — delete old and recreate
    handle_unit_remove(packet_unit['id']);
  }

  let old_tile: any = null;
  if (punit != null) old_tile = (window as any).index_to_tile(punit['tile']);

  if (store.units[packet_unit['id']] == null) {
    // New unit
    if (should_ask_server_for_actions(packet_unit)) {
      action_decision_handle(packet_unit);
    }
    packet_unit['anim_list'] = [];
    store.units[packet_unit['id']] = packet_unit;
    store.units[packet_unit['id']]['facing'] = 6;
  } else {
    // Existing unit update
    if ((punit['action_decision_want'] !== packet_unit['action_decision_want']
         || punit['action_decision_tile'] !== packet_unit['action_decision_tile'])
        && should_ask_server_for_actions(packet_unit)) {
      action_decision_handle(packet_unit);
    }
    if (typeof update_unit_anim_list === 'function') {
      update_unit_anim_list(store.units[packet_unit['id']], packet_unit);
    }
    Object.assign(store.units[packet_unit['id']], packet_unit);
    // Also update current_focus references
    if ((window as any).current_focus != null) {
      for (let i = 0; i < (window as any).current_focus.length; i++) {
        if ((window as any).current_focus[i]['id'] === packet_unit['id']) {
          Object.assign((window as any).current_focus[i], packet_unit);
        }
      }
    }
  }

  update_tile_unit(store.units[packet_unit['id']]);

  if ((window as any).current_focus != null && (window as any).current_focus.length > 0
      && (window as any).current_focus[0]['id'] === packet_unit['id']) {
    update_active_units_dialog();
    update_unit_order_commands();

    if ((window as any).current_focus[0]['done_moving'] !== packet_unit['done_moving']) {
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
    (window as any).explosion_anim_map[attacker['tile']] = 25;
  }
  if (defender_hp === 0 && is_unit_visible(defender)) {
    (window as any).explosion_anim_map[defender['tile']] = 25;
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
  const ptile = (window as any).index_to_tile(target_tile_id);
  const target_extra = (window as any).extra_by_number(target_extra_id);

  let hasActions = false;

  if (pdiplomat != null && ptile != null) {
    action_probabilities.forEach(function(prob: any) {
      if ((window as any).action_prob_possible(prob)) {
        hasActions = true;
      }
    });
  }

  switch (packet['request_kind']) {
  case REQEST_PLAYER_INITIATED:
    if (hasActions) {
      popup_action_selection(pdiplomat, action_probabilities,
                               ptile, target_extra, target_unit, target_city);
    } else {
      action_selection_no_longer_in_progress(actor_unit_id);
      action_decision_clear_want(actor_unit_id);
      action_selection_next_in_focus(actor_unit_id);
    }
    break;
  case REQEST_BACKGROUND_REFRESH:
    action_selection_refresh(pdiplomat,
                               target_city, target_unit, ptile,
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

export function handle_diplomacy_init_meeting(packet: any): void {
  (window as any).diplomacy_clause_map[packet['counterpart']] = [];
  show_diplomacy_dialog(packet['counterpart']);
  show_diplomacy_clauses(packet['counterpart']);
}

export function handle_diplomacy_cancel_meeting(packet: any): void {
  cancel_meeting(packet['counterpart']);
}

export function handle_diplomacy_create_clause(packet: any): void {
  const counterpart_id = packet['counterpart'];
  if ((window as any).diplomacy_clause_map[counterpart_id] == null) {
    (window as any).diplomacy_clause_map[counterpart_id] = [];
  }
  (window as any).diplomacy_clause_map[counterpart_id].push(packet);
  show_diplomacy_clauses(counterpart_id);
}

export function handle_diplomacy_remove_clause(packet: any): void {
  remove_clause(packet);
}

export function handle_diplomacy_accept_treaty(packet: any): void {
  accept_treaty(packet['counterpart'],
                  packet['I_accepted'],
                  packet['other_accepted']);
}

export function handle_page_msg(packet: any): void {
  page_msg['headline'] = packet['headline'];
  page_msg['caption'] = packet['caption'];
  page_msg['event'] = packet['event'];
  page_msg['missing_parts'] = packet['parts'];
  page_msg['message'] = '';
}

export function handle_page_msg_part(packet: any): void {
  page_msg['message'] = page_msg['message'] + packet['lines'];
  page_msg['missing_parts']--;

  if (page_msg['missing_parts'] === 0) {
    const regxp = /\n/gi;
    page_msg['message'] = page_msg['message'].replace(regxp, '<br>\n');
    (window as any).show_dialog_message(page_msg['headline'], page_msg['message']);
    page_msg = {};
  }
}

export function handle_conn_ping_info(packet: any): void {
  if ((window as any).debug_active) {
    (window as any).conn_ping_info = packet;
    (window as any).debug_ping_list.push(packet['ping_time'][0] * 1000);
  }
}

export function handle_end_phase(_packet: any): void {
  chatbox_clip_messages();
}

export function handle_start_phase(_packet: any): void {
  set_client_state(C_S_RUNNING);
  setPhaseStart();
  (window as any).saved_this_turn = false;
}

export function handle_ruleset_control(packet: any): void {
  store.rulesControl = packet;
  set_client_state(C_S_PREPARING);

  (window as any).effects = {};
  (window as any).ruleset_summary = null;
  (window as any).ruleset_description = null;
  (window as any).game_rules = null;
  (window as any).nation_groups = [];
  store.nations = {};
  (window as any).specialists = {};
  store.techs = {};
  store.governments = {};
  terrain_control = {};
  (window as any).terrain_control = {};
  (window as any).SINGLE_MOVE = undefined;
  store.unitTypes = {};
  (window as any).unit_classes = {};
  (window as any).city_rules = {};
  store.terrains = {};
  (window as any).resources = {};
  (window as any).goods = {};
  (window as any).actions = {};

  improvements_init();

  for (const extra in store.extras) {
    const ename = (store.extras as any)[extra]['rule_name'];
    if (ename === 'Railroad') delete (window as any)['EXTRA_RAIL'];
    else if (ename === 'Oil Well') delete (window as any)['EXTRA_OIL_WELL'];
    else delete (window as any)['EXTRA_' + ename.toUpperCase()];
  }
  store.extras = {};
  roads = [];
  bases = [];

  (window as any).clause_infos = {};
}

export function handle_endgame_report(_packet: any): void {
  set_client_state(C_S_OVER);
}

export function handle_scenario_info(packet: any): void {
  (window as any).scenario_info = packet;
}

export function handle_scenario_description(packet: any): void {
  (window as any).scenario_info['description'] = packet['description'];
  update_game_info_pregame();
}

export function handle_single_want_hack_reply(packet: any): void {
  if (typeof (window as any).handle_single_want_hack_reply_orig === 'function') {
    (window as any).handle_single_want_hack_reply_orig(packet);
  }
}

export function handle_vote_new(_packet: any): void { /* TODO */ }
export function handle_vote_update(_packet: any): void { /* TODO */ }
export function handle_vote_remove(_packet: any): void { /* TODO */ }
export function handle_vote_resolve(_packet: any): void { /* TODO */ }
export function handle_edit_startpos(_packet: any): void { /* no-op */ }
export function handle_edit_startpos_full(_packet: any): void { /* no-op */ }
export function handle_edit_object_created(_packet: any): void { /* no-op */ }

export function handle_server_setting_const(packet: any): void {
  store.serverSettings[packet['id']] = packet;
  store.serverSettings[packet['name']] = packet;
}

export function handle_server_setting_int(packet: any): void {
  Object.assign(store.serverSettings[packet['id']], packet);
}

export function handle_server_setting_enum(packet: any): void {
  Object.assign(store.serverSettings[packet['id']], packet);
}

export function handle_server_setting_bitwise(packet: any): void {
  Object.assign(store.serverSettings[packet['id']], packet);
}

export function handle_server_setting_bool(packet: any): void {
  Object.assign(store.serverSettings[packet['id']], packet);
}

export function handle_server_setting_str(packet: any): void {
  Object.assign(store.serverSettings[packet['id']], packet);
}

export function handle_server_setting_control(_packet: any): void { /* TODO */ }

export function handle_player_diplstate(packet: any): void {
  let need_players_dialog_update = false;

  if (store.client == null || store.client.conn.playing == null) return;

  if (packet['plr2'] === store.client.conn.playing['playerno']) {
    const ds = store.players[packet['plr1']].diplstates;
    if (ds != undefined && ds[packet['plr2']] != undefined
        && ds[packet['plr2']]['state'] !== packet['type']) {
      need_players_dialog_update = true;
    }
  }

  if (packet['type'] === (window as any).DS_WAR && packet['plr2'] === store.client.conn.playing['playerno']
      && (window as any).diplstates[packet['plr1']] !== (window as any).DS_WAR && (window as any).diplstates[packet['plr1']] !== (window as any).DS_NO_CONTACT) {
    (window as any).alert_war(packet['plr1']);
  } else if (packet['type'] === (window as any).DS_WAR && packet['plr1'] === store.client.conn.playing['playerno']
      && (window as any).diplstates[packet['plr2']] !== (window as any).DS_WAR && (window as any).diplstates[packet['plr2']] !== (window as any).DS_NO_CONTACT) {
    (window as any).alert_war(packet['plr2']);
  }

  if (packet['plr1'] === store.client.conn.playing['playerno']) {
    (window as any).diplstates[packet['plr2']] = packet['type'];
  } else if (packet['plr2'] === store.client.conn.playing['playerno']) {
    (window as any).diplstates[packet['plr1']] = packet['type'];
  }

  if (store.players[packet['plr1']].diplstates === undefined) {
    store.players[packet['plr1']].diplstates = [];
  }
  store.players[packet['plr1']].diplstates[packet['plr2']] = {
    state: packet['type'],
    turns_left: packet['turns_left'],
    contact_turns_left: packet['contact_turns_left']
  };

  if (need_players_dialog_update
      && action_selection_actor_unit() !== IDENTITY_NUMBER_ZERO) {
    let tgt_tile: any;
    let tgt_unit: any;
    let tgt_city: any;

    if ((action_selection_target_unit() !== IDENTITY_NUMBER_ZERO
         && ((tgt_unit = game_find_unit_by_number(action_selection_target_unit())))
         && tgt_unit['owner'] === packet['plr1'])
        || (action_selection_target_city() !== IDENTITY_NUMBER_ZERO
            && ((tgt_city = game_find_city_by_number(action_selection_target_city())))
            && tgt_city['owner'] === packet['plr1'])
        || ((tgt_tile = (window as any).index_to_tile(action_selection_target_tile()))
            && (window as any).tile_owner(tgt_tile) === packet['plr1'])) {
      const refresh_packet = {
        'pid': packet_unit_get_actions,
        'actor_unit_id': action_selection_actor_unit(),
        'target_unit_id': action_selection_target_unit(),
        'target_tile_id': action_selection_target_tile(),
        'target_extra_id': action_selection_target_extra(),
        'request_kind': REQEST_BACKGROUND_REFRESH,
      };
      send_request(JSON.stringify(refresh_packet));
    }
  }
}

export function handle_web_goto_path(packet: any): void {
  if ((window as any).goto_active) {
    update_goto_path(packet);
  }
}

export function handle_research_info(packet: any): void {
  let old_inventions: any = null;
  if ((window as any).research_data[packet['id']] != null) {
    old_inventions = (window as any).research_data[packet['id']]['inventions'];
  }

  (window as any).research_data[packet['id']] = packet;

  if (store.gameInfo['team_pooled_research']) {
    for (const player_id in store.players) {
      const pplayer = store.players[player_id];
      if (pplayer['team'] === packet['id']) {
        Object.assign(pplayer, packet);
        delete pplayer['id'];
      }
    }
  } else {
    const pplayer = store.players[packet['id']];
    Object.assign(pplayer, packet);
    delete pplayer['id'];
  }

  if (!clientIsObserver() && old_inventions != null
      && store.client.conn.playing != null
      && store.client.conn.playing['playerno'] === packet['id']) {
    for (let i = 0; i < packet['inventions'].length; i++) {
      if (packet['inventions'][i] !== old_inventions[i]
          && packet['inventions'][i] === TECH_KNOWN) {
        queue_tech_gained_dialog(i);
        break;
      }
    }
  }

  if ((window as any).is_tech_tree_init && (window as any).tech_dialog_active) update_tech_screen();
  (window as any).bulbs_output_updater.update();
}

// ============================================================================
// Batch 5: jQuery handlers — replaced with native DOM
// ============================================================================

export function handle_begin_turn(_packet: any): void {
  if (typeof mark_all_dirty === 'function') mark_all_dirty();

  if (!(window as any).observing) {
    const btn = document.getElementById('turn_done_button') as HTMLButtonElement | null;
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Turn Done';
    }
  }
  (window as any).waiting_units_list = [];
  update_unit_focus();
  update_active_units_dialog();
  update_game_status_panel();

  const funits = get_units_in_focus();
  if (funits != null && funits.length === 0) {
    auto_center_on_focus_unit();
  }

  if ((window as any).is_tech_tree_init && (window as any).tech_dialog_active) update_tech_screen();
}

export function handle_end_turn(_packet: any): void {
  reset_unit_anim_list();
  if (!(window as any).observing) {
    const btn = document.getElementById('turn_done_button') as HTMLButtonElement | null;
    if (btn) btn.disabled = true;
  }
}

// ============================================================================
// handle_web_info_text_message is defined in 2dcanvas/mapctrl.js
// We do NOT migrate it here — it stays in the rendering layer (Phase 8)
// ============================================================================

// ============================================================================
// Packet Router — replaces packhand_glue.js
// ============================================================================

/**
 * Maps server packet IDs to their handler functions.
 * This replaces the packet_hand_table from packhand_glue.js.
 */
export const packet_hand_table: Record<number, (packet: any) => void> = {
  0:   handle_processing_started,
  1:   handle_processing_finished,
  21:  handle_investigate_started,
  22:  handle_investigate_finished,
  5:   handle_server_join_reply,
  6:   handle_authentication_req,
  8:   handle_server_shutdown,
  12:  handle_endgame_report,
  223: handle_endgame_player,
  15:  handle_tile_info,
  16:  handle_game_info,
  255: handle_calendar_info,
  244: handle_timeout_info,
  17:  handle_map_info,
  18:  handle_nuke_tile_info,
  19:  handle_team_name_info,
  238: handle_achievement_info,
  25:  handle_chat_msg,
  28:  handle_early_chat_msg,
  27:  handle_connect_msg,
  29:  handle_server_info,
  30:  handle_city_remove,
  31:  handle_city_info,
  46:  handle_city_nationalities,
  514: handle_city_update_counters,
  32:  handle_city_short_info,
  249: handle_trade_route_info,
  44:  handle_city_name_suggestion_info,
  45:  handle_city_sabotage_list,
  138: handle_city_rally_point,
  241: handle_worker_task,
  50:  handle_player_remove,
  51:  handle_player_info,
  58:  handle_player_attribute_chunk,
  59:  handle_player_diplstate,
  60:  handle_research_info,
  66:  handle_unknown_research,
  62:  handle_unit_remove,
  63:  handle_unit_info,
  64:  handle_unit_short_info,
  65:  handle_unit_combat_info,
  85:  handle_unit_action_answer,
  90:  handle_unit_actions,
  96:  handle_diplomacy_init_meeting,
  98:  handle_diplomacy_cancel_meeting,
  100: handle_diplomacy_create_clause,
  102: handle_diplomacy_remove_clause,
  104: handle_diplomacy_accept_treaty,
  110: handle_page_msg,
  250: handle_page_msg_part,
  115: handle_conn_info,
  116: handle_conn_ping_info,
  88:  handle_conn_ping,
  125: handle_end_phase,
  126: handle_start_phase,
  127: handle_new_year,
  128: handle_begin_turn,
  129: handle_end_turn,
  130: handle_freeze_client,
  131: handle_thaw_client,
  137: handle_spaceship_info,
  140: handle_ruleset_unit,
  228: handle_ruleset_unit_bonus,
  229: handle_ruleset_unit_flag,
  230: handle_ruleset_unit_class_flag,
  141: handle_ruleset_game,
  142: handle_ruleset_specialist,
  143: handle_ruleset_government_ruler_title,
  144: handle_ruleset_tech,
  9:   handle_ruleset_tech_class,
  234: handle_ruleset_tech_flag,
  145: handle_ruleset_government,
  146: handle_ruleset_terrain_control,
  225: handle_rulesets_ready,
  236: handle_ruleset_nation_sets,
  147: handle_ruleset_nation_groups,
  148: handle_ruleset_nation,
  237: handle_nation_availability,
  239: handle_ruleset_style,
  149: handle_ruleset_city,
  150: handle_ruleset_building,
  20:  handle_ruleset_impr_flag,
  151: handle_ruleset_terrain,
  231: handle_ruleset_terrain_flag,
  152: handle_ruleset_unit_class,
  232: handle_ruleset_extra,
  226: handle_ruleset_extra_flag,
  153: handle_ruleset_base,
  220: handle_ruleset_road,
  248: handle_ruleset_goods,
  224: handle_ruleset_disaster,
  233: handle_ruleset_achievement,
  227: handle_ruleset_trade,
  246: handle_ruleset_action,
  235: handle_ruleset_action_enabler,
  252: handle_ruleset_action_auto,
  513: handle_ruleset_counter,
  240: handle_ruleset_music,
  243: handle_ruleset_multiplier,
  512: handle_ruleset_clause,
  155: handle_ruleset_control,
  251: handle_ruleset_summary,
  247: handle_ruleset_description_part,
  161: handle_single_want_hack_reply,
  162: handle_ruleset_choices,
  163: handle_game_load,
  164: handle_server_setting_control,
  165: handle_server_setting_const,
  166: handle_server_setting_bool,
  167: handle_server_setting_int,
  168: handle_server_setting_str,
  169: handle_server_setting_enum,
  170: handle_server_setting_bitwise,
  253: handle_set_topology,
  175: handle_ruleset_effect,
  177: handle_ruleset_resource,
  180: handle_scenario_info,
  13:  handle_scenario_description,
  185: handle_vote_new,
  186: handle_vote_update,
  187: handle_vote_remove,
  188: handle_vote_resolve,
  204: handle_edit_startpos,
  205: handle_edit_startpos_full,
  219: handle_edit_object_created,
  245: handle_play_music,
  515: handle_popup_image,
  256: handle_web_city_info_addition,
  259: handle_web_player_info_addition,
  260: handle_web_ruleset_unit_addition,
  288: handle_web_goto_path,
  // 290: handle_web_info_text_message — defined in 2dcanvas/mapctrl.js
};

// Register handle_web_info_text_message from legacy mapctrl.js (loaded before TS bundle)
if (typeof (window as any).handle_web_info_text_message === 'function') {
  packet_hand_table[290] = (window as any).handle_web_info_text_message;
}

/**
 * Main packet dispatch function.
 * Called by the WebSocket onmessage handler.
 */
export function client_handle_packet(packets: any[]): void {
  if (packets == null) return;
  try {
    for (let i = 0; i < packets.length; i++) {
      if (packets[i] != null) {
        const handler = packet_hand_table[packets[i].pid];
        if (handler) {
          handler(packets[i]);
        } else {
          console.warn('No handler for packet pid=' + packets[i].pid);
        }
      }
    }
    if (packets.length > 0) {
      if ((window as any).debug_active) clinet_debug_collect();
      if ((window as any).renderer === RENDERER_2DCANVAS) update_map_canvas_check();
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Register an additional handler at runtime.
 * Used by 2dcanvas/mapctrl.js to register handle_web_info_text_message.
 */
export function register_packet_handler(pid: number, handler: (packet: any) => void): void {
  packet_hand_table[pid] = handler;
}

// ============================================================================
// Expose ALL handlers and dispatch to Legacy
// ============================================================================

// Freeze/thaw
// Ruleset data
// Game state
// Server/connection
// Map/tile
// City
// Player
// Unit
// Diplomacy
// Chat/message
// Turn/phase
// Research
// Endgame/scenario
// Vote/edit
// Goto
// Action decision helpers
// Packet dispatch
// Connection management (migrated from connection.js)
export function find_conn_by_id(id: number): any {
  return store.connections[id];
}

export function client_remove_cli_conn(connection: any): void {
  delete store.connections[connection['id']];
}

export function conn_list_append(connection: any): void {
  store.connections[connection['id']] = connection;
}

// Module-local state exposed for legacy access

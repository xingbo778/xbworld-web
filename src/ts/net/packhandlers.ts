/**
 * Packet handler router — re-exports all handlers from sub-modules
 * and defines the packet routing table.
 *
 * Split into: handlers/freezeThaw, handlers/ruleset, handlers/gameState,
 * handlers/server, handlers/map, handlers/city, handlers/player,
 * handlers/unit, handlers/diplomacy, handlers/chat
 */

import { store } from '../data/store';
import { clinet_debug_collect } from './connection';
import { RENDERER_2DCANVAS } from '../core/constants';
import { update_map_canvas_check } from '../renderer/mapviewCommon';
import { handle_web_info_text_message } from '../renderer/mapctrl';
import { update_goto_path } from '../core/control/mapClick';
import { goto_active } from '../core/control/controlState';

// Re-export all handlers from sub-modules
export {
  handle_processing_started, handle_processing_finished,
  handle_investigate_started, handle_investigate_finished,
  handle_freeze_hint, handle_thaw_hint,
  handle_freeze_client, handle_thaw_client,
} from './handlers/freezeThaw';

export { terrain_control } from './handlers/ruleset';
export {
  handle_ruleset_terrain, handle_ruleset_resource, handle_ruleset_game,
  handle_ruleset_specialist, handle_ruleset_nation_groups, handle_ruleset_nation,
  handle_ruleset_city, handle_ruleset_government, handle_ruleset_summary,
  handle_ruleset_description_part, handle_ruleset_action, handle_ruleset_goods,
  handle_ruleset_clause, handle_ruleset_effect,
  handle_ruleset_unit, handle_web_ruleset_unit_addition,
  recreate_old_tech_req, handle_ruleset_tech,
  handle_ruleset_tech_class, handle_ruleset_tech_flag,
  handle_ruleset_terrain_control, handle_ruleset_building,
  handle_ruleset_unit_class,
  handle_ruleset_disaster, handle_ruleset_trade, handle_rulesets_ready,
  handle_ruleset_choices, handle_game_load,
  handle_ruleset_unit_flag, handle_ruleset_unit_class_flag,
  handle_ruleset_unit_bonus, handle_ruleset_terrain_flag,
  handle_ruleset_impr_flag, handle_ruleset_government_ruler_title,
  handle_ruleset_base, handle_ruleset_road,
  handle_ruleset_action_enabler, handle_ruleset_extra,
  handle_ruleset_counter, handle_ruleset_extra_flag,
  handle_ruleset_nation_sets, handle_ruleset_style,
  handle_nation_availability, handle_ruleset_music,
  handle_ruleset_multiplier, handle_ruleset_action_auto,
  handle_ruleset_achievement, handle_achievement_info,
  handle_team_name_info, handle_popup_image,
  handle_worker_task, handle_play_music,
  handle_ruleset_control,
} from './handlers/ruleset';

export {
  handle_game_info, handle_calendar_info, handle_spaceship_info,
  handle_new_year, handle_timeout_info, handle_trade_route_info,
  handle_endgame_player, handle_unknown_research,
  handle_end_phase, handle_start_phase,
  handle_endgame_report, handle_scenario_info, handle_scenario_description,
  handle_research_info, handle_begin_turn, handle_end_turn,
} from './handlers/gameState';

export {
  find_conn_by_id, client_remove_cli_conn, conn_list_append,
  handle_server_join_reply, handle_conn_info, handle_conn_ping,
  handle_authentication_req, handle_server_shutdown,
  handle_connect_msg, handle_server_info, handle_set_topology,
  handle_conn_ping_info, handle_single_want_hack_reply,
  handle_vote_new, handle_vote_update, handle_vote_remove, handle_vote_resolve,
  handle_edit_startpos, handle_edit_startpos_full, handle_edit_object_created,
  handle_server_setting_const, handle_server_setting_int,
  handle_server_setting_enum, handle_server_setting_bitwise,
  handle_server_setting_bool, handle_server_setting_str,
  handle_server_setting_control,
} from './handlers/server';

export {
  handle_tile_info, handle_map_info, handle_nuke_tile_info,
} from './handlers/map';

export {
  handle_city_info, handle_city_nationalities, handle_city_rally_point,
  handle_web_city_info_addition, handle_city_short_info,
  handle_city_update_counters, handle_city_update_counter,
  handle_city_remove, handle_city_name_suggestion_info,
  handle_city_sabotage_list,
} from './handlers/city';

export {
  handle_player_info, handle_web_player_info_addition,
  handle_player_remove, handle_player_attribute_chunk,
  handle_player_diplstate,
} from './handlers/player';

export {
  handle_unit_remove, handle_unit_info, handle_unit_short_info,
  action_decision_handle, action_decision_maybe_auto, update_client_state,
  handle_unit_packet_common, handle_unit_combat_info,
  handle_unit_action_answer, handle_unit_actions,
} from './handlers/unit';

export {
  handle_diplomacy_init_meeting, handle_diplomacy_cancel_meeting,
  handle_diplomacy_create_clause, handle_diplomacy_remove_clause,
  handle_diplomacy_accept_treaty,
} from './handlers/diplomacy';

export {
  handle_chat_msg, handle_early_chat_msg,
  handle_page_msg, handle_page_msg_part,
} from './handlers/chat';

// Goto handler (small, stays here)
export function handle_web_goto_path(packet: any): void {
  if (goto_active) {
    update_goto_path(packet);
  }
}

// Import all handlers for the routing table
import {
  handle_processing_started, handle_processing_finished,
  handle_investigate_started, handle_investigate_finished,
  handle_freeze_client, handle_thaw_client,
} from './handlers/freezeThaw';

import {
  handle_ruleset_terrain, handle_ruleset_resource, handle_ruleset_game,
  handle_ruleset_specialist, handle_ruleset_nation_groups, handle_ruleset_nation,
  handle_ruleset_city, handle_ruleset_government, handle_ruleset_summary,
  handle_ruleset_description_part, handle_ruleset_action, handle_ruleset_goods,
  handle_ruleset_clause, handle_ruleset_effect,
  handle_ruleset_unit, handle_web_ruleset_unit_addition,
  handle_ruleset_tech, handle_ruleset_tech_class, handle_ruleset_tech_flag,
  handle_ruleset_terrain_control, handle_ruleset_building,
  handle_ruleset_unit_class,
  handle_ruleset_disaster, handle_ruleset_trade, handle_rulesets_ready,
  handle_ruleset_choices, handle_game_load,
  handle_ruleset_unit_flag, handle_ruleset_unit_class_flag,
  handle_ruleset_unit_bonus, handle_ruleset_terrain_flag,
  handle_ruleset_impr_flag, handle_ruleset_government_ruler_title,
  handle_ruleset_base, handle_ruleset_road,
  handle_ruleset_action_enabler, handle_ruleset_extra,
  handle_ruleset_counter, handle_ruleset_extra_flag,
  handle_ruleset_nation_sets, handle_ruleset_style,
  handle_nation_availability, handle_ruleset_music,
  handle_ruleset_multiplier, handle_ruleset_action_auto,
  handle_ruleset_achievement, handle_achievement_info,
  handle_team_name_info, handle_popup_image,
  handle_worker_task, handle_play_music,
  handle_ruleset_control,
} from './handlers/ruleset';

import {
  handle_game_info, handle_calendar_info, handle_spaceship_info,
  handle_new_year, handle_timeout_info, handle_trade_route_info,
  handle_endgame_player, handle_unknown_research,
  handle_end_phase, handle_start_phase,
  handle_endgame_report, handle_scenario_info, handle_scenario_description,
  handle_research_info, handle_begin_turn, handle_end_turn,
} from './handlers/gameState';

import {
  handle_server_join_reply, handle_conn_info, handle_conn_ping,
  handle_authentication_req, handle_server_shutdown,
  handle_connect_msg, handle_server_info, handle_set_topology,
  handle_conn_ping_info, handle_single_want_hack_reply,
  handle_vote_new, handle_vote_update, handle_vote_remove, handle_vote_resolve,
  handle_edit_startpos, handle_edit_startpos_full, handle_edit_object_created,
  handle_server_setting_const, handle_server_setting_int,
  handle_server_setting_enum, handle_server_setting_bitwise,
  handle_server_setting_bool, handle_server_setting_str,
  handle_server_setting_control,
} from './handlers/server';

import {
  handle_tile_info, handle_map_info, handle_nuke_tile_info,
} from './handlers/map';

import {
  handle_city_info, handle_city_nationalities, handle_city_rally_point,
  handle_web_city_info_addition, handle_city_short_info,
  handle_city_update_counters, handle_city_update_counter,
  handle_city_remove, handle_city_name_suggestion_info,
  handle_city_sabotage_list,
} from './handlers/city';

import {
  handle_player_info, handle_web_player_info_addition,
  handle_player_remove, handle_player_attribute_chunk,
  handle_player_diplstate,
} from './handlers/player';

import {
  handle_unit_remove, handle_unit_info, handle_unit_short_info,
  handle_unit_combat_info, handle_unit_action_answer, handle_unit_actions,
} from './handlers/unit';

import {
  handle_diplomacy_init_meeting, handle_diplomacy_cancel_meeting,
  handle_diplomacy_create_clause, handle_diplomacy_remove_clause,
  handle_diplomacy_accept_treaty,
} from './handlers/diplomacy';

import {
  handle_chat_msg, handle_early_chat_msg,
  handle_page_msg, handle_page_msg_part,
} from './handlers/chat';

// ============================================================================
// Packet Router
// ============================================================================

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
};

// Register handle_web_info_text_message from mapctrl
packet_hand_table[290] = handle_web_info_text_message;

/**
 * Main packet dispatch function.
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
      if (store.debugActive) clinet_debug_collect();
      if ((window as any).renderer === RENDERER_2DCANVAS) update_map_canvas_check();
    }
  } catch (e) {
    console.error(e);
  }
}

export function register_packet_handler(pid: number, handler: (packet: any) => void): void {
  packet_hand_table[pid] = handler;
}

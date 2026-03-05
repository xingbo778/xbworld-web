/**
 * Packet type ID constants — must match freeciv/common/networking/packets.def (v3.2).
 *
 * These were previously defined inside webclient.min.js (Closure Compiler output).
 * Phase 4 split webclient.min.js into individual source files, but these constants
 * were not extracted. Phase 5 removed packhand_glue.js and clinet.js, leaving
 * legacy code (e.g., pregame.js) unable to reference them.
 *
 * This module defines all outgoing packet IDs and exposes them to window
 * so legacy JS can continue to use them as globals.
 */
// --- Outgoing packet type IDs (client → server) ---

export const packet_server_join_req = 4;
export const packet_authentication_reply = 7;
export const packet_nation_select_req = 10;
export const packet_player_ready = 11;
export const packet_chat_msg_req = 26;
export const packet_city_sell = 33;
export const packet_city_buy = 34;
export const packet_city_change = 35;
export const packet_city_worklist = 36;
export const packet_city_make_specialist = 37;
export const packet_city_make_worker = 38;
export const packet_city_change_specialist = 39;
export const packet_city_rename = 40;
export const packet_city_options_req = 41;
export const packet_city_refresh = 42;
export const packet_city_name_suggestion_req = 43;
export const packet_city_rally_point = 138;
export const packet_worker_task = 241;
export const packet_player_phase_done = 52;
export const packet_player_change_government = 54;
export const packet_player_place_infra = 61;
export const packet_player_attribute_block = 57;
export const packet_player_attribute_chunk = 58;
export const packet_player_multiplier = 242;
export const packet_player_research = 55;
export const packet_player_tech_goal = 56;
export const packet_player_rates = 53;
export const packet_unit_sscs_set = 71;
export const packet_unit_orders = 73;
export const packet_unit_server_side_agent_set = 74;
export const packet_unit_action_query = 82;
export const packet_unit_type_upgrade = 83;
export const packet_unit_do_action = 84;
export const packet_unit_get_actions = 87;
export const packet_unit_change_activity = 222;
export const packet_diplomacy_init_meeting_req = 95;
export const packet_diplomacy_cancel_meeting_req = 97;
export const packet_diplomacy_create_clause_req = 99;
export const packet_diplomacy_remove_clause_req = 101;
export const packet_diplomacy_accept_treaty_req = 103;
export const packet_diplomacy_cancel_pact = 105;
export const packet_report_req = 111;
export const packet_conn_pong = 89;
export const packet_client_heartbeat = 254;
export const packet_client_info = 119;
export const packet_spaceship_launch = 135;
export const packet_spaceship_place = 136;
export const packet_single_want_hack_req = 160;
export const packet_ruleset_select = 171;
export const packet_save_scenario = 181;
export const packet_vote_submit = 189;
export const packet_edit_mode = 190;
export const packet_edit_recalculate_borders = 197;
export const packet_edit_check_tiles = 198;
export const packet_edit_tile_terrain = 200;
export const packet_edit_tile_extra = 202;
export const packet_edit_startpos = 204;
export const packet_edit_startpos_full = 205;
export const packet_edit_tile = 206;
export const packet_edit_unit_create = 207;
export const packet_edit_unit_remove = 208;
export const packet_edit_unit_remove_by_id = 209;
export const packet_edit_unit = 210;
export const packet_edit_city_create = 211;
export const packet_edit_city_remove = 212;
export const packet_edit_city = 213;
export const packet_edit_player_create = 214;
export const packet_edit_player_remove = 215;
export const packet_edit_player = 216;
export const packet_edit_player_vision = 217;
export const packet_edit_game = 218;
export const packet_edit_scenario_desc = 14;
export const packet_web_cma_clear = 258;
export const packet_web_goto_path_req = 287;
export const packet_web_info_text_req = 289;

// Legacy window exposure removed — all consumers now use TS imports.

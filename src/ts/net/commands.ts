/**
 * Command layer — centralized network request API.
 *
 * All outgoing game commands go through this module.
 * UI components call these semantic functions instead of
 * building packets and calling send_request directly.
 *
 * This decouples UI from the wire protocol so either can
 * change independently.
 */

import { send_request } from './connection';
import {
  packet_chat_msg_req,
  packet_city_sell, packet_city_buy, packet_city_change,
  packet_city_worklist, packet_city_make_specialist, packet_city_make_worker,
  packet_city_change_specialist, packet_city_rename,
  packet_city_name_suggestion_req, packet_city_refresh,
  packet_player_phase_done, packet_player_change_government,
  packet_player_research, packet_player_tech_goal, packet_player_rates,
  packet_player_rates as _ppr,
  packet_unit_sscs_set, packet_unit_orders,
  packet_unit_server_side_agent_set, packet_unit_do_action,
  packet_unit_get_actions, packet_unit_change_activity,
  packet_diplomacy_init_meeting_req, packet_diplomacy_cancel_meeting_req,
  packet_diplomacy_create_clause_req, packet_diplomacy_remove_clause_req,
  packet_diplomacy_accept_treaty_req, packet_diplomacy_cancel_pact,
  packet_report_req,
  packet_conn_pong, packet_client_info,
  packet_web_cma_clear, packet_web_goto_path_req, packet_web_info_text_req,
} from './packetConstants';

function send(packet: any): void {
  send_request(JSON.stringify(packet));
}

// ============================================================================
// Chat
// ============================================================================

export function sendChatMessage(message: string): void {
  send({ pid: packet_chat_msg_req, message });
}

// ============================================================================
// City
// ============================================================================

export function sendCitySell(cityId: number, improvementId: number): void {
  send({ pid: packet_city_sell, city_id: cityId, build_id: improvementId });
}

export function sendCityBuy(cityId: number): void {
  send({ pid: packet_city_buy, city_id: cityId });
}

export function sendCityChange(cityId: number, kind: any, value: any): void {
  send({ pid: packet_city_change, city_id: cityId, production_kind: kind, production_value: value });
}

export function sendCityWorklist(cityId: number, worklist: any): void {
  send({ pid: packet_city_worklist, city_id: cityId, worklist });
}

export function sendCityMakeSpecialist(cityId: number, workerId: number): void {
  send({ pid: packet_city_make_specialist, city_id: cityId, worker_id: workerId });
}

export function sendCityMakeWorker(cityId: number, workerId: number): void {
  send({ pid: packet_city_make_worker, city_id: cityId, worker_id: workerId });
}

export function sendCityChangeSpecialist(cityId: number, from: number, to: number): void {
  send({ pid: packet_city_change_specialist, city_id: cityId, from: from, to: to });
}

export function sendCityRename(cityId: number, name: string): void {
  send({ pid: packet_city_rename, city_id: cityId, name });
}

export function sendCityNameSuggestionReq(unitId: number): void {
  send({ pid: packet_city_name_suggestion_req, unit_id: unitId });
}

export function sendCityRefresh(cityId: number): void {
  send({ pid: packet_city_refresh, city_id: cityId });
}

// ============================================================================
// Player / Turn
// ============================================================================

export function sendPlayerPhaseDone(turn: number): void {
  send({ pid: packet_player_phase_done, turn });
}

export function sendPlayerChangeGovernment(govtId: number): void {
  send({ pid: packet_player_change_government, government: govtId });
}

export function sendPlayerResearch(techId: number): void {
  send({ pid: packet_player_research, tech: techId });
}

export function sendPlayerTechGoal(techId: number): void {
  send({ pid: packet_player_tech_goal, tech: techId });
}

export function sendPlayerRates(tax: number, luxury: number, science: number): void {
  send({ pid: packet_player_rates, tax, luxury, science });
}

export function sendReportReq(rtype: number): void {
  send({ pid: packet_report_req, type: rtype });
}

// ============================================================================
// Unit
// ============================================================================

export function sendUnitSscsSet(unitId: number, type: number, value: number): void {
  send({ pid: packet_unit_sscs_set, unit_id: unitId, type, value });
}

export function sendUnitOrders(packet: any): void {
  // Unit orders packet is complex (has arrays), pass through
  send({ pid: packet_unit_orders, ...packet });
}

export function sendUnitServerSideAgentSet(unitId: number, agent: number): void {
  send({ pid: packet_unit_server_side_agent_set, unit_id: unitId, agent });
}

export function sendUnitDoAction(
  actionId: number, actorId: number, targetId: number,
  subTgtId: number = 0, name: string = ''
): void {
  send({
    pid: packet_unit_do_action,
    action_type: actionId,
    actor_id: actorId,
    target_id: targetId,
    sub_tgt_id: subTgtId,
    name,
  });
}

export function sendUnitGetActions(
  actorUnitId: number, targetUnitId: number,
  targetTileId: number, targetExtraId: number,
  requestKind: number
): void {
  send({
    pid: packet_unit_get_actions,
    actor_unit_id: actorUnitId,
    target_unit_id: targetUnitId,
    target_tile_id: targetTileId,
    target_extra_id: targetExtraId,
    request_kind: requestKind,
  });
}

export function sendUnitChangeActivity(unitId: number, activity: number, target: number): void {
  send({ pid: packet_unit_change_activity, unit_id: unitId, activity, target });
}

// ============================================================================
// Diplomacy
// ============================================================================

export function sendDiplomacyInitMeeting(counterpart: number): void {
  send({ pid: packet_diplomacy_init_meeting_req, counterpart });
}

export function sendDiplomacyCancelMeeting(counterpart: number): void {
  send({ pid: packet_diplomacy_cancel_meeting_req, counterpart });
}

export function sendDiplomacyCreateClause(counterpart: number, giver: number, type: number, value: number): void {
  send({ pid: packet_diplomacy_create_clause_req, counterpart, giver, type, value });
}

export function sendDiplomacyRemoveClause(counterpart: number, giver: number, type: number, value: number): void {
  send({ pid: packet_diplomacy_remove_clause_req, counterpart, giver, type, value });
}

export function sendDiplomacyAcceptTreaty(counterpart: number): void {
  send({ pid: packet_diplomacy_accept_treaty_req, counterpart });
}

export function sendDiplomacyCancelPact(otherPlayerId: number, clause: number): void {
  send({ pid: packet_diplomacy_cancel_pact, other_player_id: otherPlayerId, clause });
}

// ============================================================================
// CMA (City Governor)
// ============================================================================

const packet_web_cma_set = 257;

export function sendCmaSet(cityId: number, cmParameter: any): void {
  send({ pid: packet_web_cma_set, id: cityId, cm_parameter: cmParameter });
}

export function sendCmaClear(cityId: number): void {
  send({ pid: packet_web_cma_clear, id: cityId });
}

// ============================================================================
// Goto / Info
// ============================================================================

export function sendGotoPathReq(unitId: number, goalTileIndex: number): void {
  send({ pid: packet_web_goto_path_req, unit_id: unitId, goal: goalTileIndex });
}

export function sendInfoTextReq(visibleUnit: number, loc: number, focusUnit: number): void {
  send({ pid: packet_web_info_text_req, visible_unit: visibleUnit, loc, focus_unit: focusUnit });
}

// ============================================================================
// Connection / Low-level
// ============================================================================

export function sendConnPong(): void {
  send({ pid: packet_conn_pong });
}

export function sendClientInfo(): void {
  send({
    pid: packet_client_info,
    gui: 2, // GUI_WEB
    emerg_version: 0,
    distribution: '',
  });
}

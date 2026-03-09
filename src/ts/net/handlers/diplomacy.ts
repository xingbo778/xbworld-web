/**
 * Diplomacy packet handlers — observer mode.
 * All dialog functions are no-ops; clause state is tracked but never displayed.
 */
import type {
  DiplomacyInitMeetingPacket, DiplomacyCancelMeetingPacket,
  DiplomacyCreateClausePacket, DiplomacyRemoveClausePacket,
  DiplomacyAcceptTreatyPacket,
} from './packetTypes';

const diplomacy_clause_map: Record<number, unknown[]> = {};

export function handle_diplomacy_init_meeting(packet: DiplomacyInitMeetingPacket): void {
  diplomacy_clause_map[packet['counterpart']] = [];
  // show_diplomacy_dialog / show_diplomacy_clauses — player-only, no-op
}

export function handle_diplomacy_cancel_meeting(packet: DiplomacyCancelMeetingPacket): void {
  delete diplomacy_clause_map[packet['counterpart']];
  // cancel_meeting — player-only, no-op
}

export function handle_diplomacy_create_clause(packet: DiplomacyCreateClausePacket): void {
  const counterpart_id = packet['counterpart'];
  if (diplomacy_clause_map[counterpart_id] == null) {
    diplomacy_clause_map[counterpart_id] = [];
  }
  diplomacy_clause_map[counterpart_id].push(packet);
  // show_diplomacy_clauses — player-only, no-op
}

export function handle_diplomacy_remove_clause(packet: DiplomacyRemoveClausePacket): void {
  void packet; // remove_clause — player-only, no-op
}

export function handle_diplomacy_accept_treaty(packet: DiplomacyAcceptTreatyPacket): void {
  void packet; // accept_treaty — player-only, no-op
}

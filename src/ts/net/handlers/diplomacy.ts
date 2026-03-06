/**
 * Diplomacy packet handlers.
 */
import {
  show_diplomacy_dialog, accept_treaty, cancel_meeting,
  show_diplomacy_clauses, remove_clause,
  diplomacy_clause_map,
} from '../../ui/diplomacy';
import type {
  DiplomacyInitMeetingPacket, DiplomacyCancelMeetingPacket,
  DiplomacyCreateClausePacket, DiplomacyRemoveClausePacket,
  DiplomacyAcceptTreatyPacket,
} from './packetTypes';

export function handle_diplomacy_init_meeting(packet: DiplomacyInitMeetingPacket): void {
  diplomacy_clause_map[packet['counterpart']] = [];
  show_diplomacy_dialog(packet['counterpart']);
  show_diplomacy_clauses(packet['counterpart']);
}

export function handle_diplomacy_cancel_meeting(packet: DiplomacyCancelMeetingPacket): void {
  cancel_meeting(packet['counterpart']);
}

export function handle_diplomacy_create_clause(packet: DiplomacyCreateClausePacket): void {
  const counterpart_id = packet['counterpart'];
  if (diplomacy_clause_map[counterpart_id] == null) {
    diplomacy_clause_map[counterpart_id] = [];
  }
  diplomacy_clause_map[counterpart_id].push(packet);
  show_diplomacy_clauses(counterpart_id);
}

export function handle_diplomacy_remove_clause(packet: DiplomacyRemoveClausePacket): void {
  remove_clause(packet);
}

export function handle_diplomacy_accept_treaty(packet: DiplomacyAcceptTreatyPacket): void {
  accept_treaty(packet['counterpart'],
                  packet['I_accepted'],
                  packet['other_accepted']);
}

/**
 * Action selection — asking the server about possible actions for units.
 *
 * Extracted from core/control.ts
 */

import { store } from '../../data/store';
import { ACT_DEC_ACTIVE, ACT_DEC_PASSIVE, ACT_DEC_NOTHING } from '../../data/fcTypes';
import { EXTRA_NONE } from '../../data/extra';
import { IDENTITY_NUMBER_ZERO } from '../../core/constants';
import { UnitSSDataType } from '../../data/unit';
import { indexToTile as index_to_tile } from '../../data/map';
import { sendUnitGetActions, sendUnitSscsSet } from '../../net/commands';
import { game_find_unit_by_number } from '../../data/game';
import { canClientIssueOrders as can_client_issue_orders } from '../../client/clientState';
import { popup_actor_arrival } from '../../ui/options';
import * as S from './controlState';
// Circular import — OK because only used inside functions (not at init time)
import { unit_is_in_focus, unit_focus_urgent } from './unitFocus';

const FC_ACT_DEC_ACTIVE = ACT_DEC_ACTIVE;
const FC_ACT_DEC_PASSIVE = ACT_DEC_PASSIVE;
const FC_ACT_DEC_NOTHING = ACT_DEC_NOTHING;
const FC_IDENTITY_NUMBER_ZERO = IDENTITY_NUMBER_ZERO;
const FC_EXTRA_NONE = EXTRA_NONE;
const USSDT_UNQUEUE = UnitSSDataType.UNQUEUE;
const REQEST_PLAYER_INITIATED = 0;


// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function should_ask_server_for_actions(punit: any): boolean {
  return (punit['action_decision_want'] === FC_ACT_DEC_ACTIVE
    || (punit['action_decision_want'] === FC_ACT_DEC_PASSIVE
      && popup_actor_arrival));
}

export function can_ask_server_for_actions(): boolean {
  return S.action_selection_in_progress_for === FC_IDENTITY_NUMBER_ZERO;
}

export function ask_server_for_actions(punit: any): boolean {
  if (store.observing || punit == null) {
    return false;
  }

  if (S.action_selection_in_progress_for != FC_IDENTITY_NUMBER_ZERO
    && S.action_selection_in_progress_for != punit.id) {
    console.log("Unit %d started action selection before unit %d was done",
      S.action_selection_in_progress_for, punit.id);
  }
  S.setActionSelectionInProgressFor(punit.id);

  const ptile = index_to_tile(punit['action_decision_tile']);

  if (ptile != null) {
    sendUnitGetActions(
      punit['id'],
      FC_IDENTITY_NUMBER_ZERO,
      punit['action_decision_tile'],
      FC_EXTRA_NONE,
      REQEST_PLAYER_INITIATED
    );
  }
  return true;
}

export function action_selection_no_longer_in_progress(old_actor_id: number): void {
  if (old_actor_id != S.action_selection_in_progress_for
    && old_actor_id != FC_IDENTITY_NUMBER_ZERO
    && S.action_selection_in_progress_for != FC_IDENTITY_NUMBER_ZERO) {
    console.log("Decision taken for %d but selection is for %d.",
      old_actor_id, S.action_selection_in_progress_for);
  }

  S.setActionSelectionInProgressFor(FC_IDENTITY_NUMBER_ZERO);
  S.setIsMoreUserInputNeeded(false);
}

export function action_decision_clear_want(old_actor_id: number): void {
  const old = game_find_unit_by_number(old_actor_id);

  if (old != null && old['action_decision_want'] !== FC_ACT_DEC_NOTHING) {
    sendUnitSscsSet(old_actor_id, USSDT_UNQUEUE, FC_IDENTITY_NUMBER_ZERO);
  }
}

export function action_selection_next_in_focus(old_actor_id: number): void {
  for (let i = 0; i < S.current_focus.length; i++) {
    const funit = S.current_focus[i];
    if (old_actor_id != funit['id']
      && should_ask_server_for_actions(funit)) {
      ask_server_for_actions(funit);
      return;
    }
  }
}

export function action_decision_request(actor_unit: any): void {
  if (actor_unit == null) {
    console.log("action_decision_request(): No actor unit");
    return;
  }

  if (!unit_is_in_focus(actor_unit)) {
    unit_focus_urgent(actor_unit);
  } else if (can_client_issue_orders()
    && can_ask_server_for_actions()) {
    ask_server_for_actions(actor_unit);
  }
}

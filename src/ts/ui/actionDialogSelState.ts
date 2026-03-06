import {
  action_selection_in_progress_for,
  action_selection_no_longer_in_progress,
  action_decision_clear_want,
  action_selection_next_in_focus,
  is_more_user_input_needed,
  set_is_more_user_input_needed,
} from '../core/control';
import { IDENTITY_NUMBER_ZERO } from '../core/constants';
import { EXTRA_NONE } from '../data/extra';

import { popup_action_selection } from './actionDialogPopup';

const TILE_INDEX_NONE = -1;

declare const $: any; // Declare jQuery

export let action_selection_restart: boolean = false;
export let did_not_decide: boolean = false;

export function _set_action_selection_restart(val: boolean): void {
  action_selection_restart = val;
}

export function _set_did_not_decide(val: boolean): void {
  did_not_decide = val;
}

/**********************************************************************//**
  Move the queue of units that need user input forward unless the current
  unit is going to need more input.
**************************************************************************/
export function act_sel_queue_may_be_done(actor_unit_id: number): void {
  if (!is_more_user_input_needed) {
    /* The client isn't waiting for information for any unanswered follow
     * up questions. */

    if (action_selection_restart) {
      /* The action selection dialog was closed but only so it can be
       * redrawn with fresh data. */

      action_selection_restart = false;
    } else {
      /* The action selection process is over, at least for now. */
      action_selection_no_longer_in_progress(actor_unit_id);
    }

    if (did_not_decide) {
      /* The action selection dialog was closed but the player didn't
       * decide what the unit should do. */

      /* Reset so the next action selection dialog does the right thing. */
      did_not_decide = false;
    } else {
      /* An action, or no action at all, was selected. */
      action_decision_clear_want(actor_unit_id);
      action_selection_next_in_focus(actor_unit_id);
    }
  }
}

/**********************************************************************//**
  Move the queue of units that need user input forward since the
  current unit doesn't require the extra input any more.
**************************************************************************/
export function act_sel_queue_done(actor_unit_id: number): void {
  /* Stop waiting. Move on to the next queued unit. */
  set_is_more_user_input_needed(false);
  act_sel_queue_may_be_done(actor_unit_id);
  action_selection_restart = false;
  did_not_decide = false;
}

/**********************************************************************//**
  Returns the id of the actor unit currently handled in action selection
  dialog when the action selection dialog is open.
  Returns IDENTITY_NUMBER_ZERO if no action selection dialog is open.
**************************************************************************/
export function action_selection_actor_unit(): number {
  return action_selection_in_progress_for;
}

/**********************************************************************//**
  Returns id of the target city of the actions currently handled in action
  selection dialog when the action selection dialog is open and it has a
  city target. Returns IDENTITY_NUMBER_ZERO if no action selection dialog
  is open or no city target is present in the action selection dialog.
**************************************************************************/
export function action_selection_target_city(): number {
  const id = "#act_sel_dialog_" + action_selection_in_progress_for;

  if (action_selection_in_progress_for == IDENTITY_NUMBER_ZERO) {
    return IDENTITY_NUMBER_ZERO;
  }

  return $(id).attr("target_city");
}

/**********************************************************************//**
  Returns id of the target unit of the actions currently handled in action
  selection dialog when the action selection dialog is open and it has a
  unit target. Returns IDENTITY_NUMBER_ZERO if no action selection dialog
  is open or no unit target is present in the action selection dialog.
**************************************************************************/
export function action_selection_target_unit(): number {
  const id = "#act_sel_dialog_" + action_selection_in_progress_for;

  if (action_selection_in_progress_for == IDENTITY_NUMBER_ZERO) {
    return IDENTITY_NUMBER_ZERO;
  }

  return $(id).attr("target_unit");
}

/**********************************************************************//**
  Returns id of the target tile of the actions currently handled in action
  selection dialog when the action selection dialog is open and it has a
  tile target. Returns TILE_INDEX_NONE if no action selection dialog is
  open.
**************************************************************************/
export function action_selection_target_tile(): number {
  const id = "#act_sel_dialog_" + action_selection_in_progress_for;

  if (action_selection_in_progress_for == IDENTITY_NUMBER_ZERO) {
    return TILE_INDEX_NONE;
  }

  return $(id).attr("target_tile");
}

/**********************************************************************//**
  Returns id of the target extra of the actions currently handled in action
  selection dialog when the action selection dialog is open and it has an
  extra target. Returns EXTRA_NONE if no action selection dialog is open
  or no extra target is present in the action selection dialog.
**************************************************************************/
export function action_selection_target_extra(): number {
  const id = "#act_sel_dialog_" + action_selection_in_progress_for;

  if (action_selection_in_progress_for == IDENTITY_NUMBER_ZERO) {
    return EXTRA_NONE;
  }

  return $(id).attr("target_extra");
}

/**********************************************************************//**
  Updates the action selection dialog with new information.
**************************************************************************/
export function action_selection_refresh(actor_unit: any,
  target_city: any, target_unit: any, target_tile: any,
  target_extra: any,
  act_probs: any): void {
  let id: string;

  id = "#act_sel_dialog_" + actor_unit['id'];
  $(id).remove();

  popup_action_selection(actor_unit, act_probs,
    target_tile, target_extra,
    target_unit, target_city);
}

/***********************************************************************//**
  Closes the action selection dialog
***************************************************************************/
export function action_selection_close(): void {
  let id: string;
  const actor_unit_id = action_selection_in_progress_for;

  id = "#act_sel_dialog_" + actor_unit_id;
  $(id).remove();

  id = "#bribe_unit_dialog_" + actor_unit_id;
  $(id).remove();

  id = "#incite_city_dialog_" + actor_unit_id;
  $(id).remove();

  id = "#upgrade_unit_dialog_" + actor_unit_id;
  $(id).remove();

  id = "stealtech_dialog_" + actor_unit_id;
  $(id).remove();

  id = "sabotage_impr_dialog_" + actor_unit_id;
  $(id).remove();

  id = "#" + "sel_tgt_unit_dialog_" + actor_unit_id;
  $(id).remove();

  id = "#" + "sel_tgt_extra_dialog_" + actor_unit_id;
  $(id).remove();

  id = $("#city_name_dialog");
  $(id).remove();

  act_sel_queue_done(actor_unit_id);
}

import { store } from '../data/store';
import { actionProbPossible as action_prob_possible } from '../data/actions';

export type ActProb = { min: number; max: number };
export type ActProbMap = Record<number, ActProb>;

import { send_request as sendRequest } from '../net/connection';
import {
  packet_unit_action_query,
  packet_city_name_suggestion_req,
} from '../net/packetConstants';
import {
  set_is_more_user_input_needed,
  request_unit_do_action,
} from '../core/control';
import { ACTION_COUNT } from '../core/constants';
import {
  ACTION_SPY_TARGETED_STEAL_TECH,
  ACTION_SPY_TARGETED_STEAL_TECH_ESC,
  ACTION_SPY_TARGETED_SABOTAGE_CITY,
  ACTION_SPY_TARGETED_SABOTAGE_CITY_ESC,
  ACTION_SPY_INCITE_CITY,
  ACTION_SPY_INCITE_CITY_ESC,
  ACTION_SPY_BRIBE_UNIT,
  ACTION_UPGRADE_UNIT,
  ACTION_FOUND_CITY,
} from '../data/fcTypes';

import { popup_steal_tech_selection_dialog } from './actionDialogPopup';
import { act_sel_queue_may_be_done } from './actionDialogSelState';

const REQEST_PLAYER_INITIATED = 0;

// jQuery removed — using native DOM

// Re-export from data layer (moved to fix circular dependency)
export { action_prob_not_impl } from '../data/actions';

/***************************************************************************
  Returns a part of an action probability in a user readable format.
***************************************************************************/
export function format_act_prob_part(prob: number): string {
  return (prob / 2) + "%";
}

/****************************************************************************
  Format the probability that an action will be a success.
****************************************************************************/
export function format_action_probability(probability: { min: number; max: number }): string {
  if (probability['min'] == probability['max']) {
    /* This is a regular and simple chance of success. */
    return " (" + format_act_prob_part(probability['max']) + ")";
  } else if (probability['min'] < probability['max']) {
    /* This is a regular chance of success range. */
    return " ([" + format_act_prob_part(probability['min']) + ", "
      + format_act_prob_part(probability['max']) + "])";
  } else {
    /* The remaining action probabilities shouldn't be displayed. */
    return "";
  }
}

/**************************************************************************
  Format the label of an action selection button.
**************************************************************************/
export function format_action_label(action_id: number, action_probabilities: ActProbMap): string {
  return (store.actions[action_id]['ui_name'] as string).replace("%s", "").replace("%s",
    format_action_probability(action_probabilities[action_id]));
}

/**************************************************************************
  Format the tooltip of an action selection button.
**************************************************************************/
export function format_action_tooltip(act_id: number, act_probs: ActProbMap): string {
  let out: string = "";

  if (act_probs[act_id]['min'] == act_probs[act_id]['max']) {
    out = "The probability of success is ";
    out += format_act_prob_part(act_probs[act_id]['max']) + ".";
  } else if (act_probs[act_id]['min'] < act_probs[act_id]['max']) {
    out = "The probability of success is ";
    out += format_act_prob_part(act_probs[act_id]['min']);
    out += ", ";
    out += format_act_prob_part(act_probs[act_id]['max']);
    out += " or somewhere in between.";

    if (act_probs[act_id]['max'] - act_probs[act_id]['min'] > 1) {
      /* The interval is wide enough to not be caused by rounding. It is
       * therefore imprecise because the player doesn't have enough
       * information. */
      out += " (This is the most precise interval I can calculate ";
      out += "given the information our nation has access to.)";
    }
  }

  return out;
}

/**************************************************************************
  Returns the function to run when an action is selected.
**************************************************************************/
export function act_sel_click_function(parent_id: string,
  actor_unit_id: number, tgt_id: number, sub_tgt_id: number,
  action_id: number, action_probabilities: ActProbMap): () => void {
  switch (action_id) {
    case ACTION_SPY_TARGETED_STEAL_TECH:
    case ACTION_SPY_TARGETED_STEAL_TECH_ESC:
      return function () {
        popup_steal_tech_selection_dialog(store.units[actor_unit_id],
          store.cities[tgt_id],
          action_probabilities,
          action_id);

        set_is_more_user_input_needed(true);
        document.querySelector(parent_id)?.remove();
      };
    case ACTION_SPY_TARGETED_SABOTAGE_CITY:
    case ACTION_SPY_TARGETED_SABOTAGE_CITY_ESC:
    case ACTION_SPY_INCITE_CITY:
    case ACTION_SPY_INCITE_CITY_ESC:
    case ACTION_SPY_BRIBE_UNIT:
    case ACTION_UPGRADE_UNIT:
      return function () {
        const packet = {
          "pid": packet_unit_action_query,
          "actor_id": actor_unit_id,
          "target_id": tgt_id,
          "action_type": action_id,
          "request_kind": REQEST_PLAYER_INITIATED,
        };
        sendRequest(JSON.stringify(packet));

        set_is_more_user_input_needed(true);
        document.querySelector(parent_id)?.remove();
      };
    case ACTION_FOUND_CITY:
      return function () {
        /* Ask the server to suggest a city name. */
        const packet = {
          "pid": packet_city_name_suggestion_req,
          "unit_id": actor_unit_id
        };
        sendRequest(JSON.stringify(packet));

        set_is_more_user_input_needed(true);
        document.querySelector(parent_id)?.remove();
      };
    default:
      return function () {
        request_unit_do_action(action_id, actor_unit_id, tgt_id, sub_tgt_id);
        document.querySelector(parent_id)?.remove();
        act_sel_queue_may_be_done(actor_unit_id);
      };
  }
}

/**************************************************************************
  Create a button that selects an action.

  Needed because of JavaScript's scoping rules.
**************************************************************************/
export function create_act_sel_button(parent_id: string,
  actor_unit_id: number, tgt_id: number, sub_tgt_id: number,
  action_id: number, action_probabilities: ActProbMap): { id: string; class: string; text: string; title: string; click: () => void } {
  /* Create the initial button with this action */
  const button = {
    id: "act_sel_" + action_id + "_" + actor_unit_id,
    "class": 'act_sel_button',
    text: format_action_label(action_id,
      action_probabilities),
    title: format_action_tooltip(action_id,
      action_probabilities),
    click: act_sel_click_function(parent_id,
      actor_unit_id, tgt_id, sub_tgt_id,
      action_id, action_probabilities)
  };

  /* The button is ready. */
  return button;
}

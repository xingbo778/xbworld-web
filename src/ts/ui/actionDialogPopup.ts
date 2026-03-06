import { store } from '../data/store';
import { clientIsObserver, clientPlaying } from '../client/clientState';
import { unit_owner, tile_units } from '../data/unit';
import { playerInventionState as player_invention_state } from '../data/tech';
import { actionProbPossible as action_prob_possible } from '../data/actions';

import {
  set_is_more_user_input_needed,
  request_unit_do_action,
} from '../core/control';
import {
  action_selection_in_progress_for,
} from '../core/control';
import { IDENTITY_NUMBER_ZERO, ACTION_COUNT } from '../core/constants';
import { EXTRA_NONE } from '../data/extra';
import { INCITE_IMPOSSIBLE_COST } from '../data/city';
import {
  ACTION_SPY_TARGETED_STEAL_TECH,
  ACTION_SPY_TARGETED_STEAL_TECH_ESC,
  ATK_CITY,
  ATK_UNIT,
  ATK_UNITS,
  ATK_TILE,
  ATK_EXTRAS,
  ATK_SELF,
  ATK_COUNT,
  ACTION_ATTACK,
  TECH_KNOWN,
  TECH_PREREQS_KNOWN,
  TECH_UNKNOWN,
  ACTION_SPY_STEAL_TECH_ESC,
  ACTION_SPY_STEAL_TECH,
} from '../data/fcTypes';
import { logNormal, logError } from '../core/log';

import { create_act_sel_button } from './actionDialogFormat';
import {
  act_sel_queue_may_be_done,
  act_sel_queue_done,
  action_selection_close,
  _set_action_selection_restart,
  _set_did_not_decide,
} from './actionDialogSelState';
import { select_tgt_unit, select_tgt_extra, list_potential_target_extras } from './actionDialogTargets';

const TILE_INDEX_NONE = -1;

declare const $: any; // Declare jQuery

let auto_attack: boolean = false;

/****************************************************************************
  Ask the player to select an action.
****************************************************************************/
export function popup_action_selection(actor_unit: any, action_probabilities: any,
  target_tile: any, target_extra: any,
  target_unit: any, target_city: any): void {
  if (clientIsObserver()) return;
  // reset dialog page.
  const id = "#act_sel_dialog_" + actor_unit['id'];
  $(id).remove();
  $("<div id='act_sel_dialog_" + actor_unit['id'] + "'></div>").appendTo("div#game_page");

  if (action_selection_in_progress_for != IDENTITY_NUMBER_ZERO
    && action_selection_in_progress_for != actor_unit['id']) {
    logNormal("Looks like unit %d has an action selection dialog open"
      + " but a dialog for unit %d is about to be opened.",
      action_selection_in_progress_for, actor_unit['id']);
    logNormal("Closing the action selection dialog for unit %d",
      action_selection_in_progress_for);
    action_selection_close();
  }

  const actor_homecity = store.cities[actor_unit['homecity']];

  const buttons: any[] = [];

  let dhtml: string = "";

  if (target_city != null) {
    dhtml += "Your " + store.unitTypes[actor_unit['type']]['name'];

    /* Some units don't have a home city. */
    if (actor_homecity != null) {
      dhtml += " from " + decodeURIComponent(actor_homecity['name']);
    }

    dhtml += " has arrived at " + decodeURIComponent(target_city['name'])
      + ". What is your command?";
  } else if (target_unit != null) {
    dhtml += "Your " + store.unitTypes[actor_unit['type']]['name']
      + " is ready to act against "
      + store.nations[unit_owner(target_unit)!['nation']]['adjective']
      + " " + store.unitTypes[target_unit['type']]['name'] + ".";
  } else {
    dhtml += "Your " + store.unitTypes[actor_unit['type']]['name']
      + " is waiting for your command.";
  }

  $(id).html(dhtml);

  /* Store actor and target information in the dialog */
  $(id).attr("actor_unit", actor_unit != null ? actor_unit['id']
    : IDENTITY_NUMBER_ZERO);
  $(id).attr("target_city", target_city != null ? target_city['id']
    : IDENTITY_NUMBER_ZERO);
  $(id).attr("target_unit", target_unit != null ? target_unit['id']
    : IDENTITY_NUMBER_ZERO);
  $(id).attr("target_tile", target_tile != null ? target_tile['index']
    : TILE_INDEX_NONE);
  $(id).attr("target_extra", target_extra != null ? target_extra['id']
    : EXTRA_NONE);

  /* Show a button for each enabled action. The buttons are sorted by
   * target kind first and then by action id number. */
  for (let tgt_kind = ATK_CITY; tgt_kind < ATK_COUNT; tgt_kind++) {
    let tgt_id: number = -1;
    let sub_tgt_id: number = -1;

    switch (tgt_kind) {
      case ATK_CITY:
        if (target_city != null) {
          tgt_id = target_city['id'];
        }
        break;
      case ATK_UNIT:
        if (target_unit != null) {
          tgt_id = target_unit['id'];
        }
        break;
      case ATK_UNITS:
        if (target_tile != null) {
          tgt_id = target_tile['index'];
        }
        break;
      case ATK_TILE:
      case ATK_EXTRAS:
        if (target_tile != null) {
          tgt_id = target_tile['index'];
        }
        if (target_extra != null) {
          sub_tgt_id = target_extra['id'];
        }
        break;
      case ATK_SELF:
        if (actor_unit != null) {
          tgt_id = actor_unit['id'];
        }
        break;
      default:
        logError("Unsupported action target kind " + tgt_kind);
        break;
    }

    for (let action_id = 0; action_id < ACTION_COUNT; action_id++) {
      if ((window as any).actions[action_id]['tgt_kind'] == tgt_kind
        && action_prob_possible(
          action_probabilities[action_id])) {
        buttons.push(create_act_sel_button(id, actor_unit['id'],
          tgt_id, sub_tgt_id, action_id,
          action_probabilities));
      }
    }
  }

  if (target_unit != null
    && tile_units(target_tile)!.length > 1) {
    buttons.push({
      id: "act_sel_tgt_unit_switch" + actor_unit['id'],
      "class": 'act_sel_button',
      text: 'Change unit target',
      click: function () {
        select_tgt_unit(actor_unit,
          target_tile, tile_units(target_tile) ?? []);

        _set_action_selection_restart(true);
        $(id).dialog('close');
      }
    });
  }

  if (target_extra != null) {
    buttons.push({
      id: "act_sel_tgt_extra_switch" + actor_unit['id'],
      "class": 'act_sel_button',
      text: 'Change extra target',
      click: function () {
        select_tgt_extra(actor_unit, target_unit, target_tile,
          list_potential_target_extras(actor_unit,
            target_tile));

        _set_action_selection_restart(true);
        $(id).dialog('close');
      }
    });
  }

  /* Special-case handling for auto-attack. */
  if (action_prob_possible(action_probabilities[ACTION_ATTACK])) {
    if (!auto_attack) {
      const button = {
        id: "act_sel_" + ACTION_ATTACK + "_" + actor_unit['id'],
        "class": 'act_sel_button',
        text: "Auto attack from now on!",
        title: "Attack without showing this attack dialog in the future",
        click: function () {
          request_unit_do_action(ACTION_ATTACK,
            actor_unit['id'], target_tile['index']);
          auto_attack = true;
          $(id).remove();
          act_sel_queue_may_be_done(actor_unit['id']);
        }
      };
      buttons.push(button);
    }
  }

  buttons.push({
    id: "act_sel_wait" + actor_unit['id'],
    "class": 'act_sel_button',
    text: 'Wait',
    click: function () {
      _set_did_not_decide(true);
      $(id).dialog("close");
    }
  });

  buttons.push({
    id: "act_sel_cancel" + actor_unit['id'],
    "class": 'act_sel_button',
    text: 'Cancel',
    click: function () {
      $(id).remove();
      act_sel_queue_may_be_done(actor_unit['id']);
    }
  });

  $(id).attr("title",
    "Choose Your " + store.unitTypes[actor_unit['type']]['name']
    + "'s Strategy");
  $(id).dialog({
    bgiframe: true,
    modal: true,
    dialogClass: "act_sel_dialog",
    width: "390",
    close: function () {
      act_sel_queue_may_be_done(actor_unit['id']);
    },
    buttons: buttons
  });

  $(id).dialog('open');
  set_is_more_user_input_needed(false);
}

/**************************************************************************
  Show the player the price of bribing the unit and, if bribing is
  possible, allow him to order it done.
**************************************************************************/
export function popup_bribe_dialog(actor_unit: any, target_unit: any, cost: number, act_id: number): void {
  let bribe_possible: boolean = false;
  let dhtml: string = "";
  const id = "#bribe_unit_dialog_" + actor_unit['id'];

  /* Reset dialog page. */
  $(id).remove();

  $("<div id='bribe_unit_dialog_" + actor_unit['id'] + "'></div>")
    .appendTo("div#game_page");

  dhtml += "Treasury contains " + unit_owner(actor_unit)!['gold'] + " gold. ";
  dhtml += "The price of bribing "
    + store.nations[unit_owner(target_unit)!['nation']]['adjective']
    + " " + store.unitTypes[target_unit['type']]['name']
    + " is " + cost + ". ";

  bribe_possible = cost <= unit_owner(actor_unit)!['gold'];

  if (!bribe_possible) {
    dhtml += "Traitors Demand Too Much!";
    dhtml += "<br>";
  }

  $(id).html(dhtml);

  const close_button = { Close: function () { $(id).dialog('close'); } };
  const bribe_close_button = {
    "Cancel": function () { $(id).dialog('close'); },
    "Do it!": function () {
      request_unit_do_action(act_id, actor_unit['id'], target_unit['id']);
      $(id).dialog('close');
    }
  };

  $(id).attr("title", "About that bribery you requested...");

  $(id).dialog({
    bgiframe: true,
    modal: true,
    close: function () {
      act_sel_queue_done(actor_unit['id']);
    },
    buttons: (bribe_possible ? bribe_close_button : close_button),
    height: "auto",
    width: "auto"
  });

  $(id).dialog('open');

}

/**************************************************************************
  Show the player the price of inviting the city and, if inciting is
  possible, allow him to order it done.
**************************************************************************/
export function popup_incite_dialog(actor_unit: any, target_city: any, cost: number, act_id: number): void {
  let incite_possible: boolean;
  let id: string;
  let dhtml: string;

  id = "#incite_city_dialog_" + actor_unit['id'];

  /* Reset dialog page. */
  $(id).remove();

  $("<div id='incite_city_dialog_" + actor_unit['id'] + "'></div>")
    .appendTo("div#game_page");

  dhtml = "";

  dhtml += "Treasury contains " + unit_owner(actor_unit)!['gold'] + " gold.";
  dhtml += " ";
  dhtml += "The price of inciting "
    + decodeURIComponent(target_city['name'])
    + " is " + cost + ".";

  incite_possible = cost != INCITE_IMPOSSIBLE_COST
    && cost <= unit_owner(actor_unit)!['gold'];

  if (!incite_possible) {
    dhtml += " ";
    dhtml += "Traitors Demand Too Much!";
    dhtml += "<br>";
  }

  $(id).html(dhtml);

  const close_button = { Close: function () { $(id).dialog('close'); } };
  const incite_close_buttons = {
    'Cancel': function () { $(id).dialog('close'); },
    'Do it!': function () {
      request_unit_do_action(act_id, actor_unit['id'], target_city['id']);
      $(id).dialog('close');
    }
  };

  $(id).attr("title", "About that incite you requested...");

  $(id).dialog({
    bgiframe: true,
    modal: true,
    close: function () {
      act_sel_queue_done(actor_unit['id']);
    },
    buttons: (incite_possible ? incite_close_buttons : close_button),
    height: "auto",
    width: "auto"
  });

  $(id).dialog('open');
}

/**************************************************************************
  Show the player the price of upgrading the unit and, if upgrading is
  affordable, allow him to order it done.
**************************************************************************/
export function popup_unit_upgrade_dlg(actor_unit: any, target_city: any, cost: number, act_id: number): void {
  let upgrade_possible: boolean;
  let id: string;
  let dhtml: string;

  id = "#upgrade_unit_dialog_" + actor_unit['id'];

  /* Reset dialog page. */
  $(id).remove();

  $("<div id='upgrade_unit_dialog_" + actor_unit['id'] + "'></div>")
    .appendTo("div#game_page");

  dhtml = "";

  dhtml += "Treasury contains " + unit_owner(actor_unit)!['gold'] + " gold.";
  dhtml += " ";
  dhtml += "The price of upgrading our "
    + store.unitTypes[actor_unit['type']]['name']
    + " is " + cost + ".";

  upgrade_possible = cost <= unit_owner(actor_unit)!['gold'];

  $(id).html(dhtml);

  const close_button = { Close: function () { $(id).dialog('close'); } };
  const upgrade_close_buttons = {
    'Cancel': function () { $(id).dialog('close'); },
    'Do it!': function () {
      request_unit_do_action(act_id, actor_unit['id'], target_city['id']);
      $(id).dialog('close');
    }
  };

  $(id).attr("title", "Unit upgrade");

  $(id).dialog({
    bgiframe: true,
    modal: true,
    close: function () {
      act_sel_queue_done(actor_unit['id']);
    },
    buttons: (upgrade_possible ? upgrade_close_buttons
      : close_button),
    height: "auto",
    width: "auto"
  });

  $(id).dialog('open');
}

/**************************************************************************
  Create a button that steals a tech.

  Needed because of JavaScript's scoping rules.
**************************************************************************/
export function create_steal_tech_button(parent_id: string, tech: any,
  actor_id: number, city_id: number, action_id: number): any {
  /* Create the initial button with this tech */
  const button = {
    text: tech['name'],
    click: function () {
      request_unit_do_action(action_id, actor_id, city_id, tech['id']);
      $("#" + parent_id).remove();
      act_sel_queue_done(actor_id);
    }
  };

  /* The button is ready. */
  return button;
}

/**************************************************************************
  Select what tech to steal when doing targeted tech theft.
**************************************************************************/
export function popup_steal_tech_selection_dialog(actor_unit: any, target_city: any,
  act_probs: any, action_id: number): void {
  const id = "stealtech_dialog_" + actor_unit['id'];
  const buttons: any[] = [];
  let untargeted_action_id: number = ACTION_COUNT;

  /* Reset dialog page. */
  $("#" + id).remove();
  $("<div id='" + id + "'></div>").appendTo("div#game_page");

  /* Set dialog title */
  $("#" + id).attr("title", "Select Advance to Steal");

  /* List the alternatives */
  for (const tech_id in store.techs) {
    /* JavaScript for each iterates over keys. */
    const tech = store.techs[tech_id];

    /* Actor and target player tech known state. */
    const act_kn = player_invention_state(clientPlaying(), tech['id']);
    const tgt_kn = player_invention_state(target_city['owner'], tech['id']);

    /* Can steal a tech if the target player knows it and the actor player
     * has the pre requirements. Some rulesets allows the player to steal
     * techs the player don't know the prereqs of. */
    if ((tgt_kn == TECH_KNOWN)
      && ((act_kn == TECH_PREREQS_KNOWN)
        || ((store.gameInfo as any)['tech_steal_allow_holes']
          && (act_kn == TECH_UNKNOWN)))) {
      /* Add a button for stealing this tech to the dialog. */
      buttons.push(create_steal_tech_button(id, tech,
        actor_unit['id'],
        target_city['id'],
        action_id));
    }
  }

  /* The player may change his mind after selecting targeted tech theft and
   * go for the untargeted version after concluding that no listed tech is
   * worth the extra risk. */
  if (action_id == ACTION_SPY_TARGETED_STEAL_TECH_ESC) {
    untargeted_action_id = ACTION_SPY_STEAL_TECH_ESC;
  } else if (action_id == ACTION_SPY_TARGETED_STEAL_TECH) {
    untargeted_action_id = ACTION_SPY_STEAL_TECH;
  }

  if (untargeted_action_id != ACTION_COUNT
    && action_prob_possible(
      act_probs[untargeted_action_id])) {
    /* Untargeted tech theft may be legal. Add it as an alternative. */
    buttons.push({
      text: "At " + store.unitTypes[actor_unit['type']]['name']
        + "'s Discretion",
      click: function () {
        request_unit_do_action(untargeted_action_id,
          actor_unit['id'], target_city['id']);
        $("#" + id).remove();
        act_sel_queue_done(actor_unit['id']);
      }
    });
  }

  /* Allow the user to cancel. */
  buttons.push({
    text: 'Cancel',
    click: function () {
      $("#" + id).remove();
      act_sel_queue_done(actor_unit['id']);
    }
  });

  /* Create the dialog. */
  $("#" + id).dialog({
    modal: true,
    close: function () {
      act_sel_queue_done(actor_unit['id']);
    },
    buttons: buttons,
    width: "90%"
  });

  /* Show the dialog. */
  $("#" + id).dialog('open');
}

/**************************************************************************
  Create a button that orders a spy to try to sabotage an improvement.

  Needed because of JavaScript's scoping rules.
**************************************************************************/
export function create_sabotage_impr_button(improvement: any, parent_id: string,
  actor_unit_id: number, target_city_id: number, act_id: number): any {
  /* Create the initial button with this tech */
  return {
    text: improvement['name'],
    click: function () {
      request_unit_do_action(act_id, actor_unit_id, target_city_id,
        improvement['id']);
      $("#" + parent_id).remove();
      act_sel_queue_done(actor_unit_id);
    }
  };
}

/**************************************************************************
  Select what improvement to sabotage when doing targeted sabotage city.
**************************************************************************/
export function popup_sabotage_dialog(actor_unit: any, target_city: any, city_imprs: any, act_id: number): void {
  const id = "sabotage_impr_dialog_" + actor_unit['id'];
  const buttons: any[] = [];

  /* Reset dialog page. */
  $("#" + id).remove();
  $("<div id='" + id + "'></div>").appendTo("div#game_page");

  /* Set dialog title */
  $("#" + id).attr("title", "Select Improvement to Sabotage");

  /* List the alternatives */
  for (let i = 0; i < ((store.rulesControl as any)?.['num_impr_types'] ?? 0); i++) {
    const improvement: any = store.improvements[i];

    if (city_imprs.isSet(i)
      && improvement['sabotage'] > 0) {
      /* The building is in the city. The probability of successfully
       * sabotaging it is above zero. */
      buttons.push(create_sabotage_impr_button(improvement, id,
        actor_unit['id'],
        target_city['id'],
        act_id));
    }
  }

  /* Allow the user to cancel. */
  buttons.push({
    text: 'Cancel',
    click: function () {
      $("#" + id).remove();
      act_sel_queue_done(actor_unit['id']);
    }
  });

  /* Create the dialog. */
  $("#" + id).dialog({
    modal: true,
    close: function () {
      act_sel_queue_done(actor_unit['id']);
    },
    buttons: buttons,
    width: "90%"
  });

  /* Show the dialog. */
  $("#" + id).dialog('open');
}

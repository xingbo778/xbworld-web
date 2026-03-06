import { setHtml } from '../utils/dom';
import { store } from '../data/store';
import { clientIsObserver, clientPlaying } from '../client/clientState';
import { unit_owner, tile_units } from '../data/unit';
import { playerInventionState as player_invention_state } from '../data/tech';
import { actionProbPossible as action_prob_possible } from '../data/actions';

import type { Unit, City, Tile, Extra, Tech, Improvement } from '../data/types';
import { BitVector } from '../utils/bitvector';

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

import { create_act_sel_button, type ActProbMap } from './actionDialogFormat';
import {
  act_sel_queue_may_be_done,
  act_sel_queue_done,
  action_selection_close,
  _set_action_selection_restart,
  _set_did_not_decide,
} from './actionDialogSelState';
import { select_tgt_unit, select_tgt_extra, list_potential_target_extras } from './actionDialogTargets';

const TILE_INDEX_NONE = -1;

let auto_attack: boolean = false;

/**
 * Helper: create a native dialog div with buttons.
 * Replaces jQuery UI dialog pattern.
 */
function createNativeDialog(
  dlgId: string,
  title: string,
  content: string,
  buttons: { text: string; id?: string; class?: string; title?: string; click: () => void }[],
  opts?: { width?: string; onClose?: () => void }
): HTMLDivElement {
  document.getElementById(dlgId)?.remove();

  const dlg = document.createElement('div');
  dlg.id = dlgId;
  dlg.className = 'act_sel_dialog';
  const w = opts?.width || '390px';
  dlg.style.cssText = 'position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:20%;left:50%;transform:translateX(-50%);width:' + w + ';max-height:70vh;overflow-y:auto;color:#fff;';

  if (title) {
    const h = document.createElement('h3');
    h.textContent = title;
    h.style.cssText = 'margin:0 0 8px;';
    dlg.appendChild(h);
  }

  if (content) {
    const body = document.createElement('div');
    setHtml(body, content);
    dlg.appendChild(body);
  }

  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;';
  for (const b of buttons) {
    const btn = document.createElement('button');
    if (b.id) btn.id = b.id;
    if (b.class) btn.className = b.class;
    btn.textContent = b.text;
    if (b.title) btn.title = b.title;
    btn.addEventListener('click', b.click);
    btnContainer.appendChild(btn);
  }
  dlg.appendChild(btnContainer);

  document.getElementById('game_page')?.appendChild(dlg);
  return dlg;
}

function removeDialog(dlgId: string): void {
  document.getElementById(dlgId)?.remove();
}

/****************************************************************************
  Ask the player to select an action.
****************************************************************************/
export function popup_action_selection(actor_unit: Unit, action_probabilities: ActProbMap,
  target_tile: Tile | null, target_extra: Extra | null,
  target_unit: Unit | null, target_city: City | null): void {
  if (clientIsObserver()) return;

  const dlgId = "act_sel_dialog_" + actor_unit['id'];

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

  let dhtml: string = "";

  if (target_city != null) {
    dhtml += "Your " + store.unitTypes[actor_unit['type']]['name'];
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

  const buttons: { text: string; id?: string; class?: string; title?: string; click: () => void }[] = [];

  /* Show a button for each enabled action. */
  for (let tgt_kind = ATK_CITY; tgt_kind < ATK_COUNT; tgt_kind++) {
    let tgt_id: number = -1;
    let sub_tgt_id: number = -1;

    switch (tgt_kind) {
      case ATK_CITY:
        if (target_city != null) tgt_id = target_city['id'];
        break;
      case ATK_UNIT:
        if (target_unit != null) tgt_id = target_unit['id'];
        break;
      case ATK_UNITS:
        if (target_tile != null) tgt_id = target_tile['index'];
        break;
      case ATK_TILE:
      case ATK_EXTRAS:
        if (target_tile != null) tgt_id = target_tile['index'];
        if (target_extra != null) sub_tgt_id = target_extra['id'];
        break;
      case ATK_SELF:
        if (actor_unit != null) tgt_id = actor_unit['id'];
        break;
      default:
        logError("Unsupported action target kind " + tgt_kind);
        break;
    }

    for (let action_id = 0; action_id < ACTION_COUNT; action_id++) {
      if (store.actions[action_id]['tgt_kind'] == tgt_kind
        && action_prob_possible(action_probabilities[action_id])) {
        const b = create_act_sel_button("#" + dlgId, actor_unit['id'],
          tgt_id, sub_tgt_id, action_id, action_probabilities);
        buttons.push({ text: b.text, id: b.id, class: b['class'], title: b.title, click: b.click });
      }
    }
  }

  if (target_unit != null && tile_units(target_tile)!.length > 1) {
    buttons.push({
      id: "act_sel_tgt_unit_switch" + actor_unit['id'],
      class: 'act_sel_button',
      text: 'Change unit target',
      click: function () {
        select_tgt_unit(actor_unit, target_tile, tile_units(target_tile) ?? []);
        _set_action_selection_restart(true);
        removeDialog(dlgId);
      }
    });
  }

  if (target_extra != null) {
    buttons.push({
      id: "act_sel_tgt_extra_switch" + actor_unit['id'],
      class: 'act_sel_button',
      text: 'Change extra target',
      click: function () {
        select_tgt_extra(actor_unit, target_unit, target_tile,
          list_potential_target_extras(actor_unit, target_tile));
        _set_action_selection_restart(true);
        removeDialog(dlgId);
      }
    });
  }

  if (action_prob_possible(action_probabilities[ACTION_ATTACK])) {
    if (!auto_attack) {
      buttons.push({
        id: "act_sel_" + ACTION_ATTACK + "_" + actor_unit['id'],
        class: 'act_sel_button',
        text: "Auto attack from now on!",
        title: "Attack without showing this attack dialog in the future",
        click: function () {
          request_unit_do_action(ACTION_ATTACK, actor_unit['id'], target_tile!['index']);
          auto_attack = true;
          removeDialog(dlgId);
          act_sel_queue_may_be_done(actor_unit['id']);
        }
      });
    }
  }

  buttons.push({
    id: "act_sel_wait" + actor_unit['id'],
    class: 'act_sel_button',
    text: 'Wait',
    click: function () {
      _set_did_not_decide(true);
      removeDialog(dlgId);
      act_sel_queue_may_be_done(actor_unit['id']);
    }
  });

  buttons.push({
    id: "act_sel_cancel" + actor_unit['id'],
    class: 'act_sel_button',
    text: 'Cancel',
    click: function () {
      removeDialog(dlgId);
      act_sel_queue_may_be_done(actor_unit['id']);
    }
  });

  const dlg = createNativeDialog(
    dlgId,
    "Choose Your " + store.unitTypes[actor_unit['type']]['name'] + "'s Strategy",
    dhtml,
    buttons
  );

  /* Store actor and target information in the dialog */
  dlg.setAttribute("actor_unit", String(actor_unit != null ? actor_unit['id'] : IDENTITY_NUMBER_ZERO));
  dlg.setAttribute("target_city", String(target_city != null ? target_city['id'] : IDENTITY_NUMBER_ZERO));
  dlg.setAttribute("target_unit", String(target_unit != null ? target_unit['id'] : IDENTITY_NUMBER_ZERO));
  dlg.setAttribute("target_tile", String(target_tile != null ? target_tile['index'] : TILE_INDEX_NONE));
  dlg.setAttribute("target_extra", String(target_extra != null ? target_extra['id'] : EXTRA_NONE));

  set_is_more_user_input_needed(false);
}

/**************************************************************************
  Show the player the price of bribing the unit.
**************************************************************************/
export function popup_bribe_dialog(actor_unit: Unit, target_unit: Unit, cost: number, act_id: number): void {
  const dlgId = "bribe_unit_dialog_" + actor_unit['id'];
  let dhtml = "";

  dhtml += "Treasury contains " + unit_owner(actor_unit)!['gold'] + " gold. ";
  dhtml += "The price of bribing "
    + store.nations[unit_owner(target_unit)!['nation']]['adjective']
    + " " + store.unitTypes[target_unit['type']]['name']
    + " is " + cost + ". ";

  const bribe_possible = cost <= unit_owner(actor_unit)!['gold'];
  if (!bribe_possible) {
    dhtml += "Traitors Demand Too Much!<br>";
  }

  const buttons: { text: string; click: () => void }[] = [];
  if (bribe_possible) {
    buttons.push({
      text: 'Do it!',
      click: function () {
        request_unit_do_action(act_id, actor_unit['id'], target_unit['id']);
        removeDialog(dlgId);
        act_sel_queue_done(actor_unit['id']);
      }
    });
  }
  buttons.push({
    text: bribe_possible ? 'Cancel' : 'Close',
    click: function () {
      removeDialog(dlgId);
      act_sel_queue_done(actor_unit['id']);
    }
  });

  createNativeDialog(dlgId, "About that bribery you requested...", dhtml, buttons);
}

/**************************************************************************
  Show the player the price of inciting the city.
**************************************************************************/
export function popup_incite_dialog(actor_unit: Unit, target_city: City, cost: number, act_id: number): void {
  const dlgId = "incite_city_dialog_" + actor_unit['id'];
  let dhtml = "";

  dhtml += "Treasury contains " + unit_owner(actor_unit)!['gold'] + " gold. ";
  dhtml += "The price of inciting "
    + decodeURIComponent(target_city['name'])
    + " is " + cost + ".";

  const incite_possible = cost != INCITE_IMPOSSIBLE_COST
    && cost <= unit_owner(actor_unit)!['gold'];

  if (!incite_possible) {
    dhtml += " Traitors Demand Too Much!<br>";
  }

  const buttons: { text: string; click: () => void }[] = [];
  if (incite_possible) {
    buttons.push({
      text: 'Do it!',
      click: function () {
        request_unit_do_action(act_id, actor_unit['id'], target_city['id']);
        removeDialog(dlgId);
        act_sel_queue_done(actor_unit['id']);
      }
    });
  }
  buttons.push({
    text: incite_possible ? 'Cancel' : 'Close',
    click: function () {
      removeDialog(dlgId);
      act_sel_queue_done(actor_unit['id']);
    }
  });

  createNativeDialog(dlgId, "About that incite you requested...", dhtml, buttons);
}

/**************************************************************************
  Show the player the price of upgrading the unit.
**************************************************************************/
export function popup_unit_upgrade_dlg(actor_unit: Unit, target_city: City, cost: number, act_id: number): void {
  const dlgId = "upgrade_unit_dialog_" + actor_unit['id'];
  let dhtml = "";

  dhtml += "Treasury contains " + unit_owner(actor_unit)!['gold'] + " gold. ";
  dhtml += "The price of upgrading our "
    + store.unitTypes[actor_unit['type']]['name']
    + " is " + cost + ".";

  const upgrade_possible = cost <= unit_owner(actor_unit)!['gold'];

  const buttons: { text: string; click: () => void }[] = [];
  if (upgrade_possible) {
    buttons.push({
      text: 'Do it!',
      click: function () {
        request_unit_do_action(act_id, actor_unit['id'], target_city['id']);
        removeDialog(dlgId);
        act_sel_queue_done(actor_unit['id']);
      }
    });
  }
  buttons.push({
    text: upgrade_possible ? 'Cancel' : 'Close',
    click: function () {
      removeDialog(dlgId);
      act_sel_queue_done(actor_unit['id']);
    }
  });

  createNativeDialog(dlgId, "Unit upgrade", dhtml, buttons);
}

/**************************************************************************
  Create a button that steals a tech.
**************************************************************************/
export function create_steal_tech_button(parent_id: string, tech: Tech,
  actor_id: number, city_id: number, action_id: number): { text: string; click: () => void } {
  return {
    text: tech['name'],
    click: function () {
      request_unit_do_action(action_id, actor_id, city_id, tech['id']);
      removeDialog(parent_id);
      act_sel_queue_done(actor_id);
    }
  };
}

/**************************************************************************
  Select what tech to steal when doing targeted tech theft.
**************************************************************************/
export function popup_steal_tech_selection_dialog(actor_unit: Unit, target_city: City,
  act_probs: ActProbMap, action_id: number): void {
  const dlgId = "stealtech_dialog_" + actor_unit['id'];
  const buttons: { text: string; click: () => void }[] = [];
  let untargeted_action_id: number = ACTION_COUNT;

  for (const tech_id in store.techs) {
    const tech = store.techs[tech_id];
    const act_kn = player_invention_state(clientPlaying()!, tech['id']);
    const tgt_kn = player_invention_state(store.players[target_city['owner'] as number], tech['id']);

    if ((tgt_kn == TECH_KNOWN)
      && ((act_kn == TECH_PREREQS_KNOWN)
        || (store.gameInfo?.['tech_steal_allow_holes']
          && (act_kn == TECH_UNKNOWN)))) {
      buttons.push(create_steal_tech_button(dlgId, tech,
        actor_unit['id'], target_city['id'], action_id));
    }
  }

  if (action_id == ACTION_SPY_TARGETED_STEAL_TECH_ESC) {
    untargeted_action_id = ACTION_SPY_STEAL_TECH_ESC;
  } else if (action_id == ACTION_SPY_TARGETED_STEAL_TECH) {
    untargeted_action_id = ACTION_SPY_STEAL_TECH;
  }

  if (untargeted_action_id != ACTION_COUNT
    && action_prob_possible(act_probs[untargeted_action_id])) {
    buttons.push({
      text: "At " + store.unitTypes[actor_unit['type']]['name'] + "'s Discretion",
      click: function () {
        request_unit_do_action(untargeted_action_id,
          actor_unit['id'], target_city['id']);
        removeDialog(dlgId);
        act_sel_queue_done(actor_unit['id']);
      }
    });
  }

  buttons.push({
    text: 'Cancel',
    click: function () {
      removeDialog(dlgId);
      act_sel_queue_done(actor_unit['id']);
    }
  });

  createNativeDialog(dlgId, "Select Advance to Steal", "", buttons, { width: '90%' });
}

/**************************************************************************
  Create a button that orders a spy to try to sabotage an improvement.
**************************************************************************/
export function create_sabotage_impr_button(improvement: Improvement, parent_id: string,
  actor_unit_id: number, target_city_id: number, act_id: number): { text: string; click: () => void } {
  return {
    text: improvement['name'],
    click: function () {
      request_unit_do_action(act_id, actor_unit_id, target_city_id,
        improvement['id']);
      removeDialog(parent_id);
      act_sel_queue_done(actor_unit_id);
    }
  };
}

/**************************************************************************
  Select what improvement to sabotage when doing targeted sabotage city.
**************************************************************************/
export function popup_sabotage_dialog(actor_unit: Unit, target_city: City, city_imprs: BitVector, act_id: number): void {
  const dlgId = "sabotage_impr_dialog_" + actor_unit['id'];
  const buttons: { text: string; click: () => void }[] = [];

  for (let i = 0; i < ((store.rulesControl?.['num_impr_types'] as number) ?? 0); i++) {
    const improvement: Improvement = store.improvements[i];
    if (city_imprs.isSet(i) && (improvement['sabotage'] as number) > 0) {
      buttons.push(create_sabotage_impr_button(improvement, dlgId,
        actor_unit['id'], target_city['id'], act_id));
    }
  }

  buttons.push({
    text: 'Cancel',
    click: function () {
      removeDialog(dlgId);
      act_sel_queue_done(actor_unit['id']);
    }
  });

  createNativeDialog(dlgId, "Select Improvement to Sabotage", "", buttons, { width: '90%' });
}

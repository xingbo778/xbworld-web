/**********************************************************************
    Freeciv-web - the web version of Freeciv. https://www.freeciv.org/
    Copyright (C) 2009-2017  The Freeciv-web project

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

***********************************************************************/

declare const $: any;
declare const Handlebars: any;

import { store } from '../data/store';
import { player_capital, get_diplstate_text, research_get, DiplState } from '../data/player';
import { TECH_KNOWN } from '../data/tech';
import { clientIsObserver as client_is_observer } from '../client/clientState';
import { showDialogMessage as show_dialog_message } from '../client/civClient';
import { governments } from '../ui/governmentDialog';

export function show_intelligence_report_dialog(): void {
  const selected_player = (window as any).selected_player;
  if (selected_player === -1) return;
  const pplayer: any = store.players[selected_player];

  if (client_is_observer()
      || store.client.conn.playing!['real_embassy'].isSet(selected_player)) {
    show_intelligence_report_embassy(pplayer);
  } else {
    show_intelligence_report_hearsay(pplayer);
  }
}

export function show_intelligence_report_hearsay(pplayer: any): void {
  let msg: string = "Ruler " + pplayer['name'] + "<br>";
  if (pplayer['government'] > 0) {
    msg += "Government: " + governments[pplayer['government']]['name'] + "<br>";
  }

  if (pplayer['gold'] > 0) {
    msg += "Gold: " + pplayer['gold'] + "<br>";
  }

  if (pplayer['researching'] != null && pplayer['researching'] > 0 && store.techs[pplayer['researching']] != null) {
    msg += "Researching: " + store.techs[pplayer['researching']]['name'] + "<br>";
  }

  msg += "<br><br>Establishing an embassy will show a detailed intelligence report.";

  show_dialog_message("Intelligence report for " + pplayer['name'],
      msg);
}

export function show_intelligence_report_embassy(pplayer: any): void {
  // reset dialog page.
  $("#intel_dialog").remove();
  $("<div id='intel_dialog'></div>").appendTo("div#game_page");

  const capital: any = player_capital(pplayer);

  const intel_data: any = {
    ruler: pplayer['name'],
    government: governments[pplayer['government']]['name'],
    capital: capital ? capital.name : '(capital unknown)',
    gold: pplayer['gold'],
    tax: pplayer['tax'] + '%',
    science: pplayer['science'] + '%',
    luxury: pplayer['luxury'] + '%',
    researching: '(Unknown)',
    culture: pplayer['culture'],
    dipl: [],
    tech: []
  };

  // TODO: future techs
  const research: any = research_get(pplayer);
  if (research !== undefined) {
    const researching: any = store.techs[research['researching']];
    if (researching !== undefined) {
      intel_data['researching'] = researching['name'] + ' ('
                                + research['bulbs_researched'] + '/'
                                + research['researching_cost'] + ')';
    } else {
      intel_data['researching'] = '(Nothing)';
    }
    const myresearch: any = client_is_observer()
                     ? null
                     : research_get(store.client.conn.playing)['inventions'];
    for (const tech_id in store.techs) {
      if (research['inventions'][tech_id] === TECH_KNOWN) {
        intel_data['tech'].push({
          name: store.techs[tech_id]['name'],
          who: (myresearch != null && myresearch[tech_id] === TECH_KNOWN)
                           ? 'both' : 'them'
        });
      }
    }
  }

  if (pplayer['diplstates'] !== undefined) {
    pplayer['diplstates'].forEach(function (st: any, i: number) {
      if (st['state'] !== DiplState.DS_NO_CONTACT && i !== pplayer['playerno']) {
        let dplst: any = intel_data['dipl'][st['state']];
        if (dplst === undefined) {
          dplst = {
            state: get_diplstate_text(st['state']),
            nations: []
          };
          intel_data['dipl'][st['state']] = dplst;
        }
        dplst['nations'].push(store.nations[store.players[i]['nation']]['adjective']);
      }
    });
  }

  $("#intel_dialog").html(Handlebars.templates['intel'](intel_data));
  $("#intel_dialog").dialog({
    bgiframe: true,
    modal: true,
    title: "Foreign Intelligence: "
                             + store.nations[pplayer['nation']]['adjective']
                             + " Empire",
    width: "auto"
  });

  $("#intel_dialog").dialog('open');
  $("#intel_tabs").tabs();
  $("#game_text_input").blur();
}

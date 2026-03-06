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

import { store } from '../data/store';
import type { Player, City, Tech } from '../data/types';
import { player_capital, get_diplstate_text, research_get, DiplState } from '../data/player';
import { TECH_KNOWN } from '../data/tech';
import { clientIsObserver as client_is_observer, clientPlaying } from '../client/clientState';
import { showDialogMessage as show_dialog_message } from '../client/civClient';
import { showIntelDialog } from '../components/Dialogs/IntelDialog';

export function show_intelligence_report_dialog(): void {
  const selected_player = store.selectedPlayer;
  if (selected_player === -1) return;
  const pplayer = store.players[selected_player]!;

  if (client_is_observer()
      || (clientPlaying()?.['real_embassy'] as { isSet(bit: number): boolean } | undefined)?.isSet(selected_player)) {
    show_intelligence_report_embassy(pplayer);
  } else {
    show_intelligence_report_hearsay(pplayer);
  }
}

export function show_intelligence_report_hearsay(pplayer: Player): void {
  let msg: string = "Ruler " + pplayer['name'] + "<br>";
  if ((pplayer['government'] as number) > 0) {
    msg += "Government: " + store.governments[pplayer['government'] as number]['name'] + "<br>";
  }

  if ((pplayer['gold'] as number) > 0) {
    msg += "Gold: " + pplayer['gold'] + "<br>";
  }

  if (pplayer['researching'] != null && (pplayer['researching'] as number) > 0 && store.techs[pplayer['researching'] as number] != null) {
    msg += "Researching: " + store.techs[pplayer['researching'] as number]['name'] + "<br>";
  }

  msg += "<br><br>Establishing an embassy will show a detailed intelligence report.";

  show_dialog_message("Intelligence report for " + pplayer['name'],
      msg);
}

export function show_intelligence_report_embassy(pplayer: Player): void {
  const capital = player_capital(pplayer);
  const gov = store.governments[pplayer['government'] as number];
  const govName = gov ? gov['name'] : '(Unknown)';
  const capitalName = capital ? capital.name : '(capital unknown)';

  let html = '<table style="width:100%;border-collapse:collapse;">';
  html += `<tr><td><b>Ruler:</b></td><td>${pplayer['name']}</td></tr>`;
  html += `<tr><td><b>Government:</b></td><td>${govName}</td></tr>`;
  html += `<tr><td><b>Capital:</b></td><td>${capitalName}</td></tr>`;
  html += `<tr><td><b>Gold:</b></td><td>${pplayer['gold']}</td></tr>`;
  html += `<tr><td><b>Tax:</b></td><td>${pplayer['tax']}%</td></tr>`;
  html += `<tr><td><b>Science:</b></td><td>${pplayer['science']}%</td></tr>`;
  html += `<tr><td><b>Luxury:</b></td><td>${pplayer['luxury']}%</td></tr>`;
  html += `<tr><td><b>Culture:</b></td><td>${pplayer['culture']}</td></tr>`;

  const research = research_get(pplayer);
  let researchText = '(Unknown)';
  const techNames: string[] = [];
  if (research != null) {
    const researching = store.techs[research['researching']];
    if (researching !== undefined) {
      researchText = `${researching['name']} (${research['bulbs_researched']}/${research['researching_cost']})`;
    } else {
      researchText = '(Nothing)';
    }
    const inventions = research['inventions'] as Record<string, number> | undefined;
    for (const tech_id in store.techs) {
      if (inventions?.[tech_id] === TECH_KNOWN) {
        techNames.push(store.techs[tech_id]['name']);
      }
    }
  }
  html += `<tr><td><b>Researching:</b></td><td>${researchText}</td></tr>`;
  html += '</table>';

  if (pplayer['diplstates'] !== undefined) {
    const diplEntries: string[] = [];
    (pplayer['diplstates'] as Record<string, unknown>[]).forEach(function (st: Record<string, unknown>, i: number) {
      if (st['state'] !== DiplState.DS_NO_CONTACT && i !== pplayer['playerno'] && store.players[i]) {
        const stateText = get_diplstate_text(st['state'] as number);
        const nationAdj = store.nations[store.players[i]['nation'] as number]?.['adjective'] || 'Unknown';
        diplEntries.push(`${nationAdj}: ${stateText}`);
      }
    });
    if (diplEntries.length > 0) {
      html += '<h3 style="margin:8px 0 4px;">Diplomacy</h3><ul>';
      for (const entry of diplEntries) {
        html += `<li>${entry}</li>`;
      }
      html += '</ul>';
    }
  }

  if (techNames.length > 0) {
    html += `<h3 style="margin:8px 0 4px;">Known Techs (${techNames.length})</h3>`;
    html += `<p style="font-size:12px;">${techNames.join(', ')}</p>`;
  }

  const nationAdj = store.nations[pplayer['nation']]?.['adjective'] || pplayer['name'];
  showIntelDialog(`Foreign Intelligence: ${nationAdj} Empire`, html);
}

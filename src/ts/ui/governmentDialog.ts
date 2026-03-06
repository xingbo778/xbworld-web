/***********************************************************************
    Freeciv-web - the web version of Freeciv. https://www.freeciv.org/
    Copyright (C) 2009-2015  The Freeciv-web project

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
import { canPlayerGetGov as can_player_get_gov } from "../data/government";
import { sendPlayerChangeGovernment, sendReportReq } from "../net/commands";
import { clientIsObserver as client_is_observer, clientPlaying } from "../client/clientState";
import { isSmallScreen as is_small_screen } from "../utils/helpers";

export let governments: any = {};
export let requested_gov: number = -1;

export const REPORT_WONDERS_OF_THE_WORLD: number = 0;
export const REPORT_WONDERS_OF_THE_WORLD_LONG: number = 1;
export const REPORT_TOP_CITIES: number = 2;
export const REPORT_DEMOGRAPHIC: number = 3;
export const REPORT_ACHIEVEMENTS: number = 4;

/**************************************************************************
   ...
**************************************************************************/

export function show_revolution_dialog(): void {
  document.getElementById('revolution_dialog')?.remove();

  if (clientPlaying() == null) return;

  const dlg = document.createElement('div');
  dlg.id = 'revolution_dialog';
  dlg.style.cssText = 'position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:10%;left:50%;transform:translateX(-50%);width:' + (is_small_screen() ? '99%' : '450px') + ';max-height:' + (is_small_screen() ? (window.innerHeight - 40) + 'px' : '600px') + ';overflow-y:auto;color:#fff;';

  dlg.innerHTML = "Current form of government: " + store.governments[clientPlaying()['government']]['name']
    + "<br>To start a revolution, select the new form of government:"
    + "<p><div id='governments'>"
    + "<div id='governments_list'></div></div><br>";

  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'margin-top:8px;display:flex;gap:8px;';
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Start revolution!';
  startBtn.addEventListener('click', function() { start_revolution(); dlg.remove(); });
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', function() { dlg.remove(); });
  btnContainer.appendChild(startBtn);
  btnContainer.appendChild(cancelBtn);
  dlg.appendChild(btnContainer);

  document.getElementById('game_page')?.appendChild(dlg);
  update_govt_dialog();
}

export function init_civ_dialog(): void {
  if (!client_is_observer() && clientPlaying() != null) {

    const pplayer: any = clientPlaying();
    const pnation: any = store.nations[pplayer['nation']];
    const tag: string = pnation['graphic_str'];

    let civ_description: string = "";
    if (!pnation['customized']) {
      civ_description += "<img src='/images/flags/" + tag + "-web" + get_tileset_file_extention() + "' width='180'>";
    }

    civ_description += "<br><div>" + pplayer['name'] + " rules the " + store.nations[pplayer['nation']]['adjective']
      + " with the form of government: " + store.governments[clientPlaying()['government']]['name']
      + "</div><br>";
    const nationTitleEl = document.getElementById('nation_title');
    if (nationTitleEl) nationTitleEl.innerHTML = "The " + store.nations[pplayer['nation']]['adjective'] + " nation";
    const civTextEl = document.getElementById('civ_dialog_text');
    if (civTextEl) civTextEl.innerHTML = civ_description;

  } else {
    const civTextEl = document.getElementById('civ_dialog_text');
    if (civTextEl) civTextEl.innerHTML = "This dialog isn't available as observer.";
  }
}

export function update_govt_dialog(): void {
  let govt: any;
  let govt_id: string | number;
  if (client_is_observer()) return;

  let governments_list_html: string = "";

  for (govt_id in governments) {
    govt = (store.governments as any)[govt_id];
    governments_list_html += "<button class='govt_button' id='govt_id_" + govt['id'] + "' "
      + "onclick='set_req_government(" + govt['id'] + ");' "
      + "title='" + govt['helptext'] + "'>" + govt['name'] + "</button>";
  }

  const govListEl = document.getElementById('governments_list');
  if (govListEl) govListEl.innerHTML = governments_list_html;

  for (govt_id in governments) {
    govt = (store.governments as any)[govt_id];
    const btn = document.getElementById('govt_id_' + govt['id']) as HTMLButtonElement | null;
    if (!btn) continue;
    btn.textContent = govt['name'];
    btn.title = govt['helptext'] || '';
    if (!can_player_get_gov(Number(govt_id))) {
      btn.disabled = true;
    } else if (requested_gov == Number(govt_id)) {
      btn.style.background = 'green';
    } else if (clientPlaying()?.['government'] == Number(govt_id)) {
      btn.style.background = '#BBBBFF';
      btn.style.fontWeight = 'bolder';
    }
  }
}

export function start_revolution(): void {
  if (requested_gov != -1) {
    send_player_change_government(requested_gov);
    requested_gov = -1;
  }
}

export function set_req_government(gov_id: number): void {
  requested_gov = gov_id;
  update_govt_dialog();
}

export function send_player_change_government(govt_id: number): void {
  sendPlayerChangeGovernment(govt_id);
}

export function request_report(rtype: number): void {
  sendReportReq(rtype);
}

function get_tileset_file_extention(): string {
  // Placeholder function to avoid TS error, as it was used in init_civ_dialog but not defined in original code.
  // The original JS code calls get_tileset_file_extention(), so we keep it here as any.
  return "";
}

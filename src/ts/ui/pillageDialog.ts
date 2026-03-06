/**********************************************************************
    Freeciv-web - the web version of Freeciv. https://www.freeciv.org/
    Copyright (C) 2018  The Freeciv-web project

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
import { EXTRA_NONE } from '../data/extra';
import { ACTION_PILLAGE } from '../data/fcTypes';
import { request_unit_do_action } from '../core/control/unitCommands';
import { clientIsObserver as client_is_observer } from '../client/clientState';

/****************************************************************************
  Ask the player to select a target.
****************************************************************************/
export function popup_pillage_selection_dialog(punit: any, tgt: any[]): void {
  if (punit == null || (typeof client_is_observer === 'function' && client_is_observer())) return;
  if (tgt.length === 0) return;

  const dlgId = 'pillage_sel_dialog_' + punit['id'];
  document.getElementById(dlgId)?.remove();

  const dlg = document.createElement('div');
  dlg.id = dlgId;
  dlg.style.cssText = 'position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:30%;left:50%;transform:translateX(-50%);width:390px;';
  dlg.appendChild(document.createTextNode("Your "
              + store.unitTypes[punit['type']]['name']
              + " is waiting for you to select what to pillage."));

  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;';

  for (let i = 0; i < tgt.length; i++) {
    const extra_id = tgt[i];
    if (extra_id === EXTRA_NONE) continue;
    const btn = document.createElement('button');
    btn.id = 'pillage_sel_' + punit['id'] + '_' + extra_id;
    btn.className = 'act_sel_button';
    btn.textContent = store.extras[extra_id]['name'];
    btn.addEventListener('click', function(ev) {
      pillage_target_selected(ev);
    });
    btnContainer.appendChild(btn);
  }

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'act_sel_button';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', function() { dlg.remove(); });
  btnContainer.appendChild(cancelBtn);

  dlg.appendChild(btnContainer);
  document.getElementById('game_page')?.appendChild(dlg);
}

/****************************************************************************
  Respond to the target selection.
****************************************************************************/
export function pillage_target_selected(ev: any): void {
  const id = ev.target.id;
  const params = id.match(/pillage_sel_(\d*)_([^_]*)/);
  if (!params) return;
  const extra_id = parseInt(params[2], 10);
  const punit_id = parseInt(params[1], 10);

  request_unit_do_action(ACTION_PILLAGE, punit_id, store.units[punit_id].tile,
                         extra_id);
  const dlg = (ev.target as HTMLElement).closest('[id^="pillage_sel_dialog_"]');
  if (dlg) dlg.remove();
}

/**********************************************************************
    Freeciv-web - the web version of Freeciv. https://www.freeciv.org/
    Copyright (C) 2022 FCIV.NET

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

import { active_city } from './cityDialogState';
import { clientIsObserver as client_is_observer, clientPlaying } from '../client/clientState';
import { cityOwnerPlayerId as city_owner_player_id } from '../data/city';

import { sendCmaSet, sendCmaClear } from '../net/commands';
import { store } from '../data/store';

function checkedById(id: string): boolean {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return el ? el.checked : false;
}
function setCheckedById(id: string, val: boolean): void {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (el) el.checked = val;
}

// Governor Clipboard for copy/paste:
export let _cma_val_sliders: number[] = [1,0,0,0,0,0];
export let _cma_min_sliders: number[] = [0,0,0,0,0,0];
export let _cma_happy_slider: number = 0;
export let _cma_celebrate: boolean = false;
export let _cma_allow_disorder: boolean = false;
export let _cma_max_growth: boolean = false;
export let _cma_allow_specialists: boolean = true;

/**************************************************************************
  Init Governor tab - returns true if the tab was able to generate
**************************************************************************/
export function show_city_governor_tab(): boolean | void {
  // Reject cases which can't show the Governor:
  if (client_is_observer() || clientPlaying() == null) return false;
  if (!active_city) return false;
  if (city_owner_player_id(active_city) != clientPlaying().playerno) {
    const govTab = document.getElementById('city_governor_tab');
    if (govTab) govTab.innerHTML = "City Governor available only for domestic cities.";
    return false;
  }
  const cmaIds = ['cma_food', 'cma_shield', 'cma_trade', 'cma_gold', 'cma_luxury', 'cma_science'];
  if (typeof (active_city as any)['cm_parameter'] !== 'undefined') {
    for (let i = 0; i < cmaIds.length; i++) {
      setCheckedById(cmaIds[i], (active_city as any)['cm_parameter']['factor'][i] >= 5);
    }
  } else {
    for (const id of cmaIds) setCheckedById(id, false);
  }
}

/**************************************************************************
  Sends new CMA parameters to the server, populated from the UI states.
**************************************************************************/
export function request_new_cma(city_id: number): void {
  const cm_parameter: Record<string, unknown> = {};

  const cmaIds = ['cma_food', 'cma_shield', 'cma_trade', 'cma_gold', 'cma_luxury', 'cma_science'];
  for (let i = 0; i < cmaIds.length; i++) {
    _cma_val_sliders[i] = checkedById(cmaIds[i]) ? 6 : 0;
  }

  cm_parameter['minimal_surplus'] = [..._cma_min_sliders];
  cm_parameter['require_happy'] = _cma_celebrate;
  cm_parameter['allow_disorder'] = _cma_allow_disorder;
  cm_parameter['max_growth'] = _cma_max_growth;
  cm_parameter['allow_specialists'] = _cma_allow_specialists;
  cm_parameter['factor'] = [..._cma_val_sliders];
  cm_parameter['happy_factor'] = _cma_happy_slider;

  const cma_disabled = !cmaIds.some(id => checkedById(id));

  if (!cma_disabled) {
    sendCmaSet(city_id, cm_parameter);
  } else {
    sendCmaClear(city_id);
  }
}

/**************************************************************************
  Called when user clicks button to Enable/Disable governor.
**************************************************************************/
export function button_pushed_toggle_cma(): void {
  request_new_cma(active_city!['id']);
}

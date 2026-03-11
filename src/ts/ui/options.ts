/**********************************************************************
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

**********************************************************************/

import { store } from '../data/store';
import { audio, music_list, supports_mp3 } from '../audio/audioState';

export let auto_center_on_unit: boolean = true;
export let popup_actor_arrival: boolean = true;
export let draw_fog_of_war: boolean = true;
/** Update the fog-of-war render flag from a server setting change. */
export function setDrawFogOfWar(val: boolean): void { draw_fog_of_war = val; }
export let draw_units: boolean = true;
export let draw_focus_unit: boolean = false;

export function init_options_dialog(): void {
  if (audio != null && !(audio.source as { src?: string })?.src) {
    if (!supports_mp3()) {
      audio.load("/music/" + music_list[Math.floor(Math.random() * music_list.length)] + ".ogg");
    } else {
      audio.load("/music/" + music_list[Math.floor(Math.random() * music_list.length)] + ".mp3");
    }
  }

  const soundsCheckbox = document.getElementById('play_sounds_setting') as HTMLInputElement | null;
  if (soundsCheckbox) {
    soundsCheckbox.checked = store.soundsEnabled;
    soundsCheckbox.addEventListener('change', function() {
      store.soundsEnabled = this.checked;
      localStorage.setItem('sndFX', JSON.stringify(store.soundsEnabled));
    });
  }
}

import { setTheme, getTheme, loadSavedTheme, type ThemeName } from '../utils/theme';

// Load saved theme on startup
loadSavedTheme();

/** Inject theme selector into the options panel if it doesn't already exist. */
export function init_theme_selector(): void {
  const container = document.getElementById('opt_tab') ?? document.getElementById('tabs-opt');
  if (!container || document.getElementById('xb-theme-selector')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'xb-theme-selector';
  wrapper.style.cssText = 'margin:12px 0;display:flex;align-items:center;gap:8px;';

  const label = document.createElement('label');
  label.textContent = 'UI Theme:';
  label.style.cssText = 'color:var(--xb-text-secondary,#8b949e);font-size:13px;min-width:70px;';

  const select = document.createElement('select');
  select.style.cssText = 'background:var(--xb-bg-elevated,#21262d);color:var(--xb-text-primary,#e6edf3);border:1px solid var(--xb-border-default,#30363d);border-radius:4px;padding:4px 8px;font-size:13px;';
  [['dark', 'Dark (default)'], ['light', 'Light'], ['fantasy', 'Fantasy']].forEach(([val, text]) => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = text;
    if (val === getTheme()) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => setTheme(select.value as ThemeName));

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  container.insertBefore(wrapper, container.firstChild);
}

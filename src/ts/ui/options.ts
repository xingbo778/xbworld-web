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

const audio = (window as any).audio;
const music_list: string[] = (window as any).music_list || [];
const supports_mp3 = (): boolean => (window as any).supports_mp3?.() ?? false;

export let auto_center_on_unit: boolean = true;
export let popup_actor_arrival: boolean = true;
export let draw_fog_of_war: boolean = true;
export let draw_units: boolean = true;
export let draw_focus_unit: boolean = false;

export function init_options_dialog(): void {
  if (audio != null && !audio.source.src) {
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

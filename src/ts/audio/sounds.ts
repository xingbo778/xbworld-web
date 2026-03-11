/**********************************************************************
    Freeciv-web - the web version of Freeciv. https://www.freeciv.org/
    Copyright (C) 2009-2016  The Freeciv-web project

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

import type { Unit } from '../data/types';
import { unit_type, is_unit_visible as _is_unit_visible } from '../data/unit';
import { store } from '../data/store';

const sounds_enabled_get = (): boolean => store.soundsEnabled;
const soundset_get = (): Record<string, string> => (typeof soundset !== 'undefined' ? soundset : {}) as Record<string, string>;
const is_unit_visible = (punit: Unit): boolean => _is_unit_visible(punit);

export const sound_path: string = "/sounds/";

export function check_unit_sound_play(old_unit: Unit | null, new_unit: Unit | null): void {
  if (!sounds_enabled_get()) return;
  if (old_unit == null || new_unit == null) return;
  /* unit is in same position. */
  if (new_unit['tile'] === old_unit['tile']) return;
  if (!is_unit_visible(new_unit)) return;

  if (soundset_get() == null) {
    console.error("soundset not found.");
    return;
  }

  const ptype = unit_type(new_unit);
  if (!ptype) return;
  if (soundset_get()[ptype['sound_move'] as string] != null) {
    play_sound(soundset_get()[ptype['sound_move'] as string]);
  } else if (soundset_get()[ptype['sound_move_alt'] as string] != null) {
    play_sound(soundset_get()[ptype['sound_move_alt'] as string]);
  }
}

export function unit_move_sound_play(unit: Unit | null): void {
  if (!sounds_enabled_get()) return;
  if (unit == null) return;

  if (soundset_get() == null) {
    console.error("soundset not found.");
    return;
  }

  const ptype = unit_type(unit);
  if (!ptype) return;
  if (soundset_get()[ptype['sound_move'] as string] != null) {
    play_sound(soundset_get()[ptype['sound_move'] as string]);
  } else if (soundset_get()[ptype['sound_move_alt'] as string] != null) {
    play_sound(soundset_get()[ptype['sound_move_alt'] as string]);
  }
}

export function play_combat_sound(unit: Unit | null): void {
  if (!sounds_enabled_get()) return;
  if (unit == null) return;
  if (!is_unit_visible(unit)) return;

  if (soundset_get() == null) {
    console.error("soundset not found.");
    return;
  }

  const ptype = unit_type(unit);
  if (!ptype) return;
  if (soundset_get()[ptype['sound_fight'] as string] != null) {
    play_sound(soundset_get()[ptype['sound_fight'] as string]);
  } else if (soundset_get()[ptype['sound_fight_alt'] as string] != null) {
    play_sound(soundset_get()[ptype['sound_fight_alt'] as string]);
  }
}

export function play_sound(sound_file: string): void {
  try {
    if (!sounds_enabled_get() || !(document.createElement('audio').canPlayType) || Audio == null) return;
    const audio = new Audio(sound_path + sound_file);
    const promise = audio.play();
    if (promise != null) {
      promise.catch(sound_error_handler);
    }
  } catch(err) {
    sound_error_handler(err);
  }
}

export function sound_error_handler(err: unknown): void {
  store.soundsEnabled = false;
  if (typeof trackJs !== 'undefined' && trackJs) {
    trackJs.console.log(err);
    trackJs.track("Sound problem");
  } else {
    console.error(err);
  }
}

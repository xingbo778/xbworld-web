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

const sounds_enabled_get = (): boolean => (window as any).sounds_enabled ?? false;
const soundset_get = (): Record<string, any> => (window as any).soundset ?? {};
const is_unit_visible = (punit: any): boolean => (window as any).is_unit_visible?.(punit) ?? false;

export let sound_path: string = "/sounds/";

export function check_unit_sound_play(old_unit: any, new_unit: any): void {
  if (!sounds_enabled_get()) return;
  if (old_unit == null || new_unit == null) return;
  /* unit is in same position. */
  if (new_unit['tile'] === old_unit['tile']) return;
  if (!is_unit_visible(new_unit)) return;

  if (soundset_get() == null) {
    console.error("soundset not found.");
    return;
  }

  const ptype: any = unit_type(new_unit);
  if (soundset_get()[ptype['sound_move']] != null) {
    play_sound(soundset_get()[ptype['sound_move']]);
  } else if (soundset_get()[ptype['sound_move_alt']] != null) {
    play_sound(soundset_get()[ptype['sound_move_alt']]);
  }
}

export function unit_move_sound_play(unit: any): void {
  if (!sounds_enabled_get()) return;
  if (unit == null) return;

  if (soundset_get() == null) {
    console.error("soundset not found.");
    return;
  }

  const ptype: any = unit_type(unit);
  if (soundset_get()[ptype['sound_move']] != null) {
    play_sound(soundset_get()[ptype['sound_move']]);
  } else if (soundset_get()[ptype['sound_move_alt']] != null) {
    play_sound(soundset_get()[ptype['sound_move_alt']]);
  }
}

export function play_combat_sound(unit: any): void {
  if (!sounds_enabled_get()) return;
  if (unit == null) return;
  if (!is_unit_visible(unit)) return;

  if (soundset_get() == null) {
    console.error("soundset not found.");
    return;
  }

  const ptype: any = unit_type(unit);
  if (soundset_get()[ptype['sound_fight']] != null) {
    play_sound(soundset_get()[ptype['sound_fight']]);
  } else if (soundset_get()[ptype['sound_fight_alt']] != null) {
    play_sound(soundset_get()[ptype['sound_fight_alt']]);
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

export function sound_error_handler(err: any): void {
  (window as any).sounds_enabled = false;
  if (window.trackJs) {
    window.trackJs.console.log(err);
    window.trackJs.track("Sound problem");
  } else {
    console.log(err);
  }
}

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

***********************************************************************/

import { set_chat_direction } from './control/chat';

export const PAGE_MAIN: number = 0;
export const PAGE_START: number = 1;
export const PAGE_SCENARIO: number = 2;
export const PAGE_LOAD: number = 3;
export const PAGE_NETWORK: number = 4;
export const PAGE_NATION: number = 5;
export const PAGE_GAME: number = 6;

let old_page: number = -1;

export function set_client_page(page: number): void {
  if (old_page === page) return;

  if (old_page === -1) {
    document.getElementById('pregame_page')?.remove();
  }

  if (page === PAGE_GAME) {
    const gamePage = document.getElementById('game_page');
    if (gamePage) gamePage.style.display = '';
    set_chat_direction(null);
  }

  old_page = page;
}

export function get_client_page(): number {
  return old_page;
}

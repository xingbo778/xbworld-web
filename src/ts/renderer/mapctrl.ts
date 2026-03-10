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
import type { Tile, Unit, Player } from '../data/types';

import { canvas_pos_to_tile, mapview, mark_all_dirty } from './mapviewCommon';
import { mapPosToTile } from '../data/map';
const map_pos_to_tile = mapPosToTile;
import { tile_units } from '../data/unit';
import { find_visible_unit, set_unit_focus, action_selection_next_in_focus, update_active_units_dialog } from '../core/control';
import { current_focus, goto_active, goto_request_map, request_goto_path, context_menu_active, keyboard_input as keyboard_input_ref, mapview_mouse_movement as mapview_mouse_movement_ref, SELECT_POPUP, popit, do_map_click, update_mouse_cursor, set_mouse_touch_started_on_unit, check_mouse_drag_unit } from '../core/control';
import { mouse_moved_cb } from '../core/control/mouse';
import { mouse_x, mouse_y, setMouseX, setMouseY, setMapviewMouseMovement, setContextMenuActive, setKeyboardInput, setCurrentFocus } from '../core/control/controlState';
import { player_by_full_username, get_player_connection_status } from '../data/player';
import { clientIsObserver as client_is_observer, clientPlaying, canClientChangeView as can_client_change_view } from '../client/clientState';
import { isTouchDevice as is_touch_device, isRightMouseSelectionSupported as is_right_mouse_selection_supported } from '../utils/helpers';
import { showDialogMessage as show_dialog_message } from '../client/civClient';
import { do_city_map_click } from '../ui/cityDialog';
import { IDENTITY_NUMBER_ZERO } from '../core/constants';
import { enable_mapview_slide } from './mapview';
import { center_tile_mapcanvas } from '../core/control';

export { mouse_x, mouse_y };
export let touch_start_x: number;
export let touch_start_y: number;

export let map_select_setting_enabled: boolean = true;
export let map_select_check: boolean = false;
export let map_select_check_started: number = 0;
export let map_select_active: boolean = false;
export let map_select_x: number;
export let map_select_y: number;
export let mouse_touch_started_on_unit: boolean = false;

// Setters for mutable state (needed by external modules)
export function setMapSelectActive(v: boolean): void { map_select_active = v; }
export function setMapSelectCheck(v: boolean): void { map_select_check = v; }
export function setTouchStart(x: number, y: number): void { touch_start_x = x; touch_start_y = y; }

/****************************************************************************
  Init 2D mapctrl
****************************************************************************/
export function mapctrl_init_2d(): void {
  const canvas = document.getElementById('canvas')!;
  canvas.addEventListener('mouseup', mapview_mouse_click);
  canvas.addEventListener('mousedown', mapview_mouse_down);
  window.addEventListener('mousemove', mouse_moved_cb);
  // Reset pan-drag if mouse released outside the canvas (e.g. over a dialog)
  window.addEventListener('mouseup', mapview_window_mouse_up);

  if (is_touch_device()) {
    canvas.addEventListener('touchstart', mapview_touch_start);
    canvas.addEventListener('touchend', mapview_touch_end);
    canvas.addEventListener('touchmove', mapview_touch_move);
  }
}

/**
 * Init mapctrl for the PixiJS renderer.
 * Attaches the same event handlers as mapctrl_init_2d but to the Pixi canvas
 * (which is appended to canvas_div by PixiRenderer.init()).
 * Called after PixiRenderer.init() resolves so the canvas element exists.
 */
export function mapctrl_init_pixi(): void {
  const container = document.getElementById('canvas_div');
  if (!container) {
    console.warn('mapctrl_init_pixi: #canvas_div not found');
    return;
  }
  // Pixi appends its <canvas> as the last child of canvas_div
  const canvas = container.querySelector('canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    console.warn('mapctrl_init_pixi: no <canvas> found inside #canvas_div');
    return;
  }

  canvas.addEventListener('mouseup', mapview_mouse_click);
  canvas.addEventListener('mousedown', mapview_mouse_down);
  window.addEventListener('mousemove', mouse_moved_cb);
  // Reset pan-drag if mouse released outside the canvas (e.g. over a dialog)
  window.addEventListener('mouseup', mapview_window_mouse_up);

  if (is_touch_device()) {
    canvas.addEventListener('touchstart', mapview_touch_start);
    canvas.addEventListener('touchend', mapview_touch_end);
    canvas.addEventListener('touchmove', mapview_touch_move);
  }
}

/****************************************************************************
  Triggered when the mouse button is clicked UP on the mapview canvas.
****************************************************************************/
export function mapview_mouse_click(e: MouseEvent): void {
  let rightclick = false;
  let middleclick = false;

  if (e.which) {
    rightclick = (e.which == 3);
    middleclick = (e.which == 2);
  } else if (e.button) {
    rightclick = (e.button == 2);
    middleclick = (e.button == 1 || e.button == 4);
  }
  if (rightclick) {
    /* right click to recenter. */
    if (!map_select_active || !map_select_setting_enabled) {
      setContextMenuActive(true);
      store.contextMenuActive = true;
      recenter_button_pressed(mouse_x, mouse_y);
    } else {
      setContextMenuActive(false);
      store.contextMenuActive = false;
      map_select_units(mouse_x, mouse_y);
    }
    map_select_active = false;
    map_select_check = false;

  } else if (!middleclick) {
    /* Left mouse button*/
    action_button_pressed(mouse_x, mouse_y, SELECT_POPUP);
    setMapviewMouseMovement(false);
    store.mapviewMouseMovement = false;
    update_mouse_cursor();
  }
  setKeyboardInput(true);
  store.keyboardInput = true;
}

/****************************************************************************
  Triggered when the mouse button is clicked DOWN on the mapview canvas.
****************************************************************************/
export function mapview_mouse_down(e: MouseEvent): boolean | void {
  let rightclick = false;
  let middleclick = false;

  if (e.which) {
    rightclick = (e.which == 3);
    middleclick = (e.which == 2);
  } else if (e.button) {
    rightclick = (e.button == 2);
    middleclick = (e.button == 1 || e.button == 4);
  }

  if (!rightclick && !middleclick) {
    /* Left mouse button is down */
    if (goto_active) return;
    set_mouse_touch_started_on_unit(canvas_pos_to_tile(mouse_x, mouse_y));
    check_mouse_drag_unit(canvas_pos_to_tile(mouse_x, mouse_y));
    if (!mouse_touch_started_on_unit) setMapviewMouseMovement(true);
    touch_start_x = mouse_x;
    touch_start_y = mouse_y;

  } else if (middleclick || e['altKey']) {
    popit();
    return false;
  } else if (rightclick && !map_select_active && is_right_mouse_selection_supported()) {
    map_select_check = true;
    map_select_x = mouse_x;
    map_select_y = mouse_y;
    map_select_check_started = new Date().getTime();

    /* The context menu blocks the right click mouse up event on some
     * browsers. */
    setContextMenuActive(false);
    store.contextMenuActive = false;
  }
}

/****************************************************************************
  Triggered when mouse button is released anywhere on the window.
  Resets mapview_mouse_movement so pan-drag doesn't get stuck when the mouse
  is released outside the canvas (e.g. over a popup dialog).
****************************************************************************/
function mapview_window_mouse_up(): void {
  setMapviewMouseMovement(false);
  store.mapviewMouseMovement = false;
}

/****************************************************************************
  This function is triggered when beginning a touch event on a touch device,
  eg. finger down on screen.
****************************************************************************/
export function mapview_touch_start(e: TouchEvent): void {
  e.preventDefault();

  const canvasEl = document.getElementById('canvas')!;
  const rect = canvasEl.getBoundingClientRect();
  touch_start_x = e.touches[0].pageX - (rect.left + window.scrollX);
  touch_start_y = e.touches[0].pageY - (rect.top + window.scrollY);
  const ptile = canvas_pos_to_tile(touch_start_x, touch_start_y);
  set_mouse_touch_started_on_unit(ptile);
}

/****************************************************************************
  This function is triggered when ending a touch event on a touch device,
  eg finger up from screen.
****************************************************************************/
export function mapview_touch_end(e: TouchEvent): void {
  action_button_pressed(touch_start_x, touch_start_y, SELECT_POPUP);
}

/****************************************************************************
  This function is triggered on a touch move event on a touch device.
****************************************************************************/
export function mapview_touch_move(e: TouchEvent): void {
  const canvasEl = document.getElementById('canvas')!;
  const rect = canvasEl.getBoundingClientRect();
  setMouseX(e.touches[0].pageX - (rect.left + window.scrollX));
  setMouseY(e.touches[0].pageY - (rect.top + window.scrollY));

  const diff_x = (touch_start_x - mouse_x) * 2;
  const diff_y = (touch_start_y - mouse_y) * 2;

  touch_start_x = mouse_x;
  touch_start_y = mouse_y;

  if (!goto_active) {
    check_mouse_drag_unit(canvas_pos_to_tile(mouse_x, mouse_y));

    mapview['gui_x0'] = (mapview['gui_x0'] ?? 0) + diff_x;
    mapview['gui_y0'] = (mapview['gui_y0'] ?? 0) + diff_y;
    mark_all_dirty();
  }

  if (clientPlaying() == null) return;

  /* Request preview goto path */
  // goto_preview_active is only used locally, just set a local flag
  let _goto_preview_active = true;
  if (goto_active && current_focus.length > 0) {
    const ptile = canvas_pos_to_tile(mouse_x, mouse_y);
    if (ptile != null) {
      for (let i = 0; i < current_focus.length; i++) {
        if (i >= 20) return;  // max 20 units goto a time.
        if (goto_request_map[current_focus[i]['id'] + "," + ptile['x'] + "," + ptile['y']] == null) {
          request_goto_path(current_focus[i]['id'], ptile['x'], ptile['y']);
        }
      }
    }
  }
}

/****************************************************************************
  This function is triggered when the mouse is clicked on the city canvas.
****************************************************************************/
export function city_mapview_mouse_click(e: MouseEvent): void {
  let rightclick = false;
  if (e.which) {
    rightclick = (e.which == 3);
  } else if (e.button) {
    rightclick = (e.button == 2);
  }

  if (!rightclick) {
    city_action_button_pressed(mouse_x, mouse_y);
  }
}

/**************************************************************************
  Do some appropriate action when the "main" mouse button (usually
  left-click) is pressed. For more sophisticated user control use (or
  write) a different xxx_button_pressed function.
**************************************************************************/
export function action_button_pressed(canvas_x: number, canvas_y: number, qtype: number): void {
  const ptile = canvas_pos_to_tile(canvas_x, canvas_y);

  if (can_client_change_view() && ptile != null) {
    /* FIXME: Some actions here will need to check can_client_issue_orders.
     * But all we can check is the lowest common requirement. */
    do_map_click(ptile, qtype, true);
  }
}

/**************************************************************************
  Do some appropriate action when the "main" mouse button (usually
  left-click) is pressed.  For more sophisticated user control use (or
  write) a different xxx_button_pressed function.
**************************************************************************/
export function city_action_button_pressed(canvas_x: number, canvas_y: number): void {
  const ptile = canvas_pos_to_tile(canvas_x, canvas_y);

  if (can_client_change_view() && ptile != null) {
    /* FIXME: Some actions here will need to check can_client_issue_orders.
     * But all we can check is the lowest common requirement. */
    do_city_map_click(ptile);
  }
}

/**************************************************************************
  This will select and set focus to all the units which are in the 
  selected rectangle on the map when the mouse is selected using the right
  mouse button. 
  [canvas_x, canvas_y, map_select_x, map_select_y].
**************************************************************************/
export function map_select_units(canvas_x: number, canvas_y: number): void {
  const selected_tiles: { [key: string]: Tile } = {};
  const selected_units: Unit[] = [];
  if (client_is_observer()) return;

  const start_x = (map_select_x < canvas_x) ? map_select_x : canvas_x;
  const start_y = (map_select_y < canvas_y) ? map_select_y : canvas_y;
  const end_x = (map_select_x < canvas_x) ? canvas_x : map_select_x;
  const end_y = (map_select_y < canvas_y) ? canvas_y : map_select_y;

  for (let x = start_x; x < end_x; x += 15) {
    for (let y = start_y; y < end_y; y += 15) {
      const ptile = canvas_pos_to_tile(x, y);
      if (ptile != null) {
        selected_tiles[ptile['index']] = ptile;
      }
    }
  }

  for (const tile_id in selected_tiles) {
    const ptile = selected_tiles[tile_id];
    const cunits = tile_units(ptile);
    if (cunits == null) continue;
    for (let i = 0; i < cunits.length; i++) {
      const aunit = cunits[i];
      if (aunit['owner'] == clientPlaying()!.playerno) {
        selected_units.push(aunit);
      }
    }
  }

  setCurrentFocus(selected_units);
  store.currentFocus = selected_units;
  action_selection_next_in_focus(IDENTITY_NUMBER_ZERO);
  update_active_units_dialog();
}

/**************************************************************************
  Recenter the map on the canvas location, on user request. Usually this
  is done with a right-click.
**************************************************************************/
export function recenter_button_pressed(canvas_x: number, canvas_y: number): void {
  const map_scroll_border = 8;
  const big_map_size = 24;
  let ptile = canvas_pos_to_tile(canvas_x, canvas_y);
  const orig_tile = ptile;

  /* Prevent the user from scrolling outside the map. */
  if (ptile != null && ptile['y'] > (store.mapInfo!.ysize - map_scroll_border)
      && store.mapInfo!.xsize > big_map_size && store.mapInfo!.ysize > big_map_size) {
    ptile = map_pos_to_tile(ptile['x'], store.mapInfo!.ysize - map_scroll_border);
  }
  if (ptile != null && ptile['y'] < map_scroll_border
      && store.mapInfo!.xsize > big_map_size && store.mapInfo!.ysize > big_map_size) {
    ptile = map_pos_to_tile(ptile['x'], map_scroll_border);
  }

  if (can_client_change_view() && ptile != null && orig_tile != null) {
    const sunit = find_visible_unit(orig_tile);
    if (!client_is_observer() && sunit != null
        && sunit['owner'] == clientPlaying()!.playerno) {
      /* the user right-clicked on own unit, show context menu instead of recenter. */
      if (current_focus.length <= 1) set_unit_focus(sunit);
      const canvasEl = document.getElementById('canvas')!;
      (canvasEl as unknown as { contextMenu?: (arg: boolean) => void }).contextMenu?.(true);
      canvasEl.dispatchEvent(new Event('contextmenu'));
    } else {
      const canvasEl = document.getElementById('canvas')!;
      (canvasEl as unknown as { contextMenu?: (arg: boolean) => void }).contextMenu?.(false);
      /* FIXME: Some actions here will need to check can_client_issue_orders.
       * But all we can check is the lowest common requirement. */
      enable_mapview_slide(ptile);
      center_tile_mapcanvas(ptile);
    }
  }
}

/**************************************************************************
  Received tile info text.
**************************************************************************/
export function handle_web_info_text_message(packet: { message: string; [key: string]: unknown }): void {
  let message = decodeURIComponent(packet['message']);
  const lines = message.split('\n');

  /* When a line starts with the key, the regex value is used to break it
   * in four elements:
   * - text before the player's name
   * - player's name
   * - text after the player's name and before the status insertion point
   * - text after the status insertion point
  **/
  const matcher: { [key: string]: RegExp } = {
    'Terri': /^(Territory of )([^(]*)(\s+\([^,]*)(.*)/,
    'City:': /^(City:[^|]*\|\s+)([^(]*)(\s+\([^,]*)(.*)/,
    'Unit:': /^(Unit:[^|]*\|\s+)([^(]*)(\s+\([^,]*)(.*)/
  };

  for (let i = 0; i < lines.length; i++) {
    const re = matcher[lines[i].substr(0, 5)];
    if (re !== undefined) {
      let pplayer: Player | null = null;
      const split_txt = lines[i].match(re);
      if (split_txt != null && split_txt.length > 4) {
        pplayer = player_by_full_username(split_txt[2]);
      }
      if (pplayer != null && split_txt != null &&
          (clientPlaying() == null || pplayer != clientPlaying())) {
        lines[i] = split_txt[1]
                 + "<a href='#' data-action='select-player' data-playerno='"
                 + pplayer['playerno']
                 + "' style='color: black;'>"
                 + split_txt[2]
                 + "</a>"
                 + split_txt[3]
                 + ", "
                 + get_player_connection_status(pplayer)
                 + split_txt[4];
      }
    }
  }
  message = lines.join("<br>\n");

  show_dialog_message("Tile Information", message);
}


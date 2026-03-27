/**
 * Goto path management — activate/deactivate goto mode, request and
 * update goto paths, and send end-turn.
 *
 * Extracted from mapClick.ts
 */

import { store } from '../../data/store';
import type { Tile } from '../../data/types';
import { Order } from '../../data/unit';
import { indexToTile as index_to_tile, mapPosToTile as map_pos_to_tile, mapstep, clearGotoTiles as clear_goto_tiles } from '../../data/map';
import { ACTION_COUNT } from '../../core/constants';
import { sendPlayerPhaseDone, sendGotoPathReq } from '../../net/commands';
import { isTouchDevice as is_touch_device } from '../../utils/helpers';
import { isLongturn } from '../../client/clientCore';
import { message_log } from '../../core/messages';
import { E_BEGINNER_HELP } from '../../data/eventConstants';
import { canvas_pos_to_tile } from '../../renderer/mapviewCommon';
import { showDialogMessage as show_dialog_message } from '../../client/civClient';
import * as S from './controlState';
import { update_unit_focus } from './unitFocus';
import { update_mouse_cursor } from './mouse';
import { turnDoneState, unitTextDetails, activeUnitInfo } from '../../data/signals';
import { setMapCursor } from '../../renderer/mapCanvas';

const ORDER_LAST = Order.LAST;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function activate_goto() {
  clear_goto_tiles();
  activate_goto_last(ORDER_LAST, ACTION_COUNT);
}

export function activate_goto_last(last_order: number, last_action: number) {
  S.setGotoActive(true);
  setMapCursor("crosshair");

  S.setGotoLastOrder(last_order);
  S.setGotoLastAction(last_action);

  if (S.current_focus.length > 0) {
    if (S.intro_click_description) {
      if (is_touch_device()) {
        message_log.update({
          event: E_BEGINNER_HELP,
          message: "Carefully drag unit to the tile you want it to go to."
        });
      } else {
        message_log.update({
          event: E_BEGINNER_HELP,
          message: "Click on the tile to send this unit to."
        });
      }
      S.setIntroClickDescription(false);
    }

  } else {
    message_log.update({
      event: E_BEGINNER_HELP,
      message: "First select a unit to move by clicking on it, then click on the"
        + " goto button or the 'G' key, then click on the position to move to."
    });
    deactivate_goto(false);
  }

}

export function deactivate_goto(will_advance_unit_focus: boolean) {
  S.setGotoActive(false);
  setMapCursor("default");
  S.setGotoRequestMap({});
  S.setGotoTurnsRequestMap({});
  clear_goto_tiles();

  S.setGotoLastOrder(ORDER_LAST);
  S.setGotoLastAction(ACTION_COUNT);

  if (will_advance_unit_focus) setTimeout(update_unit_focus, 600);
}

export function send_end_turn() {
  if (store.gameInfo == null) return;

  turnDoneState.value = { ...turnDoneState.value, disabled: true };

  sendPlayerPhaseDone(store.gameInfo['turn']);
  // update_turn_change_timer is a legacy function, may not exist
  // update_turn_change_timer was a legacy function — removed

  if (isLongturn()) {
    show_dialog_message("Turn done!",
      "Your turn in this Freeciv-web: One Turn per Day game is now over. In this game one turn is played every day. " +
      "To play your next turn in this game, go to " + window.location.host + " and click <b>Games</b> in the menu, then <b>Multiplayer</b> " +
      "and there you will find this Freeciv-web: One Turn per Day game in the list. You can also bookmark this page.<br>" +
      "See you again soon!");
  }
}

export function request_goto_path(unit_id: number, dst_x: number, dst_y: number) {
  if (S.goto_request_map[unit_id + "," + dst_x + "," + dst_y] == null) {
    S.goto_request_map[unit_id + "," + dst_x + "," + dst_y] = true;

    sendGotoPathReq(unit_id, map_pos_to_tile(dst_x, dst_y)!['index']);
    S.setCurrentGotoTurns(null);
    unitTextDetails.value = 'Choose unit goto';
    setTimeout(update_mouse_cursor, 700);
  } else {
    const cached = S.goto_request_map[unit_id + "," + dst_x + "," + dst_y];
    if (cached !== true) update_goto_path(cached);
  }
}

export function check_request_goto_path() {
  if (S.goto_active && S.current_focus.length > 0
    && S.prev_mouse_x == S.mouse_x && S.prev_mouse_y == S.mouse_y) {
    clear_goto_tiles();
    const ptile = canvas_pos_to_tile(S.mouse_x, S.mouse_y);
    if (ptile != null) {
      for (let i = 0; i < S.current_focus.length; i++) {
        request_goto_path(S.current_focus[i]['id'], ptile['x'], ptile['y']);
      }
    }
  }
  S.setPrevMouseX(S.mouse_x);
  S.setPrevMouseY(S.mouse_y);
}

export function update_goto_path(goto_packet: Record<string, unknown> & { unit_id: number; dest: number; dir: number[]; length: number; turns: number }) {
  const punit = store.units[goto_packet['unit_id']];
  if (punit == null) return;
  const t0 = index_to_tile(punit['tile']);
  let ptile = t0;
  const goaltile = index_to_tile(goto_packet['dest']);

  for (let i = 0; i < goto_packet['dir'].length; i++) {
    if (ptile == null) break;
    const dir = goto_packet['dir'][i];

    if (dir == -1) {
      continue;
    }

    ptile['goto_dir'] = dir;
    ptile = mapstep(ptile, dir);
  }

  S.setCurrentGotoTurns(goto_packet['turns']);

  S.goto_request_map[goto_packet['unit_id'] + "," + goaltile!['x'] + "," + goaltile!['y']] = goto_packet;
  S.goto_turns_request_map[goto_packet['unit_id'] + "," + goaltile!['x'] + "," + goaltile!['y']]
    = S.current_goto_turns;

  if (S.current_goto_turns != undefined) {
    activeUnitInfo.value = 'Turns for goto: ' + S.current_goto_turns;
  }
  update_mouse_cursor();
}

/**
 * Map click handling, paradrop, dialog detection, and tile popup.
 *
 * Goto path management has been extracted to gotoPath.ts.
 * Re-exports are provided below for backward compatibility.
 */

import { store } from '../../data/store';
import type { Tile, Unit, City, UnitType } from '../../data/types';
import { unit_type, tile_units, Order, UnitSSDataType } from '../../data/unit';
import { indexToTile as index_to_tile, mapPosToTile as map_pos_to_tile, mapstep, clearGotoTiles as clear_goto_tiles, getMapInfo } from '../../data/map';
import { tileCity as tile_city, tileGetKnown as tile_get_known, TILE_UNKNOWN } from '../../data/tile';
import { cityTile as city_tile } from '../../data/city';
import { actionByNumber as action_by_number, actionHasResult as action_has_result } from '../../data/actions';
import { utype_can_do_action } from '../../data/unittype';
import { ACTIVITY_IDLE, ACTIVITY_LAST, ACTRES_PARADROP, ACTRES_PARADROP_CONQUER, ACTION_AIRLIFT } from '../../data/fcTypes';
import { ACTION_COUNT, RENDERER_2DCANVAS } from '../../core/constants';
import { sendUnitSscsSet, sendUnitOrders, sendInfoTextReq } from '../../net/commands';
import { isTouchDevice as is_touch_device } from '../../utils/helpers';
import { clientIsObserver as client_is_observer, clientPlaying } from '../../client/clientState';
import { message_log } from '../../core/messages';
import { E_BEGINNER_HELP, E_BAD_COMMAND } from '../../data/eventConstants';
import { canvas_pos_to_tile, center_tile_mapcanvas_2d } from '../../renderer/mapviewCommon';
import { unit_move_sound_play } from '../../audio/sounds';
import { showDialogMessage as show_dialog_message } from '../../client/civClient';
import { show_city_dialog } from '../../ui/cityDialog';
import * as S from './controlState';
// Circular imports — OK, only used inside functions
import { set_unit_focus_and_redraw, set_unit_focus_and_activate, update_unit_focus, update_active_units_dialog, find_visible_unit, find_a_focus_unit_tile_to_center_on } from './unitFocus';
import { request_unit_do_action, request_unit_act_sel_vs } from './unitCommands';
import { deactivate_goto, request_goto_path } from './gotoPath';

const USSDT_QUEUE = UnitSSDataType.QUEUE;
const ORDER_LAST = Order.LAST;
const ORDER_MOVE = Order.MOVE;
const ORDER_ACTION_MOVE = Order.ACTION_MOVE;
const ORDER_FULL_MP = Order.FULL_MP;


// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function order_wants_direction(order: number, act_id: number, ptile: Tile): boolean {
  const action = store.actions[act_id];

  if (order == S.goto_last_order && action == null) {
    console.log("Asked to put invalid action " + act_id + " in an order.");
    return false;
  }

  switch (order) {
    case ORDER_MOVE:
    case ORDER_ACTION_MOVE:
      return true;
    case Order.PERFORM_ACTION:
      if ((action['min_distance'] as number) > 0) {
        return true;
      }
      if ((action['max_distance'] as number) < 1) {
        return false;
      }
      if (tile_city(ptile) != null
        || (tile_units(ptile) ?? []).length != 0) {
        return true;
      }
      return false;
    default:
      return false;
  }
}

export function do_unit_paradrop_to(punit: Unit, ptile: Tile): void {
  let act_id: number;
  let paradrop_action: { id: number; result: number; [key: string]: unknown } | null = null;
  const FC_ACTION_COUNT = ACTION_COUNT;

  for (act_id = 0; act_id < FC_ACTION_COUNT; act_id++) {
    const paction = action_by_number(act_id);

    if (!(action_has_result(paction, ACTRES_PARADROP_CONQUER)
      || action_has_result(paction, ACTRES_PARADROP))) {
      continue;
    }

    if (utype_can_do_action(unit_type(punit), act_id)) {
      if (paradrop_action == null) {
        paradrop_action = paction;
      } else {
        sendUnitSscsSet(punit['id'], USSDT_QUEUE, ptile['index']);
        return;
      }
    }
  }

  if (paradrop_action != null) {
    request_unit_do_action(paradrop_action['id'], punit['id'],
      ptile['index']);
  }
}

export function do_map_click(ptile: Tile, qtype: number, first_time_called: boolean) {
  let punit: Unit;
  let packet: {
    unit_id: number;
    src_tile: number;
    length: number;
    repeat: boolean;
    vigilant: boolean;
    dest_tile: number;
    orders: Record<string, number>[];
  };
  let pcity: City | null;
  if (ptile == null) return;
  if (client_is_observer()) {
    const ocity = tile_city(ptile);
    if (ocity) {
      show_city_dialog(ocity);
    } else {
      popit_req(ptile);
    }
    return;
  }

  if (S.current_focus.length > 0 && S.current_focus[0]['tile'] == ptile['index']) {
    if (S.goto_active && !is_touch_device()) {
      deactivate_goto(false);
    }
    if (store.renderer == RENDERER_2DCANVAS) {
      document.getElementById("canvas")?.dispatchEvent(new Event("contextmenu"));
    } else {
      document.getElementById("canvas_div")?.dispatchEvent(new Event("contextmenu"));
    }
    return;
  }
  const sunits = tile_units(ptile);
  pcity = tile_city(ptile);

  if (S.goto_active) {
    if (S.current_focus.length > 0) {
      for (let s = 0; s < S.current_focus.length; s++) {
        punit = S.current_focus[s];
        const goto_path = S.goto_request_map[punit['id'] + "," + ptile['x'] + "," + ptile['y']];
        if (goto_path == null || goto_path === true) {
          continue;
        }

        const old_tile = index_to_tile(punit['tile']);

        packet = {
          "unit_id": punit['id'],
          "src_tile": old_tile!['index'],
          "length": goto_path['length'],
          "repeat": false,
          "vigilant": false,
          "dest_tile": ptile['index'],
          "orders": []
        };

        const order: Record<string, number> = {
          "order": ORDER_LAST,
          "activity": ACTIVITY_LAST,
          "target": 0,
          "sub_target": 0,
          "action": ACTION_COUNT,
          "dir": -1
        };

        for (let i = 0; i < goto_path['length']; i++) {
          if (goto_path['dir'][i] == -1) {
            order['order'] = ORDER_FULL_MP;
          } else if (i + 1 != goto_path['length']) {
            order['order'] = ORDER_MOVE;
          } else {
            order['order'] = ORDER_ACTION_MOVE;
          }

          order['dir'] = goto_path['dir'][i];
          order['activity'] = ACTIVITY_LAST;
          order['target'] = 0;
          order['sub_target'] = 0;
          order['action'] = ACTION_COUNT;

          packet['orders'][i] = Object.assign({}, order);
        }

        if (S.goto_last_order != ORDER_LAST) {
          let pos: number;

          if (!order_wants_direction(S.goto_last_order, S.goto_last_action,
            ptile)) {
            pos = packet['length'];
            packet['length'] = packet['length'] + 1;
            order['order'] = ORDER_LAST;
            order['dir'] = -1;
            order['activity'] = ACTIVITY_LAST;
            order['target'] = 0;
            order['sub_target'] = 0;
            order['action'] = ACTION_COUNT;
          } else {
            pos = packet['length'] - 1;
          }

          order['order'] = S.goto_last_order;
          order['action'] = S.goto_last_action;
          order['target'] = ptile['index'];

          packet['orders'][pos] = Object.assign({}, order);
        }

        S.setGotoLastOrder(ORDER_LAST);
        S.setGotoLastAction(ACTION_COUNT);

        if (punit['id'] != goto_path['unit_id']) {
          console.log("Error: Tried to order unit " + punit['id']
            + " to move along a path made for unit "
            + goto_path['unit_id']);
          return;
        }
        sendUnitOrders(packet);
        if (punit['movesleft'] > 0) {
          unit_move_sound_play(punit);
        } else if (!S.has_movesleft_warning_been_shown) {
          S.setHasMovesleftWarningBeenShown(true);
          const ptype = unit_type(punit);
          message_log.update({
            event: E_BAD_COMMAND,
            message: (ptype ? ptype['name'] : 'Unit') + " has no moves left. Press turn done for the next turn."
          });
        }

      }
      clear_goto_tiles();

    } else if (is_touch_device()) {
      if (S.current_focus.length > 0) {
        request_goto_path(S.current_focus[0]['id'], ptile['x'], ptile['y']);
        if (first_time_called) {
          setTimeout(function () {
            do_map_click(ptile, qtype, false);
          }, 250);
        }
        return;
      }
    }

    deactivate_goto(true);
    update_unit_focus();

  } else if (S.paradrop_active && S.current_focus.length > 0) {
    punit = S.current_focus[0];
    do_unit_paradrop_to(punit, ptile);
    S.setParadropActive(false);

  } else if (S.airlift_active && S.current_focus.length > 0) {
    punit = S.current_focus[0];
    pcity = tile_city(ptile);
    if (pcity != null) {
      request_unit_do_action(ACTION_AIRLIFT, punit['id'], pcity['id']);
    }
    S.setAirliftActive(false);

  } else if (S.action_tgt_sel_active && S.current_focus.length > 0) {
    request_unit_act_sel_vs(ptile);
    S.setActionTgtSelActive(false);
  } else {
    if (pcity != null) {
      if (clientPlaying() != null && pcity['owner'] == clientPlaying()!.playerno) {
        if (sunits != null && sunits.length > 0
          && sunits[0]['activity'] == ACTIVITY_IDLE) {
          set_unit_focus_and_redraw(sunits[0]);
          if (store.renderer == RENDERER_2DCANVAS) {
            document.getElementById("canvas")?.dispatchEvent(new Event("contextmenu"));
          } else {
            document.getElementById("canvas_div")?.dispatchEvent(new Event("contextmenu"));
          }
        } else if (!S.goto_active) {
          show_city_dialog(pcity);
        }
      }
      return;
    }

    if (sunits != null && sunits.length == 0) {
      set_unit_focus_and_redraw(null);

    } else if (sunits != null && sunits.length > 0) {
      if (clientPlaying() != null && sunits[0]['owner'] == clientPlaying()!.playerno) {
        if (sunits.length == 1) {
          const unit = sunits[0];
          set_unit_focus_and_activate(unit);
        } else {
          set_unit_focus_and_redraw(sunits[0]);
          update_active_units_dialog();
        }

        if (is_touch_device()) {
          if (store.renderer == RENDERER_2DCANVAS) {
            document.getElementById("canvas")?.dispatchEvent(new Event("contextmenu"));
          } else {
            document.getElementById("canvas_div")?.dispatchEvent(new Event("contextmenu"));
          }
        }
      } else if (pcity == null) {
        S.setCurrentFocus(sunits);
        const guod = document.getElementById("game_unit_orders_default");
        if (guod) guod.style.display = 'none';
        update_active_units_dialog();
      }
    }
  }

  S.setParadropActive(false);
  S.setAirliftActive(false);
  S.setActionTgtSelActive(false);
}

export function find_active_dialog() {
  const permanent_widgets = ["game_overview_panel", "game_unit_panel", "game_chatbox_panel"];
  const dialogs = document.querySelectorAll(".ui-dialog");
  for (let i = 0; i < dialogs.length; i++) {
    const dialog = dialogs[i] as HTMLElement;
    if (dialog.style.display == "none") {
      continue;
    }
    const children = dialog.children;
    if (children.length >= 2 && permanent_widgets.indexOf((children[1] as HTMLElement).id) < 0) {
      return dialog;
    }
  }
  return null;
}

export function center_tile_mapcanvas(ptile: Tile | null) {
  if (ptile == null) return;
  center_tile_mapcanvas_2d(ptile);
}

export function popit() {
  let ptile: Tile | null;

  ptile = canvas_pos_to_tile(S.mouse_x, S.mouse_y);

  if (ptile == null) return;

  popit_req(ptile);
}

export function popit_req(ptile: Tile | null) {
  if (ptile == null) return;

  if (tile_get_known(ptile) == TILE_UNKNOWN) {
    show_dialog_message("Tile info", "Location: x:" + ptile['x'] + " y:" + ptile['y']);
    return;
  }

  let punit_id = 0;
  const punit = find_visible_unit(ptile);
  if (punit != null) punit_id = punit['id'];

  let focus_unit_id = 0;
  if (S.current_focus.length > 0) {
    focus_unit_id = S.current_focus[0]['id'];
  }

  sendInfoTextReq(punit_id, ptile['index'], focus_unit_id);
}

export function center_on_any_city() {
  // If map info is known, center on the map center — avoids showing the
  // world-boundary black edge as the first thing the observer sees.
  // Use getMapInfo() (reads window.map) as it is reliably set by handle_map_info
  // before tiles arrive. store.mapInfo may be an empty {} from game_init().
  const mi = getMapInfo();
  if (mi && mi.xsize && mi.ysize) {
    const midTile = map_pos_to_tile(Math.floor(mi.xsize / 2), Math.floor(mi.ysize / 2));
    if (midTile) {
      center_tile_mapcanvas(midTile);
      return;
    }
    // Fallback: pick any valid tile from the map center area
    const tiles = (window as any).tiles as Record<number, any> | undefined;
    if (tiles) {
      const midIdx = Math.floor(mi.xsize / 2) + Math.floor(mi.ysize / 2) * mi.xsize;
      const t = tiles[midIdx];
      if (t) { center_tile_mapcanvas(t); return; }
    }
  }
  // Fallback: center on first city
  for (const city_id in store.cities) {
    const pcity = store.cities[city_id];
    center_tile_mapcanvas(city_tile(pcity));
    return;
  }
  // Fallback: center on first visible unit
  for (const unit_id in store.units) {
    const punit = store.units[unit_id];
    const ptile = index_to_tile(punit['tile'] as number);
    if (ptile) {
      center_tile_mapcanvas(ptile);
      return;
    }
  }
}

// ---------------------------------------------------------------------------
// Re-exports from gotoPath.ts for backward compatibility
// ---------------------------------------------------------------------------
export { activate_goto, activate_goto_last, deactivate_goto, send_end_turn, request_goto_path, check_request_goto_path, update_goto_path } from './gotoPath';

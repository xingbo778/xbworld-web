/**
 * Keyboard event handling.
 *
 * Extracted from core/control.ts — global_keyboard_listener,
 * civclient_handle_key, map_handle_key, handle_context_menu_callback.
 */

import { clientState as client_state, C_S_RUNNING, clientIsObserver } from '../../client/clientState';
import { isTouchDevice as is_touch_device, civclient_benchmark } from '../../utils/helpers';
import { showDebugInfo } from '../../client/clientDebug';
import { clearGotoTiles } from '../../data/map';
import { tileCity } from '../../data/tile';
import { show_city_dialog } from '../../ui/cityDialog';
import { setMapSelectActive, setMapSelectCheck } from '../../renderer/mapctrl';
import {
  RENDERER_2DCANVAS,
  DIR8_SOUTH, DIR8_SOUTHEAST, DIR8_EAST, DIR8_SOUTHWEST,
  DIR8_NORTHEAST, DIR8_WEST, DIR8_NORTHWEST, DIR8_NORTH,
} from '../constants';
import * as S from './controlState';
// Circular imports — OK, only used inside functions
import { find_a_focus_unit_tile_to_center_on, auto_center_on_focus_unit, set_unit_focus_and_redraw, update_active_units_dialog } from './unitFocus';
import { activate_goto, deactivate_goto, find_active_dialog, popit_req, send_end_turn } from './mapClick';
import {
  key_unit_auto_explore, key_unit_load, key_unit_unload, key_unit_show_cargo,
  key_unit_wait, key_unit_noorders, key_unit_idle, key_unit_sentry, key_unit_fortify,
  key_unit_fortress, key_unit_airbase, key_unit_irrigate, key_unit_cultivate,
  key_unit_clean, key_unit_nuke, key_unit_upgrade, key_unit_paradrop, key_unit_airlift,
  key_unit_transform, key_unit_pillage, key_unit_mine, key_unit_plant, key_unit_road,
  key_unit_homecity, key_unit_action_select, key_unit_auto_work, key_unit_disband,
  key_unit_move, request_unit_build_city
} from './unitCommands';
import { getActiveTab, setActiveTab } from '../../ui/tabs';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function global_keyboard_listener(ev: KeyboardEvent) {
  if (document.querySelector('input:focus') != null || !S.keyboard_input) return;

  if (C_S_RUNNING != client_state()) return;

  if (!ev) ev = window.event as KeyboardEvent;
  const keyboard_key = String.fromCharCode(ev.keyCode);

  if (0 === getActiveTab('#tabs')) {
    if (find_active_dialog() == null) {
      map_handle_key(keyboard_key, ev.keyCode, ev['ctrlKey'], ev['altKey'], ev['shiftKey'], ev);
    }
  }
  civclient_handle_key(keyboard_key, ev.keyCode, ev['ctrlKey'], ev['altKey'], ev['shiftKey'], ev);

  if ((window as any).renderer == RENDERER_2DCANVAS) {
    const canvasEl = document.getElementById('canvas');
    (canvasEl as any)?.contextMenu?.('hide');
  }
}

export function civclient_handle_key(keyboard_key: string, key_code: number, ctrl: boolean, alt: boolean, shift: boolean, the_event: KeyboardEvent) {
  switch (keyboard_key) {
    case 'Q':
      if (alt) civclient_benchmark(0);
      break;

    case 'D':
      if ((!shift) && (alt || ctrl)) {
        showDebugInfo();
      }
      break;

    default:
      if (key_code == 13 && shift && C_S_RUNNING == client_state() && !clientIsObserver()) {
        send_end_turn();
      }
  }
}

export function map_handle_key(keyboard_key: string, key_code: number, ctrl: boolean, alt: boolean, shift: boolean, the_event: KeyboardEvent) {
  switch (keyboard_key) {
    case 'B':
      request_unit_build_city();
      break;

    case 'G':
      if (S.current_focus.length > 0) {
        activate_goto();
      }
      break;

    case 'H':
      key_unit_homecity();
      break;

    case 'X':
      key_unit_auto_explore();
      break;

    case 'A':
      key_unit_auto_work();
      break;

    case 'L':
      if (shift) {
        key_unit_airlift();
      } else {
        key_unit_load();
      }
      break;

    case 'W':
      key_unit_wait();
      break;

    case 'J':
      if (shift) {
        key_unit_idle();
      } else {
        key_unit_noorders();
      }
      break;

    case 'R':
      key_unit_road();
      break;

    case 'E':
      if (shift) {
        key_unit_airbase();
      }
      break;

    case 'F':
      if (shift) {
        key_unit_fortress();
      } else {
        key_unit_fortify();
      }
      break;

    case 'I':
      if (shift) {
        key_unit_cultivate();
      } else {
        key_unit_irrigate();
      }
      break;

    case 'U':
      key_unit_upgrade();
      break;

    case 'S':
      if (!ctrl) {
        key_unit_sentry();
      }
      break;

    case 'P':
      if (shift) {
        key_unit_pillage();
      } else {
        key_unit_clean();
      }
      break;

    case 'M':
      if (shift) {
        key_unit_plant();
      } else {
        key_unit_mine();
      }
      break;

    case 'O':
      key_unit_transform();
      break;

    case 'T':
      key_unit_unload();
      break;

    case 'C':
      if (ctrl) {
        S.setShowCitybar(!S.show_citybar);
      } else if (S.current_focus.length > 0) {
        auto_center_on_focus_unit();
      }
      break;

    case 'N':
      if (shift) {
        key_unit_nuke();
      }
      break;

    case 'D':
      if (shift) {
        key_unit_disband();
      } else if (!(alt || ctrl)) {
        key_unit_action_select();
      }
      break;

  }

  switch (key_code) {
    case 35: //1
    case 97:
      key_unit_move(DIR8_SOUTH);
      break;

    case 40: // 2
    case 98:
      key_unit_move(DIR8_SOUTHEAST);
      break;

    case 34: // 3
    case 99:
      key_unit_move(DIR8_EAST);
      break;

    case 37: // 4
    case 100:
      key_unit_move(DIR8_SOUTHWEST);
      break;

    case 39: // 6
    case 102:
      key_unit_move(DIR8_NORTHEAST);
      break;

    case 36: // 7
    case 103:
      key_unit_move(DIR8_WEST);
      break;

    case 38: // 8
    case 104:
      key_unit_move(DIR8_NORTHWEST);
      break;

    case 33: // 9
    case 105:
      key_unit_move(DIR8_NORTH);
      break;

    case 27:
      //Esc

      deactivate_goto(false);

      setMapSelectActive(false);
      setMapSelectCheck(false);
      S.setMapviewMouseMovement(false);

      S.setContextMenuActive(true);
      if ((window as any).renderer == RENDERER_2DCANVAS) {
        const canvasEl = document.getElementById('canvas');
        (canvasEl as any)?.contextMenu?.(true);
      } else {
        const canvasDivEl = document.getElementById('canvas_div');
        (canvasDivEl as any)?.contextMenu?.(true);
      }

      S.setParadropActive(false);
      S.setAirliftActive(false);
      S.setActionTgtSelActive(false);
      break;

    case 32: // Space, will clear selection and goto.
      S.setCurrentFocus([]);
      S.setGotoActive(false);
      const canvasDiv = document.getElementById('canvas_div');
      if (canvasDiv) canvasDiv.style.cursor = 'default';
      S.setGotoRequestMap({});
      S.setGotoTurnsRequestMap({});
      clearGotoTiles();
      update_active_units_dialog();

      break;

    case 107:
      //zoom in (2D only - no-op)
      break;

    case 109:
      //zoom out (2D only - no-op)
      break;

  }

}

export function handle_context_menu_callback(key: string) {
  switch (key) {
    case "build":
      request_unit_build_city();
      break;

    case "tile_info":
      const ptile = find_a_focus_unit_tile_to_center_on();
      if (ptile != null) popit_req(ptile);
      break;

    case "goto":
      activate_goto();
      break;

    case "explore":
      key_unit_auto_explore();
      break;

    case "fortify":
      key_unit_fortify();
      break;

    case "road":
    case "railroad":
    case "maglev":
      key_unit_road();
      break;

    case "plant":
      key_unit_plant();
      break;

    case "mine":
      key_unit_mine();
      break;

    case "autoworkers":
      key_unit_auto_work();
      break;

    case "clean":
      key_unit_clean();
      break;

    case "cultivate":
      key_unit_cultivate();
      break;

    case "irrigation":
      key_unit_irrigate();
      break;

    case "fortress":
      key_unit_fortress();
      break;

    case "airbase":
      key_unit_airbase();
      break;

    case "transform":
      key_unit_transform();
      break;

    case "nuke":
      key_unit_nuke();
      break;

    case "paradrop":
      key_unit_paradrop();
      break;

    case "pillage":
      key_unit_pillage();
      break;

    case "homecity":
      key_unit_homecity();
      break;

    case "airlift":
      key_unit_airlift();
      break;

    case "sentry":
      key_unit_sentry();
      break;

    case "wait":
      key_unit_wait();
      break;

    case "noorders":
      key_unit_noorders();
      break;

    case "idle":
      key_unit_idle();
      break;

    case "upgrade":
      key_unit_upgrade();
      break;

    case "disband":
      key_unit_disband();
      break;

    case "unit_load":
      key_unit_load();
      break;

    case "unit_unload":
      key_unit_unload();
      break;

    case "unit_show_cargo":
      key_unit_show_cargo();
      break;

    case "action_selection":
      key_unit_action_select();
      break;

    case "show_city":
      const stile = find_a_focus_unit_tile_to_center_on();
      if (stile != null) {
        show_city_dialog(tileCity(stile));
      }
      break;
  }
  if (key != "goto" && is_touch_device()) {
    deactivate_goto(false);
  }
}

/**
 * Mouse and touch event handling.
 *
 * Extracted from core/control.ts — mouse_moved_cb, update_mouse_cursor,
 * set_mouse_touch_started_on_unit, check_mouse_drag_unit.
 */

import { store } from '../../data/store';
import { cityOwnerPlayerId as city_owner_player_id } from '../../data/city';
import { tileCity as tile_city } from '../../data/tile';
import { tile_units } from '../../data/unit';
import { canvas_pos_to_tile } from '../../renderer/mapviewCommon';
import { isTouchDevice as is_touch_device } from '../../utils/helpers';
import { clientState as client_state, C_S_RUNNING } from '../../client/clientState';
import { update_tech_dialog_cursor, tech_dialog_active } from '../../ui/techDialog';
import * as S from './controlState';
// Circular imports — OK, only used inside functions
import { find_visible_unit, set_unit_focus, update_active_units_dialog } from './unitFocus';
import { activate_goto } from './mapClick';

declare const $: any;

// Access globals via window to avoid bare-reference ReferenceError in IIFE bundle.
// These are registered by globalRegistry.ts at startup.
const w = window as any;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function mouse_moved_cb(e: MouseEvent): void {
  const mapview_slide = w.mapview_slide;
  if (mapview_slide != null && mapview_slide['active']) return;

  S.setMouseX(0);
  S.setMouseY(0);
  if (!e) {
    e = window.event as MouseEvent;
  }
  if (e.pageX || e.pageY) {
    S.setMouseX(e.pageX);
    S.setMouseY(e.pageY);
  } else {
    if (e.clientX || e.clientY) {
      S.setMouseX(e.clientX);
      S.setMouseY(e.clientY);
    }
  }

  if (w.RENDERER_2DCANVAS && w.active_city == null && w.mapview_canvas != null
    && $("#canvas").length) {
    S.setMouseX(S.mouse_x - $("#canvas").offset().left);
    S.setMouseY(S.mouse_y - $("#canvas").offset().top);

    if (S.mapview_mouse_movement && !S.goto_active) {
      const diff_x = (w.touch_start_x - S.mouse_x) * 2;
      const diff_y = (w.touch_start_y - S.mouse_y) * 2;

      w.mapview['gui_x0'] += diff_x;
      w.mapview['gui_y0'] += diff_y;
      w.touch_start_x = S.mouse_x;
      w.touch_start_y = S.mouse_y;
      update_mouse_cursor();
    }
  } else if (w.active_city != null && w.city_canvas != null
    && $("#city_canvas").length) {
    S.setMouseX(S.mouse_x - $("#city_canvas").offset().left);
    S.setMouseY(S.mouse_y - $("#city_canvas").offset().top);
  }

  if (w.client.conn.playing == null) return;

  if (C_S_RUNNING == client_state()) {
    update_mouse_cursor();
  }

  if (w.map_select_check && Math.abs(S.mouse_x - w.map_select_x) > 45
    && Math.abs(S.mouse_y - w.map_select_y) > 45
    && (new Date().getTime() - w.map_select_check_started) > 200) {
    w.map_select_active = true;
  }
}

export function update_mouse_cursor(): void {
  if (tech_dialog_active && !is_touch_device()) {
    update_tech_dialog_cursor();
    return;
  }

  const ptile = canvas_pos_to_tile(S.mouse_x, S.mouse_y);

  if (ptile == null) return;

  const punit = find_visible_unit(ptile);
  const pcity = tile_city(ptile);

  if (S.mapview_mouse_movement && !S.goto_active) {
    $("#canvas_div").css("cursor", "move");
  } else if (S.goto_active && S.current_goto_turns != null) {
    $("#canvas_div").css("cursor", "crosshair");
  } else if (S.goto_active && S.current_goto_turns == null) {
    $("#canvas_div").css("cursor", "not-allowed");
  } else if (pcity != null && w.client.conn.playing != null && city_owner_player_id(pcity) == w.client.conn.playing.playerno) {
    $("#canvas_div").css("cursor", "pointer");
  } else if (punit != null && w.client.conn.playing != null && punit['owner'] == w.client.conn.playing.playerno) {
    $("#canvas_div").css("cursor", "pointer");
  } else {
    $("#canvas_div").css("cursor", "default");
  }
}

export function set_mouse_touch_started_on_unit(ptile: any): void {
  if (ptile == null) return;
  const sunit = find_visible_unit(ptile);
  if (sunit != null && store.client.conn.playing != null && sunit['owner'] == store.client.conn.playing.playerno) {
    S.setMouseTouchStartedOnUnit(true);
  } else {
    S.setMouseTouchStartedOnUnit(false);
  }
}

export function check_mouse_drag_unit(ptile: any): void {
  if (ptile == null || !S.mouse_touch_started_on_unit) return;

  const sunit = find_visible_unit(ptile);

  if (sunit != null) {
    if (store.client.conn.playing != null && sunit['owner'] == store.client.conn.playing.playerno) {
      set_unit_focus(sunit);
      activate_goto();
    }
  }

  const ptile_units = tile_units(ptile) || [];
  if (ptile_units.length > 1) {
    update_active_units_dialog();
  }
}

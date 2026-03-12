/**
 * Mouse and touch event handling.
 *
 * Extracted from core/control.ts — mouse_moved_cb, update_mouse_cursor,
 * set_mouse_touch_started_on_unit, check_mouse_drag_unit.
 */

import { cityOwnerPlayerId as city_owner_player_id } from '../../data/city';
import { active_city } from '../../ui/cityDialog';
import { tileCity as tile_city } from '../../data/tile';
import { tile_units } from '../../data/unit';
import { canvas_pos_to_tile, mapview, mapview_slide, mark_all_dirty } from '../../renderer/mapviewCommon';
import { set_mapview_origin } from '../../renderer/mapCoords';
import { store } from '../../data/store';
import { touch_start_x, touch_start_y, map_select_check, map_select_x, map_select_y, map_select_check_started, setMapSelectActive, setTouchStart } from '../../renderer/mapctrl';
import { isTouchDevice as is_touch_device } from '../../utils/helpers';
import { clientState as client_state, C_S_RUNNING, clientPlaying } from '../../client/clientState';
import { tech_dialog_active } from '../../ui/techDialog';
import * as S from './controlState';
// Circular imports — OK, only used inside functions
import { find_visible_unit, set_unit_focus, update_active_units_dialog } from './unitFocus';
import { activate_goto } from './gotoPath';
import { mark_overview_dirty, mark_overview_viewport_dirty } from '../overview';
import type { Tile } from '../../data/types';


// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function mouse_moved_cb(e: MouseEvent): void {
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

  const canvasDiv = document.getElementById('canvas_div');
  if (active_city == null && canvasDiv) {
    const canvasRect = canvasDiv.getBoundingClientRect();
    S.setMouseX(S.mouse_x - canvasRect.left);
    S.setMouseY(S.mouse_y - canvasRect.top);

    if (S.mapview_mouse_movement && !S.goto_active) {
      const diff_x = (touch_start_x - S.mouse_x) * 2;
      const diff_y = (touch_start_y - S.mouse_y) * 2;

      // Use set_mapview_origin so gui_x0/y0 are normalized/wrapped every drag step.
      // Direct assignment (gui_x0 += diff) can push coordinates outside the map's
      // GUI space, causing PixiRenderer viewport culling to find zero visible tiles
      // and the map to appear frozen after dragging to a boundary.
      if (store.mapInfo) {
        set_mapview_origin((mapview['gui_x0'] as number) + diff_x, (mapview['gui_y0'] as number) + diff_y);
      } else {
        mapview['gui_x0'] = (mapview['gui_x0'] as number) + diff_x;
        mapview['gui_y0'] = (mapview['gui_y0'] as number) + diff_y;
      }
      mark_all_dirty();
      // During drag only the viewport rect needs updating — tile colors haven't changed.
      // mark_overview_viewport_dirty() skips the O(n_tiles) grid rebuild entirely.
      mark_overview_viewport_dirty();
      setTouchStart(S.mouse_x, S.mouse_y);
      update_mouse_cursor();
    }
  } else {
    const cityCanvasEl = document.getElementById('city_canvas');
    if (active_city != null && cityCanvasEl) {
      const cityCanvasRect = cityCanvasEl.getBoundingClientRect();
      S.setMouseX(S.mouse_x - cityCanvasRect.left);
      S.setMouseY(S.mouse_y - cityCanvasRect.top);
    }
  }

  if (clientPlaying() == null) return;

  if (C_S_RUNNING == client_state()) {
    update_mouse_cursor();
  }

  if (map_select_check && Math.abs(S.mouse_x - map_select_x) > 45
    && Math.abs(S.mouse_y - map_select_y) > 45
    && (new Date().getTime() - map_select_check_started) > 200) {
    setMapSelectActive(true);
  }
}

export function update_mouse_cursor(): void {
  if (tech_dialog_active && !is_touch_device()) return;

  const ptile = canvas_pos_to_tile(S.mouse_x, S.mouse_y);

  if (ptile == null) return;

  const punit = find_visible_unit(ptile);
  const pcity = tile_city(ptile);

  const canvasDiv = document.getElementById('canvas_div');
  if (!canvasDiv) return;

  if (S.mapview_mouse_movement && !S.goto_active) {
    canvasDiv.style.cursor = "move";
  } else if (S.goto_active && S.current_goto_turns != null) {
    canvasDiv.style.cursor = "crosshair";
  } else if (S.goto_active && S.current_goto_turns == null) {
    canvasDiv.style.cursor = "not-allowed";
  } else if (pcity != null && clientPlaying() != null && city_owner_player_id(pcity) == clientPlaying()!.playerno) {
    canvasDiv.style.cursor = "pointer";
  } else if (punit != null && clientPlaying() != null && punit['owner'] == clientPlaying()!.playerno) {
    canvasDiv.style.cursor = "pointer";
  } else {
    canvasDiv.style.cursor = "default";
  }
}

export function set_mouse_touch_started_on_unit(ptile: Tile | null): void {
  if (ptile == null) return;
  const sunit = find_visible_unit(ptile);
  if (sunit != null && clientPlaying() != null && sunit['owner'] == clientPlaying()!.playerno) {
    S.setMouseTouchStartedOnUnit(true);
  } else {
    S.setMouseTouchStartedOnUnit(false);
  }
}

export function check_mouse_drag_unit(ptile: Tile | null): void {
  if (ptile == null || !S.mouse_touch_started_on_unit) return;

  const sunit = find_visible_unit(ptile);

  if (sunit != null) {
    if (clientPlaying() != null && sunit['owner'] == clientPlaying()!.playerno) {
      set_unit_focus(sunit);
      activate_goto();
    }
  }

  const ptile_units = tile_units(ptile) || [];
  if (ptile_units.length > 1) {
    update_active_units_dialog();
  }
}

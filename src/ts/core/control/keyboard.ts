/**
 * Keyboard event handling — observer mode.
 *
 * Unit command hotkeys are removed. Only navigation and debug shortcuts remain.
 */

import { store } from '../../data/store';
import { clientState as client_state, C_S_RUNNING, clientIsObserver } from '../../client/clientState';
import { civclient_benchmark } from '../../utils/helpers';
import { showDebugInfo } from '../../client/clientDebug';
import { show_city_dialog } from '../../ui/cityDialog';
import { tileCity } from '../../data/tile';
import * as S from './controlState';
import { getActiveTab } from '../../ui/tabs';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function global_keyboard_listener(ev: KeyboardEvent) {
  if (document.querySelector('input:focus') != null || !S.keyboard_input) return;
  if (C_S_RUNNING != client_state()) return;
  if (!ev) ev = window.event as KeyboardEvent;

  civclient_handle_key(String.fromCharCode(ev.keyCode), ev.keyCode, ev['ctrlKey'], ev['altKey'], ev['shiftKey'], ev);

  // context menu hide is handled by the Pixi event system
}

export function civclient_handle_key(keyboard_key: string, key_code: number, ctrl: boolean, alt: boolean, _shift: boolean, _the_event: KeyboardEvent) {
  switch (keyboard_key) {
    case 'Q':
      if (alt) civclient_benchmark(0);
      break;
    case 'D':
      if ((!_shift) && (alt || ctrl)) showDebugInfo();
      break;
    case 'C':
      if (ctrl) S.setShowCitybar(!S.show_citybar);
      break;
  }

  // ESC — cancel any active mode
  if (key_code === 27) {
    S.setContextMenuActive(true);
    const canvasDivEl = document.getElementById('canvas_div');
    (canvasDivEl as unknown as { contextMenu?: (arg: boolean) => void })?.contextMenu?.(true);
  }
}

// map_handle_key is a no-op in observer mode — no unit commands
export function map_handle_key(_keyboard_key: string, _key_code: number, _ctrl: boolean, _alt: boolean, _shift: boolean, _the_event: KeyboardEvent): void {}

// context menu is unavailable in observer mode
export function handle_context_menu_callback(key: string): void {
  if (key === 'show_city') {
    const ptile = S.current_focus[0] != null
      ? store.tiles[(S.current_focus[0] as Record<string, unknown>)['tile'] as number]
      : null;
    if (ptile) {
      const city = tileCity(ptile);
      if (city) show_city_dialog(city);
    }
  }
}

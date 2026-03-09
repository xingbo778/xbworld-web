/**
 * cityDialog — observer-mode shim.
 *
 * All heavy DOM/jQuery dialog rendering is replaced by the Preact
 * CityDialog component (components/Dialogs/CityDialog.tsx).
 *
 * Data state lives in cityDialogState.ts and cityLogic.ts (unchanged).
 * Worklist/buy/sell/CMA are player-only; their stubs are inlined below.
 */

import { store } from '../data/store';
import type { City } from '../data/types';
import { globalEvents } from '../core/events';
import {
  cities, active_city,
  set_active_city, set_city_prod_clicks, set_production_selection, set_worklist_selection,
} from './cityDialogState';
import { buildCityListHtml } from './cityLogic';
import { setHtml as domSetHtml } from '../utils/dom';
import { showCityDialogPreact, closeCityDialogPreact, cityDialogSignal } from '../components/Dialogs/CityDialog';

// Re-export state for backward compatibility
export {
  citydlg_map_width, citydlg_map_height,
  cities, city_rules, city_trade_routes, goods,
  active_city, worklist_dialog_active, production_selection, worklist_selection,
  CITYO_DISBAND, CITYO_NEW_EINSTEIN, CITYO_NEW_TAXMAN, CITYO_LAST,
  FEELING_BASE, FEELING_LUXURY, FEELING_EFFECT, FEELING_NATIONALITY, FEELING_MARTIAL, FEELING_FINAL,
  MAX_LEN_WORKLIST, INCITE_IMPOSSIBLE_COST,
  city_tab_index, city_prod_clicks, city_screen_updater, city_tile_map,
  opt_show_unreachable_items,
} from './cityDialogState';

// Re-export logic for backward compatibility
export { get_city_state } from './cityLogic';

// ── API ───────────────────────────────────────────────────────────────────────

export function show_city_dialog_by_id(pcity_id: number): void {
  show_city_dialog(cities[pcity_id]);
}

export function show_city_dialog(pcity: City): void {
  if (!pcity) return;
  set_active_city(pcity);
  showCityDialogPreact(pcity);
}

export function close_city_dialog(): void {
  set_active_city(null);
  closeCityDialogPreact();
}

export function city_dialog_close_handler(): void {
  close_city_dialog();
}

/** Called when city data changes — updates the Preact signal to re-render. */
export function update_city_screen(): void {
  // If city dialog is open, refresh with latest data
  const pcity = cityDialogSignal.value;
  if (pcity) {
    const fresh = cities[pcity['id'] as number];
    if (fresh) cityDialogSignal.value = fresh;
  }
}

// Listen for city update events
globalEvents.on('city:screenUpdate', update_city_screen);

// ── Observer-mode no-ops (player-only features) ──────────────────────────────

export function request_city_buy(): void {}
export function send_city_buy(): void {}
export function send_city_change(_city_id: number, _kind: number, _value: number): void {}
export function city_sell_improvement(_improvement_id: number): void {}
export function city_change_specialist(_city_id: number, _from_specialist_id: number): void {}
export function rename_city(): void {}
export function city_name_dialog(_suggested_name?: string, _unit_id?: number): void {}
export function next_city(): void {}
export function previous_city(): void {}
export function city_keyboard_listener(_ev: KeyboardEvent): void {}
export function set_citydlg_dimensions(_pcity: City): void {}
export function do_city_map_click(_ptile: unknown): void {}

// Also refresh when any city data changes (so open dialog stays fresh)
globalEvents.on('city:updated', () => {
  const open = cityDialogSignal.value;
  if (!open) return;
  const fresh = cities[(open as unknown as Record<string, number>)['id']];
  if (fresh) cityDialogSignal.value = fresh;
});

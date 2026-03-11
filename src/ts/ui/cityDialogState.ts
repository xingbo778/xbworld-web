import { EventAggregator } from '../utils/EventAggregator';
import type { City } from '../data/types';
import { store } from '../data/store';

export let citydlg_map_width: number = 384;      // default values for most rulesets
export let citydlg_map_height: number = 192;     // default value for most rulesets

export const tileset_width: number = 96;         // amplio2 based tileset
export const tileset_height: number = 48;

/**
 * Transparent proxy onto store.cities.
 *
 * Previously this was a separate `{}` that was never populated, which caused
 * store.cities (correctly filled by packet handlers) to be invisible to the UI
 * layer — breaking city-dialog open in observer mode and the city overview list.
 * All consumers (cityDialog.ts, cityLogic.ts, legacy re-exports) continue to
 * use `cities[id]` / `for…in cities` unchanged; the proxy makes every access
 * redirect to the authoritative store.
 */
export const cities: Record<number, City> = new Proxy({} as Record<number, City>, {
  get(_t, p) { return (store.cities as Record<string | symbol, unknown>)[p]; },
  set(_t, p, v) { (store.cities as Record<string | symbol, unknown>)[p] = v as City; return true; },
  has(_t, p) { return p in store.cities; },
  ownKeys() { return Reflect.ownKeys(store.cities); },
  getOwnPropertyDescriptor(_t, p) { return Object.getOwnPropertyDescriptor(store.cities, p); },
});
export let city_rules: Record<number, Record<string, unknown>> = {};
export let city_trade_routes: Record<number, Record<number, Record<string, unknown>>> = {};

export let goods: Record<number, Record<string, unknown>> = {};

export let active_city: City | null = null;
export let worklist_dialog_active: boolean = false;
export let production_selection: { kind: number; value: number }[] = [];
export let worklist_selection: number[] = [];

/* The city_options enum. */
export const CITYO_DISBAND: number = 0;
export const CITYO_NEW_EINSTEIN: number = 1;
export const CITYO_NEW_TAXMAN: number = 2;
export const CITYO_LAST: number = 3;

export const FEELING_BASE: number = 0;		/* before any of the modifiers below */
export const FEELING_LUXURY: number = 1;		/* after luxury */
export const FEELING_EFFECT: number = 2;		/* after building effects */
export const FEELING_NATIONALITY: number = 3;  	/* after citizen nationality effects */
export const FEELING_MARTIAL: number = 4;	/* after units enforce martial order */
export const FEELING_FINAL: number = 5;		/* after wonders (final result) */

export const MAX_LEN_WORKLIST: number = 64;

export const INCITE_IMPOSSIBLE_COST: number = (1000 * 1000 * 1000);

export let city_tab_index: number = 0;
export let city_prod_clicks: number = 0;

// Lazy wrapper to avoid circular dependency with cityDialog.ts
// update_city_screen is registered at runtime via set_city_screen_updater_fn
let _update_city_screen_fn: (() => void) | null = null;
export function set_city_screen_updater_fn(fn: () => void): void {
  _update_city_screen_fn = fn;
}
function _update_city_screen_proxy(): void {
  if (_update_city_screen_fn) _update_city_screen_fn();
}

export const city_screen_updater: EventAggregator = new EventAggregator(_update_city_screen_proxy, 250,
                                              EventAggregator.DP_NONE,
                                              250, 3, 250);

/* Information for mapping workable tiles of a city to local index */
export let city_tile_map: { radius_sq: number; radius: number; base_sorted: number[][]; maps: number[][] } | null = null;

export let opt_show_unreachable_items: boolean = false;

// Setter functions for mutable state that other modules need to modify
export function set_citydlg_map_width(v: number): void { citydlg_map_width = v; }
export function set_citydlg_map_height(v: number): void { citydlg_map_height = v; }
export function set_active_city(v: City | null): void { active_city = v; }
export function set_worklist_dialog_active(v: boolean): void { worklist_dialog_active = v; }
export function set_production_selection(v: { kind: number; value: number }[]): void { production_selection = v; }
export function set_worklist_selection(v: number[]): void { worklist_selection = v; }
export function set_city_tab_index(v: number): void { city_tab_index = v; }
export function set_city_prod_clicks(v: number): void { city_prod_clicks = v; }
export function set_opt_show_unreachable_items(v: boolean): void { opt_show_unreachable_items = v; }

/**
 * Window Bridge — Minimal window registration for inline HTML onclick handlers.
 *
 * Only registers functions that are called from:
 * 1. TS-generated innerHTML onclick strings (city dialog, diplomacy, etc.)
 * 2. CMA governor checkbox onclick handlers
 *
 * This replaces globalRegistry.ts (2,543 lines → ~60 lines).
 */
const w = window as unknown as Record<string, unknown>;

// --- From city dialog / CMA governor onclick handlers ---
import { button_pushed_toggle_cma } from './ui/cma';
w['button_pushed_toggle_cma'] = button_pushed_toggle_cma;

import {
  show_city_dialog_by_id,
  city_change_specialist,
  city_sell_improvement,
  city_change_production,
  city_add_to_worklist,
  city_exchange_worklist_task,
  city_insert_in_worklist,
  city_worklist_task_down,
  city_worklist_task_remove,
  city_worklist_task_up,
} from './ui/cityDialog';
import { city_dialog_activate_unit, set_unit_focus_and_redraw } from './core/control/unitFocus';
w['show_city_dialog_by_id'] = show_city_dialog_by_id;
w['city_change_specialist'] = city_change_specialist;
w['city_dialog_activate_unit'] = city_dialog_activate_unit;
w['city_sell_improvement'] = city_sell_improvement;
w['city_change_production'] = city_change_production;
w['city_add_to_worklist'] = city_add_to_worklist;
w['city_exchange_worklist_task'] = city_exchange_worklist_task;
w['city_insert_in_worklist'] = city_insert_in_worklist;
w['city_worklist_task_down'] = city_worklist_task_down;
w['city_worklist_task_remove'] = city_worklist_task_remove;
w['city_worklist_task_up'] = city_worklist_task_up;

import { create_clause_req, remove_clause_req } from './ui/diplomacy';
w['create_clause_req'] = create_clause_req;
w['remove_clause_req'] = remove_clause_req;

// --- From TS-generated innerHTML onclick strings ---
import { nationTableSelectPlayer as nation_table_select_player } from './data/nation';
w['nation_table_select_player'] = nation_table_select_player;

import { show_tax_rates_dialog } from './components/Dialogs/RatesDialog';
w['show_tax_rates_dialog'] = show_tax_rates_dialog;

import { center_tile_id } from './renderer/mapviewCommon';
w['center_tile_id'] = center_tile_id;

import { set_req_government } from './components/Dialogs/GovernmentDialog';
w['set_req_government'] = set_req_government;

import { show_tech_info_dialog, send_player_research } from './ui/techDialog';
w['show_tech_info_dialog'] = show_tech_info_dialog;
w['send_player_research'] = send_player_research;
w['set_unit_focus_and_redraw'] = set_unit_focus_and_redraw;

// --- For Preact dialog callbacks ---
import { network_init } from './net/connection';
w['network_init'] = network_init;

// --- SweetAlert replacement ---
import { swal } from './components/Dialogs/SwalDialog';
w['swal'] = swal;

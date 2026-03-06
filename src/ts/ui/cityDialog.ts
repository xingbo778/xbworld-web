import { setHtml as domSetHtml } from '../utils/dom';
import { initTabs } from './tabs';
import { swal } from '../components/Dialogs/SwalDialog';
import { initTableSort } from '../utils/tableSort';
import { store } from '../data/store';
import type { City, Player, Unit, Tile, UnitType, Improvement } from '../data/types';
import type { BitVector } from '../utils/bitvector';
import { cityTile } from '../data/city';
import { game_find_unit_by_number } from '../data/game';
import { VUT_UTYPE, VUT_IMPROVEMENT, MAX_LEN_CITYNAME, MAX_LEN_NAME } from '../data/fcTypes';
import type { SpriteInfo } from '../renderer/spriteGetters';
import { RENDERER_2DCANVAS } from '../core/constants';
import { clientState as client_state, C_S_RUNNING, clientIsObserver, clientPlaying } from '../client/clientState';
import { send_request as sendRequest } from '../net/connection';
import { packet_city_options_req, packet_city_buy, packet_city_change, packet_city_make_specialist, packet_city_make_worker, packet_city_rename, packet_city_sell, packet_city_change_specialist } from '../net/packetConstants';
import { isSmallScreen as is_small_screen, isTouchDevice as is_touch_device, blur_input_on_touchdevice } from '../utils/helpers';
import { setupWindowSize as setup_window_size } from '../client/clientMain';
import { set_city_mapview_active } from '../renderer/mapview';
import { center_tile_mapcanvas } from '../core/control';
import { update_map_canvas, update_map_canvas_full, mapview } from '../renderer/mapviewCommon';
import { setDefaultMapviewActive as set_default_mapview_active } from '../client/clientMain';
import { request_unit_do_action } from '../core/control';
import { ACTION_FOUND_CITY } from '../data/fcTypes';
import { keyboard_input } from '../core/control/controlState';
import { act_sel_queue_done } from '../ui/actionDialog';

// Import pure logic/formatting functions from cityLogic
import {
  formatCitySize, formatProductionOverview, formatProductionTurns,
  formatResourceStats, buildImprovementsHtml, buildPresentUnitsHtml,
  buildSupportedUnitsHtml, buildSpecialistHtml, buildCityListHtml
} from './cityLogic';

// Import state from cityDialogState
import {
  citydlg_map_width, citydlg_map_height, tileset_width, tileset_height,
  cities, city_rules, city_trade_routes, goods,
  active_city, worklist_dialog_active, production_selection, worklist_selection,
  CITYO_DISBAND, CITYO_NEW_EINSTEIN, CITYO_NEW_TAXMAN, CITYO_LAST,
  FEELING_BASE, FEELING_LUXURY, FEELING_EFFECT, FEELING_NATIONALITY, FEELING_MARTIAL, FEELING_FINAL,
  MAX_LEN_WORKLIST, INCITE_IMPOSSIBLE_COST,
  city_tab_index, city_prod_clicks, city_screen_updater, city_tile_map,
  opt_show_unreachable_items,
  set_citydlg_map_width, set_citydlg_map_height,
  set_active_city, set_worklist_dialog_active, set_production_selection, set_worklist_selection,
  set_city_prod_clicks,
  set_city_screen_updater_fn
} from './cityDialogState';

// Import worklist functions from cityWorklist
import {
  city_worklist_dialog, populate_worklist_production_choices,
  extract_universal, find_universal_in_worklist,
  handle_worklist_select, handle_worklist_unselect,
  handle_current_worklist_select, handle_current_worklist_unselect,
  handle_current_worklist_click, handle_current_worklist_direct_remove,
  update_worklist_actions, send_city_worklist, send_city_worklist_add,
  city_change_production, city_add_to_worklist, city_insert_in_worklist,
  city_worklist_task_up, city_worklist_task_down, city_exchange_worklist_task,
  city_worklist_task_remove
} from './cityWorklist';

// Re-export everything from cityDialogState for backwards compatibility
export {
  citydlg_map_width, citydlg_map_height,
  cities, city_rules, city_trade_routes, goods,
  active_city, worklist_dialog_active, production_selection, worklist_selection,
  CITYO_DISBAND, CITYO_NEW_EINSTEIN, CITYO_NEW_TAXMAN, CITYO_LAST,
  FEELING_BASE, FEELING_LUXURY, FEELING_EFFECT, FEELING_NATIONALITY, FEELING_MARTIAL, FEELING_FINAL,
  MAX_LEN_WORKLIST, INCITE_IMPOSSIBLE_COST,
  city_tab_index, city_prod_clicks, city_screen_updater, city_tile_map,
  opt_show_unreachable_items
} from './cityDialogState';

// Re-export get_city_state from cityLogic for backwards compatibility
export { get_city_state } from './cityLogic';

// Re-export everything from cityWorklist for backwards compatibility
export {
  city_worklist_dialog, populate_worklist_production_choices,
  extract_universal, find_universal_in_worklist,
  handle_worklist_select, handle_worklist_unselect,
  handle_current_worklist_select, handle_current_worklist_unselect,
  handle_current_worklist_click, handle_current_worklist_direct_remove,
  update_worklist_actions, send_city_worklist, send_city_worklist_add,
  city_change_production, city_add_to_worklist, city_insert_in_worklist,
  city_worklist_task_up, city_worklist_task_down, city_exchange_worklist_task,
  city_worklist_task_remove
} from './cityWorklist';

function byId(id: string): HTMLElement | null { return document.getElementById(id); }
function setHtml(id: string, html: unknown): void { const el = byId(id); if (el) domSetHtml(el, String(html)); }

// Register update_city_screen with the lazy proxy in cityDialogState
set_city_screen_updater_fn(update_city_screen);

// Subscribe to events from data layer (replaces direct import of updaters in city.ts)
import { globalEvents } from '../core/events';
globalEvents.on('city:screenUpdate', () => city_screen_updater?.update());

/**************************************************************************
 ...
**************************************************************************/

export function show_city_dialog_by_id(pcity_id: number): void {
  show_city_dialog(cities[pcity_id]);
}

export function show_city_dialog(pcity: City): void {
  if (active_city != pcity || active_city == null) {
    set_city_prod_clicks(0);
    set_production_selection([]);
    set_worklist_selection([]);
  }

  if (active_city != null) close_city_dialog();
  set_active_city(pcity);
  if (pcity == null) return;

  // reset dialog page.
  byId('city_dialog')?.remove();
  const dlg = document.createElement('div');
  dlg.id = 'city_dialog';
  const dlgWidth = is_small_screen() ? '98%' : '80%';
  const dlgHeight = is_small_screen() ? (window.innerHeight + 10) : (window.innerHeight - 80);
  dlg.style.cssText = 'position:fixed;z-index:4000;background:#222;border:1px solid #555;padding:0;'
    + 'left:50%;top:50%;transform:translate(-50%,-50%);'
    + 'width:' + dlgWidth + ';height:' + dlgHeight + 'px;overflow:auto;color:#fff;';
  document.getElementById('game_page')?.appendChild(dlg);

  // Title bar
  const titleBar = document.createElement('div');
  titleBar.style.cssText = 'background:#333;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #555;';
  domSetHtml(titleBar, '<span style="font-weight:bold;">' + decodeURIComponent(pcity['name']) + ' (' + pcity['size'] + ')</span>');
  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:6px;';

  const buttonDefs: [string, () => void][] = is_small_screen()
    ? [['Next', next_city], ['Buy', request_city_buy], ['Close', close_city_dialog]]
    : [['Previous city', previous_city], ['Next city (N)', next_city], ['Buy (B)', request_city_buy], ['Rename', rename_city], ['Close', close_city_dialog]];

  buttonDefs.forEach(([label, fn]) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.addEventListener('click', fn);
    btnRow.appendChild(b);
  });
  titleBar.appendChild(btnRow);
  dlg.appendChild(titleBar);

  // Content area
  const contentArea = document.createElement('div');
  contentArea.style.cssText = 'padding:8px;overflow:auto;height:calc(100% - 50px);';
  domSetHtml(contentArea, getCityDialogHtml());
  dlg.appendChild(contentArea);

  const cityCanvas = byId('city_canvas');
  if (cityCanvas) cityCanvas.addEventListener('click', city_mapview_mouse_click);

  // Close on Escape
  dlg.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') close_city_dialog();
    else city_keyboard_listener(e);
  });

  show_city_traderoutes();

  (byId('game_text_input') as HTMLInputElement)?.blur();

  /* Prepare city dialog for small screens. */
  if (!is_small_screen()) {
    byId('city_tabs-6')?.remove();
    document.querySelectorAll('.extra_tabs_small').forEach(el => el.remove());
    byId('mobile_cma_checkbox')?.remove();
  } else {
    byId('city_tabs-5')?.remove();
    document.querySelectorAll('.extra_tabs_big').forEach(el => el.remove());
    const cityStats = byId('city_stats');
    if (cityStats) cityStats.style.display = 'none';
    const unitsElement = byId('city_improvements_panel');
    const cityUnitsTab = byId('city_units_tab');
    if (unitsElement && cityUnitsTab) {
      cityUnitsTab.appendChild(unitsElement);
    }
  }

  initTabs('#city_tabs', { active: city_tab_index });

  const tabHeight = is_small_screen() ? (window.innerHeight - 110) : (window.innerHeight - 225);
  document.querySelectorAll('.citydlg_tabs').forEach(el => {
    (el as HTMLElement).style.height = tabHeight + 'px';
  });

  city_worklist_dialog(pcity);

  const orig_renderer = store.renderer;
  // store.renderer = RENDERER_2DCANVAS; // This line is commented out in the original JS, so it's commented here too.
  set_citydlg_dimensions(pcity);
  set_city_mapview_active();
  center_tile_mapcanvas(cityTile(pcity));
  update_map_canvas(0, 0, mapview['store_width'] ?? 0, mapview['store_height'] ?? 0);
  // store.renderer = orig_renderer; // This line is commented out in the original JS, so it's commented here too.

  let governor_text: string = "";
  if (typeof pcity['cma_enabled'] !== 'undefined') {
    governor_text = "<br>" + (pcity['cma_enabled'] ? "Governor Enabled" : "Governor Disabled");
  }

  setHtml("city_size", formatCitySize(pcity, governor_text));
  setHtml("city_production_overview", formatProductionOverview(pcity));
  setHtml("city_production_turns_overview", formatProductionTurns(pcity));

  setHtml("city_improvements_list", buildImprovementsHtml(pcity));

  const present_units_html = buildPresentUnitsHtml(pcity);
  if (present_units_html != null) {
    setHtml("city_present_units_list", present_units_html);
  }

  const supported_units_html = buildSupportedUnitsHtml(pcity);
  if (supported_units_html != null) {
    setHtml("city_supported_units_list", supported_units_html);
  }
  // tooltip() no-op — native title attribute already set

  const stats = formatResourceStats(pcity);
  if (stats != null) {
    setHtml("city_food", stats.food);
    setHtml("city_prod", stats.prod);
    setHtml("city_trade", stats.trade);
    setHtml("city_gold", stats.gold);
    setHtml("city_luxury", stats.luxury);
    setHtml("city_science", stats.science);
    setHtml("city_corruption", stats.corruption);
    setHtml("city_waste", stats.waste);
    setHtml("city_pollution", stats.pollution);
    setHtml("city_steal", stats.steal);
    setHtml("city_culture", stats.culture);
  }

  /* Handle citizens and specialists */
  setHtml("specialist_panel", buildSpecialistHtml(pcity, get_specialist_image_sprite));

  const disbandEl = byId('disbandable_city') as HTMLInputElement | null;
  if (disbandEl) {
    const newDisband = disbandEl.cloneNode(true) as HTMLInputElement;
    disbandEl.parentNode?.replaceChild(newDisband, disbandEl);
    newDisband.checked = pcity['city_options'] != null && (pcity['city_options'] as unknown as BitVector).isSet(CITYO_DISBAND);
    newDisband.addEventListener('click', function() {
      const options = pcity['city_options'] as unknown as BitVector & Record<string, unknown>;
      const packet: Record<string, unknown> = {
        "pid"     : packet_city_options_req,
        "city_id" : active_city!['id'],
        "options" : options['raw']
      };
      if (newDisband.checked) {
        options.set(CITYO_DISBAND);
      } else {
        options.unset(CITYO_DISBAND);
      }
      sendRequest(JSON.stringify(packet));
    });
  }

  if (is_small_screen()) {
    document.querySelectorAll('.ui-tabs-anchor').forEach(el => {
      (el as HTMLElement).style.padding = '2px';
    });
  }

  show_city_governor_tab();
}

export function request_city_buy(): void {
  if (clientIsObserver()) return;
  const pcity = active_city;
  const pplayer = clientPlaying()!;

  // reset dialog page.
  byId('dialog')?.remove();
  let buy_price_string: string = "";
  let buy_question_string: string = "";

  if (pcity!['production_kind'] == VUT_UTYPE) {
    const punit_type: UnitType = store.unitTypes[pcity!['production_value']];
    if (punit_type != null) {
      buy_price_string = punit_type['name'] + " costs " + pcity!['buy_cost'] + " gold.";
      buy_question_string = "Buy " + punit_type['name'] + " for " + pcity!['buy_cost'] + " gold?";
    }
  } else {
    const improvement: Improvement = store.improvements[pcity!['production_value']];
    if (improvement != null) {
      buy_price_string = improvement['name'] + " costs " + pcity!['buy_cost'] + " gold.";
      buy_question_string = "Buy " + improvement['name'] + " for " + pcity!['buy_cost'] + " gold?";
    }
  }

  const treasury_text: string = "<br>Treasury contains " + pplayer['gold'] + " gold.";

  if ((pcity!['buy_cost'] as number) > pplayer['gold']) {
    show_dialog_message("Buy It!",
      buy_price_string + treasury_text);
    return;
  }

  const buyDlg = document.createElement('div');
  buyDlg.id = 'dialog';
  buyDlg.style.cssText = 'position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;'
    + 'top:30%;left:50%;transform:translateX(-50%);width:' + (is_small_screen() ? '95%' : '50%') + ';color:#fff;';
  domSetHtml(buyDlg, '<div style="font-weight:bold;margin-bottom:8px;">Buy It!</div>'
    + buy_question_string + treasury_text + '<div style="margin-top:12px;display:flex;gap:8px;">'
    + '<button id="buy_yes_btn">Yes</button><button id="buy_no_btn">No</button></div>');
  document.getElementById('game_page')?.appendChild(buyDlg);

  byId('buy_yes_btn')?.addEventListener('click', function() { send_city_buy(); buyDlg.remove(); });
  byId('buy_no_btn')?.addEventListener('click', function() { buyDlg.remove(); });
}

export function send_city_buy(): void {
  if (clientIsObserver()) return;
  if (active_city != null) {
    const packet: Record<string, unknown> = {"pid" : packet_city_buy, "city_id" : active_city['id']};
    sendRequest(JSON.stringify(packet));
  }
}

export function send_city_change(city_id: number, kind: number, value: number): void {
  const packet: Record<string, unknown> = {"pid" : packet_city_change, "city_id" : city_id,
                "production_kind": kind, "production_value" : value};
  sendRequest(JSON.stringify(packet));
}

export function close_city_dialog(): void {
  byId('city_dialog')?.remove();
  city_dialog_close_handler();
}

export function city_dialog_close_handler(): void {
  set_default_mapview_active();
  if (active_city != null) {
    setup_window_size ();
    center_tile_mapcanvas(cityTile(active_city));
    set_active_city(null);
     /*
      * TODO: this is just a hack to recover the background map.
      *       setup_window_size will resize (and thus clean) the map canvas,
      *       and this is now called when we show a city dialog while another
      *       one is open, which is unexpectedly common, tracing the functions
      *       shows two or three calls to show_city_dialog(). Maybe one internal
      *       from the client UI, the rest from info packets from the server.
      *       Both those duplicate calls and the stopping of map updates due
      *       to the 2D rendered being used to draw the minimap should go.
      */
    if (store.renderer == RENDERER_2DCANVAS) {
      update_map_canvas_full();
    }

  }
  set_worklist_dialog_active(false);
}

export function do_city_map_click(ptile: Tile): void {
  let packet: Record<string, unknown>;
  if (ptile['worked'] == active_city!['id']) {
    packet = {"pid"     : packet_city_make_specialist,
              "city_id" : active_city!['id'],
              "tile_id" : ptile['index']};
  } else {
    packet = {"pid"     : packet_city_make_worker,
              "city_id" : active_city!['id'],
              "tile_id" : ptile['index']};
  }
  sendRequest(JSON.stringify(packet));
}

export function city_name_dialog(suggested_name: string, unit_id: number): void {
  byId('city_name_dialog')?.remove();

  const nameDlg = document.createElement('div');
  nameDlg.id = 'city_name_dialog';
  nameDlg.style.cssText = 'position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;'
    + 'top:30%;left:50%;transform:translateX(-50%);width:300px;color:#fff;';
  domSetHtml(nameDlg, '<div style="font-weight:bold;margin-bottom:8px;">Build New City</div>'
    + '<div>What should we call our new city?</div>'
    + '<input id="city_name_req" type="text" style="width:100%;margin:8px 0;">'
    + '<div style="display:flex;gap:8px;"><button id="city_name_ok">Ok</button>'
    + '<button id="city_name_cancel">Cancel</button></div>');
  document.getElementById('game_page')?.appendChild(nameDlg);

  const nameInput = byId('city_name_req') as HTMLInputElement;
  if (nameInput) {
    nameInput.value = suggested_name;
    nameInput.maxLength = MAX_LEN_NAME;
  }

  function submitName(): void {
    const name = nameInput?.value || '';
    if (name.length == 0 || name.length >= MAX_LEN_CITYNAME - 6
        || encodeURIComponent(name).length >= MAX_LEN_CITYNAME - 6) {
      swal("City name is invalid. Please try a different shorter name.");
      return;
    }
    const actor_unit = game_find_unit_by_number(unit_id);
    request_unit_do_action(ACTION_FOUND_CITY,
      unit_id, actor_unit!['tile'] as number, 0, encodeURIComponent(name));
    nameDlg.remove();
    act_sel_queue_done(unit_id);
  }

  function cancelName(): void {
    nameDlg.remove();
    act_sel_queue_done(unit_id);
  }

  byId('city_name_ok')?.addEventListener('click', submitName);
  byId('city_name_cancel')?.addEventListener('click', cancelName);

  nameDlg.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') submitName();
  });

  blur_input_on_touchdevice();
}

export function next_city(): void {
  if (!clientPlaying()) return;

  city_screen_updater.fireNow();

  const currentRow = byId('cities_list_' + active_city!['id']);
  let nextRow = currentRow?.nextElementSibling as HTMLElement | null;
  if (!nextRow) {
    // Go to the beginning
    nextRow = document.querySelector('#city_table tbody tr') as HTMLElement | null;
  }
  if (nextRow?.id) {
    show_city_dialog(cities[Number(nextRow.id.substr(12))]);
  }
}

export function previous_city(): void {
  if (!clientPlaying()) return;

  city_screen_updater.fireNow();

  const currentRow = byId('cities_list_' + active_city!['id']);
  let prevRow = currentRow?.previousElementSibling as HTMLElement | null;
  if (!prevRow) {
    // Go to the end
    const rows = document.querySelectorAll('#city_table tbody tr');
    prevRow = rows.length > 0 ? rows[rows.length - 1] as HTMLElement : null;
  }
  if (prevRow?.id) {
    show_city_dialog(cities[Number(prevRow.id.substr(12))]);
  }
}

export function city_sell_improvement(improvement_id: number): void {
  if (clientIsObserver()) return;
  if ('confirm' in window) {
    const agree: boolean = confirm("Are you sure you want to sell this building?");
    if (agree) {
      const packet: Record<string, unknown> = {"pid" : packet_city_sell, "city_id" : active_city!['id'],
                  "build_id": improvement_id};
      sendRequest(JSON.stringify(packet));
    }
  } else {
    const packet: Record<string, unknown> = {"pid" : packet_city_sell, "city_id" : active_city!['id'],
                "build_id": improvement_id};
    sendRequest(JSON.stringify(packet));
  }
}

export function city_change_specialist(city_id: number, from_specialist_id: number): void {
  if (clientIsObserver()) return;
  const city_message: Record<string, unknown> = {"pid": packet_city_change_specialist,
                      "city_id" : city_id,
                      "from" : from_specialist_id,
                      "to" : (from_specialist_id + 1) % 3};
  sendRequest(JSON.stringify(city_message));
}

export function rename_city(): void {
  if (clientIsObserver() || active_city == null) return;

  byId('city_name_dialog')?.remove();

  const renameDlg = document.createElement('div');
  renameDlg.id = 'city_name_dialog';
  renameDlg.style.cssText = 'position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;'
    + 'top:30%;left:50%;transform:translateX(-50%);width:300px;color:#fff;';
  domSetHtml(renameDlg, '<div style="font-weight:bold;margin-bottom:8px;">Rename City</div>'
    + '<div>What should we call this city?</div>'
    + '<input id="city_name_req" type="text" style="width:100%;margin:8px 0;">'
    + '<div style="display:flex;gap:8px;"><button id="rename_ok">Ok</button>'
    + '<button id="rename_cancel">Cancel</button></div>');
  document.getElementById('game_page')?.appendChild(renameDlg);

  const nameInput = byId('city_name_req') as HTMLInputElement;
  if (nameInput) {
    nameInput.value = active_city['name'];
    nameInput.maxLength = MAX_LEN_NAME;
  }

  function submitRename(): void {
    const name = nameInput?.value || '';
    if (name.length == 0 || name.length >= MAX_LEN_NAME - 4
        || encodeURIComponent(name).length >= MAX_LEN_NAME - 4) {
      swal("City name is invalid");
      return;
    }
    const packet: Record<string, unknown> = {"pid" : packet_city_rename, "name" : encodeURIComponent(name), "city_id" : active_city!['id'] };
    sendRequest(JSON.stringify(packet));
    renameDlg.remove();
  }

  byId('rename_ok')?.addEventListener('click', submitRename);
  byId('rename_cancel')?.addEventListener('click', function() { renameDlg.remove(); });

  renameDlg.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') submitRename();
  });
}

export function update_city_screen(): void {
  if (store.observing) return;

  const sortList: number[][] = [];
  document.querySelectorAll('#city_table thead th').forEach((th: Element) => {
    const el = th as HTMLElement;
    if (el.classList.contains('tablesorter-headerAsc')) sortList.push([(el as HTMLTableCellElement).cellIndex, 0]);
    else if (el.classList.contains('tablesorter-headerDesc')) sortList.push([(el as HTMLTableCellElement).cellIndex, 1]);
  });

  const { html: city_list_html, count } = buildCityListHtml();
  setHtml("cities_list", city_list_html);

  if (count == 0) {
    setHtml("city_table", "You have no cities. Build new cities with the Settlers unit.");
  }

  const citiesScroll = byId('cities_scroll');
  if (citiesScroll) citiesScroll.style.height = (window.innerHeight - 200) + 'px';

  initTableSort('#city_table', { sortList: sortList });
}

// get_city_state is now imported from cityLogic.ts

export function city_keyboard_listener(ev: KeyboardEvent): void {
  // Check if focus is in chat field, where these keyboard events are ignored.
  if (document.querySelector('input:focus') || !keyboard_input) return;

  if (C_S_RUNNING != client_state()) return;

  const keyboard_key: string = String.fromCharCode(ev.keyCode);

  if (active_city != null) {
     switch (keyboard_key) {
       case 'N':
         next_city();
         ev.stopPropagation();
         break;

       case 'B':
         request_city_buy();
         ev.stopPropagation();
         break;
      }
  }
}

export function set_citydlg_dimensions(pcity: City): void {
  const city_radius: number = pcity['city_radius_sq'] as number;

  const radius_tiles: number = Math.ceil(Math.sqrt(city_radius));

  set_citydlg_map_width(tileset_width + radius_tiles * tileset_width);
  set_citydlg_map_height(tileset_height + radius_tiles * tileset_height);

  const canvasDiv = byId('city_canvas_div');
  if (canvasDiv) { canvasDiv.style.width = citydlg_map_width + 'px'; canvasDiv.style.height = citydlg_map_height + 'px'; }
  const canvas = byId('city_canvas') as HTMLCanvasElement | null;
  if (canvas) { canvas.width = citydlg_map_width; canvas.height = citydlg_map_height; }
}

/**
 * Returns the static HTML skeleton for the city dialog.
 * Previously generated by Handlebars template 'city'.
 */
function getCityDialogHtml(): string {
  return `<div id="city_tabs">
  <ul>
    <li><a href="#city_tabs-1" onclick="javascript:city_tab_index=0;">Overview</a></li>
    <li><a href="#city_tabs-2" onclick="javascript:city_tab_index=1;">Production</a></li>
    <li><a href="#city_tabs-3" onclick="javascript:city_tab_index=2;">Traderoutes</a></li>
    <li class="extra_tabs_big" onclick="javascript:city_tab_index=3;"><a href="#city_tabs-5">Settings</a></li>
    <li><a href="#city_tabs-4" onclick="javascript:city_tab_index=4;">Governor</a></li>
    <li class="extra_tabs_small" onclick="javascript:city_tab_index=5;"><a href="#city_tabs-6">Units/buildings</a></li>
  </ul>

  <div id="city_tabs-1">
    <div id="city_overview_tab" class="citydlg_tabs">
    <div id="city_viewport">
    <div id="specialist_panel">
    </div>

    <div class="city_panel">
      <div id="city_canvas_div">
        <canvas id="city_canvas" class="city_canvas" width="384" height="192" moz-opaque="true"></canvas>
      </div>
    </div>

    <div class="city_panel">
      <div id="city_dialog_info">
	  <div><b>City information:</b></div>
	  <div style="float:left;">
	  <span id="city_size"></span>
	  <div id='city_production_overview'></div>
	  <div id='city_production_turns_overview'></div>
	</div>
	<div style="float: left; margin-top: -20px; padding-left: 20px;">
	  <table id="city_stats">
	  <tr><td>Food: </td><td id="city_food"></td></tr>
	  <tr><td>Prod: </td><td id="city_prod"></td></tr>
	  <tr><td>Trade: </td><td id="city_trade"></td></tr>
	  <tr><td>Gold:: </td><td id="city_gold"></td></tr>
	  <tr><td>Luxury: </td><td id="city_luxury"></td></tr>
	  <tr><td>Science: </td><td id="city_science"></td></tr>
	  <tr><td>Corruption: </td><td id="city_corruption"></td></tr>
	  <tr><td>Waste: </td><td id="city_waste"></td></tr>
	  <tr><td>Pollution: </td><td id="city_pollution"></td></tr>
          <tr><td>Tech stolen: </td><td id="city_steal"></td></tr>
          <tr><td>Culture: </td><td id="city_culture"></td></tr>
  	  </table>
        </div>
      </div>

    </div>
    <div id="city_improvements_panel" class="city_panel">
      <div style="clear: left;"></div>
      <div id="city_improvements">
        <div id="city_improvements_title">City Improvements:</div>
        <div id="city_improvements_list"></div>
      </div>

      <div id="city_present_units" >
        <div id="city_present_units_title">Present Units:</div>
        <div id="city_present_units_list"></div>
      </div>

      <div id="city_supported_units" >
        <div id="city_supported_units_title">Supported Units:</div>
        <div id="city_supported_units_list"></div>
      </div>

    </div>


  </div>
  </div>
  </div>
  <div id="city_tabs-2">
    <div id="city_production_tab" class="citydlg_tabs">
      <div id='worklist_left'>
        <div id='worklist_dialog_headline'></div>
        <div id='worklist_heading'>Target Worklist:</div><div id='city_current_worklist'></div>
      </div>
      <div id='worklist_right'>
        <div id='tasks_heading'>
          <input id='show_unreachable_items' type='checkbox'/>Show unreachable items<br/>
          Source tasks:
        </div>
        <div id='worklist_production_choices'></div>
      </div>
      <div id='prod_buttons'>
        <button type="button" class="button" onClick="city_change_production();" id="city_change_production_btn">Change Production</button>
        <button type="button" class="button" onClick="city_add_to_worklist();" id="city_add_to_worklist_btn">Add to worklist</button>
      </div>
      <div id="worklist_control">
        <button type="button" class="button" onClick="city_insert_in_worklist();" id="city_worklist_insert_btn" title="Insert before first selected task, or first in the list"><i class="fa fa-chevron-left fa-fw"></i></button>
        <div class="wc_spacer"></div>
        <button type="button" class="button" onClick="city_worklist_task_up();" id="city_worklist_up_btn" style="height: 20%;" title="Move selected tasks up"><i class="fa fa-chevron-up fa-fw"></i></button>
        <button type="button" class="button" onClick="city_worklist_task_down();" id="city_worklist_down_btn" style="height: 20%;" title="Move selected tasks down"><i class="fa fa-chevron-down fa-fw"></i></button>
        <div class="wc_spacer"></div>
        <button type="button" class="button" onClick="city_exchange_worklist_task();" id="city_worklist_exchange_btn" title="Change selected tasks"><i class="fa fa-exchange fa-fw"></i></button>
        <div class="wc_spacer"></div>
        <button type="button" class="button" onClick="city_worklist_task_remove();" id="city_worklist_remove_btn" title="Remove selected tasks"><i class="fa fa-trash fa-fw"></i></button>
      </div>
    </div>
  </div>
  <div id="city_tabs-3">
    <div id="city_traderoutes_tab" class="citydlg_tabs"></div>
  </div>
  <div id="city_tabs-5">
    <div id="city_settings_tab" class="citydlg_tabs">
      <div id="city_disband_options" >
        <input id="disbandable_city" type="checkbox" name="disband_city0" value="disband_city0"/>Disband city if built settler at size 1.
      </div>

    </div>
  </div>
  <div id="city_tabs-6" class="citydlg_tabs">
    <div id="city_units_tab"></div>
  </div>


    <div id="city_tabs-4">
        <div id="city_governor_tab" class="citydlg_tabs">
            <form name="cma_vals" id="cma_form" >
                <table border="0">
                    <tbody>
                    <tr>

                        <td>
                            <span style="">
                              <input id="cma_food" type="checkbox" name="cma_food" value="" onclick="button_pushed_toggle_cma();" />
                              <img style="" class="lowered_gov" src="/images/wheat.png">
                              <b>Food </b>
                            </span>
                        </td>
                        <td>
                            <span style="">
                              <input id="cma_shield" type="checkbox" name="cma_shield" value="" onclick="button_pushed_toggle_cma();" />
                              <img style="" class="lowered_gov" src="/images/shield14x18.png">
                              <b>Shield </b>
                            </span>
                        </td>
                        <td>
                            <span style="">
                              <input id="cma_trade" type="checkbox" name="cma_trade" value="" onclick="button_pushed_toggle_cma();" />
                              <img style="" class="lowered_gov" src="/images/trade.png">
                              <b>Trade </b>
                            </span>
                        </td>
                        <td>
                            <span style="">
                              <input id="cma_gold" type="checkbox" name="cma_gold" value="" onclick="button_pushed_toggle_cma();" />
                              <img style="" class="lowered_gov" src="/images/gold.png">
                              <b>Gold </b>
                           </span>
                        </td>
                        <td>
                            <span style="">
                              <input id="cma_luxury" type="checkbox" name="cma_luxury" value="" onclick="button_pushed_toggle_cma();" />
                              <img style="" class="lowered_gov" src="/images/lux.png">
                              <b>Luxury </b>
                            </span>
                        </td>
                        <td>
                           <span style="">
                              <input id="cma_science" type="checkbox" name="cma_science" value="" onclick="button_pushed_toggle_cma();" />
                              <img style="" class="lowered_gov" src="/images/sci.png">
                              <b>Science </b>
                           </span>
                        </td>

                    </tr>
                    </tbody>
                </table>
            </form>


        </div>
    </div>

</div>`;
}

// Dummy functions for external references that are not part of the provided JS
function show_city_traderoutes(): void {}
function get_specialist_image_sprite(key: string): SpriteInfo | null { return null; }
function city_mapview_mouse_click(): void {}
function show_city_governor_tab(): void {}
function show_dialog_message(title: string, message: string): void {}
function city_dialog_activate_unit(unit: Unit): void {}

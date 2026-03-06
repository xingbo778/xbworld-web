/**
 * Unit focus management — tracking which units are selected / active.
 *
 * Extracted from core/control.ts
 */

import { store } from '../../data/store';
import type { Unit, Tile, City, UnitType } from '../../data/types';
import { GameDialog } from '../../ui/GameDialog';
import { cityOwnerPlayerId as city_owner_player_id, cityTile as city_tile, cityHasBuilding as city_has_building } from '../../data/city';
import { unit_type, unit_list_size, unit_list_without, get_unit_homecity_name, get_unit_moves_left } from '../../data/unit';
import { game_find_unit_by_number } from '../../data/game';
import { get_unit_image_sprite } from '../../renderer/tilespec';
import { utype_can_do_action, utype_can_do_action_result, can_player_build_unit_direct } from '../../data/unittype';
import { mapPosToTile as map_pos_to_tile, indexToTile as index_to_tile } from '../../data/map';
import { tileCity as tile_city, tileHasExtra as tile_has_extra } from '../../data/tile';
import { tile_units } from '../../data/unit';
import { tileTerrain as tile_terrain } from '../../data/terrain';
import { playerInventionState as player_invention_state, techIdByName as tech_id_by_name, TECH_UNKNOWN, TECH_KNOWN } from '../../data/tech';
import { clientIsObserver as client_is_observer, clientPlaying, clientState as client_state, C_S_RUNNING } from '../../client/clientState';
import { improvement_id_by_name, B_AIRPORT_NAME } from '../../data/improvement';
import {
  ACTIVITY_IDLE,
  ACTION_FOUND_CITY as FC_ACTION_FOUND_CITY,
  ACTION_JOIN_CITY as FC_ACTION_JOIN_CITY,
  ACTION_NUKE as FC_ACTION_NUKE,
  ACTION_TRANSFORM_TERRAIN as FC_ACTION_TRANSFORM_TERRAIN,
  ACTRES_PARADROP as FC_ACTRES_PARADROP,
  ACTRES_PARADROP_CONQUER as FC_ACTRES_PARADROP_CONQUER,
} from '../../data/fcTypes';
import { EXTRA_NONE } from '../../data/extra';
import { IDENTITY_NUMBER_ZERO } from '../../core/constants';
import { ServerSideAgent } from '../../data/unit';
import { isTouchDevice as is_touch_device, stringUnqualify as string_unqualify } from '../../utils/helpers';
import { close_city_dialog, active_city } from '../../ui/cityDialog';
import { message_log } from '../../core/messages';
import { E_BEGINNER_HELP } from '../../data/eventConstants';
import { get_what_can_unit_pillage_from } from '../../data/unit';
import { normal_tile_height } from '../../renderer/tilesetConfig';
import { auto_center_on_unit } from '../../ui/options';
import * as S from './controlState';
// Circular imports — OK, only used inside functions
import { should_ask_server_for_actions, can_ask_server_for_actions, action_selection_next_in_focus } from './actionSelection';
import { request_new_unit_activity } from './unitCommands';
import { center_tile_mapcanvas } from './mapClick';
import { terrain_control } from '../../net/packhandlers';

const FC_ACTIVITY_IDLE = ACTIVITY_IDLE;
const FC_SSA_NONE = ServerSideAgent.NONE;
const FC_IDENTITY_NUMBER_ZERO = IDENTITY_NUMBER_ZERO;
const FC_EXTRA_NONE = EXTRA_NONE;
const FC_B_AIRPORT_NAME = B_AIRPORT_NAME;
const FC_TECH_UNKNOWN = TECH_UNKNOWN;
const FC_TECH_KNOWN = TECH_KNOWN;


function showEl(id: string): void { const el = document.getElementById(id); if (el) el.style.display = ''; }
function hideEl(id: string): void { const el = document.getElementById(id); if (el) el.style.display = 'none'; }

// tile_units is already imported from data/unit — alias for readability
const tile_units_func = tile_units;
// map_city_tile is the same as city_tile
const map_city_tile = city_tile;

// Runtime extra IDs assigned by server — accessed from window globals.
// These are read lazily at call time since they are set after module init.
function FC_EXTRA_ROAD(): number { return store.extraIds['EXTRA_ROAD'] ?? 0; }
function FC_EXTRA_RIVER(): number { return store.extraIds['EXTRA_RIVER'] ?? 1; }
function FC_EXTRA_RAIL(): number { return store.extraIds['EXTRA_RAIL'] ?? 2; }
function FC_EXTRA_MAGLEV(): number { return store.extraIds['EXTRA_MAGLEV'] ?? 3; }
function FC_EXTRA_MINE(): number { return store.extraIds['EXTRA_MINE'] ?? 4; }
function FC_EXTRA_POLLUTION(): number { return store.extraIds['EXTRA_POLLUTION'] ?? 5; }
function FC_EXTRA_FALLOUT(): number { return store.extraIds['EXTRA_FALLOUT'] ?? 6; }
function FC_EXTRA_IRRIGATION(): number { return store.extraIds['EXTRA_IRRIGATION'] ?? 7; }
function FC_EXTRA_FARMLAND(): number { return store.extraIds['EXTRA_FARMLAND'] ?? 8; }

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function get_focus_unit_on_tile(ptile: Tile): Unit | null {
  const funits = get_units_in_focus();
  if (funits == null) return null;

  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    if (punit['tile'] == ptile['index']) {
      return punit;
    }
  }
  return null;
}

export function unit_is_in_focus(cunit: Unit): boolean {
  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];
    if (punit['id'] == cunit['id']) {
      return true;
    }
  }
  return false;
}

export function get_units_in_focus(): Unit[] {
  return S.current_focus;
}

export function unit_focus_urgent(punit: Unit): void {
  if (punit == null || punit['activity'] == null) {
    console.log("unit_focus_urgent(): not a unit");
    console.log(punit);
    return;
  }

  S.urgent_focus_queue.push(punit);
}

export function control_unit_killed(punit: Unit): void {
  if (S.urgent_focus_queue != null) {
    S.setUrgentFocusQueue(unit_list_without(S.urgent_focus_queue, punit));
  }

  if (unit_is_in_focus(punit)) {
    if (S.current_focus.length == 1) {
      advance_unit_focus();
    } else {
      S.setCurrentFocus(unit_list_without(S.current_focus, punit));
    }

    update_active_units_dialog();
    update_unit_order_commands();
  }
}

export function update_unit_focus(): void {
  if (active_city != null) return;

  if (C_S_RUNNING != client_state()) return;

  if (!can_ask_server_for_actions()) {
    if (get_units_in_focus().length < 1) {
      console.log("update_unit_focus(): action selection dialog open for"
        + " unit %d but unit not in focus?",
        S.action_selection_in_progress_for);
    } else {
      return;
    }
  }

  const funits = get_units_in_focus();
  for (let i = 0; i < funits.length; i++) {
    const punit = funits[i];

    if (punit['movesleft'] > 0
      && !punit['done_moving']
      && punit['ssa_controller'] == FC_SSA_NONE
      && punit['activity'] == FC_ACTIVITY_IDLE) {
      return;
    }
  }

  advance_unit_focus();
}

export function advance_unit_focus(): void {
  let candidate: Unit | null = null;
  let i: number;

  if (client_is_observer()) return;

  if (S.urgent_focus_queue.length > 0) {
    const focus_tile = (S.current_focus != null && S.current_focus.length > 0
      ? S.current_focus[0]['tile']
      : -1);

    for (i = 0; i < S.urgent_focus_queue.length; i++) {
      const punit = store.units[S.urgent_focus_queue[i]['id']];

      if ((FC_ACTIVITY_IDLE != punit.activity
        || punit.has_orders)
        && !should_ask_server_for_actions(punit)) {
        S.setUrgentFocusQueue(unit_list_without(S.urgent_focus_queue, punit));
        i--;
      } else if (-1 == focus_tile
        || focus_tile == punit['tile']) {
        candidate = punit;
        break;
      } else if (null == candidate) {
        candidate = punit;
      }
    }

    if (null != candidate) {
      S.setUrgentFocusQueue(unit_list_without(S.urgent_focus_queue, candidate));
    }
  }

  if (candidate == null) {
    candidate = find_best_focus_candidate(false);
  }

  if (candidate == null) {
    candidate = find_best_focus_candidate(true);
  }

  if (candidate != null) {
    set_unit_focus_and_redraw(candidate);
  } else {
    S.setCurrentFocus([]);
    update_active_units_dialog();
    const gameUnitOrdersDefault = document.getElementById('game_unit_orders_default');
    if (gameUnitOrdersDefault) gameUnitOrdersDefault.style.display = 'none';

    if (store.gameInfo && store.gameInfo['turn'] <= 1) {
      for (const city_id_str in store.cities) {
        const city_id = parseInt(city_id_str);
        const pcity = store.cities[city_id];
        if (city_owner_player_id(pcity) == clientPlaying().playerno) {
          center_tile_mapcanvas(map_city_tile(pcity));
          break;
        }
      }
    }
    const turnDoneBtn = document.getElementById('turn_done_button');
    if (turnDoneBtn) turnDoneBtn.innerHTML = "<span style='color: green;'>✅</span> Turn Done";
    if (!S.end_turn_info_message_shown) {
      S.setEndTurnInfoMessageShown(true);
      message_log.update({ event: E_BEGINNER_HELP, message: "All units have moved, click the \"Turn Done\" button to end your turn." });
    }
  }
}

export function update_unit_order_commands(): { [key: string]: { name: string } } {
  let i: number;
  let punit: Unit;
  let ptype: UnitType | undefined;
  let pcity: City | null;
  let ptile: Tile | undefined;
  let unit_actions: { [key: string]: { name: string } } = {};
  const funits = get_units_in_focus();
  for (i = 0; i < funits.length; i++) {
    punit = funits[i];
    ptile = index_to_tile(punit['tile']);
    if (ptile == null) continue;
    pcity = tile_city(ptile);

    if (pcity != null) {
      unit_actions["show_city"] = { name: "Show city" };
    }
  }

  for (i = 0; i < funits.length; i++) {
    punit = funits[i];
    ptype = unit_type(punit);
    ptile = index_to_tile(punit['tile']);
    if (ptile == null || ptype == null) continue;
    pcity = tile_city(ptile);

    if (utype_can_do_action(ptype, FC_ACTION_FOUND_CITY)
      && pcity == null) {
      showEl('order_build_city');
      unit_actions["build"] = { name: "Build city (B)" };
    } else if (utype_can_do_action(ptype, FC_ACTION_JOIN_CITY)
      && pcity != null) {
      showEl('order_build_city');
      unit_actions["build"] = { name: "Join city (B)" };
    } else {
      hideEl('order_build_city');
    }

    if (ptype['name'] == "Explorer") {
      unit_actions["explore"] = { name: "Auto explore (X)" };
    }

  }

  Object.assign(unit_actions, {
    "goto": { name: "Unit goto (G)" },
    "tile_info": { name: "Tile info" }
  });

  for (i = 0; i < funits.length; i++) {
    punit = funits[i];
    ptype = unit_type(punit);
    ptile = index_to_tile(punit['tile']);
    if (ptile == null || ptype == null) continue;
    pcity = tile_city(ptile);

    if (ptype['name'] == "Settlers" || ptype['name'] == "Workers"
      || ptype['name'] == "Engineers") {

      if (ptype['name'] == "Settlers") unit_actions["autoworkers"] = { name: "Auto settler (A)" };
      if (ptype['name'] == "Workers") unit_actions["autoworkers"] = { name: "Auto workers (A)" };
      if (ptype['name'] == "Engineers") unit_actions["autoworkers"] = { name: "Auto engineers (A)" };

      if (!tile_has_extra(ptile, FC_EXTRA_ROAD())) {
        hideEl('order_railroad');
        hideEl('order_maglev');
        if (!(tile_has_extra(ptile, FC_EXTRA_RIVER())
          && player_invention_state(clientPlaying(), tech_id_by_name('Bridge Building') as unknown as number) == FC_TECH_UNKNOWN)) {
          unit_actions["road"] = { name: "Build road (R)" };
          showEl('order_road');
        } else {
          hideEl('order_road');
        }
      } else if (!tile_has_extra(ptile, FC_EXTRA_RAIL())
        && player_invention_state(clientPlaying(),
          tech_id_by_name('Railroad') as unknown as number) == FC_TECH_KNOWN
        && tile_has_extra(ptile, FC_EXTRA_ROAD())) {
        hideEl('order_road');
        hideEl('order_maglev');
        showEl('order_railroad');
        unit_actions['railroad'] = { name: "Build railroad (R)" };
      } else if (typeof store.extraIds['EXTRA_MAGLEV'] !== 'undefined'
        && !tile_has_extra(ptile, FC_EXTRA_MAGLEV())
        && player_invention_state(clientPlaying(),
          tech_id_by_name('Superconductors') as unknown as number) == FC_TECH_KNOWN
        && tile_has_extra(ptile, FC_EXTRA_RAIL())) {
        hideEl('order_road');
        hideEl('order_railroad');
        showEl('order_maglev');
        unit_actions['maglev'] = { name: "Build maglev (R)" };
      } else {
        hideEl('order_road');
        hideEl('order_railroad');
        hideEl('order_maglev');
      }

      hideEl('order_fortify');
      hideEl('order_sentry');
      hideEl('order_explore');
      showEl('order_auto_workers');
      showEl('order_clean');
      if (!tile_has_extra(ptile, FC_EXTRA_MINE())
        && (tile_terrain(ptile) as any)['mining_time'] > 0) {
        showEl('order_mine');
        unit_actions["mine"] = { name: "Mine (M)" };
      } else {
        hideEl('order_mine');
      }

      if (tile_has_extra(ptile, FC_EXTRA_POLLUTION())
        || tile_has_extra(ptile, FC_EXTRA_FALLOUT())) {
        showEl('order_clean');
        unit_actions["clean"] = { name: "Remove pollution (P)" };
      } else {
        hideEl('order_clean');
      }

      if ((tile_terrain(ptile) as any)['cultivate_time'] > 0) {
        showEl('order_forest_remove');
        unit_actions["cultivate"] = { name: "Cultivate (I)" };
      } else {
        hideEl('order_forest_remove');
      }
      if ((tile_terrain(ptile) as any)['irrigation_time'] > 0) {
        if (!tile_has_extra(ptile, FC_EXTRA_IRRIGATION())) {
          showEl('order_irrigate');
          hideEl('order_build_farmland');
          unit_actions["irrigation"] = { name: "Irrigation (I)" };
        } else if (!tile_has_extra(ptile, FC_EXTRA_FARMLAND()) && player_invention_state(clientPlaying(), tech_id_by_name('Refrigeration') as unknown as number) == FC_TECH_KNOWN) {
          showEl('order_build_farmland');
          hideEl('order_irrigate');
          unit_actions["irrigation"] = { name: "Build farmland (I)" };
        } else {
          hideEl('order_irrigate');
          hideEl('order_build_farmland');
        }
      } else {
        hideEl('order_irrigate');
        hideEl('order_build_farmland');
      }
      if ((tile_terrain(ptile) as any)['plant_time'] > 0) {
        showEl('order_forest_add');
        unit_actions["plant"] = { name: "Plant (M)" };
      } else {
        hideEl('order_forest_add');
      }
      if (player_invention_state(clientPlaying(), tech_id_by_name('Construction') as unknown as number) == FC_TECH_KNOWN) {
        unit_actions["fortress"] = { name: string_unqualify(terrain_control['gui_type_base0']) + " (Shift-F)" };
      }

      if (player_invention_state(clientPlaying(), tech_id_by_name('Radio') as unknown as number) == FC_TECH_KNOWN) {
        unit_actions["airbase"] = { name: string_unqualify(terrain_control['gui_type_base1']) + " (E)" };
      }

    } else {
      hideEl('order_road');
      hideEl('order_railroad');
      hideEl('order_mine');
      hideEl('order_irrigate');
      hideEl('order_build_farmland');
      showEl('order_fortify');
      hideEl('order_auto_workers');
      showEl('order_sentry');
      showEl('order_explore');
      hideEl('order_clean');
      unit_actions["fortify"] = { name: "Fortify (F)" };
    }

    unit_actions["action_selection"] = { name: "Do... (D)" };

    if (utype_can_do_action(ptype, FC_ACTION_TRANSFORM_TERRAIN)) {
      showEl('order_transform');
      unit_actions["transform"] = { name: "Transform terrain (O)" };
    } else {
      hideEl('order_transform');
    }

    if (utype_can_do_action(ptype, FC_ACTION_NUKE)) {
      showEl('order_nuke');
      unit_actions["nuke"] = { name: "Detonate Nuke At (Shift-N)" };
    } else {
      hideEl('order_nuke');
    }

    if (utype_can_do_action_result(ptype, FC_ACTRES_PARADROP)
      || utype_can_do_action_result(ptype, FC_ACTRES_PARADROP_CONQUER)) {
      showEl('order_paradrop');
      unit_actions["paradrop"] = { name: "Paradrop" };
    } else {
      hideEl('order_paradrop');
    }

    if (!client_is_observer() && clientPlaying() != null
      && get_what_can_unit_pillage_from(punit, ptile).length > 0
      && (pcity == null || city_owner_player_id(pcity) !== clientPlaying().playerno)) {
      showEl('order_pillage');
      unit_actions["pillage"] = { name: "Pillage (Shift-P)" };
    } else {
      hideEl('order_pillage');
    }

    if (pcity == null || punit['homecity'] === 0 || punit['homecity'] === pcity['id']) {
      hideEl('order_change_homecity');
    } else if (punit['homecity'] != pcity['id']) {
      showEl('order_change_homecity');
      unit_actions["homecity"] = { name: "Change homecity of unit (H)" };
    }

    if (pcity != null && city_has_building(pcity, improvement_id_by_name(FC_B_AIRPORT_NAME))) {
      unit_actions["airlift"] = { name: "Airlift (Shift-L)" };
    }

    if (pcity != null && ptype != null && store.unitTypes[ptype['obsoleted_by'] as number] != null && can_player_build_unit_direct(clientPlaying(), store.unitTypes[ptype['obsoleted_by'] as number])) {
      unit_actions["upgrade"] = { name: "Upgrade unit (U)" };
    }
    if (ptype != null && ptype['name'] != "Explorer") {
      unit_actions["explore"] = { name: "Auto explore (X)" };
    }

    // Load unit on transport
    if (pcity != null) {
      const units_on_tile = tile_units_func(ptile) || [];
      for (let r = 0; r < units_on_tile.length; r++) {
        const tunit = units_on_tile[r];
        if (tunit['id'] == punit['id']) continue;
        const ntype = unit_type(tunit) as any;
        if (ntype != null && ntype['transport_capacity'] > 0) unit_actions["unit_load"] = { name: "Load on transport (L)" };
      }
    }

    // Unload unit from transport
    const units_on_tile = tile_units_func(ptile) || [];
    if ((ptype['transport_capacity'] as number) > 0 && units_on_tile.length >= 2) {
      for (let r = 0; r < units_on_tile.length; r++) {
        const tunit = units_on_tile[r];
        if (tunit['transported']) {
          unit_actions["unit_show_cargo"] = { name: "Activate cargo units" };
          if (pcity != null) unit_actions["unit_unload"] = { name: "Unload units from transport (T)" };
        }
      }
    }

    if (punit.activity != FC_ACTIVITY_IDLE
      || punit.ssa_controller != FC_SSA_NONE
      || punit.has_orders) {
      unit_actions["idle"] = { name: "Cancel orders (Shift-J)" };
    } else {
      unit_actions["noorders"] = { name: "No orders (J)" };
    }
  }

  Object.assign(unit_actions, {
    "sentry": { name: "Sentry (S)" },
    "wait": { name: "Wait (W)" },
    "disband": { name: "Disband (Shift-D)" }
  });

  if (is_touch_device()) {
    document.querySelectorAll<HTMLElement>('.context-menu-list').forEach(el => el.style.width = '600px');
    document.querySelectorAll<HTMLElement>('.context-menu-item').forEach(el => el.style.fontSize = '220%');
  }
  document.querySelectorAll<HTMLElement>('.context-menu-list').forEach(el => el.style.zIndex = '5000');

  return unit_actions;
}

let unitPanelDialog: GameDialog | null = null;

export function init_game_unit_panel(): void {
  if (store.observing) return;
  S.setUnitpanelActive(true);

  unitPanelDialog = new GameDialog('#game_unit_panel', {
    title: 'Units',
    modal: false,
    width: 370,
    height: 'auto',
    resizable: false,
    closeOnEscape: false,
    closable: false,
    minimizable: true,
    dialogClass: 'unit_dialog no-close',
    position: { my: 'right bottom', at: 'right bottom', within: document.getElementById('tabs-map') || undefined },
    onClose: () => { S.setUnitpanelActive(false); },
    onMinimize: () => { S.setGameUnitPanelState('minimized'); },
    onRestore: () => { S.setGameUnitPanelState('normal'); },
  });

  unitPanelDialog.open();
  unitPanelDialog.widget.parentElement!.style.overflow = 'hidden';
  if (S.game_unit_panel_state === 'minimized') unitPanelDialog.minimize();
}

export function find_best_focus_candidate(accept_current: boolean): Unit | null {
  let punit: Unit | undefined;
  let i: number;
  if (client_is_observer()) return null;

  const sorted_units: Unit[] = [];
  for (const unit_id_str in store.units) {
    const unit_id = parseInt(unit_id_str);
    punit = store.units[unit_id];
    if (clientPlaying() != null && punit['owner'] == clientPlaying().playerno) {
      sorted_units.push(punit);
    }
  }
  sorted_units.sort(unit_distance_compare);

  for (i = 0; i < sorted_units.length; i++) {
    punit = sorted_units[i];
    if ((!unit_is_in_focus(punit) || accept_current)
      && clientPlaying() != null
      && punit['owner'] == clientPlaying().playerno
      && ((punit['activity'] == FC_ACTIVITY_IDLE
        && !punit['done_moving']
        && punit['movesleft'] > 0)
        || should_ask_server_for_actions(punit))
      && punit['ssa_controller'] == FC_SSA_NONE
      && S.waiting_units_list.indexOf(punit['id']) < 0
      && !punit['transported']) {
      return punit;
    }
  }

  for (i = 0; i < S.waiting_units_list.length; i++) {
    punit = game_find_unit_by_number(S.waiting_units_list[i]);
    if (punit != null && punit['movesleft'] > 0) {
      S.waiting_units_list.splice(i, 1);
      return punit;
    }
  }

  return null;
}

export function unit_distance_compare(unit_a: Unit, unit_b: Unit): number {
  if (unit_a == null || unit_b == null) return 0;
  const ptile_a = index_to_tile(unit_a['tile']);
  const ptile_b = index_to_tile(unit_b['tile']);

  if (ptile_a == null || ptile_b == null) return 0;

  if (ptile_a['x'] == ptile_b['x'] && ptile_a['y'] == ptile_b['y']) {
    return 0;
  } else if (ptile_a['x'] > ptile_b['x'] || ptile_a['y'] > ptile_b['y']) {
    return 1;
  } else {
    return -1;
  }
}

export function set_unit_focus(punit: Unit | null): void {
  S.setCurrentFocus([]);
  if (punit == null) {
    S.setCurrentFocus([]);
  } else {
    S.current_focus[0] = punit;
    action_selection_next_in_focus(FC_IDENTITY_NUMBER_ZERO);
  }
  update_active_units_dialog();
  update_unit_order_commands();
}

export function set_unit_focus_and_redraw(punit: Unit | null): void {
  S.setCurrentFocus([]);

  if (punit == null) {
    S.setCurrentFocus([]);
  } else {
    S.current_focus[0] = punit;
    action_selection_next_in_focus(FC_IDENTITY_NUMBER_ZERO);
  }

  auto_center_on_focus_unit();
  update_active_units_dialog();
  update_unit_order_commands();
  const ordersDefault = document.getElementById('game_unit_orders_default');
  if (S.current_focus.length > 0 && ordersDefault) ordersDefault.style.display = '';
}

export function set_unit_focus_and_activate(punit: Unit): void {
  set_unit_focus_and_redraw(punit);
  request_new_unit_activity(punit, FC_ACTIVITY_IDLE, FC_EXTRA_NONE);
}

export function city_dialog_activate_unit(punit: Unit): void {
  request_new_unit_activity(punit, FC_ACTIVITY_IDLE, FC_EXTRA_NONE);
  close_city_dialog();
  set_unit_focus_and_redraw(punit);
}

export function auto_center_on_focus_unit(): void {
  if (active_city != null) return;

  const ptile = find_a_focus_unit_tile_to_center_on();

  if (ptile != null && auto_center_on_unit) {
    center_tile_mapcanvas(ptile);
    // update_unit_position was a legacy 3D renderer function — removed
  }
}

export function find_a_focus_unit_tile_to_center_on(): Tile | undefined | null {
  const funit = S.current_focus[0];

  if (funit == null) return null;

  return index_to_tile(funit['tile']);
}

export function find_visible_unit(ptile: Tile | null): Unit | null {
  let i: number;

  if (ptile == null || unit_list_size(tile_units_func(ptile)) == 0) {
    return null;
  }

  const pfocus = get_focus_unit_on_tile(ptile);
  if (pfocus != null) {
    return pfocus;
  }

  if (tile_city(ptile) != null) {
    return null;
  }

  const vunits = tile_units_func(ptile) || [];
  for (i = 0; i < vunits.length; i++) {
    const aunit = vunits[i];
    if (aunit['anim_list'] != null && (aunit['anim_list'] as any[]).length > 0) {
      return aunit;
    }
  }

  for (i = 0; i < vunits.length; i++) {
    const tunit = vunits[i];
    if (!tunit['transported']) {
      return tunit;
    }
  }

  return (tile_units_func(ptile) || [])[0];
}

export function get_drawable_unit(ptile: Tile | null, citymode: boolean): Unit | null {
  const punit = find_visible_unit(ptile);

  if (punit == null) return null;

  if (!unit_is_in_focus(punit) || S.current_focus.length > 0) {
    return punit;
  } else {
    return null;
  }
}

export function update_active_units_dialog(): void {
  let unit_info_html = "";
  let ptile = null;
  let punits: Unit[] = [];
  let width = 0;

  if (client_is_observer() || !S.unitpanel_active) return;

  if (S.current_focus.length == 1) {
    ptile = index_to_tile(S.current_focus[0]['tile']);
    punits.push(S.current_focus[0]);
    const tmpunits = tile_units(ptile) || [];

    for (let i = 0; i < tmpunits.length; i++) {
      const kunit = tmpunits[i];
      if (kunit['id'] == S.current_focus[0]['id']) continue;
      punits.push(kunit);
    }
  } else if (S.current_focus.length > 1) {
    punits = S.current_focus;
  }

  for (let i = 0; i < punits.length; i++) {
    const punit = punits[i];
    const sprite = get_unit_image_sprite(punit);
    if (!sprite) continue;
    const active = (S.current_focus.length > 1 || S.current_focus[0]['id'] == punit['id']);

    unit_info_html += "<div id='unit_info_div' class='" + (active ? "current_focus_unit" : "")
      + "'><div id='unit_info_image' onclick='set_unit_focus_and_redraw(units[" + punit['id'] + "])' "
      + " style='background: transparent url("
      + sprite['image-src'] +
      ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
      + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;'"
      + "></div></div>";
    width = sprite['width'];
  }

  if (S.current_focus.length == 1) {
    const aunit = S.current_focus[0];
    const ptype = unit_type(aunit);
    unit_info_html += "<div id='active_unit_info' title='" + (ptype ? ptype['helptext'] : '') + "'>";

    if (clientPlaying() != null && S.current_focus[0]['owner'] != clientPlaying().playerno) {
      unit_info_html += "<b>" + store.nations[store.players[S.current_focus[0]['owner']]['nation']]['adjective'] + "</b> ";
    }

    unit_info_html += "<b>" + (ptype ? ptype['name'] : '') + "</b>: ";
    if (get_unit_homecity_name(aunit) != null) {
      unit_info_html += " " + get_unit_homecity_name(aunit) + " ";
    }
    if (clientPlaying() != null && S.current_focus[0]['owner'] == clientPlaying().playerno) {
      unit_info_html += "<span>" + get_unit_moves_left(aunit) + "</span> ";
    }
    unit_info_html += "<br><span title='Attack strength'>A:" + (ptype ? ptype['attack_strength'] : 0)
      + "</span> <span title='Defense strength'>D:" + (ptype ? ptype['defense_strength'] : 0)
      + "</span> <span title='Firepower'>F:" + (ptype ? ptype['firepower'] : 0)
      + "</span> <span title='Health points'>H:"
      + aunit['hp'] + "/" + (ptype ? ptype['hp'] : 0) + "</span>";
    if (aunit['veteran'] > 0) {
      unit_info_html += " <span>Veteran: " + aunit['veteran'] + "</span>";
    }
    if (ptype && (ptype['transport_capacity'] as number) > 0) {
      unit_info_html += " <span>Transport: " + ptype['transport_capacity'] + "</span>";
    }

    unit_info_html += "</div>";
  } else if (S.current_focus.length >= 1 && clientPlaying() != null && S.current_focus[0]['owner'] != clientPlaying().playerno) {
    unit_info_html += "<div id='active_unit_info'>" + S.current_focus.length + " foreign units  (" +
      store.nations[store.players[S.current_focus[0]['owner']]['nation']]['adjective']
      + ")</div> ";
  } else if (S.current_focus.length > 1) {
    unit_info_html += "<div id='active_unit_info'>" + S.current_focus.length + " units selected.</div> ";
  }

  const gameUnitInfo = document.getElementById('game_unit_info');
  if (gameUnitInfo) gameUnitInfo.innerHTML = unit_info_html;

  const panelEl = document.getElementById('game_unit_panel');
  const panelParent = panelEl?.parentElement;
  if (S.current_focus.length > 0) {
    let newwidth = 32 + punits.length * (width + 10);
    if (newwidth < 140) newwidth = 140;
    const newheight = 75 + normal_tile_height;
    if (panelParent) {
      panelParent.style.display = '';
      panelParent.style.width = newwidth + 'px';
      panelParent.style.height = newheight + 'px';
      panelParent.style.left = (window.innerWidth - newwidth) + "px";
      panelParent.style.top = (window.innerHeight - newheight - 30) + "px";
      panelParent.style.background = "rgba(50,50,40,0.5)";
    }
    if (S.game_unit_panel_state === 'minimized' && unitPanelDialog) {
      unitPanelDialog.minimize();
    }
  } else {
    if (panelParent) panelParent.style.display = 'none';
  }
  const activeUnitInfo = document.getElementById('active_unit_info');
  if (activeUnitInfo) {
    activeUnitInfo.title = activeUnitInfo.dataset.tooltip || '';
  }
}

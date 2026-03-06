/**
 * Unit panel UI — order commands, unit info panel, and active units dialog.
 *
 * Extracted from unitFocus.ts to reduce file size.
 */

import { store } from '../../data/store';
import type { Unit, Tile, City, UnitType } from '../../data/types';
import { GameDialog } from '../../ui/GameDialog';
import { cityOwnerPlayerId as city_owner_player_id, cityHasBuilding as city_has_building } from '../../data/city';
import { unit_type, get_unit_homecity_name, get_unit_moves_left } from '../../data/unit';
import { get_unit_image_sprite } from '../../renderer/tilespec';
import { utype_can_do_action, utype_can_do_action_result, can_player_build_unit_direct } from '../../data/unittype';
import { indexToTile as index_to_tile } from '../../data/map';
import { tileCity as tile_city, tileHasExtra as tile_has_extra } from '../../data/tile';
import { tile_units } from '../../data/unit';
import { tileTerrain as tile_terrain } from '../../data/terrain';
import { playerInventionState as player_invention_state, techIdByName as tech_id_by_name, TECH_UNKNOWN, TECH_KNOWN } from '../../data/tech';
import { clientIsObserver as client_is_observer, clientPlaying } from '../../client/clientState';
import { improvement_id_by_name, B_AIRPORT_NAME } from '../../data/improvement';
import {
  ACTION_FOUND_CITY as FC_ACTION_FOUND_CITY,
  ACTION_JOIN_CITY as FC_ACTION_JOIN_CITY,
  ACTION_NUKE as FC_ACTION_NUKE,
  ACTION_TRANSFORM_TERRAIN as FC_ACTION_TRANSFORM_TERRAIN,
  ACTRES_PARADROP as FC_ACTRES_PARADROP,
  ACTRES_PARADROP_CONQUER as FC_ACTRES_PARADROP_CONQUER,
  ACTIVITY_IDLE,
} from '../../data/fcTypes';
import { EXTRA_NONE } from '../../data/extra';
import { ServerSideAgent } from '../../data/unit';
import { isTouchDevice as is_touch_device, stringUnqualify as string_unqualify } from '../../utils/helpers';
import { get_what_can_unit_pillage_from } from '../../data/unit';
import { normal_tile_height } from '../../renderer/tilesetConfig';
import { setHtml as domSetHtml } from '../../utils/dom';
import * as S from './controlState';
import { terrain_control } from '../../net/packhandlers';
import { get_units_in_focus } from './unitFocus';

const FC_ACTIVITY_IDLE = ACTIVITY_IDLE;
const FC_SSA_NONE = ServerSideAgent.NONE;
const FC_EXTRA_NONE = EXTRA_NONE;
const FC_B_AIRPORT_NAME = B_AIRPORT_NAME;
const FC_TECH_UNKNOWN = TECH_UNKNOWN;
const FC_TECH_KNOWN = TECH_KNOWN;

// tile_units alias for readability
const tile_units_func = tile_units;

function showEl(id: string): void { const el = document.getElementById(id); if (el) el.style.display = ''; }
function hideEl(id: string): void { const el = document.getElementById(id); if (el) el.style.display = 'none'; }

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

export function update_unit_order_commands(): { [key: string]: { name: string } } {
  let i: number;
  let punit: Unit;
  let ptype: UnitType | undefined;
  let pcity: City | null;
  let ptile: Tile | null;
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
          && player_invention_state(clientPlaying()!, tech_id_by_name('Bridge Building') as unknown as number) == FC_TECH_UNKNOWN)) {
          unit_actions["road"] = { name: "Build road (R)" };
          showEl('order_road');
        } else {
          hideEl('order_road');
        }
      } else if (!tile_has_extra(ptile, FC_EXTRA_RAIL())
        && player_invention_state(clientPlaying()!,
          tech_id_by_name('Railroad') as unknown as number) == FC_TECH_KNOWN
        && tile_has_extra(ptile, FC_EXTRA_ROAD())) {
        hideEl('order_road');
        hideEl('order_maglev');
        showEl('order_railroad');
        unit_actions['railroad'] = { name: "Build railroad (R)" };
      } else if (typeof store.extraIds['EXTRA_MAGLEV'] !== 'undefined'
        && !tile_has_extra(ptile, FC_EXTRA_MAGLEV())
        && player_invention_state(clientPlaying()!,
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
        && (tile_terrain(ptile)?.['mining_time'] as number) > 0) {
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

      if ((tile_terrain(ptile)?.['cultivate_time'] as number) > 0) {
        showEl('order_forest_remove');
        unit_actions["cultivate"] = { name: "Cultivate (I)" };
      } else {
        hideEl('order_forest_remove');
      }
      if ((tile_terrain(ptile)?.['irrigation_time'] as number) > 0) {
        if (!tile_has_extra(ptile, FC_EXTRA_IRRIGATION())) {
          showEl('order_irrigate');
          hideEl('order_build_farmland');
          unit_actions["irrigation"] = { name: "Irrigation (I)" };
        } else if (!tile_has_extra(ptile, FC_EXTRA_FARMLAND()) && player_invention_state(clientPlaying()!, tech_id_by_name('Refrigeration') as unknown as number) == FC_TECH_KNOWN) {
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
      if ((tile_terrain(ptile)?.['plant_time'] as number) > 0) {
        showEl('order_forest_add');
        unit_actions["plant"] = { name: "Plant (M)" };
      } else {
        hideEl('order_forest_add');
      }
      if (player_invention_state(clientPlaying()!, tech_id_by_name('Construction') as unknown as number) == FC_TECH_KNOWN) {
        unit_actions["fortress"] = { name: string_unqualify(terrain_control['gui_type_base0'] as string) + " (Shift-F)" };
      }

      if (player_invention_state(clientPlaying()!, tech_id_by_name('Radio') as unknown as number) == FC_TECH_KNOWN) {
        unit_actions["airbase"] = { name: string_unqualify(terrain_control['gui_type_base1'] as string) + " (E)" };
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
      && (pcity == null || city_owner_player_id(pcity) !== clientPlaying()!.playerno)) {
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

    if (pcity != null && ptype != null && store.unitTypes[ptype['obsoleted_by'] as number] != null && can_player_build_unit_direct(clientPlaying()!, store.unitTypes[ptype['obsoleted_by'] as number])) {
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
        const ntype = unit_type(tunit);
        if (ntype != null && (ntype['transport_capacity'] as number) > 0) unit_actions["unit_load"] = { name: "Load on transport (L)" };
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

    if (clientPlaying() != null && S.current_focus[0]['owner'] != clientPlaying()!.playerno) {
      unit_info_html += "<b>" + store.nations[store.players[S.current_focus[0]['owner']]['nation']]['adjective'] + "</b> ";
    }

    unit_info_html += "<b>" + (ptype ? ptype['name'] : '') + "</b>: ";
    if (get_unit_homecity_name(aunit) != null) {
      unit_info_html += " " + get_unit_homecity_name(aunit) + " ";
    }
    if (clientPlaying() != null && S.current_focus[0]['owner'] == clientPlaying()!.playerno) {
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
  } else if (S.current_focus.length >= 1 && clientPlaying() != null && S.current_focus[0]['owner'] != clientPlaying()!.playerno) {
    unit_info_html += "<div id='active_unit_info'>" + S.current_focus.length + " foreign units  (" +
      store.nations[store.players[S.current_focus[0]['owner']]['nation']]['adjective']
      + ")</div> ";
  } else if (S.current_focus.length > 1) {
    unit_info_html += "<div id='active_unit_info'>" + S.current_focus.length + " units selected.</div> ";
  }

  const gameUnitInfo = document.getElementById('game_unit_info');
  if (gameUnitInfo) domSetHtml(gameUnitInfo, unit_info_html);

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

/**
 * Pure logic functions extracted from diplomacy.ts.
 * This module must have ZERO DOM access.
 */

import { store } from '../data/store';
import { playerInventionState as player_invention_state, TECH_KNOWN, TECH_UNKNOWN, TECH_PREREQS_KNOWN } from '../data/tech';
import { cityOwnerPlayerId as city_owner, doesCityHaveImprovement as does_city_have_improvement } from '../data/city';
import { clientPlaying } from '../client/clientState';
import { isLongturn as is_longturn } from '../client/clientCore';
import { getTilesetFileExtension as get_tileset_file_extention } from '../utils/helpers';
import type { Player } from '../data/types';

// Re-declare clause constants to avoid circular dependency with diplomacy.ts
export const CLAUSE_ADVANCE = 0;
export const CLAUSE_GOLD = 1;
export const CLAUSE_MAP = 2;
export const CLAUSE_SEAMAP = 3;
export const CLAUSE_CITY = 4;
export const CLAUSE_CEASEFIRE = 5;
export const CLAUSE_PEACE = 6;
export const CLAUSE_ALLIANCE = 7;
export const CLAUSE_VISION = 8;
export const CLAUSE_EMBASSY = 9;
export const CLAUSE_SHARED_TILES = 10;

interface ClauseItem { type: number; value: number | string; name: string; }
interface ClauseGroup { title: string; clauses: ClauseItem[]; }
export interface MeetingPlayerData {
  flag?: string;
  adjective: string;
  name: string;
  pid: number;
  clauses: (ClauseItem | ClauseGroup)[];
}

interface ClauseInfo { enabled: boolean; [key: string]: unknown; }

/**
 * Build the string description of a diplomacy clause.
 * Pure string formatting only - no DOM access.
 * The gold-input side effect (setting DOM input values) is NOT included here;
 * the caller in diplomacy.ts handles that separately.
 */
export function client_diplomacy_clause_string(
  counterpart: number,
  giver: number,
  type: number,
  value: number,
): string {
  const pplayer = store.players[giver];
  const nation = store.nations[pplayer['nation']]['adjective'];

  switch (type) {
    case CLAUSE_ADVANCE:
      const ptech = store.techs[value];
      return "The " + nation + " give " + ptech['name'];
    case CLAUSE_CITY:
      const pcity = store.cities[value];
      if (pcity != null) {
        return "The " + nation + " give " + decodeURIComponent(pcity['name']);
      } else {
        return "The " + nation + " give unknown city.";
      }
    case CLAUSE_GOLD:
      return "The " + nation + " give " + value + " gold";
    case CLAUSE_MAP:
      return "The " + nation + " give their worldmap";
    case CLAUSE_SEAMAP:
      return "The " + nation + " give their seamap";
    case CLAUSE_CEASEFIRE:
      return "The parties agree on a cease-fire";
    case CLAUSE_PEACE:
      return "The parties agree on a peace";
    case CLAUSE_ALLIANCE:
      return "The parties create an alliance";
    case CLAUSE_VISION:
      return "The " + nation + " give shared vision";
    case CLAUSE_EMBASSY:
      return "The " + nation + " give an embassy";
    case CLAUSE_SHARED_TILES:
      return "The " + nation + " share their tiles";
  }

  return "";
}

/**
 * Build data object for the diplomacy dialog template.
 * Pure data builder - no DOM access.
 */
export function meeting_template_data(
  giver: Player,
  taker: Player,
  clause_infos: Record<number, ClauseInfo>,
): MeetingPlayerData {
  const nation = store.nations[giver['nation']];
  const data: MeetingPlayerData = {
    adjective: nation['adjective'] as string,
    name: giver['name'],
    pid: giver['playerno'],
    clauses: [],
  };

  if (!nation['customized']) {
    data.flag = nation['graphic_str'] + "-web" + get_tileset_file_extention();
  }

  const all_clauses: (ClauseItem | ClauseGroup)[] = [];

  let clauses: ClauseItem[] = [];
  if (clause_infos[CLAUSE_MAP]['enabled']) {
    clauses.push({ type: CLAUSE_MAP, value: 1, name: 'World-map' });
  }
  if (clause_infos[CLAUSE_SEAMAP]['enabled']) {
    clauses.push({ type: CLAUSE_SEAMAP, value: 1, name: 'Sea-map' });
  }
  if (clauses.length > 0) {
    all_clauses.push({ title: 'Maps...', clauses: clauses });
  }

  if (store.gameInfo!.trading_tech && clause_infos[CLAUSE_ADVANCE]['enabled']) {
    clauses = [];
    for (const tech_id in store.techs) {
      if (player_invention_state(giver, Number(tech_id)) === TECH_KNOWN
        && (player_invention_state(taker, Number(tech_id)) === TECH_UNKNOWN
          || player_invention_state(taker, Number(tech_id)) === TECH_PREREQS_KNOWN)) {
        clauses.push({
          type: CLAUSE_ADVANCE,
          value: tech_id,
          name: store.techs[tech_id]['name'] as string
        });
      }
    }
    if (clauses.length > 0) {
      all_clauses.push({ title: 'Advances...', clauses: clauses });
    }
  }

  if (store.gameInfo!.trading_city && !is_longturn()
    && clause_infos[CLAUSE_CITY]['enabled']) {
    clauses = [];
    for (const city_id in store.cities) {
      const pcity = store.cities[city_id];
      if (city_owner(pcity) === giver['playerno']
        && !does_city_have_improvement(pcity, "Palace")) {
        clauses.push({
          type: CLAUSE_CITY,
          value: city_id,
          name: decodeURIComponent(pcity['name'])
        });
      }
    }
    if (clauses.length > 0) {
      all_clauses.push({ title: 'Cities...', clauses: clauses });
    }
  }

  if (clause_infos[CLAUSE_VISION]['enabled']) {
    all_clauses.push({ type: CLAUSE_VISION, value: 1, name: 'Give shared vision' });
  }
  if (clause_infos[CLAUSE_EMBASSY]['enabled']) {
    all_clauses.push({ type: CLAUSE_EMBASSY, value: 1, name: 'Give embassy' });
  }
  if (clause_infos[CLAUSE_SHARED_TILES]['enabled']) {
    all_clauses.push({ type: CLAUSE_SHARED_TILES, value: 1, name: 'Share tiles' });
  }

  if (giver === clientPlaying()) {
    clauses = [];
    if (clause_infos[CLAUSE_CEASEFIRE]['enabled']) {
      clauses.push({ type: CLAUSE_CEASEFIRE, value: 1, name: 'Cease-fire' });
    }
    if (clause_infos[CLAUSE_PEACE]['enabled']) {
      clauses.push({ type: CLAUSE_PEACE, value: 1, name: 'Peace' });
    }
    if (clause_infos[CLAUSE_ALLIANCE]['enabled']) {
      clauses.push({ type: CLAUSE_ALLIANCE, value: 1, name: 'Alliance' });
    }
    if (clauses.length > 0) {
      all_clauses.push({ title: 'Pacts...', clauses: clauses });
    }
  }

  data.clauses = all_clauses;

  return data;
}

/**
 * Render a player box for the diplomacy dialog.
 * Pure HTML string builder - no DOM access.
 */
export function renderPlayerBox(player: MeetingPlayerData, box: string, counterpartPid: number): string {
  let html = "<div class='diplomacy_player_box'>\n";

  if (player.flag) {
    html += "  <img src='/images/flags/" + player.flag + "' class='flag_" + box
      + "' id='flag_" + box + "_" + counterpartPid + "'>\n";
  } else {
    html += "  <canvas class='flag_" + box + "' id='flag_" + box + "_" + counterpartPid
      + "' width='58' height='40'></canvas>\n";
  }

  html += "  <div class='agree_" + box + "' id='agree_" + box + "_" + counterpartPid + "'></div>\n";
  html += "  <h3>" + player.adjective + " " + player.name + "</h3>\n";
  html += "  <div class='dipl_div' >\n";
  html += "    <div id='hierarchy_" + box + "_" + counterpartPid + "'>";
  html += "<a tabindex='0' class='menu-button-activator ui-button ui-widget ui-state-default ui-corner-all'>"
    + "<span class='ui-icon ui-icon-triangle-1-s'></span>Add Clause...</a>\n";
  html += "      <ul class='dipl_add'>";

  for (const entry of player.clauses) {
    if ('title' in entry) {
      const group = entry as ClauseGroup;
      html += "<li><div>" + group.title + "</div>\n          <ul>";
      for (const clause of group.clauses) {
        html += "<li><div><a href='#' onclick='create_clause_req(" + counterpartPid
          + ", " + player.pid + ", " + clause.type + ", " + clause.value + ");'>"
          + clause.name + "</a></div></li>\n";
      }
      html += "</ul>\n          </li>\n";
    } else {
      const clause = entry as ClauseItem;
      html += "<li><div><a href='#' onclick='create_clause_req(" + counterpartPid
        + ", " + player.pid + ", " + clause.type + ", " + clause.value + ");'>"
        + clause.name + "</a></div></li>\n";
    }
  }

  html += "</ul>\n    </div>\n";
  html += "    <span class='diplomacy_gold'>Gold:<input id='" + box + "_gold_" + counterpartPid
    + "' type='number' step='1' size='3' value='0'></span>\n";
  html += "  </div>\n</div>\n";

  return html;
}

/**
 * Render the full diplomacy meeting dialog HTML.
 * Pure HTML string builder - no DOM access.
 */
export function renderDiplomacyMeetingHtml(self: MeetingPlayerData, counterpart: MeetingPlayerData): string {
  let html = "\n<div id='diplomacy_dialog_" + counterpart.pid + "'>\n  <div>\n";
  html += "    Treaty clauses:<br>\n";
  html += "    <div class='diplomacy_messages' id='diplomacy_messages_" + counterpart.pid + "'></div>\n";
  html += renderPlayerBox(self, 'self', counterpart.pid);
  html += renderPlayerBox(counterpart, 'counterpart', counterpart.pid);
  html += "  </div>\n</div>\n";
  return html;
}

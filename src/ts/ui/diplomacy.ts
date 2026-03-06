import { store } from '../data/store';
import { game_find_city_by_number as find_city_by_number } from '../data/game';
import { cityOwnerPlayerId as city_owner, doesCityHaveImprovement as does_city_have_improvement } from '../data/city';
import { playerInventionState as player_invention_state, TECH_KNOWN, TECH_UNKNOWN, TECH_PREREQS_KNOWN } from '../data/tech';
import { isLongturn as is_longturn } from '../client/clientCore';
import { send_request as sendRequest } from '../net/connection';
import {
  packet_diplomacy_init_meeting_req,
  packet_diplomacy_accept_treaty_req,
  packet_diplomacy_cancel_meeting_req,
  packet_diplomacy_create_clause_req,
  packet_diplomacy_remove_clause_req,
  packet_diplomacy_cancel_pact,
} from '../net/packetConstants';
import { clientState as client_state, clientIsObserver, clientPlaying } from '../client/clientState';
import { updateNationScreen as update_nation_screen } from '../data/nation';
import { isSmallScreen as is_small_screen, getTilesetFileExtension as get_tileset_file_extention } from '../utils/helpers';
import { get_treaty_agree_thumb_up, get_treaty_disagree_thumb_down } from '../renderer/tilespec';
import { DiplState } from '../data/player';
import type { Player, Nation } from '../data/types';

// jQuery partially removed — native DOM where possible
function byId(id: string): HTMLElement | null { return document.getElementById(id); }

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
export const SPECENUM_COUNT = 11;

interface ClauseInfo { enabled: boolean; [key: string]: unknown; }
interface DiplomacyClause { counterpart: number; giver: number; type: number; value: number; }
export let clause_infos: Record<number, ClauseInfo> = {};
export let diplomacy_clause_map: Record<number, DiplomacyClause[]> = {};

/**************************************************************************
 ...
**************************************************************************/
export function diplomacy_init_meeting_req(counterpart: number): void {
  if (clientIsObserver()) return;
  const packet = { "pid": packet_diplomacy_init_meeting_req, "counterpart": counterpart };
  sendRequest(JSON.stringify(packet));
}


/**************************************************************************
 ...
**************************************************************************/
export function show_diplomacy_dialog(counterpart: number): void {
  const pplayer = store.players[counterpart];
  create_diplomacy_dialog(pplayer);
}

/**************************************************************************
 ...
**************************************************************************/
export function accept_treaty_req(counterpart_id: number): void {
  if (clientIsObserver()) return;
  const packet = { "pid": packet_diplomacy_accept_treaty_req, "counterpart": counterpart_id };
  sendRequest(JSON.stringify(packet));
}

/**************************************************************************
 ...
**************************************************************************/
export function accept_treaty(counterpart: number, I_accepted: boolean, other_accepted: boolean): void {
  if (I_accepted === true && other_accepted === true) {
    diplomacy_clause_map[counterpart] = [];
    cleanup_diplomacy_dialog(counterpart);

  } else {

    const agree_sprite = get_treaty_agree_thumb_up();
    const disagree_sprite = get_treaty_disagree_thumb_down();


    const agree_html = "<div style='float:left; background: transparent url("
      + agree_sprite['image-src']
      + "); background-position:-" + agree_sprite['tileset-x'] + "px -"
      + agree_sprite['tileset-y']
      + "px;  width: " + agree_sprite['width'] + "px;height: "
      + agree_sprite['height'] + "px; margin: 5px; '>"
      + "</div>";

    const disagree_html = "<div style='float:left; background: transparent url("
      + disagree_sprite['image-src']
      + "); background-position:-" + disagree_sprite['tileset-x'] + "px -"
      + disagree_sprite['tileset-y']
      + "px;  width: " + disagree_sprite['width'] + "px;height: "
      + disagree_sprite['height'] + "px; margin: 5px; '>"
      + "</div>";
    const selfEl = document.getElementById("agree_self_" + counterpart);
    if (selfEl) selfEl.innerHTML = I_accepted ? agree_html : disagree_html;

    const otherEl = document.getElementById("agree_counterpart_" + counterpart);
    if (otherEl) otherEl.innerHTML = other_accepted ? agree_html : disagree_html;
  }
}

/**************************************************************************
 ...
**************************************************************************/
export function cancel_meeting_req(counterpart_id: number): void {
  const packet = { "pid": packet_diplomacy_cancel_meeting_req, "counterpart": counterpart_id };
  sendRequest(JSON.stringify(packet));
}

/**************************************************************************
 ...
**************************************************************************/
export function create_clause_req(counterpart_id: number, giver: number, type: number, value: number): void {
  if (type === CLAUSE_CEASEFIRE || type === CLAUSE_PEACE || type === CLAUSE_ALLIANCE) {
    // eg. creating peace treaty requires removing ceasefire first.
    const clauses = diplomacy_clause_map[counterpart_id];
    for (let i = 0; i < clauses.length; i++) {
      const clause = clauses[i];
      if (clause['type'] === CLAUSE_CEASEFIRE || clause['type'] === CLAUSE_PEACE || clause['type'] === CLAUSE_ALLIANCE) {
        remove_clause_req(counterpart_id, i);
      }
    }
  }

  const packet = {
    "pid": packet_diplomacy_create_clause_req,
    "counterpart": counterpart_id,
    "giver": giver,
    "type": type,
    "value": value
  };
  sendRequest(JSON.stringify(packet));
}


/**************************************************************************
 ...
**************************************************************************/
export function cancel_meeting(counterpart: number): void {
  diplomacy_clause_map[counterpart] = [];
  cleanup_diplomacy_dialog(counterpart);
}

/**************************************************************************
 Remove diplomacy dialog.
**************************************************************************/
export function cleanup_diplomacy_dialog(counterpart_id: number | string): void {
  document.getElementById("diplomacy_dialog_" + counterpart_id)?.remove();
}

/**************************************************************************
 Remove all diplomacy dialogs and empty clauses map.
**************************************************************************/
export function discard_diplomacy_dialogs(): void {
  for (const counterpart in diplomacy_clause_map) {
    cleanup_diplomacy_dialog(counterpart);
  }
  diplomacy_clause_map = {};
}

/**************************************************************************
 ...
**************************************************************************/
export function show_diplomacy_clauses(counterpart_id: number): void {
  const clauses = diplomacy_clause_map[counterpart_id];
  let diplo_html = "";
  for (let i = 0; i < clauses.length; i++) {
    const clause = clauses[i];
    const diplo_str = client_diplomacy_clause_string(clause['counterpart'],
      clause['giver'],
      clause['type'],
      clause['value']);
    diplo_html += "<a href='#' onclick='remove_clause_req("
      + counterpart_id + ", " + i + ");'>" + diplo_str + "</a><br>";

  }

  const msgEl = document.getElementById("diplomacy_messages_" + counterpart_id);
  if (msgEl) msgEl.innerHTML = diplo_html;
}

/**************************************************************************
 ...
**************************************************************************/
export function remove_clause_req(counterpart_id: number, clause_no: number): void {
  const clauses = diplomacy_clause_map[counterpart_id];
  const clause = clauses[clause_no];

  const packet = {
    "pid": packet_diplomacy_remove_clause_req,
    "counterpart": clause['counterpart'],
    "giver": clause['giver'],
    "type": clause['type'],
    "value": clause['value']
  };
  sendRequest(JSON.stringify(packet));
}

/**************************************************************************
 ...
**************************************************************************/
export function remove_clause(remove_clause_obj: DiplomacyClause): void {
  const counterpart_id = remove_clause_obj['counterpart'];
  const clause_list = diplomacy_clause_map[counterpart_id];
  for (let i = 0; i < clause_list.length; i++) {
    const check_clause = clause_list[i];
    if (counterpart_id === check_clause['counterpart']
      && remove_clause_obj['giver'] === check_clause['giver']
      && remove_clause_obj['type'] === check_clause['type']) {

      clause_list.splice(i, 1);
      break;
    }
  }

  show_diplomacy_clauses(counterpart_id);
}

/**************************************************************************
 ...
**************************************************************************/
export function client_diplomacy_clause_string(counterpart: number, giver: number, type: number, value: number): string {
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
      if (giver === clientPlaying()['playerno']) {
        const el = document.getElementById("self_gold_" + counterpart) as HTMLInputElement | null;
        if (el) el.value = String(value);
      } else {
        const el = document.getElementById("counterpart_gold_" + counterpart) as HTMLInputElement | null;
        if (el) el.value = String(value);
      }
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



/**************************************************************************
 ...
**************************************************************************/
export function diplomacy_cancel_treaty(player_id: number): void {
  const packet = {
    "pid": packet_diplomacy_cancel_pact,
    "other_player_id": player_id,
    "clause": DiplState.DS_CEASEFIRE
  };
  sendRequest(JSON.stringify(packet));

  update_nation_screen();

  setTimeout(update_nation_screen, 500);
  setTimeout(update_nation_screen, 1500);
}



/**************************************************************************
 ...
**************************************************************************/
export function create_diplomacy_dialog(counterpart: Player): void {
  const pplayer = clientPlaying();
  const counterpart_id = counterpart['playerno'];

  // reset diplomacy_dialog div.
  cleanup_diplomacy_dialog(counterpart_id);
  const gamePage = byId('game_page');
  if (gamePage) {
    const selfData = meeting_template_data(pplayer, counterpart);
    const counterpartData = meeting_template_data(counterpart, pplayer);
    gamePage.insertAdjacentHTML('beforeend', renderDiplomacyMeetingHtml(selfData, counterpartData));
  }

  const title = "Diplomacy: " + counterpart['name']
    + " of the " + store.nations[counterpart['nation']]['adjective'];

  const diplomacy_dialog = byId('diplomacy_dialog_' + counterpart_id);
  if (diplomacy_dialog) {
    // Wrap in a positioned container acting as a dialog
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:fixed;z-index:1000;background:#222;border:1px solid #555;padding:0;'
      + 'top:10%;left:50%;transform:translateX(-50%);width:' + (is_small_screen() ? '90%' : '50%') + ';'
      + 'height:500px;overflow:visible;color:#fff;';
    // Title bar
    const titleBar = document.createElement('div');
    titleBar.style.cssText = 'background:#333;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #555;';
    titleBar.innerHTML = '<span style="font-weight:bold;">' + title + '</span>';
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:6px;';
    const acceptBtn = document.createElement('button');
    acceptBtn.textContent = 'Accept treaty';
    acceptBtn.addEventListener('click', () => accept_treaty_req(counterpart_id));
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel meeting';
    cancelBtn.addEventListener('click', () => cancel_meeting_req(counterpart_id));
    btnRow.appendChild(acceptBtn);
    btnRow.appendChild(cancelBtn);
    titleBar.appendChild(btnRow);
    wrapper.appendChild(titleBar);

    // Move the diplomacy_dialog content into wrapper
    diplomacy_dialog.parentNode?.insertBefore(wrapper, diplomacy_dialog);
    wrapper.appendChild(diplomacy_dialog);
    diplomacy_dialog.style.overflow = 'visible';
  }

  let nation = store.nations[pplayer['nation']];
  if (nation['customized']) {
    meeting_paint_custom_flag(nation, document.getElementById('flag_self_' + counterpart_id) as HTMLCanvasElement);
  }
  nation = store.nations[counterpart['nation']];
  if (nation['customized']) {
    meeting_paint_custom_flag(nation, document.getElementById('flag_counterpart_' + counterpart_id) as HTMLCanvasElement);
  }

  const selfHier = byId('hierarchy_self_' + counterpart_id);
  if (selfHier) create_clauses_menu(selfHier);
  const counterHier = byId('hierarchy_counterpart_' + counterpart_id);
  if (counterHier) create_clauses_menu(counterHier);

  if (store.gameInfo!.trading_gold && clause_infos[CLAUSE_GOLD]['enabled']) {
    const selfGold = document.getElementById("self_gold_" + counterpart_id) as HTMLInputElement | null;
    const counterGold = document.getElementById("counterpart_gold_" + counterpart_id) as HTMLInputElement | null;
    if (selfGold) { selfGold.max = String(pplayer['gold']); selfGold.min = '0'; }
    if (counterGold) { counterGold.max = String(counterpart['gold']); counterGold.min = '0'; }

    let wto: number;
    counterGold?.addEventListener('change', function () {
      clearTimeout(wto);
      wto = window.setTimeout(function () {
        meeting_gold_change_req(counterpart_id, counterpart_id,
          parseFloat(counterGold!.value));
      }, 500);
    });

    selfGold?.addEventListener('change', function () {
      clearTimeout(wto);
      wto = window.setTimeout(function () {
        meeting_gold_change_req(counterpart_id, pplayer['playerno'],
          parseFloat(selfGold!.value));
      }, 500);
    });

  } else {
    const selfGold = document.getElementById("self_gold_" + counterpart_id) as HTMLInputElement | null;
    const counterGold = document.getElementById("counterpart_gold_" + counterpart_id) as HTMLInputElement | null;
    if (selfGold) { selfGold.disabled = true; if (selfGold.parentElement) selfGold.parentElement.style.display = 'none'; }
    if (counterGold) { counterGold.disabled = true; if (counterGold.parentElement) counterGold.parentElement.style.display = 'none'; }
  }

}

export function meeting_paint_custom_flag(nation: Nation, flag_canvas: HTMLCanvasElement): void {
  const tag = "f." + nation['graphic_str'];
  const flag_canvas_ctx = flag_canvas.getContext("2d");
  if (flag_canvas_ctx) {
    flag_canvas_ctx.scale(1.5, 1.5);
    flag_canvas_ctx.drawImage(store.sprites[tag], 0, 0);
  }
}

export function create_clauses_menu(content: HTMLElement): void {
  content.style.position = 'relative';
  const children = content.children;
  const button = children[0] as HTMLElement;
  const menu = children[1] as HTMLElement;
  if (!button || !menu) return;

  const cs = getComputedStyle(button);
  menu.style.position = 'absolute';
  menu.style.top = (button.offsetHeight
    + parseFloat(cs.paddingTop || '0')
    + parseFloat(cs.paddingBottom || '0')
    + parseFloat(cs.borderTopWidth || '0')) + 'px';
  menu.style.left = parseFloat(cs.marginLeft || '0') + 'px';
  menu.style.display = 'none';

  let isOpen = false;
  const menu_open = function () {
    menu.style.display = '';
    isOpen = true;
  };
  const menu_close = function () {
    menu.style.display = 'none';
    isOpen = false;
  };
  button.addEventListener('click', function () {
    if (isOpen) menu_close(); else menu_open();
  });
  menu.addEventListener('click', function (e) {
    if (e.target && (e.target as HTMLElement).tagName === 'A') {
      menu_close();
    }
  });
  content.addEventListener('mouseenter', menu_open);
  content.addEventListener('mouseleave', menu_close);
}

/**************************************************************************
 Request update of gold clause
**************************************************************************/
export function meeting_gold_change_req(counterpart_id: number, giver: number, gold: number): void {
  const clauses = diplomacy_clause_map[counterpart_id];
  if (clauses != null) {
    for (let i = 0; i < clauses.length; i++) {
      const clause = clauses[i];
      if (clause['giver'] === giver && clause['type'] === CLAUSE_GOLD) {
        if (clause['value'] === gold) return;
        remove_clause_req(counterpart_id, i);
      }
    }
  }

  if (gold !== 0) {
    const packet = {
      "pid": packet_diplomacy_create_clause_req,
      "counterpart": counterpart_id,
      "giver": giver,
      "type": CLAUSE_GOLD,
      "value": gold
    };
    sendRequest(JSON.stringify(packet));
  }
}

interface ClauseItem { type: number; value: number | string; name: string; }
interface ClauseGroup { title: string; clauses: ClauseItem[]; }
interface MeetingPlayerData {
  flag?: string;
  adjective: string;
  name: string;
  pid: number;
  clauses: (ClauseItem | ClauseGroup)[];
}

/**************************************************************************
 Build data object for the dialog template.
**************************************************************************/
export function meeting_template_data(giver: Player, taker: Player): MeetingPlayerData {
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

/**************************************************************************
 Render a player box for the diplomacy dialog.
 Previously generated by Handlebars partial 'diplomacy_player_box'.
**************************************************************************/
function renderPlayerBox(player: MeetingPlayerData, box: string, counterpartPid: number): string {
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

/**************************************************************************
 Render the full diplomacy meeting dialog HTML.
 Previously generated by Handlebars template 'diplomacy_meeting'.
**************************************************************************/
function renderDiplomacyMeetingHtml(self: MeetingPlayerData, counterpart: MeetingPlayerData): string {
  let html = "\n<div id='diplomacy_dialog_" + counterpart.pid + "'>\n  <div>\n";
  html += "    Treaty clauses:<br>\n";
  html += "    <div class='diplomacy_messages' id='diplomacy_messages_" + counterpart.pid + "'></div>\n";
  html += renderPlayerBox(self, 'self', counterpart.pid);
  html += renderPlayerBox(counterpart, 'counterpart', counterpart.pid);
  html += "  </div>\n</div>\n";
  return html;
}

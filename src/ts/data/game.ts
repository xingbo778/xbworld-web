import type { City, Unit } from './types';
import { store } from './store';
import { cityPopulation as city_population } from './city';
import { clientState as client_state, C_S_RUNNING, clientPlaying } from '../client/clientState';
import { numberWithCommas, isSmallScreen as is_small_screen } from '../utils/helpers';
import { setHtml } from '../utils/dom';

export const IDENTITY_NUMBER_ZERO = 0;

export function game_init(): void {
  store.mapInfo = {} as typeof store.mapInfo;
  store.terrains = {};
  store.resources = {};
  store.players = {};
  store.units = {};
  store.unitTypes = {};
  store.connections = {};
  store.client.conn = {} as typeof store.client.conn;
}

export function game_find_city_by_number(id: number): City | undefined {
  return store.cities[id];
}

export function game_find_unit_by_number(id: number): Unit | undefined {
  return store.units[id];
}

export function civ_population(playerno: number): string {
  let population = 0;

  for (const city_id in store.cities) {
    const pcity = store.cities[city_id];
    if (playerno === pcity['owner']) {
      population += city_population(pcity);
    }
  }
  return numberWithCommas(population * 1000);
}

export function update_game_status_panel(): void {
  if (C_S_RUNNING !== client_state()) return;

  let status_html = '';

  if (clientPlaying() != null) {
    const pplayer = clientPlaying()!;
    const tax = pplayer['tax'];
    const lux = pplayer['luxury'];
    const sci = pplayer['science'];

    let net_income: string | number = pplayer['expected_income'];
    if (pplayer['expected_income'] > 0) {
      net_income = '+' + pplayer['expected_income'];
    }

    if (!is_small_screen())
      status_html +=
        '<b>' +
        (store.nations[pplayer['nation']]?.['adjective'] || '') +
        "</b> &nbsp;&nbsp; <span title='Population'>👤</span>: ";
    if (!is_small_screen())
      status_html += '<b>' + civ_population(clientPlaying()!.playerno) + '</b>  &nbsp;&nbsp;';
    if (!is_small_screen())
      status_html +=
        "<span title='Year (turn)'>🕐</span>: <b>" +
        get_year_string() +
        '</b> &nbsp;&nbsp;';
    status_html += "<span title='Gold (net income)'>💰</span>: ";
    if (pplayer['expected_income'] >= 0) {
      status_html += "<b title='Gold (net income)'>";
    } else {
      status_html += "<b class='negative_net_income' title='Gold (net income)'>";
    }
    status_html += pplayer['gold'] + ' (' + net_income + ')</b>  &nbsp;&nbsp;';
    status_html +=
      "<span style='cursor:pointer;' onclick='javascript:show_tax_rates_dialog();'><span title='Tax rate'>📊</span>: <b>" +
      tax +
      '</b>% ';
    status_html +=
      "<span title='Luxury rate'>🎵</span>: <b>" + lux + '</b>% ';
    status_html +=
      "<span title='Science rate'>🧪</span>: <b>" +
      sci +
      '</b>%</span> ';
  } else if (store.observing || clientPlaying() == null) {
    // Observer mode: always show year + turn regardless of metamessage
    const meta = store.serverSettings?.['metamessage']?.['val'];
    if (meta) status_html += meta + ' — ';
    if (store.gameInfo) {
      if (!is_small_screen()) {
        status_html += "<span title='Year (turn)'>🕐</span>: <b>" + get_year_string() + '</b> &nbsp;&nbsp;';
      } else {
        status_html += '<b>' + get_year_string() + '</b> ';
      }
      status_html += 'Observing';
    }
  }

  const panelTop = document.getElementById('game_status_panel_top');
  const panelBottom = document.getElementById('game_status_panel_bottom');

  if (window.innerWidth - sum_width() > 800) {
    if (panelTop) {
      panelTop.style.display = '';
      setHtml(panelTop, status_html);
    }
    if (panelBottom) {
      panelBottom.style.display = 'none';
    }
  } else {
    if (panelTop) {
      panelTop.style.display = 'none';
    }
    if (panelBottom) {
      panelBottom.style.display = '';
      panelBottom.style.width = window.innerWidth + 'px';
      setHtml(panelBottom, status_html);
    }
  }

  let page_title =
    'XBWorld - ' + store.username + '  (turn:' + store.gameInfo!['turn'] + ', port:' + store.civserverport + ') ';
  if (store.serverSettings['metamessage'] != null) {
    page_title += store.serverSettings['metamessage']['val'];
  }
  document.title = page_title;
}

export function get_year_string(): string {
  let year_string = '';
  if (store.gameInfo!['year'] < 0) {
    year_string = Math.abs(store.gameInfo!['year']) + store.calendarInfo!['negative_year_label'] + ' ';
  } else if (store.gameInfo!['year'] >= 0) {
    year_string = store.gameInfo!['year'] + store.calendarInfo!['positive_year_label'] + ' ';
  }
  if (is_small_screen()) {
    year_string += '(T:' + store.gameInfo!['turn'] + ')';
  } else {
    year_string += '(Turn:' + store.gameInfo!['turn'] + ')';
  }
  return year_string;
}

export function current_turn_timeout(): number {
  if (!store.gameInfo) return 0; // P2 fix: game_info is null before game starts
  if (store.gameInfo['turn'] === 1 && store.gameInfo['first_timeout'] !== -1) {
    return store.gameInfo['first_timeout'];
  } else {
    return store.gameInfo['timeout'];
  }
}

export function sum_width(): number {
  let sum = 0;
  const tabsMenu = document.getElementById('tabs_menu');
  if (tabsMenu) {
    for (const child of Array.from(tabsMenu.children) as HTMLElement[]) {
      if (child.offsetParent !== null && child.id !== 'game_status_panel_top') {
        sum += child.offsetWidth;
      }
    }
  }
  return sum;
}

// ---------------------------------------------------------------------------
// Expose to legacy JS via window
// Legacy global init guards removed — all state now lives in store.

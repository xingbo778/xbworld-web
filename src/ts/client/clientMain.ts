/**
 * Client main — migrated from client_main.js.
 *
 * Functions: setClientState, setupWindowSize, showNewGameMessage,
 *   showEndgameDialog, setDefaultMapviewActive.
 */

import { store } from '../data/store';
import { C_S_PREPARING, C_S_RUNNING, C_S_OVER } from './clientState';
import { clear_chatbox } from '../core/messages';
import { chatbox_active } from '../core/messages';
import { set_client_page, PAGE_GAME } from '../core/pages';
import { center_on_any_city } from '../core/control/mapClick';
import { advance_unit_focus, init_game_unit_panel, update_active_units_dialog } from '../core/control/unitFocus';
import { unitpanel_active, setAllowRightClick, setKeyboardInput } from '../core/control/controlState';
import { is_small_screen } from '../renderer/mapview';
import { init_overview, overview_active, setOverviewActive } from '../core/overview';
import { mark_all_dirty, mapview } from '../renderer/mapviewCommon';
import { unblockUI } from '../utils/dom';
import { showMessageDialog } from '../components/Dialogs/MessageDialog';
import { getActiveTab, setActiveTab } from '../ui/tabs';
import { escapeHtml } from '../utils/safeHtml';
import { setTechDialogActive } from '../ui/techDialog';

// ---------------------------------------------------------------------------
// set_client_state
// ---------------------------------------------------------------------------

/**
 * Sets the client state (initial, pre, running, over etc).
 * Mirrors the logic in client_main.js set_client_state().
 */
export function setClientState(newstate: number): void {
  console.log('[xbw] setClientState ' + store.civclientState + ' → ' + newstate);
  if (store.civclientState === newstate) return;
  store.civclientState = newstate;

  switch (newstate) {
    case C_S_RUNNING: {
      try {
        clear_chatbox();
        unblockUI();
        showNewGameMessage();
      } catch (e) {
        console.error('[set_client_state] Error in pre-page setup:', e);
      }
      set_client_page(PAGE_GAME);
      setupWindowSize();
      // Force Pixi canvas to fill the now-visible game page.
      // Must run AFTER set_client_page() (makes #game_page visible) and
      // setupWindowSize() (sets #tabs-map height), so clientHeight is non-zero.
      {
        const _pr = (store as unknown as Record<string, unknown>)['pixiRenderer'] as { resize(): void; markAllDirty(): void } | undefined;
        _pr?.resize();
        _pr?.markAllDirty();
      }
      // Initialize overview panel (sets default size if no map data yet)
      init_overview();
      // remove context menu from pregame
      document.querySelectorAll('.context-menu-root').forEach(el => el.remove());
      // Always observer mode — center on a city at game start
      center_on_any_city();
      advance_unit_focus();
      // Retry until the map is actually centered (mapview.gui_x0 ≠ 0 means centering worked)
      const _tryCenter = (attempts: number) => {
        if (mapview.gui_x0 !== 0 || mapview.gui_y0 !== 0) return; // already centered
        center_on_any_city();
        if (attempts > 0) setTimeout(() => _tryCenter(attempts - 1), 2000);
      };
      setTimeout(() => _tryCenter(3), 1000);
      break;
    }

    case C_S_OVER:
      setTimeout(function () {
        showEndgameDialog();
      }, 500);
      break;

    case C_S_PREPARING:
      break;

    default:
      break;
  }
}

// ---------------------------------------------------------------------------
// setup_window_size
// ---------------------------------------------------------------------------

/**
 * Refreshes the size of UI elements based on new window and screen size.
 */
export function setupWindowSize(): void {
  const winWidth  = window.innerWidth;
  const winHeight = window.innerHeight;
  const new_mapview_width  = winWidth  - store.widthOffset;
  const new_mapview_height = winHeight - store.heightOffset;

  mapview['width']        = new_mapview_width;
  mapview['height']       = new_mapview_height;
  mapview['store_width']  = new_mapview_width;
  mapview['store_height'] = new_mapview_height;

  const _el = (id: string) => document.getElementById(id);
  const _setH = (id: string, h: number | string) => { const el = _el(id); if (el) el.style.height = typeof h === 'number' ? h + 'px' : h; };
  const _setW = (id: string, w: number | string) => { const el = _el(id); if (el) el.style.width = typeof w === 'number' ? w + 'px' : w; };
  const _show = (id: string) => { const el = _el(id); if (el) el.style.display = ''; };
  const _hide = (id: string) => { const el = _el(id); if (el) el.style.display = 'none'; };

  _setH('nations', new_mapview_height - 100);
  _setW('nations', new_mapview_width);
  const tabs = _el('tabs');
  if (tabs) tabs.style.height = winHeight + 'px';
  // All tab panels get the same height so their children can use height:100%
  // and overflow:auto correctly (prevents log/nations content escaping the panel)
  for (const id of ['tabs-map', 'tabs-tec', 'tabs-nat', 'tabs-cities', 'tabs-hel']) {
    _setH(id, new_mapview_height);
  }
  _setH('city_viewport', new_mapview_height - 20);
  _show('opt_tab');
  _show('players_tab');
  _show('freeciv_logo');
  _hide('tabs-hel');

  if (is_small_screen()) {
    const setTabIcon = (id: string, emoji: string) => {
      const el = _el(id);
      if (el) {
        const a = el.querySelector('a');
        if (a) a.textContent = emoji;
      }
    };
    setTabIcon('map_tab', '\u{1F30D}');
    setTabIcon('opt_tab', '\u{2699}\uFE0F');
    setTabIcon('players_tab', '\u{1F3F4}');
    setTabIcon('tech_tab', '\u{1F9EA}');
    setTabIcon('hel_tab', '\u{2753}');
    document.querySelectorAll<HTMLElement>('.ui-tabs-anchor').forEach(el => el.style.padding = '7px');
    document.querySelectorAll<HTMLElement>('.overview_dialog').forEach(el => el.style.display = 'none');
    document.querySelectorAll<HTMLElement>('.ui-dialog-titlebar').forEach(el => el.style.display = 'none');
    _hide('freeciv_logo');
    setOverviewActive(false);
    _el('game_unit_orders_default')?.remove();
    _el('game_unit_orders_settlers')?.remove();
    const statusBottom = _el('game_status_panel_bottom');
    if (statusBottom) statusBottom.style.fontSize = '0.8em';
  }

  if (overview_active) init_overview();
  if (unitpanel_active) init_game_unit_panel();
}

// ---------------------------------------------------------------------------
// show_new_game_message
// ---------------------------------------------------------------------------

/**
 * Shows the intro message when a new game starts.
 */
export function showNewGameMessage(): void {
  const message: string | null = null;
  clear_chatbox();

  // Always observer mode — no intro message needed
}

// ---------------------------------------------------------------------------
// show_endgame_dialog
// ---------------------------------------------------------------------------

/**
 * Shows the endgame dialog with final scores.
 */
export function showEndgameDialog(): void {
  const title = 'Final Report: The Greatest Civilizations in the world!';
  let message = '';
  for (let i = 0; i < store.endgamePlayerInfo.length; i++) {
    const info = store.endgamePlayerInfo[i];
    const pplayer = store.players[info['player_id'] as number];
    const nation_adj = store.nations[pplayer['nation']]?.['adjective'] ?? 'Unknown';
    message += (i + 1) + ': The ' + escapeHtml(String(nation_adj)) + ' ruler ' + escapeHtml(String(pplayer['name'])) +
      ' scored ' + info['score'] + ' points' + '<br>';
  }
  showMessageDialog(title, message);
}

// ---------------------------------------------------------------------------
// set_default_mapview_active
// ---------------------------------------------------------------------------

/**
 * Resets the UI to the default map view state.
 */
export function setDefaultMapviewActive(): void {
  // Check active tab — don't switch if cities dialog active
  const active_tab = getActiveTab('#tabs');
  if (active_tab === 4) return; // cities dialog active — don't switch

  if (unitpanel_active) {
    update_active_units_dialog();
  }

  if (chatbox_active) {
    const chatPanel = document.getElementById('game_chatbox_panel');
    if (chatPanel?.parentElement) chatPanel.parentElement.style.display = '';
  }

  // Switch to map tab
  setActiveTab('#tabs', 0);
  setTechDialogActive(false);
  setAllowRightClick(false);
  setKeyboardInput(true);

  // Scroll chat to bottom
  const scrollDiv = document.getElementById('freeciv_custom_scrollbar_div');
  if (scrollDiv) scrollDiv.scrollTop = scrollDiv.scrollHeight;

  if (!is_small_screen()) {
    const overviewPanel = document.getElementById('game_overview_panel');
    if (overviewPanel?.parentElement) overviewPanel.parentElement.style.display = '';
  }

  mark_all_dirty();
}

// ---------------------------------------------------------------------------
// Expose to legacy JS
// ---------------------------------------------------------------------------

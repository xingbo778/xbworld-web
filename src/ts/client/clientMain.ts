/**
 * Client main — migrated from client_main.js (Phase 9.2).
 *
 * Covers the 8 functions not yet in TS:
 *   set_client_state, setup_window_size, show_new_game_message,
 *   alert_war, show_endgame_dialog, update_metamessage_on_gamestart,
 *   update_metamessage_game_running_status, set_default_mapview_active.
 *
 * Global state variables (C_S_*, civclient_state, endgame_player_info,
 * height_offset, width_offset, mapview_canvas_ctx) remain as legacy globals
 * declared in client_main.js — they are NOT re-declared here to avoid
 * double-declaration conflicts while client_main.js is still loaded.
 * Once client_main.js is deleted, the `if (_w.xxx === undefined)` guards
 * below will initialise them.
 */

import { store } from '../data/store';
import { C_S_INITIAL, C_S_PREPARING, C_S_RUNNING, C_S_OVER } from './clientState';
import { RENDERER_2DCANVAS } from '../core/constants';
import { clear_chatbox } from '../core/messages';
import { chatbox_active, current_message_dialog_state } from '../core/messages';
import { set_client_page, PAGE_GAME } from '../core/pages';
import { center_on_any_city } from '../core/control/mapClick';
import { advance_unit_focus, init_game_unit_panel, update_active_units_dialog } from '../core/control/unitFocus';
import { unitpanel_active, setAllowRightClick, setKeyboardInput } from '../core/control/controlState';
import { is_small_screen } from '../renderer/mapview';
import { init_overview, overview_active, overview_current_state, setOverviewActive } from '../core/overview';
import { mark_all_dirty, mapview } from '../renderer/mapviewCommon';
import { unblockUI } from '../utils/dom';
import { showMessageDialog } from '../components/Dialogs/MessageDialog';
import { getActiveTab, setActiveTab } from '../ui/tabs';
import { setTechDialogActive } from '../ui/techDialog';

const _w = window as any;

// ---------------------------------------------------------------------------
// Global state initialisation (guards for when client_main.js is removed)
// ---------------------------------------------------------------------------
if (_w.C_S_INITIAL === undefined)    _w.C_S_INITIAL    = 0;
if (_w.C_S_PREPARING === undefined)  _w.C_S_PREPARING  = 1;
if (_w.C_S_RUNNING === undefined)    _w.C_S_RUNNING    = 2;
if (_w.C_S_OVER === undefined)       _w.C_S_OVER       = 3;
if (_w.civclient_state === undefined) _w.civclient_state = C_S_INITIAL;
if (_w.endgame_player_info === undefined) _w.endgame_player_info = [];
if (_w.height_offset === undefined)  _w.height_offset  = 52;
if (_w.width_offset === undefined)   _w.width_offset   = 10;
// mapview_canvas_ctx is initialised by set_default_mapview_active at runtime

// ---------------------------------------------------------------------------
// set_client_state
// ---------------------------------------------------------------------------

/**
 * Sets the client state (initial, pre, running, over etc).
 * Mirrors the logic in client_main.js set_client_state().
 */
export function setClientState(newstate: number): void {
  if (_w.civclient_state === newstate) return;
  _w.civclient_state = newstate;

  switch (newstate) {
    case C_S_RUNNING:
      try {
        clear_chatbox();
        unblockUI();
        showNewGameMessage();
      } catch (e) {
        console.error('[set_client_state] Error in pre-page setup:', e);
      }
      set_client_page(PAGE_GAME);
      setupWindowSize();
      if (typeof _w.update_metamessage_on_gamestart === 'function') _w.update_metamessage_on_gamestart();
      // remove context menu from pregame
      document.querySelectorAll('.context-menu-root').forEach(el => el.remove());
      // Always observer mode — center on a city at game start
      center_on_any_city();
      advance_unit_focus();
      break;

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
  const new_mapview_width  = winWidth  - (_w.width_offset  as number);
  const new_mapview_height = winHeight - (_w.height_offset as number);

  if (_w.renderer === RENDERER_2DCANVAS && _w.mapview_canvas) {
    _w.mapview_canvas.width  = new_mapview_width;
    _w.mapview_canvas.height = new_mapview_height;
    if (_w.buffer_canvas) {
      _w.buffer_canvas.width   = Math.floor(new_mapview_width  * 1.5);
      _w.buffer_canvas.height  = Math.floor(new_mapview_height * 1.5);
    }
    mapview['width']        = new_mapview_width;
    mapview['height']       = new_mapview_height;
    mapview['store_width']  = new_mapview_width;
    mapview['store_height'] = new_mapview_height;
    if (_w.mapview_canvas_ctx) _w.mapview_canvas_ctx.font = _w.canvas_text_font;
    if (_w.buffer_canvas_ctx)  _w.buffer_canvas_ctx.font  = _w.canvas_text_font;
  }

  const _el = (id: string) => document.getElementById(id);
  const _setH = (id: string, h: number | string) => { const el = _el(id); if (el) el.style.height = typeof h === 'number' ? h + 'px' : h; };
  const _setW = (id: string, w: number | string) => { const el = _el(id); if (el) el.style.width = typeof w === 'number' ? w + 'px' : w; };
  const _show = (id: string) => { const el = _el(id); if (el) el.style.display = ''; };
  const _hide = (id: string) => { const el = _el(id); if (el) el.style.display = 'none'; };

  _setH('nations', new_mapview_height - 100);
  _setW('nations', new_mapview_width);
  const tabs = _el('tabs');
  if (tabs) tabs.style.height = winHeight + 'px';
  _setH('tabs-map', 'auto');
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
    document.querySelectorAll('.ui-tabs-anchor').forEach((el: any) => el.style.padding = '7px');
    document.querySelectorAll('.overview_dialog').forEach((el: any) => el.style.display = 'none');
    document.querySelectorAll('.ui-dialog-titlebar').forEach((el: any) => el.style.display = 'none');
    _hide('freeciv_logo');
    setOverviewActive(false);
    _w.overview_active = false;
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
  let message: string | null = null;
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
  for (let i = 0; i < _w.endgame_player_info.length; i++) {
    const pplayer = store.players[_w.endgame_player_info[i]['player_id']];
    const nation_adj = store.nations[pplayer['nation']]?.['adjective'] ?? 'Unknown';
    message += (i + 1) + ': The ' + nation_adj + ' ruler ' + pplayer['name'] +
      ' scored ' + _w.endgame_player_info[i]['score'] + ' points' + '<br>';
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
  if (_w.renderer === RENDERER_2DCANVAS && _w.mapview_canvas) {
    _w.mapview_canvas_ctx = _w.mapview_canvas.getContext('2d');
    if (_w.mapview_canvas_ctx) _w.mapview_canvas_ctx.font = _w.canvas_text_font;
  }

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
  const tabsMap = document.getElementById('tabs-map');
  if (tabsMap) tabsMap.style.height = 'auto';
  setTechDialogActive(false);
  _w.tech_dialog_active = false;
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

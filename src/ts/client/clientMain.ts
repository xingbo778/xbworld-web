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
import { init_overview, overview_active, overview_current_state } from '../core/overview';
import { mark_all_dirty, mapview } from '../renderer/mapviewCommon';

const _w = window as any;

// ---------------------------------------------------------------------------
// Global state initialisation (guards for when client_main.js is removed)
// ---------------------------------------------------------------------------
if (_w.C_S_INITIAL === undefined)    _w.C_S_INITIAL    = 0;
if (_w.C_S_PREPARING === undefined)  _w.C_S_PREPARING  = 1;
if (_w.C_S_RUNNING === undefined)    _w.C_S_RUNNING    = 2;
if (_w.C_S_OVER === undefined)       _w.C_S_OVER       = 3;
if (__w.civclient_state === undefined) __w.civclient_state = C_S_INITIAL;
if (__w.endgame_player_info === undefined) __w.endgame_player_info = [];
if (__w.height_offset === undefined)  __w.height_offset  = 52;
if (__w.width_offset === undefined)   __w.width_offset   = 10;
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

  const $ = _w.$;

  switch (newstate) {
    case C_S_RUNNING:
      try {
        clear_chatbox();
        if (typeof $.unblockUI === 'function') $.unblockUI();
        showNewGameMessage();
      } catch (e) {
        console.error('[set_client_state] Error in pre-page setup:', e);
      }
      set_client_page(PAGE_GAME);
      setupWindowSize();
      if (typeof _w.update_metamessage_on_gamestart === 'function') _w.update_metamessage_on_gamestart();
      // remove context menu from pregame
      if ($) $('.context-menu-root').remove();
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
  const $ = _w.$;
  const winWidth  = $(window).width()  as number;
  const winHeight = $(window).height() as number;
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
    if (__w.mapview_canvas_ctx) __w.mapview_canvas_ctx.font = _w.canvas_text_font;
    if (__w.buffer_canvas_ctx)  __w.buffer_canvas_ctx.font  = _w.canvas_text_font;
  }

  $('#pregame_message_area').height(new_mapview_height - 80 - $('#pregame_game_info').outerHeight());
  $('#pregame_player_list').height(new_mapview_height - 80);
  $('#nations').height(new_mapview_height - 100);
  $('#nations').width(new_mapview_width);
  $('#tabs').css('height', $(window).height());
  $('#tabs-map').height('auto');
  $('#city_viewport').height(new_mapview_height - 20);
  $('#opt_tab').show();
  $('#players_tab').show();
  $('#cities_tab').show();
  $('#freeciv_logo').show();
  $('#tabs-hel').hide();

  if (is_small_screen()) {
    $('#map_tab').children().html("<i class='fa fa-globe' aria-hidden='true'></i>");
    $('#opt_tab').children().html("<i class='fa fa-cogs' aria-hidden='true'></i>");
    $('#players_tab').children().html("<i class='fa fa-flag' aria-hidden='true'></i>");
    $('#cities_tab').children().html("<i class='fa fa-fort-awesome' aria-hidden='true'></i>");
    $('#tech_tab').children().html("<i class='fa fa-flask' aria-hidden='true'></i>");
    $('#civ_tab').children().html("<i class='fa fa-university' aria-hidden='true'></i>");
    $('#hel_tab').children().html("<i class='fa fa-question-circle-o' aria-hidden='true'></i>");
    $('.ui-tabs-anchor').css('padding', '7px');
    $('.overview_dialog').hide();
    $('.ui-dialog-titlebar').hide();
    $('#freeciv_logo').hide();
    _w.overview_active = false;
    if ($('#game_unit_orders_default').length > 0) $('#game_unit_orders_default').remove();
    if ($('#game_unit_orders_settlers').length > 0) $('#game_unit_orders_settlers').remove();
    $('#game_status_panel_bottom').css('font-size', '0.8em');
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
  const $ = _w.$;
  const title = 'Final Report: The Greatest Civilizations in the world!';
  let message = "<p id='hof_msg'></p>";
  for (let i = 0; i < _w.endgame_player_info.length; i++) {
    const pplayer = store.players[_w.endgame_player_info[i]['player_id']];
    const nation_adj = store.nations[pplayer['nation']]['adjective'];
    message += (i + 1) + ': The ' + nation_adj + ' ruler ' + pplayer['name'] +
      ' scored ' + _w.endgame_player_info[i]['score'] + ' points' + '<br>';
  }
  $('#dialog').remove();
  $("<div id='dialog'></div>").appendTo('div#game_page');
  $('#dialog').html(message);
  $('#dialog').attr('title', title);
  $('#dialog').dialog({
    bgiframe: true,
    modal: true,
    width: is_small_screen() ? '90%' : '50%',
    buttons: {
      Ok: function () {
        $('#dialog').dialog('close');
        $('#game_text_input').blur();
      }
    }
  });
  $('#dialog').dialog('open');
  $('#game_text_input').blur();
  $('#dialog').css('max-height', '500px');
}

// ---------------------------------------------------------------------------
// set_default_mapview_active
// ---------------------------------------------------------------------------

/**
 * Resets the UI to the default map view state.
 */
export function setDefaultMapviewActive(): void {
  const $ = _w.$;

  if (_w.renderer === RENDERER_2DCANVAS && _w.mapview_canvas) {
    __w.mapview_canvas_ctx = _w.mapview_canvas.getContext('2d');
    if (__w.mapview_canvas_ctx) __w.mapview_canvas_ctx.font = _w.canvas_text_font;
  }

  const active_tab = $('#tabs').tabs('option', 'active');
  if (active_tab === 4) {
    // cities dialog is active — don't switch away
    return;
  }

  if (unitpanel_active) {
    update_active_units_dialog();
  }

  if (chatbox_active) {
    $('#game_chatbox_panel').parent().show();
    if (current_message_dialog_state === 'minimized') {
      $('#game_chatbox_panel').dialogExtend('minimize');
    }
  }

  $('#tabs').tabs('option', 'active', 0);
  $('#tabs-map').height('auto');
  _w.tech_dialog_active   = false;
  setAllowRightClick(false);
  setKeyboardInput(true);

  $('#freeciv_custom_scrollbar_div').mCustomScrollbar('scrollTo', 'bottom', { scrollInertia: 0 });

  if (!is_small_screen()) {
    $('#game_overview_panel').parent().show();
    $('.overview_dialog').position({
      my: 'left bottom',
      at: 'left bottom',
      of: window,
      within: $('#game_page')
    });
    if (overview_current_state === 'minimized') {
      $('#game_overview_panel').dialogExtend('minimize');
    }
  }

  mark_all_dirty();
}

// ---------------------------------------------------------------------------
// Expose to legacy JS
// ---------------------------------------------------------------------------

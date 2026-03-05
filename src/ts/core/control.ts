/**
 * Control barrel — re-exports all sub-modules for backward compatibility.
 *
 * This file was formerly 3,384 lines. It has been split into:
 *   - control/controlState.ts  — shared mutable state
 *   - control/actionSelection.ts — action selection / server queries
 *   - control/chat.ts           — chat message handling
 *   - control/keyboard.ts       — keyboard event handling
 *   - control/mapClick.ts       — map click, goto, tile popup
 *   - control/mouse.ts          — mouse / touch events
 *   - control/unitCommands.ts   — key_unit_* and request_* functions
 *   - control/unitFocus.ts      — unit focus management
 *
 * Only control_init() remains here as it wires up jQuery event handlers
 * that reference functions from multiple sub-modules.
 */

// Re-export everything from sub-modules so that existing imports
// from '../core/control' continue to work unchanged.
export * from './control/controlState';
export * from './control/actionSelection';
export * from './control/chat';
export * from './control/keyboard';
export * from './control/mapClick';
export * from './control/mouse';
export * from './control/unitCommands';
export * from './control/unitFocus';

// ---------------------------------------------------------------------------
// Imports needed only for control_init()
// ---------------------------------------------------------------------------
import { network_stop } from '../net/connection';
import { isTouchDevice as is_touch_device } from '../utils/helpers';
import { update_city_screen } from '../ui/cityDialog';
import { update_tech_screen } from '../ui/techDialog';
import { init_civ_dialog } from '../ui/governmentDialog';
import { init_options_dialog } from '../ui/options';
import { show_help } from '../ui/helpdata';
import { show_intelligence_report_dialog } from '../ui/intelDialog';
import {
  updateNationScreen as update_nation_screen,
  showSendPrivateMessageDialog as show_send_private_message_dialog,
  nationMeetClicked as nation_meet_clicked,
  centerOnPlayer as center_on_player,
  cancelTreatyClicked as cancel_treaty_clicked,
  withdrawVisionClicked as withdraw_vision_clicked,
  takePlayerClicked as take_player_clicked,
  toggleAiClicked as toggle_ai_clicked,
  handleNationTableSelect as handle_nation_table_select,
} from '../data/nation';
import { overview_clicked } from '../core/overview';
import { mapview_window_resized } from '../renderer/mapview';
import { orientation_changed } from '../utils/mobile';
import { tech_mapview_mouse_click } from '../ui/techDialog';
import { mapctrl_init_2d } from '../renderer/mapctrl';

// Sub-module imports used in control_init
import { setKeyboardInput, setResizeEnabled, setUrgentFocusQueue } from './control/controlState';
import { global_keyboard_listener, handle_context_menu_callback } from './control/keyboard';
import { chat_context_change } from './control/chat';
import { check_text_input } from './control/chat';
import { send_end_turn } from './control/mapClick';
import { update_unit_order_commands } from './control/unitFocus';
import * as S from './control/controlState';

import { RENDERER_2DCANVAS } from './constants';

// ---------------------------------------------------------------------------
// Helper functions used only in control_init
// ---------------------------------------------------------------------------
function set_default_mapview_active(): void {
  setKeyboardInput(true);
}

function set_default_mapview_inactive(): void {
  setKeyboardInput(true);
}

// ---------------------------------------------------------------------------
// control_init — the main initialization entry point
// ---------------------------------------------------------------------------
export function control_init(): void {
  setUrgentFocusQueue([]);

  mapctrl_init_2d();

  document.addEventListener('keydown', global_keyboard_listener);
  window.addEventListener('resize', mapview_window_resized);
  window.addEventListener('orientationchange', orientation_changed);
  window.addEventListener('resize', orientation_changed);

  document.getElementById('turn_done_button')?.addEventListener('click', send_end_turn);

  document.getElementById('freeciv_logo')?.addEventListener('click', function(event: Event) {
    window.open('/', '_new');
  });


  const gameTextInput = document.getElementById('game_text_input');
  gameTextInput?.addEventListener('keydown', function(event: any) {
    return check_text_input(event, gameTextInput);
  });
  gameTextInput?.addEventListener('focus', function(event: any) {
    setKeyboardInput(false);
    setResizeEnabled(false);
  });

  gameTextInput?.addEventListener('blur', function(event: any) {
    setKeyboardInput(true);
    setResizeEnabled(true);
  });

  document.getElementById('chat_direction')?.addEventListener('click', function(event: any) {
    chat_context_change();
  });

  const pregameTextInput = document.getElementById('pregame_text_input') as HTMLInputElement | null;
  pregameTextInput?.addEventListener('keydown', function(event: any) {
    return check_text_input(event, pregameTextInput);
  });

  pregameTextInput?.addEventListener('blur', function(event: any) {
    setKeyboardInput(true);
    if (pregameTextInput.value == '') {
      pregameTextInput.value = '>';
    }
  });

  pregameTextInput?.addEventListener('focus', function(event: any) {
    setKeyboardInput(false);
    if (pregameTextInput.value == '>') pregameTextInput.value = '';
  });


  document.getElementById('tech_canvas')?.addEventListener('click', function(event: any) {
    tech_mapview_mouse_click(event);
  });

  /* disable text-selection, as this gives wrong mouse cursor
   * during drag to goto units. */
  document.onselectstart = function() { return false; };

  /* disable right clicks. */
  window.addEventListener('contextmenu', function(e: MouseEvent) {
    if (e.target != null && ((e.target as HTMLElement).id == 'game_text_input' || (e.target as HTMLElement).id == 'overview_map' || ((e.target as HTMLElement).parentElement != null && (e.target as HTMLElement).parentElement!.id == 'game_message_area'))) return;
    if (!S.allow_right_click) e.preventDefault();
  }, false);

  const context_options: any = {
    selector: (RENDERER_2DCANVAS) ? '#canvas' : '#canvas_div',
    zIndex: 5000,
    autoHide: true,
    callback: function(key: string, options: any) {
      handle_context_menu_callback(key);
    },
    build: function($trigger: any, e: Event) {
      if (!S.context_menu_active) {
        S.setContextMenuActive(true);
        return false;
      }
      const unit_actions = update_unit_order_commands();
      return {
        callback: function(key: string, options: any) {
          handle_context_menu_callback(key);
        },
        items: unit_actions
      };
    }
  };

  if (!is_touch_device()) {
    context_options['position'] = function(opt: any, x: number, y: number) {
      if (is_touch_device()) return;
      const canvasDivEl = document.getElementById('canvas_div');
      const canvasEl = document.getElementById('canvas');
      let new_top = S.mouse_y + (canvasDivEl ? canvasDivEl.getBoundingClientRect().top + window.scrollY : 0);
      if (RENDERER_2DCANVAS) new_top = S.mouse_y + (canvasEl ? canvasEl.getBoundingClientRect().top + window.scrollY : 0);
      opt.$menu.css({ top: new_top, left: S.mouse_x });
    };
  }

  (window as any).jQuery?.contextMenu?.(context_options);

  window.addEventListener('unload', function() {
    network_stop();
  });

  /* Click callbacks for main tabs. */
  document.getElementById('map_tab')?.addEventListener('click', function(event: any) {
    setTimeout(set_default_mapview_active, 5);
  });


  document.getElementById('civ_tab')?.addEventListener('click', function(event: any) {
    set_default_mapview_inactive();
    init_civ_dialog();
  });

  document.getElementById('tech_tab')?.addEventListener('click', function(event: any) {
    set_default_mapview_inactive();
    update_tech_screen();
  });

  document.getElementById('players_tab')?.addEventListener('click', function(event: any) {
    set_default_mapview_inactive();
    update_nation_screen();
  });

  document.getElementById('cities_tab')?.addEventListener('click', function(event: any) {
    set_default_mapview_inactive();
    update_city_screen();
  });

  document.getElementById('opt_tab')?.addEventListener('click', function(event: any) {
    const tabsHel = document.getElementById('tabs-hel');
    if (tabsHel) tabsHel.style.display = 'none';
    init_options_dialog();
    set_default_mapview_inactive();
  });

  document.getElementById('chat_tab')?.addEventListener('click', function(event: any) {
    set_default_mapview_inactive();
    const tabsChat = document.getElementById('tabs-chat');
    if (tabsChat) tabsChat.style.display = '';
  });


  document.getElementById('hel_tab')?.addEventListener('click', function(event: any) {
    set_default_mapview_inactive();
    show_help();
  });

  const overviewMap = document.getElementById('overview_map');
  overviewMap?.addEventListener('click', function(e: any) {
    const rect = overviewMap.getBoundingClientRect();
    const x = e.pageX - (rect.left + window.scrollX);
    const y = e.pageY - (rect.top + window.scrollY);
    overview_clicked(x, y);
  });

  document.getElementById('send_message_button')?.addEventListener('click', function(e: any) {
    show_send_private_message_dialog();
  });

  document.getElementById('intelligence_report_button')?.addEventListener('click', function(e: any) {
    show_intelligence_report_dialog();
  });

  document.getElementById('meet_player_button')?.addEventListener('click', nation_meet_clicked);
  document.getElementById('view_player_button')?.addEventListener('click', center_on_player);
  document.getElementById('cancel_treaty_button')?.addEventListener('click', cancel_treaty_clicked);
  document.getElementById('withdraw_vision_button')?.addEventListener('click', withdraw_vision_clicked);
  document.getElementById('take_player_button')?.addEventListener('click', take_player_clicked);
  document.getElementById('toggle_ai_button')?.addEventListener('click', toggle_ai_clicked);

  const nationsList = document.getElementById('nations_list');
  nationsList?.addEventListener('click', function(e: any) {
    const row = (e.target as HTMLElement).closest('tbody tr');
    if (row) handle_nation_table_select.call(row, e);
  });
}

/**
 * Civ client initialisation — migrated from civclient.js (Phase 9.3).
 *
 * Covers all 7 functions in civclient.js:
 *   civclient_init, init_common_intro_dialog, close_dialog_message,
 *   closing_dialog_message, show_dialog_message, show_auth_dialog,
 *   switch_renderer.
 *
 * Global state variables declared in civclient.js (client, client_frozen,
 * phase_start_time, debug_active, autostart, username, fc_seedrandom,
 * game_type, music_list, audio, audio_enabled, last_turn_change_time,
 * turn_change_elapsed, seconds_to_phasedone, seconds_to_phasedone_sync,
 * dialog_close_trigger, dialog_message_close_task, RENDERER_2DCANVAS,
 * renderer) remain as legacy globals while civclient.js
 * is still loaded. Guards below initialise them once civclient.js is removed.
 */

import { RENDERER_2DCANVAS } from '../core/constants';
import { redraw_overview } from '../core/overview';
import { control_init } from '../core/control';
import { game_init, update_game_status_panel } from '../data/game';
import { init_mapview, is_small_screen } from '../renderer/mapview';
import { send_request } from '../net/connection';
import { packet_authentication_reply } from '../net/packetConstants';
import { showMessageDialog, closeMessageDialog } from '../components/Dialogs/MessageDialog';
import { showAuthDialog as showAuthDialogPreact } from '../components/Dialogs/AuthDialog';
import { showIntroDialog } from '../components/Dialogs/IntroDialog';

declare const $: any;

// ---------------------------------------------------------------------------
// Global state guards (active once civclient.js is deleted)
// ---------------------------------------------------------------------------
if ((window as any).client === undefined || Object.keys((window as any).client).length === 0) {
  // Only set if truly absent — civclient.js sets this to {}
  if ((window as any).client === undefined) (window as any).client = {};
}
if ((window as any).client_frozen === undefined)          (window as any).client_frozen = false;
if ((window as any).phase_start_time === undefined)       (window as any).phase_start_time = 0;
if ((window as any).debug_active === undefined)           (window as any).debug_active = false;
if ((window as any).autostart === undefined)              (window as any).autostart = false;
if ((window as any).username === undefined)               (window as any).username = null;
if ((window as any).fc_seedrandom === undefined)          (window as any).fc_seedrandom = null;
if ((window as any).game_type === undefined)              (window as any).game_type = '';
if ((window as any).audio === undefined)                  (window as any).audio = null;
if ((window as any).audio_enabled === undefined)          (window as any).audio_enabled = false;
if ((window as any).last_turn_change_time === undefined)  (window as any).last_turn_change_time = 0;
if ((window as any).turn_change_elapsed === undefined)    (window as any).turn_change_elapsed = 0;
if ((window as any).seconds_to_phasedone === undefined)   (window as any).seconds_to_phasedone = 0;
if ((window as any).seconds_to_phasedone_sync === undefined) (window as any).seconds_to_phasedone_sync = 0;
if ((window as any).dialog_close_trigger === undefined)   (window as any).dialog_close_trigger = '';
if ((window as any).dialog_message_close_task === undefined) (window as any).dialog_message_close_task = undefined;
if ((window as any).RENDERER_2DCANVAS === undefined)      (window as any).RENDERER_2DCANVAS = RENDERER_2DCANVAS;
if ((window as any).renderer === undefined)               (window as any).renderer = RENDERER_2DCANVAS;
if (!(window as any).music_list) {
  (window as any).music_list = [
    'battle-epic', 'battle2', 'battle3', 'battle4',
    'battle5', 'battle6', 'battle7', 'battle8'
  ];
}

// ---------------------------------------------------------------------------
// civclient_init
// ---------------------------------------------------------------------------

/**
 * Main client initialisation — called from index.html $(document).ready.
 */
export function civClientInit(): void {
  $.blockUI.defaults['css']['backgroundColor'] = '#222';
  $.blockUI.defaults['css']['color'] = '#fff';
  $.blockUI.defaults['theme'] = true;

  // Always observer mode
  (window as any).observing = true;
  (window as any).game_type = 'observe';
  $('#civ_tab').remove();
  $('#cities_tab').remove();
  $('#pregame_buttons').remove();
  $('#game_unit_orders_default').remove();
  $('#civ_dialog').remove();

  // Initialise seeded random number generator
  (window as any).fc_seedrandom = new ((window as any).Math.seedrandom || (window as any).seedrandom)('xbworld');

  if (window.requestAnimationFrame == null) {
    if (typeof (window as any).swal === 'function') (window as any).swal('Please upgrade your browser.');
    return;
  }


  init_mapview();
  game_init();
  $('#tabs').tabs({ heightStyle: 'fill' });
  control_init();
  (window as any).timeoutTimerId = setInterval(function () {
    if (typeof (window as any).update_timeout === 'function') (window as any).update_timeout();
  }, 1000);
  update_game_status_panel();
  (window as any).statusTimerId = setInterval(function () {
    update_game_status_panel();
  }, 6000);

  if ((window as any).overviewTimerId === -1) {
    (window as any).OVERVIEW_REFRESH = 6000;
    (window as any).overviewTimerId = setInterval(function () {
      redraw_overview();
    }, (window as any).OVERVIEW_REFRESH);
  }

  if (typeof (window as any).motd_init === 'function') (window as any).motd_init();

  // IE polyfill for Array.indexOf (kept for historical compatibility)
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj: unknown): number {
      for (let i = 0; i < this.length; i++) {
        if (this[i] === obj) return i;
      }
      return -1;
    };
  }

  $('#tabs').css('height', $(window).height());
  $('#tabs-map').height('auto');
  $('#tabs-civ').height('auto');
  $('#tabs-tec').height('auto');
  $('#tabs-nat').height('auto');
  $('#tabs-cities').height('auto');
  $('#tabs-opt').height('auto');
  $('#tabs-hel').height('auto');
  $('.button').button();

  (window as any).sounds_enabled = (window as any).simpleStorage.get('sndFX');
  if ((window as any).sounds_enabled == null) {
    // Default to true, except when known to be problematic.
    (window as any).sounds_enabled = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') ? false : true;
  }

  /* Initialise audio.js music player */
  if ((window as any).audiojs) {
    (window as any).audiojs.events.ready(function () {
      const as = (window as any).audiojs.createAll({
        trackEnded: function () {
          const list: string[] = (window as any).music_list;
          const track = list[Math.floor(Math.random() * list.length)];
          const ext = (typeof (window as any).supports_mp3 === 'function' && !(window as any).supports_mp3()) ? '.ogg' : '.mp3';
          if ((window as any).audio) {
            (window as any).audio.load('/music/' + track + ext);
            (window as any).audio.play();
          }
        }
      });
      (window as any).audio = as[0];
    });
  }

  initCommonIntroDialog();
  if (typeof (window as any).setup_window_size === 'function') (window as any).setup_window_size();
}

// ---------------------------------------------------------------------------
// init_common_intro_dialog
// ---------------------------------------------------------------------------

/**
 * Shows the observer intro dialog and starts connection.
 */
export function initCommonIntroDialog(): void {
  // Set default username and auto-connect
  const saved = localStorage.getItem('username');
  (window as any).username = saved || 'Observer';
  // Show intro dialog (non-blocking)
  showIntroDialog('Welcome to XBWorld', 'You are joining the game as an observer. Please enter your name:');
  // Auto-connect immediately (dialog can still update username)
  if (typeof (window as any).network_init === 'function') {
    (window as any).network_init();
  }
}

// ---------------------------------------------------------------------------
// close_dialog_message / closing_dialog_message
// ---------------------------------------------------------------------------

/**
 * Closes the generic message dialog.
 */
export function closeDialogMessage(): void {
  closeMessageDialog();
}

/**
 * Cleanup callback when the generic message dialog is closing.
 */
export function closingDialogMessage(): void {
  closeMessageDialog();
}

// ---------------------------------------------------------------------------
// show_dialog_message
// ---------------------------------------------------------------------------

/**
 * Shows a generic message dialog with auto-close after 24 seconds.
 */
export function showDialogMessage(title: string, message: string): void {
  showMessageDialog(title, message);
}

// ---------------------------------------------------------------------------
// show_auth_dialog
// ---------------------------------------------------------------------------

/**
 * Shows the authentication/password dialog for private servers.
 */
export function showAuthDialog(packet: any): void {
  showAuthDialogPreact(packet);
}

// ---------------------------------------------------------------------------
// switch_renderer
// ---------------------------------------------------------------------------

/**
 * Only 2D renderer is supported. This is a no-op stub.
 */
export function switchRenderer(): void {
  // 3D WebGL renderer has been removed; only 2D canvas is supported.
}

// ---------------------------------------------------------------------------
// Auto-init: register $(document).ready so civClientInit runs on page load.
//
// webclient.min.js registers $(document).ready(civclient_init) but that fires
// before this ts-bundle (type="module", deferred) overrides window.civclient_init.
// By registering our own handler here we ensure the TS version always runs.
// The guard prevents double-init if webclient.min.js's old version already ran
// and set civclient_state > 0.
// ---------------------------------------------------------------------------
$(function () {
  if (!(window as any).civclient_state || (window as any).civclient_state === 0) {
    civClientInit();
  }
});

// ---------------------------------------------------------------------------
// Expose to legacy JS
// ---------------------------------------------------------------------------

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

import '../utils/seedrandom';  // Must be before civClientInit uses Math.seedrandom
import { initTabs } from '../ui/tabs';
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
  const _w = window as any;
  // Always observer mode
  _w.observing = true;
  _w.game_type = 'observe';
  // Remove observer-irrelevant UI elements
  for (const id of ['civ_tab', 'cities_tab', 'pregame_buttons', 'game_unit_orders_default', 'civ_dialog']) {
    document.getElementById(id)?.remove();
  }

  // Initialise seeded random number generator
  _w.fc_seedrandom = new (_w.Math.seedrandom || _w.seedrandom)('xbworld');

  if (window.requestAnimationFrame == null) {
    if (typeof _w.swal === 'function') _w.swal('Please upgrade your browser.');
    return;
  }

  init_mapview();
  game_init();
  // Tabs initialization (vanilla JS replacement for jQuery UI tabs)
  initTabs('#tabs', { heightStyle: 'fill' });
  control_init();
  _w.timeoutTimerId = setInterval(function () {
    if (typeof _w.update_timeout === 'function') _w.update_timeout();
  }, 1000);
  update_game_status_panel();
  _w.statusTimerId = setInterval(function () {
    update_game_status_panel();
  }, 6000);

  if (_w.overviewTimerId == null || _w.overviewTimerId === -1) {
    _w.OVERVIEW_REFRESH = 6000;
    _w.overviewTimerId = setInterval(function () {
      redraw_overview();
    }, _w.OVERVIEW_REFRESH);
  }

  if (typeof _w.motd_init === 'function') _w.motd_init();

  // Set tab container and tab panel heights
  const tabs = document.getElementById('tabs');
  if (tabs) tabs.style.height = window.innerHeight + 'px';
  for (const id of ['tabs-map', 'tabs-civ', 'tabs-tec', 'tabs-nat', 'tabs-cities', 'tabs-opt', 'tabs-hel']) {
    const el = document.getElementById(id);
    if (el) el.style.height = 'auto';
  }
  // jQuery UI .button() styling no longer needed — CSS handles it

  _w.sounds_enabled = JSON.parse(localStorage.getItem('sndFX') ?? 'null');
  if (_w.sounds_enabled == null) {
    _w.sounds_enabled = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') ? false : true;
  }

  /* Initialise audio.js music player */
  if (_w.audiojs) {
    _w.audiojs.events.ready(function () {
      const as = _w.audiojs.createAll({
        trackEnded: function () {
          const list: string[] = _w.music_list;
          const track = list[Math.floor(Math.random() * list.length)];
          const ext = (typeof _w.supports_mp3 === 'function' && !_w.supports_mp3()) ? '.ogg' : '.mp3';
          if (_w.audio) {
            _w.audio.load('/music/' + track + ext);
            _w.audio.play();
          }
        }
      });
      _w.audio = as[0];
    });
  }

  initCommonIntroDialog();
  if (typeof _w.setup_window_size === 'function') _w.setup_window_size();
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
  // Auto-connect immediately (dialog can still update username).
  // Use dynamic import to avoid circular dependency (connection.ts imports from civClient.ts).
  // Use dynamic import to avoid circular dependency (connection.ts ↔ civClient.ts)
  import('../net/connection').then(m => m.network_init());
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
// Auto-init on DOMContentLoaded (replaces jQuery $(document).ready)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!(window as any).civclient_state || (window as any).civclient_state === 0) {
      civClientInit();
    }
  });
} else {
  // DOM already loaded (module scripts are deferred)
  if (!(window as any).civclient_state || (window as any).civclient_state === 0) {
    civClientInit();
  }
}

// ---------------------------------------------------------------------------
// Expose to legacy JS
// ---------------------------------------------------------------------------

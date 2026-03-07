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

import { seedrandom } from '../utils/seedrandom';
import { initTabs } from '../ui/tabs';
import { swal } from '../components/Dialogs/SwalDialog';
import { RENDERER_2DCANVAS, RENDERER_PIXI } from '../core/constants';
import { redraw_overview } from '../core/overview';
import { control_init } from '../core/control';
import { game_init, update_game_status_panel } from '../data/game';
import { init_mapview, is_small_screen } from '../renderer/mapview';
import { PixiRenderer } from '../renderer/PixiRenderer';
import { send_request } from '../net/connection';
import { packet_authentication_reply } from '../net/packetConstants';
import { showMessageDialog, closeMessageDialog } from '../components/Dialogs/MessageDialog';
import { showAuthDialog as showAuthDialogPreact } from '../components/Dialogs/AuthDialog';
import { showIntroDialog } from '../components/Dialogs/IntroDialog';
import { store } from '../data/store';
import { setupWindowSize } from './clientMain';
import { music_list, audio, setAudio, supports_mp3 } from '../audio/audioState';

// ---------------------------------------------------------------------------
// Global state guards (active once civclient.js is deleted)
// ---------------------------------------------------------------------------
// Select renderer: ?renderer=pixi activates PixiJS/WebGL; default is 2D canvas.
const _rendererParam = new URLSearchParams(window.location.search).get('renderer');
store.renderer = _rendererParam === 'pixi' ? RENDERER_PIXI : RENDERER_2DCANVAS;

// music_list is now initialised in audio/audioState.ts

// ---------------------------------------------------------------------------
// civclient_init
// ---------------------------------------------------------------------------

/**
 * Main client initialisation — called from index.html $(document).ready.
 */
export function civClientInit(): void {
  // Always observer mode
  store.observing = true;
  store.gameType = 'observe';
  // Remove observer-irrelevant UI elements (both tab buttons and their panels)
  for (const id of ['civ_tab', 'cities_tab', 'opt_tab', 'hel_tab', 'pregame_buttons', 'game_unit_orders_default', 'civ_dialog', 'game_unit_panel', 'tabs-cities', 'tabs-opt', 'tabs-hel', 'tabs-civ']) {
    document.getElementById(id)?.remove();
  }

  // Initialise seeded random number generator
  store.fcSeedrandom = seedrandom('xbworld');

  if (window.requestAnimationFrame == null) {
    swal('Please upgrade your browser.');
    return;
  }

  if (store.renderer === RENDERER_PIXI) {
    const container = document.getElementById('canvas_div') ?? document.body;
    const pixi = new PixiRenderer({ container });
    pixi.init().then(() => {
      (store as Record<string, unknown>)['pixiRenderer'] = pixi;
    }).catch(e => console.error('PixiRenderer init failed:', e));
  } else {
    init_mapview();
  }
  game_init();
  // Tabs initialization (vanilla JS replacement for jQuery UI tabs)
  initTabs('#tabs', { heightStyle: 'fill' });
  control_init();
  store.timeoutTimerId = setInterval(function () {
    // update_timeout is an optional legacy function — no-op if not defined
  }, 1000);
  update_game_status_panel();
  store.statusTimerId = setInterval(function () {
    update_game_status_panel();
  }, 6000);

  if (store.overviewTimerId == null) {
    store.overviewTimerId = setInterval(function () {
      redraw_overview();
    }, 6000);
  }

  // Set tab container and tab panel heights
  const tabs = document.getElementById('tabs');
  if (tabs) tabs.style.height = window.innerHeight + 'px';
  for (const id of ['tabs-map', 'tabs-civ', 'tabs-tec', 'tabs-nat', 'tabs-cities', 'tabs-opt', 'tabs-hel']) {
    const el = document.getElementById(id);
    if (el) el.style.height = 'auto';
  }
  // jQuery UI .button() styling no longer needed — CSS handles it

  const savedSounds = JSON.parse(localStorage.getItem('sndFX') ?? 'null');
  if (savedSounds != null) {
    store.soundsEnabled = savedSounds;
  } else {
    store.soundsEnabled = !(navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'));
  }

  /* Initialise audio.js music player */
  if (typeof audiojs !== 'undefined') {
    audiojs.events.ready(function () {
      const as = audiojs.createAll({
        trackEnded: function () {
          const track = music_list[Math.floor(Math.random() * music_list.length)];
          const ext = supports_mp3() ? '.mp3' : '.ogg';
          if (audio) {
            audio.load('/music/' + track + ext);
            audio.play();
          }
        }
      });
      setAudio(as[0]);
    });
  }

  initCommonIntroDialog();
  setupWindowSize();
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
  store.username = saved || 'Observer';
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
export function showAuthDialog(packet: { message: string; [key: string]: unknown }): void {
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
// Skip in test environment to prevent side-effects during module import.
if (!(globalThis as unknown as Record<string, unknown>).__VITEST__) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!store.civclientState) {
        civClientInit();
      }
    });
  } else {
    // DOM already loaded (module scripts are deferred)
    if (!store.civclientState) {
      civClientInit();
    }
  }
}

// ---------------------------------------------------------------------------
// Expose to legacy JS
// ---------------------------------------------------------------------------

/**
 * Core client functions — migrated from civclient.js.
 *
 * Functions with heavy jQuery UI dependencies (show_dialog_message,
 * show_auth_dialog, init_common_intro_dialog, civclient_init,
 * switch_renderer) remain in the legacy JS for now.
 *
 * Migrated functions:
 *   - is_longturn()
 *   - is_server()
 *   - set_phase_start()
 *   - request_observe_game()
 *   - send_surrender_game()
 *   - get_invalid_username_reason()
 *   - validate_username()           [Phase 6]
 *   - is_username_valid_show()      [Phase 6]
 *   - surrender_game()              [Phase 6]
 *   - show_fullscreen_window()      [Phase 6]
 *   - motd_init()                   [Phase 6]
 */

import { send_message } from '../net/connection';
import { store } from '../data/store';
import { PlayerFlag } from '../data/player';
import { BitVector } from '../utils/bitvector';

// ---------------------------------------------------------------------------
// Helpers — read legacy globals
// ---------------------------------------------------------------------------
const win = window as unknown as Record<string, unknown>;

// ---------------------------------------------------------------------------
// Game type queries
// ---------------------------------------------------------------------------

/**
 * Returns TRUE if this is a LongTurn (one-turn-per-day) game.
 */
export function isLongturn(): boolean {
  return win.game_type === 'longturn';
}

/**
 * Webclient is always client, never server.
 */
export function isServer(): boolean {
  return false;
}

// ---------------------------------------------------------------------------
// Phase timing
// ---------------------------------------------------------------------------

/**
 * Records the start time of the current phase.
 */
export function setPhaseStart(): void {
  win.phase_start_time = Date.now();
}

// ---------------------------------------------------------------------------
// Game actions
// ---------------------------------------------------------------------------

// Track whether we've already sent an observe/take command this session.
let _observeSent = false;

/**
 * Sends a request to observe the current game.
 * Prefers /take <AI_player> for full map data.
 * Falls back to /observe <firstPlayer> to get tile data via player observation.
 * Pure /observe (no args) does not receive TILE_INFO from the Freeciv server.
 */
export function requestObserveGame(): void {
  if (_observeSent) return;
  _observeSent = true;

  const tryTake = () => {
    const players = Object.values(store.players);
    const aiPlayer = players.find(p => {
      const flags = p['flags'];
      return flags instanceof BitVector && flags.isSet(PlayerFlag.PLRF_AI);
    });
    if (aiPlayer && aiPlayer['name']) {
      console.log('[xbw] requestObserveGame: /take', aiPlayer['name']);
      send_message('/take ' + (aiPlayer['name'] as string));
    } else {
      // Observe first available player to get their tile data.
      // Pure /observe (no args) sends no TILE_INFO; /observe <name> does.
      const firstPlayer = players[0];
      if (firstPlayer && firstPlayer['name']) {
        console.log('[xbw] requestObserveGame: /observe', firstPlayer['name']);
        send_message('/observe ' + (firstPlayer['name'] as string));
      } else {
        console.log('[xbw] requestObserveGame: no players, using bare /observe');
        send_message('/observe ');
      }
    }
  };

  if (Object.keys(store.players).length > 0) {
    tryTake();
  } else {
    // Players not yet received — wait briefly then try
    setTimeout(tryTake, 500);
  }
}

/**
 * Sends a surrender command if the player is not an observer
 * and the WebSocket is open.
 */
export function sendSurrenderGame(): void {
  const isObserver = typeof win.client_is_observer === 'function' ? (win.client_is_observer as () => boolean)() : true;
  const ws = win.ws as WebSocket | null;

  if (!isObserver && ws != null && ws.readyState === WebSocket.OPEN) {
    send_message('/surrender ');
  }
}

/**
 * Full surrender_game() — sends surrender command and switches UI
 * back to the map tab. Migrated from civclient.js.
 */
export function surrenderGame(): void {
  sendSurrenderGame();

  // Switch UI back to map tab
  document.getElementById('tabs-map')?.classList.remove('ui-tabs-hide');
  document.getElementById('tabs-opt')?.classList.add('ui-tabs-hide');
  const mapTab = document.getElementById('map_tab');
  if (mapTab) {
    mapTab.classList.add('ui-state-active', 'ui-tabs-selected');
    mapTab.classList.remove('ui-state-default');
  }
}

// ---------------------------------------------------------------------------
// Username validation
// ---------------------------------------------------------------------------

/**
 * Returns the reason a username is invalid, or null if valid.
 * Migrated from player.js / get_invalid_username_reason().
 *
 * NOTE: The legacy `check_text_with_banlist_exact(name)` returns TRUE
 * when the name is VALID (not banned), and FALSE when banned.
 */
export function getInvalidUsernameReason(name: string | null): string | null {
  if (name == null || name.length === 0) {
    return 'empty';
  }
  if (name.length <= 2) {
    return 'too short';
  }
  if (name.length >= 32) {
    return 'too long';
  }
  const lower = name.toLowerCase();
  // Must start with a letter, then letters and numbers only
  if (!/^[a-z][a-z0-9]*$/g.test(lower)) {
    return 'invalid: only English letters and numbers are allowed, and must start with a letter';
  }
  // check_text_with_banlist_exact returns TRUE = valid, FALSE = banned
  if (
    typeof win.check_text_with_banlist_exact === 'function' &&
    !(win.check_text_with_banlist_exact as (s: string) => boolean)(lower)
  ) {
    return 'banned';
  }
  return null;
}

/**
 * Validates the username from the #username_req input field.
 * Stores valid username in localStorage.
 * Returns true if valid, false otherwise.
 *
 * Migrated from civclient.js validate_username().
 */
export function validateUsername(): boolean {
  const usernameVal = (document.getElementById('username_req') as HTMLInputElement)?.value ?? '';
  win.username = usernameVal;

  if (!isUsernameValidShow(usernameVal)) {
    return false;
  }

  localStorage.setItem('username', usernameVal);

  return true;
}

/**
 * Checks if the username is valid and shows the reason if it is not.
 * Returns whether the username is valid.
 *
 * Migrated from civclient.js is_username_valid_show().
 */
export function isUsernameValidShow(username: string | null): boolean {
  const reason = getInvalidUsernameReason(username);
  if (reason != null) {
    const valEl = document.getElementById('username_validation_result');
    if (valEl) {
      valEl.textContent = "The username '" + (username ?? '') + "' is " + reason + '.';
      valEl.style.display = '';
    }
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Fullscreen
// ---------------------------------------------------------------------------

/**
 * Toggles fullscreen mode using BigScreen library, or shows a dialog
 * message as fallback.
 *
 * Migrated from civclient.js show_fullscreen_window().
 */
export function showFullscreenWindow(): void {
  const bigScreen = win.BigScreen as Record<string, unknown> | undefined;
  if (bigScreen && bigScreen.enabled) {
    (bigScreen.toggle as () => void)();
  } else if (typeof win.show_dialog_message === 'function') {
    (win.show_dialog_message as (title: string, msg: string) => void)('Fullscreen', 'Press F11 for fullscreen mode.');
  }
}

// ---------------------------------------------------------------------------
// MOTD (Message of the Day)
// ---------------------------------------------------------------------------

/**
 * Fetches and executes the /motd.js script, then schedules itself
 * to run again every 30 minutes.
 *
 * Migrated from civclient.js motd_init().
 */
export function motdInit(): void {
  const script = document.createElement('script');
  script.src = '/motd.js';
  document.head.appendChild(script);
  setTimeout(motdInit, 1000 * 60 * 30);
}

// ---------------------------------------------------------------------------
// Expose to legacy JS
// ---------------------------------------------------------------------------
// Phase 6 additions

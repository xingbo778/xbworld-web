import { clientState as client_state, C_S_PREPARING } from '../client/clientState';
import { setupWindowSize as setup_window_size } from '../client/clientMain';
import { store } from '../data/store';
import { pregameRefresh } from '../data/signals';

const client = store.client;
export let update_player_info_pregame_queued: boolean = false;

/**
 * Sanitize a username string for safe display.
 */
export function sanitize_username(un: string): string {
  return (un.trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#96;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;'));
}

/**
 * Refresh pregame scenario info via Preact signal.
 */
export function update_game_info_pregame(): void {
  if (C_S_PREPARING != client_state()) return;
  mountAndRefresh();
  setup_window_size();
}

/**
 * Throttled wrapper for update_player_info_pregame_real.
 */
export function update_player_info_pregame(): void {
  if (update_player_info_pregame_queued) return;
  setTimeout(update_player_info_pregame_real, 1000);
  update_player_info_pregame_queued = true;
}

/**
 * Refresh pregame player list via Preact signal.
 */
export function update_player_info_pregame_real(): void {
  if (C_S_PREPARING != client_state()) {
    update_player_info_pregame_queued = false;
    return;
  }
  mountAndRefresh();
  update_player_info_pregame_queued = false;
}

function mountAndRefresh(): void {
  import('../components/PregameLobby').then(({ mountPregameLobby }) => {
    mountPregameLobby();
    pregameRefresh.value++;
  });
}

/**
 * Map ruleset display name to directory name.
 */
export function ruledir_from_ruleset_name(ruleset_name: string, fall_back_dir: string): string {
  switch (ruleset_name) {
    case 'Classic ruleset':
      return 'classic';
    case 'Civ2Civ3 ruleset':
      return 'civ2civ3';
    case 'Multiplayer ruleset':
      return 'multiplayer';
    case 'Webperimental':
      return 'webperimental';
    default:
      console.log('Don\'t know the ruleset dir of "' + ruleset_name
        + '". Guessing "' + fall_back_dir + '".');
      return fall_back_dir;
  }
}

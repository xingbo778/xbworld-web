import { clientState as client_state, C_S_PREPARING } from '../client/clientState';
import { setupWindowSize as setup_window_size } from '../client/clientMain';
import { store } from '../data/store';
import { escapeHtml } from '../utils/safeHtml';

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
 * Display game/scenario info in the pregame lobby using DOM manipulation (no innerHTML).
 */
export function update_game_info_pregame(): void {
  if (C_S_PREPARING != client_state()) return;

  const pregameGameInfo = document.getElementById('pregame_game_info');
  if (!pregameGameInfo) { setup_window_size(); return; }

  // Clear existing content
  while (pregameGameInfo.firstChild) pregameGameInfo.removeChild(pregameGameInfo.firstChild);

  if (store.scenarioInfo != null && store.scenarioInfo['is_scenario']) {
    const desc = String(store.scenarioInfo['description'] || '');
    if (desc) {
      const p = document.createElement('p');
      // description may contain newlines — split on \n and insert <br> nodes
      appendTextWithBreaks(p, desc);
      pregameGameInfo.appendChild(p);
    }

    const authors = String(store.scenarioInfo['authors'] || '');
    if (authors) {
      const p = document.createElement('p');
      p.appendChild(document.createTextNode('Scenario by '));
      appendTextWithBreaks(p, authors);
      pregameGameInfo.appendChild(p);
    }

    if (store.scenarioInfo['prevent_new_cities']) {
      const p = document.createElement('p');
      p.textContent = String(store.scenarioInfo['name']) + ' forbids the founding of new cities.';
      pregameGameInfo.appendChild(p);
    }
  }

  setup_window_size();
}

/** Append text into el, splitting on \n and inserting <br> nodes. */
function appendTextWithBreaks(el: HTMLElement, text: string): void {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) el.appendChild(document.createElement('br'));
    el.appendChild(document.createTextNode(lines[i]));
  }
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
 * Render the player list in pregame lobby using DOM manipulation (no innerHTML).
 */
export function update_player_info_pregame_real(): void {
  if (C_S_PREPARING != client_state()) {
    update_player_info_pregame_queued = false;
    return;
  }

  const pregamePlayerList = document.getElementById('pregame_player_list');
  if (pregamePlayerList) {
    // Clear existing content
    while (pregamePlayerList.firstChild) pregamePlayerList.removeChild(pregamePlayerList.firstChild);

    for (const id in store.players) {
      const player = store.players[Number(id)];
      if (player == null) continue;

      const isAI = String(player['name']).indexOf('AI') !== -1;
      const iconId = isAI ? 'pregame_ai_icon' : 'pregame_player_icon';

      const plrDiv = document.createElement('div');
      plrDiv.id = 'pregame_plr_' + id;
      plrDiv.className = 'pregame_player_name';

      const iconDiv = document.createElement('div');
      iconDiv.id = iconId;
      plrDiv.appendChild(iconDiv);

      const bold = document.createElement('b');
      bold.textContent = String(player['name']);
      plrDiv.appendChild(bold);

      pregamePlayerList.appendChild(plrDiv);
    }
  }

  for (const id in store.players) {
    const player = store.players[Number(id)];
    let nation_text = '';
    const plrEl = document.getElementById('pregame_plr_' + id);
    if (player['nation'] in store.nations && store.nations[player['nation']] != null) {
      nation_text = ' - ' + (store.nations[player['nation']]['adjective'] || '');
      const flag_canvas = document.createElement('canvas');
      flag_canvas.id = 'pregame_nation_flags_' + id;
      flag_canvas.width = 29;
      flag_canvas.height = 20;
      flag_canvas.className = 'pregame_flags';
      if (plrEl) plrEl.prepend(flag_canvas);
      const flag_canvas_ctx = flag_canvas.getContext('2d');
      const tag = 'f.' + store.nations[player['nation']]['graphic_str'];
      if (store.sprites[tag] != null && flag_canvas_ctx != null) {
        flag_canvas_ctx.drawImage(store.sprites[tag], 0, 0);
      }
    }
    if (!plrEl) continue;
    if (player['is_ready'] === true) {
      plrEl.classList.add('pregame_player_ready');
      plrEl.title = 'Player ready' + nation_text;
    } else if (String(player['name']).indexOf('AI') === -1) {
      plrEl.title = 'Player not ready' + nation_text;
    } else {
      plrEl.title = 'AI Player (random nation)';
    }
    plrEl.setAttribute('name', String(player['name']));
    plrEl.setAttribute('playerid', String(player['playerno']));
  }
  // Tooltip was a jQuery UI no-op; native title attribute already set above.

  update_player_info_pregame_queued = false;
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

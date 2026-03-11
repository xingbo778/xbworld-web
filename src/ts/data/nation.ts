/**
 * Nation data module — pure data functions and constants.
 *
 * UI/DOM functions have been extracted to nationScreen.ts.
 * This file re-exports them for backward compatibility.
 */

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------
import { store } from './store';
import type { Player } from './types';
import { PlayerFlag } from './player';
import { clientIsObserver, clientPlaying } from '../client/clientState';
import { send_message } from '../net/connection';
import { escapeHtml } from '../utils/safeHtml';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
export const MAX_AI_LOVE = 1000;

// ---------------------------------------------------------------------------
// Pure data functions
// ---------------------------------------------------------------------------

/** Returns the diplstates record from the store. */
export function getDiplstates(): Record<number, number> {
  return store.diplstates;
}

/**
 * Return a text describing an AI's love for you.
 * These words are adjectives which can fit in the sentence
 * "The x are y towards us"
 */
export function loveText(love: number): string {
  if (love <= -MAX_AI_LOVE * 90 / 100) {
    return 'Genocidal';
  } else if (love <= -MAX_AI_LOVE * 70 / 100) {
    return 'Belligerent';
  } else if (love <= -MAX_AI_LOVE * 50 / 100) {
    return 'Hostile';
  } else if (love <= -MAX_AI_LOVE * 25 / 100) {
    return 'Uncooperative';
  } else if (love <= -MAX_AI_LOVE * 10 / 100) {
    return 'Uneasy';
  } else if (love <= MAX_AI_LOVE * 10 / 100) {
    return 'Neutral';
  } else if (love <= MAX_AI_LOVE * 25 / 100) {
    return 'Respectful';
  } else if (love <= MAX_AI_LOVE * 50 / 100) {
    return 'Helpful';
  } else if (love <= MAX_AI_LOVE * 70 / 100) {
    return 'Enthusiastic';
  } else if (love <= MAX_AI_LOVE * 90 / 100) {
    return 'Admiring';
  } else {
    return 'Worshipful';
  }
}

/** Returns score text for a player. */
export function getScoreText(player: Player): string | number {
  const score = player['score'] as number | undefined;
  if (score != null && score >= 0) {
    return score;
  } else {
    return '?';
  }
}

/**
 * Returns the attitude text for a player towards the current player.
 * Used in the nation table's "Attitude" column.
 */
export function colLove(pplayer: Player): string {
  if (
    clientIsObserver() ||
    store.client?.conn?.playing == null ||
    pplayer['playerno'] === clientPlaying()!['playerno'] ||
    pplayer['flags']!.isSet(PlayerFlag.PLRF_AI) === false
  ) {
    return '-';
  } else {
    return loveText(pplayer['love']![clientPlaying()!['playerno']]);
  }
}

/**
 * Issues a /take command for the given player name.
 * Replaces take_player() in nation.js.
 */
export function takePlayer(player_name: string): void {
  send_message('/take ' + player_name);
  store.observing = false;
}

/** Returns HTML table of sorted player scores for the Game Scores dialog. */
export function getPlayerScoresSummary(): string {
  const players = Object.values(store.players) as Player[];
  if (players.length === 0) return '<p>No score data available yet.</p>';

  const sorted = [...players].sort((a, b) => ((b['score'] as number) ?? 0) - ((a['score'] as number) ?? 0));
  const rows = sorted.map((p, i) => {
    const nation = store.nations[p['nation'] as number];
    const adj = nation?.['adjective'] ?? '?';
    const score = (p['score'] as number) ?? '?';
    const cities = (p['cities'] as number) ?? 0;
    const units = (p['units'] as number) ?? 0;
    return `<tr>
      <td style="padding:4px 8px;font-weight:bold">#${i + 1}</td>
      <td style="padding:4px 8px">${escapeHtml(String(p['name']))}</td>
      <td style="padding:4px 8px;color:#8b949e">${escapeHtml(String(adj))}</td>
      <td style="padding:4px 8px;text-align:right;font-weight:bold;color:#58a6ff">${score}</td>
      <td style="padding:4px 8px;text-align:right">${cities} cities</td>
    </tr>`;
  }).join('');
  return `<table style="width:100%;border-collapse:collapse">
    <thead><tr style="border-bottom:1px solid #444">
      <th style="padding:4px 8px;text-align:left">Rank</th>
      <th style="padding:4px 8px;text-align:left">Player</th>
      <th style="padding:4px 8px;text-align:left">Nation</th>
      <th style="padding:4px 8px;text-align:right">Score</th>
      <th style="padding:4px 8px;text-align:right">Cities</th>
    </tr></thead><tbody>${rows}</tbody>
  </table>`;
}

/**
 * Issues an /aitoggle command for the given player name.
 * Replaces aitoggle_player() in nation.js.
 */
export function aitogglePlayer(player_name: string): void {
  send_message('/aitoggle ' + player_name);
  store.observing = false;
}

// ---------------------------------------------------------------------------
// Re-exports from nationScreen.ts for backward compatibility
// ---------------------------------------------------------------------------
export {
  updateNationScreen,
  selectANation,
  selectNoNation,
  nationSelectPlayer,
  nationTableSelectPlayer,
  centerOnPlayer,
} from './nationScreen';

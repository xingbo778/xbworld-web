/**
 * Nation screen UI module — observer-mode, minimal.
 *
 * The player table is rendered by NationOverview (Preact component).
 * This module only handles row-selection state and the two action buttons
 * that exist in the HTML: view_player_button, meet_player_button.
 */

import { store } from './store';
import { cityTile, cityOwnerPlayerId } from './city';
import { setDefaultMapviewActive } from '../client/clientMain';
import { center_tile_mapcanvas } from '../core/control/mapClick';

// ---------------------------------------------------------------------------
// Selected player state
// ---------------------------------------------------------------------------
function getSelectedPlayer(): number {
  return store.selectedPlayer;
}
function setSelectedPlayer(v: number): void {
  store.selectedPlayer = v;
}

// ---------------------------------------------------------------------------
// Button helpers
// ---------------------------------------------------------------------------
function jqButtonEnable(id: string): void {
  const el = document.getElementById(id) as HTMLButtonElement | null;
  if (el) el.disabled = false;
}
function jqButtonDisable(id: string): void {
  const el = document.getElementById(id) as HTMLButtonElement | null;
  if (el) el.disabled = true;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Called when the Nations tab is opened.
 * The Preact NationOverview component handles the actual table display.
 */
export function updateNationScreen(): void {
  const titleEl = document.getElementById('nations_title');
  if (titleEl) titleEl.textContent = 'Nations of the World';
  selectNoNation();
}

/** Enables/disables action buttons based on the currently selected player. */
export function selectANation(): void {
  const pplayer = store.players[getSelectedPlayer()];
  if (pplayer == null) return;

  if (pplayer['is_alive']) {
    jqButtonEnable('view_player_button');
  } else {
    jqButtonDisable('view_player_button');
  }
  // meet_player_button — observer cannot initiate diplomacy
  jqButtonDisable('meet_player_button');
}

/** Clears the selection and disables all action buttons. */
export function selectNoNation(): void {
  setSelectedPlayer(-1);
  jqButtonDisable('view_player_button');
  jqButtonDisable('meet_player_button');
}

/**
 * Selects a player (called from NationOverview row clicks).
 */
export function nationSelectPlayer(player_no: number): void {
  setSelectedPlayer(player_no);
  selectANation();
}

/**
 * Switches to the nations tab and selects a player.
 * Called from the 'select-player' event delegation action.
 */
export function nationTableSelectPlayer(player_no: number): void {
  const playersTabLink = document.querySelector('#players_tab a') as HTMLElement | null;
  if (playersTabLink) playersTabLink.click();
  nationSelectPlayer(player_no);
}

/**
 * Centers the map on the selected player's first city.
 */
export function centerOnPlayer(): void {
  if (getSelectedPlayer() === -1) return;
  for (const city_id in store.cities) {
    const pcity = store.cities[city_id];
    if (cityOwnerPlayerId(pcity) === getSelectedPlayer()) {
      center_tile_mapcanvas(cityTile(pcity));
      setDefaultMapviewActive();
      return;
    }
  }
}

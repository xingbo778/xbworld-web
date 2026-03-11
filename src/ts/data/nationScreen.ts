/**
 * Nation screen UI module — observer-mode, minimal.
 *
 * The player table is rendered by NationOverview (Preact component).
 * This module only handles row-selection state.
 * Button management (View on Map, View Intel, Game Scores) is handled by
 * NationOverview's ActionBar component via the _selectedPlayerno signal.
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
// Public API
// ---------------------------------------------------------------------------

/** Resets the selected player. Called when the Nations tab is opened. */
export function selectNoNation(): void {
  setSelectedPlayer(-1);
}

/**
 * Selects a player (called from NationOverview row clicks).
 */
export function nationSelectPlayer(player_no: number): void {
  setSelectedPlayer(player_no);
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

/**
 * XBWorld — Extra data module (migrated from extra.js)
 *
 * Pure query functions for extras (roads, bases, resources, etc.).
 */

import { store } from './store';
import type { Extra, Tile, Player } from './types';
import { player_by_number } from './player';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const EXTRA_NONE = -1;
export const BASE_GUI_FORTRESS = 0;
export const BASE_GUI_AIRBASE = 1;

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Return extras type of given id.
 */
export function extraByNumber(id: number): Extra | null {
  if (id === EXTRA_NONE) {
    return null;
  }
  const rc = store.rulesControl;
  if (id >= 0 && rc && id < (rc as any)['num_extra_types']) {
    return store.extras[id];
  } else {
    console.log('extra_by_number(): Invalid extra id: ' + id);
    return null;
  }
}

/**
 * Who owns extras on tile.
 */
export function extraOwner(ptile: Tile): Player | null {
  return player_by_number(ptile['extras_owner'] as number);
}

/**
 * Is given cause one of the causes for the given extra?
 */
export function isExtraCausedBy(pextra: Extra, cause: number): boolean {
  return (pextra.causes as any).isSet(cause);
}

/**
 * Is given cause one of the removal causes for the given extra?
 */
export function isExtraRemovedBy(pextra: Extra, rmcause: number): boolean {
  return (pextra.rmcauses as any).isSet(rmcause);
}

/**
 * Does this extra type claim territory?
 */
export function territoryClaimingExtra(pextra: Extra): boolean {
  const base = pextra['base'] as any;
  return base && base['border_sq'] > -1;
}

// ---------------------------------------------------------------------------
// Expose to legacy
// ---------------------------------------------------------------------------


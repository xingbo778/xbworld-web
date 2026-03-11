/**
 * XBWorld — Government data module (migrated from government.js, data part only)
 *
 * Pure query/calculation functions for government types.
 *
 * NOTE: UI functions (show_government_dialog, update_govt_dialog,
 * start_revolution, set_req_government, send_player_change_government,
 * request_report) are NOT migrated — they remain in Legacy.
 */

import { store } from './store';
import { clientPlaying } from '../client/clientState';
import { areReqsActive, type Requirement } from './requirements';
import { RPT_POSSIBLE } from './fcTypes';

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Returns the max tax rate for a given government.
 * FIXME: This shouldn't be hardcoded, but instead fetched from effects.
 */
export function governmentMaxRate(govtId: number): number {
  switch (govtId) {
    case 0: // Anarchy
      return 100;
    case 1: // Despotism
      return 60;
    case 2: // Monarchy
      return 70;
    case 3: // Communism
      return 80;
    case 4: // Republic
      return 80;
    case 5: // Democracy
      return 100;
    default:
      return 100;
  }
}

/**
 * Returns true iff the player can get the specified government.
 * Uses the JavaScript implementation of the requirement system.
 */
export function canPlayerGetGov(govtId: number): boolean {
  const pplayer = clientPlaying();
  if (pplayer == null) return false;
  const gov = store.governments[govtId];
  if (gov == null) return false;
  const reqs = (gov as unknown as Record<string, unknown>)['reqs'] as Requirement[] | null | undefined;
  if (reqs == null || reqs.length === 0) return true;
  return areReqsActive(pplayer, null, null, null, null, null, null, reqs, RPT_POSSIBLE);
}

// ---------------------------------------------------------------------------
// Expose to legacy
// ---------------------------------------------------------------------------


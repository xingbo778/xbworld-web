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
import { RPT_POSSIBLE, RPT_CERTAIN, EFT_MAX_RATES } from './fcTypes';
import type { Player } from './types';

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Returns the max tax/luxury/science rate for a given government.
 *
 * Reads EFT_MAX_RATES effects from the ruleset store and sums the values of
 * all effects whose requirements are satisfied by the given government id.
 *
 * Falls back to 100 (unrestricted) when no effects data is available yet
 * (e.g. before the server has sent ruleset packets) or when no effects match.
 */
export function governmentMaxRate(govtId: number): number {
  const effects =
    (store.effects as Record<number, (Record<string, unknown> & { effect_type: number })[] | undefined>)[EFT_MAX_RATES];
  if (!effects || effects.length === 0) return 100;

  // Build a minimal player context so areReqsActive can evaluate VUT_GOVERNMENT.
  const fakePlayer = { government: govtId } as unknown as Player;
  let total = 0;
  let matched = false;

  for (const effect of effects) {
    const reqs = effect['reqs'] as Requirement[] | null | undefined;
    // An effect with no reqs is unconditional; reqs must all be satisfied for conditional ones.
    const active =
      !reqs || reqs.length === 0 ||
      areReqsActive(fakePlayer, null, null, null, null, null, null, reqs, RPT_CERTAIN);
    if (active) {
      matched = true;
      total += effect['effect_value'] as number;
    }
  }

  return matched ? total : 100;
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


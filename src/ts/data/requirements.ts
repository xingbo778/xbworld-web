/**
 * XBWorld — Requirements system (migrated from requirements.js)
 *
 * Pure calculation functions for evaluating game requirements.
 * These functions have no side effects — they only read data and
 * return boolean/tri-state results.
 *
 * Dependencies:
 *   - VUT_* constants (from fcTypes.ts or window)
 *   - REQ_RANGE_* constants (from fcTypes.ts or window)
 *   - player_invention_state() (from Legacy tech.js)
 */

import {
  TRI_NO,
  TRI_YES,
  TRI_MAYBE,
  VUT_NONE,
  VUT_ADVANCE,
  VUT_GOVERNMENT,
  VUT_IMPROVEMENT,
  VUT_TERRAIN,
  VUT_NATION,
  VUT_UTYPE,
  VUT_UTFLAG,
  VUT_UCLASS,
  VUT_UCFLAG,
  VUT_OTYPE,
  VUT_SPECIALIST,
  VUT_MINSIZE,
  VUT_AI_LEVEL,
  VUT_TERRAINCLASS,
  VUT_MINYEAR,
  VUT_TERRAINALTER,
  VUT_CITYTILE,
  VUT_GOOD,
  VUT_TERRFLAG,
  VUT_NATIONALITY,
  VUT_ROADFLAG,
  VUT_EXTRA,
  VUT_TECHFLAG,
  VUT_ACHIEVEMENT,
  VUT_DIPLREL,
  VUT_MAXTILEUNITS,
  VUT_STYLE,
  VUT_MINCULTURE,
  VUT_UNITSTATE,
  VUT_MINMOVES,
  VUT_MINVETERAN,
  VUT_MINHP,
  VUT_AGE,
  VUT_NATIONGROUP,
  VUT_TOPO,
  VUT_IMPR_GENUS,
  VUT_ACTION,
  VUT_MINTECHS,
  VUT_EXTRAFLAG,
  VUT_MINCALFRAG,
  VUT_SERVERSETTING,
  // New Freeciv 3.4 VUT types (added to avoid "Unknown requirement" warnings)
  VUT_ACTIVITY,
  VUT_CITYSTATUS,
  VUT_COUNTER,
  VUT_DIPLREL_TILE,
  VUT_DIPLREL_TILE_O,
  VUT_DIPLREL_UNITANY,
  VUT_DIPLREL_UNITANY_O,
  VUT_FORM_AGE,
  VUT_IMPR_FLAG,
  VUT_MAXLATITUDE,
  VUT_MAX_DISTANCE_SQ,
  VUT_MAX_REGION_TILES,
  VUT_MINCITIES,
  VUT_MINFOREIGNPCT,
  VUT_MINLATITUDE,
  VUT_ORIGINAL_OWNER,
  VUT_PLAYER_FLAG,
  VUT_PLAYER_STATE,
  VUT_SITE,
  VUT_TILE_REL,
  VUT_WRAP,
  VUT_COUNT,
  REQ_RANGE_LOCAL,
  REQ_RANGE_TILE,
  REQ_RANGE_CADJACENT,
  REQ_RANGE_ADJACENT,
  REQ_RANGE_CITY,
  REQ_RANGE_TRADEROUTE,
  REQ_RANGE_CONTINENT,
  REQ_RANGE_PLAYER,
  REQ_RANGE_TEAM,
  REQ_RANGE_ALLIANCE,
  REQ_RANGE_WORLD,
  REQ_RANGE_COUNT,
  RPT_POSSIBLE,
} from './fcTypes';
import { playerInventionState, TECH_KNOWN } from './tech';
import { store } from './store';
import type { Player } from './types';

export interface Requirement {
  kind: number;
  range: number;
  value: number;
  present: boolean;
}

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Is there a source tech within range of the target?
 */
export function isTechInRange(
  targetPlayer: Player | null,
  range: number,
  tech: number,
): number {
  const TECH_KNOWN_VAL = TECH_KNOWN;

  switch (range) {
    case REQ_RANGE_PLAYER:
      return (
        targetPlayer != null &&
        playerInventionState(targetPlayer, tech) === TECH_KNOWN_VAL
      )
        ? TRI_YES
        : TRI_NO;
    case REQ_RANGE_TEAM:
    case REQ_RANGE_ALLIANCE:
    case REQ_RANGE_WORLD:
      console.log('Unimplemented tech requirement range ' + range);
      return TRI_MAYBE;
    case REQ_RANGE_LOCAL:
    case REQ_RANGE_TILE:
    case REQ_RANGE_CADJACENT:
    case REQ_RANGE_ADJACENT:
    case REQ_RANGE_CITY:
    case REQ_RANGE_TRADEROUTE:
    case REQ_RANGE_CONTINENT:
    case REQ_RANGE_COUNT:
      break;
  }
  console.log('Invalid tech req range ' + range);
  return TRI_MAYBE;
}

/**
 * Checks the requirement to see if it is active on the given target.
 */
export function isReqActive(
  targetPlayer: Player | null,
  targetCity: unknown,
  targetBuilding: unknown,
  targetTile: unknown,
  targetUnittype: unknown,
  targetOutput: unknown,
  targetSpecialist: unknown,
  req: Requirement,
  probType: number,
): boolean {
  let result = TRI_NO;

  switch (req['kind']) {
    case VUT_NONE:
      result = TRI_YES;
      break;
    case VUT_ADVANCE:
      result = isTechInRange(targetPlayer, req['range'], req['value']);
      break;
    case VUT_GOVERNMENT:
      if (targetPlayer == null) {
        result = TRI_MAYBE;
      } else {
        result =
          targetPlayer['government'] == req['value'] ? TRI_YES : TRI_NO;
      }
      break;
    // ── Implemented: unit type match ─────────────────────────────────────────
    case VUT_UTYPE: {
      // Present iff the target unit type matches the required type id.
      if (targetUnittype == null) { result = TRI_MAYBE; break; }
      result = (targetUnittype as { id: number })['id'] === req['value'] ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: map topology ─────────────────────────────────────────────
    case VUT_TOPO: {
      const topoId = (store.mapInfo as Record<string, unknown> | null)?.['topology_id'];
      if (topoId == null) { result = TRI_MAYBE; break; }
      result = topoId === req['value'] ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: minimum number of techs known ────────────────────────────
    case VUT_MINTECHS: {
      if (targetPlayer == null) { result = TRI_MAYBE; break; }
      let techCount = 0;
      for (const techId in store.techs) {
        if (playerInventionState(targetPlayer, Number(techId)) === TECH_KNOWN) techCount++;
      }
      result = techCount >= req['value'] ? TRI_YES : TRI_NO;
      break;
    }

    // ── TRI_MAYBE: veteran level requires unit instance, not unit type ────────
    case VUT_MINVETERAN:
      result = TRI_MAYBE;
      break;

    // ── TRI_MAYBE: nation group membership data not available client-side ─────
    case VUT_NATIONGROUP:
      result = TRI_MAYBE;
      break;

    // ── TRI_MAYBE: improvement genus classification is server-side ────────────
    case VUT_IMPR_GENUS:
      result = TRI_MAYBE;
      break;

    // ── TRI_MAYBE: action enabler evaluation not implemented ──────────────────
    case VUT_ACTION:
      result = TRI_MAYBE;
      break;

    // ── TRI_MAYBE: extra flag evaluation requires full tile data ─────────────
    case VUT_EXTRAFLAG:
      result = TRI_MAYBE;
      break;

    // ── TRI_MAYBE: all remaining unimplemented types ──────────────────────────
    // Returning TRI_MAYBE rather than TRI_NO: we cannot evaluate these
    // client-side, but we should not assume the requirement is unmet.
    // With RPT_POSSIBLE callers get true (assume possible); RPT_CERTAIN → false.
    case VUT_IMPROVEMENT:
    case VUT_TERRAIN:
    case VUT_UTFLAG:
    case VUT_UCLASS:
    case VUT_UCFLAG:
    case VUT_OTYPE:
    case VUT_SPECIALIST:
    case VUT_MINSIZE:
    case VUT_AI_LEVEL:
    case VUT_TERRAINCLASS:
    case VUT_MINYEAR:
    case VUT_TERRAINALTER:
    case VUT_CITYTILE:
    case VUT_GOOD:
    case VUT_TERRFLAG:
    case VUT_NATIONALITY:
    case VUT_ROADFLAG:
    case VUT_EXTRA:
    case VUT_TECHFLAG:
    case VUT_ACHIEVEMENT:
    case VUT_DIPLREL:
    case VUT_MAXTILEUNITS:
    case VUT_STYLE:
    case VUT_MINCULTURE:
    case VUT_UNITSTATE:
    case VUT_MINMOVES:
    case VUT_MINHP:
    case VUT_AGE:
    case VUT_MINCALFRAG:
    case VUT_SERVERSETTING:
    case VUT_NATION:
    // New Freeciv 3.4 types
    case VUT_ACTIVITY:
    case VUT_CITYSTATUS:
    case VUT_COUNTER:
    case VUT_DIPLREL_TILE:
    case VUT_DIPLREL_TILE_O:
    case VUT_DIPLREL_UNITANY:
    case VUT_DIPLREL_UNITANY_O:
    case VUT_FORM_AGE:
    case VUT_IMPR_FLAG:
    case VUT_MAXLATITUDE:
    case VUT_MAX_DISTANCE_SQ:
    case VUT_MAX_REGION_TILES:
    case VUT_MINCITIES:
    case VUT_MINFOREIGNPCT:
    case VUT_MINLATITUDE:
    case VUT_ORIGINAL_OWNER:
    case VUT_PLAYER_FLAG:
    case VUT_PLAYER_STATE:
    case VUT_SITE:
    case VUT_TILE_REL:
    case VUT_WRAP:
      result = TRI_MAYBE;
      break;
    case VUT_COUNT:
      return false;
    default:
      console.log('Unknown requirement type ' + req['kind']);
  }

  if (result === TRI_MAYBE) {
    if (probType === RPT_POSSIBLE) {
      return true;
    } else {
      return false;
    }
  }

  if (req['present']) {
    return result === TRI_YES;
  } else {
    return result === TRI_NO;
  }
}

/**
 * Checks the requirement(s) to see if they are active on the given target.
 * Returns TRUE only if all requirements are active.
 */
export function areReqsActive(
  targetPlayer: Player | null,
  targetCity: unknown,
  targetBuilding: unknown,
  targetTile: unknown,
  targetUnittype: unknown,
  targetOutput: unknown,
  targetSpecialist: unknown,
  reqs: Requirement[],
  probType: number,
): boolean {
  for (let i = 0; i < reqs.length; i++) {
    if (
      !isReqActive(
        targetPlayer,
        targetCity,
        targetBuilding,
        targetTile,
        targetUnittype,
        targetOutput,
        targetSpecialist,
        reqs[i],
        probType,
      )
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Return the number of shields it takes to build this universal.
 */
export function universalBuildShieldCost(_pcity: unknown, target: { build_cost: number }): number {
  return target['build_cost'];
}

// ---------------------------------------------------------------------------
// Expose to legacy
// ---------------------------------------------------------------------------


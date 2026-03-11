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
import { tileHasExtra } from './tile';
import type { Player, Tile } from './types';

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

    // ── Implemented: city size ────────────────────────────────────────────────
    // Only REQ_RANGE_CITY is evaluated; other ranges (traderoute, player, world)
    // require iterating cities we don't have fully client-side → TRI_MAYBE.
    case VUT_MINSIZE: {
      if (targetCity == null || req['range'] !== REQ_RANGE_CITY) { result = TRI_MAYBE; break; }
      const citySize = (targetCity as Record<string, unknown>)['size'];
      if (citySize == null) { result = TRI_MAYBE; break; }
      result = (citySize as number) >= req['value'] ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: minimum game year ───────────────────────────────────────
    // Uses store.gameInfo.year; TRI_MAYBE before game info is loaded.
    case VUT_MINYEAR: {
      const year = (store.gameInfo as Record<string, unknown> | null)?.['year'];
      if (year == null) { result = TRI_MAYBE; break; }
      result = (year as number) >= req['value'] ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: city improvement present ─────────────────────────────────
    // Only REQ_RANGE_CITY evaluated; traderoute/player/world ranges → TRI_MAYBE.
    case VUT_IMPROVEMENT: {
      if (targetCity == null || req['range'] !== REQ_RANGE_CITY) { result = TRI_MAYBE; break; }
      const imprBv = (targetCity as Record<string, unknown>)['improvements'];
      if (imprBv == null || typeof (imprBv as Record<string, unknown>)['isSet'] !== 'function') {
        result = TRI_MAYBE; break;
      }
      result = (imprBv as { isSet(n: number): boolean }).isSet(req['value']) ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: tile terrain ─────────────────────────────────────────────
    // Checks targetTile.terrain; TRI_MAYBE when no tile context provided.
    case VUT_TERRAIN: {
      if (targetTile == null) { result = TRI_MAYBE; break; }
      const tileTerrain = (targetTile as Record<string, unknown>)['terrain'];
      if (tileTerrain == null) { result = TRI_MAYBE; break; }
      result = tileTerrain === req['value'] ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: unit type flag ───────────────────────────────────────────
    // Checks the 'flags' BitVector on the unit type (converted from number[]
    // by handle_ruleset_unit). TRI_MAYBE if no unit type or no flags field.
    case VUT_UTFLAG: {
      if (targetUnittype == null) { result = TRI_MAYBE; break; }
      const utFlags = (targetUnittype as Record<string, unknown>)['flags'];
      if (utFlags == null || typeof (utFlags as Record<string, unknown>)['isSet'] !== 'function') {
        result = TRI_MAYBE; break;
      }
      result = (utFlags as { isSet(n: number): boolean }).isSet(req['value']) ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: unit class ───────────────────────────────────────────────
    // Freeciv RULESET_UNIT packet carries the class id as 'unit_class'.
    // TRI_MAYBE when the field is absent (old protocol or unit type not loaded).
    case VUT_UCLASS: {
      if (targetUnittype == null) { result = TRI_MAYBE; break; }
      const classId = (targetUnittype as Record<string, unknown>)['unit_class'];
      if (classId == null) { result = TRI_MAYBE; break; }
      result = classId === req['value'] ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: minimum veteran level ───────────────────────────────────
    // Requires a unit INSTANCE (has 'veteran' field from Unit packet).
    // Unit types have no veteran level → TRI_MAYBE when no 'veteran' field.
    case VUT_MINVETERAN: {
      if (targetUnittype == null) { result = TRI_MAYBE; break; }
      const vet = (targetUnittype as Record<string, unknown>)['veteran'];
      if (vet == null) { result = TRI_MAYBE; break; }
      result = (vet as number) >= req['value'] ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: minimum moves left ──────────────────────────────────────
    // Requires a unit INSTANCE (has 'movesleft' field).
    // Unit types have 'move_rate' (max), not 'movesleft' (current) → TRI_MAYBE.
    case VUT_MINMOVES: {
      if (targetUnittype == null) { result = TRI_MAYBE; break; }
      const moves = (targetUnittype as Record<string, unknown>)['movesleft'];
      if (moves == null) { result = TRI_MAYBE; break; }
      result = (moves as number) >= req['value'] ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: minimum hit points ──────────────────────────────────────
    // Requires a unit INSTANCE (current hp, not unit type max hp).
    // Discriminant: unit instances always have 'movesleft'; types do not.
    case VUT_MINHP: {
      if (targetUnittype == null) { result = TRI_MAYBE; break; }
      const rec = targetUnittype as Record<string, unknown>;
      // Unit instances have 'movesleft'; unit types only have 'move_rate'.
      if (rec['movesleft'] == null) { result = TRI_MAYBE; break; }
      result = (rec['hp'] as number) >= req['value'] ? TRI_YES : TRI_NO;
      break;
    }

    // ── TRI_MAYBE: nation group membership not available client-side ──────────
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

    // ── TRI_MAYBE: extra flag evaluation ──────────────────────────────────────
    // VUT_EXTRAFLAG checks if any extra on the relevant tile has a specific flag
    // from its 'efs' (extra flag set) BitVector. Cannot implement because:
    // (a) RulesetExtraPacket does not explicitly type 'efs', and it is unclear
    //     whether the server sends it in this web protocol;
    // (b) evaluation requires a tile context (which extra on which tile?),
    //     not just targetTile.terrain.
    case VUT_EXTRAFLAG:
      result = TRI_MAYBE;
      break;

    // ── Implemented: unit class flag ─────────────────────────────────────────
    // Checks whether the unit type's unit class has the given class-flag set.
    // Requires: targetUnittype.unit_class → store.unitClasses[classId].flags.
    // TRI_MAYBE when unit type, class id, class entry, or flags BitVector
    // are unavailable (graceful degradation: RPT_POSSIBLE callers still pass).
    case VUT_UCFLAG: {
      if (targetUnittype == null) { result = TRI_MAYBE; break; }
      const classId = (targetUnittype as Record<string, unknown>)['unit_class'];
      if (classId == null) { result = TRI_MAYBE; break; }
      const uclass = store.unitClasses[classId as number];
      if (uclass == null) { result = TRI_MAYBE; break; }
      const ucFlags = uclass['flags'];
      if (ucFlags == null || typeof (ucFlags as Record<string, unknown>)['isSet'] !== 'function') {
        result = TRI_MAYBE; break;
      }
      result = (ucFlags as { isSet(n: number): boolean }).isSet(req['value']) ? TRI_YES : TRI_NO;
      break;
    }

    // ── TRI_MAYBE: all remaining unimplemented types ──────────────────────────
    // Returning TRI_MAYBE rather than TRI_NO: we cannot evaluate these
    // client-side, but we should not assume the requirement is unmet.
    // With RPT_POSSIBLE callers get true (assume possible); RPT_CERTAIN → false.
    // ── Implemented: extra present on tile ───────────────────────────────────
    // Uses tileHasExtra() which handles BitVector extras from map packets.
    case VUT_EXTRA: {
      if (targetTile == null) { result = TRI_MAYBE; break; }
      result = tileHasExtra(targetTile as Tile, req['value']) ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: terrain flag ─────────────────────────────────────────────
    // Reads terrain.flags (raw number or BitVector — not converted in packet handler).
    case VUT_TERRFLAG: {
      if (targetTile == null) { result = TRI_MAYBE; break; }
      const terrainId = (targetTile as Record<string, unknown>)['terrain'];
      if (terrainId == null) { result = TRI_MAYBE; break; }
      const terrain = store.terrains[terrainId as number];
      if (terrain == null) { result = TRI_MAYBE; break; }
      const tflags = (terrain as Record<string, unknown>)['flags'];
      if (tflags == null) { result = TRI_MAYBE; break; }
      let tfHas: boolean;
      if (typeof (tflags as Record<string, unknown>)['isSet'] === 'function') {
        tfHas = (tflags as { isSet(n: number): boolean }).isSet(req['value']);
      } else if (typeof tflags === 'number') {
        tfHas = Boolean((tflags >> req['value']) & 1);
      } else { result = TRI_MAYBE; break; }
      result = tfHas ? TRI_YES : TRI_NO;
      break;
    }

    // ── Implemented: improvement flag ────────────────────────────────────────
    // targetBuilding is canonical; falls back to targetOutput (some callers
    // pass the improvement there instead of the dedicated slot).
    case VUT_IMPR_FLAG: {
      const imprTarget = targetBuilding ?? targetOutput;
      if (imprTarget == null) { result = TRI_MAYBE; break; }
      const iflags = (imprTarget as Record<string, unknown>)['flags'];
      if (iflags == null) { result = TRI_MAYBE; break; }
      let ifHas: boolean;
      if (typeof (iflags as Record<string, unknown>)['isSet'] === 'function') {
        ifHas = (iflags as { isSet(n: number): boolean }).isSet(req['value']);
      } else if (typeof iflags === 'number') {
        ifHas = Boolean((iflags >> req['value']) & 1);
      } else { result = TRI_MAYBE; break; }
      result = ifHas ? TRI_YES : TRI_NO;
      break;
    }

    case VUT_OTYPE:
    case VUT_SPECIALIST:
    case VUT_AI_LEVEL:
    case VUT_TERRAINCLASS:
    case VUT_TERRAINALTER:
    case VUT_CITYTILE:
    case VUT_GOOD:
    case VUT_NATIONALITY:
    case VUT_ROADFLAG:
    case VUT_TECHFLAG:
    case VUT_ACHIEVEMENT:
    case VUT_DIPLREL:
    case VUT_MAXTILEUNITS:
    case VUT_STYLE:
    case VUT_MINCULTURE:
    case VUT_UNITSTATE:
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


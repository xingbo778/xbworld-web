/**
 * City data module — pure data queries and logic migrated from city.js.
 *
 * Phase 7: Migrates 29 pure-data functions from legacy city.js.
 * UI/DOM functions (show_city_dialog, city_worklist_dialog, etc.) remain
 * in legacy city.js until the UI layer migration phase.
 */

import type { City, Tile, Player, UnitType, Improvement } from './types';
import type { BitVector } from '../utils/bitvector';
import {
  FC_INFINITY,
  VUT_UTYPE,
  VUT_IMPROVEMENT,
  VUT_GOVERNMENT,
  VUT_ADVANCE,
  VUT_MINSIZE,
  O_SHIELD,
  CAPITAL_PRIMARY,
  RPT_POSSIBLE,
  RPT_CERTAIN,
} from './fcTypes';
import { store } from './store';
import { clientPlaying } from '../client/clientState';
import {
  indexToTile,
} from './map';
import { universalBuildShieldCost, areReqsActive, type Requirement } from './requirements';
import { can_player_build_unit_direct, getUnitClassForType, UTYF_PROVIDES_RANSOM } from './unittype';
import { playerInventionState, TECH_KNOWN } from './tech';
import {
  get_unit_type_image_sprite,
  get_improvement_image_sprite,
} from '../renderer/tilespec';
import { globalEvents } from '../core/events';

// ---------------------------------------------------------------------------
// Constants (also defined in city.js — will be removed from there)
// ---------------------------------------------------------------------------
export const CITYO_DISBAND = 0;
export const CITYO_NEW_EINSTEIN = 1;
export const CITYO_NEW_TAXMAN = 2;
export const CITYO_LAST = 3;

export const FEELING_BASE = 0;
export const FEELING_LUXURY = 1;
export const FEELING_EFFECT = 2;
export const FEELING_NATIONALITY = 3;
export const FEELING_MARTIAL = 4;
export const FEELING_FINAL = 5;

export const MAX_LEN_WORKLIST = 64;
export const INCITE_IMPOSSIBLE_COST = 1000 * 1000 * 1000;

// ---------------------------------------------------------------------------
// Production list item type
// ---------------------------------------------------------------------------
export interface ProductionItem {
  kind: number;
  value: number;
  text: string;
  helptext: unknown;
  rule_name: string;
  build_cost: number | string;
  unit_details: string;
  sprite: unknown;
}

// ---------------------------------------------------------------------------
// Basic city queries
// ---------------------------------------------------------------------------

/** Returns the tile object for a city. */
export function cityTile(pcity: City | null | undefined): Tile | null {
  if (pcity == null) return null;
  return indexToTile(pcity['tile']);
}

/** Returns the player id (owner) of a city. */
export function cityOwnerPlayerId(pcity: City | null | undefined): number | null {
  if (pcity == null) return null;
  return pcity['owner'];
}

/** Returns the player object that owns the city. */
export function cityOwner(pcity: City): Player {
  return store.players[cityOwnerPlayerId(pcity)!];
}

/** Removes a city from the game. */
export function removeCity(pcityId: number): void {
  if (pcityId == null) return;
  const pcity = store.cities[pcityId];
  if (pcity == null) return;

  const ptile = cityTile(store.cities[pcityId]);
  delete store.cities[pcityId];

  const pplayer = clientPlaying();
  if (pplayer != null && pplayer.playerno != null &&
      cityOwner(pcity)?.playerno === pplayer.playerno) {
    globalEvents.emit('city:screenUpdate');
  }
}

/** Returns true if the tile is the city center. */
export function isCityCenter(city: City, tile: Tile): boolean {
  return city['tile'] === tile['index'];
}

/** Returns true if the tile is free-worked (same as city center). */
export function isFreeWorked(city: City, tile: Tile): boolean {
  return city['tile'] === tile['index'];
}

/** Returns true if the city is the primary capital. */
export function isPrimaryCapital(city: City): boolean {
  return city['capital'] === CAPITAL_PRIMARY;
}

// ---------------------------------------------------------------------------
// Production queries
// ---------------------------------------------------------------------------

/** Returns the sprite and type info for the city's current production. */
export function getCityProductionTypeSprite(pcity: City | null): { type: UnitType | Improvement; sprite: unknown } | null {
  if (pcity == null) return null;
  if (pcity['production_kind'] === VUT_UTYPE) {
    const punitType = store.unitTypes[pcity['production_value']];
    return {
      type: punitType,
      sprite: get_unit_type_image_sprite(punitType),
    };
  }
  if (pcity['production_kind'] === VUT_IMPROVEMENT) {
    const improvement = store.improvements[pcity['production_value']];
    return {
      type: improvement,
      sprite: get_improvement_image_sprite(improvement),
    };
  }
  return null;
}

/** Returns the type object (unit type or improvement) being produced. */
export function getCityProductionType(pcity: City | null): UnitType | Improvement | null {
  if (pcity == null) return null;
  if (pcity['production_kind'] === VUT_UTYPE) {
    return store.unitTypes[pcity['production_value']];
  }
  if (pcity['production_kind'] === VUT_IMPROVEMENT) {
    return store.improvements[pcity['production_value']];
  }
  return null;
}

/**
 * Calculates the turns needed to build the requested item in the city.
 * GUI Independent.
 */
export function cityTurnsToBuild(
  pcity: City,
  target: { build_cost: number },
  includeShieldStock: boolean,
): number {
  const citySurplus = pcity['surplus'][O_SHIELD];
  const cityStock = includeShieldStock ? pcity['shield_stock'] : 0;
  const cost = universalBuildShieldCost(pcity, target);

  if (includeShieldStock && pcity['shield_stock'] >= cost) {
    return 1;
  } else if (pcity['surplus'][O_SHIELD] > 0) {
    return Math.floor((cost - cityStock - 1) / citySurplus + 1);
  } else {
    return FC_INFINITY;
  }
}

/** Returns the number of turns to complete current city production. */
export function getCityProductionTime(pcity: City | null): number {
  if (pcity == null) return FC_INFINITY;

  if (pcity['production_kind'] === VUT_UTYPE) {
    const punitType = store.unitTypes[pcity['production_value']];
    return cityTurnsToBuild(pcity, punitType, true);
  }

  if (pcity['production_kind'] === VUT_IMPROVEMENT) {
    const improvement = store.improvements[pcity['production_value']];
    if (improvement['name'] === 'Coinage') {
      return FC_INFINITY;
    }
    return cityTurnsToBuild(pcity, improvement, true);
  }

  return FC_INFINITY;
}

/** Returns city production progress string, e.g. "5/30". */
export function getProductionProgress(pcity: City | null): string {
  if (pcity == null) return ' ';

  if (pcity['production_kind'] === VUT_UTYPE) {
    const punitType = store.unitTypes[pcity['production_value']];
    return (
      pcity['shield_stock'] +
      '/' +
      universalBuildShieldCost(pcity, punitType)
    );
  }

  if (pcity['production_kind'] === VUT_IMPROVEMENT) {
    const improvement = store.improvements[pcity['production_value']];
    if (improvement['name'] === 'Coinage') {
      return ' ';
    }
    return (
      pcity['shield_stock'] +
      '/' +
      universalBuildShieldCost(pcity, improvement)
    );
  }

  return ' ';
}

// ---------------------------------------------------------------------------
// A1 City demand optimization — production list cache
//
// BEFORE: generateProductionList() iterated ALL unit types + ALL improvements
//   every call (O(numUnitTypes + numImprovements)). If called multiple times
//   between ruleset loads, it repeated this full iteration each time.
//
// AFTER: cache the result keyed to rules:ready / store:reset events. The list
//   only rebuilds when the ruleset actually changes. Subsequent calls return
//   the cached array in O(1). Typical savings: 50–100 unit types + 70 improvements
//   × however many times the caller invokes it per session.
// ---------------------------------------------------------------------------

let _cachedProductionList: ProductionItem[] | null = null;

globalEvents.on('rules:ready', () => { _cachedProductionList = null; });
// store:reset listener already added above for _improvementNameIndex; no double-register needed
// (globalEvents supports multiple listeners per event).
globalEvents.on('store:reset', () => { _cachedProductionList = null; });

/** Generates the full production list (units + improvements), cached per ruleset. */
export function generateProductionList(): ProductionItem[] {
  if (_cachedProductionList !== null) return _cachedProductionList;

  const productionList: ProductionItem[] = [];

  for (const unitTypeId in store.unitTypes) {
    const punitType = store.unitTypes[unitTypeId];

    // Filter non-player-buildable units using flags (replaces hardcoded name hack).
    // Units with UTYF_PROVIDES_RANSOM are barbarian leader types never built by cities.
    const utFlags = punitType['flags'] as { isSet(n: number): boolean } | null | undefined;
    if (utFlags != null && typeof utFlags.isSet === 'function' && utFlags.isSet(UTYF_PROVIDES_RANSOM)) continue;

    // Resolve unit class name for display (e.g. "Land", "Sea", "Air").
    const uclass = getUnitClassForType(punitType as unknown as import('./types').UnitType);
    const className = (uclass?.['name'] as string | undefined) ?? '';
    const classLabel = className ? ` [${className}]` : '';

    productionList.push({
      kind: VUT_UTYPE,
      value: punitType['id'],
      text: punitType['name'],
      helptext: punitType['helptext'],
      rule_name: punitType['rule_name'],
      build_cost: punitType['build_cost'],
      unit_details:
        punitType['attack_strength'] +
        '/' +
        punitType['defense_strength'] +
        '/' +
        punitType['firepower'] +
        classLabel,
      sprite: get_unit_type_image_sprite(punitType),
    });
  }

  for (const improvementId in store.improvements) {
    const pimprovement = store.improvements[improvementId];
    let buildCost: string | number = pimprovement['build_cost'];
    if (pimprovement['name'] === 'Coinage') buildCost = '-';
    productionList.push({
      kind: VUT_IMPROVEMENT,
      value: pimprovement['id'],
      text: pimprovement['name'],
      helptext: pimprovement['helptext'],
      rule_name: pimprovement['rule_name'],
      build_cost: buildCost,
      unit_details: '-',
      sprite: get_improvement_image_sprite(pimprovement),
    });
  }
  _cachedProductionList = productionList;
  return productionList;
}

// ---------------------------------------------------------------------------
// Build capability queries
// ---------------------------------------------------------------------------

/** Return whether given city can build given unit, ignoring obsolete. */
export function canCityBuildUnitDirect(pcity: City, punittype: UnitType): boolean {
  const pplayer = cityOwner(pcity);

  // Player-level check: tech requirement + obsoleted_by
  if (!can_player_build_unit_direct(pplayer, punittype)) return false;

  // City-level check: build_reqs
  const buildReqs = punittype['build_reqs'] as Requirement[] | null | undefined;
  if (buildReqs != null && buildReqs.length > 0) {
    // These types are evaluable client-side — use RPT_CERTAIN (TRI_MAYBE blocks).
    const isPrecise = (r: Requirement) =>
      r.kind === VUT_GOVERNMENT || r.kind === VUT_ADVANCE ||
      r.kind === VUT_IMPROVEMENT || r.kind === VUT_MINSIZE;
    const preciseReqs = buildReqs.filter(isPrecise);
    if (preciseReqs.length > 0 &&
        !areReqsActive(pplayer, pcity, null, null, punittype, null, null, preciseReqs, RPT_CERTAIN)) {
      return false;
    }
    // All other requirement types fall back to RPT_POSSIBLE (unknown → assume possible).
    const fuzzyReqs = buildReqs.filter(r => !isPrecise(r));
    if (fuzzyReqs.length > 0 &&
        !areReqsActive(pplayer, pcity, null, null, punittype, null, null, fuzzyReqs, RPT_POSSIBLE)) {
      return false;
    }
  }

  return true;
}

/** Return whether given city can build given unit now. */
export function canCityBuildUnitNow(pcity: City | null | undefined, punittypeId: number): boolean {
  return (
    pcity != null &&
    typeof pcity['can_build_unit'] !== 'undefined' &&
    (pcity['can_build_unit'] as BitVector).isSet(punittypeId)
  );
}

/** Return whether given city can build given improvement now. */
export function canCityBuildImprovementNow(
  pcity: City | null | undefined,
  pimproveId: number,
): boolean {
  return (
    pcity != null &&
    typeof pcity['can_build_improvement'] !== 'undefined' &&
    (pcity['can_build_improvement'] as BitVector).isSet(pimproveId)
  );
}

/** Return whether given city can build given item. */
export function canCityBuildNow(
  pcity: City | null | undefined,
  kind: number | null,
  value: number | null,
): boolean {
  return (
    kind != null &&
    value != null &&
    (kind === VUT_UTYPE
      ? canCityBuildUnitNow(pcity, value)
      : canCityBuildImprovementNow(pcity, value))
  );
}

/** Return TRUE iff the city has this building in it. */
export function cityHasBuilding(pcity: City, improvementId: number): boolean {
  return (
    0 <= improvementId &&
    improvementId < (store.rulesControl as Record<string, number>).num_impr_types &&
    pcity['improvements'] &&
    (pcity['improvements'] as unknown as BitVector).isSet(improvementId)
  );
}

// ---------------------------------------------------------------------------
// A1 City demand optimization — improvement name → id index
//
// BEFORE: doesCityHaveImprovement() did an O(num_impr_types) linear scan for
//   every call: iterate all improvement slots, compare names one by one.
//   Called from areReqsActive() for every VUT_IMPROVEMENT requirement; with
//   70 improvement types and ~3 requirements per buildable item, opening the
//   city production tab triggered ~210 calls × O(70) = ~14,700 iterations.
//
// AFTER: lazily build a Map<name, id> once (O(num_impr_types) one-time cost),
//   then every doesCityHaveImprovement() call is O(1) — one Map.get() + one
//   BitVector.isSet(). The index is invalidated on rules:ready and store:reset.
//   Same production-tab open → ~210 calls × O(1) = ~210 operations.
// ---------------------------------------------------------------------------

/** Lazily built improvement-name → id index. Null = not yet built / invalidated. */
let _improvementNameIndex: Map<string, number> | null = null;

/**
 * A1 Improvement lookup optimization metrics — exported for tests and observability.
 */
export const _improvementLookupMetrics = {
  /** How many times the index was built (invalidations + initial build). */
  indexBuilds: 0,
  /** Total doesCityHaveImprovement() calls routed through the fast path. */
  lookups: 0,
};

export function _resetImprovementLookupMetrics(): void {
  _improvementLookupMetrics.indexBuilds = 0;
  _improvementLookupMetrics.lookups = 0;
}

/** Returns the improvement name→id index, building it lazily on first use. */
function getImprovementNameIndex(): Map<string, number> {
  if (_improvementNameIndex !== null) return _improvementNameIndex;
  const idx = new Map<string, number>();
  for (const idStr in store.improvements) {
    const impr = store.improvements[Number(idStr)];
    if (impr?.['name']) idx.set(impr['name'] as string, Number(idStr));
  }
  _improvementNameIndex = idx;
  _improvementLookupMetrics.indexBuilds++;
  return idx;
}

// Invalidate the index whenever the ruleset or store changes.
globalEvents.on('rules:ready', () => { _improvementNameIndex = null; });
globalEvents.on('store:reset', () => { _improvementNameIndex = null; });

/** Return TRUE iff the city has this improvement (by name). */
export function doesCityHaveImprovement(
  pcity: City | null | undefined,
  improvementName: string,
): boolean {
  if (pcity == null || pcity['improvements'] == null) return false;
  _improvementLookupMetrics.lookups++;
  const idx = getImprovementNameIndex();
  const id = idx.get(improvementName);
  if (id === undefined) return false;
  return (pcity['improvements'] as unknown as BitVector).isSet(id);
}

/** Return whether given city can build given improvement, ignoring server BitVectors. */
export function canCityBuildImprovementDirect(pcity: City, impr: Improvement): boolean {
  // Skip if already built (improvements are unique per city)
  if (cityHasBuilding(pcity, impr.id)) return false;

  const pplayer = cityOwner(pcity);

  // Tech requirement check (dedicated field on improvement)
  const techReq = impr['tech_req'] as number | null | undefined;
  if (techReq != null && techReq >= 0) {
    if (playerInventionState(pplayer, techReq) !== TECH_KNOWN) return false;
  }

  // City-level build requirements
  const buildReqs = impr['build_reqs'] as Requirement[] | null | undefined;
  if (buildReqs != null && buildReqs.length > 0) {
    // These types are evaluable client-side — use RPT_CERTAIN (TRI_MAYBE blocks).
    const isPrecise = (r: Requirement) =>
      r.kind === VUT_GOVERNMENT || r.kind === VUT_ADVANCE ||
      r.kind === VUT_IMPROVEMENT || r.kind === VUT_MINSIZE;
    const preciseReqs = buildReqs.filter(isPrecise);
    if (preciseReqs.length > 0 &&
        !areReqsActive(pplayer, pcity, null, null, null, impr as unknown as Improvement, null, preciseReqs, RPT_CERTAIN)) {
      return false;
    }
    // All other requirement types fall back to RPT_POSSIBLE (unknown → assume possible).
    const fuzzyReqs = buildReqs.filter(r => !isPrecise(r));
    if (fuzzyReqs.length > 0 &&
        !areReqsActive(pplayer, pcity, null, null, null, impr as unknown as Improvement, null, fuzzyReqs, RPT_POSSIBLE)) {
      return false;
    }
  }

  return true;
}

/** Simplified check: can the city buy its current production? */
export function cityCanBuy(pcity: City): boolean {
  // Only improvements can be bought; buying a unit is not supported
  if (pcity['production_kind'] !== VUT_IMPROVEMENT) return false;
  const improvement = store.improvements[pcity['production_value']];
  if (improvement == null) return false;
  // Game info must be loaded to compare turn_founded vs current turn
  if (store.gameInfo == null) return false;
  return (
    !pcity['did_buy'] &&
    pcity['turn_founded'] !== store.gameInfo['turn'] &&
    improvement['name'] !== 'Coinage'
  );
}

// ---------------------------------------------------------------------------
// City growth and state
// ---------------------------------------------------------------------------

/** Create text describing city growth. */
export function cityTurnsToGrowthText(pcity: City): string {
  const turns = pcity['granary_turns'] as number;
  if (turns === 0) {
    return 'blocked';
  } else if (turns > 1000000) {
    return 'never';
  } else if (turns < 0) {
    return 'Starving in ' + Math.abs(turns) + ' turns';
  } else {
    return turns + ' turns';
  }
}

/** Return TRUE iff the city is unhappy. */
export function cityUnhappy(pcity: City): boolean {
  return (
    pcity['ppl_happy'][FEELING_FINAL] <
    pcity['ppl_unhappy'][FEELING_FINAL] +
      2 * pcity['ppl_angry'][FEELING_FINAL]
  );
}

/** Returns how many thousand citizens live in this city. */
export function cityPopulation(pcity: City): number {
  return pcity['size'] * (pcity['size'] + 1) * 5;
}

// ---------------------------------------------------------------------------
// City tile map functions — re-exported from cityTileMap.ts
// ---------------------------------------------------------------------------
export {
  dxyToCenterIndex,
  getCityDxyToIndex,
  buildCityTileMap,
  deltaTileHelper,
  buildCityTileMapWithLimits,
  getCityTileMapForPos,
} from './cityTileMap';

// ---------------------------------------------------------------------------
// Trade routes
// ---------------------------------------------------------------------------

// showCityTraderoutes removed — dead code, now handled in ui/cityDialog.ts

// ---------------------------------------------------------------------------
// Expose to legacy JS
// ---------------------------------------------------------------------------

// Constants
// Basic queries
// Production queries
// Build capability
// Growth and state
// Tile map
// Trade routes

import { store } from '../data/store';
import type { City, Unit, UnitType, Improvement } from '../data/types';
import { UTYF_PROVIDES_RANSOM } from '../data/unittype';
import {
  getCityProductionTypeSprite as get_city_production_type_sprite,
  getCityProductionTime as get_city_production_time,
  getProductionProgress as get_production_progress,
  getCityProductionType as get_city_production_type,
  cityPopulation as city_population,
  cityTurnsToGrowthText as city_turns_to_growth_text,
  cityOwner,
  canCityBuildUnitNow,
  canCityBuildImprovementNow,
  canCityBuildUnitDirect,
  canCityBuildImprovementDirect,
} from '../data/city';
import { get_supported_units, tile_units, get_unit_city_info } from '../data/unit';
import { get_unit_image_sprite, get_improvement_image_sprite, get_unit_type_image_sprite } from '../renderer/tilespec';
import { cityTile } from '../data/city';
import { FC_INFINITY, O_FOOD, O_SHIELD, O_TRADE, O_GOLD, O_LUXURY, O_SCIENCE } from '../data/fcTypes';
import { numberWithCommas } from '../utils/helpers';
import { clientPlaying } from '../client/clientState';
import type { SpriteInfo } from '../renderer/spriteGetters';
import { FEELING_FINAL } from './cityDialogState';
import { cities } from './cityDialogState';

/**
 * Pure logic/formatting functions extracted from cityDialog.ts.
 * This module has ZERO DOM access.
 */

/** Format the production type name (e.g. "Producing: Warriors"). */
export function formatProductionOverview(pcity: City): string {
  const prod_type = get_city_production_type_sprite(pcity);
  return "Producing: " + (prod_type != null ? prod_type['type']['name'] : "None");
}

export interface ResourceStats {
  food: string;
  prod: string;
  trade: string;
  gold: string;
  luxury: string;
  science: string;
  corruption: string;
  waste: string;
  pollution: string;
  steal: string;
  culture: string;
}

/** Format all resource stats for the city info panel. Returns null if city lacks prod/surplus data. */
export function formatResourceStats(pcity: City): ResourceStats | null {
  if (!('prod' in pcity && 'surplus' in pcity)) return null;

  let food_txt: string = pcity['prod'][O_FOOD] + " ( ";
  if (pcity['surplus'][O_FOOD] > 0) food_txt += "+";
  food_txt += pcity['surplus'][O_FOOD] + ")";

  let shield_txt: string = pcity['prod'][O_SHIELD] + " ( ";
  if (pcity['surplus'][O_SHIELD] > 0) shield_txt += "+";
  shield_txt += pcity['surplus'][O_SHIELD] + ")";

  let trade_txt: string = pcity['prod'][O_TRADE] + " ( ";
  if (pcity['surplus'][O_TRADE] > 0) trade_txt += "+";
  trade_txt += pcity['surplus'][O_TRADE] + ")";

  let gold_txt: string = pcity['prod'][O_GOLD] + " ( ";
  if (pcity['surplus'][O_GOLD] > 0) gold_txt += "+";
  gold_txt += pcity['surplus'][O_GOLD] + ")";

  return {
    food: food_txt,
    prod: shield_txt,
    trade: trade_txt,
    gold: gold_txt,
    luxury: String(pcity['prod'][O_LUXURY]),
    science: String(pcity['prod'][O_SCIENCE]),
    corruption: String(pcity['waste'][O_TRADE]),
    waste: String(pcity['waste'][O_SHIELD]),
    pollution: String(pcity['pollution']),
    steal: String(pcity['steal']),
    culture: String(pcity['culture']),
  };
}

// ── JSX-friendly data-returning functions (no HTML strings) ───────────────────

export interface CitySizeData {
  population: string;
  size: number;
  foodStock: number;
  granarySize: number;
  growthText: string;
}

/** Returns city size/granary data for JSX rendering. */
export function getCitySizeData(pcity: City): CitySizeData {
  return {
    population: numberWithCommas(city_population(pcity) * 1000),
    size: pcity['size'] as number,
    foodStock: pcity['food_stock'] as number,
    granarySize: pcity['granary_size'] as number,
    growthText: city_turns_to_growth_text(pcity),
  };
}

export interface ProductionTurnsData {
  turns: number | null; // null = not calculable (FC_INFINITY)
  progress: string;
}

/** Returns production-turns data for JSX rendering. */
export function getProductionTurnsData(pcity: City): ProductionTurnsData {
  const t = get_city_production_time(pcity);
  return { turns: t === FC_INFINITY ? null : t, progress: get_production_progress(pcity) };
}

export interface ImprovementItem {
  id: number;
  name: string;
  helptext: string;
  sprite: SpriteInfo | null;
}

/** Returns improvement items for JSX rendering. */
export function getImprovementItems(pcity: City): ImprovementItem[] {
  const items: ImprovementItem[] = [];
  const numTypes = (store.rulesControl?.['num_impr_types'] as number | undefined) ?? 0;
  for (let z = 0; z < numTypes; z++) {
    if (pcity['improvements'] != null && (pcity['improvements'] as unknown as { isSet(bit: number): boolean }).isSet(z)) {
      items.push({
        id: z,
        name: store.improvements[z]['name'] as string,
        helptext: store.improvements[z]['helptext'] as string ?? '',
        sprite: get_improvement_image_sprite(store.improvements[z]),
      });
    }
  }
  return items;
}

export interface UnitItem {
  id: number;
  sprite: SpriteInfo;
  title: string;
}

/** Returns present-unit items for JSX rendering (skips units with missing sprites). */
export function getPresentUnitItems(pcity: City): UnitItem[] | null {
  const punits: Unit[] | null = tile_units(cityTile(pcity));
  if (punits == null) return null;
  const items: UnitItem[] = [];
  for (const punit of punits) {
    const sprite = get_unit_image_sprite(punit);
    if (sprite == null) continue;
    items.push({ id: punit['id'] as number, sprite, title: get_unit_city_info(punit) });
  }
  return items;
}

/** Returns supported-unit items for JSX rendering (skips units with missing sprites). */
export function getSupportedUnitItems(pcity: City): UnitItem[] | null {
  const sunits: Unit[] | null = get_supported_units(pcity);
  if (sunits == null) return null;
  const items: UnitItem[] = [];
  for (const punit of sunits) {
    const sprite = get_unit_image_sprite(punit);
    if (sprite == null) continue;
    items.push({ id: punit['id'] as number, sprite, title: get_unit_city_info(punit) });
  }
  return items;
}

/** Determine city state: Celebrating, Disorder, or Peace. */
export function get_city_state(pcity: City | null): string | undefined {
  if (pcity == null) return;

  if (pcity['was_happy'] && pcity['size'] >= 3) {
    return "Celebrating";
  } else if (pcity['unhappy']) {
    return "Disorder";
  } else {
    return "Peace";
  }
}

export interface ProductionListData {
  hasData: boolean;
  units: Array<{ type: UnitType; cost: number }>;
  improvements: Array<{ impr: Improvement; cost: number | string }>;
}

/** Build a list of units and improvements this city can currently produce.
 *  Returns hasData=false if the server hasn't sent can_build_* BitVectors. */
export function buildProductionListData(pcity: City): ProductionListData {
  const hasData = typeof pcity['can_build_unit'] !== 'undefined';

  const units: ProductionListData['units'] = [];
  const improvements: ProductionListData['improvements'] = [];

  for (const id in store.unitTypes) {
    const ut: UnitType = store.unitTypes[Number(id)];
    // Filter non-player-buildable units using flags (replaces hardcoded name hack).
    const utFlags = ut['flags'] as number[] | { isSet(n: number): boolean } | null | undefined;
    const providesRansom = Array.isArray(utFlags)
      ? utFlags.includes(UTYF_PROVIDES_RANSOM)
      : (utFlags != null && typeof utFlags.isSet === 'function' && utFlags.isSet(UTYF_PROVIDES_RANSOM));
    if (providesRansom) continue;
    if (hasData) {
      if (!canCityBuildUnitNow(pcity, Number(id))) continue;
    } else {
      if (!canCityBuildUnitDirect(pcity, ut)) continue;
    }
    units.push({ type: ut, cost: ut['build_cost'] as number });
  }

  for (const id in store.improvements) {
    const impr: Improvement = store.improvements[Number(id)];
    if (hasData) {
      if (!canCityBuildImprovementNow(pcity, Number(id))) continue;
    } else {
      if (!canCityBuildImprovementDirect(pcity, impr)) continue;
    }
    const cost = impr['name'] === 'Coinage' ? '-' : impr['build_cost'];
    improvements.push({ impr, cost });
  }

  return { hasData, units, improvements };
}

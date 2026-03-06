import { store } from '../data/store';
import type { City, Unit } from '../data/types';
import {
  getCityProductionTypeSprite as get_city_production_type_sprite,
  getCityProductionTime as get_city_production_time,
  getProductionProgress as get_production_progress,
  getCityProductionType as get_city_production_type,
  cityPopulation as city_population,
  cityTurnsToGrowthText as city_turns_to_growth_text,
  cityOwner
} from '../data/city';
import { get_supported_units, tile_units, get_unit_city_info } from '../data/unit';
import { get_unit_image_sprite, get_improvement_image_sprite } from '../renderer/tilespec';
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

/** Format population, size, granary, and growth text for the city info panel. */
export function formatCitySize(pcity: City, governorText: string): string {
  return "Population: " + numberWithCommas(city_population(pcity) * 1000) + "<br>"
    + "Size: " + pcity['size'] + "<br>"
    + "Granary: " + pcity['food_stock'] + "/" + pcity['granary_size'] + "<br>"
    + "Change in: " + city_turns_to_growth_text(pcity) + governorText;
}

/** Format the production type name (e.g. "Producing: Warriors"). */
export function formatProductionOverview(pcity: City): string {
  const prod_type = get_city_production_type_sprite(pcity);
  return "Producing: " + (prod_type != null ? prod_type['type']['name'] : "None");
}

/** Format turns-to-complete string for current production. */
export function formatProductionTurns(pcity: City): string {
  const turns_to_complete = get_city_production_time(pcity);
  if (turns_to_complete != FC_INFINITY) {
    return turns_to_complete + " turns &nbsp;&nbsp;(" + get_production_progress(pcity) + ")";
  } else {
    return "-";
  }
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

/** Generate the improvements list HTML for a city. */
export function buildImprovementsHtml(pcity: City): string {
  let improvements_html: string = "";
  for (let z = 0; z < ((store.rulesControl as any)?.num_impr_types ?? 0); z++) {
    if (pcity['improvements'] != null && (pcity['improvements'] as any).isSet(z)) {
      const sprite: SpriteInfo | null = get_improvement_image_sprite(store.improvements[z]);
      if (sprite == null) {
        console.log("Missing sprite for improvement " + z);
        continue;
      }

      improvements_html = improvements_html +
        "<div id='city_improvement_element'><div style='background: transparent url("
        + sprite['image-src'] +
        ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
        + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;float:left; '"
        + "title=\"" + store.improvements[z]['helptext'] + "\" "
        + "onclick='city_sell_improvement(" + z + ");'>"
        + "</div>" + store.improvements[z]['name'] + "</div>";
    }
  }
  return improvements_html;
}

/** Generate the present units list HTML for a city. */
export function buildPresentUnitsHtml(pcity: City): string | null {
  const punits: Unit[] | null = tile_units(cityTile(pcity));
  if (punits == null) return null;

  let present_units_html: string = "";
  for (let r = 0; r < punits.length; r++) {
    const punit = punits[r];
    const sprite = get_unit_image_sprite(punit);
    if (sprite == null) {
      console.log("Missing sprite for " + punit);
      continue;
    }

    present_units_html = present_units_html +
      "<div class='game_unit_list_item' title='" + get_unit_city_info(punit)
      + "' style='cursor:pointer;cursor:hand; background: transparent url("
      + sprite['image-src'] +
      ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
      + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;float:left; '"
      + " onclick='city_dialog_activate_unit(units[" + punit['id'] + "]);'"
      + "></div>";
  }
  return present_units_html;
}

/** Generate the supported units list HTML for a city. */
export function buildSupportedUnitsHtml(pcity: City): string | null {
  const sunits: Unit[] | null = get_supported_units(pcity);
  if (sunits == null) return null;

  let supported_units_html: string = "";
  for (let t = 0; t < sunits.length; t++) {
    const punit = sunits[t];
    const sprite = get_unit_image_sprite(punit);
    if (sprite == null) {
      console.log("Missing sprite for " + punit);
      continue;
    }

    supported_units_html = supported_units_html +
      "<div class='game_unit_list_item' title='" + get_unit_city_info(punit)
      + "' style='cursor:pointer;cursor:hand; background: transparent url("
      + sprite['image-src'] +
      ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
      + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;float:left; '"
      + " onclick='city_dialog_activate_unit(units[" + punit['id'] + "]);'"
      + "></div>";
  }
  return supported_units_html;
}

/** Generate the specialist/citizen HTML for a city. Requires a sprite lookup callback to avoid DOM dependency. */
export function buildSpecialistHtml(
  pcity: City,
  getSpecialistSprite: (key: string) => SpriteInfo | null
): string {
  let specialist_html: string = "";
  const citizen_types: string[] = ["angry", "unhappy", "content", "happy"];
  for (let s = 0; s < citizen_types.length; s++) {
    if ((pcity as any)['ppl_' + citizen_types[s]] == null) continue;
    for (let i = 0; i < (pcity as any)['ppl_' + citizen_types[s]][FEELING_FINAL]; i++) {
      const sprite = getSpecialistSprite("citizen." + citizen_types[s] + "_"
        + (i % 2));
      if (sprite == null) continue;
      specialist_html = specialist_html +
        "<div class='specialist_item' style='background: transparent url("
        + sprite['image-src'] +
        ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
        + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;float:left; '"
        + " title='One " + citizen_types[s] + " citizen'></div>";
    }
  }

  for (let u = 0; u < (pcity as any)['specialists_size']; u++) {
    const spec_type_name: string = store.specialists[u]['plural_name'] as string;
    const spec_gfx_key: string = "specialist." + (store.specialists[u]['rule_name'] as string) + "_0";
    for (let j = 0; j < (pcity as any)['specialists'][u]; j++) {
      const sprite = getSpecialistSprite(spec_gfx_key);
      if (sprite == null) continue;
      specialist_html = specialist_html +
        "<div class='specialist_item' style='cursor:pointer;cursor:hand; background: transparent url("
        + sprite['image-src'] +
        ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
        + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;float:left; '"
        + " onclick='city_change_specialist(" + pcity['id'] + "," + store.specialists[u]['id'] + ");'"
        + " title='" + spec_type_name + " (click to change)'></div>";
    }
  }
  specialist_html += "<div style='clear: both;'></div>";
  return specialist_html;
}

/** Generate the city list table HTML for the city overview screen. */
export function buildCityListHtml(): { html: string; count: number } {
  let city_list_html: string = "<table class='tablesorter' id='city_table' border=0 cellspacing=0>"
    + "<thead><tr><th>Name</th><th>Population</th><th>Size</th><th>State</th>"
    + "<th>Granary</th><th>Grows In</th><th>Producing</th>"
    + "<th>Surplus<br>Food/Prod/Trade</th><th>Economy<br>Gold/Luxury/Science</th></tr></thead><tbody>";
  let count: number = 0;
  for (const city_id in cities) {
    const pcity: City = cities[city_id as any];
    if (clientPlaying() != null && cityOwner(pcity) != null && cityOwner(pcity).playerno == clientPlaying()!.playerno) {
      count++;
      const prod_type = get_city_production_type(pcity);
      let turns_to_complete_str: string;
      if (get_city_production_time(pcity) == FC_INFINITY) {
        turns_to_complete_str = "-"; //client does not know how long production will take yet.
      } else {
        turns_to_complete_str = get_city_production_time(pcity) + " turns";
      }

      city_list_html += "<tr class='cities_row' id='cities_list_" + pcity['id'] + "' onclick='javascript:show_city_dialog_by_id(" + pcity['id'] + ");'><td>"
        + pcity['name'] + "</td><td>" + numberWithCommas(city_population(pcity) * 1000) +
        "</td><td>" + pcity['size'] + "</td><td>" + get_city_state(pcity) + "</td><td>" + pcity['food_stock'] + "/" + pcity['granary_size'] +
        "</td><td>" + city_turns_to_growth_text(pcity) + "</td>" +
        "<td>" + prod_type!['name'] + " (" + turns_to_complete_str + ")" +
        "</td><td>" + pcity['surplus'][O_FOOD] + "/" + pcity['surplus'][O_SHIELD] + "/" + pcity['surplus'][O_TRADE] + "</td>" +
        "<td>" + pcity['prod'][O_GOLD] + "/" + pcity['prod'][O_LUXURY] + "/" + pcity['prod'][O_SCIENCE] + "<td>";

      city_list_html += "</tr>";
    }
  }

  city_list_html += "</tbody></table>";
  return { html: city_list_html, count };
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

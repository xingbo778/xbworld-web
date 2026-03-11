/**
 * Pure logic functions extracted from techDialog.ts.
 * This module must have ZERO DOM access.
 */

import { store } from '../data/store';
import { isTechReqForTech as is_tech_req_for_tech } from '../data/tech';
import { tileset_tech_graphic_tag } from '../renderer/tilespec';
import { tileset_name } from '../renderer/tilesetConfig';
import { getTilesetFileExtension as get_tileset_file_extention, isSmallScreen as is_small_screen } from '../utils/helpers';
import { get_units_from_tech } from '../data/unittype';
import { get_improvements_from_tech } from '../data/improvement';
import { research_get } from '../data/player';
import { move_points_text } from '../data/unit';
import { reqtree } from '../data/reqtree';
import type { ReqTreeNode } from '../data/reqtree';
import type { Tech, UnitType, Improvement } from '../data/types';

// These constants are duplicated here to avoid circular imports; they match techDialog.ts
const tech_xscale = 1.2;

/** Returns the active tech tree layout (dynamic if available, static fallback). */
function getActiveLayout(): Record<string, ReqTreeNode> {
  return (store.computedReqtree as Record<string, ReqTreeNode> | null) ?? reqtree;
}
const tech_item_width = 208;
const tech_item_height = 52;

/**
 * Build the descriptive text for a tech advance (units, improvements, follow-on techs).
 * Pure string formatting - no DOM access.
 */
export function get_advances_text(
  tech_id: number,
  techs: Record<string, Tech>,
): string {
  const num = (value: number | null) => value === null ? 'null' : value;
  const tech_span = (name: string, unit_id: number | null, impr_id: number | null, title?: string) =>
    `<span ${title ? `title='${title}'` : ''}`
    + ` data-action='tech-info' data-name='${name}' data-unit='${num(unit_id)}' data-impr='${num(impr_id)}'>${name}</span>`;

  const activeLayout = getActiveLayout();
  const is_valid_and_required = (next_tech_id: string) =>
    Object.prototype.hasOwnProperty.call(activeLayout, next_tech_id) && is_tech_req_for_tech(tech_id, parseInt(next_tech_id));

  const format_list_with_intro = (intro: string, list: (string | undefined)[]) =>
    (list = list.filter(Boolean) as string[]).length ? (intro + ' ' + list.join(', ')) : '';

  const ptech = techs[tech_id];

  return tech_span(ptech.name, null, null) + ' (' + Math.floor(ptech['cost'] as number) + ')'
    + format_list_with_intro(' allows',
      [
        format_list_with_intro('building unit', get_units_from_tech(tech_id)
          .map((unit: UnitType) => tech_span(unit.name, unit.id, null, unit['helptext'] as string))),
        format_list_with_intro('building', get_improvements_from_tech(tech_id)
          .map((impr: Improvement) => tech_span(impr.name, null, impr.id, impr['helptext'] as string))),
        format_list_with_intro('researching', Object.keys(techs)
          .filter(is_valid_and_required)
          .map((tid: string) => techs[tid])
          .map((tech: Tech) => tech_span(tech.name, null, null)))
      ]) + '.';
}

/**
 * Build an HTML string for a tech info box entry.
 * Pure string builder - no DOM access.
 */
export function get_tech_infobox_html(
  tech_id: number,
  techs: Record<string, Tech>,
  smallScreen: boolean,
): string | null {
  let infobox_html = "";
  const ptech = techs[tech_id];
  const tag = tileset_tech_graphic_tag(ptech);

  if (tag == null) return null;
  const tileset_x: number = store.tileset[tag][0];
  const tileset_y: number = store.tileset[tag][1];
  const width: number = store.tileset[tag][2];
  const height: number = store.tileset[tag][3];
  const i: number = store.tileset[tag][4];
  const image_src: string = "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + get_tileset_file_extention() + "?ts=" + Date.now();

  // Use the logic version of get_advances_text for the title attribute
  const advancesText = get_advances_text(tech_id, techs);

  if (smallScreen) {
    infobox_html += "<div class='specific_tech' data-action='player-research' data-techid='" + tech_id + "' title='"
      + advancesText.replace(/(<([^>]+)>)/ig, "") + "'>"
      + ptech['name']
      + "</div>";
  } else {
    infobox_html += "<div class='specific_tech' data-action='player-research' data-techid='" + tech_id + "' title='"
      + advancesText.replace(/(<([^>]+)>)/ig, "") + "'>"
      + "<div class='tech_infobox_image' style='background: transparent url("
      + image_src
      + ");background-position:-" + tileset_x + "px -" + tileset_y
      + "px;  width: " + width + "px;height: " + height + "px;'"
      + "></div>"
      + ptech['name']
      + "</div>";
  }

  return infobox_html;
}

/**
 * Find the tech_id at given mouse coordinates in the tech tree canvas.
 * Returns the tech_id (as number) or null if nothing was hit.
 * Pure hit-test logic - no DOM access.
 */
export function findTechAtPosition(
  mouseX: number,
  mouseY: number,
  smallScreen: boolean,
  techs: Record<string, Tech>,
): number | null {
  const activeLayout = getActiveLayout();
  for (const tech_id in techs) {
    if (!(tech_id + '' in activeLayout)) continue;

    let x: number = Math.floor(activeLayout[tech_id + '']['x'] * tech_xscale) + 2;
    let y: number = activeLayout[tech_id + '']['y'] + 2;

    if (smallScreen) {
      x = x * 0.6;
      y = y * 0.6;
    }

    if (mouseX > x && mouseX < x + tech_item_width
      && mouseY > y && mouseY < y + tech_item_height) {
      return techs[tech_id]['id'];
    }
  }
  return null;
}

// ── Structured data types for Preact dialog components ────────────────────────

/** Shape of one entry in the wiki-docs.json map. */
export interface WikiDoc {
  title: string;
  image: string | null;
  summary: string;
}

/** Resolved data ready for rendering a Wikipedia dialog. */
export interface WikiDialogData {
  techName: string;
  title: string;
  wikiUrl: string;
  imageUrl: string | null;
  summary: string;
}

/** Stats for a single unit type, ready for rendering (no DOM needed). */
export interface UnitInfoData {
  name: string;
  helptext: string;
  build_cost: number;
  attack_strength: number;
  defense_strength: number;
  firepower: number;
  hp: number;
  move_rate_text: string;
  vision_radius_sq: number;
}

/** Everything a TechInfoDialog needs to render. */
export interface TechInfoDialogData {
  techName: string;
  unit: UnitInfoData | null;
  improvement: { name: string; helptext: string } | null;
  wiki: WikiDialogData | null;
}

/**
 * Build structured data for the Wikipedia dialog.
 * Returns null when no wiki entry exists for the given tech name.
 * Pure — no DOM access.
 */
export function buildWikiDialogData(
  tech_name: string,
  docs: Record<string, WikiDoc>,
): WikiDialogData | null {
  const doc = docs[tech_name];
  if (!doc) return null;
  return {
    techName: tech_name,
    title: doc.title,
    wikiUrl: `http://en.wikipedia.org/wiki/${doc.title}`,
    imageUrl: doc.image ? `/images/wiki/${doc.image}` : null,
    summary: doc.summary,
  };
}

/**
 * Build structured data for the tech-info dialog (unit + improvement + wiki).
 * Pure — no DOM access.
 */
export function buildTechInfoDialogData(
  tech_name: string,
  unit_type_id: number | null,
  improvement_id: number | null,
  docs: Record<string, WikiDoc>,
): TechInfoDialogData {
  let unit: UnitInfoData | null = null;
  if (unit_type_id != null) {
    const punit_type = store.unitTypes[unit_type_id];
    if (punit_type) {
      unit = {
        name: punit_type['name'] as string,
        helptext: (punit_type['helptext'] as string) ?? '',
        build_cost: punit_type['build_cost'] as number,
        attack_strength: punit_type['attack_strength'] as number,
        defense_strength: punit_type['defense_strength'] as number,
        firepower: punit_type['firepower'] as number,
        hp: punit_type['hp'] as number,
        move_rate_text: move_points_text(punit_type['move_rate'] as number),
        vision_radius_sq: punit_type['vision_radius_sq'] as number,
      };
    }
  }

  let improvement: { name: string; helptext: string } | null = null;
  if (improvement_id != null) {
    const impr = store.improvements[improvement_id];
    if (impr) {
      improvement = {
        name: (impr['name'] as string) ?? '',
        helptext: (impr['helptext'] as string) ?? '',
      };
    }
  }

  return {
    techName: tech_name,
    unit,
    improvement,
    wiki: buildWikiDialogData(tech_name, docs),
  };
}

/**
 * Build the HTML string for the observer tech dialog.
 * Pure string builder - no DOM access.
 * @deprecated Superseded by the Preact TechPanel component (TechDialog.tsx).
 */
export function buildObserverTechHtml(): string {
  let msg = '<h2 style="margin:0 0 12px 0;color:#e6edf3">Research Progress</h2>';
  msg += '<div style="display:flex;flex-direction:column;gap:8px">';
  for (const player_id in store.players) {
    const pplayer = store.players[player_id];
    const pname: string = pplayer['name'];
    const pr = research_get(pplayer);
    if (pr == null) continue;

    const researching: number = pr['researching'];
    const techData = store.techs[researching];
    const bulbs = pr['bulbs_researched'] ?? 0;
    const cost = pr['researching_cost'] ?? 1;
    const pct = Math.min(100, Math.round((bulbs / cost) * 100));

    const nation = store.nations[pplayer['nation']];
    const color = nation?.['color'] ?? '#888';

    msg += '<div style="background:rgba(30,35,45,0.8);border:1px solid #30363d;border-radius:6px;padding:8px 12px">';
    msg += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">';
    msg += '<span style="font-weight:600;color:' + color + '">' + pname + '</span>';
    if (techData != null) {
      msg += '<span style="color:#8b949e;font-size:12px">' + techData['name'] + ' (' + bulbs + '/' + cost + ')</span>';
    } else {
      msg += '<span style="color:#8b949e;font-size:12px">None</span>';
    }
    msg += '</div>';
    msg += '<div style="background:#21262d;border-radius:3px;height:8px;overflow:hidden">';
    msg += '<div style="background:' + color + ';height:100%;width:' + pct + '%;border-radius:3px;transition:width 0.3s"></div>';
    msg += '</div>';
    msg += '</div>';
  }
  msg += '</div>';
  return msg;
}

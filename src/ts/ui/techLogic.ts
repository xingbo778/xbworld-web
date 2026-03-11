/**
 * Pure logic functions extracted from techDialog.ts.
 * This module must have ZERO DOM access.
 */

import { store } from '../data/store';
import { isTechReqForTech as is_tech_req_for_tech } from '../data/tech';
import { get_units_from_tech } from '../data/unittype';
import { get_improvements_from_tech } from '../data/improvement';
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


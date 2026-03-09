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
import { reqtree } from '../data/reqtree';
import type { Tech, UnitType, Improvement } from '../data/types';

// These constants are duplicated here to avoid circular imports; they match techDialog.ts
const tech_xscale = 1.2;
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

  const is_valid_and_required = (next_tech_id: string) =>
    reqtree.hasOwnProperty(next_tech_id) && is_tech_req_for_tech(tech_id, parseInt(next_tech_id));

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
  for (const tech_id in techs) {
    if (!(tech_id + '' in reqtree)) continue;

    let x: number = Math.floor(reqtree[tech_id + '']['x'] * tech_xscale) + 2;
    let y: number = reqtree[tech_id + '']['y'] + 2;

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

/**
 * Build the HTML string for the observer tech dialog.
 * Pure string builder - no DOM access.
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

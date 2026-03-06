import { EventAggregator } from '../utils/EventAggregator';
import { setActiveTab } from './tabs';
import { store } from '../data/store';
import { playerInventionState as player_invention_state, techIdByName as tech_id_by_name, TECH_KNOWN, TECH_UNKNOWN, TECH_PREREQS_KNOWN } from '../data/tech';
import { getCurrentBulbsOutput as get_current_bulbs_output, getCurrentBulbsOutputText as get_current_bulbs_output_text } from '../data/tech';
import { isTechReqForGoal as is_tech_req_for_goal, isTechReqForTech as is_tech_req_for_tech } from '../data/tech';
import { update_net_bulbs } from '../ui/rates';
import { tileset_tech_graphic_tag, tileset_unit_type_graphic_tag, tileset_building_graphic_tag } from '../renderer/tilespec';
import { tileset_name } from '../renderer/tilesetConfig';
import { getTilesetFileExtension as get_tileset_file_extention } from '../utils/helpers';
import { mapview_put_tile } from '../renderer/mapview';
import { sendPlayerResearch, sendPlayerTechGoal } from '../net/commands';
import { clientState as client_state, C_S_RUNNING } from '../client/clientState';
import { clientIsObserver as client_is_observer, clientPlaying } from '../client/clientState';
import { isSmallScreen as is_small_screen } from '../utils/helpers';
import { move_points_text } from '../data/unit';
import { get_units_from_tech } from '../data/unittype';
import { get_improvements_from_tech } from '../data/improvement';
import { research_get } from '../data/player';
import { reqtree, reqtree_civ2civ3, reqtree_multiplayer } from '../data/reqtree';
// Wiki docs loaded lazily via fetch to avoid 363KB in initial bundle
let _wikiDocsLoaded = false;
function loadWikiDocs(): void {
  if (_wikiDocsLoaded) return;
  _wikiDocsLoaded = true;
  fetch('/javascript/wiki-docs.json')
    .then(r => r.json())
    .then(data => { store.freecivWikiDocs = data; })
    .catch(() => { /* wiki docs unavailable, non-critical */ });
}
// Wiki docs are loaded on-demand when the user first opens tech info
const freeciv_wiki_docs = new Proxy({} as Record<string, any>, {
  get: (_target, prop: string) => (store.freecivWikiDocs || {})[prop],
});
import { mouse_x, mouse_y } from '../core/control/controlState';

function byId(id: string): HTMLElement | null { return document.getElementById(id); }
function setHtml(id: string, html: string): void { const el = byId(id); if (el) el.innerHTML = html; }

export const techs: { [key: string]: any } = {};
export const techcoststyle1: { [key: string]: any } = {};

export let tech_canvas_text_font: string = "18px Arial";

export let is_tech_tree_init: boolean = false;
export let tech_dialog_active: boolean = false;
export function setTechDialogActive(v: boolean): void { tech_dialog_active = v; }

export const tech_xscale: number = 1.2;
export const wikipedia_url: string = "http://en.wikipedia.org/wiki/";

export const AR_ONE: number = 0;
export const AR_TWO: number = 1;
export const AR_ROOT: number = 2;
export const AR_SIZE: number = 3;


export const TF_BONUS_TECH: number = 0; /* player gets extra tech if rearched first */
export const TF_BRIDGE: number = 1;    /* "Settler" unit types can build bridges over rivers */
export const TF_RAILROAD: number = 2;  /* "Settler" unit types can build rail roads */
export const TF_POPULATION_POLLUTION_INC: number = 3;  /* Increase the pollution factor created by population by one */
export const TF_FARMLAND: number = 4;  /* "Settler" unit types can build farmland */
export const TF_BUILD_AIRBORNE: number = 5; /* Player can build air units */
export const TF_LAST: number = 6;

/*
  [kept for amusement and posterity]
typedef int Tech_type_id;
  Above typedef replaces old "enum tech_type_id"; see comments about
  Unit_type_id in unit.h, since mainly apply here too, except don't
  use Tech_type_id very widely, and don't use (-1) flag values. (?)
*/
/* [more accurately]
 * Unlike most other indices, the Tech_type_id is widely used, because it
 * so frequently passed to packet and scripting.  The client menu routines
 * sometimes add and substract these numbers.
 */
export const A_NONE: number = 0;
export const A_FIRST: number = 1;
export const MAX_NUM_ADVANCES: number = 1000; // Assuming a reasonable max value
export const A_LAST: number = (MAX_NUM_ADVANCES + 1);
export const A_FUTURE: number = (A_LAST + 1);
export const A_UNSET: number = (A_LAST + 2);
export const A_UNKNOWN: number = (A_LAST + 3);
export const A_LAST_REAL: number = A_UNKNOWN;

export const A_NEVER: null = null;

export let tech_canvas: HTMLCanvasElement | null = null;
export let tech_canvas_ctx: CanvasRenderingContext2D | null = null;

export const tech_item_width: number = 208;
export const tech_item_height: number = 52;
export let maxleft: number = 0;
export let clicked_tech_id: number | null = null;

export const bulbs_output_updater: any = new EventAggregator(update_bulbs_output_info, 250,
                                               EventAggregator.DP_NONE,
                                               250, 3, 250);

/**************************************************************************
  Returns state of the tech for current pplayer.
  This can be: TECH_KNOWN, TECH_UNKNOWN, or TECH_PREREQS_KNOWN
  Should be called with existing techs or A_FUTURE

  If pplayer is NULL this checks whether any player knows the tech (used
  by the client).
**************************************************************************/

export function init_tech_screen(): void {
  if (is_small_screen()) tech_canvas_text_font = "20px Arial";
  const techEl = byId('technologies');
  if (techEl) {
    techEl.style.width = (window.innerWidth - 20) + 'px';
    techEl.style.height = (window.innerHeight - techEl.getBoundingClientRect().top - 15) + 'px';
  }

  if (is_tech_tree_init) return;

  // Assuming ruleset_control is globally available or imported
  // if (ruleset_control['name'] == "Civ2Civ3 ruleset") reqtree = reqtree_civ2civ3;
  // if (ruleset_control['name'] == "Multiplayer ruleset") reqtree = reqtree_multiplayer;
  // if (ruleset_control['name'] == "Longturn-Web-X ruleset") reqtree = reqtree_multiplayer;

  tech_canvas = document.getElementById('tech_canvas') as HTMLCanvasElement;
  if (tech_canvas == null) {
    console.log("unable to find tech canvas.");
    return;
  }
  tech_canvas_ctx = tech_canvas.getContext("2d");
  if (tech_canvas_ctx && "imageSmoothingEnabled" in tech_canvas_ctx) {
    // if this Boolean value is false, images won't be smoothed when scaled. This property is true by default.
    tech_canvas_ctx.imageSmoothingEnabled = false;
  }

  let max_width: number = 0;
  let max_height: number = 0;
  for (let tech_id in techs) {
    if (!(tech_id + '' in reqtree) || reqtree[tech_id + ''] == null) {
      continue;
    }
    let x: number = reqtree[tech_id + '']['x'];
    let y: number = reqtree[tech_id + '']['y'];
    if (x > max_width) max_width = x;
    if (y > max_height) max_height = y;
  }

  tech_canvas.width = (max_width + tech_item_width) * tech_xscale;
  tech_canvas.height = max_height + tech_item_height;

  if (is_small_screen()) {
    tech_canvas.width = Math.floor(tech_canvas.width * 0.6);
    tech_canvas.height = Math.floor(tech_canvas.height * 0.6);
    if (tech_canvas_ctx) {
      tech_canvas_ctx.scale(0.6, 0.6);
    }
    const trt = byId('tech_result_text'); if (trt) trt.style.fontSize = '85%';
    const tch = byId('tech_color_help'); if (tch) tch.style.fontSize = '65%';
    const tpb = byId('tech_progress_box'); if (tpb) tpb.style.paddingLeft = '10px';
  }

  is_tech_tree_init = true;
  clicked_tech_id = null;
}

export function update_tech_tree(): void {
  if (!tech_canvas_ctx) return;

  const hy: number = 24;
  const hx: number = 48 + 160;

  tech_canvas_ctx.clearRect(0, 0, 5824, 726);

  for (let tech_id in techs) {
    const ptech = techs[tech_id];
    if (!(tech_id + '' in reqtree) || reqtree[tech_id + ''] == null) {
      continue;
    }

    const sx: number = Math.floor(reqtree[tech_id + '']['x'] * tech_xscale);  //scale in X direction.
    const sy: number = reqtree[tech_id + '']['y'];
    for (let i: number = 0; i < ptech['research_reqs'].length; i++) {
      const rid: number = ptech['research_reqs'][i]['value'];
      if (rid == 0 || reqtree[rid + ''] == null) continue;

      const dx: number = Math.floor(reqtree[rid + '']['x'] * tech_xscale);  //scale in X direction.
      const dy: number = reqtree[rid + '']['y'];

      tech_canvas_ctx.strokeStyle = 'rgba(70, 70, 70, 0.8)';
      tech_canvas_ctx.lineWidth = 3;

      tech_canvas_ctx.beginPath();
      tech_canvas_ctx.moveTo(sx, sy + hy);
      tech_canvas_ctx.lineTo(dx + hx, dy + hy);
      tech_canvas_ctx.stroke();
    }
  }

  tech_canvas_ctx.lineWidth = 1;

  for (let tech_id in techs) {
    const ptech = techs[tech_id];
    if (!(tech_id + '' in reqtree) || reqtree[tech_id + ''] == null) {
      console.log("tech not found");
      continue;
    }

    const x: number = Math.floor(reqtree[tech_id + '']['x'] * tech_xscale) + 2;  //scale in X direction.
    const y: number = reqtree[tech_id + '']['y'] + 2;

    /* KNOWN TECHNOLOGY */
    if (player_invention_state(clientPlaying(), ptech['id']) == TECH_KNOWN) {

      const tag = tileset_tech_graphic_tag(ptech);
      tech_canvas_ctx.fillStyle = 'rgb(255, 255, 255)';
      tech_canvas_ctx.fillRect(x - 2, y - 2, tech_item_width, tech_item_height);
      tech_canvas_ctx.strokeStyle = 'rgb(225, 225, 225)';
      tech_canvas_ctx.strokeRect(x - 2, y - 2, tech_item_width, tech_item_height);
      mapview_put_tile(tech_canvas_ctx, tag ?? '', x + 1, y);

      tech_canvas_ctx.font = tech_canvas_text_font;
      tech_canvas_ctx.fillStyle = "rgba(0, 0, 0, 1)";
      tech_canvas_ctx.fillText(ptech['name'], x + 50, y + 15);

      if (x > maxleft) maxleft = x;


      /* TECH WITH KNOWN PREREQS. */
    } else if (player_invention_state(clientPlaying(), ptech['id']) == TECH_PREREQS_KNOWN) {
      let bgcolor: string = (clientPlaying() != null && is_tech_req_for_goal(ptech['id'], clientPlaying()['tech_goal'])) ? "rgb(131, 170, 101)" : "rgb(91, 130, 61)";
      if (clientPlaying()['researching'] == ptech['id']) {
        bgcolor = "rgb(161, 200, 131)";
        tech_canvas_ctx.lineWidth = 6;
      }

      const tag = tileset_tech_graphic_tag(ptech);
      tech_canvas_ctx.lineWidth = 4;
      tech_canvas_ctx.fillStyle = bgcolor;
      tech_canvas_ctx.fillRect(x - 2, y - 2, tech_item_width, tech_item_height);
      tech_canvas_ctx.strokeStyle = 'rgb(255, 255, 255)';
      tech_canvas_ctx.strokeRect(x - 2, y - 2, tech_item_width, tech_item_height);
      tech_canvas_ctx.lineWidth = 2;
      mapview_put_tile(tech_canvas_ctx, tag ?? '', x + 1, y);

      if (clientPlaying()['researching'] == ptech['id']) {
        tech_canvas_ctx.fillStyle = 'rgb(0, 0, 0)';
        tech_canvas_ctx.font = "Bold " + tech_canvas_text_font;
      } else {
        tech_canvas_ctx.font = tech_canvas_text_font;
        tech_canvas_ctx.fillStyle = 'rgb(255, 255, 255)';
      }
      tech_canvas_ctx.fillText(ptech['name'], x + 51, y + 16);

      /* UNKNOWN TECHNOLOGY. */
    } else if (player_invention_state(clientPlaying(), ptech['id']) == TECH_UNKNOWN) {
      let bgcolor: string = (clientPlaying() != null && is_tech_req_for_goal(ptech['id'], clientPlaying()['tech_goal'])) ? "rgb(111, 141, 180)" : "rgb(61, 95, 130)";
      if (clientPlaying()['tech_goal'] == ptech['id']) {
        tech_canvas_ctx.lineWidth = 6;
      }

      const tag = tileset_tech_graphic_tag(ptech);
      tech_canvas_ctx.fillStyle = bgcolor;
      tech_canvas_ctx.fillRect(x - 2, y - 2, tech_item_width, tech_item_height);
      tech_canvas_ctx.strokeStyle = 'rgb(255, 255, 255)';
      tech_canvas_ctx.strokeRect(x - 2, y - 2, tech_item_width, tech_item_height);
      tech_canvas_ctx.lineWidth = 2;
      mapview_put_tile(tech_canvas_ctx, tag ?? '', x + 1, y);

      if (clientPlaying()['tech_goal'] == ptech['id']) {
        tech_canvas_ctx.fillStyle = 'rgb(0, 0, 0)';
        tech_canvas_ctx.font = "Bold " + tech_canvas_text_font;
      } else {
        tech_canvas_ctx.fillStyle = 'rgb(255, 255, 255)';
        tech_canvas_ctx.font = tech_canvas_text_font;
      }
      tech_canvas_ctx.fillText(ptech['name'], x + 51, y + 16);
    }

    let tech_things: number = 0;
    const prunits = get_units_from_tech(Number(tech_id));
    for (let i: number = 0; i < prunits.length; i++) {
      const utype = prunits[i];
      const tag2 = tileset_unit_type_graphic_tag(utype);
      const sprite = tag2 != null ? store.sprites[tag2] : null;
      if (sprite != null) {
        tech_canvas_ctx.drawImage(sprite, x + 50 + ((tech_things++) * 30), y + 23, 28, 24);
      }
    }

    const primprovements = get_improvements_from_tech(Number(tech_id));
    for (let i: number = 0; i < primprovements.length; i++) {
      const pimpr = primprovements[i];
      const tag3 = tileset_building_graphic_tag(pimpr);
      const sprite = tag3 != null ? store.sprites[tag3] : null;
      if (sprite != null) {
        tech_canvas_ctx.drawImage(sprite, x + 50 + ((tech_things++) * 30), y + 23, 28, 24);
      }
    }
  }
}

export function update_tech_screen(): void {

  if (client_is_observer() || clientPlaying() == null) {
    show_observer_tech_dialog();
    return;
  }

  init_tech_screen();
  update_tech_tree();


  let research_goal_text: string = "No research target selected.<br>Please select a technology now";
  if (techs[clientPlaying()['researching']] != null) {
    research_goal_text = "Researching: " + techs[clientPlaying()['researching']]['name'];
  }
  if (techs[clientPlaying()['tech_goal']] != null) {
    research_goal_text = research_goal_text + "<br>Research Goal: "
      + techs[clientPlaying()['tech_goal']]['name'];
  }
  setHtml('tech_goal_box', research_goal_text);

  setHtml('tech_progress_text', "Research progress: "
    + clientPlaying()['bulbs_researched']
    + " / "
    + clientPlaying()['researching_cost']);

  const pct_progress: number = 100 * (clientPlaying()['bulbs_researched']
    / clientPlaying()['researching_cost']);

  const progressFg = byId('progress_fg');
  if (progressFg) progressFg.style.width = pct_progress + '%';

  if (clicked_tech_id != null) {
    setHtml('tech_result_text', "<span id='tech_advance_helptext'>" + get_advances_text(clicked_tech_id) + "</span>");
  } else if (techs[clientPlaying()['researching']] != null) {
    setHtml('tech_result_text', "<span id='tech_advance_helptext'>" + get_advances_text(clientPlaying()['researching']) + "</span>");
  }

  const techTabItem = byId('tech_tab_item');
  if (techTabItem) techTabItem.style.color = '#000000';

  /* scroll the tech tree, so that the current research targets are on the screen..  */
  maxleft = maxleft - 280;
  if (maxleft < 0) maxleft = 0;
  if (!tech_dialog_active) {
    setTimeout(scroll_tech_tree, 10);
  }

  tech_dialog_active = true;

}

export function get_advances_text(tech_id: number): string {
  const num = (value: number | null) => value === null ? 'null' : value;
  const tech_span = (name: string, unit_id: number | null, impr_id: number | null, title?: string) =>
    `<span ${title ? `title='${title}'` : ''}`
    + ` onclick='show_tech_info_dialog("${name}", ${num(unit_id)}, ${num(impr_id)})'>${name}</span>`;

  const is_valid_and_required = (next_tech_id: string) =>
    reqtree.hasOwnProperty(next_tech_id) && is_tech_req_for_tech(tech_id, parseInt(next_tech_id));

  const format_list_with_intro = (intro: string, list: (string | undefined)[]) =>
    (list = list.filter(Boolean) as string[]).length ? (intro + ' ' + list.join(', ')) : '';

  const ptech = techs[tech_id];

  return tech_span(ptech.name, null, null) + ' (' + Math.floor(ptech.cost) + ')'
    + format_list_with_intro(' allows',
      [
        format_list_with_intro('building unit', get_units_from_tech(tech_id)
          .map((unit: any) => tech_span(unit.name, unit.id, null, unit.helptext))),
        format_list_with_intro('building', get_improvements_from_tech(tech_id)
          .map((impr: any) => tech_span(impr.name, null, impr.id, impr.helptext))),
        format_list_with_intro('researching', Object.keys(techs)
          .filter(is_valid_and_required)
          .map((tid: string) => techs[tid])
          .map((tech: any) => tech_span(tech.name, null, null)))
      ]) + '.';
}

export function scroll_tech_tree(): void {
  const el = byId('technologies');
  if (el) el.scrollLeft = maxleft;
}

export function send_player_research(tech_id: number): void {
  sendPlayerResearch(tech_id);
  byId('tech_dialog')?.remove();
}

export function send_player_tech_goal(tech_id: number): void {
  sendPlayerTechGoal(tech_id);
}

export function tech_mapview_mouse_click(e: MouseEvent): void {

  let rightclick: boolean;
  if (!e) {
    e = window.event as MouseEvent;
  }
  if (e.which) {
    rightclick = (e.which == 3);
  } else if (e.button) {
    rightclick = (e.button == 2);
  } else {
    rightclick = false;
  }

  if (rightclick) {
    const techEl = byId('technologies');
    if (techEl) {
      if (mouse_x > window.innerWidth / 2) {
        techEl.scrollLeft += 150;
      } else {
        techEl.scrollLeft -= 150;
      }
    }
    return;
  }

  if (tech_canvas != null) {
    const techEl = byId('technologies')!;
    const rect = techEl.getBoundingClientRect();
    const tech_mouse_x: number = mouse_x - rect.left + techEl.scrollLeft;
    const tech_mouse_y: number = mouse_y - rect.top + techEl.scrollTop;

    for (let tech_id in techs) {
      const ptech = techs[tech_id];
      if (!(tech_id + '' in reqtree)) continue;

      let x: number = Math.floor(reqtree[tech_id + '']['x'] * tech_xscale) + 2;  //scale in X direction.
      let y: number = reqtree[tech_id + '']['y'] + 2;

      if (is_small_screen()) {
        x = x * 0.6;
        y = y * 0.6;
      }

      if (tech_mouse_x > x && tech_mouse_x < x + tech_item_width
        && tech_mouse_y > y && tech_mouse_y < y + tech_item_height) {
        if (player_invention_state(clientPlaying(), ptech['id']) == TECH_PREREQS_KNOWN) {
          send_player_research(ptech['id']);
        } else if (player_invention_state(clientPlaying(), ptech['id']) == TECH_UNKNOWN) {
          send_player_tech_goal(ptech['id']);
        }
        clicked_tech_id = ptech['id'];
      }
    }
  }

  update_tech_screen();

}

export function get_tech_infobox_html(tech_id: number): string | null {
  let infobox_html: string = "";
  const ptech = techs[tech_id];
  const tag = tileset_tech_graphic_tag(ptech);

  if (tag == null) return null;
  const tileset_x: number = store.tileset[tag][0];
  const tileset_y: number = store.tileset[tag][1];
  const width: number = store.tileset[tag][2];
  const height: number = store.tileset[tag][3];
  const i: number = store.tileset[tag][4];
  const image_src: string = "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + get_tileset_file_extention() + "?ts=" + (window as any).ts;
  if (is_small_screen()) {
    infobox_html += "<div class='specific_tech' onclick='send_player_research(" + tech_id + ");' title='"
      + get_advances_text(tech_id).replace(/(<([^>]+)>)/ig, "") + "'>"
      + ptech['name']
      + "</div>";
  } else {
    infobox_html += "<div class='specific_tech' onclick='send_player_research(" + tech_id + ");' title='"
      + get_advances_text(tech_id).replace(/(<([^>]+)>)/ig, "") + "'>"
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

export function check_queued_tech_gained_dialog(): void {
  // PBEM mode removed - no-op
}

export function queue_tech_gained_dialog(tech_gained_id: number): void {
  if (client_is_observer() || C_S_RUNNING != client_state()) return;
  show_tech_gained_dialog(tech_gained_id);

}

export function show_tech_gained_dialog(tech_gained_id: number): void {
  if (client_is_observer() || C_S_RUNNING != client_state()) return;

  const tti = byId('tech_tab_item');
  if (tti) tti.style.color = '#aa0000';
  const pplayer = clientPlaying();
  const tech = techs[tech_gained_id];
  if (tech == null) return;

  const title: string = tech['name'] + " discovered!";
  let message: string = "The " + store.nations[pplayer['nation']]['adjective'] + " have discovered " + tech['name'] + ".<br>";
  message += "<span id='tech_advance_helptext'>" + get_advances_text(tech_gained_id) + "</span>";

  const tech_choices: any[] = [];
  for (let next_tech_id in techs) {
    const ntech = techs[next_tech_id];
    if (!(next_tech_id + '' in reqtree)) continue;
    if (player_invention_state(clientPlaying(), ntech['id']) == TECH_PREREQS_KNOWN) {
      tech_choices.push(ntech);
    }
  }

  message += "<br>You can now research:<br><div id='tech_gained_choice'>";
  for (let i: number = 0; i < tech_choices.length; i++) {
    const html = get_tech_infobox_html(tech_choices[i]['id']);
    if (html) message += html;
  }
  message += "</div>";

  byId('tech_dialog')?.remove();
  const dlg = document.createElement('div');
  dlg.id = 'tech_dialog';
  dlg.style.cssText = 'position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:10%;left:50%;transform:translateX(-50%);width:' + (is_small_screen() ? '90%' : '60%') + ';max-height:80vh;overflow-y:auto;color:#fff;';

  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  titleEl.style.margin = '0 0 8px';
  dlg.appendChild(titleEl);

  const body = document.createElement('div');
  body.innerHTML = message;
  dlg.appendChild(body);

  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'margin-top:8px;display:flex;gap:8px;';
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', function() { dlg.remove(); (byId('game_text_input') as HTMLElement)?.blur(); });
  const treeBtn = document.createElement('button');
  treeBtn.textContent = 'Show Technology Tree';
  treeBtn.addEventListener('click', function() { setActiveTab('#tabs', 2); update_tech_screen(); dlg.remove(); });
  btnContainer.appendChild(closeBtn);
  btnContainer.appendChild(treeBtn);
  dlg.appendChild(btnContainer);

  byId('game_page')?.appendChild(dlg);
  (byId('game_text_input') as HTMLElement)?.blur();

}

export function show_wikipedia_dialog(tech_name: string): void {
  loadWikiDocs();
  const tti = byId('tech_tab_item'); if (tti) tti.style.color = '#aa0000';
  if (freeciv_wiki_docs == null || freeciv_wiki_docs[tech_name] == null) return;

  let message: string = "<b>Wikipedia on <a href='" + wikipedia_url
    + freeciv_wiki_docs[tech_name]['title']
    + "' target='_new'>" + freeciv_wiki_docs[tech_name]['title']
    + "</a></b><br>";
  if (freeciv_wiki_docs[tech_name]['image'] != null) {
    message += "<img id='wiki_image' src='/images/wiki/" + freeciv_wiki_docs[tech_name]['image'] + "'><br>";
  }
  message += freeciv_wiki_docs[tech_name]['summary'];

  byId('wiki_dialog')?.remove();
  const dlg = document.createElement('div');
  dlg.id = 'wiki_dialog';
  dlg.style.cssText = 'position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:10%;left:50%;transform:translateX(-50%);width:' + (is_small_screen() ? '90%' : '60%') + ';max-height:' + (window.innerHeight - 100) + 'px;overflow-y:auto;color:#fff;';
  const titleEl = document.createElement('h3');
  titleEl.textContent = tech_name;
  titleEl.style.margin = '0 0 8px';
  dlg.appendChild(titleEl);
  const body = document.createElement('div');
  body.innerHTML = message;
  dlg.appendChild(body);
  const okBtn = document.createElement('button');
  okBtn.textContent = 'Ok';
  okBtn.style.marginTop = '8px';
  okBtn.addEventListener('click', function() { dlg.remove(); });
  dlg.appendChild(okBtn);
  byId('game_page')?.appendChild(dlg);
  (byId('game_text_input') as HTMLElement)?.blur();
}

export function show_tech_info_dialog(tech_name: string, unit_type_id: number | null, improvement_id: number | null): void {
  loadWikiDocs();
  const tti = byId('tech_tab_item'); if (tti) tti.style.color = '#aa0000';

  let message: string = "";
  if (unit_type_id != null) {
    const punit_type = store.unitTypes[unit_type_id];
    message += "<b>Unit info</b>: " + punit_type['helptext'] + "<br><br>"
      + "Cost: " + punit_type['build_cost']
      + "<br>Attack: " + punit_type['attack_strength']
      + "<br>Defense: " + punit_type['defense_strength']
      + "<br>Firepower: " + punit_type['firepower']
      + "<br>Hitpoints: " + punit_type['hp']
      + "<br>Moves: " + move_points_text(punit_type['move_rate'])
      + "<br>Vision: " + punit_type['vision_radius_sq']
      + "<br><br>";
  }
  if (improvement_id != null) message += "<b>Improvement info</b>: " + store.improvements[improvement_id]['helptext'] + "<br><br>";
  if (freeciv_wiki_docs[tech_name] != null) {
    message += "<b>Wikipedia on <a href='" + wikipedia_url
      + freeciv_wiki_docs[tech_name]['title']
      + "' target='_new' style='color: black;'>" + freeciv_wiki_docs[tech_name]['title']
      + "</a>:</b><br>";
    if (freeciv_wiki_docs[tech_name]['image'] != null) {
      message += "<img id='wiki_image' src='/images/wiki/" + freeciv_wiki_docs[tech_name]['image'] + "'><br>";
    }
    message += freeciv_wiki_docs[tech_name]['summary'];
  }

  byId('wiki_dialog')?.remove();
  const dlg = document.createElement('div');
  dlg.id = 'wiki_dialog';
  dlg.style.cssText = 'position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:10%;left:50%;transform:translateX(-50%);width:' + (is_small_screen() ? '95%' : '70%') + ';height:' + (window.innerHeight - 60) + 'px;overflow-y:auto;color:#fff;';
  const titleEl = document.createElement('h3');
  titleEl.textContent = tech_name;
  titleEl.style.margin = '0 0 8px';
  dlg.appendChild(titleEl);
  const body = document.createElement('div');
  body.innerHTML = message;
  dlg.appendChild(body);
  const okBtn = document.createElement('button');
  okBtn.textContent = 'Ok';
  okBtn.style.marginTop = '8px';
  okBtn.addEventListener('click', function() { dlg.remove(); });
  dlg.appendChild(okBtn);
  byId('game_page')?.appendChild(dlg);
  (byId('game_text_input') as HTMLElement)?.blur();
}

export function update_tech_dialog_cursor(): void {
  if (!tech_canvas) return;

  tech_canvas.style.cursor = "default";
  const techEl = byId('technologies')!;
  const rect = techEl.getBoundingClientRect();
  const tech_mouse_x: number = mouse_x - rect.left + techEl.scrollLeft;
  const tech_mouse_y: number = mouse_y - rect.top + techEl.scrollTop;

  for (let tech_id in techs) {
    const ptech = techs[tech_id];
    if (!(tech_id + '' in reqtree)) continue;

    let x: number = Math.floor(reqtree[tech_id + '']['x'] * tech_xscale) + 2;  //scale in X direction.
    let y: number = reqtree[tech_id + '']['y'] + 2;

    if (is_small_screen()) {
      x = x * 0.6;
      y = y * 0.6;
    }

    if (tech_mouse_x > x && tech_mouse_x < x + tech_item_width
      && tech_mouse_y > y && tech_mouse_y < y + tech_item_height) {
      if (player_invention_state(clientPlaying(), ptech['id']) == TECH_PREREQS_KNOWN) {
        tech_canvas.style.cursor = "pointer";
      } else if (player_invention_state(clientPlaying(), ptech['id']) == TECH_UNKNOWN) {
        tech_canvas.style.cursor = "pointer";
      } else {
        tech_canvas.style.cursor = "not-allowed";
      }
      setHtml('tech_result_text', "<span id='tech_advance_helptext'>" + get_advances_text(ptech['id']) + "</span>");
    }
  }
}

export function show_observer_tech_dialog(): void {
  const techInfoBox = document.getElementById('tech_info_box');
  const techCanvas = document.getElementById('tech_canvas');
  const technologies = document.getElementById('technologies');
  if (techInfoBox) techInfoBox.style.display = 'none';
  if (techCanvas) techCanvas.style.display = 'none';
  let msg: string = '<h2 style="margin:0 0 12px 0;color:#e6edf3">Research Progress</h2>';
  msg += '<div style="display:flex;flex-direction:column;gap:8px">';
  for (let player_id in store.players) {
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
  if (technologies) {
    technologies.innerHTML = msg;
    technologies.style.color = '#e6edf3';
  }
}

export function update_bulbs_output_info(): void {
  const cbo = get_current_bulbs_output();
  const el = document.getElementById('bulbs_output');
  if (el) el.innerHTML = get_current_bulbs_output_text(cbo);
  update_net_bulbs(cbo.self_bulbs - cbo.self_upkeep);
}

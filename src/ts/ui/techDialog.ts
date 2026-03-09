/**
 * techDialog — observer-mode shim.
 *
 * Player-only canvas tech tree (init_tech_screen, update_tech_tree, scroll_tech_tree,
 * tech_mapview_mouse_click, update_tech_dialog_cursor) are replaced with no-ops.
 *
 * Observer path: update_tech_screen() opens the Preact TechDialog signal.
 * show_tech_info_dialog() and show_wikipedia_dialog() are kept as they are
 * observer-useful (used via window globals from helpdata onclick strings).
 */

import { EventAggregator } from '../utils/EventAggregator';
import { store } from '../data/store';
import { getCurrentBulbsOutput as get_current_bulbs_output, getCurrentBulbsOutputText as get_current_bulbs_output_text } from '../data/tech';
import { sendPlayerResearch } from '../net/commands';
import { clientIsObserver as client_is_observer, clientState as client_state, C_S_RUNNING } from '../client/clientState';
import { isSmallScreen as is_small_screen } from '../utils/helpers';
import { move_points_text } from '../data/unit';
import { get_advances_text as _get_advances_text } from './techLogic';
import { setHtml as domSetHtml } from '../utils/dom';
import { refreshTechPanel } from '../components/Dialogs/TechDialog';
import { globalEvents } from '../core/events';
import type { Tech } from '../data/types';

// ---------------------------------------------------------------------------
// Re-export tech constants that other modules import from here
// (originally defined here; now canonical home is data/tech.ts)
// ---------------------------------------------------------------------------
export {
  AR_ONE, AR_TWO, AR_ROOT, AR_SIZE,
  TF_BONUS_TECH, TF_BRIDGE, TF_RAILROAD, TF_POPULATION_POLLUTION_INC,
  TF_FARMLAND, TF_BUILD_AIRBORNE, TF_LAST,
  A_NONE, A_FIRST,
} from '../data/tech';

export const MAX_NUM_ADVANCES: number = 1000;
export const A_LAST: number = MAX_NUM_ADVANCES + 1;
export const A_FUTURE: number = A_LAST + 1;
export const A_UNSET: number = A_LAST + 2;
export const A_UNKNOWN: number = A_LAST + 3;
export const A_LAST_REAL: number = A_UNKNOWN;
export const A_NEVER: null = null;
export const wikipedia_url: string = 'http://en.wikipedia.org/wiki/';

// ---------------------------------------------------------------------------
// Runtime state (read by net/handlers and control/mouse)
// ---------------------------------------------------------------------------
export const techs: Record<string, Tech> = {};

export let tech_dialog_active: boolean = false;
export function setTechDialogActive(v: boolean): void { tech_dialog_active = v; }

// ---------------------------------------------------------------------------
// Bulbs updater (called by net handlers)
// ---------------------------------------------------------------------------
export const bulbs_output_updater: EventAggregator = new EventAggregator(
  update_bulbs_output_info, 250, EventAggregator.DP_NONE, 250, 3, 250
);
globalEvents.on('tech:bulbsUpdate', () => bulbs_output_updater?.update());

export function update_bulbs_output_info(): void {
  const cbo = get_current_bulbs_output();
  const el = document.getElementById('bulbs_output');
  if (el) domSetHtml(el, get_current_bulbs_output_text(cbo));
}

// ---------------------------------------------------------------------------
// update_tech_screen — refreshes the TechPanel in the Research tab
// ---------------------------------------------------------------------------
export function update_tech_screen(): void {
  tech_dialog_active = true;
  refreshTechPanel();
}

// ---------------------------------------------------------------------------
// get_advances_text — used by helpdata.ts to build help text
// ---------------------------------------------------------------------------
export function get_advances_text(tech_id: number): string {
  return _get_advances_text(tech_id, techs);
}

// ---------------------------------------------------------------------------
// queue_tech_gained_dialog — no-op for observer
// ---------------------------------------------------------------------------
export function queue_tech_gained_dialog(tech_gained_id: number): void {
  if (client_is_observer() || C_S_RUNNING !== client_state()) return;
  // player-only: show tech gained dialog (stubbed in observer mode)
}

// ---------------------------------------------------------------------------
// send_player_research — observer guard; kept for window global
// ---------------------------------------------------------------------------
export function send_player_research(tech_id: number): void {
  if (client_is_observer()) return;
  sendPlayerResearch(tech_id);
  document.getElementById('tech_dialog')?.remove();
}

// ---------------------------------------------------------------------------
// Wiki / tech info dialogs — observer-useful (show unit/improvement info)
// ---------------------------------------------------------------------------

// Wiki docs loaded lazily on first use
let _wikiDocsLoaded = false;
function loadWikiDocs(): void {
  if (_wikiDocsLoaded) return;
  _wikiDocsLoaded = true;
  fetch('/javascript/wiki-docs.json')
    .then(r => r.json())
    .then(data => { store.freecivWikiDocs = data; })
    .catch(() => { /* non-critical */ });
}

function getWikiDoc(tech_name: string): { image: string | null; summary: string; title: string } | undefined {
  return (store.freecivWikiDocs || {})[tech_name];
}

function byId(id: string): HTMLElement | null { return document.getElementById(id); }

export function show_wikipedia_dialog(tech_name: string): void {
  loadWikiDocs();
  const doc = getWikiDoc(tech_name);
  if (!doc) return;

  let message = `<b>Wikipedia on <a href='${wikipedia_url}${doc.title}' target='_new'>${doc.title}</a></b><br>`;
  if (doc.image) message += `<img id='wiki_image' src='/images/wiki/${doc.image}'><br>`;
  message += doc.summary;

  byId('wiki_dialog')?.remove();
  const dlg = Object.assign(document.createElement('div'), { id: 'wiki_dialog' });
  dlg.style.cssText = `position:fixed;z-index:5000;background:var(--xb-bg-secondary,#161b22);border:1px solid var(--xb-border-default,#30363d);padding:16px;top:10%;left:50%;transform:translateX(-50%);width:${is_small_screen() ? '90%' : '60%'};max-height:${window.innerHeight - 100}px;overflow-y:auto;color:var(--xb-text-primary,#e6edf3);`;
  const titleEl = Object.assign(document.createElement('h3'), { textContent: tech_name });
  titleEl.style.margin = '0 0 8px';
  const body = document.createElement('div');
  domSetHtml(body, message);
  const okBtn = Object.assign(document.createElement('button'), { textContent: 'Ok' });
  okBtn.style.marginTop = '8px';
  okBtn.addEventListener('click', () => dlg.remove());
  dlg.append(titleEl, body, okBtn);
  byId('game_page')?.appendChild(dlg);
  (byId('game_text_input') as HTMLElement | null)?.blur();
}

export function show_tech_info_dialog(tech_name: string, unit_type_id: number | null, improvement_id: number | null): void {
  loadWikiDocs();

  let message = '';
  if (unit_type_id != null) {
    const punit_type = store.unitTypes[unit_type_id];
    if (punit_type) {
      message += `<b>Unit info</b>: ${punit_type['helptext']}<br><br>`
        + `Cost: ${punit_type['build_cost']}`
        + `<br>Attack: ${punit_type['attack_strength']}`
        + `<br>Defense: ${punit_type['defense_strength']}`
        + `<br>Firepower: ${punit_type['firepower']}`
        + `<br>Hitpoints: ${punit_type['hp']}`
        + `<br>Moves: ${move_points_text(punit_type['move_rate'])}`
        + `<br>Vision: ${punit_type['vision_radius_sq']}<br><br>`;
    }
  }
  if (improvement_id != null) message += `<b>Improvement info</b>: ${store.improvements[improvement_id]?.['helptext']}<br><br>`;

  const doc = getWikiDoc(tech_name);
  if (doc) {
    message += `<b>Wikipedia on <a href='${wikipedia_url}${doc.title}' target='_new' style='color:inherit'>${doc.title}</a>:</b><br>`;
    if (doc.image) message += `<img id='wiki_image' src='/images/wiki/${doc.image}'><br>`;
    message += doc.summary;
  }

  byId('wiki_dialog')?.remove();
  const dlg = Object.assign(document.createElement('div'), { id: 'wiki_dialog' });
  dlg.style.cssText = `position:fixed;z-index:5000;background:var(--xb-bg-secondary,#161b22);border:1px solid var(--xb-border-default,#30363d);padding:16px;top:10%;left:50%;transform:translateX(-50%);width:${is_small_screen() ? '95%' : '70%'};height:${window.innerHeight - 60}px;overflow-y:auto;color:var(--xb-text-primary,#e6edf3);`;
  const titleEl = Object.assign(document.createElement('h3'), { textContent: tech_name });
  titleEl.style.margin = '0 0 8px';
  const body = document.createElement('div');
  domSetHtml(body, message);
  const okBtn = Object.assign(document.createElement('button'), { textContent: 'Ok' });
  okBtn.style.marginTop = '8px';
  okBtn.addEventListener('click', () => dlg.remove());
  dlg.append(titleEl, body, okBtn);
  byId('game_page')?.appendChild(dlg);
  (byId('game_text_input') as HTMLElement | null)?.blur();
}

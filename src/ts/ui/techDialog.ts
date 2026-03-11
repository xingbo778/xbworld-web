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

import { store } from '../data/store';
import { sendPlayerResearch } from '../net/commands';
import { clientIsObserver as client_is_observer, clientState as client_state, C_S_RUNNING } from '../client/clientState';
import type { WikiDoc } from './techLogic';
import { refreshTechPanel, showWikiDialogPreact, showTechInfoDialogPreact } from '../components/Dialogs/TechDialog';
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
// update_tech_screen — refreshes the TechPanel in the Research tab
// ---------------------------------------------------------------------------
export function update_tech_screen(): void {
  tech_dialog_active = true;
  refreshTechPanel();
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
// Wiki / tech info dialogs — delegate to Preact components
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

function getWikiDocs(): Record<string, WikiDoc> {
  return (store.freecivWikiDocs || {}) as Record<string, WikiDoc>;
}

export function show_wikipedia_dialog(tech_name: string): void {
  loadWikiDocs();
  showWikiDialogPreact(tech_name, getWikiDocs());
}

export function show_tech_info_dialog(
  tech_name: string,
  unit_type_id: number | null,
  improvement_id: number | null,
): void {
  loadWikiDocs();
  showTechInfoDialogPreact(tech_name, unit_type_id, improvement_id, getWikiDocs());
}

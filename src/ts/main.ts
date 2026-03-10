/**
 * XBWorld Web Client — observer-mode entry point.
 *
 * Player-only features (diplomacy, CMA, rates, government, action dialogs,
 * worklist) have been removed. All remaining imports serve the observer workflow.
 */

import { logNormal } from './core/log';

console.log('[xbw] main.ts bundle starting');

// CSS design tokens
import './styles/tokens.css';

// ---------------------------------------------------------------------------
// Step 0: Ensure global data stores exist before any module runs.
// ---------------------------------------------------------------------------
const win = window as unknown as Record<string, unknown>;

// Data stores
if (!win['effects']) win['effects'] = {};
if (!win['specialists']) win['specialists'] = {};
if (!win['players']) win['players'] = {};
if (!win['research_data']) win['research_data'] = {};
if (win['game_info'] === undefined) win['game_info'] = null;
if (win['calendar_info'] === undefined) win['calendar_info'] = null;
if (win['game_rules'] === undefined) win['game_rules'] = null;
if (win['ruleset_control'] === undefined) win['ruleset_control'] = null;
if (win['ruleset_summary'] === undefined) win['ruleset_summary'] = null;
if (win['ruleset_description'] === undefined) win['ruleset_description'] = null;
if (!win['terrains']) win['terrains'] = {};
if (!win['resources']) win['resources'] = {};
if (!win['terrain_control']) win['terrain_control'] = {};
if (!win['governments']) win['governments'] = {};
if (win['requested_gov'] === undefined) win['requested_gov'] = -1;
if (!win['connections']) win['connections'] = {};
if (!win['conn_ping_info']) win['conn_ping_info'] = {};
if (!win['debug_ping_list']) win['debug_ping_list'] = [];
if (!win['actions']) win['actions'] = {};
if (!win['extras']) win['extras'] = {};
if (!win['roads']) win['roads'] = [];
if (!win['bases']) win['bases'] = [];
if (!win['unit_types']) win['unit_types'] = {};
if (!win['unit_classes']) win['unit_classes'] = {};
if (!win['tiles']) win['tiles'] = {};
if (!win['units']) win['units'] = {};
if (!win['cities']) win['cities'] = {};
if (!win['techs']) win['techs'] = {};
if (!win['nations']) win['nations'] = {};
if (!win['improvements']) win['improvements'] = {};
if (!win['map']) win['map'] = {};
if (!win['helpdata_order']) win['helpdata_order'] = [];
if (!win['helpdata']) win['helpdata'] = {};

// ---------------------------------------------------------------------------
// Step 2: Import all TS modules (order matters for initialization).
// ---------------------------------------------------------------------------

// Reactive signals layer
import './data/signals';

// Data layer
import './data/game';
import './data/unit';
import './data/player';
import './data/map';
import './data/tile';
import './data/terrain';
import './data/fcTypes';
import './data/actions';
import './data/extra';
import './data/requirements';
import './data/government';
import './data/eventConstants';
import './data/city';
import './data/tech';
import './data/nation';

// Utilities
import './utils/seedrandom';
import './utils/EventAggregator';
import './utils/bitvector';
import './utils/helpers';
import './utils/mobile';

// Network layer
import './net/packetConstants';
import './net/packhandlers';
import './net/connection';

// Client layer
import './client/clientState';
import './client/clientCore';
import './client/clientMain';
import './client/civClient';
import './client/clientDebug';

// Core layer
import './core/log';
import './core/messages';
import './core/overview';
import './core/pages';
import './core/control';
import './core/pregame';

// Renderer layer
import './renderer/mapctrl';
import './renderer/mapview';
import './renderer/mapviewCommon';
import './renderer/tilespec';

// Audio layer
import './audio/sounds';

// UI layer (observer-only subset)
import './ui/tabs';
import './ui/controls';
import './ui/cityDialog';
import './ui/techDialog';
import './ui/intelDialog';
import './ui/options';

// ---------------------------------------------------------------------------
// Step 3: Register event delegation actions (replaces window globals).
// ---------------------------------------------------------------------------
import './utils/eventDelegation';

// ---------------------------------------------------------------------------
// Step 4: Sync GameStore with window globals.
// ---------------------------------------------------------------------------
import { store } from './data/store';
import { set_client_state } from './client/clientState';
import { mark_all_dirty, mapview } from './renderer/mapviewCommon';
import { map_to_gui_pos } from './renderer/mapCoords';
import { redraw_overview } from './core/overview';

function syncStoreWithWindow(): void {
  const storeRec = store as unknown as Record<string, unknown>;
  const syncProps: [string, string][] = [
    ['tiles', 'tiles'],
    ['units', 'units'],
    ['cities', 'cities'],
    ['players', 'players'],
    ['terrains', 'terrains'],
    ['techs', 'techs'],
    ['nations', 'nations'],
    ['governments', 'governments'],
    ['improvements', 'improvements'],
    ['extras', 'extras'],
    ['connections', 'connections'],
    ['map', 'mapInfo'],
    ['unit_types', 'unitTypes'],
    ['game_info', 'gameInfo'],
    ['calendar_info', 'calendarInfo'],
    ['server_settings', 'serverSettings'],
    ['ruleset_control', 'rulesControl'],
    ['ruleset_summary', 'rulesSummary'],
    ['ruleset_description', 'rulesDescription'],
    ['civclient_state', 'civclientState'],
  ];

  for (const [globalName, storeProp] of syncProps) {
    const existing = win[globalName];
    if (existing !== undefined && existing !== null) {
      storeRec[storeProp] = existing;
    }
    try {
      Object.defineProperty(win, globalName, {
        get: () => storeRec[storeProp],
        set: (v: unknown) => { storeRec[storeProp] = v; },
        configurable: true,
        enumerable: true,
      });
    } catch {
      // defineProperty on window may fail in some environments
    }
  }
}

// ---------------------------------------------------------------------------
// Step 5: Initialize.
// ---------------------------------------------------------------------------
import { initControls } from './ui/controls';
import { mountPreactApp } from './components/App';
import { registerAction } from './utils/eventDelegation';
import { show_city_dialog_by_id } from './ui/cityDialog';
import { show_tech_info_dialog, send_player_research, show_wikipedia_dialog } from './ui/techDialog';
import { nationTableSelectPlayer } from './data/nation';
import { center_tile_id } from './renderer/mapviewCommon';
import { send_message } from './net/connection';

function init(): void {
  logNormal('[TS] XBWorld observer client loading...');

  // Event delegation actions (replace window globals)
  registerAction('show-city', (el) => show_city_dialog_by_id(Number(el.dataset['cityid'])));
  registerAction('tech-info', (el) => {
    const name = el.dataset['name'] ?? '';
    const unit = el.dataset['unit'] === 'null' ? null : Number(el.dataset['unit']);
    const impr = el.dataset['impr'] === 'null' ? null : Number(el.dataset['impr']);
    show_tech_info_dialog(name, unit, impr);
  });
  registerAction('player-research', (el) => send_player_research(Number(el.dataset['techid'])));
  registerAction('select-player', (el) => nationTableSelectPlayer(Number(el.dataset['playerno'])));
  registerAction('center-tile', (el) => center_tile_id(Number(el.dataset['tileid'])));
  registerAction('wiki-dialog', (el) => show_wikipedia_dialog(el.dataset['techname'] ?? ''));

  syncStoreWithWindow();
  logNormal('[TS] Store ↔ window globals synced');

  // Expose rendering helpers for E2E testing
  win['set_client_state'] = set_client_state;
  win['mark_all_dirty'] = mark_all_dirty;
  win['redraw_overview'] = redraw_overview;
  win['__store'] = store;
  win['send_message'] = send_message;
  // Expose renderer globals needed by unit.ts (declared as globals to avoid circular deps)
  win['map_to_gui_pos'] = map_to_gui_pos;
  Object.defineProperty(win, 'mapview', {
    get: () => mapview,
    configurable: true,
  });

  initControls();
  logNormal('[TS] Controls initialized');

  mountPreactApp();
  logNormal('[TS] Preact UI mounted');

  logNormal('[TS] XBWorld observer client ready');
}

init();

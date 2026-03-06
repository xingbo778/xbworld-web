/**
 * XBWorld Web Client — TS module entry point.
 *
 * All game logic is now in TypeScript modules. This entry point:
 *   1. Initializes global data stores on window.
 *   2. Patches missing WebGL stubs for 2D canvas mode.
 *   3. Imports all TS modules.
 *   4. Registers all exports to window via globalRegistry (transitional).
 *   5. Syncs the GameStore with window globals.
 */

import { logNormal } from './core/log';

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
if (!win['freeciv_wiki_docs']) win['freeciv_wiki_docs'] = {};

// ---------------------------------------------------------------------------
// Step 2: Import all TS modules (order matters for initialization).
// ---------------------------------------------------------------------------

// Reactive signals layer
import './data/signals';

// Data layer
import './data/game';
import './data/unit';
// unittype: no side effects, pulled in by import chain
import './data/player';
import './data/map';
import './data/tile';
import './data/terrain';
import './data/fcTypes';
import './data/actions';
import './data/extra';
// improvement: no side effects, pulled in by import chain
import './data/requirements';
import './data/government';
import './data/eventConstants';
import './data/city';
import './data/tech';
import './data/nation';
// reqtree: no side effects, pulled in by import chain
// wikiDoc: lazy-loaded by techDialog when needed (363KB)

// Utilities
import './utils/seedrandom';
import './utils/EventAggregator';
import './utils/bitvector';
import './utils/helpers';
// banlist: no side effects, pulled in by import chain
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
// tilesetConfig: no side effects, pulled in by import chain
import './renderer/tilespec';

// Audio layer
import './audio/sounds';

// UI layer
import './ui/tabs';
import './ui/GameDialog';
import './ui/game-dialog.css';
import './ui/controls';
import './ui/actionDialog';
import './ui/cityDialog';
import './ui/techDialog';
import './components/Dialogs/GovernmentDialog';
import './ui/cma';
import './ui/diplomacy';
import './ui/helpdata';
import './ui/intelDialog';
import './ui/options';
import './components/Dialogs/PillageDialog';
import './ui/rates';

// ---------------------------------------------------------------------------
// Step 3: Register all exports to window (transitional).
// ---------------------------------------------------------------------------
import './windowBridge';

// ---------------------------------------------------------------------------
// Step 4: Sync GameStore with window globals.
// ---------------------------------------------------------------------------
import { store } from './data/store';

function syncStoreWithWindow(): void {
  const storeAny = store as any;
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
  ];

  for (const [globalName, storeProp] of syncProps) {
    const existing = win[globalName];
    if (existing !== undefined && existing !== null) {
      storeAny[storeProp] = existing;
    }
    try {
      Object.defineProperty(win, globalName, {
        get: () => storeAny[storeProp],
        set: (v: unknown) => { storeAny[storeProp] = v; },
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
import { exposeGameDialog } from './ui/GameDialog';
import { initControls } from './ui/controls';
import { mountPreactApp } from './components/App';

function init(): void {
  logNormal('[TS] XBWorld TypeScript modules loading...');

  syncStoreWithWindow();
  logNormal('[TS] Store ↔ window globals synced');

  exposeGameDialog();
  logNormal('[TS] GameDialog component exposed');

  initControls();
  logNormal('[TS] Controls initialized');

  mountPreactApp();
  logNormal('[TS] Preact UI mounted');

  logNormal('[TS] XBWorld TypeScript modules ready');
}

init();

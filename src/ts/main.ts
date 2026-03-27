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
// Component utility classes (tables, panels, overlays, badges, etc.)
import '../styles/components.css';
import { setWindowValue } from './utils/windowBridge';

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
import './ui/cityDialog';
import './ui/techDialog';
import './ui/intelDialog';
import './ui/options';

// ---------------------------------------------------------------------------
// Step 3: Register event delegation actions (replaces window globals).
// ---------------------------------------------------------------------------
import './utils/eventDelegation';

// ---------------------------------------------------------------------------
// Step 4: Initialize testing/debug bridges.
// ---------------------------------------------------------------------------
import { store } from './data/store';
import { set_client_state } from './client/clientState';
import { mark_all_dirty } from './renderer/mapviewCommon';
import { _terrainBlendStats, resetTerrainBlendStats } from './renderer/tilespecTerrain';
import { redraw_overview } from './core/overview';
import { mapAllocate, mapInitTopology } from './data/map';

// ---------------------------------------------------------------------------
// Step 5: Initialize.
// ---------------------------------------------------------------------------
import { mountPreactApp } from './components/App';
import { registerAction } from './utils/eventDelegation';
import { show_city_dialog_by_id } from './ui/cityDialog';
import { show_tech_info_dialog, send_player_research, show_wikipedia_dialog } from './ui/techDialog';
import { showTaxRatesDialog } from './components/Dialogs/TaxRatesDialog';
import { nationTableSelectPlayer } from './data/nation';
import { center_tile_id } from './renderer/mapviewCommon';
import {
  send_message,
  getCurrentWebSocketForTests,
  getCivserverportForTests,
  forceCurrentWebSocketCloseForTests,
  getNetworkDebugState,
} from './net/connection';

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
  registerAction('show-tax-rates', () => showTaxRatesDialog());

  // Expose rendering helpers for E2E testing
  setWindowValue('set_client_state', set_client_state);
  setWindowValue('mark_all_dirty', mark_all_dirty);
  setWindowValue('redraw_overview', redraw_overview);
  setWindowValue('__store', store);
  // Expose terrain blend stats for A2 diagnostics / tests
  setWindowValue('__terrainBlendStats', _terrainBlendStats);
  setWindowValue('__resetTerrainBlendStats', resetTerrainBlendStats);
  setWindowValue('send_message', send_message);
  setWindowValue('__mapDebug', {
    setMapInfo(mapInfo: typeof store.mapInfo) {
      store.mapInfo = mapInfo;
    },
    mapInitTopology() {
      mapInitTopology(false);
    },
    mapAllocate,
  });
  setWindowValue('__networkDebug', {
    get ws() { return getCurrentWebSocketForTests(); },
    get civserverport() { return getCivserverportForTests(); },
    get state() { return getNetworkDebugState(); },
    forceClose(code: number, reason = '', wasClean = false) {
      return forceCurrentWebSocketCloseForTests(code, reason, wasClean);
    },
  });

  logNormal('[TS] Controls initialized');

  mountPreactApp();
  logNormal('[TS] Preact UI mounted');

  logNormal('[TS] XBWorld observer client ready');
}

init();

// Admin dashboard — mounted only when the host page provides a root element
if (document.getElementById('xb-admin-root')) {
  import('./components/AdminDashboard').then(m => m.mountAdminDashboard());
}

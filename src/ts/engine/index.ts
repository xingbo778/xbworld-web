/**
 * Engine barrel module — public API for game logic.
 * Components should import from '@/engine' instead of reaching into
 * individual data/net/client modules directly.
 */

// State & store
export { store } from '../data/store';
export type { ClientState } from '../data/store';

// Reactive signals — read .value in render bodies for auto re-render.
// Do NOT call globalEvents.on directly in components; use these signals instead.
export {
  gameInfo,
  calendarInfo,
  mapInfo,
  currentTurn,
  currentYear,
  playerCount,
  cityCount,
  unitCount,
  isObserver,
  connectedPlayer,
  rulesetReady,
  playerUpdated,
  researchUpdated,
  settingsUpdated,
  statusRefresh,
  pregameRefresh,
  connectionBanner,
  disconnectOverlay,
  turnDoneState,
  unitTextDetails,
  activeUnitInfo,
} from '../data/signals';
export type { DisconnectOverlayState } from '../data/signals';

// Client state
export {
  clientState,
  C_S_INITIAL,
  C_S_PREPARING,
  C_S_RUNNING,
  C_S_OVER,
} from '../client/clientState';

// Map helpers
export { mapPosToTile, mapstep } from '../data/map';
export { tileGetKnown, tileCity } from '../data/tile';
export { tileTerrain } from '../data/terrain';

// Types
export type {
  Tile,
  Terrain,
  Unit,
  UnitType,
  City,
  Player,
  Tech,
  Nation,
  Government,
  Improvement,
  Extra,
  GameInfo,
  MapInfo,
} from '../data/types';

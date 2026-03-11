/**
 * Reactive signals layer on top of GameStore.
 * Preact components subscribe to these signals for automatic re-rendering.
 * Legacy code continues to use window globals + store directly.
 */
import { signal, computed } from '@preact/signals';
import { store } from './store';
import { clientPlaying } from '../client/clientState';
import { globalEvents } from '../core/events';

// Game state signals
export const gameInfo = signal(store.gameInfo);
export const calendarInfo = signal(store.calendarInfo);
export const mapInfo = signal(store.mapInfo);

// Turn tracking
export const currentTurn = computed(() => gameInfo.value?.turn ?? 0);
export const currentYear = computed(() => {
  const gi = gameInfo.value;
  if (!gi) return '';
  const cal = calendarInfo.value;
  const year = gi.year ?? 0;
  if (year < 0) return `${-year} ${cal?.negative_year_label ?? 'BC'}`;
  return `${year} ${cal?.positive_year_label ?? 'AD'}`;
});

// Player counts
export const playerCount = signal(0);
export const cityCount = signal(0);
export const unitCount = signal(0);

// Client connection state
export const isObserver = signal(false);
export const connectedPlayer = signal<number | null>(null);

// Sync signals from events
function syncFromStore(): void {
  gameInfo.value = store.gameInfo;
  calendarInfo.value = store.calendarInfo;
  mapInfo.value = store.mapInfo;
  playerCount.value = Object.keys(store.players).length;
  cityCount.value = Object.keys(store.cities).length;
  unitCount.value = Object.keys(store.units).length;
  isObserver.value = store.observing;
  connectedPlayer.value = clientPlaying()?.playerno ?? null;
}

// Listen to global events that indicate data changes
globalEvents.on('game:info', syncFromStore);
globalEvents.on('game:beginturn', syncFromStore);
globalEvents.on('map:allocated', syncFromStore);
globalEvents.on('store:reset', syncFromStore);
globalEvents.on('tile:updated', () => {
  // Don't update all signals on every tile — just map info
  mapInfo.value = store.mapInfo;
});
globalEvents.on('city:updated', () => {
  cityCount.value = Object.keys(store.cities).length;
});
globalEvents.on('unit:updated', () => {
  unitCount.value = Object.keys(store.units).length;
});

/**
 * Ruleset-ready signal — incremented each time the server completes sending
 * ruleset packets (handle_rulesets_ready → 'rules:ready' event).
 *
 * Preact components that render government/unitClass/tech data should read
 * `rulesetReady.value` once inside their render body so Preact's signal
 * tracking automatically re-renders them when the ruleset becomes available,
 * without any manual globalEvents.on('rules:ready', ...) wiring.
 */
export const rulesetReady = signal(0);
globalEvents.on('rules:ready', () => { rulesetReady.value++; });

/**
 * Incremented whenever a player object is updated (player:updated event).
 * Components that display per-player data (NationOverview, etc.) subscribe
 * by reading `playerUpdated.value` inside their render body.
 */
export const playerUpdated = signal(0);
globalEvents.on('player:updated', () => { playerUpdated.value++; });

/**
 * Incremented whenever research state changes (player:research event).
 * TechPanel/TechTree subscribe to this so they re-render on each bulb update.
 */
export const researchUpdated = signal(0);
globalEvents.on('player:research', () => { researchUpdated.value++; });

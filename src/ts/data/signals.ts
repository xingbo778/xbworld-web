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

// ---------------------------------------------------------------------------
// A1 City demand optimization — smart cityCount tracking
//
// BEFORE: city:updated always called Object.keys(store.cities).length (O(n)),
//   which during a bulk city load (N cities at turn start) ran N × O(N) = O(N²)
//   times and triggered N Preact signal updates even when the count hadn't changed.
//   Example: 200-city game start → 200 × Object.keys(200) = 40,000 iterations.
//
// AFTER: track known city IDs in a Set; only update cityCount when the count
//   actually changes (new city added or existing city removed). Redundant updates
//   for existing-city refreshes are suppressed entirely.
//   Same 200-city game → 200 Set.has() checks + 200 Set.add() calls = O(N).
//   Re-render count drops from N to 1 (Preact still batches, but signal writes
//   now only occur on genuine count changes, not on every packet).
//
// Fallback: when city:updated fires without an ID (e.g. test-only patterns or
//   future callers that don't include packet data), fall back to Object.keys()
//   recount to maintain backward compatibility.
// ---------------------------------------------------------------------------

/** Set of city IDs we have already accounted for in cityCount. */
let _knownCityIds = new Set<number>();

/**
 * A1 City demand optimization metrics — exported for tests and observability.
 * Reset via _resetCityDemandMetrics() between test runs.
 */
export const _cityDemandMetrics = {
  /** Times cityCount signal was actually written (genuine count change). */
  cityCountUpdates: 0,
  /** Times a redundant city:updated was suppressed (city already known). */
  cityCountSuppressed: 0,
};

export function _resetCityDemandMetrics(): void {
  _cityDemandMetrics.cityCountUpdates = 0;
  _cityDemandMetrics.cityCountSuppressed = 0;
}

/** Rebuild _knownCityIds from current store state (used by syncFromStore). */
function _resyncKnownCityIds(): void {
  _knownCityIds = new Set(Object.keys(store.cities).map(Number));
}

// ---------------------------------------------------------------------------
// A2 Unit count optimization — mirrors A1 city tracking with Set.
//
// BEFORE: unit:updated/removed always called Object.keys(store.units).length
//   (O(n)). In a 500-unit game every unit move fired 500 property enumerations
//   and wrote the signal even if the count was unchanged.
//
// AFTER: track known unit IDs in a Set; only update unitCount when a new unit
//   appears or an existing one is removed. Redundant updates for in-place unit
//   refreshes (move, hp change, etc.) are suppressed entirely.
// ---------------------------------------------------------------------------

/** Set of unit IDs we have already accounted for in unitCount. */
let _knownUnitIds = new Set<number>();

function _resyncKnownUnitIds(): void {
  _knownUnitIds = new Set(Object.keys(store.units).map(Number));
}

// ---------------------------------------------------------------------------
// A3 Player count optimization — mirrors A1/A2 pattern.
//
// BEFORE: player:updated always called Object.keys(store.players).length (O(n))
//   and wrote playerCount even when an existing player was merely refreshed.
//
// AFTER: track known player numbers in a Set; only write playerCount on actual
//   join/leave, suppressing redundant signal writes for in-place updates.
// ---------------------------------------------------------------------------

/** Set of player numbers we have already accounted for in playerCount. */
let _knownPlayerNos = new Set<number>();

function _resyncKnownPlayerNos(): void {
  _knownPlayerNos = new Set(Object.keys(store.players).map(Number));
}

// Sync signals from events
function syncFromStore(): void {
  gameInfo.value = store.gameInfo;
  calendarInfo.value = store.calendarInfo;
  mapInfo.value = store.mapInfo;
  // Full resync: rebuild all known-ID sets and update counts once.
  _resyncKnownPlayerNos();
  playerCount.value = _knownPlayerNos.size;
  _resyncKnownCityIds();
  cityCount.value = _knownCityIds.size;
  _resyncKnownUnitIds();
  unitCount.value = _knownUnitIds.size;
  isObserver.value = store.observing;
  connectedPlayer.value = clientPlaying()?.playerno ?? null;
}

// Listen to global events that indicate data changes
globalEvents.on('game:info', syncFromStore);
globalEvents.on('game:beginturn', syncFromStore);
globalEvents.on('game:newyear', syncFromStore);
globalEvents.on('map:allocated', syncFromStore);
globalEvents.on('store:reset', syncFromStore);
globalEvents.on('player:removed', syncFromStore);
globalEvents.on('connection:updated', syncFromStore);
// calendarInfo arrives once before game:info; bridge directly so currentYear
// computes correctly even before the first game:info syncFromStore call.
globalEvents.on('game:calendar', () => { calendarInfo.value = store.calendarInfo; });
// tile:updated fires for every tile; no signal update needed (PixiRenderer
// handles dirty-marking directly via globalEvents.on in its own listener).
globalEvents.on('city:updated', (data: unknown) => {
  const id = (typeof data === 'object' && data !== null && 'id' in data)
    ? (data as { id?: unknown }).id
    : undefined;
  if (typeof id === 'number') {
    // Fast path: O(1) Set lookup — only update signal if this is a new city.
    if (!_knownCityIds.has(id)) {
      _knownCityIds.add(id);
      cityCount.value = _knownCityIds.size;
      _cityDemandMetrics.cityCountUpdates++;
    } else {
      // Existing city refreshed — count unchanged, suppress the signal write.
      _cityDemandMetrics.cityCountSuppressed++;
    }
  } else {
    // Fallback for callers that don't include packet data (e.g. legacy tests).
    _resyncKnownCityIds();
    cityCount.value = _knownCityIds.size;
    _cityDemandMetrics.cityCountUpdates++;
  }
});
globalEvents.on('city:removed', (data: unknown) => {
  // city:removed payload is the city ID (number) or an object with city_id.
  const id = typeof data === 'number' ? data
    : ((typeof data === 'object' && data !== null && 'city_id' in data)
      ? (data as { city_id?: unknown }).city_id as number | undefined
      : undefined);
  if (typeof id === 'number' && _knownCityIds.has(id)) {
    _knownCityIds.delete(id);
    cityCount.value = _knownCityIds.size;
    _cityDemandMetrics.cityCountUpdates++;
  } else {
    // Fallback: recount from scratch (ID missing or unknown).
    _resyncKnownCityIds();
    cityCount.value = _knownCityIds.size;
    _cityDemandMetrics.cityCountUpdates++;
  }
});
globalEvents.on('unit:updated', (data: unknown) => {
  const id = (data as Record<string, unknown>)?.['id'];
  if (typeof id === 'number') {
    if (!_knownUnitIds.has(id)) {
      _knownUnitIds.add(id);
      unitCount.value = _knownUnitIds.size;
    }
    // else: existing unit refreshed (move/hp/etc.) — count unchanged, suppress.
  } else {
    _resyncKnownUnitIds();
    unitCount.value = _knownUnitIds.size;
  }
});
globalEvents.on('unit:removed', (data: unknown) => {
  const id = typeof data === 'number' ? data
    : (data as Record<string, unknown>)?.['unit_id'] as number | undefined;
  if (typeof id === 'number' && _knownUnitIds.has(id)) {
    _knownUnitIds.delete(id);
    unitCount.value = _knownUnitIds.size;
  } else {
    _resyncKnownUnitIds();
    unitCount.value = _knownUnitIds.size;
  }
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
globalEvents.on('player:updated', (data: unknown) => {
  playerUpdated.value++;
  const no = (data as Record<string, unknown>)?.['playerno'];
  if (typeof no === 'number') {
    if (!_knownPlayerNos.has(no)) {
      _knownPlayerNos.add(no);
      playerCount.value = _knownPlayerNos.size;
    }
    // else: existing player refreshed — count unchanged, suppress.
  } else {
    _resyncKnownPlayerNos();
    playerCount.value = _knownPlayerNos.size;
  }
});

/**
 * Incremented whenever research state changes (player:research event).
 * TechPanel/TechTree subscribe to this so they re-render on each bulb update.
 */
export const researchUpdated = signal(0);
globalEvents.on('player:research', () => { researchUpdated.value++; });

/**
 * Incremented when server settings change (settings:updated event).
 * StatusPanel reads store.serverSettings.metamessage — subscribe to this
 * so it re-renders when the metamessage is updated.
 */
export const settingsUpdated = signal(0);
globalEvents.on('settings:updated', () => { settingsUpdated.value++; });

/**
 * Incremented by update_game_status_panel() to tell StatusPanel to re-render.
 * Decouples data/game.ts from components/StatusPanel.tsx (no circular import).
 */
export const statusRefresh = signal(0);

/**
 * Incremented when pregame lobby data changes (scenario info or player list).
 * PregameLobby component subscribes to trigger re-renders without circular deps.
 */
export const pregameRefresh = signal(0);

/**
 * Connection-banner state rendered by StatusPanel inside the status bar.
 * Set by connection.ts instead of imperatively prepending a DOM element.
 * null = no banner; otherwise show the text (and optionally a reload button).
 */
export const connectionBanner = signal<{ text: string; showReload: boolean } | null>(null);

/**
 * Disconnect overlay state — drives DisconnectOverlay.tsx.
 * null = no overlay; 'reconnecting' = countdown shown; 'disconnected' = give-up state.
 */
export type DisconnectOverlayState =
  | { phase: 'reconnecting'; attempt: number; max: number; countdown: number }
  | { phase: 'disconnected' };
export const disconnectOverlay = signal<DisconnectOverlayState | null>(null);

/**
 * Status panel layout — 'top' when the nav bar has room, 'bottom' otherwise.
 * Set by update_game_status_panel() in data/game.ts; used to show/hide the
 * two status panel containers via a CSS-class effect (no direct DOM style).
 */
export const statusPanelLayout = signal<'top' | 'bottom'>('top');

/**
 * Turn-done button state — driven by player turn lifecycle handlers.
 * A small Preact component (or effect) mounts into #turn_done_button.
 */
export const turnDoneState = signal<{ disabled: boolean; text: string }>({
  disabled: false,
  text: 'Turn Done',
});

/**
 * Unit-info line shown during goto path selection.
 * Set by gotoPath.ts; read by any HUD component mounted near unit info.
 */
export const unitTextDetails = signal<string>('');

/**
 * Active-unit info line (e.g. "Turns for goto: 3").
 * Set by gotoPath.ts update_goto_path().
 */
export const activeUnitInfo = signal<string>('');

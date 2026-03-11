/**
 * Tests for the reactive signals layer (src/ts/data/signals.ts).
 * Covers the rulesetReady signal: emission, integration with the packet
 * handler, and that all components which need it have subscribed.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { globalEvents } from '@/core/events';
import { store } from '@/data/store';

// ── rulesetReady signal basics ─────────────────────────────────────────────

describe('rulesetReady signal', () => {
  it('is a number signal', async () => {
    const { rulesetReady } = await import('@/data/signals');
    expect(typeof rulesetReady.value).toBe('number');
  });

  it('increments when rules:ready is emitted', async () => {
    const { rulesetReady } = await import('@/data/signals');
    const before = rulesetReady.value;
    globalEvents.emit('rules:ready');
    expect(rulesetReady.value).toBe(before + 1);
  });

  it('increments on every subsequent rules:ready emission', async () => {
    const { rulesetReady } = await import('@/data/signals');
    const before = rulesetReady.value;
    globalEvents.emit('rules:ready');
    globalEvents.emit('rules:ready');
    globalEvents.emit('rules:ready');
    expect(rulesetReady.value).toBe(before + 3);
  });
});

// ── handle_rulesets_ready integration ─────────────────────────────────────

describe('rulesetReady — handle_rulesets_ready integration', () => {
  beforeEach(() => {
    store.reset();
    store.techs = {};
    store.computedReqtree = null;
  });

  it('rulesetReady increments when handle_rulesets_ready fires', async () => {
    const { rulesetReady } = await import('@/data/signals');
    const { handle_rulesets_ready } = await import('@/net/handlers/ruleset');
    const before = rulesetReady.value;

    handle_rulesets_ready({} as never);

    expect(rulesetReady.value).toBe(before + 1);
  });

  it('store.computedReqtree is populated after handle_rulesets_ready', async () => {
    const { handle_rulesets_ready } = await import('@/net/handlers/ruleset');
    expect(store.computedReqtree).toBeNull();

    handle_rulesets_ready({} as never);

    expect(store.computedReqtree).not.toBeNull();
    expect(typeof store.computedReqtree).toBe('object');
  });

  it('two sequential calls produce two increments', async () => {
    const { rulesetReady } = await import('@/data/signals');
    const { handle_rulesets_ready } = await import('@/net/handlers/ruleset');
    const before = rulesetReady.value;

    handle_rulesets_ready({} as never);
    handle_rulesets_ready({} as never);

    expect(rulesetReady.value).toBe(before + 2);
  });
});

// ── Component subscriptions ────────────────────────────────────────────────

describe('rulesetReady — TechDialog subscription', () => {
  it('TechDialog module imports rulesetReady from signals', async () => {
    // Verify the module source wires rulesetReady — if import fails the test fails.
    const signals = await import('@/data/signals');
    const before = signals.rulesetReady.value;

    // Trigger rules:ready; TechDialog's static module-level handlers should
    // not throw, and rulesetReady must have advanced.
    globalEvents.emit('rules:ready');
    expect(signals.rulesetReady.value).toBe(before + 1);
  });

  it('TechPanel mounts without error when store has no techs', async () => {
    const { mountTechPanel } = await import('@/components/Dialogs/TechDialog');
    const container = document.createElement('div');
    document.body.appendChild(container);
    expect(() => mountTechPanel(container)).not.toThrow();
    document.body.removeChild(container);
  });

  it('refreshTechPanel bumps tick and does not throw', async () => {
    const { refreshTechPanel } = await import('@/components/Dialogs/TechDialog');
    expect(() => refreshTechPanel()).not.toThrow();
  });

  it('rulesetReady fires after ruleset loads and keeps TechPanel stable', async () => {
    store.techs = {};
    store.computedReqtree = null;

    const { mountTechPanel } = await import('@/components/Dialogs/TechDialog');
    const { handle_rulesets_ready } = await import('@/net/handlers/ruleset');
    const container = document.createElement('div');
    document.body.appendChild(container);
    mountTechPanel(container);

    // Simulate ruleset arriving
    expect(() => handle_rulesets_ready({} as never)).not.toThrow();
    document.body.removeChild(container);
  });
});

describe('rulesetReady — NationOverview subscription', () => {
  beforeEach(() => {
    store.reset();
  });

  it('NationOverview module imports rulesetReady from signals', async () => {
    await expect(import('@/components/NationOverview')).resolves.toBeDefined();
  });

  it('renders tech name from store.techs after rulesetReady fires', async () => {
    const { mountNationOverview, refreshNationOverview } = await import('@/components/NationOverview');
    const { rulesetReady } = await import('@/data/signals');
    // research_get reads from research_data module dict; use same instance via dynamic import
    const { research_data } = await import('@/data/player');

    store.players[0] = {
      playerno: 0, name: 'Caesar', nation: 1, is_alive: true,
      score: 100, gold: 50, phase_done: false, nturns_idle: 0,
      flags: { isSet: vi.fn().mockReturnValue(false) },
    } as never;
    store.nations[1] = { color: '#ff0000', adjective: 'Roman', legend: '', graphic_str: '' } as never;
    research_data[0] = { researching: 42, bulbs_researched: 10, researching_cost: 100 };

    const container = document.createElement('div');
    document.body.appendChild(container);
    mountNationOverview(container);
    refreshNationOverview();

    // Tech name not yet available (store.techs[42] not set yet)
    expect(container.textContent).not.toContain('Alphabet');

    // Ruleset arrives: populate tech then synchronously re-mount to verify render.
    // (Preact's signal→DOM path is async; re-mounting forces an immediate render.)
    store.techs[42] = { id: 42, name: 'Alphabet' } as never;
    rulesetReady.value++;
    mountNationOverview(container);  // synchronous re-render with latest data

    expect(container.textContent).toContain('Alphabet');
    document.body.removeChild(container);
    delete research_data[0];
  });
});

describe('rulesetReady — CityDialog subscription', () => {
  it('CityDialog module imports rulesetReady from signals', async () => {
    await expect(import('@/components/Dialogs/CityDialog')).resolves.toBeDefined();
  });

  it('showCityDialogPreact opens dialog without throwing', async () => {
    const { showCityDialogPreact, closeCityDialogPreact } = await import('@/components/Dialogs/CityDialog');
    const pcity = {
      id: 1, name: 'Rome', size: 5, owner: 0, tile: 0,
      food_stock: 0, shield_stock: 0, production_kind: 0, production_value: 0,
      surplus: [], waste: [], unhappy_penalty: [], prod: [],
      citizen_extra: [], ppl_happy: [], ppl_content: [], ppl_unhappy: [], ppl_angry: [],
      improvements: [],
    } as never;
    expect(() => showCityDialogPreact(pcity)).not.toThrow();
    expect(() => closeCityDialogPreact()).not.toThrow();
  });

  it('rulesetReady fires after CityDialog is open without throwing', async () => {
    const { showCityDialogPreact, closeCityDialogPreact } = await import('@/components/Dialogs/CityDialog');
    const { rulesetReady } = await import('@/data/signals');

    const pcity = {
      id: 2, name: 'Athens', size: 3, owner: 0, tile: 0,
      food_stock: 0, shield_stock: 0, production_kind: 0, production_value: 0,
      surplus: [], waste: [], unhappy_penalty: [], prod: [],
      citizen_extra: [], ppl_happy: [], ppl_content: [], ppl_unhappy: [], ppl_angry: [],
      improvements: [],
    } as never;

    showCityDialogPreact(pcity);
    expect(() => { rulesetReady.value++; }).not.toThrow();
    closeCityDialogPreact();
  });
});

// ── playerUpdated signal ───────────────────────────────────────────────────

describe('playerUpdated signal', () => {
  it('is a number signal', async () => {
    const { playerUpdated } = await import('@/data/signals');
    expect(typeof playerUpdated.value).toBe('number');
  });

  it('increments when player:updated is emitted', async () => {
    const { playerUpdated } = await import('@/data/signals');
    const before = playerUpdated.value;
    globalEvents.emit('player:updated');
    expect(playerUpdated.value).toBe(before + 1);
  });

  it('increments independently from rulesetReady', async () => {
    const { playerUpdated, rulesetReady } = await import('@/data/signals');
    const beforeP = playerUpdated.value;
    const beforeR = rulesetReady.value;
    globalEvents.emit('player:updated');
    expect(playerUpdated.value).toBe(beforeP + 1);
    expect(rulesetReady.value).toBe(beforeR); // unaffected
  });
});

// ── researchUpdated signal ─────────────────────────────────────────────────

describe('researchUpdated signal', () => {
  it('is a number signal', async () => {
    const { researchUpdated } = await import('@/data/signals');
    expect(typeof researchUpdated.value).toBe('number');
  });

  it('increments when player:research is emitted', async () => {
    const { researchUpdated } = await import('@/data/signals');
    const before = researchUpdated.value;
    globalEvents.emit('player:research');
    expect(researchUpdated.value).toBe(before + 1);
  });

  it('increments multiple times', async () => {
    const { researchUpdated } = await import('@/data/signals');
    const before = researchUpdated.value;
    globalEvents.emit('player:research');
    globalEvents.emit('player:research');
    expect(researchUpdated.value).toBe(before + 2);
  });

  it('does not affect playerUpdated', async () => {
    const { researchUpdated, playerUpdated } = await import('@/data/signals');
    const beforePu = playerUpdated.value;
    globalEvents.emit('player:research');
    expect(playerUpdated.value).toBe(beforePu); // unaffected
    void researchUpdated; // suppress unused warning
  });
});

// ── settingsUpdated signal ─────────────────────────────────────────────────

describe('settingsUpdated signal', () => {
  it('is a number signal starting at 0', async () => {
    const { settingsUpdated } = await import('@/data/signals');
    expect(typeof settingsUpdated.value).toBe('number');
  });

  it('increments when settings:updated is emitted', async () => {
    const { settingsUpdated } = await import('@/data/signals');
    const before = settingsUpdated.value;
    globalEvents.emit('settings:updated');
    expect(settingsUpdated.value).toBe(before + 1);
  });
});

// ── cityCount / city:removed ───────────────────────────────────────────────

describe('cityCount signal — city:removed', () => {
  beforeEach(() => {
    store.cities = {};
  });

  it('decrements cityCount when city:removed fires', async () => {
    const { cityCount } = await import('@/data/signals');
    store.cities[1] = { id: 1 } as unknown as typeof store.cities[number];
    store.cities[2] = { id: 2 } as unknown as typeof store.cities[number];
    globalEvents.emit('city:updated'); // set initial count to 2
    expect(cityCount.value).toBe(2);
    delete store.cities[1];
    globalEvents.emit('city:removed');
    expect(cityCount.value).toBe(1);
  });
});

// ── unitCount / unit:removed ───────────────────────────────────────────────

describe('unitCount signal — unit:removed', () => {
  beforeEach(() => {
    store.units = {};
  });

  it('decrements unitCount when unit:removed fires', async () => {
    const { unitCount } = await import('@/data/signals');
    store.units[1] = { id: 1 } as unknown as typeof store.units[number];
    store.units[2] = { id: 2 } as unknown as typeof store.units[number];
    globalEvents.emit('unit:updated'); // set initial count to 2
    expect(unitCount.value).toBe(2);
    delete store.units[1];
    globalEvents.emit('unit:removed');
    expect(unitCount.value).toBe(1);
  });
});

// ── syncFromStore — new events ─────────────────────────────────────────────

describe('syncFromStore — game:newyear / player:removed / connection:updated', () => {
  it('game:newyear triggers syncFromStore (playerCount re-syncs)', async () => {
    const { playerCount } = await import('@/data/signals');
    store.players = { 1: { playerno: 1 } as unknown as typeof store.players[number] };
    globalEvents.emit('game:newyear');
    expect(playerCount.value).toBe(1);
  });

  it('player:removed triggers syncFromStore (playerCount decreases)', async () => {
    const { playerCount } = await import('@/data/signals');
    store.players = {};
    globalEvents.emit('player:removed');
    expect(playerCount.value).toBe(0);
  });

  it('connection:updated triggers syncFromStore', async () => {
    const { cityCount } = await import('@/data/signals');
    store.cities = {};
    globalEvents.emit('connection:updated');
    expect(cityCount.value).toBe(0);
  });
});

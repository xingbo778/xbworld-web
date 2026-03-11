/**
 * Unit tests for A1 city demand optimization.
 *
 * Tests the three optimizations:
 *
 * 1. cityCount smart tracking (signals.ts):
 *    - city:updated with new ID increments cityCount exactly once
 *    - city:updated with existing ID suppresses the signal write
 *    - city:removed decrements via ID tracking
 *    - fallback recount when event has no ID
 *    - syncFromStore events (game:beginturn etc.) rebuild the known-IDs set
 *    - _cityDemandMetrics tracks updates vs suppressions
 *
 * 2. doesCityHaveImprovement() improvement-name index (city.ts):
 *    - O(1) lookup returns correct result
 *    - index is built lazily (indexBuilds counter)
 *    - index is reused on subsequent calls (indexBuilds stays at 1)
 *    - index is invalidated on rules:ready
 *    - index is invalidated on store:reset
 *    - lookups counter increments per call
 *    - returns false for unknown improvement name
 *    - returns false for city with no improvements
 *
 * 3. generateProductionList() caching (city.ts):
 *    - same array reference returned on second call (cache hit)
 *    - cache is invalidated on rules:ready
 *    - cache is invalidated on store:reset
 *    - list includes all improvements from store.improvements
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { globalEvents } from '@/core/events';
import { store } from '@/data/store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCity(improvements: { isSet: (n: number) => boolean } = { isSet: () => false }) {
  return {
    id: 1, name: 'Rome', size: 3,
    ppl_happy: [0, 0, 0, 0, 0, 0],
    ppl_unhappy: [0, 0, 0, 0, 0, 0],
    ppl_angry: [0, 0, 0, 0, 0, 0],
    improvements,
  } as unknown as import('@/data/types').City;
}

function makeBitVector(setIds: number[]): { isSet: (n: number) => boolean } {
  return { isSet: (n: number) => setIds.includes(n) };
}

// ---------------------------------------------------------------------------
// 1. cityCount smart tracking
// ---------------------------------------------------------------------------

describe('A1 cityCount smart tracking — city:updated', () => {
  beforeEach(async () => {
    store.cities = {};
    // Reset known-IDs set via a store:reset event
    globalEvents.emit('store:reset');
    const { _resetCityDemandMetrics } = await import('@/data/signals');
    _resetCityDemandMetrics();
  });

  it('increments cityCount when a new city ID arrives via city:updated', async () => {
    const { cityCount } = await import('@/data/signals');
    store.cities[5] = { id: 5 } as never;
    globalEvents.emit('city:updated', { id: 5 });
    expect(cityCount.value).toBe(1);
  });

  it('does NOT increment cityCount for a second update to the same city ID', async () => {
    const { cityCount, _cityDemandMetrics, _resetCityDemandMetrics } = await import('@/data/signals');
    _resetCityDemandMetrics();

    store.cities[5] = { id: 5 } as never;
    globalEvents.emit('city:updated', { id: 5 }); // first — new
    globalEvents.emit('city:updated', { id: 5 }); // second — existing, suppressed
    globalEvents.emit('city:updated', { id: 5 }); // third  — existing, suppressed

    expect(cityCount.value).toBe(1);
    expect(_cityDemandMetrics.cityCountUpdates).toBe(1);
    expect(_cityDemandMetrics.cityCountSuppressed).toBe(2);
  });

  it('accumulates distinct city IDs correctly', async () => {
    const { cityCount } = await import('@/data/signals');
    store.cities[1] = { id: 1 } as never;
    store.cities[2] = { id: 2 } as never;
    store.cities[3] = { id: 3 } as never;
    globalEvents.emit('city:updated', { id: 1 });
    globalEvents.emit('city:updated', { id: 2 });
    globalEvents.emit('city:updated', { id: 3 });
    expect(cityCount.value).toBe(3);
  });

  it('bulk update — 100 events for 100 distinct cities produces exactly 100 signal writes', async () => {
    const { cityCount, _cityDemandMetrics, _resetCityDemandMetrics } = await import('@/data/signals');
    _resetCityDemandMetrics();

    for (let i = 0; i < 100; i++) {
      store.cities[i] = { id: i } as never;
      globalEvents.emit('city:updated', { id: i });
    }
    expect(cityCount.value).toBe(100);
    expect(_cityDemandMetrics.cityCountUpdates).toBe(100);
    expect(_cityDemandMetrics.cityCountSuppressed).toBe(0);
  });

  it('bulk update — 100 events for 10 cities produces 10 writes, 90 suppressions', async () => {
    const { cityCount, _cityDemandMetrics, _resetCityDemandMetrics } = await import('@/data/signals');
    _resetCityDemandMetrics();

    for (let i = 0; i < 10; i++) {
      store.cities[i] = { id: i } as never;
    }
    // Simulate 100 packets: each of 10 cities emitted 10 times (refresh scenario)
    for (let round = 0; round < 10; round++) {
      for (let i = 0; i < 10; i++) {
        globalEvents.emit('city:updated', { id: i });
      }
    }
    expect(cityCount.value).toBe(10);
    expect(_cityDemandMetrics.cityCountUpdates).toBe(10);   // only first appearance of each
    expect(_cityDemandMetrics.cityCountSuppressed).toBe(90); // 90 redundant updates skipped
  });

  it('fallback recount when city:updated fires without data (backward compat)', async () => {
    const { cityCount } = await import('@/data/signals');
    store.cities[1] = { id: 1 } as never;
    store.cities[2] = { id: 2 } as never;
    globalEvents.emit('city:updated'); // no data → fallback recount
    expect(cityCount.value).toBe(2);
  });
});

describe('A1 cityCount smart tracking — city:removed', () => {
  beforeEach(async () => {
    store.cities = {};
    globalEvents.emit('store:reset');
    const { _resetCityDemandMetrics } = await import('@/data/signals');
    _resetCityDemandMetrics();
  });

  it('decrements cityCount when city:removed fires with numeric ID', async () => {
    const { cityCount } = await import('@/data/signals');
    store.cities[7] = { id: 7 } as never;
    globalEvents.emit('city:updated', { id: 7 });
    expect(cityCount.value).toBe(1);

    delete store.cities[7];
    globalEvents.emit('city:removed', 7);
    expect(cityCount.value).toBe(0);
  });

  it('decrements cityCount when city:removed fires with {city_id} object', async () => {
    const { cityCount } = await import('@/data/signals');
    store.cities[8] = { id: 8 } as never;
    globalEvents.emit('city:updated', { id: 8 });

    delete store.cities[8];
    globalEvents.emit('city:removed', { city_id: 8 });
    expect(cityCount.value).toBe(0);
  });

  it('fallback recount when city:removed fires without data', async () => {
    const { cityCount } = await import('@/data/signals');
    store.cities[1] = { id: 1 } as never;
    store.cities[2] = { id: 2 } as never;
    globalEvents.emit('city:updated', { id: 1 });
    globalEvents.emit('city:updated', { id: 2 });

    delete store.cities[1];
    globalEvents.emit('city:removed'); // no ID — fallback to Object.keys count
    expect(cityCount.value).toBe(1);
  });
});

describe('A1 cityCount smart tracking — syncFromStore events', () => {
  beforeEach(async () => {
    store.cities = {};
    globalEvents.emit('store:reset');
    const { _resetCityDemandMetrics } = await import('@/data/signals');
    _resetCityDemandMetrics();
  });

  it('game:beginturn rebuilds known-IDs and syncs cityCount', async () => {
    const { cityCount } = await import('@/data/signals');
    // Manually populate store.cities before beginturn fires
    store.cities[10] = { id: 10 } as never;
    store.cities[11] = { id: 11 } as never;
    globalEvents.emit('game:beginturn');
    expect(cityCount.value).toBe(2);
  });

  it('after store:reset, city:updated with a previously-known ID is treated as new', async () => {
    const { cityCount, _cityDemandMetrics, _resetCityDemandMetrics } = await import('@/data/signals');

    store.cities[3] = { id: 3 } as never;
    globalEvents.emit('city:updated', { id: 3 }); // first time
    expect(cityCount.value).toBe(1);

    // Reset clears known IDs
    store.cities = {};
    globalEvents.emit('store:reset');
    _resetCityDemandMetrics();
    expect(cityCount.value).toBe(0);

    // Re-add the city — should be treated as new after reset
    store.cities[3] = { id: 3 } as never;
    globalEvents.emit('city:updated', { id: 3 });
    expect(cityCount.value).toBe(1);
    expect(_cityDemandMetrics.cityCountUpdates).toBe(1);
    expect(_cityDemandMetrics.cityCountSuppressed).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 2. doesCityHaveImprovement() improvement-name index
// ---------------------------------------------------------------------------

describe('A1 doesCityHaveImprovement() improvement-name index', () => {
  beforeEach(() => {
    // Provide improvement data (names must match what the function looks up)
    store.improvements = {
      0: { id: 0, name: 'Library', build_cost: 80 },
      1: { id: 1, name: 'Granary', build_cost: 60 },
      2: { id: 2, name: 'Barracks', build_cost: 40 },
    } as never;
    store.rulesControl = { num_impr_types: 3 } as never;
    // Invalidate any stale index from previous tests
    globalEvents.emit('rules:ready');
    // Reset metrics
    import('@/data/city').then(({ _resetImprovementLookupMetrics }) => _resetImprovementLookupMetrics());
  });

  afterEach(() => {
    store.improvements = {};
    store.rulesControl = null;
  });

  it('returns true when city has the named improvement', async () => {
    const { doesCityHaveImprovement } = await import('@/data/city');
    const pcity = makeCity(makeBitVector([1])); // has Granary (id=1)
    expect(doesCityHaveImprovement(pcity, 'Granary')).toBe(true);
  });

  it('returns false when city does not have the named improvement', async () => {
    const { doesCityHaveImprovement } = await import('@/data/city');
    const pcity = makeCity(makeBitVector([0])); // has Library (id=0), not Granary
    expect(doesCityHaveImprovement(pcity, 'Granary')).toBe(false);
  });

  it('returns false for an improvement name not in the ruleset', async () => {
    const { doesCityHaveImprovement } = await import('@/data/city');
    const pcity = makeCity(makeBitVector([0, 1, 2]));
    expect(doesCityHaveImprovement(pcity, 'Colosseum')).toBe(false);
  });

  it('returns false for null city', async () => {
    const { doesCityHaveImprovement } = await import('@/data/city');
    expect(doesCityHaveImprovement(null, 'Library')).toBe(false);
  });

  it('returns false for city with no improvements field', async () => {
    const { doesCityHaveImprovement } = await import('@/data/city');
    const pcity = { id: 1 } as never;
    expect(doesCityHaveImprovement(pcity, 'Library')).toBe(false);
  });

  it('builds the index exactly once across multiple lookups', async () => {
    const { doesCityHaveImprovement, _improvementLookupMetrics, _resetImprovementLookupMetrics } = await import('@/data/city');
    _resetImprovementLookupMetrics();
    globalEvents.emit('rules:ready'); // invalidate index

    const pcity = makeCity(makeBitVector([0]));
    doesCityHaveImprovement(pcity, 'Library');
    doesCityHaveImprovement(pcity, 'Granary');
    doesCityHaveImprovement(pcity, 'Barracks');

    expect(_improvementLookupMetrics.indexBuilds).toBe(1); // built once
    expect(_improvementLookupMetrics.lookups).toBe(3);     // called 3 times
  });

  it('index is invalidated and rebuilt after rules:ready', async () => {
    const { doesCityHaveImprovement, _improvementLookupMetrics, _resetImprovementLookupMetrics } = await import('@/data/city');
    _resetImprovementLookupMetrics();
    globalEvents.emit('rules:ready'); // ensure fresh start

    const pcity = makeCity(makeBitVector([0]));
    doesCityHaveImprovement(pcity, 'Library'); // builds index (indexBuilds=1)

    globalEvents.emit('rules:ready'); // invalidate

    doesCityHaveImprovement(pcity, 'Library'); // rebuilds index (indexBuilds=2)

    expect(_improvementLookupMetrics.indexBuilds).toBe(2);
  });

  it('index is invalidated and rebuilt after store:reset', async () => {
    const { doesCityHaveImprovement, _improvementLookupMetrics, _resetImprovementLookupMetrics } = await import('@/data/city');
    _resetImprovementLookupMetrics();
    globalEvents.emit('rules:ready'); // ensure fresh start

    const pcity = makeCity(makeBitVector([1]));
    doesCityHaveImprovement(pcity, 'Granary'); // builds index (indexBuilds=1)

    globalEvents.emit('store:reset');          // invalidate

    doesCityHaveImprovement(pcity, 'Granary'); // rebuilds (indexBuilds=2)

    expect(_improvementLookupMetrics.indexBuilds).toBe(2);
  });

  it('lookups counter increments per call', async () => {
    const { doesCityHaveImprovement, _improvementLookupMetrics, _resetImprovementLookupMetrics } = await import('@/data/city');
    _resetImprovementLookupMetrics();

    const pcity = makeCity(makeBitVector([0, 2]));
    doesCityHaveImprovement(pcity, 'Library');
    doesCityHaveImprovement(pcity, 'Barracks');
    doesCityHaveImprovement(pcity, 'Granary');

    expect(_improvementLookupMetrics.lookups).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// 3. generateProductionList() caching
// ---------------------------------------------------------------------------

describe('A1 generateProductionList() caching', () => {
  beforeEach(() => {
    store.unitTypes = {
      0: { id: 0, name: 'Warriors', build_cost: 10, attack_strength: 1, defense_strength: 1, firepower: 1,
           flags: { isSet: () => false }, rule_name: 'Warriors', helptext: '' },
      1: { id: 1, name: 'Settlers', build_cost: 40, attack_strength: 0, defense_strength: 1, firepower: 1,
           flags: { isSet: () => false }, rule_name: 'Settlers', helptext: '' },
    } as never;
    store.improvements = {
      0: { id: 0, name: 'Barracks', build_cost: 40, rule_name: 'Barracks', helptext: '' },
    } as never;
    store.unitClasses = {};
    // Invalidate cache from previous tests
    globalEvents.emit('rules:ready');
  });

  afterEach(() => {
    store.unitTypes = {};
    store.improvements = {};
    globalEvents.emit('rules:ready');
  });

  it('returns the same array reference on repeated calls (cache hit)', async () => {
    const { generateProductionList } = await import('@/data/city');
    const list1 = generateProductionList();
    const list2 = generateProductionList();
    expect(list1).toBe(list2); // same reference = cache hit
  });

  it('includes improvements from store.improvements', async () => {
    const { generateProductionList } = await import('@/data/city');
    const list = generateProductionList();
    const names = list.map(i => i.text);
    expect(names).toContain('Barracks');
  });

  it('includes unit types from store.unitTypes', async () => {
    const { generateProductionList } = await import('@/data/city');
    const list = generateProductionList();
    const names = list.map(i => i.text);
    expect(names).toContain('Warriors');
    expect(names).toContain('Settlers');
  });

  it('rebuilds list after rules:ready invalidation', async () => {
    const { generateProductionList } = await import('@/data/city');
    const list1 = generateProductionList();
    globalEvents.emit('rules:ready'); // invalidate cache
    const list2 = generateProductionList();
    expect(list1).not.toBe(list2); // different reference = rebuilt
  });

  it('rebuilds list after store:reset invalidation', async () => {
    const { generateProductionList } = await import('@/data/city');
    const list1 = generateProductionList();
    globalEvents.emit('store:reset'); // invalidate cache
    const list2 = generateProductionList();
    expect(list1).not.toBe(list2);
  });

  it('cached list has correct count (units + improvements)', async () => {
    const { generateProductionList } = await import('@/data/city');
    const list = generateProductionList();
    // 2 unit types + 1 improvement = 3 total
    expect(list.length).toBe(3);
  });
});

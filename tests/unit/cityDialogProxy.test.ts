/**
 * Regression tests for the cityDialogState.cities → store.cities proxy fix.
 *
 * Root cause: cityDialogState exported a standalone `cities = {}` that was
 * never populated, while packet handlers wrote only to store.cities.  This
 * broke city-dialog open in observer mode (store.cities had entries; cities
 * appeared empty to all UI code).
 *
 * The fix: cities is now a Proxy that forwards every property access to
 * store.cities so the two are always in sync.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { store } from '@/data/store';
import { cities } from '@/ui/cityDialogState';
import type { City } from '@/data/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCity(id: number): City {
  return { id, name: `City${id}`, owner: 0, tile: 0, size: 1 } as unknown as City;
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  store.cities = {};
});

afterEach(() => {
  store.cities = {};
});

// ---------------------------------------------------------------------------
// Core proxy behaviour
// ---------------------------------------------------------------------------

describe('cityDialogState.cities proxy — reads from store.cities', () => {
  it('reflects cities added directly to store.cities', () => {
    store.cities[42] = makeCity(42);
    expect(cities[42]).toBe(store.cities[42]);
    expect(cities[42].name).toBe('City42');
  });

  it('returns undefined for ids not in store.cities', () => {
    expect(cities[999]).toBeUndefined();
  });

  it('for…in iterates exactly the keys present in store.cities', () => {
    store.cities[1] = makeCity(1);
    store.cities[5] = makeCity(5);

    const seen: string[] = [];
    for (const id in cities) seen.push(id);

    expect(seen.sort()).toEqual(['1', '5']);
  });

  it('in operator delegates to store.cities', () => {
    store.cities[7] = makeCity(7);
    expect(7 in cities).toBe(true);
    expect(99 in cities).toBe(false);
  });

  it('Object.keys(cities) matches Object.keys(store.cities)', () => {
    store.cities[10] = makeCity(10);
    store.cities[20] = makeCity(20);
    expect(Object.keys(cities)).toEqual(Object.keys(store.cities));
  });
});

// ---------------------------------------------------------------------------
// Observer-mode scenario: packet handler adds city → UI sees it
// ---------------------------------------------------------------------------

describe('observer-mode scenario', () => {
  it('city written by packet handler is immediately visible via cities proxy', () => {
    // Simulate what handle_city_info does:
    store.cities[55] = makeCity(55);

    // UI code path (e.g. show_city_dialog_by_id) reads cities[id]:
    const found = cities[55];
    expect(found).not.toBeUndefined();
    expect(found.id).toBe(55);
  });

  it('multiple cities from packets are all visible', () => {
    store.cities[1] = makeCity(1);
    store.cities[2] = makeCity(2);
    store.cities[3] = makeCity(3);

    let count = 0;
    for (const _id in cities) count++;
    expect(count).toBe(3);
  });

  it('city removed from store.cities disappears from cities proxy', () => {
    store.cities[8] = makeCity(8);
    expect(cities[8]).toBeDefined();

    delete store.cities[8];
    expect(cities[8]).toBeUndefined();
  });

  it('cities proxy is never out of sync after multiple packet arrivals', () => {
    // Simulate successive PACKET_CITY_INFO arrivals
    for (let i = 1; i <= 10; i++) {
      store.cities[i] = makeCity(i);
    }
    expect(Object.keys(cities)).toHaveLength(10);

    // Update one
    (store.cities[5] as Record<string, unknown>)['name'] = 'Updated';
    expect((cities[5] as Record<string, unknown>)['name']).toBe('Updated');
  });
});

// ---------------------------------------------------------------------------
// Writes through proxy propagate to store.cities
// ---------------------------------------------------------------------------

describe('writes through cities proxy update store.cities', () => {
  it('setting a key via cities stores it in store.cities', () => {
    (cities as Record<number, City>)[99] = makeCity(99);
    expect(store.cities[99]).toBeDefined();
    expect(store.cities[99].id).toBe(99);
  });
});

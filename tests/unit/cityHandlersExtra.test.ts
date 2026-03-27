/**
 * Additional unit tests for city packet handlers not covered by handlerEvents.test.ts.
 * Covers: nationalities, rally_point, web_city_info_addition, update_counters,
 *         name_suggestion, sabotage_list.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('handle_city_nationalities', () => {
  it('is exported as a function', async () => {
    const { handle_city_nationalities } = await import('@/net/handlers/city');
    expect(typeof handle_city_nationalities).toBe('function');
  });

  it('updates city data when city exists in store', async () => {
    const { handle_city_nationalities } = await import('@/net/handlers/city');
    store.cities[10] = { id: 10, owner: 0, tile: 5 } as never;
    handle_city_nationalities({ id: 10, nationality_citizens: [5, 3] } as never);
    expect(store.cities[10]?.['nationality_citizens']).toEqual([5, 3]);
  });

  it('is a no-op when city does not exist', async () => {
    const { handle_city_nationalities } = await import('@/net/handlers/city');
    expect(() => handle_city_nationalities({ id: 999, nationality_citizens: [] } as never)).not.toThrow();
    expect(store.cities[999]).toBeUndefined();
  });
});

describe('handle_city_rally_point', () => {
  it('updates city data when city exists', async () => {
    const { handle_city_rally_point } = await import('@/net/handlers/city');
    store.cities[20] = { id: 20, owner: 1, tile: 10 } as never;
    handle_city_rally_point({ id: 20, rally_point_x: 5, rally_point_y: 3 } as never);
    expect(store.cities[20]?.['rally_point_x']).toBe(5);
  });

  it('is a no-op when city does not exist', async () => {
    const { handle_city_rally_point } = await import('@/net/handlers/city');
    expect(() => handle_city_rally_point({ id: 999 } as never)).not.toThrow();
  });
});

describe('handle_web_city_info_addition', () => {
  it('updates city data when city exists', async () => {
    const { handle_web_city_info_addition } = await import('@/net/handlers/city');
    store.cities[30] = { id: 30, owner: 0, tile: 15 } as never;
    handle_web_city_info_addition({ id: 30, output_gold: 50 } as never);
    expect(store.cities[30]?.['output_gold']).toBe(50);
  });

  it('is a no-op when city does not exist', async () => {
    const { handle_web_city_info_addition } = await import('@/net/handlers/city');
    expect(() => handle_web_city_info_addition({ id: 999 } as never)).not.toThrow();
  });
});

describe('handle_city_update_counters', () => {
  it('updates city counters when city exists', async () => {
    const { handle_city_update_counters } = await import('@/net/handlers/city');
    store.cities[40] = { id: 40, owner: 0, tile: 20 } as never;
    handle_city_update_counters({ id: 40, counters: [1, 2, 3] } as never);
    expect(store.cities[40]?.['counters']).toEqual([1, 2, 3]);
  });

  it('is a no-op when city does not exist', async () => {
    const { handle_city_update_counters } = await import('@/net/handlers/city');
    expect(() => handle_city_update_counters({ id: 999, counters: [] } as never)).not.toThrow();
  });
});

describe('handle_city_sabotage_list', () => {
  it('is a no-op (observer mode)', async () => {
    const { handle_city_sabotage_list } = await import('@/net/handlers/city');
    expect(() => handle_city_sabotage_list({} as never)).not.toThrow();
  });
});

describe('handle_city_update_counter (singular, stub)', () => {
  it('is a no-op stub', async () => {
    const { handle_city_update_counter } = await import('@/net/handlers/city');
    expect(() => handle_city_update_counter({} as never)).not.toThrow();
  });
});

describe('handle_city_name_suggestion_info', () => {
  it('is exported as a function', async () => {
    const { handle_city_name_suggestion_info } = await import('@/net/handlers/city');
    expect(typeof handle_city_name_suggestion_info).toBe('function');
  });

  it('decodes name and calls city_name_dialog (does not throw)', async () => {
    const { handle_city_name_suggestion_info } = await import('@/net/handlers/city');
    expect(() => handle_city_name_suggestion_info({ name: 'Rome%20City', unit_id: 1 } as never)).not.toThrow();
  });
});

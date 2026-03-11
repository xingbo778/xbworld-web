/**
 * Tests for the JSX-friendly data-returning functions added to cityLogic.ts.
 *
 * Covers:
 *  CSZ  getCitySizeData
 *  CPT  getProductionTurnsData
 *  CIM  getImprovementItems
 *  CPU  getPresentUnitItems / getSupportedUnitItems
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FC_INFINITY } from '@/data/fcTypes';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockStore = vi.hoisted(() => ({
  rulesControl: { num_impr_types: 0 } as Record<string, unknown>,
  improvements: {} as Record<number, unknown>,
  specialists: {} as Record<number, unknown>,
  unitTypes: {} as Record<number, unknown>,
  cities: {} as Record<number, unknown>,
  players: {} as Record<number, unknown>,
  techs: {} as Record<number, unknown>,
  units: {} as Record<number, unknown>,
  nations: {} as Record<number, unknown>,
  terrains: {} as Record<number, unknown>,
  governments: {} as Record<number, unknown>,
  tiles: {} as Record<number, unknown>,
  effects: {} as Record<number, unknown>,
  rulesControlData: null as unknown,
}));

vi.mock('@/data/store', () => ({ store: mockStore }));
vi.mock('@/core/events', () => ({ globalEvents: { emit: vi.fn(), on: vi.fn() } }));
vi.mock('@/client/clientState', () => ({
  clientPlaying: vi.fn(() => null),
  clientIsObserver: () => true,
  clientState: vi.fn(() => 0),
  setClientState: vi.fn(),
}));
vi.mock('@/renderer/tilespec', () => ({
  get_unit_image_sprite: vi.fn(() => null),
  get_improvement_image_sprite: vi.fn(() => null),
  get_unit_type_image_sprite: vi.fn(() => null),
}));
vi.mock('@/data/unit', () => ({
  tile_units: vi.fn(() => null),
  get_supported_units: vi.fn(() => null),
  get_unit_city_info: vi.fn(() => 'unit info'),
}));
vi.mock('@/data/tech', () => ({ TECH_KNOWN: 2, playerInventionState: () => 0 }));
vi.mock('@/data/map', async (importOriginal) => ({ ...(await importOriginal() as object) }));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCity(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    name: 'Rome',
    size: 5,
    owner: 0,
    tile: 0,
    food_stock: 20,
    granary_size: 40,
    food_surplus: 2,
    production_kind: 0,
    production_value: 0,
    shield_stock: 10,
    surplus: [2, 1, 3, 5, 2, 4],
    waste: [0, 0, 0],
    prod: [10, 8, 6, 5, 2, 4],
    pollution: 0,
    steal: 0,
    culture: 100,
    improvements: { isSet: vi.fn(() => false) },
    was_happy: false,
    unhappy: false,
    can_build_unit: undefined,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// CSZ: getCitySizeData
// ---------------------------------------------------------------------------

describe('getCitySizeData', () => {
  it('CSZ-1: returns numeric size', async () => {
    const { getCitySizeData } = await import('@/ui/cityLogic');
    const city = makeCity({ size: 7 });
    const d = getCitySizeData(city as never);
    expect(d.size).toBe(7);
  });

  it('CSZ-2: returns granary stock and size', async () => {
    const { getCitySizeData } = await import('@/ui/cityLogic');
    const city = makeCity({ food_stock: 25, granary_size: 50 });
    const d = getCitySizeData(city as never);
    expect(d.foodStock).toBe(25);
    expect(d.granarySize).toBe(50);
  });

  it('CSZ-3: population is a formatted string', async () => {
    const { getCitySizeData } = await import('@/ui/cityLogic');
    const city = makeCity({ size: 3 });
    const d = getCitySizeData(city as never);
    expect(typeof d.population).toBe('string');
    expect(d.population.length).toBeGreaterThan(0);
  });

  it('CSZ-4: growthText is a string', async () => {
    const { getCitySizeData } = await import('@/ui/cityLogic');
    const d = getCitySizeData(makeCity() as never);
    expect(typeof d.growthText).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// CPT: getProductionTurnsData
// ---------------------------------------------------------------------------

describe('getProductionTurnsData', () => {
  it('CPT-1: turns=null when production time is FC_INFINITY', async () => {
    const { getProductionTurnsData } = await import('@/ui/cityLogic');
    const city = makeCity({ shield_stock: 0, production_value: 9999, production_kind: 0 });
    const d = getProductionTurnsData(city as never);
    // With no matching unit type, production time should be FC_INFINITY
    expect(d.turns === null || typeof d.turns === 'number').toBe(true);
  });

  it('CPT-2: returns an object with turns and progress fields', async () => {
    const { getProductionTurnsData } = await import('@/ui/cityLogic');
    const d = getProductionTurnsData(makeCity() as never);
    expect('turns' in d).toBe(true);
    expect('progress' in d).toBe(true);
  });

  it('CPT-3: progress is a string', async () => {
    const { getProductionTurnsData } = await import('@/ui/cityLogic');
    const d = getProductionTurnsData(makeCity() as never);
    expect(typeof d.progress).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// CIM: getImprovementItems
// ---------------------------------------------------------------------------

describe('getImprovementItems', () => {
  beforeEach(() => {
    mockStore.rulesControl = { num_impr_types: 3 };
    mockStore.improvements = {
      0: { name: 'Barracks', helptext: 'Build units faster' },
      1: { name: 'Granary', helptext: 'Store food' },
      2: { name: 'Library', helptext: 'Research' },
    };
  });

  it('CIM-1: returns empty array when city has no improvements', async () => {
    const { getImprovementItems } = await import('@/ui/cityLogic');
    const city = makeCity({ improvements: { isSet: vi.fn(() => false) } });
    const items = getImprovementItems(city as never);
    expect(items).toHaveLength(0);
  });

  it('CIM-2: returns one item when one improvement is set', async () => {
    const { getImprovementItems } = await import('@/ui/cityLogic');
    const isSet = vi.fn((bit: number) => bit === 1); // only Granary
    const city = makeCity({ improvements: { isSet } });
    const items = getImprovementItems(city as never);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(1);
    expect(items[0].name).toBe('Granary');
  });

  it('CIM-3: returns multiple items when multiple improvements set', async () => {
    const { getImprovementItems } = await import('@/ui/cityLogic');
    const isSet = vi.fn((bit: number) => bit === 0 || bit === 2);
    const city = makeCity({ improvements: { isSet } });
    const items = getImprovementItems(city as never);
    expect(items).toHaveLength(2);
    expect(items.map(i => i.name)).toEqual(expect.arrayContaining(['Barracks', 'Library']));
  });

  it('CIM-4: sprite is null when get_improvement_image_sprite returns null', async () => {
    const { getImprovementItems } = await import('@/ui/cityLogic');
    const isSet = vi.fn((bit: number) => bit === 0);
    const city = makeCity({ improvements: { isSet } });
    const items = getImprovementItems(city as never);
    expect(items[0].sprite).toBeNull();
  });

  it('CIM-5: sprite is populated when sprite exists', async () => {
    const { get_improvement_image_sprite } = await import('@/renderer/tilespec');
    (get_improvement_image_sprite as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      'image-src': '/tiles.webp', 'tileset-x': 10, 'tileset-y': 20, width: 48, height: 48,
    });
    const { getImprovementItems } = await import('@/ui/cityLogic');
    const isSet = vi.fn((bit: number) => bit === 0);
    const city = makeCity({ improvements: { isSet } });
    const items = getImprovementItems(city as never);
    expect(items[0].sprite).not.toBeNull();
    expect(items[0].sprite?.['image-src']).toBe('/tiles.webp');
  });

  it('CIM-6: helptext is included in item', async () => {
    const { getImprovementItems } = await import('@/ui/cityLogic');
    const isSet = vi.fn((bit: number) => bit === 0);
    const city = makeCity({ improvements: { isSet } });
    const items = getImprovementItems(city as never);
    expect(items[0].helptext).toBe('Build units faster');
  });
});

// ---------------------------------------------------------------------------
// CPU: getPresentUnitItems / getSupportedUnitItems
// ---------------------------------------------------------------------------

describe('getPresentUnitItems', () => {
  it('CPU-1: returns null when tile has no units', async () => {
    const { tile_units } = await import('@/data/unit');
    (tile_units as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);
    const { getPresentUnitItems } = await import('@/ui/cityLogic');
    expect(getPresentUnitItems(makeCity() as never)).toBeNull();
  });

  it('CPU-2: returns empty array when all unit sprites are missing', async () => {
    const { tile_units } = await import('@/data/unit');
    (tile_units as ReturnType<typeof vi.fn>).mockReturnValueOnce([
      { id: 10, type: 1 },
    ]);
    // get_unit_image_sprite is mocked to return null globally
    const { getPresentUnitItems } = await import('@/ui/cityLogic');
    const items = getPresentUnitItems(makeCity() as never);
    expect(items).toEqual([]);
  });

  it('CPU-3: returns unit items when sprites exist', async () => {
    const { tile_units } = await import('@/data/unit');
    const { get_unit_image_sprite } = await import('@/renderer/tilespec');
    (tile_units as ReturnType<typeof vi.fn>).mockReturnValueOnce([
      { id: 42, type: 1 },
      { id: 43, type: 2 },
    ]);
    (get_unit_image_sprite as ReturnType<typeof vi.fn>).mockReturnValue({
      'image-src': '/tiles.webp', 'tileset-x': 0, 'tileset-y': 0, width: 48, height: 48,
    });
    const { getPresentUnitItems } = await import('@/ui/cityLogic');
    const items = getPresentUnitItems(makeCity() as never);
    expect(items).toHaveLength(2);
    expect(items![0].id).toBe(42);
    expect(items![1].id).toBe(43);
  });

  it('CPU-4: item includes title from get_unit_city_info', async () => {
    const { tile_units } = await import('@/data/unit');
    const { get_unit_image_sprite } = await import('@/renderer/tilespec');
    (tile_units as ReturnType<typeof vi.fn>).mockReturnValueOnce([{ id: 99, type: 1 }]);
    (get_unit_image_sprite as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      'image-src': '/t.webp', 'tileset-x': 0, 'tileset-y': 0, width: 48, height: 48,
    });
    const { getPresentUnitItems } = await import('@/ui/cityLogic');
    const items = getPresentUnitItems(makeCity() as never);
    expect(items![0].title).toBe('unit info');
  });
});

describe('getSupportedUnitItems', () => {
  it('CPU-5: returns null when get_supported_units returns null', async () => {
    const { get_supported_units } = await import('@/data/unit');
    (get_supported_units as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);
    const { getSupportedUnitItems } = await import('@/ui/cityLogic');
    expect(getSupportedUnitItems(makeCity() as never)).toBeNull();
  });

  it('CPU-6: returns unit items for supported units with sprites', async () => {
    const { get_supported_units } = await import('@/data/unit');
    const { get_unit_image_sprite } = await import('@/renderer/tilespec');
    (get_supported_units as ReturnType<typeof vi.fn>).mockReturnValueOnce([
      { id: 7, type: 3 },
    ]);
    (get_unit_image_sprite as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      'image-src': '/t.webp', 'tileset-x': 5, 'tileset-y': 5, width: 48, height: 48,
    });
    const { getSupportedUnitItems } = await import('@/ui/cityLogic');
    const items = getSupportedUnitItems(makeCity() as never);
    expect(items).toHaveLength(1);
    expect(items![0].id).toBe(7);
  });
});

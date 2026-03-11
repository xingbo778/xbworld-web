/**
 * Tests for the CityDialog Preact component after innerHTML→JSX migration.
 *
 * Covers:
 *  CDJ-1..5  Overview tab renders city data without dangerouslySetInnerHTML
 *  CDJ-6..8  Buildings tab data and no-onclick assertions
 *  CDJ-9..11 Units tab present/supported item helpers
 *  CDJ-12    No onclick= strings in rendered DOM
 *  CDJ-13    showCityDialogPreact / closeCityDialogPreact signals
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

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
  get_unit_city_info: vi.fn(() => ''),
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
    shield_stock: 10,
    production_kind: 0,
    production_value: 0,
    surplus: [2, 1, 3, 5, 2, 4],
    waste: [0, 0, 0],
    prod: [10, 8, 6, 5, 2, 4],
    pollution: 3,
    steal: 0,
    culture: 100,
    improvements: { isSet: vi.fn(() => false) },
    was_happy: false,
    unhappy: false,
    ...overrides,
  };
}

async function mountCity(container: HTMLElement, cityOverrides: Record<string, unknown> = {}) {
  const { showCityDialogPreact, mountCityDialog } = await import('@/components/Dialogs/CityDialog');
  showCityDialogPreact(makeCity(cityOverrides) as never);
  mountCityDialog(container);
}

// ---------------------------------------------------------------------------
// CDJ-1..5: Overview tab
// ---------------------------------------------------------------------------

describe('CityDialog — Overview tab', () => {
  beforeEach(() => {
    mockStore.players = {};
    mockStore.nations = {};
    mockStore.improvements = {};
    mockStore.rulesControl = { num_impr_types: 0 };
  });

  it('CDJ-1: mounts without error', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    await expect(mountCity(container)).resolves.not.toThrow();
    const { closeCityDialogPreact } = await import('@/components/Dialogs/CityDialog');
    closeCityDialogPreact();
    document.body.removeChild(container);
  });

  it('CDJ-2: shows city name in rendered output', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    await mountCity(container, { name: 'Athens' });
    expect(container.textContent).toContain('Athens');
    const { closeCityDialogPreact } = await import('@/components/Dialogs/CityDialog');
    closeCityDialogPreact();
    document.body.removeChild(container);
  });

  it('CDJ-3: shows size value', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    await mountCity(container, { size: 7 });
    expect(container.textContent).toContain('Size: 7');
    const { closeCityDialogPreact } = await import('@/components/Dialogs/CityDialog');
    closeCityDialogPreact();
    document.body.removeChild(container);
  });

  it('CDJ-4: shows granary food_stock/granary_size', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    await mountCity(container, { food_stock: 15, granary_size: 30 });
    expect(container.textContent).toContain('Granary: 15/30');
    const { closeCityDialogPreact } = await import('@/components/Dialogs/CityDialog');
    closeCityDialogPreact();
    document.body.removeChild(container);
  });

  it('CDJ-5: renders nothing visible when no city is open', async () => {
    const { closeCityDialogPreact, mountCityDialog } = await import('@/components/Dialogs/CityDialog');
    closeCityDialogPreact();
    const container = document.createElement('div');
    document.body.appendChild(container);
    mountCityDialog(container);
    // With no city, CityDialog returns null — container should be empty
    expect(container.textContent).toBe('');
    document.body.removeChild(container);
  });
});

// ---------------------------------------------------------------------------
// CDJ-6..8: Buildings tab data and no-onclick assertions
// ---------------------------------------------------------------------------

describe('CityDialog — Buildings tab (no dangerouslySetInnerHTML)', () => {
  beforeEach(() => {
    mockStore.rulesControl = { num_impr_types: 2 };
    mockStore.improvements = {
      0: { name: 'Barracks', helptext: 'Train troops' },
      1: { name: 'Library', helptext: 'Science boost' },
    };
  });

  it('CDJ-6: getImprovementItems returns correct item for set bit', async () => {
    const { getImprovementItems } = await import('@/ui/cityLogic');
    const isSet = vi.fn((bit: number) => bit === 0);
    const items = getImprovementItems(makeCity({ improvements: { isSet } }) as never);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Barracks');
    expect(items[0].helptext).toBe('Train troops');
  });

  it('CDJ-7: getImprovementItems returns multiple items for multiple set bits', async () => {
    const { getImprovementItems } = await import('@/ui/cityLogic');
    const isSet = vi.fn((bit: number) => bit === 0 || bit === 1);
    const items = getImprovementItems(makeCity({ improvements: { isSet } }) as never);
    expect(items).toHaveLength(2);
    expect(items.map(i => i.name)).toContain('Library');
  });

  it('CDJ-8: rendered HTML does not contain onclick= strings', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const isSet = vi.fn((bit: number) => bit === 0);
    await mountCity(container, { improvements: { isSet } });
    expect(container.innerHTML).not.toContain("onclick='");
    expect(container.innerHTML).not.toContain('onclick="');
    expect(container.innerHTML).not.toContain('city_sell_improvement');
    const { closeCityDialogPreact } = await import('@/components/Dialogs/CityDialog');
    closeCityDialogPreact();
    document.body.removeChild(container);
  });
});

// ---------------------------------------------------------------------------
// CDJ-9..11: Units tab helpers
// ---------------------------------------------------------------------------

describe('CityDialog — Units tab helpers', () => {
  it('CDJ-9: getPresentUnitItems returns null when tile_units returns null', async () => {
    const { tile_units } = await import('@/data/unit');
    (tile_units as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);
    const { getPresentUnitItems } = await import('@/ui/cityLogic');
    expect(getPresentUnitItems(makeCity() as never)).toBeNull();
  });

  it('CDJ-10: getPresentUnitItems skips units with missing sprites', async () => {
    const { tile_units } = await import('@/data/unit');
    (tile_units as ReturnType<typeof vi.fn>).mockReturnValueOnce([{ id: 10, type: 1 }]);
    // get_unit_image_sprite mocked to return null globally
    const { getPresentUnitItems } = await import('@/ui/cityLogic');
    const items = getPresentUnitItems(makeCity() as never);
    expect(items).toEqual([]);
  });

  it('CDJ-11: getSupportedUnitItems returns null when get_supported_units returns null', async () => {
    const { get_supported_units } = await import('@/data/unit');
    (get_supported_units as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);
    const { getSupportedUnitItems } = await import('@/ui/cityLogic');
    expect(getSupportedUnitItems(makeCity() as never)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// CDJ-12: no onclick= in DOM output
// ---------------------------------------------------------------------------

describe('CityDialog — no inline event strings in DOM', () => {
  it('CDJ-12: rendered output contains no onclick= or city_dialog_activate_unit', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    await mountCity(container);
    expect(container.innerHTML).not.toContain("onclick='");
    expect(container.innerHTML).not.toContain('onclick="');
    expect(container.innerHTML).not.toContain('city_sell_improvement');
    expect(container.innerHTML).not.toContain('city_dialog_activate_unit');
    const { closeCityDialogPreact } = await import('@/components/Dialogs/CityDialog');
    closeCityDialogPreact();
    document.body.removeChild(container);
  });
});

// ---------------------------------------------------------------------------
// CDJ-13: signal API
// ---------------------------------------------------------------------------

describe('CityDialog — signal API', () => {
  it('CDJ-13: showCityDialogPreact / closeCityDialogPreact update signal', async () => {
    const { showCityDialogPreact, closeCityDialogPreact, cityDialogSignal } = await import('@/components/Dialogs/CityDialog');
    const pcity = makeCity({ name: 'Carthage' }) as never;
    showCityDialogPreact(pcity);
    expect(cityDialogSignal.value).toBe(pcity);
    closeCityDialogPreact();
    expect(cityDialogSignal.value).toBeNull();
  });
});

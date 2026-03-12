/**
 * Unit tests for data/game.ts
 *
 * Tests game query functions: game_find_city_by_number,
 * game_find_unit_by_number, civ_population, get_year_string,
 * current_turn_timeout.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock isSmallScreen before importing game.ts
vi.mock('@/utils/helpers', async (importOriginal) => ({
  ...(await importOriginal()),
  isSmallScreen: vi.fn(() => false),
}));

import {
  IDENTITY_NUMBER_ZERO,
  game_find_city_by_number,
  game_find_unit_by_number,
  civ_population,
  get_year_string,
  current_turn_timeout,
  update_game_status_panel,
} from '@/data/game';
import { store } from '@/data/store';
import { isSmallScreen } from '@/utils/helpers';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('Game constants', () => {
  it('should export IDENTITY_NUMBER_ZERO as 0', () => {
    expect(IDENTITY_NUMBER_ZERO).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// game_find_city_by_number
// ---------------------------------------------------------------------------

describe('game_find_city_by_number', () => {
  beforeEach(() => {
    (store as any).cities = {
      1: { id: 1, name: 'Rome' },
      2: { id: 2, name: 'Paris' },
    };
  });

  afterEach(() => {
    (store as any).cities = {};
  });

  it('should return city by id', () => {
    expect(game_find_city_by_number(1)?.name).toBe('Rome');
    expect(game_find_city_by_number(2)?.name).toBe('Paris');
  });

  it('should return undefined for non-existent city', () => {
    expect(game_find_city_by_number(99)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// game_find_unit_by_number
// ---------------------------------------------------------------------------

describe('game_find_unit_by_number', () => {
  beforeEach(() => {
    (store as any).units = {
      10: { id: 10, type: 1 },
      20: { id: 20, type: 2 },
    };
  });

  afterEach(() => {
    (store as any).units = {};
  });

  it('should return unit by id', () => {
    expect(game_find_unit_by_number(10)?.type).toBe(1);
  });

  it('should return undefined for non-existent unit', () => {
    expect(game_find_unit_by_number(99)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// civ_population
// ---------------------------------------------------------------------------

describe('civ_population', () => {
  beforeEach(() => {
    // civ_population reads from store.cities and uses imported cityPopulation + numberWithCommas
    (store as any).cities = {
      1: { id: 1, owner: 0, size: 5 },  // pop = 5*6*5 = 150
      2: { id: 2, owner: 0, size: 3 },  // pop = 3*4*5 = 60
      3: { id: 3, owner: 1, size: 10 }, // different owner
    };
  });

  afterEach(() => {
    (store as any).cities = {};
  });

  it('should sum population of all cities owned by player', () => {
    // Player 0: 150 + 60 = 210, * 1000 = 210000
    const result = civ_population(0);
    expect(result).toBe('210,000');
  });

  it('should return "0" for player with no cities', () => {
    expect(civ_population(99)).toBe('0');
  });
});

// ---------------------------------------------------------------------------
// get_year_string
// ---------------------------------------------------------------------------

describe('get_year_string', () => {
  beforeEach(() => {
    store.gameInfo = { turn: 10, year: -2000, timeout: 60, first_timeout: 120, phase: 0 } as any;
    store.calendarInfo = { positive_year_label: 'AD', negative_year_label: 'BC' } as any;
    // is_small_screen is mocked at module level, default returns false
    vi.mocked(isSmallScreen).mockReturnValue(false);
  });

  afterEach(() => {
    store.gameInfo = null;
    store.calendarInfo = null;
  });

  it('should format negative year with BC label', () => {
    const result = get_year_string();
    expect(result).toBe('2000BC (Turn:10)');
  });

  it('should format positive year with AD label', () => {
    store.gameInfo!['year'] = 1500;
    const result = get_year_string();
    expect(result).toBe('1500AD (Turn:10)');
  });

  it('should format year 0 with AD label', () => {
    store.gameInfo!['year'] = 0;
    const result = get_year_string();
    expect(result).toBe('0AD (Turn:10)');
  });

  it('should use short format on small screen', () => {
    vi.mocked(isSmallScreen).mockReturnValue(true);
    store.gameInfo!['year'] = 1500;
    const result = get_year_string();
    expect(result).toBe('1500AD (T:10)');
  });
});

// ---------------------------------------------------------------------------
// current_turn_timeout
// ---------------------------------------------------------------------------

describe('current_turn_timeout', () => {
  beforeEach(() => {
    store.gameInfo = { turn: 5, year: 0, timeout: 60, first_timeout: 120, phase: 0 } as any;
  });

  afterEach(() => {
    store.gameInfo = null;
  });

  it('should return first_timeout on turn 1', () => {
    store.gameInfo!['turn'] = 1;
    expect(current_turn_timeout()).toBe(120);
  });

  it('should return regular timeout on other turns', () => {
    store.gameInfo!['turn'] = 5;
    expect(current_turn_timeout()).toBe(60);
  });

  it('should return regular timeout when first_timeout is -1', () => {
    store.gameInfo!['turn'] = 1;
    store.gameInfo!['first_timeout'] = -1;
    expect(current_turn_timeout()).toBe(60);
  });
});

// ---------------------------------------------------------------------------
// update_game_status_panel
// ---------------------------------------------------------------------------

describe('update_game_status_panel', () => {
  it('does nothing when client state is not C_S_RUNNING', async () => {
    const { statusRefresh } = await import('@/data/signals');
    const before = statusRefresh.value;
    // store.civclientState is 0 (C_S_INITIAL) after reset, not C_S_RUNNING (2)
    update_game_status_panel();
    expect(statusRefresh.value).toBe(before); // unchanged
  });

  it('increments statusRefresh when state is C_S_RUNNING', async () => {
    const { statusRefresh } = await import('@/data/signals');
    store.gameInfo = { turn: 5, year: 0 } as never;
    store.civclientState = 2; // C_S_RUNNING
    const before = statusRefresh.value;
    update_game_status_panel();
    expect(statusRefresh.value).toBe(before + 1);
    store.civclientState = 0;
  });

  it('sets statusPanelLayout signal when state is C_S_RUNNING', async () => {
    const { statusPanelLayout } = await import('@/data/signals');
    store.gameInfo = { turn: 1, year: 0 } as never;
    store.civclientState = 2; // C_S_RUNNING
    update_game_status_panel();
    // Layout is either 'top' or 'bottom' depending on window.innerWidth
    expect(['top', 'bottom']).toContain(statusPanelLayout.value);
    store.civclientState = 0;
  });

  it('statusPanelLayout stays unchanged when not C_S_RUNNING', async () => {
    const { statusPanelLayout } = await import('@/data/signals');
    store.civclientState = 0; // C_S_INITIAL — not running
    const before = statusPanelLayout.value;
    update_game_status_panel();
    expect(statusPanelLayout.value).toBe(before); // unchanged
  });
});

// ── sum_width ─────────────────────────────────────────────────────────────

describe('sum_width', () => {
  it('is exported as a function', async () => {
    const { sum_width } = await import('@/data/game');
    expect(typeof sum_width).toBe('function');
  });

  it('returns 0 when tabs_menu element is absent', async () => {
    const { sum_width } = await import('@/data/game');
    // jsdom has no #tabs_menu element → sum = 0
    expect(sum_width()).toBe(0);
  });
});

// ── game_init ─────────────────────────────────────────────────────────────

describe('game_init', () => {
  it('is exported as a function', async () => {
    const { game_init } = await import('@/data/game');
    expect(typeof game_init).toBe('function');
  });

  it('does not throw', async () => {
    const { game_init } = await import('@/data/game');
    expect(() => game_init()).not.toThrow();
  });
});

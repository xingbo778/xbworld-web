/**
 * Unit tests for data/game.ts
 *
 * Tests game utility functions migrated from legacy game.js.
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
  current_turn_timeout,
  get_year_string,
} from '@/data/game';
import { store } from '@/data/store';
import { isSmallScreen } from '@/utils/helpers';
import type { CalendarInfo, City, GameInfo, Unit } from '@/data/types';

function makeCity(id: number, name: string): City {
  return {
    id,
    owner: 0,
    tile: 0,
    name,
    size: 1,
    food_stock: 0,
    shield_stock: 0,
    production_kind: 0,
    production_value: 0,
    surplus: [],
    waste: [],
    unhappy_penalty: [],
    prod: [],
    citizen_extra: [],
    ppl_happy: [],
    ppl_content: [],
    ppl_unhappy: [],
    ppl_angry: [],
    improvements: [],
  };
}

function makeUnit(id: number, type: number, name: string): Unit {
  return {
    id,
    owner: 0,
    tile: 0,
    type,
    hp: 10,
    veteran: 0,
    movesleft: 0,
    activity: 0,
    transported_by: 0,
    homecity: 0,
    done_moving: false,
    ai: false,
    goto_tile: 0,
    name,
  };
}

function makeGameInfo(overrides: Partial<GameInfo>): GameInfo {
  return {
    turn: 0,
    year: 0,
    timeout: 0,
    first_timeout: 0,
    phase: 0,
    phase_mode: 0,
    ...overrides,
  };
}

function makeCalendarInfo(): CalendarInfo {
  return {
    negative_year_label: ' BC',
    positive_year_label: ' AD',
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('Game constants', () => {
  it('should have IDENTITY_NUMBER_ZERO = 0', () => {
    expect(IDENTITY_NUMBER_ZERO).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// game_find_city_by_number
// ---------------------------------------------------------------------------

describe('game_find_city_by_number', () => {
  beforeEach(() => {
    store.cities = {
      10: makeCity(10, 'Rome'),
      20: makeCity(20, 'London'),
    };
  });

  afterEach(() => {
    store.cities = {};
  });

  it('should find city by number', () => {
    expect(game_find_city_by_number(10)?.name).toBe('Rome');
    expect(game_find_city_by_number(20)?.name).toBe('London');
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
    store.units = {
      1: makeUnit(1, 0, 'Warriors'),
      2: makeUnit(2, 1, 'Settler'),
    };
  });

  afterEach(() => {
    store.units = {};
  });

  it('should find unit by number', () => {
    expect(game_find_unit_by_number(1)?.id).toBe(1);
  });

  it('should return undefined for non-existent unit', () => {
    expect(game_find_unit_by_number(99)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// current_turn_timeout
// ---------------------------------------------------------------------------

describe('current_turn_timeout', () => {
  afterEach(() => {
    store.gameInfo = null;
  });

  it('should return 0 when game_info is null', () => {
    store.gameInfo = null;
    expect(current_turn_timeout()).toBe(0);
  });

  it('should return first_timeout on turn 1 when set', () => {
    store.gameInfo = makeGameInfo({ turn: 1, first_timeout: 120, timeout: 60 });
    expect(current_turn_timeout()).toBe(120);
  });

  it('should return normal timeout on turn 1 when first_timeout is -1', () => {
    store.gameInfo = makeGameInfo({ turn: 1, first_timeout: -1, timeout: 60 });
    expect(current_turn_timeout()).toBe(60);
  });

  it('should return normal timeout on later turns', () => {
    store.gameInfo = makeGameInfo({ turn: 5, first_timeout: 120, timeout: 60 });
    expect(current_turn_timeout()).toBe(60);
  });
});

// ---------------------------------------------------------------------------
// get_year_string
// ---------------------------------------------------------------------------

describe('get_year_string', () => {
  afterEach(() => {
    store.gameInfo = null;
    store.calendarInfo = null;
  });

  it('should format BC year correctly', () => {
    store.gameInfo = makeGameInfo({ year: -4000, turn: 1 });
    store.calendarInfo = makeCalendarInfo();
    vi.mocked(isSmallScreen).mockReturnValue(false);
    const result = get_year_string();
    expect(result).toContain('4000 BC');
    expect(result).toContain('Turn:1');
  });

  it('should format AD year correctly', () => {
    store.gameInfo = makeGameInfo({ year: 1500, turn: 100 });
    store.calendarInfo = makeCalendarInfo();
    vi.mocked(isSmallScreen).mockReturnValue(false);
    const result = get_year_string();
    expect(result).toContain('1500 AD');
    expect(result).toContain('Turn:100');
  });

  it('should use short format on small screen', () => {
    store.gameInfo = makeGameInfo({ year: 1500, turn: 100 });
    store.calendarInfo = makeCalendarInfo();
    vi.mocked(isSmallScreen).mockReturnValue(true);
    const result = get_year_string();
    expect(result).toContain('T:100');
  });
});

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

/* eslint-disable @typescript-eslint/no-explicit-any */

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
    (store as any).cities = {
      10: { id: 10, name: 'Rome' },
      20: { id: 20, name: 'London' },
    };
  });

  afterEach(() => {
    (store as any).cities = {};
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
    (store as any).units = {
      1: { id: 1, type: 0, name: 'Warriors' },
      2: { id: 2, type: 1, name: 'Settler' },
    };
  });

  afterEach(() => {
    (store as any).units = {};
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
    store.gameInfo = { turn: 1, first_timeout: 120, timeout: 60 } as any;
    expect(current_turn_timeout()).toBe(120);
  });

  it('should return normal timeout on turn 1 when first_timeout is -1', () => {
    store.gameInfo = { turn: 1, first_timeout: -1, timeout: 60 } as any;
    expect(current_turn_timeout()).toBe(60);
  });

  it('should return normal timeout on later turns', () => {
    store.gameInfo = { turn: 5, first_timeout: 120, timeout: 60 } as any;
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
    store.gameInfo = { year: -4000, turn: 1 } as any;
    store.calendarInfo = { negative_year_label: ' BC', positive_year_label: ' AD' } as any;
    vi.mocked(isSmallScreen).mockReturnValue(false);
    const result = get_year_string();
    expect(result).toContain('4000 BC');
    expect(result).toContain('Turn:1');
  });

  it('should format AD year correctly', () => {
    store.gameInfo = { year: 1500, turn: 100 } as any;
    store.calendarInfo = { negative_year_label: ' BC', positive_year_label: ' AD' } as any;
    vi.mocked(isSmallScreen).mockReturnValue(false);
    const result = get_year_string();
    expect(result).toContain('1500 AD');
    expect(result).toContain('Turn:100');
  });

  it('should use short format on small screen', () => {
    store.gameInfo = { year: 1500, turn: 100 } as any;
    store.calendarInfo = { negative_year_label: ' BC', positive_year_label: ' AD' } as any;
    vi.mocked(isSmallScreen).mockReturnValue(true);
    const result = get_year_string();
    expect(result).toContain('T:100');
  });
});

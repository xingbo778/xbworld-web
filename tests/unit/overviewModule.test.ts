/**
 * Unit tests for core/overview.ts pure functions and constants.
 */
import { describe, it, expect } from 'vitest';

describe('overview constants', () => {
  it('exports COLOR_OVERVIEW_* constants as numbers', async () => {
    const {
      COLOR_OVERVIEW_UNKNOWN, COLOR_OVERVIEW_MY_CITY, COLOR_OVERVIEW_ALLIED_CITY,
      COLOR_OVERVIEW_ENEMY_CITY, COLOR_OVERVIEW_MY_UNIT, COLOR_OVERVIEW_ALLIED_UNIT,
      COLOR_OVERVIEW_ENEMY_UNIT, COLOR_OVERVIEW_VIEWRECT,
    } = await import('@/core/overview');
    expect(typeof COLOR_OVERVIEW_UNKNOWN).toBe('number');
    expect(typeof COLOR_OVERVIEW_MY_CITY).toBe('number');
    expect(typeof COLOR_OVERVIEW_ALLIED_CITY).toBe('number');
    expect(typeof COLOR_OVERVIEW_ENEMY_CITY).toBe('number');
    expect(typeof COLOR_OVERVIEW_MY_UNIT).toBe('number');
    expect(typeof COLOR_OVERVIEW_ALLIED_UNIT).toBe('number');
    expect(typeof COLOR_OVERVIEW_ENEMY_UNIT).toBe('number');
    expect(typeof COLOR_OVERVIEW_VIEWRECT).toBe('number');
  });

  it('COLOR_OVERVIEW_UNKNOWN is 0 (black)', async () => {
    const { COLOR_OVERVIEW_UNKNOWN } = await import('@/core/overview');
    expect(COLOR_OVERVIEW_UNKNOWN).toBe(0);
  });
});

describe('mark_overview_dirty', () => {
  it('is exported as a function', async () => {
    const { mark_overview_dirty } = await import('@/core/overview');
    expect(typeof mark_overview_dirty).toBe('function');
  });

  it('does not throw', async () => {
    const { mark_overview_dirty } = await import('@/core/overview');
    expect(() => mark_overview_dirty()).not.toThrow();
  });
});

describe('setOverviewActive', () => {
  it('is exported as a function', async () => {
    const { setOverviewActive } = await import('@/core/overview');
    expect(typeof setOverviewActive).toBe('function');
  });

  it('does not throw', async () => {
    const { setOverviewActive } = await import('@/core/overview');
    expect(() => setOverviewActive(true)).not.toThrow();
    expect(() => setOverviewActive(false)).not.toThrow();
  });
});

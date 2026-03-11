/**
 * Unit tests for data/eventConstants.ts and utils/seedrandom.ts
 */
import { describe, it, expect } from 'vitest';

// ── eventConstants ────────────────────────────────────────────────────────

describe('data/eventConstants', () => {
  it('exports E_S_ADVANCE as 0', async () => {
    const { E_S_ADVANCE } = await import('@/data/eventConstants');
    expect(E_S_ADVANCE).toBe(0);
  });

  it('exports E_S_CHAT as 13', async () => {
    const { E_S_CHAT } = await import('@/data/eventConstants');
    expect(E_S_CHAT).toBe(13);
  });

  it('exports E_CITY_CANTBUILD as 0', async () => {
    const { E_CITY_CANTBUILD } = await import('@/data/eventConstants');
    expect(E_CITY_CANTBUILD).toBe(0);
  });

  it('exports E_TECH_GAIN as 69', async () => {
    const { E_TECH_GAIN } = await import('@/data/eventConstants');
    expect(E_TECH_GAIN).toBe(69);
  });

  it('exports E_UNDEFINED as 142', async () => {
    const { E_UNDEFINED } = await import('@/data/eventConstants');
    expect(E_UNDEFINED).toBe(142);
  });

  it('exports fc_e_events as an array of strings', async () => {
    const { fc_e_events } = await import('@/data/eventConstants');
    expect(Array.isArray(fc_e_events)).toBe(true);
    expect(fc_e_events.length).toBeGreaterThan(100);
    expect(typeof fc_e_events[0]).toBe('string');
  });

  it('fc_e_events[0] is e_city_cantbuild', async () => {
    const { fc_e_events } = await import('@/data/eventConstants');
    expect(fc_e_events[0]).toBe('e_city_cantbuild');
  });

  it('fc_e_events length matches E_UNDEFINED + 1', async () => {
    const { fc_e_events, E_UNDEFINED } = await import('@/data/eventConstants');
    expect(fc_e_events.length).toBe(E_UNDEFINED + 1);
  });
});

// ── seedrandom ────────────────────────────────────────────────────────────

describe('utils/seedrandom', () => {
  it('exports seedrandom as a function', async () => {
    const { seedrandom } = await import('@/utils/seedrandom');
    expect(typeof seedrandom).toBe('function');
  });

  it('seedrandom returns a function', async () => {
    const { seedrandom } = await import('@/utils/seedrandom');
    const rng = seedrandom('test');
    expect(typeof rng).toBe('function');
  });

  it('rng() returns a number between 0 and 1', async () => {
    const { seedrandom } = await import('@/utils/seedrandom');
    const rng = seedrandom('hello');
    const val = rng();
    expect(typeof val).toBe('number');
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThan(1);
  });

  it('same seed produces same sequence', async () => {
    const { seedrandom } = await import('@/utils/seedrandom');
    const rng1 = seedrandom('abc');
    const rng2 = seedrandom('abc');
    expect(rng1()).toBe(rng2());
    expect(rng1()).toBe(rng2());
  });

  it('different seeds produce different values', async () => {
    const { seedrandom } = await import('@/utils/seedrandom');
    const rng1 = seedrandom('seed1');
    const rng2 = seedrandom('seed2');
    // Very unlikely to be equal with different seeds
    const v1 = rng1();
    const v2 = rng2();
    expect(v1).not.toBe(v2);
  });

  it('exposes seedrandom on Math', async () => {
    await import('@/utils/seedrandom');
    expect(typeof (Math as unknown as Record<string, unknown>)['seedrandom']).toBe('function');
  });
});

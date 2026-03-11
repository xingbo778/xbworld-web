/**
 * Unit tests for renderer/tilespecUnits.ts and renderer/mapctrl.ts exports.
 */
import { describe, it, expect } from 'vitest';

// ── tilespecUnits ─────────────────────────────────────────────────────────

describe('tilespecUnits exports', () => {
  it('fill_unit_sprite_array is exported as a function', async () => {
    const { fill_unit_sprite_array } = await import('@/renderer/tilespecUnits');
    expect(typeof fill_unit_sprite_array).toBe('function');
  });

  it('get_city_flag_sprite is exported as a function', async () => {
    const { get_city_flag_sprite } = await import('@/renderer/tilespecUnits');
    expect(typeof get_city_flag_sprite).toBe('function');
  });

  it('get_city_food_output_sprite is exported as a function', async () => {
    const { get_city_food_output_sprite } = await import('@/renderer/tilespecUnits');
    expect(typeof get_city_food_output_sprite).toBe('function');
  });

  it('get_city_occupied_sprite is exported as a function', async () => {
    const { get_city_occupied_sprite } = await import('@/renderer/tilespecUnits');
    expect(typeof get_city_occupied_sprite).toBe('function');
  });

  it('get_unit_stack_sprite is exported as a function', async () => {
    const { get_unit_stack_sprite } = await import('@/renderer/tilespecUnits');
    expect(typeof get_unit_stack_sprite).toBe('function');
  });
});

// ── mapctrl ───────────────────────────────────────────────────────────────

describe('mapctrl state setters', () => {
  it('setMapSelectActive is exported as a function', async () => {
    const { setMapSelectActive } = await import('@/renderer/mapctrl');
    expect(typeof setMapSelectActive).toBe('function');
  });

  it('setMapSelectActive does not throw', async () => {
    const { setMapSelectActive } = await import('@/renderer/mapctrl');
    expect(() => setMapSelectActive(true)).not.toThrow();
    expect(() => setMapSelectActive(false)).not.toThrow();
  });

  it('setMapSelectCheck does not throw', async () => {
    const { setMapSelectCheck } = await import('@/renderer/mapctrl');
    expect(() => setMapSelectCheck(false)).not.toThrow();
  });

  it('setTouchStart does not throw', async () => {
    const { setTouchStart } = await import('@/renderer/mapctrl');
    expect(() => setTouchStart(100, 200)).not.toThrow();
  });
});

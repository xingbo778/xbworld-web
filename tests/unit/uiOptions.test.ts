/**
 * Unit tests for ui/options.ts
 */
import { describe, it, expect } from 'vitest';

describe('options exported state', () => {
  it('auto_center_on_unit is exported as a boolean', async () => {
    const { auto_center_on_unit } = await import('@/ui/options');
    expect(typeof auto_center_on_unit).toBe('boolean');
  });

  it('popup_actor_arrival is exported as a boolean', async () => {
    const { popup_actor_arrival } = await import('@/ui/options');
    expect(typeof popup_actor_arrival).toBe('boolean');
  });

  it('draw_fog_of_war is exported as a boolean', async () => {
    const { draw_fog_of_war } = await import('@/ui/options');
    expect(typeof draw_fog_of_war).toBe('boolean');
  });

  it('draw_units is exported as a boolean', async () => {
    const { draw_units } = await import('@/ui/options');
    expect(typeof draw_units).toBe('boolean');
  });
});

describe('setDrawFogOfWar', () => {
  it('is exported as a function', async () => {
    const { setDrawFogOfWar } = await import('@/ui/options');
    expect(typeof setDrawFogOfWar).toBe('function');
  });

  it('does not throw', async () => {
    const { setDrawFogOfWar } = await import('@/ui/options');
    expect(() => setDrawFogOfWar(false)).not.toThrow();
    expect(() => setDrawFogOfWar(true)).not.toThrow();
  });
});

describe('init_options_dialog', () => {
  it('is exported as a function', async () => {
    const { init_options_dialog } = await import('@/ui/options');
    expect(typeof init_options_dialog).toBe('function');
  });

  it('does not throw when audio is null and DOM elements are absent', async () => {
    const { init_options_dialog } = await import('@/ui/options');
    expect(() => init_options_dialog()).not.toThrow();
  });
});

describe('init_theme_selector', () => {
  it('is exported as a function', async () => {
    const { init_theme_selector } = await import('@/ui/options');
    expect(typeof init_theme_selector).toBe('function');
  });

  it('does not throw when container is absent', async () => {
    const { init_theme_selector } = await import('@/ui/options');
    expect(() => init_theme_selector()).not.toThrow();
  });
});

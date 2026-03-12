/**
 * Unit tests for renderer/spriteGetters.ts
 */
import { describe, it, expect } from 'vitest';

describe('get_unit_image_sprite', () => {
  it('is exported as a function', async () => {
    const { get_unit_image_sprite } = await import('@/renderer/spriteGetters');
    expect(typeof get_unit_image_sprite).toBe('function');
  });

  it('returns null when unit has no sprite in tileset', async () => {
    const { get_unit_image_sprite } = await import('@/renderer/spriteGetters');
    const fakeUnit = { type_id: 0, veteran: false, activity: 0 } as never;
    // No tileset loaded in tests → returns null
    expect(get_unit_image_sprite(fakeUnit)).toBeNull();
  });
});

describe('get_unit_type_image_sprite', () => {
  it('is exported as a function', async () => {
    const { get_unit_type_image_sprite } = await import('@/renderer/spriteGetters');
    expect(typeof get_unit_type_image_sprite).toBe('function');
  });

  it('returns null for unit type with no sprite data', async () => {
    const { get_unit_type_image_sprite } = await import('@/renderer/spriteGetters');
    const fakeUT = { graphic_str: 'unknown_unit', graphic_alt: 'unknown_unit2' } as never;
    expect(get_unit_type_image_sprite(fakeUT)).toBeNull();
  });
});

describe('get_improvement_image_sprite', () => {
  it('returns null for null input', async () => {
    const { get_improvement_image_sprite } = await import('@/renderer/spriteGetters');
    expect(get_improvement_image_sprite(null)).toBeNull();
  });

  it('returns null for improvement with no matching sprite', async () => {
    const { get_improvement_image_sprite } = await import('@/renderer/spriteGetters');
    const fakeImpr = { graphic_str: 'unknown', graphic_alt: 'unknown2', name: 'Test' } as never;
    expect(get_improvement_image_sprite(fakeImpr)).toBeNull();
  });
});

describe('get_specialist_image_sprite', () => {
  it('is exported as a function', async () => {
    const { get_specialist_image_sprite } = await import('@/renderer/spriteGetters');
    expect(typeof get_specialist_image_sprite).toBe('function');
  });

  it('returns null for unknown tag', async () => {
    const { get_specialist_image_sprite } = await import('@/renderer/spriteGetters');
    expect(get_specialist_image_sprite('unknown_specialist')).toBeNull();
  });
});

describe('get_technology_image_sprite', () => {
  it('returns null for null input', async () => {
    const { get_technology_image_sprite } = await import('@/renderer/spriteGetters');
    expect(get_technology_image_sprite(null)).toBeNull();
  });
});

describe('get_treaty_agree_thumb_up', () => {
  it('is exported as a function', async () => {
    const { get_treaty_agree_thumb_up } = await import('@/renderer/spriteGetters');
    expect(typeof get_treaty_agree_thumb_up).toBe('function');
  });
});

describe('get_treaty_disagree_thumb_down', () => {
  it('is exported as a function', async () => {
    const { get_treaty_disagree_thumb_down } = await import('@/renderer/spriteGetters');
    expect(typeof get_treaty_disagree_thumb_down).toBe('function');
  });
});

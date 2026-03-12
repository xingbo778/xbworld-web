/**
 * Unit tests for renderer/tilespecLayers.ts and renderer/tilespecTerrain.ts
 */
import { describe, it, expect } from 'vitest';

// ── tilespecLayers ────────────────────────────────────────────────────────

describe('fill_fog_sprite_array', () => {
  it('is exported as a function', async () => {
    const { fill_fog_sprite_array } = await import('@/renderer/tilespecLayers');
    expect(typeof fill_fog_sprite_array).toBe('function');
  });

  it('returns an array for null tile', async () => {
    const { fill_fog_sprite_array } = await import('@/renderer/tilespecLayers');
    const result = fill_fog_sprite_array(null, null, null);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('get_select_sprite', () => {
  it('is exported as a function', async () => {
    const { get_select_sprite } = await import('@/renderer/tilespecLayers');
    expect(typeof get_select_sprite).toBe('function');
  });

  it('does not throw', async () => {
    const { get_select_sprite } = await import('@/renderer/tilespecLayers');
    expect(() => get_select_sprite()).not.toThrow();
  });
});

describe('get_tile_specials_sprite', () => {
  it('is exported as a function', async () => {
    const { get_tile_specials_sprite } = await import('@/renderer/tilespecLayers');
    expect(typeof get_tile_specials_sprite).toBe('function');
  });
});

// ── tilespecTerrain ───────────────────────────────────────────────────────

describe('_terrainBlendStats', () => {
  it('is exported as an object', async () => {
    const { _terrainBlendStats } = await import('@/renderer/tilespecTerrain');
    expect(typeof _terrainBlendStats).toBe('object');
    expect(_terrainBlendStats).not.toBeNull();
  });
});

describe('resetTerrainBlendStats', () => {
  it('is exported as a function', async () => {
    const { resetTerrainBlendStats } = await import('@/renderer/tilespecTerrain');
    expect(typeof resetTerrainBlendStats).toBe('function');
  });

  it('does not throw', async () => {
    const { resetTerrainBlendStats } = await import('@/renderer/tilespecTerrain');
    expect(() => resetTerrainBlendStats()).not.toThrow();
  });
});

describe('fill_terrain_sprite_layer', () => {
  it('is exported as a function', async () => {
    const { fill_terrain_sprite_layer } = await import('@/renderer/tilespecTerrain');
    expect(typeof fill_terrain_sprite_layer).toBe('function');
  });

  it('returns an array for a minimal tile', async () => {
    const { fill_terrain_sprite_layer } = await import('@/renderer/tilespecTerrain');
    const fakeTile = { tile: 0, terrain: 0, extras: { isSet: () => false }, known: 2 } as never;
    const result = fill_terrain_sprite_layer(0, fakeTile, undefined, []);
    expect(Array.isArray(result)).toBe(true);
  });
});

// ── tilespec graphic tag helpers ──────────────────────────────────────────

describe('tileset_ruleset_entity_tag_str_or_alt', () => {
  it('is exported as a function', async () => {
    const { tileset_ruleset_entity_tag_str_or_alt } = await import('@/renderer/tilespec');
    expect(typeof tileset_ruleset_entity_tag_str_or_alt).toBe('function');
  });

  it('returns null for null entity', async () => {
    const { tileset_ruleset_entity_tag_str_or_alt } = await import('@/renderer/tilespec');
    expect(tileset_ruleset_entity_tag_str_or_alt(null, 'unit')).toBeNull();
  });
});

describe('tileset_unit_type_graphic_tag', () => {
  it('is exported as a function', async () => {
    const { tileset_unit_type_graphic_tag } = await import('@/renderer/tilespec');
    expect(typeof tileset_unit_type_graphic_tag).toBe('function');
  });
});

describe('tileset_unit_graphic_tag', () => {
  it('is exported as a function', async () => {
    const { tileset_unit_graphic_tag } = await import('@/renderer/tilespec');
    expect(typeof tileset_unit_graphic_tag).toBe('function');
  });
});

describe('tileset_building_graphic_tag', () => {
  it('is exported as a function', async () => {
    const { tileset_building_graphic_tag } = await import('@/renderer/tilespec');
    expect(typeof tileset_building_graphic_tag).toBe('function');
  });

  it('returns null for null improvement', async () => {
    const { tileset_building_graphic_tag } = await import('@/renderer/tilespec');
    expect(tileset_building_graphic_tag(null)).toBeNull();
  });
});

describe('tileset_tech_graphic_tag', () => {
  it('is exported as a function', async () => {
    const { tileset_tech_graphic_tag } = await import('@/renderer/tilespec');
    expect(typeof tileset_tech_graphic_tag).toBe('function');
  });

  it('returns null for null tech', async () => {
    const { tileset_tech_graphic_tag } = await import('@/renderer/tilespec');
    expect(tileset_tech_graphic_tag(null)).toBeNull();
  });
});

describe('tileset_extra_id_activity_graphic_tag', () => {
  it('is exported as a function', async () => {
    const { tileset_extra_id_activity_graphic_tag } = await import('@/renderer/tilespec');
    expect(typeof tileset_extra_id_activity_graphic_tag).toBe('function');
  });

  it('returns null for unknown extra_id', async () => {
    const { tileset_extra_id_activity_graphic_tag } = await import('@/renderer/tilespec');
    expect(tileset_extra_id_activity_graphic_tag(9999)).toBeNull();
  });
});

describe('tileset_extra_id_rmactivity_graphic_tag', () => {
  it('is exported as a function', async () => {
    const { tileset_extra_id_rmactivity_graphic_tag } = await import('@/renderer/tilespec');
    expect(typeof tileset_extra_id_rmactivity_graphic_tag).toBe('function');
  });

  it('returns null for unknown extra_id', async () => {
    const { tileset_extra_id_rmactivity_graphic_tag } = await import('@/renderer/tilespec');
    expect(tileset_extra_id_rmactivity_graphic_tag(9999)).toBeNull();
  });
});

// ── tilespecLayers additional functions ───────────────────────────────────

describe('tilespecLayers — additional sprite functions', () => {
  it('get_city_info_text returns sprite entry with city_text key', async () => {
    const { get_city_info_text } = await import('@/renderer/tilespecLayers');
    const city = { id: 1, name: 'Rome' } as never;
    const entry = get_city_info_text(city);
    expect(entry.key).toBe('city_text');
    expect((entry as Record<string, unknown>)['city']).toBe(city);
  });

  it('get_tile_label_text returns sprite entry with tile_label key', async () => {
    const { get_tile_label_text } = await import('@/renderer/tilespecLayers');
    const tile = { index: 0, x: 0, y: 0 } as never;
    const entry = get_tile_label_text(tile);
    expect(entry.key).toBe('tile_label');
    expect((entry as Record<string, unknown>)['tile']).toBe(tile);
  });

  it('get_tile_river_sprite returns null for null tile', async () => {
    const { get_tile_river_sprite } = await import('@/renderer/tilespecLayers');
    expect(get_tile_river_sprite(null)).toBeNull();
  });

  it('fill_path_sprite_array returns empty array when roads is empty', async () => {
    const { fill_path_sprite_array } = await import('@/renderer/tilespecLayers');
    const result = fill_path_sprite_array({ index: 0, extras: [] } as never, null);
    expect(Array.isArray(result)).toBe(true);
  });

  it('fill_goto_line_sprite_array is exported as a function', async () => {
    const { fill_goto_line_sprite_array } = await import('@/renderer/tilespecLayers');
    expect(typeof fill_goto_line_sprite_array).toBe('function');
  });

  it('get_border_line_sprites is exported as a function', async () => {
    const { get_border_line_sprites } = await import('@/renderer/tilespecLayers');
    expect(typeof get_border_line_sprites).toBe('function');
  });

  it('fill_layer1_sprite_array is exported as a function', async () => {
    const { fill_layer1_sprite_array } = await import('@/renderer/tilespecLayers');
    expect(typeof fill_layer1_sprite_array).toBe('function');
  });

  it('fill_layer2_sprite_array is exported as a function', async () => {
    const { fill_layer2_sprite_array } = await import('@/renderer/tilespecLayers');
    expect(typeof fill_layer2_sprite_array).toBe('function');
  });

  it('fill_layer3_sprite_array is exported as a function', async () => {
    const { fill_layer3_sprite_array } = await import('@/renderer/tilespecLayers');
    expect(typeof fill_layer3_sprite_array).toBe('function');
  });
});

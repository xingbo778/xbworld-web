/**
 * Unit tests for net/handlers/ruleset.ts
 * Covers export checks and no-throw smoke tests for key handlers.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('handle_ruleset_terrain', () => {
  it('is exported as a function', async () => {
    const { handle_ruleset_terrain } = await import('@/net/handlers/ruleset');
    expect(typeof handle_ruleset_terrain).toBe('function');
  });

  it('stores terrain packet by id', async () => {
    const { handle_ruleset_terrain } = await import('@/net/handlers/ruleset');
    handle_ruleset_terrain({ id: 3, name: 'Grassland', helptext: '' } as never);
    expect(store.terrains[3]).toMatchObject({ id: 3, name: 'Grassland' });
  });
});

describe('handle_ruleset_resource', () => {
  it('is exported as a function', async () => {
    const { handle_ruleset_resource } = await import('@/net/handlers/ruleset');
    expect(typeof handle_ruleset_resource).toBe('function');
  });

  it('does not throw for a minimal packet', async () => {
    const { handle_ruleset_resource } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_resource({ id: 1, name: 'Fish' } as never)).not.toThrow();
  });
});

describe('handle_ruleset_game', () => {
  it('is exported as a function', async () => {
    const { handle_ruleset_game } = await import('@/net/handlers/ruleset');
    expect(typeof handle_ruleset_game).toBe('function');
  });

  it('does not throw for a minimal packet', async () => {
    const { handle_ruleset_game } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_game({ default_specialist: 0 } as never)).not.toThrow();
  });
});

describe('handle_ruleset_specialist', () => {
  it('stores specialist packet by id', async () => {
    const { handle_ruleset_specialist } = await import('@/net/handlers/ruleset');
    handle_ruleset_specialist({ id: 0, name: 'Scientist', helptext: '' } as never);
    expect(store.specialists[0]).toMatchObject({ id: 0, name: 'Scientist' });
  });
});

describe('handle_ruleset_nation_groups', () => {
  it('does not throw', async () => {
    const { handle_ruleset_nation_groups } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_nation_groups({ groups: [] } as never)).not.toThrow();
  });
});

describe('handle_ruleset_government', () => {
  it('stores government by id', async () => {
    const { handle_ruleset_government } = await import('@/net/handlers/ruleset');
    handle_ruleset_government({ id: 1, name: 'Democracy', helptext: '' } as never);
    expect(store.governments[1]).toMatchObject({ id: 1, name: 'Democracy' });
  });
});

describe('handle_ruleset_tech', () => {
  it('is exported as a function', async () => {
    const { handle_ruleset_tech } = await import('@/net/handlers/ruleset');
    expect(typeof handle_ruleset_tech).toBe('function');
  });

  it('stores tech by id', async () => {
    const { handle_ruleset_tech } = await import('@/net/handlers/ruleset');
    handle_ruleset_tech({ id: 5, name: 'Alphabet', helptext: '', req: [0, 0], research_cost: 20, flags: 0 } as never);
    expect(store.techs[5]).toMatchObject({ id: 5, name: 'Alphabet' });
  });
});

describe('handle_ruleset_building', () => {
  it('stores improvement by id', async () => {
    const { handle_ruleset_building } = await import('@/net/handlers/ruleset');
    handle_ruleset_building({ id: 10, name: 'Barracks', helptext: '' } as never);
    expect(store.improvements[10]).toMatchObject({ id: 10, name: 'Barracks' });
  });
});

describe('handle_ruleset_unit', () => {
  it('stores unit type by id', async () => {
    const { handle_ruleset_unit } = await import('@/net/handlers/ruleset');
    handle_ruleset_unit({ id: 2, name: 'Warrior', helptext: '', attack_strength: 1, defense_strength: 1,
      move_rate: 1, hp: 10, firepower: 1, vision_radius_sq: 2, transport_capacity: 0,
      cargo: 0, flags: [], roles: [], obsoleted_by: -1, converted_to: -1,
      fuel: 0, bombard_rate: 0, convert_time: 0 } as never);
    expect(store.unitTypes[2]).toMatchObject({ id: 2, name: 'Warrior' });
  });
});

describe('handle_ruleset_unit_class', () => {
  it('stores unit class by id', async () => {
    const { handle_ruleset_unit_class } = await import('@/net/handlers/ruleset');
    handle_ruleset_unit_class({ id: 0, name: 'Land', helptext: '', move_type: 1, min_speed: 1,
      hp_loss_pct: 0, hut_behavior: 0, flags: [] } as never);
    expect(store.unitClasses[0]).toMatchObject({ id: 0, name: 'Land' });
  });
});

describe('handle_ruleset_extra', () => {
  it('stores extra by id', async () => {
    const { handle_ruleset_extra } = await import('@/net/handlers/ruleset');
    handle_ruleset_extra({ id: 1, name: 'Road', rule_name: 'Road', helptext: '', category: 0, causes: [],
      rmcauses: [], move_cost: 1, defense_bonus: 0, unit_seen_bonus: 0,
      buildable: false, build_time: 3, build_reqs: [], native_to: [], flag_str: [],
      hidden_by: [], bridged_over: [] } as never);
    expect(store.extras[1]).toMatchObject({ id: 1 });
  });
});

describe('handle_rulesets_ready', () => {
  it('is exported as a function', async () => {
    const { handle_rulesets_ready } = await import('@/net/handlers/ruleset');
    expect(typeof handle_rulesets_ready).toBe('function');
  });

  it('does not throw with empty store', async () => {
    const { handle_rulesets_ready } = await import('@/net/handlers/ruleset');
    expect(() => handle_rulesets_ready({} as never)).not.toThrow();
  });
});

describe('handle_ruleset_control', () => {
  it('is exported as a function', async () => {
    const { handle_ruleset_control } = await import('@/net/handlers/ruleset');
    expect(typeof handle_ruleset_control).toBe('function');
  });

  it('does not throw for a minimal control packet', async () => {
    const { handle_ruleset_control } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_control({
      name: 'civ2civ3', version: '2.6', desc_file: '',
      prefered_tileset: '', prefered_soundset: '', prefered_musicset: '',
      num_unit_classes: 1, num_units: 2, num_impr_types: 5,
      num_tech_types: 10, num_base_types: 2, num_road_types: 2,
      num_resource_types: 3, num_extra_types: 4, num_goods_types: 1,
      num_disaster_types: 0, num_achievement_types: 0, num_multipliers: 0,
      num_specialists: 3, num_governments: 3, num_terrain_types: 12,
      style_count: 1, nation_sets_count: 1, nation_groups_count: 3,
      nation_count: 50, default_government_id: 0, government_during_revolution_id: -1,
    } as never)).not.toThrow();
  });
});

describe('no-op handlers', () => {
  it('handle_ruleset_choices does not throw', async () => {
    const { handle_ruleset_choices } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_choices({} as never)).not.toThrow();
  });

  it('handle_game_load does not throw', async () => {
    const { handle_game_load } = await import('@/net/handlers/ruleset');
    expect(() => handle_game_load({} as never)).not.toThrow();
  });

  it('handle_ruleset_music does not throw', async () => {
    const { handle_ruleset_music } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_music({} as never)).not.toThrow();
  });

  it('handle_popup_image does not throw', async () => {
    const { handle_popup_image } = await import('@/net/handlers/ruleset');
    expect(() => handle_popup_image({} as never)).not.toThrow();
  });

  it('handle_play_music does not throw', async () => {
    const { handle_play_music } = await import('@/net/handlers/ruleset');
    expect(() => handle_play_music({} as never)).not.toThrow();
  });
});

// ── additional no-op/simple handlers ─────────────────────────────────────

describe('handle_ruleset_tech_class / handle_ruleset_tech_flag / handle_ruleset_action / handle_ruleset_goods / handle_ruleset_clause / handle_ruleset_effect', () => {
  it('handle_ruleset_tech_class does not throw', async () => {
    const { handle_ruleset_tech_class } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_tech_class({} as never)).not.toThrow();
  });

  it('handle_ruleset_tech_flag does not throw', async () => {
    const { handle_ruleset_tech_flag } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_tech_flag({} as never)).not.toThrow();
  });

  it('handle_ruleset_action is exported', async () => {
    const { handle_ruleset_action } = await import('@/net/handlers/ruleset');
    expect(typeof handle_ruleset_action).toBe('function');
  });

  it('handle_ruleset_goods does not throw', async () => {
    const { handle_ruleset_goods } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_goods({ id: 0 } as never)).not.toThrow();
  });

  it('handle_ruleset_clause does not throw', async () => {
    const { handle_ruleset_clause } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_clause({} as never)).not.toThrow();
  });

  it('handle_ruleset_effect does not throw', async () => {
    const { handle_ruleset_effect } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_effect({} as never)).not.toThrow();
  });

  it('handle_ruleset_description_part does not throw', async () => {
    const { handle_ruleset_description_part } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_description_part({ text: 'test' } as never)).not.toThrow();
  });
});

// ── remaining ruleset handlers ─────────────────────────────────────────────

describe('handle_web_ruleset_unit_addition', () => {
  it('is exported as a function', async () => {
    const { handle_web_ruleset_unit_addition } = await import('@/net/handlers/ruleset');
    expect(typeof handle_web_ruleset_unit_addition).toBe('function');
  });

  it('does not throw for minimal packet', async () => {
    const { handle_web_ruleset_unit_addition } = await import('@/net/handlers/ruleset');
    expect(() => handle_web_ruleset_unit_addition({ id: 2, graphic_str: 'warrior', graphic_alt: '-' } as never)).not.toThrow();
  });
});

describe('recreate_old_tech_req', () => {
  it('is exported as a function', async () => {
    const { recreate_old_tech_req } = await import('@/net/handlers/ruleset');
    expect(typeof recreate_old_tech_req).toBe('function');
  });

  it('does not throw for a tech packet with req array', async () => {
    const { recreate_old_tech_req } = await import('@/net/handlers/ruleset');
    expect(() => recreate_old_tech_req({ id: 5, req: [1, 2] } as never)).not.toThrow();
  });
});

describe('handle_ruleset_unit_flag', () => {
  it('is exported as a function', async () => {
    const { handle_ruleset_unit_flag } = await import('@/net/handlers/ruleset');
    expect(typeof handle_ruleset_unit_flag).toBe('function');
  });

  it('does not throw', async () => {
    const { handle_ruleset_unit_flag } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_unit_flag({ id: 0, name: 'IgTer', helptxt: '' } as never)).not.toThrow();
  });
});

describe('handle_ruleset_unit_class_flag', () => {
  it('does not throw', async () => {
    const { handle_ruleset_unit_class_flag } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_unit_class_flag({ id: 0, name: 'TerrainSpeed', helptxt: '' } as never)).not.toThrow();
  });
});

describe('handle_ruleset_unit_bonus', () => {
  it('does not throw', async () => {
    const { handle_ruleset_unit_bonus } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_unit_bonus({} as never)).not.toThrow();
  });
});

describe('handle_ruleset_terrain_flag', () => {
  it('does not throw', async () => {
    const { handle_ruleset_terrain_flag } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_terrain_flag({ id: 0, name: 'Oceanic', helptxt: '' } as never)).not.toThrow();
  });
});

describe('handle_ruleset_disaster', () => {
  it('does not throw', async () => {
    const { handle_ruleset_disaster } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_disaster({ id: 0 } as never)).not.toThrow();
  });
});

describe('handle_ruleset_trade', () => {
  it('does not throw', async () => {
    const { handle_ruleset_trade } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_trade({} as never)).not.toThrow();
  });
});

describe('handle_ruleset_nation', () => {
  it('is exported as a function', async () => {
    const { handle_ruleset_nation } = await import('@/net/handlers/ruleset');
    expect(typeof handle_ruleset_nation).toBe('function');
  });

  it('does not throw for a minimal nation packet', async () => {
    const { handle_ruleset_nation } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_nation({ id: 0, name: 'Romans', plural: 'Romans', rule_name: 'romans',
      groups: [], leader_name: [], leader_sex: [], init_techs: [], init_buildings: [], init_units: [],
      style: 0, legend: '', color: { r: 255, g: 0, b: 0 }, graphic_str: 'romans' } as never)).not.toThrow();
  });
});

describe('handle_ruleset_city', () => {
  it('does not throw for a minimal city packet', async () => {
    const { handle_ruleset_city } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_city({ styles: [] } as never)).not.toThrow();
  });
});

describe('handle_ruleset_summary', () => {
  it('does not throw', async () => {
    const { handle_ruleset_summary } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_summary({ text: 'Summary of the rules' } as never)).not.toThrow();
  });
});

describe('handle_ruleset_terrain_control', () => {
  it('does not throw', async () => {
    const { handle_ruleset_terrain_control } = await import('@/net/handlers/ruleset');
    expect(() => handle_ruleset_terrain_control({ single_move_bonus: 0, move_fragments: 3,
      min_city_size: 1, ocean_reclaim_requirement_pct: 0,
      land_channel_requirement_pct: 0, lake_max_size: 0,
      have_huts: true, aqueduct_size: 8, conquest_tech_pct: 0,
      irrigate_bad_type: -1, cold_irrigate_bad_type: -1,
      road_pittance: 0 } as never)).not.toThrow();
  });
});

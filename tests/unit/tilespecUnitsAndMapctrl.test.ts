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

// ── mapctrl additional functions ──────────────────────────────────────────

describe('mapctrl additional exports', () => {
  it('mapctrl_init_pixi is exported as a function', async () => {
    const { mapctrl_init_pixi } = await import('@/renderer/mapctrl');
    expect(typeof mapctrl_init_pixi).toBe('function');
  });

  it('mapview_mouse_click is exported as a function', async () => {
    const { mapview_mouse_click } = await import('@/renderer/mapctrl');
    expect(typeof mapview_mouse_click).toBe('function');
  });

  it('mapview_mouse_down is exported as a function', async () => {
    const { mapview_mouse_down } = await import('@/renderer/mapctrl');
    expect(typeof mapview_mouse_down).toBe('function');
  });

  it('mapview_touch_start is exported as a function', async () => {
    const { mapview_touch_start } = await import('@/renderer/mapctrl');
    expect(typeof mapview_touch_start).toBe('function');
  });

  it('mapview_touch_end is exported as a function', async () => {
    const { mapview_touch_end } = await import('@/renderer/mapctrl');
    expect(typeof mapview_touch_end).toBe('function');
  });

  it('mapview_touch_move is exported as a function', async () => {
    const { mapview_touch_move } = await import('@/renderer/mapctrl');
    expect(typeof mapview_touch_move).toBe('function');
  });

  it('city_mapview_mouse_click is exported as a function', async () => {
    const { city_mapview_mouse_click } = await import('@/renderer/mapctrl');
    expect(typeof city_mapview_mouse_click).toBe('function');
  });

  it('action_button_pressed is exported as a function', async () => {
    const { action_button_pressed } = await import('@/renderer/mapctrl');
    expect(typeof action_button_pressed).toBe('function');
  });

  it('city_action_button_pressed is exported as a function', async () => {
    const { city_action_button_pressed } = await import('@/renderer/mapctrl');
    expect(typeof city_action_button_pressed).toBe('function');
  });

  it('map_select_units is exported as a function', async () => {
    const { map_select_units } = await import('@/renderer/mapctrl');
    expect(typeof map_select_units).toBe('function');
  });

  it('recenter_button_pressed is exported as a function', async () => {
    const { recenter_button_pressed } = await import('@/renderer/mapctrl');
    expect(typeof recenter_button_pressed).toBe('function');
  });
});

// ── tilespecUnits additional functions ────────────────────────────────────

describe('tilespecUnits — additional sprite functions', () => {
  it('get_city_shields_output_sprite returns sprite entry with key', async () => {
    const { get_city_shields_output_sprite } = await import('@/renderer/tilespecUnits');
    const entry = get_city_shields_output_sprite(3);
    expect(entry).toMatchObject({ key: 'city.t_shields_3' });
  });

  it('get_city_trade_output_sprite returns sprite entry with key', async () => {
    const { get_city_trade_output_sprite } = await import('@/renderer/tilespecUnits');
    const entry = get_city_trade_output_sprite(2);
    expect(entry).toMatchObject({ key: 'city.t_trade_2' });
  });

  it('get_city_invalid_worked_sprite returns grid.unavailable key', async () => {
    const { get_city_invalid_worked_sprite } = await import('@/renderer/tilespecUnits');
    const entry = get_city_invalid_worked_sprite();
    expect(entry.key).toBe('grid.unavailable');
  });

  it('get_base_flag_sprite returns empty key for tile with no extras_owner', async () => {
    const { get_base_flag_sprite } = await import('@/renderer/tilespecUnits');
    const entry = get_base_flag_sprite({ extras_owner: undefined } as never);
    expect(entry.key).toBe('');
  });

  it('get_city_sprite is exported as a function', async () => {
    const { get_city_sprite } = await import('@/renderer/tilespecUnits');
    expect(typeof get_city_sprite).toBe('function');
  });

  it('get_unit_hp_sprite is exported as a function', async () => {
    const { get_unit_hp_sprite } = await import('@/renderer/tilespecUnits');
    expect(typeof get_unit_hp_sprite).toBe('function');
  });

  it('get_unit_veteran_sprite is exported as a function', async () => {
    const { get_unit_veteran_sprite } = await import('@/renderer/tilespecUnits');
    expect(typeof get_unit_veteran_sprite).toBe('function');
  });

  it('get_unit_activity_sprite is exported as a function', async () => {
    const { get_unit_activity_sprite } = await import('@/renderer/tilespecUnits');
    expect(typeof get_unit_activity_sprite).toBe('function');
  });

  it('get_unit_agent_sprite is exported as a function', async () => {
    const { get_unit_agent_sprite } = await import('@/renderer/tilespecUnits');
    expect(typeof get_unit_agent_sprite).toBe('function');
  });

  it('get_unit_nation_flag_sprite is exported as a function', async () => {
    const { get_unit_nation_flag_sprite } = await import('@/renderer/tilespecUnits');
    expect(typeof get_unit_nation_flag_sprite).toBe('function');
  });
});

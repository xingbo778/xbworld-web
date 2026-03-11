/**
 * Tests that active packet handlers emit the correct globalEvents so that
 * Preact signals (cityCount, unitCount, playerCount, etc.) stay in sync.
 *
 * These handlers are in net/handlers/ and are dispatched via the active
 * client_handle_packet() → packet_hand_table path (not the dead net/packets/ system).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { store } from '@/data/store';
import { globalEvents } from '@/core/events';

beforeEach(() => {
  store.reset();
});

// ── city:updated ───────────────────────────────────────────────────────────

describe('handle_city_info emits city:updated', () => {
  it('emits city:updated with packet data', async () => {
    const { handle_city_info } = await import('@/net/handlers/city');
    const handler = vi.fn();
    globalEvents.on('city:updated', handler);

    handle_city_info({
      id: 10, owner: 0, tile: 55, name: 'Rome', size: 5,
      food_stock: 0, shield_stock: 0, production_kind: 0, production_value: 0,
      surplus: [], waste: [], unhappy_penalty: [], prod: [],
      citizen_extra: [], ppl_happy: [], ppl_content: [], ppl_unhappy: [], ppl_angry: [],
      improvements: [], city_options: [],
    } as never);

    expect(handler).toHaveBeenCalled();
    globalEvents.off('city:updated', handler);
  });

  it('emits city:updated on second call (update path)', async () => {
    const { handle_city_info } = await import('@/net/handlers/city');
    const handler = vi.fn();

    const basePacket = {
      id: 10, owner: 0, tile: 55, name: 'Rome', size: 5,
      food_stock: 0, shield_stock: 0, production_kind: 0, production_value: 0,
      surplus: [], waste: [], unhappy_penalty: [], prod: [],
      citizen_extra: [], ppl_happy: [], ppl_content: [], ppl_unhappy: [], ppl_angry: [],
      improvements: [], city_options: [],
    } as never;

    handle_city_info(basePacket); // create
    globalEvents.on('city:updated', handler);
    handle_city_info({ ...basePacket, size: 6 } as never); // update

    expect(handler).toHaveBeenCalled();
    globalEvents.off('city:updated', handler);
  });
});

describe('handle_city_short_info emits city:updated', () => {
  it('emits city:updated', async () => {
    const { handle_city_short_info } = await import('@/net/handlers/city');
    const handler = vi.fn();
    globalEvents.on('city:updated', handler);

    handle_city_short_info({
      id: 20, owner: 0, tile: 10, name: 'Athens', size: 3,
      improvements: [],
    } as never);

    expect(handler).toHaveBeenCalled();
    globalEvents.off('city:updated', handler);
  });
});

// ── unit:updated ───────────────────────────────────────────────────────────

describe('handle_unit_info emits unit:updated', () => {
  it('emits unit:updated', async () => {
    const { handle_unit_info } = await import('@/net/handlers/unit');
    const handler = vi.fn();
    globalEvents.on('unit:updated', handler);

    handle_unit_info({
      id: 7, owner: 0, tile: 55, type: 1, hp: 10,
      veteran: 0, movesleft: 3, activity: 0,
      transported_by: -1, homecity: 0,
      done_moving: false, ai: false, goto_tile: -1,
      action_decision_want: 0, action_decision_tile: -1,
      anim_list: [],
    } as never);

    expect(handler).toHaveBeenCalled();
    globalEvents.off('unit:updated', handler);
  });
});

// ── unit:removed ───────────────────────────────────────────────────────────

describe('handle_unit_remove emits unit:removed', () => {
  it('emits unit:removed when unit exists', async () => {
    const { handle_unit_remove } = await import('@/net/handlers/unit');
    store.units[5] = {
      id: 5, owner: 0, tile: 10, type: 1, hp: 10,
    } as never;

    const handler = vi.fn();
    globalEvents.on('unit:removed', handler);

    handle_unit_remove({ unit_id: 5 } as never);

    expect(handler).toHaveBeenCalled();
    globalEvents.off('unit:removed', handler);
  });
});

// ── player:removed ─────────────────────────────────────────────────────────

describe('handle_player_remove emits player:removed', () => {
  it('emits player:removed and removes from store', async () => {
    const { handle_player_remove } = await import('@/net/handlers/player');
    store.players[3] = { playerno: 3, name: 'Caesar' } as never;

    const handler = vi.fn();
    globalEvents.on('player:removed', handler);

    handle_player_remove({ playerno: 3 } as never);

    expect(store.players[3]).toBeUndefined();
    expect(handler).toHaveBeenCalled();
    globalEvents.off('player:removed', handler);
  });
});

// ── connection:updated ─────────────────────────────────────────────────────

describe('handle_conn_info emits connection:updated', () => {
  it('emits connection:updated', async () => {
    const { handle_conn_info } = await import('@/net/handlers/server');
    const handler = vi.fn();
    globalEvents.on('connection:updated', handler);

    // Use id:0 (matches store.client.conn.id after reset) and used:true
    handle_conn_info({
      id: 0, used: true, player_num: -1, established: true,
      playing: null, access_level: 0, username: 'observer',
    } as never);

    expect(handler).toHaveBeenCalled();
    globalEvents.off('connection:updated', handler);
  });
});

// ── signals integration ────────────────────────────────────────────────────

describe('cityCount signal updates via handle_city_info', () => {
  it('cityCount increments when handle_city_info is called', async () => {
    const { cityCount } = await import('@/data/signals');
    const { handle_city_info } = await import('@/net/handlers/city');
    const before = cityCount.value;

    handle_city_info({
      id: 50, owner: 0, tile: 1, name: 'Carthage', size: 2,
      food_stock: 0, shield_stock: 0, production_kind: 0, production_value: 0,
      surplus: [], waste: [], unhappy_penalty: [], prod: [],
      citizen_extra: [], ppl_happy: [], ppl_content: [], ppl_unhappy: [], ppl_angry: [],
      improvements: [], city_options: [],
    } as never);

    expect(cityCount.value).toBe(before + 1);
  });
});

describe('unitCount signal updates via handle_unit_info', () => {
  it('unitCount increments when handle_unit_info is called', async () => {
    const { unitCount } = await import('@/data/signals');
    const { handle_unit_info } = await import('@/net/handlers/unit');
    const before = unitCount.value;

    handle_unit_info({
      id: 99, owner: 0, tile: 5, type: 2, hp: 20,
      veteran: 0, movesleft: 2, activity: 0,
      transported_by: -1, homecity: 0,
      done_moving: false, ai: false, goto_tile: -1,
      action_decision_want: 0, action_decision_tile: -1,
      anim_list: [],
    } as never);

    expect(unitCount.value).toBe(before + 1);
  });
});

// ── game:info / game:beginturn ─────────────────────────────────────────────

describe('handle_game_info emits game:info', () => {
  it('emits game:info with packet', async () => {
    const { handle_game_info } = await import('@/net/handlers/gameState');
    const handler = vi.fn();
    globalEvents.on('game:info', handler);

    handle_game_info({ turn: 3, year: -3000 } as never);

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ turn: 3 }));
    globalEvents.off('game:info', handler);
  });

  it('currentTurn signal updates via handle_game_info', async () => {
    const { currentTurn } = await import('@/data/signals');
    const { handle_game_info } = await import('@/net/handlers/gameState');

    handle_game_info({ turn: 42, year: 0 } as never);

    expect(currentTurn.value).toBe(42);
  });
});

describe('handle_begin_turn emits game:beginturn', () => {
  it('emits game:beginturn', async () => {
    const { handle_begin_turn } = await import('@/net/handlers/gameState');
    const handler = vi.fn();
    globalEvents.on('game:beginturn', handler);

    handle_begin_turn({} as never);

    expect(handler).toHaveBeenCalled();
    globalEvents.off('game:beginturn', handler);
  });
});

// ── map:allocated / tile:updated ───────────────────────────────────────────

describe('handle_map_info emits map:allocated', () => {
  it('emits map:allocated', async () => {
    const { handle_map_info } = await import('@/net/handlers/map');
    const handler = vi.fn();
    globalEvents.on('map:allocated', handler);

    handle_map_info({ xsize: 80, ysize: 50, topology_id: 0, wrap_id: 0 } as never);

    expect(handler).toHaveBeenCalled();
    globalEvents.off('map:allocated', handler);
  });
});

// ── game:newyear ───────────────────────────────────────────────────────────

describe('handle_new_year emits game:newyear', () => {
  it('emits game:newyear and updates store.gameInfo', async () => {
    const { handle_game_info, handle_new_year } = await import('@/net/handlers/gameState');
    // Ensure store.gameInfo exists
    handle_game_info({ turn: 1, year: -4000 } as never);

    const handler = vi.fn();
    globalEvents.on('game:newyear', handler);
    handle_new_year({ turn: 2, year: -3950, fragments: 0 } as never);

    expect(handler).toHaveBeenCalled();
    expect(store.gameInfo?.['turn']).toBe(2);
    globalEvents.off('game:newyear', handler);
  });
});

// ── settings:updated ───────────────────────────────────────────────────────

describe('handle_server_setting_bool emits settings:updated', () => {
  it('emits settings:updated when a setting is applied', async () => {
    const { handle_server_setting_const, handle_server_setting_bool } = await import('@/net/handlers/server');
    // Prime the slot via const packet first
    handle_server_setting_const({
      id: 0, name: 'test', category: 0, settable: true,
      initial_value: 'true', default_value: 'true',
    } as never);

    const handler = vi.fn();
    globalEvents.on('settings:updated', handler);
    handle_server_setting_bool({ id: 0, value: true, default: true } as never);

    expect(handler).toHaveBeenCalled();
    globalEvents.off('settings:updated', handler);
  });
});

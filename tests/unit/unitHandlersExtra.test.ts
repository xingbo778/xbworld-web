/**
 * Additional unit tests for unit packet handlers not covered by handlerEvents.test.ts.
 * Covers: handle_unit_short_info, handle_unit_combat_info, handle_unit_action_answer,
 *         handle_unit_actions.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';
import { globalEvents } from '@/core/events';

beforeEach(() => {
  store.reset();
});

describe('handle_unit_short_info', () => {
  it('is exported as a function', async () => {
    const { handle_unit_short_info } = await import('@/net/handlers/unit');
    expect(typeof handle_unit_short_info).toBe('function');
  });

  it('does not throw for a valid packet', async () => {
    const { handle_unit_short_info } = await import('@/net/handlers/unit');
    expect(() => handle_unit_short_info({
      id: 5, owner: 0, tile: 10, type: 1, hp: 10,
      veteran: 0, movesleft: 3, activity: 0,
      transported_by: -1, homecity: 0,
      done_moving: false, ai: false, goto_tile: -1,
      action_decision_want: 0, action_decision_tile: -1,
      anim_list: [],
    } as never)).not.toThrow();
  });
});

describe('handle_unit_combat_info', () => {
  it('is exported as a function', async () => {
    const { handle_unit_combat_info } = await import('@/net/handlers/unit');
    expect(typeof handle_unit_combat_info).toBe('function');
  });

  it('does not throw when attacker/defender units are missing from store', async () => {
    const { handle_unit_combat_info } = await import('@/net/handlers/unit');
    expect(() => handle_unit_combat_info({
      attacker_unit_id: 999,
      defender_unit_id: 888,
      attacker_hp: 10,
      defender_hp: 0,
    } as never)).not.toThrow();
  });
});

describe('handle_unit_action_answer', () => {
  it('is exported as a function', async () => {
    const { handle_unit_action_answer } = await import('@/net/handlers/unit');
    expect(typeof handle_unit_action_answer).toBe('function');
  });

  it('does not throw when actor unit is missing (bad actor path)', async () => {
    const { handle_unit_action_answer } = await import('@/net/handlers/unit');
    // actor_id = 999 — not in store → logs and calls act_sel_queue_done
    expect(() => handle_unit_action_answer({
      actor_id: 999, target_id: 0, cost: 0,
      action_type: 0, request_kind: 1,
    } as never)).not.toThrow();
  });
});

describe('handle_unit_actions', () => {
  it('is exported as a function', async () => {
    const { handle_unit_actions } = await import('@/net/handlers/unit');
    expect(typeof handle_unit_actions).toBe('function');
  });

  it('does not throw when units/city/tile are not in store', async () => {
    const { handle_unit_actions } = await import('@/net/handlers/unit');
    expect(() => handle_unit_actions({
      actor_unit_id: 999,
      target_unit_id: -1,
      target_city_id: -1,
      target_tile_id: -1,
      target_extra_id: -1,
      action_probabilities: [],
      request_kind: 99,
    } as never)).not.toThrow();
  });
});

describe('update_client_state', () => {
  it('is exported as a function', async () => {
    const { update_client_state } = await import('@/net/handlers/unit');
    expect(typeof update_client_state).toBe('function');
  });

  it('does not throw', async () => {
    const { update_client_state } = await import('@/net/handlers/unit');
    expect(() => update_client_state(3)).not.toThrow();
  });
});

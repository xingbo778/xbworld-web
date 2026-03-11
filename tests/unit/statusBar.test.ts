/**
 * Tests for StatusBar component signal wiring.
 * Verifies that currentTurn, currentYear, playerCount, etc. feed correctly.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';
import { globalEvents } from '@/core/events';

beforeEach(() => {
  store.reset();
});

describe('StatusBar signal wiring', () => {
  it('currentTurn is 0 before game:info', async () => {
    const { currentTurn } = await import('@/data/signals');
    globalEvents.emit('store:reset');
    expect(currentTurn.value).toBe(0);
  });

  it('currentTurn updates when handle_game_info fires', async () => {
    const { handle_game_info } = await import('@/net/handlers/gameState');
    const { currentTurn } = await import('@/data/signals');
    handle_game_info({ turn: 7, year: -1000 } as never);
    expect(currentTurn.value).toBe(7);
  });

  it('currentYear uses calendarInfo labels after game:calendar + game:info', async () => {
    const { handle_calendar_info, handle_game_info } = await import('@/net/handlers/gameState');
    const { currentYear } = await import('@/data/signals');

    handle_calendar_info({ positive_year_label: 'AD', negative_year_label: 'BC' } as never);
    handle_game_info({ turn: 3, year: -2500 } as never);

    expect(currentYear.value).toContain('BC');
    expect(currentYear.value).toContain('2500');
  });

  it('currentYear shows positive label for year > 0', async () => {
    const { handle_calendar_info, handle_game_info } = await import('@/net/handlers/gameState');
    const { currentYear } = await import('@/data/signals');

    handle_calendar_info({ positive_year_label: 'AD', negative_year_label: 'BC' } as never);
    handle_game_info({ turn: 50, year: 1776 } as never);

    expect(currentYear.value).toContain('AD');
    expect(currentYear.value).toContain('1776');
  });

  it('playerCount, cityCount, unitCount all update on respective events', async () => {
    const { handle_city_info } = await import('@/net/handlers/city');
    const { handle_unit_info } = await import('@/net/handlers/unit');
    const { handle_player_info } = await import('@/net/handlers/player');
    const { playerCount, cityCount, unitCount } = await import('@/data/signals');

    const pBefore = playerCount.value;
    const cBefore = cityCount.value;
    const uBefore = unitCount.value;

    handle_player_info({
      playerno: 99, name: 'Test', username: 'test',
      nation: 0, is_alive: true, is_ready: true,
      ai_skill_level: 0, gold: 0, tax: 0, luxury: 0, science: 100,
      expected_income: 0, team: 0, embassy_txt: '',
    } as never);

    handle_city_info({
      id: 200, owner: 99, tile: 1, name: 'TestCity', size: 1,
      food_stock: 0, shield_stock: 0, production_kind: 0, production_value: 0,
      surplus: [], waste: [], unhappy_penalty: [], prod: [],
      citizen_extra: [], ppl_happy: [], ppl_content: [], ppl_unhappy: [], ppl_angry: [],
      improvements: [], city_options: [],
    } as never);

    handle_unit_info({
      id: 300, owner: 99, tile: 1, type: 0, hp: 10,
      veteran: 0, movesleft: 0, activity: 0,
      transported_by: -1, homecity: 0,
      done_moving: false, ai: false, goto_tile: -1,
      action_decision_want: 0, action_decision_tile: -1,
      anim_list: [],
    } as never);

    expect(playerCount.value).toBe(pBefore + 1);
    expect(cityCount.value).toBe(cBefore + 1);
    expect(unitCount.value).toBe(uBefore + 1);
  });

  it('isObserver signal reflects store.observing', async () => {
    const { isObserver } = await import('@/data/signals');
    store.observing = true;
    globalEvents.emit('connection:updated');
    expect(isObserver.value).toBe(true);
    store.observing = false;
    globalEvents.emit('connection:updated');
    expect(isObserver.value).toBe(false);
  });
});

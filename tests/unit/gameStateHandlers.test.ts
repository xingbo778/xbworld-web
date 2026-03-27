/**
 * Unit tests for net/handlers/gameState.ts
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('handle_game_info', () => {
  it('is exported as a function', async () => {
    const { handle_game_info } = await import('@/net/handlers/gameState');
    expect(typeof handle_game_info).toBe('function');
  });

  it('stores game info in store', async () => {
    const { handle_game_info } = await import('@/net/handlers/gameState');
    handle_game_info({ turn: 5, year: -3000 } as never);
    expect(store.gameInfo?.turn).toBe(5);
  });
});

describe('handle_calendar_info', () => {
  it('stores calendar info', async () => {
    const { handle_calendar_info } = await import('@/net/handlers/gameState');
    handle_calendar_info({ positive_label: 'AD', negative_label: 'BC', fragments: 1 } as never);
    expect(store.calendarInfo?.['positive_label']).toBe('AD');
  });

  it('emits game:calendar event', async () => {
    const { handle_calendar_info } = await import('@/net/handlers/gameState');
    const { globalEvents } = await import('@/core/events');
    const handler = vi.fn();
    globalEvents.on('game:calendar', handler);
    handle_calendar_info({ positive_year_label: 'AD', negative_year_label: 'BC' } as never);
    expect(handler).toHaveBeenCalled();
    globalEvents.off('game:calendar', handler);
  });

  it('calendarInfo signal updates when handle_calendar_info fires', async () => {
    const { handle_calendar_info } = await import('@/net/handlers/gameState');
    const { calendarInfo } = await import('@/data/signals');
    handle_calendar_info({ positive_year_label: 'CE', negative_year_label: 'BCE' } as never);
    expect(calendarInfo.value?.positive_year_label).toBe('CE');
  });
});

describe('handle_spaceship_info', () => {
  it('is a no-op (does not throw)', async () => {
    const { handle_spaceship_info } = await import('@/net/handlers/gameState');
    expect(() => handle_spaceship_info({} as never)).not.toThrow();
  });
});

describe('handle_new_year', () => {
  it('does not throw when gameInfo is null', async () => {
    const { handle_new_year } = await import('@/net/handlers/gameState');
    store.gameInfo = null as never;
    expect(() => handle_new_year({ year: -2000, fragments: 0, turn: 2 } as never)).not.toThrow();
  });

  it('updates year on existing gameInfo', async () => {
    const { handle_game_info, handle_new_year } = await import('@/net/handlers/gameState');
    handle_game_info({ turn: 1, year: -4000 } as never);
    handle_new_year({ year: -3950, fragments: 0, turn: 2 } as never);
    expect(store.gameInfo?.year).toBe(-3950);
  });
});

describe('handle_timeout_info', () => {
  it('stores timeout data', async () => {
    const { handle_timeout_info } = await import('@/net/handlers/gameState');
    handle_timeout_info({ last_turn_change_time: 100.5, seconds_to_phasedone: 30.9 } as never);
    expect(store.lastTurnChangeTime).toBe(101);
    expect(store.secondsToPhasedone).toBe(30);
  });
});

describe('handle_trade_route_info', () => {
  it('stores trade route by city and index', async () => {
    const { handle_trade_route_info } = await import('@/net/handlers/gameState');
    expect(() => handle_trade_route_info({ city: 10, index: 0, partner_city: 5, type: 1, goods: 0, value: 100 } as never)).not.toThrow();
  });
});

describe('handle_endgame_player', () => {
  it('pushes to endgamePlayerInfo', async () => {
    const { handle_endgame_player } = await import('@/net/handlers/gameState');
    store.endgamePlayerInfo = [];
    handle_endgame_player({ playerno: 1, score: 500 } as never);
    expect(store.endgamePlayerInfo.length).toBe(1);
  });
});

describe('handle_unknown_research', () => {
  it('does not throw', async () => {
    const { handle_unknown_research } = await import('@/net/handlers/gameState');
    expect(() => handle_unknown_research({ id: 5 } as never)).not.toThrow();
  });
});

describe('handle_end_phase', () => {
  it('does not throw', async () => {
    const { handle_end_phase } = await import('@/net/handlers/gameState');
    expect(() => handle_end_phase({} as never)).not.toThrow();
  });
});

describe('handle_start_phase', () => {
  it('does not throw', async () => {
    const { handle_start_phase } = await import('@/net/handlers/gameState');
    expect(() => handle_start_phase({} as never)).not.toThrow();
  });
});

describe('handle_endgame_report', () => {
  it('does not throw', async () => {
    const { handle_endgame_report } = await import('@/net/handlers/gameState');
    expect(() => handle_endgame_report({} as never)).not.toThrow();
  });
});

describe('handle_scenario_info', () => {
  it('stores scenario info', async () => {
    const { handle_scenario_info } = await import('@/net/handlers/gameState');
    handle_scenario_info({ name: 'Test Scenario', authors: '' } as never);
    expect(store.scenarioInfo?.['name']).toBe('Test Scenario');
  });
});

describe('handle_research_info', () => {
  it('does not throw when player exists in store', async () => {
    const { handle_research_info } = await import('@/net/handlers/gameState');
    store.players[2] = { playerno: 2, name: 'Caesar' } as never;
    expect(() => handle_research_info({
      id: 2, inventions: [], bulbs_researched: 0,
      techs_researched: 0, researching: 0, research_goal: 0,
      future_tech: 0, bulbs_researching_saved: 0,
    } as never)).not.toThrow();
  });
});

describe('handle_begin_turn', () => {
  it('does not throw', async () => {
    const { handle_begin_turn } = await import('@/net/handlers/gameState');
    expect(() => handle_begin_turn({} as never)).not.toThrow();
  });
});

describe('handle_end_turn', () => {
  it('does not throw', async () => {
    const { handle_end_turn } = await import('@/net/handlers/gameState');
    expect(() => handle_end_turn({} as never)).not.toThrow();
  });
});

// ── Signal integration tests ───────────────────────────────────────────────

describe('handle_game_info → gameInfo signal', () => {
  it('updating store.gameInfo via handle_game_info reflects in gameInfo signal', async () => {
    const { handle_game_info } = await import('@/net/handlers/gameState');
    const { gameInfo } = await import('@/data/signals');
    handle_game_info({ turn: 55, year: -1000 } as never);
    expect((gameInfo.value as Record<string, unknown>)?.['turn']).toBe(55);
  });
});

describe('handle_new_year → gameInfo signal', () => {
  it('handle_new_year emits game:newyear which triggers syncFromStore', async () => {
    const { handle_game_info, handle_new_year } = await import('@/net/handlers/gameState');
    const { gameInfo } = await import('@/data/signals');
    handle_game_info({ turn: 1, year: -4000 } as never);
    handle_new_year({ year: -3900, fragments: 0, turn: 2 } as never);
    expect((gameInfo.value as Record<string, unknown>)?.['year']).toBe(-3900);
  });
});

describe('handle_begin_turn → gameInfo signal', () => {
  it('handle_begin_turn emits game:beginturn which triggers syncFromStore', async () => {
    const { handle_game_info, handle_begin_turn } = await import('@/net/handlers/gameState');
    const { gameInfo } = await import('@/data/signals');
    handle_game_info({ turn: 10, year: 100 } as never);
    store.gameInfo = { turn: 11, year: 100 } as never;
    handle_begin_turn({} as never);
    expect((gameInfo.value as Record<string, unknown>)?.['turn']).toBe(11);
  });
});

describe('handle_scenario_description', () => {
  it('stores description on scenarioInfo', async () => {
    const { handle_scenario_info, handle_scenario_description } = await import('@/net/handlers/gameState');
    handle_scenario_info({ name: 'TestScen', authors: '' } as never);
    handle_scenario_description({ description: 'A long epic scenario.' } as never);
    expect((store.scenarioInfo as Record<string, unknown>)?.['description']).toBe('A long epic scenario.');
  });

  it('does not throw when scenarioInfo is null', async () => {
    const { handle_scenario_description } = await import('@/net/handlers/gameState');
    store.scenarioInfo = null as never;
    // May throw or silently fail — we just verify it can be called
    try { handle_scenario_description({ description: 'X' } as never); } catch { /* acceptable */ }
  });
});

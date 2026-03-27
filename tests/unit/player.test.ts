/**
 * Unit tests for data/player.ts
 *
 * Tests all player query functions migrated from legacy player.js.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  valid_player_by_number,
  player_by_number,
  player_by_name,
  player_by_full_username,
  player_find_unit_by_id,
  player_index,
  player_number,
  get_diplstate_text,
  get_embassy_text,
  get_ai_level_text,
  get_player_connection_status,
  research_get,
  research_data,
  player_has_wonder,
  get_invalid_username_reason,
  player_capital,
  does_player_own_city,
  MAX_NUM_PLAYERS,
  MAX_AI_LOVE,
} from '@/data/player';
import { store } from '@/data/store';
import type { Player, City, Unit, Connection, Improvement } from '@/data/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    playerno: 0,
    name: 'TestPlayer',
    username: 'testuser',
    nation: 5,
    is_alive: true,
    is_ready: true,
    ai_skill_level: 0,
    gold: 100,
    tax: 30,
    luxury: 20,
    science: 50,
    expected_income: 10,
    team: 0,
    embassy_txt: '',
    ...overrides,
  };
}

function makeCity(overrides: Partial<City> & { id: number; owner: number } = { id: 1, owner: 0 }): City {
  return {
    tile: 10,
    name: 'Rome',
    size: 5,
    food_stock: 0,
    shield_stock: 0,
    production_kind: 0,
    production_value: 0,
    surplus: [],
    waste: [],
    unhappy_penalty: [],
    prod: [],
    citizen_extra: [],
    ppl_happy: [],
    ppl_content: [],
    ppl_unhappy: [],
    ppl_angry: [],
    improvements: [],
    ...overrides,
  } as City;
}

function makeUnit(overrides: Partial<Unit> & { id: number; owner: number } = { id: 1, owner: 0 }): Unit {
  return {
    tile: 0,
    type: 0,
    hp: 10,
    veteran: 0,
    movesleft: 3,
    activity: 0,
    transported_by: 0,
    homecity: 0,
    done_moving: false,
    ai: false,
    goto_tile: 0,
    ...overrides,
  } as Unit;
}

function makeConnection(
  overrides: Partial<Connection> & Pick<Connection, 'id'> = { id: 0 },
): Connection {
  return {
    playing: null,
    observer: false,
    ...overrides,
  };
}

function makeImprovement(
  overrides: Partial<Improvement> & Pick<Improvement, 'id'> = { id: 0 },
): Improvement {
  return {
    name: 'Palace',
    rule_name: 'palace',
    genus: 0,
    build_cost: 100,
    graphic_str: 'palace',
    graphic_alt: 'palace',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('Player constants', () => {
  it('should export MAX_NUM_PLAYERS as 30', () => {
    expect(MAX_NUM_PLAYERS).toBe(30);
  });

  it('should export MAX_AI_LOVE as 1000', () => {
    expect(MAX_AI_LOVE).toBe(1000);
  });
});

// ---------------------------------------------------------------------------
// Player lookup functions
// ---------------------------------------------------------------------------

describe('valid_player_by_number / player_by_number', () => {
  beforeEach(() => {
    store.players = {
      0: makePlayer({ playerno: 0, name: 'Alice' }),
      1: makePlayer({ playerno: 1, name: 'Bob' }),
    };
  });

  afterEach(() => {
    store.players = {};
  });

  it('should return the player for a valid number', () => {
    expect(valid_player_by_number(0)?.name).toBe('Alice');
    expect(player_by_number(1)?.name).toBe('Bob');
  });

  it('should return null for invalid number', () => {
    expect(valid_player_by_number(99)).toBeNull();
    expect(player_by_number(99)).toBeNull();
  });
});

describe('player_by_name', () => {
  beforeEach(() => {
    store.players = {
      0: makePlayer({ playerno: 0, name: 'Alice' }),
      1: makePlayer({ playerno: 1, name: 'Bob' }),
    };
  });

  afterEach(() => {
    store.players = {};
  });

  it('should find player by name', () => {
    expect(player_by_name('Bob')?.playerno).toBe(1);
  });

  it('should return null for unknown name', () => {
    expect(player_by_name('Charlie')).toBeNull();
  });
});

describe('player_by_full_username', () => {
  beforeEach(() => {
    store.players = {
      0: makePlayer({ playerno: 0, name: 'Alice', username: 'alice123' }),
      1: makePlayer({ playerno: 1, name: 'BotPlayer', username: '' }),
    };
  });

  afterEach(() => {
    store.players = {};
  });

  it('should find player by username', () => {
    expect(player_by_full_username('alice123')?.playerno).toBe(0);
  });

  it('should find AI player by "AI " + name', () => {
    expect(player_by_full_username('AI BotPlayer')?.playerno).toBe(1);
  });

  it('should return null for unknown username', () => {
    expect(player_by_full_username('nobody')).toBeNull();
  });
});

describe('player_find_unit_by_id', () => {
  beforeEach(() => {
    store.units = {
      10: makeUnit({ id: 10, owner: 0 }),
      11: makeUnit({ id: 11, owner: 1 }),
      12: makeUnit({ id: 12, owner: 0 }),
    };
  });

  afterEach(() => {
    store.units = {};
  });

  it('should find unit belonging to player', () => {
    const player = makePlayer({ playerno: 0 });
    expect(player_find_unit_by_id(player, 10)?.id).toBe(10);
  });

  it('should not find unit belonging to different player', () => {
    const player = makePlayer({ playerno: 0 });
    expect(player_find_unit_by_id(player, 11)).toBeNull();
  });

  it('should return null for non-existent unit', () => {
    const player = makePlayer({ playerno: 0 });
    expect(player_find_unit_by_id(player, 999)).toBeNull();
  });
});

describe('player_index / player_number', () => {
  it('should return the playerno', () => {
    const player = makePlayer({ playerno: 3 });
    expect(player_index(player)).toBe(3);
    expect(player_number(player)).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// Diplomacy and status text
// ---------------------------------------------------------------------------

describe('get_diplstate_text', () => {
  it('should return correct text for each state', () => {
    expect(get_diplstate_text(0)).toBe('Armistice');
    expect(get_diplstate_text(1)).toBe('War');
    expect(get_diplstate_text(2)).toBe('Ceasefire');
    expect(get_diplstate_text(3)).toBe('Peace');
    expect(get_diplstate_text(4)).toBe('Alliance');
    expect(get_diplstate_text(5)).toBe('No contact');
    expect(get_diplstate_text(6)).toBe('Team');
  });

  it('should return "Unknown" for invalid state', () => {
    expect(get_diplstate_text(99)).toBe('Unknown');
  });
});

describe('get_embassy_text', () => {
  beforeEach(() => {
    store.players = {
      0: makePlayer({ playerno: 0, embassy_txt: 'Embassy established' }),
      1: makePlayer({ playerno: 1, embassy_txt: '' }),
    };
  });

  afterEach(() => {
    store.players = {};
  });

  it('should return embassy text for player', () => {
    expect(get_embassy_text(0)).toBe('Embassy established');
  });

  it('should return empty string when no embassy text', () => {
    expect(get_embassy_text(1)).toBe('');
  });

  it('should return empty string for invalid player', () => {
    expect(get_embassy_text(99)).toBe('');
  });
});

describe('get_ai_level_text', () => {
  it('should return correct text for each AI level', () => {
    expect(get_ai_level_text(makePlayer({ ai_skill_level: 0 }))).toBe('Away');
    expect(get_ai_level_text(makePlayer({ ai_skill_level: 1 }))).toBe('Handicapped');
    expect(get_ai_level_text(makePlayer({ ai_skill_level: 2 }))).toBe('Novice');
    expect(get_ai_level_text(makePlayer({ ai_skill_level: 3 }))).toBe('Easy');
    expect(get_ai_level_text(makePlayer({ ai_skill_level: 4 }))).toBe('Normal');
    expect(get_ai_level_text(makePlayer({ ai_skill_level: 5 }))).toBe('Hard');
    expect(get_ai_level_text(makePlayer({ ai_skill_level: 6 }))).toBe('Cheating');
    expect(get_ai_level_text(makePlayer({ ai_skill_level: 7 }))).toBe('Experimental');
  });

  it('should return empty string for unknown level', () => {
    expect(get_ai_level_text(makePlayer({ ai_skill_level: 99 }))).toBe('');
  });
});

describe('get_player_connection_status', () => {
  beforeEach(() => {
    store.connections = {};
  });

  afterEach(() => {
    store.connections = {};
  });

  it('should return "connected" when player has active connection', () => {
    store.connections = {
      0: makeConnection({ id: 0, playing: makePlayer({ playerno: 0 }) }),
    };
    expect(get_player_connection_status(makePlayer({ playerno: 0 }))).toBe('connected');
  });

  it('should return "AI" when player is AI and not connected', () => {
    expect(get_player_connection_status(makePlayer({ playerno: 0, ai_skill_level: 3 }))).toBe('AI');
  });

  it('should return "disconnected" when human player not connected', () => {
    expect(get_player_connection_status(makePlayer({ playerno: 0, ai_skill_level: 0 }))).toBe('disconnected');
  });

  it('should return empty string for null player', () => {
    expect(get_player_connection_status(null as unknown as Player)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Research
// ---------------------------------------------------------------------------

describe('research_get', () => {
  afterEach(() => {
    for (const key in research_data) {
      delete research_data[Number(key)];
    }
  });

  it('should return research data for player', () => {
    research_data[0] = { researching: 5, bulbs_researched: 10, researching_cost: 100 };
    expect(research_get(makePlayer({ playerno: 0 }))?.researching).toBe(5);
  });

  it('should return null when no research data', () => {
    expect(research_get(makePlayer({ playerno: 0 }))).toBeNull();
  });

  it('should return null for null player', () => {
    expect(research_get(null as unknown as Player)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Player has wonder
// ---------------------------------------------------------------------------

describe('player_has_wonder', () => {
  beforeEach(() => {
    store.cities = {
      1: makeCity({ id: 1, owner: 0, improvements: { 10: true, 11: false } as unknown as boolean[] }),
      2: makeCity({ id: 2, owner: 1, improvements: { 10: true } as unknown as boolean[] }),
    };
  });

  afterEach(() => {
    store.cities = {};
  });

  it('should return true when player owns city with wonder', () => {
    expect(player_has_wonder(0, 10)).toBe(true);
  });

  it('should return false when player does not have the wonder', () => {
    expect(player_has_wonder(0, 11)).toBe(false);
  });

  it('should return false for wrong player', () => {
    expect(player_has_wonder(2, 10)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Username validation (Pitfall #3 regression area)
// ---------------------------------------------------------------------------

describe('get_invalid_username_reason', () => {
  it('should return null for valid username', () => {
    expect(get_invalid_username_reason('Alice')).toBeNull();
    expect(get_invalid_username_reason('Player_01')).toBeNull();
    expect(get_invalid_username_reason('test.user')).toBeNull();
    expect(get_invalid_username_reason('my-name')).toBeNull();
  });

  it('should reject empty username', () => {
    expect(get_invalid_username_reason('')).not.toBeNull();
    expect(get_invalid_username_reason(null as unknown as string)).not.toBeNull();
  });

  it('should reject username shorter than 3 characters', () => {
    expect(get_invalid_username_reason('ab')).not.toBeNull();
  });

  it('should reject username longer than 32 characters', () => {
    expect(get_invalid_username_reason('a'.repeat(33))).not.toBeNull();
  });

  it('should reject username with spaces', () => {
    expect(get_invalid_username_reason('hello world')).not.toBeNull();
  });

  it('should reject username not starting with a letter', () => {
    expect(get_invalid_username_reason('123abc')).not.toBeNull();
    expect(get_invalid_username_reason('_test')).not.toBeNull();
  });

  it('should reject username with special characters', () => {
    expect(get_invalid_username_reason('test@user')).not.toBeNull();
    expect(get_invalid_username_reason('test#1')).not.toBeNull();
  });

  it('should accept exactly 3 characters', () => {
    expect(get_invalid_username_reason('abc')).toBeNull();
  });

  it('should accept exactly 32 characters', () => {
    expect(get_invalid_username_reason('a'.repeat(32))).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Player capital and city ownership
// ---------------------------------------------------------------------------

describe('player_capital', () => {
  beforeEach(() => {
    store.improvements = {
      0: makeImprovement({ id: 0, name: 'Palace', genus: 0 }),
      1: makeImprovement({ id: 1, name: 'Granary', genus: 1, rule_name: 'granary', graphic_str: 'granary', graphic_alt: 'granary' }),
    };
    store.cities = {
      1: makeCity({ id: 1, owner: 0, name: 'Rome', improvements: { 0: true, 1: true } as unknown as boolean[] }),
      2: makeCity({ id: 2, owner: 0, name: 'Milan', improvements: { 1: true } as unknown as boolean[] }),
      3: makeCity({ id: 3, owner: 1, name: 'Paris', improvements: { 0: true } as unknown as boolean[] }),
    };
  });

  afterEach(() => {
    store.improvements = {};
    store.cities = {};
  });

  it('should return the capital city of the player', () => {
    const capital = player_capital(makePlayer({ playerno: 0 }));
    expect(capital?.name).toBe('Rome');
  });

  it('should return null when player has no capital', () => {
    store.cities = {
      2: makeCity({ id: 2, owner: 0, name: 'Milan', improvements: { 1: true } as unknown as boolean[] }),
    };
    expect(player_capital(makePlayer({ playerno: 0 }))).toBeNull();
  });

  it('should return null for null player', () => {
    expect(player_capital(null as unknown as Player)).toBeNull();
  });
});

describe('does_player_own_city', () => {
  it('should return true when player owns the city', () => {
    const player = makePlayer({ playerno: 0 });
    const city = makeCity({ id: 1, owner: 0 });
    expect(does_player_own_city(player, city)).toBe(true);
  });

  it('should return false when player does not own the city', () => {
    const player = makePlayer({ playerno: 0 });
    const city = makeCity({ id: 1, owner: 1 });
    expect(does_player_own_city(player, city)).toBe(false);
  });

  it('should return false for null player or city', () => {
    expect(does_player_own_city(null as unknown as Player, makeCity({ id: 1, owner: 0 }))).toBe(false);
    expect(does_player_own_city(makePlayer(), null as unknown as City)).toBe(false);
  });
});

// ── is_capital ────────────────────────────────────────────────────────────

describe('is_capital', () => {
  it('is exported as a function', async () => {
    const { is_capital } = await import('@/data/player');
    expect(typeof is_capital).toBe('function');
  });

  it('returns false when city has no improvements', async () => {
    const { is_capital } = await import('@/data/player');
    expect(is_capital({ improvements: null } as never)).toBe(false);
  });

  it('returns false when no improvements in store match genus=0 + city has it', async () => {
    const { is_capital } = await import('@/data/player');
    // store.improvements is empty (no genus=0 improvement)
    expect(is_capital({ improvements: {} } as never)).toBe(false);
  });
});

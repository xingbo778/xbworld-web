/**
 * Unit tests for data/tech.ts
 *
 * Tests tech query functions: playerInventionState, isTechReqForGoal,
 * isTechReqForTech, getCurrentBulbsOutputText, techIdByName.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  TECH_UNKNOWN,
  TECH_PREREQS_KNOWN,
  TECH_KNOWN,
  AR_ONE,
  AR_TWO,
  AR_ROOT,
  AR_SIZE,
  TF_BONUS_TECH,
  TF_BRIDGE,
  TF_RAILROAD,
  TF_LAST,
  A_NONE,
  A_FIRST,
  playerInventionState,
  isTechReqForGoal,
  isTechReqForTech,
  getCurrentBulbsOutputText,
  techIdByName,
} from '@/data/tech';
import { store } from '@/data/store';
import type { Player, Tech } from '@/data/types';

function makeResearchPlayer(inventions: Record<number, number> | null): Player {
  return {
    playerno: 0,
    name: 'TestPlayer',
    username: 'test',
    nation: 0,
    is_alive: true,
    is_ready: false,
    ai_skill_level: 0,
    gold: 0,
    tax: 0,
    luxury: 0,
    science: 0,
    expected_income: 0,
    team: 0,
    embassy_txt: '',
    inventions,
  };
}

function makeTech(id: number, name: string, research_reqs: Array<{ value: number }> = []): Tech {
  return {
    id,
    name,
    rule_name: name.toLowerCase(),
    graphic_str: '',
    graphic_alt: '',
    research_reqs,
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('Tech constants', () => {
  it('should export TECH_UNKNOWN=0, TECH_PREREQS_KNOWN=1, TECH_KNOWN=2', () => {
    expect(TECH_UNKNOWN).toBe(0);
    expect(TECH_PREREQS_KNOWN).toBe(1);
    expect(TECH_KNOWN).toBe(2);
  });

  it('should export AR_* constants', () => {
    expect(AR_ONE).toBe(0);
    expect(AR_TWO).toBe(1);
    expect(AR_ROOT).toBe(2);
    expect(AR_SIZE).toBe(3);
  });

  it('should export TF_* tech flag constants', () => {
    expect(TF_BONUS_TECH).toBe(0);
    expect(TF_BRIDGE).toBe(1);
    expect(TF_RAILROAD).toBe(2);
    expect(TF_LAST).toBe(6);
  });

  it('should export A_NONE=0 and A_FIRST=1', () => {
    expect(A_NONE).toBe(0);
    expect(A_FIRST).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// playerInventionState
// ---------------------------------------------------------------------------

describe('playerInventionState', () => {
  it('should return TECH_KNOWN when player has the tech', () => {
    const player = makeResearchPlayer({ 5: TECH_KNOWN, 10: TECH_PREREQS_KNOWN });
    expect(playerInventionState(player, 5)).toBe(TECH_KNOWN);
  });

  it('should return TECH_PREREQS_KNOWN when prereqs are known', () => {
    const player = makeResearchPlayer({ 5: TECH_KNOWN, 10: TECH_PREREQS_KNOWN });
    expect(playerInventionState(player, 10)).toBe(TECH_PREREQS_KNOWN);
  });

  it('should return TECH_UNKNOWN when tech is not in inventions', () => {
    const player = makeResearchPlayer({ 5: TECH_KNOWN });
    expect(playerInventionState(player, 99)).toBe(TECH_UNKNOWN);
  });

  it('should return TECH_UNKNOWN for null player', () => {
    expect(playerInventionState(null as unknown as Player, 5)).toBe(TECH_UNKNOWN);
  });

  it('should return TECH_UNKNOWN when inventions is null', () => {
    const player = makeResearchPlayer(null);
    expect(playerInventionState(player, 5)).toBe(TECH_UNKNOWN);
  });
});

// ---------------------------------------------------------------------------
// isTechReqForGoal (recursive)
// ---------------------------------------------------------------------------

describe('isTechReqForGoal', () => {
  beforeEach(() => {
    // Tech tree:
    //   1 (Alphabet) → 2 (Writing) → 3 (Literacy)
    //   4 (Masonry) → 3 (Literacy)
    store.techs = {
      1: makeTech(1, 'Alphabet'),
      2: makeTech(2, 'Writing', [{ value: 1 }]),
      3: makeTech(3, 'Literacy', [{ value: 2 }, { value: 4 }]),
      4: makeTech(4, 'Masonry'),
    };
  });

  afterEach(() => {
    store.techs = {};
  });

  it('should return true when check == goal', () => {
    expect(isTechReqForGoal(3, 3)).toBe(true);
  });

  it('should return true for direct requirement', () => {
    expect(isTechReqForGoal(2, 3)).toBe(true);
    expect(isTechReqForGoal(4, 3)).toBe(true);
  });

  it('should return true for transitive requirement', () => {
    expect(isTechReqForGoal(1, 3)).toBe(true);
  });

  it('should return false for non-requirement', () => {
    expect(isTechReqForGoal(4, 2)).toBe(false);
  });

  it('should return false when goalTechId is 0', () => {
    expect(isTechReqForGoal(1, 0)).toBe(false);
  });

  it('should return false when checkTechId is 0', () => {
    expect(isTechReqForGoal(0, 3)).toBe(false);
  });

  it('should return false for non-existent goal tech', () => {
    expect(isTechReqForGoal(1, 99)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isTechReqForTech (direct only)
// ---------------------------------------------------------------------------

describe('isTechReqForTech', () => {
  beforeEach(() => {
    store.techs = {
      1: makeTech(1, 'Alphabet'),
      2: makeTech(2, 'Writing', [{ value: 1 }]),
      3: makeTech(3, 'Literacy', [{ value: 2 }, { value: 4 }]),
      4: makeTech(4, 'Masonry'),
    };
  });

  afterEach(() => {
    store.techs = {};
  });

  it('should return true for direct requirement', () => {
    expect(isTechReqForTech(1, 2)).toBe(true);
    expect(isTechReqForTech(2, 3)).toBe(true);
  });

  it('should return false for transitive requirement (not direct)', () => {
    expect(isTechReqForTech(1, 3)).toBe(false);
  });

  it('should return false when check == next', () => {
    expect(isTechReqForTech(2, 2)).toBe(false);
  });

  it('should return false for non-requirement', () => {
    expect(isTechReqForTech(4, 2)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getCurrentBulbsOutputText
// ---------------------------------------------------------------------------

describe('getCurrentBulbsOutputText', () => {
  it('should return "No bulbs researched" when both are 0', () => {
    const cbo = { self_bulbs: 0, self_upkeep: 0, pooled: false, team_bulbs: 0, team_upkeep: 0 };
    expect(getCurrentBulbsOutputText(cbo)).toBe('No bulbs researched');
  });

  it('should return "X bulbs/turn" when no upkeep', () => {
    const cbo = { self_bulbs: 10, self_upkeep: 0, pooled: false, team_bulbs: 10, team_upkeep: 0 };
    expect(getCurrentBulbsOutputText(cbo)).toBe('10 bulbs/turn');
  });

  it('should return singular "bulb/turn" when net is 1', () => {
    const cbo = { self_bulbs: 3, self_upkeep: 2, pooled: false, team_bulbs: 3, team_upkeep: 2 };
    expect(getCurrentBulbsOutputText(cbo)).toBe('3 - 2 = 1 bulb/turn');
  });

  it('should return singular "bulb/turn" when net is -1', () => {
    const cbo = { self_bulbs: 2, self_upkeep: 3, pooled: false, team_bulbs: 2, team_upkeep: 3 };
    expect(getCurrentBulbsOutputText(cbo)).toBe('2 - 3 = -1 bulb/turn');
  });

  it('should show upkeep when non-zero', () => {
    const cbo = { self_bulbs: 15, self_upkeep: 5, pooled: false, team_bulbs: 15, team_upkeep: 5 };
    expect(getCurrentBulbsOutputText(cbo)).toBe('15 - 5 = 10 bulbs/turn');
  });

  it('should append team total when pooled', () => {
    const cbo = { self_bulbs: 10, self_upkeep: 0, pooled: true, team_bulbs: 25, team_upkeep: 3 };
    expect(getCurrentBulbsOutputText(cbo)).toBe('10 bulbs/turn (22 team total)');
  });
});

// ---------------------------------------------------------------------------
// techIdByName
// ---------------------------------------------------------------------------

describe('techIdByName', () => {
  beforeEach(() => {
    store.techs = {
      1: makeTech(1, 'Alphabet'),
      2: makeTech(2, 'Writing'),
      3: makeTech(3, 'Literacy'),
    };
  });

  afterEach(() => {
    store.techs = {};
  });

  it('should return tech id as string when found', () => {
    expect(techIdByName('Writing')).toBe('2');
  });

  it('should return null when not found', () => {
    expect(techIdByName('NonExistent')).toBeNull();
  });
});

// ── getCurrentBulbsOutput ─────────────────────────────────────────────────

describe('getCurrentBulbsOutput', () => {
  it('is exported as a function', async () => {
    const { getCurrentBulbsOutput } = await import('@/data/tech');
    expect(typeof getCurrentBulbsOutput).toBe('function');
  });

  it('returns object with all expected keys when not playing', async () => {
    // In test env, client is observer → returns zeros
    const { getCurrentBulbsOutput } = await import('@/data/tech');
    const result = getCurrentBulbsOutput();
    expect(result).toHaveProperty('self_bulbs');
    expect(result).toHaveProperty('self_upkeep');
    expect(result).toHaveProperty('pooled');
    expect(result).toHaveProperty('team_bulbs');
    expect(result).toHaveProperty('team_upkeep');
    expect(typeof result.self_bulbs).toBe('number');
    expect(typeof result.pooled).toBe('boolean');
  });
});

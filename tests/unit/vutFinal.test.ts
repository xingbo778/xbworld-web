/**
 * Final B1 VUT tests.
 *
 * Covers:
 *  VIG-1..5  VUT_IMPR_GENUS   — improvement genus (great/small wonder, improvement, etc.)
 *  VAI-1..4  VUT_AI_LEVEL     — player AI skill level
 *  VAG-1..6  VUT_AGE          — minimum age (city turn_founded, player turns_alive)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  VUT_IMPR_GENUS,
  VUT_AI_LEVEL,
  VUT_AGE,
  REQ_RANGE_LOCAL,
  REQ_RANGE_CITY,
  REQ_RANGE_PLAYER,
  RPT_POSSIBLE,
  RPT_CERTAIN,
  IG_GREAT_WONDER,
  IG_SMALL_WONDER,
  IG_IMPROVEMENT,
} from '@/data/fcTypes';

// ---------------------------------------------------------------------------
// Store mock
// ---------------------------------------------------------------------------
const mockStore = vi.hoisted(() => ({
  unitTypes: {} as Record<number, unknown>,
  unitClasses: {} as Record<number, unknown>,
  improvements: {} as Record<number, unknown>,
  players: {} as Record<number, unknown>,
  cities: {} as Record<number, unknown>,
  techs: {} as Record<number, unknown>,
  terrains: {} as Record<number, unknown>,
  governments: {} as Record<number, unknown>,
  rulesControl: { num_impr_types: 0 },
  gameInfo: null as unknown,
  mapInfo: null as unknown,
  nations: {} as Record<number, unknown>,
}));

vi.mock('@/data/store', () => ({ store: mockStore }));
vi.mock('@/data/tech', () => ({ TECH_KNOWN: 2, playerInventionState: () => 0 }));
vi.mock('@/data/map', async (importOriginal) => ({ ...(await importOriginal() as object) }));
vi.mock('@/renderer/tilespec', () => ({
  get_unit_type_image_sprite: vi.fn(() => null),
  get_improvement_image_sprite: vi.fn(() => null),
}));
vi.mock('@/core/events', () => ({ globalEvents: { emit: vi.fn(), on: vi.fn() } }));
vi.mock('@/client/clientState', () => ({
  clientState: vi.fn(() => 0),
  clientPlaying: vi.fn(() => null),
  clientIsObserver: () => true,
  setClientState: vi.fn(),
}));

import { isReqActive } from '@/data/requirements';

/* eslint-disable @typescript-eslint/no-explicit-any */

function makeReq(kind: number, value: number, present = true, range = REQ_RANGE_LOCAL) {
  return { kind, range, value, present };
}

function resetStore() {
  mockStore.unitTypes = {};
  mockStore.unitClasses = {};
  mockStore.improvements = {};
  mockStore.players = {};
  mockStore.cities = {};
  mockStore.techs = {};
  mockStore.terrains = {};
  mockStore.governments = {};
  mockStore.rulesControl = { num_impr_types: 0 };
  mockStore.gameInfo = null;
  mockStore.mapInfo = null;
  mockStore.nations = {};
}

// ---------------------------------------------------------------------------
// VIG: VUT_IMPR_GENUS
// ---------------------------------------------------------------------------
describe('VUT_IMPR_GENUS — improvement genus check', () => {
  beforeEach(resetStore);

  it('VIG-1: TRI_YES when targetBuilding genus matches (great wonder)', () => {
    const impr = { id: 1, name: 'Pyramids', genus: IG_GREAT_WONDER };
    expect(isReqActive(null, null, impr, null, null, null, null,
      makeReq(VUT_IMPR_GENUS, IG_GREAT_WONDER), RPT_CERTAIN)).toBe(true);
  });

  it('VIG-2: TRI_NO when genus does not match', () => {
    const impr = { id: 2, name: 'Barracks', genus: IG_IMPROVEMENT };
    expect(isReqActive(null, null, impr, null, null, null, null,
      makeReq(VUT_IMPR_GENUS, IG_GREAT_WONDER), RPT_CERTAIN)).toBe(false);
  });

  it('VIG-3: TRI_YES via targetOutput fallback (legacy call-site pattern)', () => {
    const impr = { id: 3, name: 'Palace', genus: IG_SMALL_WONDER };
    expect(isReqActive(null, null, null, null, null, impr, null,
      makeReq(VUT_IMPR_GENUS, IG_SMALL_WONDER), RPT_CERTAIN)).toBe(true);
  });

  it('VIG-4: TRI_MAYBE when both targetBuilding and targetOutput are null', () => {
    expect(isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_IMPR_GENUS, IG_IMPROVEMENT), RPT_POSSIBLE)).toBe(true);
  });

  it('VIG-5: present=false inverts — non-wonder genus means requirement met', () => {
    const impr = { id: 4, name: 'Library', genus: IG_IMPROVEMENT };
    expect(isReqActive(null, null, impr, null, null, null, null,
      makeReq(VUT_IMPR_GENUS, IG_GREAT_WONDER, false), RPT_CERTAIN)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VAI: VUT_AI_LEVEL
// ---------------------------------------------------------------------------
describe('VUT_AI_LEVEL — player AI skill level', () => {
  beforeEach(resetStore);

  it('VAI-1: TRI_YES when ai_skill_level matches exactly', () => {
    const player = { playerno: 1, ai_skill_level: 4 } as any; // Normal AI
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_AI_LEVEL, 4), RPT_CERTAIN)).toBe(true);
  });

  it('VAI-2: TRI_NO when ai_skill_level differs', () => {
    const player = { playerno: 1, ai_skill_level: 0 } as any; // human
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_AI_LEVEL, 4), RPT_CERTAIN)).toBe(false);
  });

  it('VAI-3: TRI_MAYBE when targetPlayer is null', () => {
    expect(isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_AI_LEVEL, 4), RPT_POSSIBLE)).toBe(true);
  });

  it('VAI-4: present=false — human player (level 0) meets "not AI" requirement', () => {
    const player = { playerno: 1, ai_skill_level: 0 } as any;
    // present=false, value=4: "does NOT have AI level 4"
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_AI_LEVEL, 4, false), RPT_CERTAIN)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VAG: VUT_AGE
// ---------------------------------------------------------------------------
describe('VUT_AGE — minimum age in turns', () => {
  beforeEach(() => {
    resetStore();
    mockStore.gameInfo = { turn: 50 } as any;
  });

  it('VAG-1: TRI_YES when city is old enough (turn 50, founded turn 40, req 5)', () => {
    const city = { id: 1, turn_founded: 40 } as any; // age = 10
    expect(isReqActive(null, city, null, null, null, null, null,
      makeReq(VUT_AGE, 5, true, REQ_RANGE_CITY), RPT_CERTAIN)).toBe(true);
  });

  it('VAG-2: TRI_NO when city is too young (founded turn 48, age=2, req=10)', () => {
    const city = { id: 1, turn_founded: 48 } as any; // age = 2
    expect(isReqActive(null, city, null, null, null, null, null,
      makeReq(VUT_AGE, 10, true, REQ_RANGE_CITY), RPT_CERTAIN)).toBe(false);
  });

  it('VAG-3: TRI_YES when player turns_alive meets requirement', () => {
    const player = { playerno: 1, turns_alive: 30 } as any;
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_AGE, 20, true, REQ_RANGE_PLAYER), RPT_CERTAIN)).toBe(true);
  });

  it('VAG-4: TRI_NO when player turns_alive is below requirement', () => {
    const player = { playerno: 1, turns_alive: 5 } as any;
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_AGE, 20, true, REQ_RANGE_PLAYER), RPT_CERTAIN)).toBe(false);
  });

  it('VAG-5: TRI_MAYBE when gameInfo.turn is null (game not started)', () => {
    mockStore.gameInfo = null;
    const city = { id: 1, turn_founded: 0 } as any;
    expect(isReqActive(null, city, null, null, null, null, null,
      makeReq(VUT_AGE, 5, true, REQ_RANGE_CITY), RPT_POSSIBLE)).toBe(true);
  });

  it('VAG-6: TRI_MAYBE when city has no turn_founded field', () => {
    const city = { id: 1 } as any; // no turn_founded
    expect(isReqActive(null, city, null, null, null, null, null,
      makeReq(VUT_AGE, 5, true, REQ_RANGE_CITY), RPT_POSSIBLE)).toBe(true);
  });
});

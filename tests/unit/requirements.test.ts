/**
 * Unit tests for data/requirements.ts
 *
 * Tests the requirement evaluation system used for tech prerequisites,
 * building requirements, etc.
 *
 * B1 additions at the bottom: VUT_MINSIZE, VUT_MINYEAR, VUT_IMPROVEMENT
 * (with city context), VUT_TERRAIN, VUT_UTFLAG, VUT_UCLASS,
 * VUT_MINVETERAN (unit instance), VUT_MINMOVES, VUT_MINHP.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  TRI_NO,
  TRI_YES,
  TRI_MAYBE,
  VUT_NONE,
  VUT_ADVANCE,
  VUT_GOVERNMENT,
  VUT_IMPROVEMENT,
  VUT_COUNT,
  VUT_UTYPE,
  VUT_TOPO,
  VUT_MINTECHS,
  VUT_MINVETERAN,
  VUT_NATIONGROUP,
  VUT_IMPR_GENUS,
  VUT_ACTION,
  VUT_EXTRAFLAG,
  VUT_MINSIZE,
  VUT_MINYEAR,
  VUT_TERRAIN,
  VUT_UTFLAG,
  VUT_UCLASS,
  VUT_MINMOVES,
  VUT_MINHP,
  REQ_RANGE_PLAYER,
  REQ_RANGE_CITY,
  REQ_RANGE_TEAM,
  REQ_RANGE_WORLD,
  REQ_RANGE_LOCAL,
  RPT_POSSIBLE,
  RPT_CERTAIN,
} from '@/data/fcTypes';

import {
  isTechInRange,
  isReqActive,
  areReqsActive,
  universalBuildShieldCost,
} from '@/data/requirements';
import { playerInventionState, TECH_KNOWN } from '@/data/tech';
import { store } from '@/data/store';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeReq(overrides: Record<string, any> = {}): any {
  return {
    kind: VUT_NONE,
    range: REQ_RANGE_PLAYER,
    value: 0,
    present: true,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// isTechInRange
// ---------------------------------------------------------------------------

describe('isTechInRange', () => {
  // playerInventionState reads pplayer.inventions[techId] and compares to TECH_KNOWN (2).
  // No window globals needed — TECH_KNOWN is a module constant and
  // playerInventionState is a direct import.

  it('should return TRI_YES when player knows the tech (PLAYER range)', () => {
    const player = { inventions: { 5: TECH_KNOWN, 10: TECH_KNOWN, 15: TECH_KNOWN } } as any;
    expect(isTechInRange(player, REQ_RANGE_PLAYER, 10)).toBe(TRI_YES);
  });

  it('should return TRI_NO when player does not know the tech', () => {
    const player = { inventions: { 5: TECH_KNOWN, 10: TECH_KNOWN, 15: TECH_KNOWN } } as any;
    expect(isTechInRange(player, REQ_RANGE_PLAYER, 20)).toBe(TRI_NO);
  });

  it('should return TRI_NO when player is null', () => {
    expect(isTechInRange(null, REQ_RANGE_PLAYER, 10)).toBe(TRI_NO);
  });

  it('should return TRI_MAYBE for TEAM range (unimplemented)', () => {
    const player = { inventions: { 5: TECH_KNOWN } } as any;
    expect(isTechInRange(player, REQ_RANGE_TEAM, 5)).toBe(TRI_MAYBE);
  });

  it('should return TRI_MAYBE for WORLD range (unimplemented)', () => {
    const player = { inventions: { 5: TECH_KNOWN } } as any;
    expect(isTechInRange(player, REQ_RANGE_WORLD, 5)).toBe(TRI_MAYBE);
  });

  it('should return TRI_MAYBE for invalid range (LOCAL)', () => {
    const player = { inventions: { 5: TECH_KNOWN } } as any;
    expect(isTechInRange(player, REQ_RANGE_LOCAL, 5)).toBe(TRI_MAYBE);
  });
});

// ---------------------------------------------------------------------------
// isReqActive
// ---------------------------------------------------------------------------

describe('isReqActive', () => {
  // No window globals needed — see isTechInRange comment.

  it('should return true for VUT_NONE requirement', () => {
    const req = makeReq({ kind: VUT_NONE });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('should return true when tech requirement is met', () => {
    const player = { inventions: { 10: TECH_KNOWN } } as any;
    const req = makeReq({ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 10, present: true });
    expect(isReqActive(player, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('should return false when tech requirement is not met', () => {
    const player = { inventions: { 5: TECH_KNOWN } } as any;
    const req = makeReq({ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 10, present: true });
    expect(isReqActive(player, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(false);
  });

  it('should handle negated requirement (present=false)', () => {
    const player = { inventions: { 10: TECH_KNOWN } } as any;
    const req = makeReq({ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 10, present: false });
    expect(isReqActive(player, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(false);
  });

  it('should return true for negated requirement when tech is not known', () => {
    const player = { inventions: { 5: TECH_KNOWN } } as any;
    const req = makeReq({ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 10, present: false });
    expect(isReqActive(player, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('should handle VUT_GOVERNMENT requirement', () => {
    const player = { government: 3 } as any;
    const req = makeReq({ kind: VUT_GOVERNMENT, value: 3, present: true });
    expect(isReqActive(player, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('should return false when government does not match', () => {
    const player = { government: 2 } as any;
    const req = makeReq({ kind: VUT_GOVERNMENT, value: 3, present: true });
    expect(isReqActive(player, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(false);
  });

  it('should return TRI_MAYBE → true for government with null player and RPT_POSSIBLE', () => {
    const req = makeReq({ kind: VUT_GOVERNMENT, value: 3, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('should return false for VUT_COUNT', () => {
    const req = makeReq({ kind: VUT_COUNT, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(false);
  });

  it('should return true for unimplemented VUT types with RPT_POSSIBLE (TRI_MAYBE → possible)', () => {
    // VUT_IMPROVEMENT cannot be evaluated client-side → TRI_MAYBE → RPT_POSSIBLE → true
    const req = makeReq({ kind: VUT_IMPROVEMENT, value: 5, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  // ── VUT_UTYPE ────────────────────────────────────────────────────────────

  it('VUT_UTYPE: returns TRI_MAYBE (true) when targetUnittype is null', () => {
    const req = makeReq({ kind: VUT_UTYPE, value: 5, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('VUT_UTYPE: returns true when unit type id matches', () => {
    const req = makeReq({ kind: VUT_UTYPE, value: 5, present: true });
    const ut = { id: 5 };
    expect(isReqActive(null, null, null, null, ut, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('VUT_UTYPE: returns false when unit type id does not match', () => {
    const req = makeReq({ kind: VUT_UTYPE, value: 5, present: true });
    const ut = { id: 7 };
    expect(isReqActive(null, null, null, null, ut, null, null, req, RPT_POSSIBLE)).toBe(false);
  });

  it('VUT_UTYPE: present=false inverts — true when id does NOT match', () => {
    const req = makeReq({ kind: VUT_UTYPE, value: 5, present: false });
    const ut = { id: 7 };
    expect(isReqActive(null, null, null, null, ut, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  // ── VUT_MINTECHS ─────────────────────────────────────────────────────────

  it('VUT_MINTECHS: returns TRI_MAYBE (true) with null player', () => {
    const req = makeReq({ kind: VUT_MINTECHS, value: 3, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('VUT_MINTECHS: returns true when player knows enough techs', () => {
    store.techs = { 1: {}, 2: {}, 3: {} };
    const player = { inventions: { 1: TECH_KNOWN, 2: TECH_KNOWN, 3: TECH_KNOWN } } as any;
    const req = makeReq({ kind: VUT_MINTECHS, value: 3, present: true });
    expect(isReqActive(player, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
    store.techs = {};
  });

  it('VUT_MINTECHS: returns false when player knows too few techs', () => {
    store.techs = { 1: {}, 2: {}, 3: {} };
    const player = { inventions: { 1: TECH_KNOWN } } as any;
    const req = makeReq({ kind: VUT_MINTECHS, value: 3, present: true });
    expect(isReqActive(player, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(false);
    store.techs = {};
  });

  // ── VUT_TOPO ──────────────────────────────────────────────────────────────

  it('VUT_TOPO: returns TRI_MAYBE (true) when mapInfo has no topology_id', () => {
    store.mapInfo = null;
    const req = makeReq({ kind: VUT_TOPO, value: 4, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('VUT_TOPO: returns true when topology_id matches', () => {
    store.mapInfo = { topology_id: 4 };
    const req = makeReq({ kind: VUT_TOPO, value: 4, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
    store.mapInfo = null;
  });

  it('VUT_TOPO: returns false when topology_id does not match', () => {
    store.mapInfo = { topology_id: 2 };
    const req = makeReq({ kind: VUT_TOPO, value: 4, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(false);
    store.mapInfo = null;
  });

  // ── TRI_MAYBE types (VUT_MINVETERAN, VUT_NATIONGROUP, VUT_IMPR_GENUS, VUT_ACTION, VUT_EXTRAFLAG)

  it('VUT_MINVETERAN: returns TRI_MAYBE → true with RPT_POSSIBLE', () => {
    const req = makeReq({ kind: VUT_MINVETERAN, value: 1, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('VUT_NATIONGROUP: returns TRI_MAYBE → true with RPT_POSSIBLE', () => {
    const req = makeReq({ kind: VUT_NATIONGROUP, value: 1, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('VUT_IMPR_GENUS: returns TRI_MAYBE → true with RPT_POSSIBLE', () => {
    const req = makeReq({ kind: VUT_IMPR_GENUS, value: 1, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('VUT_ACTION: returns TRI_MAYBE → true with RPT_POSSIBLE', () => {
    const req = makeReq({ kind: VUT_ACTION, value: 1, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });

  it('VUT_EXTRAFLAG: returns TRI_MAYBE → true with RPT_POSSIBLE', () => {
    const req = makeReq({ kind: VUT_EXTRAFLAG, value: 1, present: true });
    expect(isReqActive(null, null, null, null, null, null, null, req, RPT_POSSIBLE)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// areReqsActive
// ---------------------------------------------------------------------------

describe('areReqsActive', () => {
  // No window globals needed — see isTechInRange comment.

  it('should return true when all requirements are met', () => {
    const player = { inventions: { 5: TECH_KNOWN, 10: TECH_KNOWN }, government: 3 } as any;
    const reqs = [
      makeReq({ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 5, present: true }),
      makeReq({ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 10, present: true }),
      makeReq({ kind: VUT_GOVERNMENT, value: 3, present: true }),
    ];
    expect(areReqsActive(player, null, null, null, null, null, null, reqs, RPT_POSSIBLE)).toBe(true);
  });

  it('should return false when any requirement is not met', () => {
    const player = { inventions: { 5: TECH_KNOWN }, government: 3 } as any;
    const reqs = [
      makeReq({ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 5, present: true }),
      makeReq({ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 10, present: true }),
    ];
    expect(areReqsActive(player, null, null, null, null, null, null, reqs, RPT_POSSIBLE)).toBe(false);
  });

  it('should return true for empty requirements list', () => {
    expect(areReqsActive(null, null, null, null, null, null, null, [], RPT_POSSIBLE)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// universalBuildShieldCost
// ---------------------------------------------------------------------------

describe('universalBuildShieldCost', () => {
  it('should return the build_cost of the target', () => {
    expect(universalBuildShieldCost(null, { build_cost: 60 })).toBe(60);
    expect(universalBuildShieldCost(null, { build_cost: 0 })).toBe(0);
    expect(universalBuildShieldCost(null, { build_cost: 200 })).toBe(200);
  });
});

// ===========================================================================
// B1: Newly implemented VUT types
// ===========================================================================

/** Fake BitVector whose isSet() returns true iff id is in the list */
function makeBV(ids: number[]) { return { isSet: (n: number) => ids.includes(n) }; }

function b1makeReq(kind: number, value: number, range = REQ_RANGE_CITY, present = true): any {
  return { kind, value, range, present };
}

function b1call(req: any, city?: any, tile?: any, unit?: any) {
  return isReqActive(null, city ?? null, null, tile ?? null, unit ?? null, null, null, req, RPT_CERTAIN);
}
function b1callPoss(req: any, city?: any, tile?: any, unit?: any) {
  return isReqActive(null, city ?? null, null, tile ?? null, unit ?? null, null, null, req, RPT_POSSIBLE);
}

// ---------------------------------------------------------------------------
// VUT_MINSIZE
// ---------------------------------------------------------------------------

describe('B1 VUT_MINSIZE', () => {
  const r = (v: number, range = REQ_RANGE_CITY) => b1makeReq(VUT_MINSIZE, v, range);

  it('true when city.size >= req', () => {
    expect(b1call(r(3), { size: 5 })).toBe(true);
  });
  it('true when city.size == req (exact)', () => {
    expect(b1call(r(4), { size: 4 })).toBe(true);
  });
  it('false when city.size < req', () => {
    expect(b1call(r(5), { size: 2 })).toBe(false);
  });
  it('TRI_MAYBE (→false RPT_CERTAIN) when no city', () => {
    expect(b1call(r(3))).toBe(false);
  });
  it('TRI_MAYBE (→true RPT_POSSIBLE) when no city', () => {
    expect(b1callPoss(r(3))).toBe(true);
  });
  it('TRI_MAYBE when range != CITY (player range)', () => {
    expect(b1call(r(1, REQ_RANGE_PLAYER), { size: 10 })).toBe(false);
  });
  it('prohibit: size meets threshold → fails (present=false)', () => {
    expect(b1call(b1makeReq(VUT_MINSIZE, 3, REQ_RANGE_CITY, false), { size: 5 })).toBe(false);
  });
  it('prohibit: size below threshold → passes (present=false)', () => {
    expect(b1call(b1makeReq(VUT_MINSIZE, 3, REQ_RANGE_CITY, false), { size: 1 })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VUT_MINYEAR
// ---------------------------------------------------------------------------

describe('B1 VUT_MINYEAR', () => {
  const r = (v: number) => b1makeReq(VUT_MINYEAR, v, REQ_RANGE_CITY);

  it('true when game year >= req', () => {
    store.gameInfo = { year: 1900 } as any;
    expect(b1call(r(1800))).toBe(true);
  });
  it('false when game year < req', () => {
    store.gameInfo = { year: 100 } as any;
    expect(b1call(r(500))).toBe(false);
  });
  it('true for exact year match', () => {
    store.gameInfo = { year: -300 } as any;
    expect(b1call(r(-300))).toBe(true);
  });
  it('TRI_MAYBE (→false) when gameInfo null', () => {
    store.gameInfo = null;
    expect(b1call(r(1000))).toBe(false);
  });
  it('TRI_MAYBE (→true) when gameInfo null, RPT_POSSIBLE', () => {
    store.gameInfo = null;
    expect(b1callPoss(r(1000))).toBe(true);
  });
  afterEach(() => { store.gameInfo = null; });
});

// ---------------------------------------------------------------------------
// VUT_IMPROVEMENT (with city context, CITY range)
// ---------------------------------------------------------------------------

describe('B1 VUT_IMPROVEMENT (city context)', () => {
  const r = (v: number, range = REQ_RANGE_CITY) => b1makeReq(VUT_IMPROVEMENT, v, range);

  it('true when city improvements BitVector has the bit', () => {
    const city = { improvements: makeBV([3, 7]) };
    expect(b1call(r(7), city)).toBe(true);
  });
  it('false when city lacks the improvement', () => {
    const city = { improvements: makeBV([3]) };
    expect(b1call(r(7), city)).toBe(false);
  });
  it('TRI_MAYBE when no city → false RPT_CERTAIN', () => {
    expect(b1call(r(7))).toBe(false);
  });
  it('TRI_MAYBE (RPT_POSSIBLE→true) when no city', () => {
    expect(b1callPoss(r(7))).toBe(true);
  });
  it('TRI_MAYBE for player range (cannot iterate all cities)', () => {
    const city = { improvements: makeBV([7]) };
    expect(b1call(r(7, REQ_RANGE_PLAYER), city)).toBe(false);
  });
  it('prohibit: city has improvement → fails (present=false)', () => {
    const city = { improvements: makeBV([5]) };
    expect(b1call(b1makeReq(VUT_IMPROVEMENT, 5, REQ_RANGE_CITY, false), city)).toBe(false);
  });
  it('prohibit: city lacks improvement → passes (present=false)', () => {
    const city = { improvements: makeBV([]) };
    expect(b1call(b1makeReq(VUT_IMPROVEMENT, 5, REQ_RANGE_CITY, false), city)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VUT_TERRAIN
// ---------------------------------------------------------------------------

describe('B1 VUT_TERRAIN', () => {
  const r = (v: number) => b1makeReq(VUT_TERRAIN, v, REQ_RANGE_CITY);

  it('true when tile.terrain matches', () => {
    expect(b1call(r(5), undefined, { terrain: 5 })).toBe(true);
  });
  it('false when tile.terrain differs', () => {
    expect(b1call(r(3), undefined, { terrain: 5 })).toBe(false);
  });
  it('TRI_MAYBE → false when no tile', () => {
    expect(b1call(r(3))).toBe(false);
  });
  it('TRI_MAYBE → true (RPT_POSSIBLE) when no tile', () => {
    expect(b1callPoss(r(3))).toBe(true);
  });
  it('prohibit: terrain matches → fails (present=false)', () => {
    expect(b1call(b1makeReq(VUT_TERRAIN, 2, REQ_RANGE_CITY, false), undefined, { terrain: 2 })).toBe(false);
  });
  it('prohibit: terrain differs → passes (present=false)', () => {
    expect(b1call(b1makeReq(VUT_TERRAIN, 2, REQ_RANGE_CITY, false), undefined, { terrain: 5 })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VUT_UTFLAG
// ---------------------------------------------------------------------------

describe('B1 VUT_UTFLAG', () => {
  const r = (v: number) => b1makeReq(VUT_UTFLAG, v, REQ_RANGE_CITY);

  it('true when unit type flags BitVector has the flag', () => {
    expect(b1call(r(7), undefined, undefined, { flags: makeBV([3, 7]) })).toBe(true);
  });
  it('false when unit type lacks the flag', () => {
    expect(b1call(r(7), undefined, undefined, { flags: makeBV([3]) })).toBe(false);
  });
  it('TRI_MAYBE → false when no unit type', () => {
    expect(b1call(r(3))).toBe(false);
  });
  it('TRI_MAYBE → true (RPT_POSSIBLE) when flags is plain array (no isSet)', () => {
    // Not yet converted to BitVector → TRI_MAYBE
    expect(b1callPoss(r(7), undefined, undefined, { flags: [3, 7] })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VUT_UCLASS
// ---------------------------------------------------------------------------

describe('B1 VUT_UCLASS', () => {
  const r = (v: number) => b1makeReq(VUT_UCLASS, v, REQ_RANGE_CITY);

  it('true when unit_class matches', () => {
    expect(b1call(r(2), undefined, undefined, { unit_class: 2 })).toBe(true);
  });
  it('false when unit_class differs', () => {
    expect(b1call(r(2), undefined, undefined, { unit_class: 3 })).toBe(false);
  });
  it('TRI_MAYBE when no unit type', () => {
    expect(b1call(r(2))).toBe(false);
  });
  it('TRI_MAYBE when unit_class field absent (older protocol)', () => {
    expect(b1callPoss(r(2), undefined, undefined, { id: 1, name: 'Test' })).toBe(true);
  });
  it('prohibit: class matches → fails', () => {
    expect(b1call(b1makeReq(VUT_UCLASS, 2, REQ_RANGE_CITY, false), undefined, undefined, { unit_class: 2 })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// VUT_MINVETERAN (unit instance vs unit type)
// ---------------------------------------------------------------------------

describe('B1 VUT_MINVETERAN', () => {
  const r = (v: number) => b1makeReq(VUT_MINVETERAN, v, REQ_RANGE_CITY);

  it('true when unit instance veteran >= req', () => {
    expect(b1call(r(2), undefined, undefined, { veteran: 2, movesleft: 10 })).toBe(true);
  });
  it('false when unit instance veteran < req', () => {
    expect(b1call(r(1), undefined, undefined, { veteran: 0, movesleft: 10 })).toBe(false);
  });
  it('TRI_MAYBE → false for unit TYPE (no veteran field)', () => {
    expect(b1call(r(1), undefined, undefined, { id: 1, name: 'Warriors' })).toBe(false);
  });
  it('TRI_MAYBE → true (RPT_POSSIBLE) for unit type', () => {
    expect(b1callPoss(r(1), undefined, undefined, { id: 1, name: 'Warriors' })).toBe(true);
  });
  it('TRI_MAYBE when no unit', () => {
    expect(b1call(r(1))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// VUT_MINMOVES
// ---------------------------------------------------------------------------

describe('B1 VUT_MINMOVES', () => {
  const r = (v: number) => b1makeReq(VUT_MINMOVES, v, REQ_RANGE_CITY);

  it('true when unit movesleft >= req', () => {
    expect(b1call(r(3), undefined, undefined, { movesleft: 6 })).toBe(true);
  });
  it('false when unit movesleft < req', () => {
    expect(b1call(r(3), undefined, undefined, { movesleft: 1 })).toBe(false);
  });
  it('TRI_MAYBE for unit type (move_rate but no movesleft)', () => {
    expect(b1callPoss(r(3), undefined, undefined, { move_rate: 24 })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VUT_MINHP
// ---------------------------------------------------------------------------

describe('B1 VUT_MINHP', () => {
  const r = (v: number) => b1makeReq(VUT_MINHP, v, REQ_RANGE_CITY);

  it('true when unit instance hp >= req', () => {
    expect(b1call(r(10), undefined, undefined, { hp: 15, movesleft: 10 })).toBe(true);
  });
  it('false when unit instance hp < req', () => {
    expect(b1call(r(10), undefined, undefined, { hp: 5, movesleft: 10 })).toBe(false);
  });
  it('TRI_MAYBE for unit TYPE (hp=max hp, no movesleft discriminant)', () => {
    // UnitType has 'hp' (max HP), but no 'movesleft' → treated as TRI_MAYBE
    expect(b1callPoss(r(5), undefined, undefined, { id: 1, hp: 10 })).toBe(true);
  });
});

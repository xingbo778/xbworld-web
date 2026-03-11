/**
 * Unit tests for data/requirements.ts
 *
 * Tests the requirement evaluation system used for tech prerequisites,
 * building requirements, etc.
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
  REQ_RANGE_PLAYER,
  REQ_RANGE_TEAM,
  REQ_RANGE_WORLD,
  REQ_RANGE_LOCAL,
  RPT_POSSIBLE,
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

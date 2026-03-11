/**
 * Unit tests for:
 *  GOV-1..GOV-4  canPlayerGetGov() — government requirement evaluation
 *  VOTE-1..VOTE-4 handle_vote_update/remove/resolve — store tracking
 *  VE-1..VE-4   VUT_EXTRA — tile extra presence check
 *  VTF-1..VTF-5 VUT_TERRFLAG — terrain flag check (BitVector + number formats)
 *  VIF-1..VIF-4 VUT_IMPR_FLAG — improvement flag check (targetBuilding + targetOutput)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  VUT_EXTRA,
  VUT_TERRFLAG,
  VUT_IMPR_FLAG,
  REQ_RANGE_LOCAL,
  RPT_POSSIBLE,
  RPT_CERTAIN,
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

vi.mock('@/data/tech', () => ({
  TECH_KNOWN: 2,
  playerInventionState: (_p: unknown, _id: number) => 0,
}));

vi.mock('@/data/map', async (importOriginal) => ({
  ...(await importOriginal() as object),
}));

vi.mock('@/data/improvement', () => ({
  improvements_init: vi.fn(),
  get_improvements_from_tech: vi.fn(() => []),
}));

vi.mock('@/renderer/tilespec', () => ({
  get_unit_type_image_sprite: vi.fn(() => null),
  get_improvement_image_sprite: vi.fn(() => null),
  tileset_tech_graphic_tag: vi.fn(() => null),
}));

vi.mock('@/core/events', () => ({
  globalEvents: { emit: vi.fn(), on: vi.fn() },
}));

vi.mock('@/client/clientState', () => ({
  clientState: vi.fn(() => 0),
  clientPlaying: vi.fn(() => null),
  clientIsObserver: () => true,
  setClientState: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------
import { isReqActive } from '@/data/requirements';
import { canPlayerGetGov } from '@/data/government';
import {
  handle_vote_update,
  handle_vote_remove,
  handle_vote_resolve,
} from '@/net/handlers/server';
import { clientPlaying } from '@/client/clientState';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeBitVector(setBits: number[] = []): { isSet(n: number): boolean } {
  return { isSet: (n: number) => setBits.includes(n) };
}

function makeReq(kind: number, value: number, present = true) {
  return { kind, range: REQ_RANGE_LOCAL, value, present };
}

function makeTile(terrainId: number, extraBits: number[] = []): Record<string, unknown> {
  return {
    terrain: terrainId,
    extras: makeBitVector(extraBits),
  };
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
// GOV-1..GOV-4: canPlayerGetGov()
// ---------------------------------------------------------------------------

describe('canPlayerGetGov()', () => {
  beforeEach(() => {
    resetStore();
    vi.mocked(clientPlaying).mockReset();
  });

  it('GOV-1: returns false when no player is playing (observer)', () => {
    vi.mocked(clientPlaying).mockReturnValue(null);
    mockStore.governments[1] = { id: 1, reqs: [] };
    expect(canPlayerGetGov(1)).toBe(false);
  });

  it('GOV-2: returns true when government has empty reqs', () => {
    const fakePlayer = { playerno: 1, government: 0, inventions: {} } as any;
    vi.mocked(clientPlaying).mockReturnValue(fakePlayer);
    mockStore.governments[2] = { id: 2, reqs: [] };
    expect(canPlayerGetGov(2)).toBe(true);
  });

  it('GOV-3: returns true when government has null reqs', () => {
    const fakePlayer = { playerno: 1, government: 0, inventions: {} } as any;
    vi.mocked(clientPlaying).mockReturnValue(fakePlayer);
    mockStore.governments[3] = { id: 3, reqs: null };
    expect(canPlayerGetGov(3)).toBe(true);
  });

  it('GOV-4: returns false when government not in store', () => {
    const fakePlayer = { playerno: 1, government: 0, inventions: {} } as any;
    vi.mocked(clientPlaying).mockReturnValue(fakePlayer);
    expect(canPlayerGetGov(99)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// VOTE-1..VOTE-4: vote handlers
// ---------------------------------------------------------------------------

describe('vote handlers', () => {
  beforeEach(() => {
    resetStore();
    // Clear any votes on store
    delete (mockStore as any)['votes'];
  });

  it('VOTE-1: handle_vote_update stores vote by vote_no', () => {
    const packet = { vote_no: 7, desc: 'allow_observer' } as any;
    handle_vote_update(packet);
    const votes = (mockStore as any)['votes'] as Record<number, unknown>;
    expect(votes).toBeDefined();
    expect(votes[7]).toBe(packet);
  });

  it('VOTE-2: handle_vote_update stores vote by id when vote_no absent', () => {
    const packet = { id: 3, desc: 'foo' } as any;
    handle_vote_update(packet);
    const votes = (mockStore as any)['votes'] as Record<number, unknown>;
    expect(votes[3]).toBe(packet);
  });

  it('VOTE-3: handle_vote_remove deletes the stored vote', () => {
    const packet = { vote_no: 5, desc: 'bar' } as any;
    handle_vote_update(packet);
    handle_vote_remove({ vote_no: 5 } as any);
    const votes = (mockStore as any)['votes'] as Record<number, unknown>;
    expect(votes[5]).toBeUndefined();
  });

  it('VOTE-4: handle_vote_resolve deletes the stored vote', () => {
    const packet = { vote_no: 9, desc: 'baz' } as any;
    handle_vote_update(packet);
    handle_vote_resolve({ vote_no: 9 } as any);
    const votes = (mockStore as any)['votes'] as Record<number, unknown>;
    expect(votes[9]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// VE-1..VE-4: VUT_EXTRA
// ---------------------------------------------------------------------------

describe('VUT_EXTRA — tile extra presence', () => {
  beforeEach(resetStore);

  it('VE-1: TRI_YES when extra is set on tile (BitVector)', () => {
    const tile = makeTile(0, [3]); // extra id=3 is set
    const result = isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_EXTRA, 3), RPT_CERTAIN);
    expect(result).toBe(true);
  });

  it('VE-2: TRI_NO when extra is NOT set on tile', () => {
    const tile = makeTile(0, [1, 2]); // extra 3 not set
    const result = isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_EXTRA, 3), RPT_CERTAIN);
    expect(result).toBe(false);
  });

  it('VE-3: TRI_MAYBE (RPT_POSSIBLE→true) when targetTile is null', () => {
    const result = isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_EXTRA, 3), RPT_POSSIBLE);
    expect(result).toBe(true);
  });

  it('VE-4: present=false inverts — extra absent means requirement met', () => {
    const tile = makeTile(0, []); // extra 3 not set
    const result = isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_EXTRA, 3, false), RPT_CERTAIN);
    expect(result).toBe(true); // TRI_NO with present=false → true
  });
});

// ---------------------------------------------------------------------------
// VTF-1..VTF-5: VUT_TERRFLAG
// ---------------------------------------------------------------------------

describe('VUT_TERRFLAG — terrain flag check', () => {
  beforeEach(resetStore);

  it('VTF-1: TRI_YES when terrain has flag (BitVector format)', () => {
    mockStore.terrains[2] = { id: 2, name: 'Desert', flags: makeBitVector([5]) };
    const tile = makeTile(2);
    const result = isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRFLAG, 5), RPT_CERTAIN);
    expect(result).toBe(true);
  });

  it('VTF-2: TRI_NO when terrain does NOT have flag (BitVector)', () => {
    mockStore.terrains[2] = { id: 2, name: 'Desert', flags: makeBitVector([]) };
    const tile = makeTile(2);
    const result = isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRFLAG, 5), RPT_CERTAIN);
    expect(result).toBe(false);
  });

  it('VTF-3: TRI_YES when terrain has flag (raw number bitmask)', () => {
    // bit 3 = 0b1000 = 8
    mockStore.terrains[1] = { id: 1, name: 'Ocean', flags: 0b1001000 }; // bits 3 and 6
    const tile = makeTile(1);
    const result = isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRFLAG, 3), RPT_CERTAIN);
    expect(result).toBe(true);
  });

  it('VTF-4: TRI_NO when bit not set (raw number bitmask)', () => {
    mockStore.terrains[1] = { id: 1, name: 'Ocean', flags: 0b0000100 }; // only bit 2
    const tile = makeTile(1);
    const result = isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRFLAG, 3), RPT_CERTAIN);
    expect(result).toBe(false);
  });

  it('VTF-5: TRI_MAYBE when tile is null', () => {
    const result = isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_TERRFLAG, 3), RPT_POSSIBLE);
    expect(result).toBe(true); // TRI_MAYBE → RPT_POSSIBLE → true
  });
});

// ---------------------------------------------------------------------------
// VIF-1..VIF-4: VUT_IMPR_FLAG
// ---------------------------------------------------------------------------

describe('VUT_IMPR_FLAG — improvement flag check', () => {
  beforeEach(resetStore);

  it('VIF-1: TRI_YES when improvement has flag (BitVector, via targetBuilding)', () => {
    const impr = { id: 1, name: 'Barracks', flags: makeBitVector([2]) };
    const result = isReqActive(null, null, impr, null, null, null, null,
      makeReq(VUT_IMPR_FLAG, 2), RPT_CERTAIN);
    expect(result).toBe(true);
  });

  it('VIF-2: TRI_NO when flag not set (via targetBuilding)', () => {
    const impr = { id: 1, name: 'Barracks', flags: makeBitVector([]) };
    const result = isReqActive(null, null, impr, null, null, null, null,
      makeReq(VUT_IMPR_FLAG, 2), RPT_CERTAIN);
    expect(result).toBe(false);
  });

  it('VIF-3: TRI_YES via targetOutput fallback (callers that pass impr as output)', () => {
    const impr = { id: 2, name: 'Temple', flags: makeBitVector([7]) };
    // targetBuilding=null, targetOutput=impr (legacy call-site pattern)
    const result = isReqActive(null, null, null, null, null, impr, null,
      makeReq(VUT_IMPR_FLAG, 7), RPT_CERTAIN);
    expect(result).toBe(true);
  });

  it('VIF-4: TRI_MAYBE when both targetBuilding and targetOutput are null', () => {
    const result = isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_IMPR_FLAG, 2), RPT_POSSIBLE);
    expect(result).toBe(true); // TRI_MAYBE → RPT_POSSIBLE → true
  });
});

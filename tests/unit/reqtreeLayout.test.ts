/**
 * Unit tests for the dynamic reqtree layout builder (Task: reqtree dynamic loading).
 *
 * Covers:
 *  RL-1  Empty tech set returns empty layout
 *  RL-2  Single root tech → depth 0, x=0, y=0
 *  RL-3  Linear chain A→B→C assigns increasing depths
 *  RL-4  Fork: A→B, A→C — both B and C at depth 1
 *  RL-5  Diamond A→B→D, A→C→D — D at depth 2
 *  RL-6  Invalid prereq (not in set) is silently ignored
 *  RL-7  All tech ids from input appear in the output
 *  RL-8  x = depth * LAYOUT_COL_WIDTH; y = row * LAYOUT_ROW_HEIGHT
 *  RL-9  Techs with no valid prereqs (only A_NONE) stay at depth 0
 *  RL-10 handle_rulesets_ready populates store.computedReqtree
 *  RL-11 handle_ruleset_control clears store.computedReqtree
 *  RL-12 Barycentric sort: layout is deterministic (same input → same output)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Module mocks — all side-effectful imports from the handlers
// ---------------------------------------------------------------------------
vi.mock('@/components/Dialogs/SwalDialog', () => ({ swal: vi.fn() }));
vi.mock('@/utils/dom', () => ({ blockUI: vi.fn(), unblockUI: vi.fn() }));
vi.mock('@/core/log', () => ({ freelog: vi.fn(), logError: vi.fn() }));
vi.mock('@/client/clientState', () => ({
  C_S_PREPARING: 1, clientPlaying: () => null,
}));
vi.mock('@/client/clientMain', () => ({ setClientState: vi.fn() }));
vi.mock('@/data/improvement', () => ({
  improvements_init: vi.fn(),
  get_improvements_from_tech: vi.fn(() => []),
}));
vi.mock('@/data/extra', () => ({ isExtraCausedBy: vi.fn() }));
vi.mock('@/utils/bitvector', () => ({
  BitVector: vi.fn((x: unknown) => x),
}));
vi.mock('@/utils/helpers', () => ({
  stringUnqualify: (s: string) => s,
}));
vi.mock('@/core/events', () => ({
  globalEvents: { emit: vi.fn(), on: vi.fn() },
}));

// ---------------------------------------------------------------------------
// Imports after mocks
// ---------------------------------------------------------------------------
import { buildReqtreeLayout, LAYOUT_COL_WIDTH, LAYOUT_ROW_HEIGHT } from '@/data/reqtreeLayout';
import { store } from '@/data/store';
import { handle_rulesets_ready, handle_ruleset_control } from '@/net/handlers/ruleset';
import type { Tech } from '@/data/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal Tech object suitable for buildReqtreeLayout.
 * `req` is the pre-processed 2-slot array produced by recreate_old_tech_req.
 */
function makeTech(id: number, req: [number, number] = [0, 0]): Tech {
  return { id, name: `Tech${id}`, rule_name: `tech${id}`, graphic_str: '', graphic_alt: '', req } as unknown as Tech;
}

function resetStore(): void {
  store.techs = {};
  store.computedReqtree = null;
}

// ---------------------------------------------------------------------------
// RL-1: Empty input
// ---------------------------------------------------------------------------

describe('RL-1: empty tech set', () => {
  it('returns empty layout for empty store.techs', () => {
    expect(buildReqtreeLayout({})).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// RL-2: Single root tech
// ---------------------------------------------------------------------------

describe('RL-2: single root tech', () => {
  it('places root tech at x=0, y=0', () => {
    const layout = buildReqtreeLayout({ 1: makeTech(1) });
    expect(layout['1']).toEqual({ x: 0, y: 0 });
  });
});

// ---------------------------------------------------------------------------
// RL-3: Linear chain A→B→C
// ---------------------------------------------------------------------------

describe('RL-3: linear chain', () => {
  // A(id=1,no prereqs) → B(id=2,req=[1,0]) → C(id=3,req=[2,0])
  const techs: Record<number, Tech> = {
    1: makeTech(1, [0, 0]),
    2: makeTech(2, [1, 0]),
    3: makeTech(3, [2, 0]),
  };

  it('depth increases along the chain', () => {
    const layout = buildReqtreeLayout(techs);
    expect(layout['1'].x).toBe(0);
    expect(layout['2'].x).toBe(LAYOUT_COL_WIDTH);
    expect(layout['3'].x).toBe(2 * LAYOUT_COL_WIDTH);
  });

  it('all three techs are present in the layout', () => {
    const layout = buildReqtreeLayout(techs);
    expect(Object.keys(layout)).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// RL-4: Fork A→B and A→C
// ---------------------------------------------------------------------------

describe('RL-4: fork (two children share one parent)', () => {
  const techs: Record<number, Tech> = {
    1: makeTech(1, [0, 0]),
    2: makeTech(2, [1, 0]),
    3: makeTech(3, [1, 0]),
  };

  it('parent A is at depth 0', () => {
    const layout = buildReqtreeLayout(techs);
    expect(layout['1'].x).toBe(0);
  });

  it('both children B and C are at depth 1', () => {
    const layout = buildReqtreeLayout(techs);
    expect(layout['2'].x).toBe(LAYOUT_COL_WIDTH);
    expect(layout['3'].x).toBe(LAYOUT_COL_WIDTH);
  });

  it('B and C are in different rows', () => {
    const layout = buildReqtreeLayout(techs);
    expect(layout['2'].y).not.toBe(layout['3'].y);
  });
});

// ---------------------------------------------------------------------------
// RL-5: Diamond A→B→D and A→C→D
// ---------------------------------------------------------------------------

describe('RL-5: diamond convergence', () => {
  const techs: Record<number, Tech> = {
    1: makeTech(1, [0, 0]),           // A — root
    2: makeTech(2, [1, 0]),           // B — needs A
    3: makeTech(3, [1, 0]),           // C — needs A
    4: makeTech(4, [2, 3]),           // D — needs B and C
  };

  it('D is at depth 2 (max prereq depth + 1)', () => {
    const layout = buildReqtreeLayout(techs);
    expect(layout['4'].x).toBe(2 * LAYOUT_COL_WIDTH);
  });

  it('A is at depth 0', () => {
    const layout = buildReqtreeLayout(techs);
    expect(layout['1'].x).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// RL-6: Invalid prereq not in the set
// ---------------------------------------------------------------------------

describe('RL-6: invalid prereq id', () => {
  const techs: Record<number, Tech> = {
    5: makeTech(5, [999, 0]), // req 999 does not exist in techs
  };

  it('tech with missing prereq is placed at depth 0 (treated as root)', () => {
    const layout = buildReqtreeLayout(techs);
    expect(layout['5'].x).toBe(0);
  });

  it('does not throw for missing prereqs', () => {
    expect(() => buildReqtreeLayout(techs)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// RL-7: All tech ids appear in output
// ---------------------------------------------------------------------------

describe('RL-7: all tech ids present in output', () => {
  it('every tech id from the input appears as a key in the layout', () => {
    const techs: Record<number, Tech> = {};
    for (let i = 1; i <= 10; i++) techs[i] = makeTech(i, [0, 0]);
    const layout = buildReqtreeLayout(techs);
    for (let i = 1; i <= 10; i++) {
      expect(layout[String(i)]).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// RL-8: Coordinate formula
// ---------------------------------------------------------------------------

describe('RL-8: coordinate formula x = depth * COL_WIDTH, y = row * ROW_HEIGHT', () => {
  it('x values are multiples of LAYOUT_COL_WIDTH', () => {
    const techs: Record<number, Tech> = {
      1: makeTech(1, [0, 0]),
      2: makeTech(2, [1, 0]),
      3: makeTech(3, [2, 0]),
    };
    const layout = buildReqtreeLayout(techs);
    for (const node of Object.values(layout)) {
      expect(node.x % LAYOUT_COL_WIDTH).toBe(0);
    }
  });

  it('y values are multiples of LAYOUT_ROW_HEIGHT', () => {
    const techs: Record<number, Tech> = {};
    for (let i = 1; i <= 5; i++) techs[i] = makeTech(i, [0, 0]);
    const layout = buildReqtreeLayout(techs);
    for (const node of Object.values(layout)) {
      expect(node.y % LAYOUT_ROW_HEIGHT).toBe(0);
    }
  });
});

// ---------------------------------------------------------------------------
// RL-9: Techs with only A_NONE prereqs stay at depth 0
// ---------------------------------------------------------------------------

describe('RL-9: A_NONE prereqs treated as no prereqs', () => {
  it('req=[0,0] results in depth 0', () => {
    const layout = buildReqtreeLayout({ 7: makeTech(7, [0, 0]) });
    expect(layout['7'].x).toBe(0);
  });

  it('req=[0,0] and a real prereq: real prereq takes precedence', () => {
    const techs: Record<number, Tech> = {
      1: makeTech(1, [0, 0]),
      2: makeTech(2, [1, 0]), // one real, one A_NONE
    };
    const layout = buildReqtreeLayout(techs);
    expect(layout['2'].x).toBe(LAYOUT_COL_WIDTH);
  });
});

// ---------------------------------------------------------------------------
// RL-10: handle_rulesets_ready populates store.computedReqtree
// ---------------------------------------------------------------------------

describe('RL-10: handle_rulesets_ready integration', () => {
  beforeEach(() => { resetStore(); });

  it('store.computedReqtree is null before rulesets_ready', () => {
    store.techs = { 1: makeTech(1), 2: makeTech(2, [1, 0]) };
    expect(store.computedReqtree).toBeNull();
  });

  it('store.computedReqtree is populated after handle_rulesets_ready', () => {
    store.techs = { 1: makeTech(1), 2: makeTech(2, [1, 0]) };
    handle_rulesets_ready({} as any);
    expect(store.computedReqtree).not.toBeNull();
    expect(store.computedReqtree!['1']).toBeDefined();
    expect(store.computedReqtree!['2']).toBeDefined();
  });

  it('computed layout matches buildReqtreeLayout directly', () => {
    const techs: Record<number, Tech> = {
      1: makeTech(1, [0, 0]),
      2: makeTech(2, [1, 0]),
      3: makeTech(3, [2, 0]),
    };
    store.techs = techs;
    handle_rulesets_ready({} as any);
    const expected = buildReqtreeLayout(techs);
    expect(store.computedReqtree).toEqual(expected);
  });
});

// ---------------------------------------------------------------------------
// RL-11: handle_ruleset_control clears store.computedReqtree
// ---------------------------------------------------------------------------

describe('RL-11: handle_ruleset_control clears layout', () => {
  beforeEach(() => { resetStore(); });

  it('clears computedReqtree when a new ruleset arrives', () => {
    store.computedReqtree = { '1': { x: 0, y: 0 } };
    handle_ruleset_control({} as any);
    expect(store.computedReqtree).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// RL-12: Determinism — same input → same output
// ---------------------------------------------------------------------------

describe('RL-12: deterministic layout', () => {
  it('calling buildReqtreeLayout twice on the same input produces identical output', () => {
    const techs: Record<number, Tech> = {
      1: makeTech(1, [0, 0]),
      2: makeTech(2, [1, 0]),
      3: makeTech(3, [1, 0]),
      4: makeTech(4, [2, 3]),
      5: makeTech(5, [2, 0]),
    };
    const a = buildReqtreeLayout(techs);
    const b = buildReqtreeLayout(techs);
    expect(a).toEqual(b);
  });
});

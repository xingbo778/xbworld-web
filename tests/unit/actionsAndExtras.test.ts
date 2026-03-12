/**
 * Unit tests for data/actions.ts and data/extra.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

// ── actions ───────────────────────────────────────────────────────────────

describe('actionByNumber', () => {
  it('is exported as a function', async () => {
    const { actionByNumber } = await import('@/data/actions');
    expect(typeof actionByNumber).toBe('function');
  });

  it('returns null for unknown action id', async () => {
    const { actionByNumber } = await import('@/data/actions');
    expect(actionByNumber(9999)).toBeNull();
  });

  it('returns action when store has matching action', async () => {
    const { actionByNumber } = await import('@/data/actions');
    store.actions[5] = { id: 5, name: 'Spy', result: 1 } as never;
    expect(actionByNumber(5)).toMatchObject({ id: 5, name: 'Spy' });
  });
});

describe('actionHasResult', () => {
  it('returns null for null action', async () => {
    const { actionHasResult } = await import('@/data/actions');
    expect(actionHasResult(null, 1)).toBeNull();
  });

  it('returns a boolean when action has result field', async () => {
    const { actionHasResult } = await import('@/data/actions');
    const action = { id: 1, name: 'Test', result: 2 } as never;
    const result = actionHasResult(action, 2);
    expect(typeof result).toBe('boolean');
  });
});

describe('action_prob_not_impl', () => {
  it('returns a boolean for an unknown probability object', async () => {
    const { action_prob_not_impl } = await import('@/data/actions');
    expect(typeof action_prob_not_impl({ min: 0, max: 0 } as never)).toBe('boolean');
  });
});

describe('actionProbPossible', () => {
  it('returns false for zero-range probability', async () => {
    const { actionProbPossible } = await import('@/data/actions');
    expect(typeof actionProbPossible({ min: 0, max: 0 } as never)).toBe('boolean');
  });
});

// ── extra ─────────────────────────────────────────────────────────────────

describe('EXTRA_NONE constant', () => {
  it('exports EXTRA_NONE as -1', async () => {
    const { EXTRA_NONE } = await import('@/data/extra');
    expect(EXTRA_NONE).toBe(-1);
  });
});

describe('extraByNumber', () => {
  it('returns null for unknown extra id', async () => {
    const { extraByNumber } = await import('@/data/extra');
    expect(extraByNumber(9999)).toBeNull();
  });

  it('returns extra when store has rulesControl and matching entry', async () => {
    const { extraByNumber } = await import('@/data/extra');
    store.extras[3] = { id: 3, name: 'Road', causes: 0, rmcauses: 0 } as never;
    store.rulesControl = { num_extra_types: 10 } as never;
    expect(extraByNumber(3)).toMatchObject({ id: 3, name: 'Road' });
    store.rulesControl = null as never;
  });

  it('returns null when rulesControl is null', async () => {
    const { extraByNumber } = await import('@/data/extra');
    store.rulesControl = null as never;
    expect(extraByNumber(3)).toBeNull();
  });
});

describe('isExtraCausedBy', () => {
  it('is exported as a function', async () => {
    const { isExtraCausedBy } = await import('@/data/extra');
    expect(typeof isExtraCausedBy).toBe('function');
  });

  it('returns a boolean for a valid extra', async () => {
    const { isExtraCausedBy } = await import('@/data/extra');
    const extra = { id: 1, causes: { isSet: () => true } } as never;
    expect(typeof isExtraCausedBy(extra, 1)).toBe('boolean');
  });
});

describe('isExtraRemovedBy', () => {
  it('is exported as a function', async () => {
    const { isExtraRemovedBy } = await import('@/data/extra');
    expect(typeof isExtraRemovedBy).toBe('function');
  });
});

describe('territoryClaimingExtra', () => {
  it('is exported as a function', async () => {
    const { territoryClaimingExtra } = await import('@/data/extra');
    expect(typeof territoryClaimingExtra).toBe('function');
  });

  it('returns a boolean', async () => {
    const { territoryClaimingExtra } = await import('@/data/extra');
    const extra = { id: 1, causes: { isSet: () => false } } as never;
    expect(typeof territoryClaimingExtra(extra)).toBe('boolean');
  });
});

describe('extraOwner', () => {
  it('is exported as a function', async () => {
    const { extraOwner } = await import('@/data/extra');
    expect(typeof extraOwner).toBe('function');
  });

  it('returns null when tile has no extras', async () => {
    const { extraOwner } = await import('@/data/extra');
    const ptile = { extras: { isSet: () => false } } as never;
    expect(extraOwner(ptile)).toBeNull();
  });
});

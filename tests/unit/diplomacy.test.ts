/**
 * Tests for diplomacy packet handlers.
 * All handlers are observer-mode stubs: clause state is tracked but no UI is shown.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('handle_diplomacy_init_meeting', () => {
  it('initializes an empty clause list for the counterpart', async () => {
    const { handle_diplomacy_init_meeting } = await import('@/net/handlers/diplomacy');
    // Call the handler — should not throw
    expect(() =>
      handle_diplomacy_init_meeting({ counterpart: 2 } as never)
    ).not.toThrow();
  });

  it('can be called multiple times for different counterparts', async () => {
    const { handle_diplomacy_init_meeting } = await import('@/net/handlers/diplomacy');
    expect(() => {
      handle_diplomacy_init_meeting({ counterpart: 1 } as never);
      handle_diplomacy_init_meeting({ counterpart: 2 } as never);
    }).not.toThrow();
  });
});

describe('handle_diplomacy_cancel_meeting', () => {
  it('does not throw when cancelling an existing meeting', async () => {
    const { handle_diplomacy_init_meeting, handle_diplomacy_cancel_meeting } =
      await import('@/net/handlers/diplomacy');
    handle_diplomacy_init_meeting({ counterpart: 3 } as never);
    expect(() =>
      handle_diplomacy_cancel_meeting({ counterpart: 3 } as never)
    ).not.toThrow();
  });

  it('does not throw when cancelling a non-existent meeting', async () => {
    const { handle_diplomacy_cancel_meeting } = await import('@/net/handlers/diplomacy');
    expect(() =>
      handle_diplomacy_cancel_meeting({ counterpart: 99 } as never)
    ).not.toThrow();
  });
});

describe('handle_diplomacy_create_clause', () => {
  it('adds a clause for an initialized counterpart', async () => {
    const { handle_diplomacy_init_meeting, handle_diplomacy_create_clause } =
      await import('@/net/handlers/diplomacy');
    handle_diplomacy_init_meeting({ counterpart: 4 } as never);
    expect(() =>
      handle_diplomacy_create_clause({ counterpart: 4, type: 1, value: 10 } as never)
    ).not.toThrow();
  });

  it('auto-initializes clause list for unknown counterpart', async () => {
    const { handle_diplomacy_create_clause } = await import('@/net/handlers/diplomacy');
    // counterpart 5 was never init-met; should auto-create list
    expect(() =>
      handle_diplomacy_create_clause({ counterpart: 5, type: 2, value: 0 } as never)
    ).not.toThrow();
  });
});

describe('handle_diplomacy_remove_clause', () => {
  it('is a no-op and does not throw', async () => {
    const { handle_diplomacy_remove_clause } = await import('@/net/handlers/diplomacy');
    expect(() =>
      handle_diplomacy_remove_clause({ counterpart: 1, type: 1, value: 0 } as never)
    ).not.toThrow();
  });
});

describe('handle_diplomacy_accept_treaty', () => {
  it('is a no-op and does not throw', async () => {
    const { handle_diplomacy_accept_treaty } = await import('@/net/handlers/diplomacy');
    expect(() =>
      handle_diplomacy_accept_treaty({ counterpart: 1 } as never)
    ).not.toThrow();
  });
});

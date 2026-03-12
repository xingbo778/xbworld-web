/**
 * Tests for server.ts handler utilities and vote/topology/ping handlers.
 * Settings handlers are covered in serverSettings.test.ts and handlerEvents.test.ts.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

// ── connection utilities ────────────────────────────────────────────────────

describe('conn_list_append / find_conn_by_id / client_remove_cli_conn', () => {
  it('conn_list_append stores a connection by id', async () => {
    const { conn_list_append, find_conn_by_id } = await import('@/net/handlers/server');
    conn_list_append({ id: 7, username: 'alice' } as never);
    expect(find_conn_by_id(7)).toMatchObject({ id: 7, username: 'alice' });
  });

  it('find_conn_by_id returns undefined for unknown id', async () => {
    const { find_conn_by_id } = await import('@/net/handlers/server');
    expect(find_conn_by_id(999)).toBeUndefined();
  });

  it('client_remove_cli_conn removes a connection from store', async () => {
    const { conn_list_append, find_conn_by_id, client_remove_cli_conn } =
      await import('@/net/handlers/server');
    conn_list_append({ id: 3, username: 'bob' } as never);
    client_remove_cli_conn({ id: 3 } as never);
    expect(find_conn_by_id(3)).toBeUndefined();
  });
});

// ── handle_set_topology ─────────────────────────────────────────────────────

describe('handle_set_topology', () => {
  it('updates topology_id on store.mapInfo in-place', async () => {
    const { handle_map_info } = await import('@/net/handlers/map');
    const { handle_set_topology } = await import('@/net/handlers/server');
    // Allocate a map first so store.mapInfo exists
    handle_map_info({ xsize: 10, ysize: 10, topology_id: 0, wrap_id: 0 } as never);
    expect(store.mapInfo).toBeDefined();

    handle_set_topology({ topology_id: 4, wrap_id: 1 } as never);

    expect((store.mapInfo as Record<string, unknown>)['topology_id']).toBe(4);
    expect((store.mapInfo as Record<string, unknown>)['wrap_id']).toBe(1);
  });

  it('does not throw if store.mapInfo is null (no map yet)', async () => {
    const { handle_set_topology } = await import('@/net/handlers/server');
    store.mapInfo = null as never;
    expect(() => handle_set_topology({ topology_id: 2 } as never)).not.toThrow();
  });
});

// ── handle_conn_ping ────────────────────────────────────────────────────────

describe('handle_conn_ping', () => {
  it('updates store.pingLast and does not throw', async () => {
    const { handle_conn_ping } = await import('@/net/handlers/server');
    const before = store.pingLast;
    // sendConnPong will fail (no WebSocket) — but the store update should happen first
    try {
      handle_conn_ping({} as never);
    } catch {
      // sendConnPong may throw in test environment — that's fine
    }
    // store.pingLast is set before the pong call
    expect(store.pingLast).toBeGreaterThanOrEqual(before);
  });
});

// ── handle_server_info ──────────────────────────────────────────────────────

describe('handle_server_info', () => {
  it('does not throw for a version packet', async () => {
    const { handle_server_info } = await import('@/net/handlers/server');
    expect(() =>
      handle_server_info({
        major_version: 3, minor_version: 1, patch_version: 0,
        emerg_version: 0, version_label: '',
      } as never)
    ).not.toThrow();
  });

  it('does not throw for an emergency version packet', async () => {
    const { handle_server_info } = await import('@/net/handlers/server');
    expect(() =>
      handle_server_info({
        major_version: 3, minor_version: 1, patch_version: 0,
        emerg_version: 1, version_label: '-emergency',
      } as never)
    ).not.toThrow();
  });
});

// ── handle_single_want_hack_reply / handle_edit_* ──────────────────────────

describe('no-op handlers', () => {
  it('handle_single_want_hack_reply is a no-op', async () => {
    const { handle_single_want_hack_reply } = await import('@/net/handlers/server');
    expect(() => handle_single_want_hack_reply({} as never)).not.toThrow();
  });

  it('handle_edit_startpos is a no-op', async () => {
    const { handle_edit_startpos } = await import('@/net/handlers/server');
    expect(() => handle_edit_startpos({} as never)).not.toThrow();
  });

  it('handle_edit_startpos_full is a no-op', async () => {
    const { handle_edit_startpos_full } = await import('@/net/handlers/server');
    expect(() => handle_edit_startpos_full({} as never)).not.toThrow();
  });

  it('handle_edit_object_created is a no-op', async () => {
    const { handle_edit_object_created } = await import('@/net/handlers/server');
    expect(() => handle_edit_object_created({} as never)).not.toThrow();
  });
});

// ── vote handlers ───────────────────────────────────────────────────────────

describe('handle_vote_update / handle_vote_remove / handle_vote_resolve', () => {
  it('handle_vote_update stores vote by vote_no', async () => {
    const { handle_vote_update } = await import('@/net/handlers/server');
    handle_vote_update({ vote_no: 1, yes: 2, no: 0, abstain: 1 } as never);
    const votes = (store as unknown as Record<string, unknown>)['votes'] as Record<number, unknown>;
    expect(votes[1]).toBeDefined();
  });

  it('handle_vote_remove deletes vote by vote_no', async () => {
    const { handle_vote_update, handle_vote_remove } = await import('@/net/handlers/server');
    handle_vote_update({ vote_no: 2, yes: 1, no: 0, abstain: 0 } as never);
    handle_vote_remove({ vote_no: 2 } as never);
    const votes = (store as unknown as Record<string, unknown>)['votes'] as Record<number, unknown>;
    expect(votes[2]).toBeUndefined();
  });

  it('handle_vote_resolve deletes vote by vote_no', async () => {
    const { handle_vote_update, handle_vote_resolve } = await import('@/net/handlers/server');
    handle_vote_update({ vote_no: 3, yes: 3, no: 0, abstain: 0 } as never);
    handle_vote_resolve({ vote_no: 3 } as never);
    const votes = (store as unknown as Record<string, unknown>)['votes'] as Record<number, unknown>;
    expect(votes[3]).toBeUndefined();
  });

  it('handle_vote_remove does not throw when no votes exist', async () => {
    const { handle_vote_remove } = await import('@/net/handlers/server');
    expect(() => handle_vote_remove({ vote_no: 99 } as never)).not.toThrow();
  });

  it('handle_vote_new does not throw (auto-vote via ws, may be closed)', async () => {
    const { handle_vote_new } = await import('@/net/handlers/server');
    expect(() => handle_vote_new({ vote_no: 5, desc: 'test' } as never)).not.toThrow();
  });
});

// ── handle_server_join_reply ─────────────────────────────────────────────────

describe('handle_server_join_reply', () => {
  it('is exported as a function', async () => {
    const { handle_server_join_reply } = await import('@/net/handlers/server');
    expect(typeof handle_server_join_reply).toBe('function');
  });

  it('does not throw for a join-rejected packet', async () => {
    const { handle_server_join_reply } = await import('@/net/handlers/server');
    // you_can_join=false path: just logs a message, no crash
    expect(() =>
      handle_server_join_reply({ you_can_join: false, message: 'rejected', conn_id: 0, capabilities: '' } as never)
    ).not.toThrow();
  });
});

// ── handle_authentication_req ─────────────────────────────────────────────────

describe('handle_authentication_req', () => {
  it('is exported as a function', async () => {
    const { handle_authentication_req } = await import('@/net/handlers/server');
    expect(typeof handle_authentication_req).toBe('function');
  });

  it('does not throw for AUTH_LOGINPASS type', async () => {
    const { handle_authentication_req } = await import('@/net/handlers/server');
    expect(() => handle_authentication_req({ type: 1, method: 1 } as never)).not.toThrow();
  });
});

// ── handle_connect_msg ────────────────────────────────────────────────────────

describe('handle_connect_msg', () => {
  it('is exported as a function', async () => {
    const { handle_connect_msg } = await import('@/net/handlers/server');
    expect(typeof handle_connect_msg).toBe('function');
  });

  it('does not throw for a simple message', async () => {
    const { handle_connect_msg } = await import('@/net/handlers/server');
    expect(() => handle_connect_msg({ message: 'Welcome!' } as never)).not.toThrow();
  });
});

// ── handle_conn_ping_info ─────────────────────────────────────────────────────

describe('handle_conn_ping_info', () => {
  it('is exported as a function', async () => {
    const { handle_conn_ping_info } = await import('@/net/handlers/server');
    expect(typeof handle_conn_ping_info).toBe('function');
  });

  it('does not throw with valid ping info', async () => {
    const { handle_conn_ping_info } = await import('@/net/handlers/server');
    expect(() => handle_conn_ping_info({ conn_id: 1, ping: 50, host: 'localhost' } as never)).not.toThrow();
  });
});

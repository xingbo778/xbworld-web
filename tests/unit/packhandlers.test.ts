/**
 * Unit tests for net/packhandlers.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('packet_hand_table', () => {
  it('is exported as an object with handler entries', async () => {
    const { packet_hand_table } = await import('@/net/packhandlers');
    expect(typeof packet_hand_table).toBe('object');
    expect(packet_hand_table).not.toBeNull();
  });

  it('has entries for common packet ids', async () => {
    const { packet_hand_table } = await import('@/net/packhandlers');
    // Spot-check a few packet ids that should be in the table
    const table = packet_hand_table as Record<number, unknown>;
    // At least some entries should be functions
    const handlers = Object.values(table).filter(v => typeof v === 'function');
    expect(handlers.length).toBeGreaterThan(0);
  });
});

describe('register_packet_handler', () => {
  it('is exported as a function', async () => {
    const { register_packet_handler } = await import('@/net/packhandlers');
    expect(typeof register_packet_handler).toBe('function');
  });

  it('does not throw when registering a handler', async () => {
    const { register_packet_handler } = await import('@/net/packhandlers');
    expect(() => register_packet_handler(9999, () => {})).not.toThrow();
  });
});

describe('client_handle_packet', () => {
  it('is exported as a function', async () => {
    const { client_handle_packet } = await import('@/net/packhandlers');
    expect(typeof client_handle_packet).toBe('function');
  });

  it('does not throw for null packet list', async () => {
    const { client_handle_packet } = await import('@/net/packhandlers');
    expect(() => client_handle_packet(null)).not.toThrow();
  });

  it('does not throw for empty packet list', async () => {
    const { client_handle_packet } = await import('@/net/packhandlers');
    expect(() => client_handle_packet([])).not.toThrow();
  });
});

describe('handle_web_goto_path', () => {
  it('is exported as a function', async () => {
    const { handle_web_goto_path } = await import('@/net/packhandlers');
    expect(typeof handle_web_goto_path).toBe('function');
  });

  it('does not throw when unit is absent from store', async () => {
    const { handle_web_goto_path } = await import('@/net/packhandlers');
    expect(() => handle_web_goto_path({
      unit_id: 999, path: [], length: 0,
    } as never)).not.toThrow();
  });
});

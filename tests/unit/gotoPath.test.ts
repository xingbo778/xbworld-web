/**
 * Unit tests for core/control/gotoPath.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('activate_goto', () => {
  it('is exported as a function', async () => {
    const { activate_goto } = await import('@/core/control/gotoPath');
    expect(typeof activate_goto).toBe('function');
  });

  it('does not throw', async () => {
    const { activate_goto } = await import('@/core/control/gotoPath');
    expect(() => activate_goto()).not.toThrow();
  });
});

describe('deactivate_goto', () => {
  it('is exported as a function', async () => {
    const { deactivate_goto } = await import('@/core/control/gotoPath');
    expect(typeof deactivate_goto).toBe('function');
  });

  it('does not throw with false', async () => {
    const { deactivate_goto } = await import('@/core/control/gotoPath');
    expect(() => deactivate_goto(false)).not.toThrow();
  });
});

describe('check_request_goto_path', () => {
  it('is exported as a function', async () => {
    const { check_request_goto_path } = await import('@/core/control/gotoPath');
    expect(typeof check_request_goto_path).toBe('function');
  });

  it('does not throw when no units in focus', async () => {
    const { check_request_goto_path } = await import('@/core/control/gotoPath');
    expect(() => check_request_goto_path()).not.toThrow();
  });
});

describe('update_goto_path', () => {
  it('is exported as a function', async () => {
    const { update_goto_path } = await import('@/core/control/gotoPath');
    expect(typeof update_goto_path).toBe('function');
  });

  it('does not throw when unit is absent from store', async () => {
    const { update_goto_path } = await import('@/core/control/gotoPath');
    expect(() => update_goto_path({
      unit_id: 999, dest: 0, dir: [], length: 0, turns: 0,
    })).not.toThrow();
  });
});

describe('send_end_turn', () => {
  it('is exported as a function', async () => {
    const { send_end_turn } = await import('@/core/control/gotoPath');
    expect(typeof send_end_turn).toBe('function');
  });
});

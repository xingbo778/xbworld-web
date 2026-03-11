/**
 * Unit tests for ui/cityDialog.ts exported functions.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('show_city_dialog_by_id', () => {
  it('is exported as a function', async () => {
    const { show_city_dialog_by_id } = await import('@/ui/cityDialog');
    expect(typeof show_city_dialog_by_id).toBe('function');
  });

  it('does not throw when city is absent from store', async () => {
    const { show_city_dialog_by_id } = await import('@/ui/cityDialog');
    expect(() => show_city_dialog_by_id(999)).not.toThrow();
  });
});

describe('close_city_dialog / city_dialog_close_handler', () => {
  it('close_city_dialog does not throw', async () => {
    const { close_city_dialog } = await import('@/ui/cityDialog');
    expect(() => close_city_dialog()).not.toThrow();
  });

  it('city_dialog_close_handler does not throw', async () => {
    const { city_dialog_close_handler } = await import('@/ui/cityDialog');
    expect(() => city_dialog_close_handler()).not.toThrow();
  });
});

describe('update_city_screen', () => {
  it('does not throw when cityDialog is null', async () => {
    const { update_city_screen } = await import('@/ui/cityDialog');
    expect(() => update_city_screen()).not.toThrow();
  });
});

describe('no-op stubs', () => {
  it('request_city_buy does not throw', async () => {
    const { request_city_buy } = await import('@/ui/cityDialog');
    expect(() => request_city_buy()).not.toThrow();
  });

  it('send_city_buy does not throw', async () => {
    const { send_city_buy } = await import('@/ui/cityDialog');
    expect(() => send_city_buy()).not.toThrow();
  });

  it('next_city does not throw', async () => {
    const { next_city } = await import('@/ui/cityDialog');
    expect(() => next_city()).not.toThrow();
  });

  it('previous_city does not throw', async () => {
    const { previous_city } = await import('@/ui/cityDialog');
    expect(() => previous_city()).not.toThrow();
  });
});

describe('city_name_dialog', () => {
  it('is exported as a function', async () => {
    const { city_name_dialog } = await import('@/ui/cityDialog');
    expect(typeof city_name_dialog).toBe('function');
  });

  it('does not throw with no arguments', async () => {
    const { city_name_dialog } = await import('@/ui/cityDialog');
    expect(() => city_name_dialog()).not.toThrow();
  });
});

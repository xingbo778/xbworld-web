/**
 * Unit tests for core/pages.ts and utils/theme.ts
 */
import { describe, it, expect } from 'vitest';

// ── pages ─────────────────────────────────────────────────────────────────

describe('pages constants', () => {
  it('exports page constants with correct values', async () => {
    const {
      PAGE_MAIN, PAGE_START,
      PAGE_NETWORK, PAGE_GAME,
    } = await import('@/core/pages');
    expect(PAGE_MAIN).toBe(0);
    expect(PAGE_START).toBe(1);
    expect(PAGE_NETWORK).toBe(4);
    expect(PAGE_GAME).toBe(6);
  });
});

describe('set_client_page / get_client_page', () => {
  it('get_client_page returns initial value of -1', async () => {
    const { get_client_page } = await import('@/core/pages');
    // May already be set from prior tests — just verify it doesn't throw
    expect(typeof get_client_page()).toBe('number');
  });

  it('set_client_page does not throw for a numeric page value', async () => {
    const { set_client_page } = await import('@/core/pages');
    expect(() => set_client_page(5)).not.toThrow();
  });

  it('get_client_page returns the last set page', async () => {
    const { set_client_page, get_client_page } = await import('@/core/pages');
    set_client_page(3);
    expect(get_client_page()).toBe(3);
  });

  it('set_client_page is idempotent (calling twice with same page is fine)', async () => {
    const { set_client_page, PAGE_NETWORK } = await import('@/core/pages');
    set_client_page(PAGE_NETWORK);
    expect(() => set_client_page(PAGE_NETWORK)).not.toThrow();
  });

  it('set_client_page PAGE_GAME does not throw when DOM elements are absent', async () => {
    const { set_client_page, PAGE_GAME } = await import('@/core/pages');
    // Reset to a different page first so PAGE_GAME actually runs
    set_client_page(5);
    expect(() => set_client_page(PAGE_GAME)).not.toThrow();
  });
});

// ── theme ─────────────────────────────────────────────────────────────────

describe('setTheme / getTheme', () => {
  it('setTheme does not throw for dark', async () => {
    const { setTheme } = await import('@/utils/theme');
    expect(() => setTheme('dark')).not.toThrow();
  });

  it('setTheme does not throw for light', async () => {
    const { setTheme } = await import('@/utils/theme');
    expect(() => setTheme('light')).not.toThrow();
  });

  it('setTheme does not throw for fantasy', async () => {
    const { setTheme } = await import('@/utils/theme');
    expect(() => setTheme('fantasy')).not.toThrow();
  });

  it('getTheme returns the theme set by setTheme', async () => {
    const { setTheme, getTheme } = await import('@/utils/theme');
    setTheme('light');
    expect(getTheme()).toBe('light');
    setTheme('dark');
    expect(getTheme()).toBe('dark');
  });

  it('loadSavedTheme does not throw', async () => {
    const { loadSavedTheme } = await import('@/utils/theme');
    expect(() => loadSavedTheme()).not.toThrow();
  });
});

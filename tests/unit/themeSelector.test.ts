/**
 * Tests for ThemeSelector Preact component and theme utility.
 */
import { describe, it, expect, beforeEach } from 'vitest';

describe('ThemeSelector module', () => {
  it('exports ThemeSelector and mountThemeSelector as functions', async () => {
    const { ThemeSelector, mountThemeSelector } = await import('@/components/ThemeSelector');
    expect(typeof ThemeSelector).toBe('function');
    expect(typeof mountThemeSelector).toBe('function');
  });

  it('mountThemeSelector mounts into a container without throwing', async () => {
    const { mountThemeSelector } = await import('@/components/ThemeSelector');
    const container = document.createElement('div');
    document.body.appendChild(container);
    expect(() => mountThemeSelector(container)).not.toThrow();
    document.body.removeChild(container);
  });
});

describe('theme utility', () => {
  beforeEach(async () => {
    // Reset to default theme
    const { setTheme } = await import('@/utils/theme');
    setTheme('dark');
  });

  it('getTheme returns a string', async () => {
    const { getTheme } = await import('@/utils/theme');
    expect(typeof getTheme()).toBe('string');
  });

  it('setTheme changes the current theme', async () => {
    const { setTheme, getTheme } = await import('@/utils/theme');
    setTheme('light');
    expect(getTheme()).toBe('light');
  });

  it('setTheme accepts all valid theme names', async () => {
    const { setTheme, getTheme } = await import('@/utils/theme');
    for (const theme of ['dark', 'light', 'fantasy'] as const) {
      expect(() => setTheme(theme)).not.toThrow();
      expect(getTheme()).toBe(theme);
    }
  });

  it('loadSavedTheme is a function', async () => {
    const { loadSavedTheme } = await import('@/utils/theme');
    expect(typeof loadSavedTheme).toBe('function');
  });
});

describe('options.ts init_theme_selector', () => {
  it('init_theme_selector is a function', async () => {
    const { init_theme_selector } = await import('@/ui/options');
    expect(typeof init_theme_selector).toBe('function');
  });

  it('init_theme_selector does not throw when opt_tab is absent', async () => {
    const { init_theme_selector } = await import('@/ui/options');
    expect(() => init_theme_selector()).not.toThrow();
  });

  it('init_theme_selector mounts into #opt_tab when present', async () => {
    const { init_theme_selector } = await import('@/ui/options');
    const el = document.createElement('div');
    el.id = 'opt_tab';
    document.body.appendChild(el);
    expect(() => init_theme_selector()).not.toThrow();
    document.body.removeChild(el);
  });
});

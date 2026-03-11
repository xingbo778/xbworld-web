/**
 * Tests for ThemeSelector Preact component and theme utility.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, h } from 'preact';

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

describe('ThemeSelector rendering', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('renders a select element with theme options', async () => {
    const { ThemeSelector } = await import('@/components/ThemeSelector');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(ThemeSelector, null), div);
    const select = div.querySelector('select');
    expect(select).not.toBeNull();
    const values = Array.from(select!.options).map(o => o.value);
    expect(values).toContain('dark');
    expect(values).toContain('light');
    expect(values).toContain('fantasy');
    document.body.removeChild(div);
  });

  it('renders "UI Theme:" label', async () => {
    const { ThemeSelector } = await import('@/components/ThemeSelector');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(ThemeSelector, null), div);
    expect(div.textContent).toContain('UI Theme:');
    document.body.removeChild(div);
  });

  it('onChange does not throw when selecting light theme', async () => {
    const { ThemeSelector } = await import('@/components/ThemeSelector');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(ThemeSelector, null), div);
    const select = div.querySelector('select') as HTMLSelectElement;
    select.value = 'light';
    expect(() => select.dispatchEvent(new Event('change', { bubbles: true }))).not.toThrow();
    document.body.removeChild(div);
  });
});

/**
 * Theme switcher — Phase 5 CSS theme system.
 *
 * Usage:
 *   setTheme('dark')    // default game theme
 *   setTheme('light')   // light mode
 *   setTheme('fantasy') // fantasy mode
 *   getTheme()          // returns current theme name
 */

import { setWindowValue } from './windowBridge';

export type ThemeName = 'dark' | 'light' | 'fantasy';

const STORAGE_KEY = 'xbw-theme';

export function setTheme(name: ThemeName): void {
  document.documentElement.dataset['theme'] = name;
  try { localStorage.setItem(STORAGE_KEY, name); } catch { /* ignore */ }
}

export function getTheme(): ThemeName {
  return (document.documentElement.dataset['theme'] as ThemeName) ?? 'dark';
}

export function loadSavedTheme(): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (saved && ['dark', 'light', 'fantasy'].includes(saved)) {
      setTheme(saved);
      return;
    }
    // Fall back to system preference if no saved theme
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
    // Default is dark (defined in :root) — no setTheme needed
  } catch { /* ignore */ }
}

// Expose on window for console use
setWindowValue('setTheme', setTheme);
setWindowValue('getTheme', getTheme);

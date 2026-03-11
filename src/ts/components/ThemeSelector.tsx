/**
 * ThemeSelector — Preact component for the UI theme dropdown in the options panel.
 * Replaces the DOM-based init_theme_selector() in ui/options.ts.
 */
import { useState } from 'preact/hooks';
import { setTheme, getTheme, type ThemeName } from '../utils/theme';
import { render } from 'preact';

export function ThemeSelector() {
  const [current, setCurrent] = useState<ThemeName>(getTheme);

  function handleChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value as ThemeName;
    setTheme(val);
    setCurrent(val);
  }

  return (
    <div style={{ margin: '12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label style={{
        color: 'var(--xb-text-secondary, #8b949e)',
        fontSize: '13px',
        minWidth: '70px',
      }}>
        UI Theme:
      </label>
      <select
        value={current}
        onChange={handleChange}
        style={{
          background: 'var(--xb-bg-elevated, #21262d)',
          color: 'var(--xb-text-primary, #e6edf3)',
          border: '1px solid var(--xb-border-default, #30363d)',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '13px',
        }}
      >
        <option value="dark">Dark (default)</option>
        <option value="light">Light</option>
        <option value="fantasy">Fantasy</option>
      </select>
    </div>
  );
}

/** Mount (or re-mount) the ThemeSelector into a DOM container, idempotent. */
export function mountThemeSelector(container: HTMLElement): void {
  render(<ThemeSelector />, container);
}

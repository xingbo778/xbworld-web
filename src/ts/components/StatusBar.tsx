/**
 * StatusBar — Preact HUD showing game turn, year, connection status, and theme switcher.
 */
import { useState } from 'preact/hooks';
import { currentTurn, currentYear, playerCount, cityCount, unitCount, isObserver } from '../data/signals';
import { setTheme, getTheme, type ThemeName } from '../utils/theme';

function ThemeSelect() {
  const [current, setCurrent] = useState<ThemeName>(getTheme);

  function handleChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value as ThemeName;
    setTheme(val);
    setCurrent(val);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      title="UI Theme"
      style={{
        marginLeft: 'auto',
        background: 'var(--xb-bg-elevated, #21262d)',
        color: 'var(--xb-text-secondary, #8b949e)',
        border: '1px solid var(--xb-border-default, #30363d)',
        borderRadius: '3px',
        padding: '1px 4px',
        fontSize: 'var(--xb-font-size-xs, 11px)',
        cursor: 'pointer',
      }}
    >
      <option value="dark">Dark</option>
      <option value="light">Light</option>
      <option value="fantasy">Fantasy</option>
    </select>
  );
}

export function StatusBar() {
  const turn = currentTurn.value;
  const year = currentYear.value;
  const players = playerCount.value;
  const cities = cityCount.value;
  const units = unitCount.value;
  const observer = isObserver.value;

  if (turn === 0 && !observer) return null;

  return (
    <div
      id="xb-status-bar"
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        padding: '2px 10px',
        background: 'var(--xb-bg-secondary, #161b22)',
        borderTop: '1px solid var(--xb-border-default, #30363d)',
        fontSize: 'var(--xb-font-size-xs, 11px)',
        color: 'var(--xb-text-secondary, #8b949e)',
        userSelect: 'none',
      }}
    >
      {observer && (
        <span style={{ color: 'var(--xb-accent-blue, #58a6ff)', fontWeight: 600 }}>OBSERVER</span>
      )}
      {year && <span>Year: {year}</span>}
      {turn > 0 && <span>Turn: {turn}</span>}
      <span>{players} players</span>
      <span>{cities} cities</span>
      <span>{units} units</span>
      <ThemeSelect />
    </div>
  );
}

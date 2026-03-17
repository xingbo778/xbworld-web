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
      class="xb-theme-select"
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
    <div id="xb-status-bar" class="xb-status-bar">
      {observer && (
        <span class="xb-status-bar-observer">OBSERVER</span>
      )}
      {year && <span>Year: {year}</span>}
      {turn > 0 && <span>Turn: {turn}</span>}
      <span>{players} players</span>
      <span>{cities} cities</span>
      <span>{units} units</span>
      <ThemeSelect />
      <button
        class="xb-status-bar-admin-btn"
        title="Open Admin Dashboard"
        onClick={() => window.open('http://localhost:8081/admin/', '_blank', 'width=1400,height=900')}
      >
        &#9881;
      </button>
    </div>
  );
}

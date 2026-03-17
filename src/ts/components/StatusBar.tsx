/**
 * StatusBar — Game HUD with three sections:
 *   Left:   Logo + OBSERVER badge
 *   Center: Stat chips (year/turn, nations, cities, units)
 *   Right:  Theme selector + admin button
 */
import { useState } from 'preact/hooks';
import { currentTurn, currentYear, playerCount, cityCount, unitCount, isObserver } from '../data/signals';
import { setTheme, getTheme, type ThemeName } from '../utils/theme';
import { adminPanelOpen } from './AdminDashboard';

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
      class="xb-hud-theme-select"
    >
      <option value="dark">🌙 Dark</option>
      <option value="light">☀️ Light</option>
      <option value="fantasy">✨ Fantasy</option>
    </select>
  );
}

interface StatChipProps {
  icon: string;
  value: string | number;
  label: string;
  title?: string;
  accent?: boolean;
}

function StatChip({ icon, value, label, title, accent }: StatChipProps) {
  return (
    <div class={`xb-hud-chip${accent ? ' xb-hud-chip-accent' : ''}`} title={title}>
      <span class="xb-hud-chip-icon">{icon}</span>
      <span class="xb-hud-chip-value">{value}</span>
      <span class="xb-hud-chip-label">{label}</span>
    </div>
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

      {/* ── Left: branding + observer badge ── */}
      <div class="xb-hud-left">
        <span class="xb-hud-logo">XBWorld</span>
        {observer && (
          <span class="xb-hud-observer-badge">OBSERVER</span>
        )}
      </div>

      {/* ── Center: live game stats ── */}
      <div class="xb-hud-center">
        {year && turn > 0 && (
          <StatChip
            icon="📅"
            value={year}
            label={`T${turn}`}
            title={`Year ${year} — Turn ${turn}`}
            accent
          />
        )}
        <div class="xb-hud-divider" />
        <StatChip icon="👥" value={players} label="nations" title={`${players} civilizations`} />
        <StatChip icon="🏙" value={cities} label="cities" title={`${cities} cities total`} />
        <StatChip icon="⚔" value={units} label="units" title={`${units} units on map`} />
      </div>

      {/* ── Right: controls ── */}
      <div class="xb-hud-right">
        <ThemeSelect />
        <button
          class="xb-hud-icon-btn"
          title="Admin Dashboard"
          onClick={() => { adminPanelOpen.value = true; }}
        >
          ⚙
        </button>
      </div>

    </div>
  );
}

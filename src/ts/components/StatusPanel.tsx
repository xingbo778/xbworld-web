/**
 * StatusPanel — Preact component replacing the HTML-string-based
 * update_game_status_panel() in data/game.ts.
 *
 * Mounted once into #game_status_panel_top and #game_status_panel_bottom.
 * Signal subscriptions drive automatic re-renders with no circular imports
 * (does not import from data/game.ts — stats are computed locally from store).
 */
import { render } from 'preact';
import { effect } from '@preact/signals';
import {
  isObserver, connectedPlayer, gameInfo, playerUpdated, rulesetReady,
  statusRefresh, settingsUpdated, connectionBanner, statusPanelLayout,
} from '../data/signals';
import { store } from '../data/store';
import { clientPlaying } from '../client/clientState';
import { isSmallScreen, numberWithCommas } from '../utils/helpers';
import { cityPopulation } from '../data/city';

// Re-export so callers that used the old location still work.
export { statusRefresh } from '../data/signals';

// ---------------------------------------------------------------------------
// Reactive layout effect — applies top/bottom container visibility whenever
// statusPanelLayout changes (set by update_game_status_panel in data/game.ts).
// Runs once at module load; Preact signals track future changes automatically.
// ---------------------------------------------------------------------------
effect(() => {
  const layout = statusPanelLayout.value;
  const panelTop = document.getElementById('game_status_panel_top');
  const panelBottom = document.getElementById('game_status_panel_bottom');
  if (!panelTop && !panelBottom) return; // not yet in DOM (pre-game)
  if (panelTop) panelTop.style.display = layout === 'top' ? '' : 'none';
  if (panelBottom) {
    panelBottom.style.display = layout === 'bottom' ? '' : 'none';
    if (layout === 'bottom') panelBottom.style.width = window.innerWidth + 'px';
  }
});

// ---------------------------------------------------------------------------
// Pure helpers (previously in data/game.ts — inlined here to avoid circular dep)
// ---------------------------------------------------------------------------

function civPopulation(playerno: number): string {
  let population = 0;
  for (const city_id in store.cities) {
    const pcity = store.cities[city_id];
    if (playerno === (pcity['owner'] as number)) {
      population += cityPopulation(pcity);
    }
  }
  return numberWithCommas(population * 1000);
}

function getYearString(): string {
  const gi = store.gameInfo;
  if (!gi) return '';
  const cal = store.calendarInfo;
  let s = '';
  const year = gi['year'] as number;
  if (year < 0) {
    s = Math.abs(year) + String(cal?.['negative_year_label'] ?? 'BC') + ' ';
  } else {
    s = year + String(cal?.['positive_year_label'] ?? 'AD') + ' ';
  }
  s += isSmallScreen() ? '(T:' + String(gi['turn']) + ')' : '(Turn:' + String(gi['turn']) + ')';
  return s;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ConnectionBannerEl() {
  const banner = connectionBanner.value;
  if (!banner) return null;
  return (
    <span class="xb-connection-banner">
      {banner.text}
      {banner.showReload && (
        <button
          onClick={() => location.reload()}
          class="xb-connection-banner-reload"
        >Reload page</button>
      )}
    </span>
  );
}

export function StatusPanelContent() {
  // Subscribe to every signal that can affect the display.
  void playerUpdated.value;
  void rulesetReady.value;
  const gi = gameInfo.value;
  void isObserver.value;
  void connectedPlayer.value;
  void statusRefresh.value;
  void settingsUpdated.value;
  void connectionBanner.value;

  const pplayer = clientPlaying();
  const small = isSmallScreen();

  if (pplayer != null) {
    const tax = Number(pplayer['tax']);
    const lux = Number(pplayer['luxury']);
    const sci = Number(pplayer['science']);
    const netIncome = Number(pplayer['expected_income'] ?? 0);
    const safeIncome = isNaN(netIncome) ? 0 : netIncome;
    const netStr = safeIncome > 0 ? '+' + safeIncome : String(safeIncome);
    const adjective = String(store.nations[pplayer['nation']]?.['adjective'] ?? '');

    return (
      <div class="xb-sp-row">
        <ConnectionBannerEl />
        {!small && adjective && (
          <span class="xb-sp-chip xb-sp-chip-nation" title="Your civilization">
            <span class="xb-sp-icon">🏛</span>
            <span class="xb-sp-val">{adjective}</span>
            <span class="xb-sp-sub">{civPopulation(pplayer.playerno)}</span>
          </span>
        )}
        {!small && gi && (
          <span class="xb-sp-chip" title="Current year and turn">
            <span class="xb-sp-icon">📅</span>
            <span class="xb-sp-val">{getYearString()}</span>
          </span>
        )}
        <span class="xb-sp-divider" />
        <span
          class={`xb-sp-chip${safeIncome < 0 ? ' xb-sp-chip-danger' : ''}`}
          title="Gold treasury (net income per turn)"
        >
          <span class="xb-sp-icon">💰</span>
          <span class="xb-sp-val">{String(pplayer['gold'])}</span>
          <span class={`xb-sp-sub${safeIncome < 0 ? ' xb-sp-neg' : ' xb-sp-pos'}`}>({netStr})</span>
        </span>
        <span
          class="xb-sp-chip xb-sp-taxbar"
          data-action="show-tax-rates"
          title="Tax / Luxury / Science rates — click to change"
        >
          <span class="xb-sp-rate" title="Tax">📊 <b>{tax}%</b></span>
          <span class="xb-sp-rate" title="Luxury">🎵 <b>{lux}%</b></span>
          <span class="xb-sp-rate" title="Science">🧪 <b>{sci}%</b></span>
        </span>
      </div>
    );
  }

  if (store.observing || clientPlaying() == null) {
    const meta = store.serverSettings?.['metamessage']?.['val'];
    return (
      <div class="xb-sp-row">
        <ConnectionBannerEl />
        {meta && <span class="xb-sp-meta">{String(meta)}</span>}
        {gi && (
          <span class="xb-sp-chip xb-sp-chip-observer" title="Observing game">
            <span class="xb-sp-icon">👁</span>
            <span class="xb-sp-val">{getYearString()}</span>
            <span class="xb-sp-sub">Observing</span>
          </span>
        )}
      </div>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Mount helpers
// ---------------------------------------------------------------------------

let _mountedTop = false;
let _mountedBottom = false;

export function mountStatusPanel(): void {
  const top = document.getElementById('game_status_panel_top');
  const bottom = document.getElementById('game_status_panel_bottom');
  if (top && !_mountedTop) {
    render(<StatusPanelContent />, top);
    _mountedTop = true;
  }
  if (bottom && !_mountedBottom) {
    render(<StatusPanelContent />, bottom);
    _mountedBottom = true;
  }
}

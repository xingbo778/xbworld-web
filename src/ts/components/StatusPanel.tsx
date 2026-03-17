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
    const netIncome = Number(pplayer['expected_income']);
    const netStr = netIncome > 0 ? '+' + netIncome : String(netIncome);
    const adjective = String(store.nations[pplayer['nation']]?.['adjective'] ?? '');

    return (
      <>
        <ConnectionBannerEl />
        {!small && adjective && (
          <><b>{adjective}</b>{'\u00a0\u00a0 '}
          <span title="Population">{'👤'}</span>{': '}
          <b>{civPopulation(pplayer.playerno)}</b>{'\u00a0\u00a0 '}</>
        )}
        {!small && gi && (
          <><span title="Year (turn)">{'🕐'}</span>{': '}
          <b>{getYearString()}</b>{'\u00a0\u00a0 '}</>
        )}
        <span title="Gold (net income)">{'💰'}</span>{': '}
        <b
          class={netIncome < 0 ? 'negative_net_income' : undefined}
          title="Gold (net income)"
        >
          {String(pplayer['gold'])} ({netStr})
        </b>
        {'\u00a0\u00a0 '}
        <span class="xb-status-panel-taxrates" data-action="show-tax-rates">
          <span title="Tax rate">{'📊'}</span>{': '}<b>{tax}</b>{'% '}
          <span title="Luxury rate">{'🎵'}</span>{': '}<b>{lux}</b>{'% '}
          <span title="Science rate">{'🧪'}</span>{': '}<b>{sci}</b>{'%'}
        </span>
      </>
    );
  }

  if (store.observing || clientPlaying() == null) {
    const meta = store.serverSettings?.['metamessage']?.['val'];
    return (
      <>
        <ConnectionBannerEl />
        {meta && <>{String(meta)}{' \u2014 '}</>}
        {gi && !small && (
          <><span title="Year (turn)">{'🕐'}</span>{': '}
          <b>{getYearString()}</b>{'\u00a0\u00a0 '}</>
        )}
        {gi && small && <><b>{getYearString()}</b>{' '}</>}
        {gi && 'Observing'}
      </>
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

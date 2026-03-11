/**
 * StatusPanel — Preact component replacing the HTML-string-based
 * update_game_status_panel() in data/game.ts.
 *
 * Mounted once into #game_status_panel_top and #game_status_panel_bottom;
 * signal subscriptions drive automatic re-renders.
 * The show/hide + page-title logic stays in update_game_status_panel().
 */
import { signal } from '@preact/signals';
import { render } from 'preact';
import {
  isObserver, connectedPlayer, gameInfo, playerUpdated, rulesetReady,
} from '../data/signals';
import { store } from '../data/store';
import { clientPlaying } from '../client/clientState';
import { isSmallScreen } from '../utils/helpers';
import { civ_population, get_year_string } from '../data/game';

/** Bump to force a re-render (e.g. after tax-rate change). */
export const statusRefresh = signal(0);

function StatusPanelContent() {
  // Subscribe to every signal that can affect the display.
  void playerUpdated.value;
  void rulesetReady.value;
  const gi = gameInfo.value;
  void isObserver.value;
  void connectedPlayer.value;
  void statusRefresh.value;

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
        {!small && adjective && (
          <><b>{adjective}</b>{'\u00a0\u00a0 '}<span title="Population">{'👤'}</span>{': '}
          <b>{civ_population(pplayer.playerno)}</b>{'\u00a0\u00a0 '}</>
        )}
        {!small && gi && (
          <><span title="Year (turn)">{'🕐'}</span>{': '}
          <b>{get_year_string()}</b>{'\u00a0\u00a0 '}</>
        )}
        <span title="Gold (net income)">{'💰'}</span>{': '}
        <b
          class={netIncome < 0 ? 'negative_net_income' : undefined}
          title="Gold (net income)"
        >
          {String(pplayer['gold'])} ({netStr})
        </b>
        {'\u00a0\u00a0 '}
        <span style="cursor:pointer;" data-action="show-tax-rates">
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
        {meta && <>{String(meta)}{' \u2014 '}</>}
        {gi && !small && (
          <><span title="Year (turn)">{'🕐'}</span>{': '}
          <b>{get_year_string()}</b>{'\u00a0\u00a0 '}</>
        )}
        {gi && small && <><b>{get_year_string()}</b>{' '}</>}
        {gi && 'Observing'}
      </>
    );
  }

  return null;
}

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

/**
 * Tests for StatusPanel Preact component (src/ts/components/StatusPanel.tsx).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, h } from 'preact';
import { store } from '@/data/store';

describe('StatusPanel module exports', () => {
  it('exports mountStatusPanel as a function', async () => {
    const { mountStatusPanel } = await import('@/components/StatusPanel');
    expect(typeof mountStatusPanel).toBe('function');
  });

  it('exports statusRefresh as a signal with initial value 0', async () => {
    const { statusRefresh } = await import('@/components/StatusPanel');
    expect(statusRefresh.value).toBe(0);
  });

  it('statusRefresh increments without throwing', async () => {
    const { statusRefresh } = await import('@/components/StatusPanel');
    const before = statusRefresh.value;
    expect(() => { statusRefresh.value++; }).not.toThrow();
    expect(statusRefresh.value).toBe(before + 1);
  });
});

describe('mountStatusPanel', () => {
  it('mounts into a top panel element without error', async () => {
    const { mountStatusPanel } = await import('@/components/StatusPanel');
    const top = document.createElement('div');
    top.id = 'game_status_panel_top';
    document.body.appendChild(top);
    expect(() => mountStatusPanel()).not.toThrow();
    document.body.removeChild(top);
  });

  it('handles missing panel elements gracefully', async () => {
    // Ensure no panel elements in DOM
    const { mountStatusPanel } = await import('@/components/StatusPanel');
    expect(() => mountStatusPanel()).not.toThrow();
  });
});

describe('statusPanelLayout effect — reactive container visibility', () => {
  it('toggles panel visibility as layout signal switches top↔bottom', async () => {
    const { statusPanelLayout } = await import('@/data/signals');

    const top = document.createElement('div');
    top.id = 'game_status_panel_top';
    const bottom = document.createElement('div');
    bottom.id = 'game_status_panel_bottom';
    document.body.appendChild(top);
    document.body.appendChild(bottom);

    // Force 'bottom' first (effect runs synchronously on signal write)
    statusPanelLayout.value = 'bottom';
    expect(top.style.display).toBe('none');
    expect(bottom.style.display).toBe('');

    // Then flip to 'top'
    statusPanelLayout.value = 'top';
    expect(top.style.display).toBe('');
    expect(bottom.style.display).toBe('none');

    // Reset to avoid side-effects on other tests
    statusPanelLayout.value = 'top';
    document.body.removeChild(top);
    document.body.removeChild(bottom);
  });
});

// ── StatusPanelContent rendering ────────────────────────────────────────────

describe('StatusPanelContent — observer mode rendering', () => {
  beforeEach(() => {
    store.reset();
  });

  it('renders "Observing" text in observer mode with game info', async () => {
    const { StatusPanelContent } = await import('@/components/StatusPanel');
    const { gameInfo, isObserver } = await import('@/data/signals');

    store.observing = true;
    store.gameInfo = { turn: 10, year: 100 } as never;
    store.calendarInfo = { positive_year_label: 'AD', negative_year_label: 'BC' } as never;
    gameInfo.value = store.gameInfo;
    isObserver.value = true;

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(StatusPanelContent, null), container);
    expect(container.textContent).toContain('Observing');
    document.body.removeChild(container);
  });

  it('renders nothing when not observing and no player connected', async () => {
    const { StatusPanelContent } = await import('@/components/StatusPanel');
    const { gameInfo, isObserver } = await import('@/data/signals');

    store.observing = false;
    store.client.conn.playing = null;
    gameInfo.value = null as never;
    isObserver.value = false;

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(StatusPanelContent, null), container);
    // Should render null (no content)
    expect(container.innerHTML).toBe('');
    document.body.removeChild(container);
  });

  it('renders player gold and tax rates when playing', async () => {
    const { StatusPanelContent } = await import('@/components/StatusPanel');
    const { gameInfo, isObserver, playerUpdated } = await import('@/data/signals');

    const mockPlayer = {
      playerno: 0,
      gold: 250,
      tax: 30,
      luxury: 10,
      science: 60,
      expected_income: 12,
      nation: 0,
    };
    store.client.conn.playing = mockPlayer as never;
    store.observing = false;
    store.gameInfo = { turn: 5, year: 200 } as never;
    gameInfo.value = store.gameInfo;
    isObserver.value = false;
    playerUpdated.value++;

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(StatusPanelContent, null), container);
    expect(container.textContent).toContain('250');  // gold
    expect(container.textContent).toContain('30');   // tax
    expect(container.textContent).toContain('10');   // luxury
    expect(container.textContent).toContain('60');   // science
    document.body.removeChild(container);
  });

  it('connectionBanner text appears in StatusPanelContent', async () => {
    const { StatusPanelContent } = await import('@/components/StatusPanel');
    const { connectionBanner } = await import('@/data/signals');

    store.observing = true;
    connectionBanner.value = { text: 'Reconnecting...', showReload: false };

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(StatusPanelContent, null), container);
    expect(container.textContent).toContain('Reconnecting...');

    connectionBanner.value = null; // cleanup
    document.body.removeChild(container);
  });

  it('connectionBanner with showReload renders Reload page button', async () => {
    const { StatusPanelContent } = await import('@/components/StatusPanel');
    const { connectionBanner } = await import('@/data/signals');

    store.observing = true;
    connectionBanner.value = { text: 'Connection lost', showReload: true };

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(StatusPanelContent, null), container);
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.some(b => b.textContent?.includes('Reload page'))).toBe(true);

    connectionBanner.value = null; // cleanup
    document.body.removeChild(container);
  });
});

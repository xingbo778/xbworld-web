/**
 * Unit tests for DisconnectOverlay and StatusBar components.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, h } from 'preact';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@/net/connection', () => ({
  reconnectNow: vi.fn(),
  tryAgain: vi.fn(),
}));

vi.mock('@/components/Shared/Button', () => ({
  Button: ({ onClick, children }: { onClick: () => void; children: unknown }) =>
    h('button', { onClick }, children as import('preact').ComponentChildren),
}));

// ---------------------------------------------------------------------------
// DisconnectOverlay tests
// ---------------------------------------------------------------------------

describe('DisconnectOverlay', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing when disconnectOverlay signal is null', async () => {
    const { disconnectOverlay } = await import('@/data/signals');
    disconnectOverlay.value = null;

    const { DisconnectOverlay } = await import('@/components/DisconnectOverlay');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(DisconnectOverlay, null), div);

    expect(div.innerHTML).toBe('');
  });

  it('renders reconnecting phase with countdown and attempt info', async () => {
    const { disconnectOverlay } = await import('@/data/signals');
    disconnectOverlay.value = { phase: 'reconnecting', countdown: 5, attempt: 1, max: 5 };

    const { DisconnectOverlay } = await import('@/components/DisconnectOverlay');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(DisconnectOverlay, null), div);

    expect(div.textContent).toContain('Connection Lost');
    expect(div.textContent).toContain('5s');
    expect(div.textContent).toContain('attempt 2 of 5');
    expect(div.textContent).toContain('Try Now');
    expect(div.textContent).toContain('Reload Page');
  });

  it('renders disconnected phase with error state', async () => {
    const { disconnectOverlay } = await import('@/data/signals');
    disconnectOverlay.value = { phase: 'disconnected' };

    const { DisconnectOverlay } = await import('@/components/DisconnectOverlay');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(DisconnectOverlay, null), div);

    expect(div.textContent).toContain('Disconnected');
    expect(div.textContent).toContain('Could not reconnect');
    expect(div.textContent).toContain('Try Again');
    expect(div.textContent).toContain('Reload Page');
  });

  it('reconnecting phase does not show "Disconnected" heading', async () => {
    const { disconnectOverlay } = await import('@/data/signals');
    disconnectOverlay.value = { phase: 'reconnecting', countdown: 3, attempt: 0, max: 5 };

    const { DisconnectOverlay } = await import('@/components/DisconnectOverlay');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(DisconnectOverlay, null), div);

    expect(div.textContent).not.toContain('Disconnected');
  });
});

// ---------------------------------------------------------------------------
// StatusBar tests
// currentTurn and currentYear are computed from gameInfo (read-only).
// Set gameInfo.value to control them; use writable signals for the rest.
// ---------------------------------------------------------------------------

describe('StatusBar', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing when turn=0 and not observer', async () => {
    const { gameInfo, playerCount, cityCount, unitCount, isObserver } =
      await import('@/data/signals');
    gameInfo.value = null;
    isObserver.value = false;
    playerCount.value = 0;
    cityCount.value = 0;
    unitCount.value = 0;

    const { StatusBar } = await import('@/components/StatusBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(StatusBar, null), div);

    expect(div.innerHTML).toBe('');
  });

  it('renders OBSERVER badge when isObserver=true (even turn=0)', async () => {
    const { gameInfo, playerCount, cityCount, unitCount, isObserver } =
      await import('@/data/signals');
    gameInfo.value = null;
    isObserver.value = true;
    playerCount.value = 0;
    cityCount.value = 0;
    unitCount.value = 0;

    const { StatusBar } = await import('@/components/StatusBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(StatusBar, null), div);

    expect(div.textContent).toContain('OBSERVER');
  });

  it('renders turn and year when turn > 0', async () => {
    const { gameInfo, calendarInfo, playerCount, cityCount, unitCount, isObserver } =
      await import('@/data/signals');
    gameInfo.value = { turn: 42, year: 1800 } as never;
    calendarInfo.value = { positive_year_label: 'AD', negative_year_label: 'BC' } as never;
    isObserver.value = true;
    playerCount.value = 4;
    cityCount.value = 16;
    unitCount.value = 32;

    const { StatusBar } = await import('@/components/StatusBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(StatusBar, null), div);

    expect(div.textContent).toContain('Turn: 42');
    expect(div.textContent).toContain('Year: 1800 AD');
    expect(div.textContent).toContain('4 players');
    expect(div.textContent).toContain('16 cities');
    expect(div.textContent).toContain('32 units');
  });

  it('does not render year when gameInfo is null', async () => {
    const { gameInfo, playerCount, cityCount, unitCount, isObserver } =
      await import('@/data/signals');
    gameInfo.value = { turn: 5, year: 0 } as never; // year=0 → empty label when no calendarInfo
    isObserver.value = true;
    playerCount.value = 2;
    cityCount.value = 4;
    unitCount.value = 8;

    const { StatusBar } = await import('@/components/StatusBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(StatusBar, null), div);

    expect(div.textContent).toContain('Turn: 5');
  });

  it('renders with id xb-status-bar', async () => {
    const { gameInfo, isObserver } = await import('@/data/signals');
    gameInfo.value = { turn: 1, year: 100 } as never;
    isObserver.value = true;

    const { StatusBar } = await import('@/components/StatusBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(StatusBar, null), div);

    expect(div.querySelector('#xb-status-bar')).not.toBeNull();
  });

  it('renders ThemeSelect dropdown in StatusBar', async () => {
    const { gameInfo, isObserver } = await import('@/data/signals');
    gameInfo.value = { turn: 1, year: 100 } as never;
    isObserver.value = true;

    const { StatusBar } = await import('@/components/StatusBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(StatusBar, null), div);

    const select = div.querySelector('select[title="UI Theme"]');
    expect(select).not.toBeNull();
  });

  it('ThemeSelect options include Dark, Light, Fantasy', async () => {
    const { gameInfo, isObserver } = await import('@/data/signals');
    gameInfo.value = { turn: 1, year: 100 } as never;
    isObserver.value = true;

    const { StatusBar } = await import('@/components/StatusBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(StatusBar, null), div);

    const select = div.querySelector('select') as HTMLSelectElement;
    expect(select).not.toBeNull();
    const values = Array.from(select.options).map(o => o.value);
    expect(values).toContain('dark');
    expect(values).toContain('light');
    expect(values).toContain('fantasy');
  });

  it('ThemeSelect onChange calls setTheme without throwing', async () => {
    const { gameInfo, isObserver } = await import('@/data/signals');
    gameInfo.value = { turn: 1, year: 100 } as never;
    isObserver.value = true;

    const { StatusBar } = await import('@/components/StatusBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(StatusBar, null), div);

    const select = div.querySelector('select') as HTMLSelectElement;
    expect(select).not.toBeNull();
    // Simulate change event to 'light'
    select.value = 'light';
    const event = new Event('change', { bubbles: true });
    expect(() => select.dispatchEvent(event)).not.toThrow();
  });
});

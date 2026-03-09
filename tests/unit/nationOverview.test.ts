/**
 * Tests for NationOverview component logic (signal updates, mount/refresh API).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { store } from '@/data/store';

describe('NationOverview — refreshNationOverview', () => {
  beforeEach(() => {
    store.reset();
  });

  it('can be called without error', async () => {
    const { refreshNationOverview } = await import('@/components/NationOverview');
    expect(() => refreshNationOverview()).not.toThrow();
  });

  it('incrementing the tick multiple times does not throw', async () => {
    const { refreshNationOverview } = await import('@/components/NationOverview');
    for (let i = 0; i < 5; i++) {
      refreshNationOverview();
    }
  });
});

describe('NationOverview — mountNationOverview', () => {
  beforeEach(() => {
    store.reset();
    document.body.innerHTML = '';
  });

  it('renders into a container element without throwing', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    const container = document.createElement('div');
    document.body.appendChild(container);
    expect(() => mountNationOverview(container)).not.toThrow();
  });

  it('shows "No players connected" message when store.players is empty', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    const container = document.createElement('div');
    document.body.appendChild(container);
    mountNationOverview(container);
    expect(container.textContent).toContain('No players connected');
  });

  it('renders player rows when players exist', async () => {
    const { mountNationOverview, refreshNationOverview } = await import('@/components/NationOverview');

    store.players[0] = {
      playerno: 0,
      name: 'Caesar',
      nation: 1,
      is_alive: true,
      score: 120,
      gold: 50,
      phase_done: false,
      nturns_idle: 0,
      flags: { isSet: vi.fn().mockReturnValue(false) },
    } as never;
    store.nations[1] = { color: '#ff0000', adjective: 'Roman', legend: '', graphic_str: '' } as never;

    const container = document.createElement('div');
    document.body.appendChild(container);
    mountNationOverview(container);
    refreshNationOverview();

    // After refresh, player name should appear
    expect(container.textContent).toContain('Caesar');
  });
});

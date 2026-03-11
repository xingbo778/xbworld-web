/**
 * Tests for NationOverview component logic (signal updates, mount/refresh API,
 * and the Nations / Cities / Units sub-tab switching introduced to satisfy the
 * usability-full step-06 requirement).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { store } from '@/data/store';

// ── helpers ──────────────────────────────────────────────────────────────────

function makePlayer(playerno: number, name: string) {
  return {
    playerno, name, nation: playerno, is_alive: true,
    score: 100, gold: 50, phase_done: false, nturns_idle: 0,
    flags: { isSet: vi.fn().mockReturnValue(false) },
  } as never;
}

function mountFresh(
  mount: (c: HTMLElement) => void,
  container = document.createElement('div'),
): HTMLElement {
  document.body.appendChild(container);
  mount(container);
  return container;
}

// ── original refresh / mount API ─────────────────────────────────────────────

describe('NationOverview — refreshNationOverview', () => {
  beforeEach(() => { store.reset(); });

  it('can be called without error', async () => {
    const { refreshNationOverview } = await import('@/components/NationOverview');
    expect(() => refreshNationOverview()).not.toThrow();
  });

  it('incrementing the tick multiple times does not throw', async () => {
    const { refreshNationOverview } = await import('@/components/NationOverview');
    for (let i = 0; i < 5; i++) refreshNationOverview();
  });
});

describe('NationOverview — mountNationOverview', () => {
  beforeEach(() => { store.reset(); document.body.innerHTML = ''; });

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

    store.players[0] = makePlayer(0, 'Caesar');
    store.nations[1] = { color: '#ff0000', adjective: 'Roman', legend: '', graphic_str: '' } as never;

    const container = document.createElement('div');
    document.body.appendChild(container);
    mountNationOverview(container);
    refreshNationOverview();

    expect(container.textContent).toContain('Caesar');
  });
});

// ── sub-tab buttons present ───────────────────────────────────────────────────

describe('NationOverview — sub-tab buttons', () => {
  beforeEach(async () => {
    store.reset();
    document.body.innerHTML = '';
    const { setNationOverviewTab } = await import('@/components/NationOverview');
    setNationOverviewTab('nations');
  });

  it('renders Nations tab button', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    const container = mountFresh(mountNationOverview);
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.some(b => b.textContent?.trim() === 'Nations')).toBe(true);
  });

  it('renders Cities tab button', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    const container = mountFresh(mountNationOverview);
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.some(b => b.textContent?.trim() === 'Cities')).toBe(true);
  });

  it('renders Units tab button', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    const container = mountFresh(mountNationOverview);
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.some(b => b.textContent?.trim() === 'Units')).toBe(true);
  });

  it('renders all 3 tab buttons in one mount', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    const container = mountFresh(mountNationOverview);
    const labels = Array.from(container.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(labels).toContain('Nations');
    expect(labels).toContain('Cities');
    expect(labels).toContain('Units');
  });
});

// ── tab switching ─────────────────────────────────────────────────────────────

describe('NationOverview — tab switching', () => {
  beforeEach(async () => {
    store.reset();
    document.body.innerHTML = '';
    const { setNationOverviewTab } = await import('@/components/NationOverview');
    setNationOverviewTab('nations');
  });

  it('default active tab shows Nations content', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    store.players[0] = makePlayer(0, 'Caesar');
    const container = mountFresh(mountNationOverview);
    // Nations tab panel should be visible — contains player name or "No players"
    expect(container.textContent).toContain('Caesar');
  });

  it('setNationOverviewTab("cities") switches to Cities panel', async () => {
    const { mountNationOverview, setNationOverviewTab } = await import('@/components/NationOverview');
    store.cities[1] = { id: 1, name: 'Rome', owner: 0, tile: 0, size: 5 } as never;
    const container = mountFresh(mountNationOverview);

    setNationOverviewTab('cities');
    await Promise.resolve();

    expect(container.textContent).toContain('Rome');
  });

  it('setNationOverviewTab("units") switches to Units panel', async () => {
    const { mountNationOverview, setNationOverviewTab } = await import('@/components/NationOverview');
    store.unitTypes[3] = { id: 3, name: 'Warrior' } as never;
    store.units[10] = { id: 10, owner: 0, tile: 0, type: 3, hp: 10 } as never;
    const container = mountFresh(mountNationOverview);

    setNationOverviewTab('units');
    await Promise.resolve();

    expect(container.textContent).toContain('Warrior');
  });

  it('clicking Cities button switches to Cities panel', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    store.cities[2] = { id: 2, name: 'Athens', owner: 0, tile: 0, size: 3 } as never;
    const container = mountFresh(mountNationOverview);

    const citiesBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent?.trim() === 'Cities',
    ) as HTMLButtonElement;
    expect(citiesBtn).toBeDefined();
    citiesBtn.click();
    await Promise.resolve();

    expect(container.textContent).toContain('Athens');
  });

  it('clicking Units button switches to Units panel', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    store.unitTypes[1] = { id: 1, name: 'Archer' } as never;
    store.units[5] = { id: 5, owner: 0, tile: 0, type: 1, hp: 8 } as never;
    const container = mountFresh(mountNationOverview);

    const unitsBtn = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent?.trim() === 'Units',
    ) as HTMLButtonElement;
    expect(unitsBtn).toBeDefined();
    unitsBtn.click();
    await Promise.resolve();

    expect(container.textContent).toContain('Archer');
  });

  it('switching back to Nations tab shows player data again', async () => {
    const { mountNationOverview, setNationOverviewTab } = await import('@/components/NationOverview');
    store.players[0] = makePlayer(0, 'Alexander');
    const container = mountFresh(mountNationOverview);

    setNationOverviewTab('cities');
    await Promise.resolve();
    setNationOverviewTab('nations');
    await Promise.resolve();

    expect(container.textContent).toContain('Alexander');
  });
});

// ── Cities tab content ────────────────────────────────────────────────────────

describe('NationOverview — Cities tab content', () => {
  beforeEach(async () => {
    store.reset();
    document.body.innerHTML = '';
    const { setNationOverviewTab } = await import('@/components/NationOverview');
    setNationOverviewTab('cities');
  });

  it('shows "No cities known" when store.cities is empty', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    const container = mountFresh(mountNationOverview);
    expect(container.textContent).toContain('No cities known');
  });

  it('shows city name, owner, and size', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    store.players[0] = makePlayer(0, 'Caesar');
    store.cities[1] = { id: 1, name: 'Carthage', owner: 0, tile: 0, size: 7 } as never;
    const container = mountFresh(mountNationOverview);
    expect(container.textContent).toContain('Carthage');
    expect(container.textContent).toContain('Caesar');
    expect(container.textContent).toContain('7');
  });

  it('lists multiple cities', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    store.cities[1] = { id: 1, name: 'Rome',    owner: 0, tile: 0, size: 5 } as never;
    store.cities[2] = { id: 2, name: 'Athens',  owner: 1, tile: 0, size: 3 } as never;
    store.cities[3] = { id: 3, name: 'Babylon', owner: 1, tile: 0, size: 4 } as never;
    const container = mountFresh(mountNationOverview);
    expect(container.textContent).toContain('Rome');
    expect(container.textContent).toContain('Athens');
    expect(container.textContent).toContain('Babylon');
  });
});

// ── Units tab content ─────────────────────────────────────────────────────────

describe('NationOverview — Units tab content', () => {
  beforeEach(async () => {
    store.reset();
    document.body.innerHTML = '';
    const { setNationOverviewTab } = await import('@/components/NationOverview');
    setNationOverviewTab('units');
  });

  it('shows "No units known" when store.units is empty', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    const container = mountFresh(mountNationOverview);
    expect(container.textContent).toContain('No units known');
  });

  it('shows unit type name, owner, and HP', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    store.players[0] = makePlayer(0, 'Hannibal');
    store.unitTypes[2] = { id: 2, name: 'Cavalry' } as never;
    store.units[10] = { id: 10, owner: 0, tile: 0, type: 2, hp: 15 } as never;
    const container = mountFresh(mountNationOverview);
    expect(container.textContent).toContain('Cavalry');
    expect(container.textContent).toContain('Hannibal');
    expect(container.textContent).toContain('15');
  });

  it('falls back to #id when unitType is unknown', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    store.units[7] = { id: 7, owner: 0, tile: 0, type: 99, hp: 5 } as never;
    const container = mountFresh(mountNationOverview);
    expect(container.textContent).toContain('#99');
  });

  it('lists multiple units', async () => {
    const { mountNationOverview } = await import('@/components/NationOverview');
    store.unitTypes[1] = { id: 1, name: 'Spearman' } as never;
    store.unitTypes[2] = { id: 2, name: 'Chariot'  } as never;
    store.units[1] = { id: 1, owner: 0, tile: 0, type: 1, hp: 10 } as never;
    store.units[2] = { id: 2, owner: 1, tile: 0, type: 2, hp: 20 } as never;
    const container = mountFresh(mountNationOverview);
    expect(container.textContent).toContain('Spearman');
    expect(container.textContent).toContain('Chariot');
  });
});

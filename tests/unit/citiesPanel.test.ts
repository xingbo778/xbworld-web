/**
 * Unit tests for components/CitiesPanel.tsx
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, h } from 'preact';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
  document.body.innerHTML = '';
});

describe('CitiesPanel exports', () => {
  it('exports mountCitiesPanel as a function', async () => {
    const { mountCitiesPanel } = await import('@/components/CitiesPanel');
    expect(typeof mountCitiesPanel).toBe('function');
  });

  it('exports CitiesPanel component as a function', async () => {
    const { CitiesPanel } = await import('@/components/CitiesPanel');
    expect(typeof CitiesPanel).toBe('function');
  });
});

describe('CitiesPanel rendering — empty state', () => {
  it('shows "No cities known yet." when store has no cities', async () => {
    const { CitiesPanel } = await import('@/components/CitiesPanel');
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(CitiesPanel, null), container);
    expect(container.textContent).toContain('No cities known yet.');
    document.body.removeChild(container);
  });
});

describe('CitiesPanel rendering — city data', () => {
  it('renders city name and size', async () => {
    const { CitiesPanel } = await import('@/components/CitiesPanel');
    store.cities[1] = { id: 1, name: 'Rome', owner: 0, size: 7, production: null } as never;
    store.players[0] = { playerno: 0, name: 'Caesar', nation: 0 } as never;

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(CitiesPanel, null), container);

    expect(container.textContent).toContain('Rome');
    expect(container.textContent).toContain('7');
    document.body.removeChild(container);
  });

  it('renders city owner name from store.players', async () => {
    const { CitiesPanel } = await import('@/components/CitiesPanel');
    store.cities[1] = { id: 1, name: 'Carthage', owner: 2, size: 5, production: null } as never;
    store.players[2] = { playerno: 2, name: 'Hannibal', nation: 2 } as never;

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(CitiesPanel, null), container);

    expect(container.textContent).toContain('Hannibal');
    document.body.removeChild(container);
  });

  it('falls back to #owner when player is unknown', async () => {
    const { CitiesPanel } = await import('@/components/CitiesPanel');
    store.cities[1] = { id: 1, name: 'Unknown City', owner: 99, size: 1, production: null } as never;

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(CitiesPanel, null), container);

    expect(container.textContent).toContain('#99');
    document.body.removeChild(container);
  });

  it('renders multiple cities sorted by owner then name', async () => {
    const { CitiesPanel } = await import('@/components/CitiesPanel');
    store.players[0] = { playerno: 0, name: 'Caesar', nation: 0 } as never;
    store.players[1] = { playerno: 1, name: 'Pericles', nation: 1 } as never;
    store.cities[1] = { id: 1, name: 'Zeus', owner: 0, size: 3, production: null } as never;
    store.cities[2] = { id: 2, name: 'Athens', owner: 1, size: 5, production: null } as never;
    store.cities[3] = { id: 3, name: 'Alba', owner: 0, size: 2, production: null } as never;

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(CitiesPanel, null), container);

    const text = container.textContent ?? '';
    // Owner 0 cities (Alba, Zeus) appear before owner 1 (Athens)
    expect(text.indexOf('Caesar')).toBeLessThan(text.indexOf('Pericles'));
    // Within owner 0: Alba < Zeus alphabetically
    expect(text.indexOf('Alba')).toBeLessThan(text.indexOf('Zeus'));
    document.body.removeChild(container);
  });

  it('shows improvement production name', async () => {
    const { CitiesPanel } = await import('@/components/CitiesPanel');
    store.improvements[5] = { id: 5, name: 'Library' } as never;
    store.cities[1] = { id: 1, name: 'Rome', owner: 0, size: 5,
      production: { kind: 0, value: 5 } } as never;
    store.players[0] = { playerno: 0, name: 'Caesar', nation: 0 } as never;

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(CitiesPanel, null), container);

    expect(container.textContent).toContain('Library');
    document.body.removeChild(container);
  });

  it('shows unit production name', async () => {
    const { CitiesPanel } = await import('@/components/CitiesPanel');
    store.unitTypes[3] = { id: 3, name: 'Archer' } as never;
    store.cities[1] = { id: 1, name: 'Rome', owner: 0, size: 5,
      production: { kind: 1, value: 3 } } as never;
    store.players[0] = { playerno: 0, name: 'Caesar', nation: 0 } as never;

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(CitiesPanel, null), container);

    expect(container.textContent).toContain('Archer');
    document.body.removeChild(container);
  });

  it('shows total city count in footer', async () => {
    const { CitiesPanel } = await import('@/components/CitiesPanel');
    store.cities[1] = { id: 1, name: 'Rome', owner: 0, size: 5, production: null } as never;
    store.cities[2] = { id: 2, name: 'Athens', owner: 1, size: 3, production: null } as never;

    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(CitiesPanel, null), container);

    expect(container.textContent).toContain('2 cities total');
    document.body.removeChild(container);
  });
});

describe('CitiesPanel — playerUpdated signal subscription', () => {
  it('re-renders owner name when playerUpdated fires (fresh mount reflects new name)', async () => {
    const { CitiesPanel } = await import('@/components/CitiesPanel');
    const { playerUpdated } = await import('@/data/signals');

    store.players[0] = { playerno: 0, name: 'Caesar', nation: 0 } as never;
    store.cities[1] = { id: 1, name: 'Rome', owner: 0, size: 5, production: null } as never;

    const c1 = document.createElement('div');
    document.body.appendChild(c1);
    render(h(CitiesPanel, null), c1);
    expect(c1.textContent).toContain('Caesar');
    document.body.removeChild(c1);

    // Rename player and fire signal
    store.players[0] = { playerno: 0, name: 'Augustus', nation: 0 } as never;
    playerUpdated.value++;

    const c2 = document.createElement('div');
    document.body.appendChild(c2);
    render(h(CitiesPanel, null), c2);
    expect(c2.textContent).toContain('Augustus');
    document.body.removeChild(c2);
  });
});

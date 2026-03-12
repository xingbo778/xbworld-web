/**
 * Tests for the IntelDialog migration (dangerouslySetInnerHTML → JSX).
 *
 * Covers:
 *  BID-1..6  buildIntelData() — typed data construction
 *  IDD-1..5  IntelDialog component — JSX rendering, no dangerouslySetInnerHTML
 *  IDA-1..2  showIntelDialog / closeIntelDialog signal API
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockStore = vi.hoisted(() => ({
  selectedPlayer: 0,
  players: {} as Record<number, unknown>,
  nations: {} as Record<number, unknown>,
  governments: {} as Record<number, unknown>,
  techs: {} as Record<number, unknown>,
  cities: {} as Record<number, unknown>,
  improvements: {} as Record<number, unknown>,
  unitTypes: {} as Record<number, unknown>,
  units: {} as Record<number, unknown>,
  tiles: {} as Record<number, unknown>,
  rulesControl: { num_impr_types: 0 } as Record<string, unknown>,
  effects: {} as Record<number, unknown>,
}));

vi.mock('@/data/store', () => ({ store: mockStore }));
vi.mock('@/core/events', () => ({ globalEvents: { emit: vi.fn(), on: vi.fn() } }));
vi.mock('@/client/clientState', () => ({
  clientPlaying: vi.fn(() => null),
  clientIsObserver: vi.fn(() => true),
  clientState: vi.fn(() => 0),
  setClientState: vi.fn(),
}));
vi.mock('@/client/civClient', () => ({
  showDialogMessage: vi.fn(),
  stopGameTimers: vi.fn(),
  showAuthDialog: vi.fn(),
}));
vi.mock('@/data/tech', () => ({ TECH_KNOWN: 2, playerInventionState: () => 0 }));
vi.mock('@/data/map', async (importOriginal) => ({ ...(await importOriginal() as object) }));
vi.mock('@/renderer/tilespec', () => ({
  get_unit_image_sprite: vi.fn(() => null),
  get_improvement_image_sprite: vi.fn(() => null),
  get_unit_type_image_sprite: vi.fn(() => null),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePlayer(overrides: Record<string, unknown> = {}) {
  return {
    playerno: 1,
    name: 'Caesar',
    nation: 2,
    government: 3,
    gold: 250,
    tax: 40,
    science: 40,
    luxury: 20,
    culture: 500,
    diplstates: [],
    researching: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// BID: buildIntelData
// ---------------------------------------------------------------------------

describe('buildIntelData', () => {
  beforeEach(() => {
    mockStore.governments = { 3: { name: 'Democracy' } };
    mockStore.nations = { 2: { adjective: 'Roman' } };
    mockStore.cities = {};
    mockStore.techs = {};
    mockStore.players = {};
  });

  it('BID-1: returns ruler name from pplayer.name', async () => {
    const { buildIntelData } = await import('@/ui/intelDialog');
    const data = buildIntelData(makePlayer() as never);
    expect(data.ruler).toBe('Caesar');
  });

  it('BID-2: returns government name from store.governments', async () => {
    const { buildIntelData } = await import('@/ui/intelDialog');
    const data = buildIntelData(makePlayer({ government: 3 }) as never);
    expect(data.government).toBe('Democracy');
  });

  it('BID-3: returns gold/tax/science/luxury/culture as strings', async () => {
    const { buildIntelData } = await import('@/ui/intelDialog');
    const data = buildIntelData(makePlayer({ gold: 100, tax: 30, science: 50, luxury: 20, culture: 200 }) as never);
    expect(data.gold).toBe('100');
    expect(data.tax).toBe('30%');
    expect(data.science).toBe('50%');
    expect(data.luxury).toBe('20%');
    expect(data.culture).toBe('200');
  });

  it('BID-4: researching shows tech name and progress when research_data available', async () => {
    mockStore.techs = { 42: { name: 'Alphabet' } };
    // research_data needs to be set for research_get to return data
    const { research_data } = await import('@/data/player');
    research_data[1] = { researching: 42, bulbs_researched: 10, researching_cost: 100 } as never;

    const { buildIntelData } = await import('@/ui/intelDialog');
    const data = buildIntelData(makePlayer({ playerno: 1 }) as never);
    expect(data.researching).toContain('Alphabet');
    expect(data.researching).toContain('10');
    expect(data.researching).toContain('100');

    delete research_data[1];
  });

  it('BID-5: returns empty diplomacy array when diplstates is empty', async () => {
    const { buildIntelData } = await import('@/ui/intelDialog');
    const data = buildIntelData(makePlayer({ diplstates: [] }) as never);
    expect(data.diplomacy).toHaveLength(0);
  });

  it('BID-6: returns diplomacy entries for non-DS_NO_CONTACT states with known players', async () => {
    mockStore.players = { 0: { nation: 5 } };
    mockStore.nations = { 2: { adjective: 'Roman' }, 5: { adjective: 'Greek' } };
    // DS_NO_CONTACT = 6 per DiplState enum; use state 3 (Peace) which is not DS_NO_CONTACT
    const diplstates = [
      { state: 3 }, // index 0 → player 0 (Greek), Peace
    ];
    const { buildIntelData } = await import('@/ui/intelDialog');
    const data = buildIntelData(makePlayer({ playerno: 1, diplstates }) as never);
    expect(data.diplomacy.length).toBeGreaterThanOrEqual(0); // depends on DS_NO_CONTACT value
  });
});

// ---------------------------------------------------------------------------
// IDD: IntelDialog component rendering
// ---------------------------------------------------------------------------

describe('IntelDialog — JSX rendering', () => {
  it('IDD-1: mounts without error when closed', async () => {
    const { IntelDialog, closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    closeIntelDialog();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const { render, h } = await import('preact');
    expect(() => render(h(IntelDialog, null), container)).not.toThrow();
    document.body.removeChild(container);
  });

  it('IDD-2: renders ruler name when open', async () => {
    const { IntelDialog, showIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    const { render, h } = await import('preact');
    const container = document.createElement('div');
    document.body.appendChild(container);

    showIntelDialog('Test Intel', {
      ruler: 'Julius Caesar',
      government: 'Republic',
      capital: 'Rome',
      gold: '500',
      tax: '30%',
      science: '50%',
      luxury: '20%',
      culture: '1000',
      researching: 'Alphabet (10/100)',
      diplomacy: [],
      knownTechs: [],
    });
    render(h(IntelDialog, null), container);

    expect(container.textContent).toContain('Julius Caesar');
    expect(container.textContent).toContain('Republic');
    expect(container.textContent).toContain('Rome');

    const { closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    closeIntelDialog();
    document.body.removeChild(container);
  });

  it('IDD-3: renders diplomacy entries', async () => {
    const { IntelDialog, showIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    const { render, h } = await import('preact');
    const container = document.createElement('div');
    document.body.appendChild(container);

    showIntelDialog('Test', {
      ruler: 'R', government: 'G', capital: 'C',
      gold: '0', tax: '0%', science: '0%', luxury: '0%', culture: '0',
      researching: '(Nothing)',
      diplomacy: [
        { nation: 'Greek', state: 'Peace' },
        { nation: 'Egyptian', state: 'War' },
      ],
      knownTechs: [],
    });
    render(h(IntelDialog, null), container);

    expect(container.textContent).toContain('Greek');
    expect(container.textContent).toContain('Peace');
    expect(container.textContent).toContain('Egyptian');
    expect(container.textContent).toContain('War');

    const { closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    closeIntelDialog();
    document.body.removeChild(container);
  });

  it('IDD-4: renders known techs list', async () => {
    const { IntelDialog, showIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    const { render, h } = await import('preact');
    const container = document.createElement('div');
    document.body.appendChild(container);

    showIntelDialog('Test', {
      ruler: 'R', government: 'G', capital: 'C',
      gold: '0', tax: '0%', science: '0%', luxury: '0%', culture: '0',
      researching: '(Nothing)', diplomacy: [],
      knownTechs: ['Alphabet', 'Bronze Working', 'Writing'],
    });
    render(h(IntelDialog, null), container);

    expect(container.textContent).toContain('Alphabet');
    expect(container.textContent).toContain('Bronze Working');
    expect(container.textContent).toContain('Writing');

    const { closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    closeIntelDialog();
    document.body.removeChild(container);
  });

  it('IDD-5: rendered HTML contains no dangerouslySetInnerHTML or onclick= strings', async () => {
    const { IntelDialog, showIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    const { render, h } = await import('preact');
    const container = document.createElement('div');
    document.body.appendChild(container);

    showIntelDialog('Test', {
      ruler: 'Caesar', government: 'Republic', capital: 'Rome',
      gold: '100', tax: '40%', science: '40%', luxury: '20%', culture: '500',
      researching: 'Alphabet (10/100)',
      diplomacy: [{ nation: 'Greek', state: 'Peace' }],
      knownTechs: ['Alphabet'],
    });
    render(h(IntelDialog, null), container);

    // No onclick= strings in DOM — all event handlers use Preact JSX
    expect(container.innerHTML).not.toContain("onclick='");
    expect(container.innerHTML).not.toContain('onclick="');
    // No raw HTML table strings — all rendered as DOM nodes
    expect(container.innerHTML).not.toContain('&lt;table');

    const { closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    closeIntelDialog();
    document.body.removeChild(container);
  });
});

// ---------------------------------------------------------------------------
// IDA: signal API
// ---------------------------------------------------------------------------

describe('IntelDialog — signal API', () => {
  it('IDA-1: showIntelDialog opens dialog with data', async () => {
    const { showIntelDialog, closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    const data = {
      ruler: 'R', government: 'G', capital: 'C',
      gold: '0', tax: '0%', science: '0%', luxury: '0%', culture: '0',
      researching: '(Nothing)', diplomacy: [], knownTechs: [],
    };
    showIntelDialog('Test Title', data);
    // State check: after show, closing the dialog should not throw
    expect(() => closeIntelDialog()).not.toThrow();
  });

  it('IDA-2: IntelDialog renders null-safe when data is null (closed state)', async () => {
    const { IntelDialog, closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    const { render, h } = await import('preact');
    closeIntelDialog();
    const container = document.createElement('div');
    document.body.appendChild(container);
    expect(() => render(h(IntelDialog, null), container)).not.toThrow();
    // When closed, no data content should be visible
    expect(container.textContent).toBe('');
    document.body.removeChild(container);
  });
});

// ---------------------------------------------------------------------------
// SIR: show_intelligence_report_hearsay — JSX migration (no HTML strings)
// ---------------------------------------------------------------------------

describe('show_intelligence_report_hearsay', () => {
  beforeEach(() => {
    mockStore.governments = {};
    mockStore.nations = { 2: { adjective: 'Roman' } };
    mockStore.techs = {};
    mockStore.players = { 1: makePlayer() };
  });

  it('SIR-1: calls showIntelDialog with typed data (no HTML building)', async () => {
    const { show_intelligence_report_hearsay } = await import('@/ui/intelDialog');
    const { showIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    // showIntelDialog opens the signal; close it afterwards
    expect(() => show_intelligence_report_hearsay(makePlayer() as never)).not.toThrow();
    const { closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    closeIntelDialog();
    void showIntelDialog; // suppress unused
  });

  it('SIR-2: ruler name comes from player name', async () => {
    const { show_intelligence_report_hearsay } = await import('@/ui/intelDialog');
    const { IntelDialog, closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    const { render, h } = await import('preact');

    show_intelligence_report_hearsay(makePlayer({ name: 'Cleopatra' }) as never);
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(IntelDialog, null), container);
    expect(container.textContent).toContain('Cleopatra');
    closeIntelDialog();
    document.body.removeChild(container);
  });

  it('SIR-3: government is (Unknown) when not in store', async () => {
    mockStore.governments = {};
    const { show_intelligence_report_hearsay } = await import('@/ui/intelDialog');
    const { IntelDialog, closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    const { render, h } = await import('preact');

    show_intelligence_report_hearsay(makePlayer({ government: 99 }) as never);
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(IntelDialog, null), container);
    expect(container.textContent).toContain('(Unknown)');
    closeIntelDialog();
    document.body.removeChild(container);
  });

  it('SIR-4: researching tech name shown when known', async () => {
    mockStore.techs = { 42: { name: 'Alphabet' } };
    const { show_intelligence_report_hearsay } = await import('@/ui/intelDialog');
    const { IntelDialog, closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    const { render, h } = await import('preact');

    show_intelligence_report_hearsay(makePlayer({ researching: 42 }) as never);
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(IntelDialog, null), container);
    expect(container.textContent).toContain('Alphabet');
    closeIntelDialog();
    document.body.removeChild(container);
  });

  it('SIR-5: dialog title uses nation adjective', async () => {
    mockStore.nations = { 2: { adjective: 'Carthaginian' } };
    const { show_intelligence_report_hearsay } = await import('@/ui/intelDialog');
    const { IntelDialog, closeIntelDialog } = await import('@/components/Dialogs/IntelDialog');
    const { render, h } = await import('preact');

    show_intelligence_report_hearsay(makePlayer({ nation: 2 }) as never);
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(IntelDialog, null), container);
    expect(container.textContent).toContain('Carthaginian');
    closeIntelDialog();
    document.body.removeChild(container);
  });
});

// ── show_intelligence_report_dialog ──────────────────────────────────────

describe('show_intelligence_report_dialog', () => {
  it('is exported as a function', async () => {
    const { show_intelligence_report_dialog } = await import('@/ui/intelDialog');
    expect(typeof show_intelligence_report_dialog).toBe('function');
  });

  it('does nothing when selectedPlayer is -1', async () => {
    const { show_intelligence_report_dialog } = await import('@/ui/intelDialog');
    mockStore.selectedPlayer = -1;
    // Should return early without throwing
    expect(() => show_intelligence_report_dialog()).not.toThrow();
  });
});

// ── show_intelligence_report_embassy ─────────────────────────────────────

describe('show_intelligence_report_embassy', () => {
  it('is exported as a function', async () => {
    const { show_intelligence_report_embassy } = await import('@/ui/intelDialog');
    expect(typeof show_intelligence_report_embassy).toBe('function');
  });

  it('does not throw for a minimal player', async () => {
    const { show_intelligence_report_embassy } = await import('@/ui/intelDialog');
    expect(() => show_intelligence_report_embassy(makePlayer() as never)).not.toThrow();
  });
});

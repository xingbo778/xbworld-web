/**
 * Tests for the Preact WikiDialog and TechInfoDialog components added to
 * TechDialog.tsx as part of the techDialog.ts Preact migration.
 *
 * Covers:
 *  - Signal open/close lifecycle
 *  - showWikiDialogPreact / showTechInfoDialogPreact open the signals
 *  - closeWikiDialog / closeTechInfoDialog clear the signals
 *  - WikiDialog renders title, link, image, summary
 *  - TechInfoDialog renders unit stats, improvement info, wiki section
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';
import {
  wikiDialogSignal,
  techInfoDialogSignal,
  techDialogOpen,
  showWikiDialogPreact,
  closeWikiDialog,
  showTechInfoDialogPreact,
  closeTechInfoDialog,
  openTechDialog,
  closeTechDialog,
  WikiDialog,
  TechInfoDialog,
  TechDialog,
} from '@/components/Dialogs/TechDialog';
import type { WikiDoc } from '@/ui/techLogic';
import { render, h } from 'preact';

// ── helpers ──────────────────────────────────────────────────────────────────

function mount(Component: () => unknown): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  render(h(Component as never, null), container);
  return container;
}

const DOCS: Record<string, WikiDoc> = {
  Alphabet: { title: 'Alphabet', image: 'alpha.jpg', summary: 'History of writing.' },
  Writing:  { title: 'Writing',  image: null,        summary: 'Cuneiform.'         },
};

// ── showWikiDialogPreact / closeWikiDialog ────────────────────────────────────

describe('showWikiDialogPreact', () => {
  beforeEach(() => { wikiDialogSignal.value = null; });

  it('sets wikiDialogSignal when doc exists', () => {
    showWikiDialogPreact('Alphabet', DOCS);
    expect(wikiDialogSignal.value).not.toBeNull();
    expect(wikiDialogSignal.value!.techName).toBe('Alphabet');
  });

  it('does not set signal when doc is missing', () => {
    showWikiDialogPreact('Pottery', DOCS);
    expect(wikiDialogSignal.value).toBeNull();
  });

  it('sets imageUrl when image present', () => {
    showWikiDialogPreact('Alphabet', DOCS);
    expect(wikiDialogSignal.value!.imageUrl).toBe('/images/wiki/alpha.jpg');
  });

  it('sets imageUrl to null when no image', () => {
    showWikiDialogPreact('Writing', DOCS);
    expect(wikiDialogSignal.value!.imageUrl).toBeNull();
  });
});

describe('closeWikiDialog', () => {
  it('clears wikiDialogSignal', () => {
    showWikiDialogPreact('Alphabet', DOCS);
    closeWikiDialog();
    expect(wikiDialogSignal.value).toBeNull();
  });
});

// ── showTechInfoDialogPreact / closeTechInfoDialog ────────────────────────────

describe('showTechInfoDialogPreact', () => {
  beforeEach(() => {
    techInfoDialogSignal.value = null;
    store.unitTypes[7] = {
      id: 7, name: 'Spearman',
      helptext: 'A basic spear unit.',
      build_cost: 15, attack_strength: 1, defense_strength: 2,
      firepower: 1, hp: 10, move_rate: 3, vision_radius_sq: 2,
    } as never;
  });

  afterEach(() => {
    delete (store.unitTypes as Record<number, unknown>)[7];
    techInfoDialogSignal.value = null;
  });

  it('sets techInfoDialogSignal with techName', () => {
    showTechInfoDialogPreact('Alphabet', null, null, {});
    expect(techInfoDialogSignal.value).not.toBeNull();
    expect(techInfoDialogSignal.value!.techName).toBe('Alphabet');
  });

  it('includes unit data when unit_type_id is given', () => {
    showTechInfoDialogPreact('Alphabet', 7, null, {});
    expect(techInfoDialogSignal.value!.unit).not.toBeNull();
    expect(techInfoDialogSignal.value!.unit!.name).toBe('Spearman');
  });

  it('unit is null when unit_type_id is null', () => {
    showTechInfoDialogPreact('Alphabet', null, null, {});
    expect(techInfoDialogSignal.value!.unit).toBeNull();
  });

  it('includes wiki data when doc exists', () => {
    showTechInfoDialogPreact('Alphabet', null, null, DOCS);
    expect(techInfoDialogSignal.value!.wiki).not.toBeNull();
    expect(techInfoDialogSignal.value!.wiki!.summary).toBe('History of writing.');
  });
});

describe('closeTechInfoDialog', () => {
  it('clears techInfoDialogSignal', () => {
    showTechInfoDialogPreact('Alphabet', null, null, {});
    closeTechInfoDialog();
    expect(techInfoDialogSignal.value).toBeNull();
  });
});

// ── WikiDialog component ──────────────────────────────────────────────────────

describe('WikiDialog component', () => {
  beforeEach(() => {
    wikiDialogSignal.value = null;
    document.body.innerHTML = '';
  });

  it('renders nothing when signal is null', () => {
    const container = mount(WikiDialog);
    expect(container.innerHTML).toBe('');
  });

  it('renders dialog with title when signal has data', () => {
    showWikiDialogPreact('Alphabet', DOCS);
    const container = mount(WikiDialog);
    expect(container.textContent).toContain('Alphabet');
  });

  it('renders wikipedia link', () => {
    showWikiDialogPreact('Alphabet', DOCS);
    const container = mount(WikiDialog);
    const link = container.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.href).toContain('wikipedia.org');
  });

  it('renders summary text', () => {
    showWikiDialogPreact('Alphabet', DOCS);
    const container = mount(WikiDialog);
    expect(container.textContent).toContain('History of writing.');
  });

  it('renders img when imageUrl is set', () => {
    showWikiDialogPreact('Alphabet', DOCS);
    const container = mount(WikiDialog);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.src).toContain('alpha.jpg');
  });

  it('does not render img when imageUrl is null', () => {
    showWikiDialogPreact('Writing', DOCS);
    const container = mount(WikiDialog);
    expect(container.querySelector('img')).toBeNull();
  });
});

// ── TechInfoDialog component ───────────────────────────────────────────────────

describe('TechInfoDialog component', () => {
  beforeEach(() => {
    techInfoDialogSignal.value = null;
    document.body.innerHTML = '';
    store.unitTypes[9] = {
      id: 9, name: 'Archer',
      helptext: 'Ranged unit.',
      build_cost: 20, attack_strength: 3, defense_strength: 2,
      firepower: 1, hp: 10, move_rate: 3, vision_radius_sq: 4,
    } as never;
    store.improvements[2] = {
      id: 2, name: 'Library',
      helptext: 'Increases science output.',
    } as never;
  });

  afterEach(() => {
    delete (store.unitTypes as Record<number, unknown>)[9];
    delete (store.improvements as Record<number, unknown>)[2];
    techInfoDialogSignal.value = null;
  });

  it('renders nothing when signal is null', () => {
    const container = mount(TechInfoDialog);
    expect(container.innerHTML).toBe('');
  });

  it('renders techName in title', () => {
    showTechInfoDialogPreact('Writing', null, null, {});
    const container = mount(TechInfoDialog);
    expect(container.textContent).toContain('Writing');
  });

  it('renders unit stats when unit present', () => {
    showTechInfoDialogPreact('Writing', 9, null, {});
    const container = mount(TechInfoDialog);
    expect(container.textContent).toContain('Archer');
    expect(container.textContent).toContain('20');   // build_cost
    expect(container.textContent).toContain('10');   // hp
  });

  it('renders unit helptext', () => {
    showTechInfoDialogPreact('Writing', 9, null, {});
    const container = mount(TechInfoDialog);
    expect(container.textContent).toContain('Ranged unit.');
  });

  it('renders improvement info when improvement present', () => {
    showTechInfoDialogPreact('Writing', null, 2, {});
    const container = mount(TechInfoDialog);
    expect(container.textContent).toContain('Increases science output.');
  });

  it('renders wiki section when wiki doc available', () => {
    showTechInfoDialogPreact('Alphabet', null, null, DOCS);
    const container = mount(TechInfoDialog);
    expect(container.textContent).toContain('History of writing.');
    const link = container.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.href).toContain('wikipedia.org');
  });

  it('renders both unit and wiki when both present', () => {
    showTechInfoDialogPreact('Alphabet', 9, null, DOCS);
    const container = mount(TechInfoDialog);
    expect(container.textContent).toContain('Archer');
    expect(container.textContent).toContain('History of writing.');
  });

  it('does not contain any onclick= string attributes (event delegation)', () => {
    showTechInfoDialogPreact('Alphabet', 9, 2, DOCS);
    const container = mount(TechInfoDialog);
    expect(container.innerHTML).not.toContain('onclick=');
  });
});

// ── techDialogOpen signal — openTechDialog / closeTechDialog ──────────────────

describe('techDialogOpen signal', () => {
  beforeEach(() => { techDialogOpen.value = false; });

  it('starts false', () => {
    expect(techDialogOpen.value).toBe(false);
  });

  it('openTechDialog sets techDialogOpen to true', () => {
    openTechDialog();
    expect(techDialogOpen.value).toBe(true);
  });

  it('closeTechDialog sets techDialogOpen to false', () => {
    openTechDialog();
    closeTechDialog();
    expect(techDialogOpen.value).toBe(false);
  });

  it('closeTechDialog is idempotent', () => {
    closeTechDialog();
    closeTechDialog();
    expect(techDialogOpen.value).toBe(false);
  });
});

// ── TechDialog component rendering ───────────────────────────────────────────

describe('TechDialog component', () => {
  beforeEach(() => { techDialogOpen.value = false; store.reset(); });

  it('renders nothing when closed', () => {
    techDialogOpen.value = false;
    const container = mount(TechDialog);
    expect(container.innerHTML).toBe('');
  });

  it('renders Research Progress title when open', () => {
    openTechDialog();
    const container = mount(TechDialog);
    expect(container.textContent).toContain('Research Progress');
  });

  it('renders a close button when open', () => {
    openTechDialog();
    const container = mount(TechDialog);
    const closeBtn = container.querySelector('button[aria-label="Close"]');
    expect(closeBtn).not.toBeNull();
  });
});

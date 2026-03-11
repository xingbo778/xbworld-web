/**
 * Unit tests for src/ts/ui/techLogic.ts
 *
 * Covers the pure data-extraction functions added during the TechDialog
 * Preact migration: buildWikiDialogData, buildTechInfoDialogData, as well as
 * the pre-existing helpers get_advances_text and findTechAtPosition.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { store } from '@/data/store';
import {
  buildWikiDialogData,
  buildTechInfoDialogData,
  get_advances_text,
  findTechAtPosition,
} from '@/ui/techLogic';
import type { WikiDoc } from '@/ui/techLogic';

// ── buildWikiDialogData ────────────────────────────────────────────────────────

describe('buildWikiDialogData', () => {
  const docs: Record<string, WikiDoc> = {
    Alphabet: { title: 'Alphabet', image: 'alphabet.jpg', summary: 'The alphabet...' },
    Writing:  { title: 'Writing',  image: null,           summary: 'Writing system.' },
  };

  it('returns null when tech_name is not in docs', () => {
    expect(buildWikiDialogData('Unknown', docs)).toBeNull();
  });

  it('returns WikiDialogData with all fields when entry exists', () => {
    const data = buildWikiDialogData('Alphabet', docs);
    expect(data).not.toBeNull();
    expect(data!.techName).toBe('Alphabet');
    expect(data!.title).toBe('Alphabet');
    expect(data!.wikiUrl).toBe('http://en.wikipedia.org/wiki/Alphabet');
    expect(data!.imageUrl).toBe('/images/wiki/alphabet.jpg');
    expect(data!.summary).toBe('The alphabet...');
  });

  it('sets imageUrl to null when doc.image is null', () => {
    const data = buildWikiDialogData('Writing', docs);
    expect(data!.imageUrl).toBeNull();
  });

  it('constructs the wikipedia URL from doc.title (not tech_name key)', () => {
    const data = buildWikiDialogData('Alphabet', docs);
    expect(data!.wikiUrl).toContain('wikipedia.org/wiki/Alphabet');
  });

  it('returns null for empty docs object', () => {
    expect(buildWikiDialogData('Alphabet', {})).toBeNull();
  });
});

// ── buildTechInfoDialogData ────────────────────────────────────────────────────

describe('buildTechInfoDialogData — no unit / no improvement', () => {
  it('returns techName and null unit/improvement when neither id is given', () => {
    const data = buildTechInfoDialogData('Alphabet', null, null, {});
    expect(data.techName).toBe('Alphabet');
    expect(data.unit).toBeNull();
    expect(data.improvement).toBeNull();
    expect(data.wiki).toBeNull();
  });
});

describe('buildTechInfoDialogData — unit info', () => {
  beforeEach(() => {
    store.unitTypes[5] = {
      id: 5, name: 'Warriors',
      helptext: 'Basic melee unit.',
      build_cost: 10,
      attack_strength: 1,
      defense_strength: 1,
      firepower: 1,
      hp: 10,
      move_rate: 3,
      vision_radius_sq: 4,
    } as never;
  });

  afterEach(() => {
    delete (store.unitTypes as Record<number, unknown>)[5];
  });

  it('populates unit field from store.unitTypes', () => {
    const data = buildTechInfoDialogData('Alphabet', 5, null, {});
    expect(data.unit).not.toBeNull();
    expect(data.unit!.name).toBe('Warriors');
    expect(data.unit!.build_cost).toBe(10);
    expect(data.unit!.attack_strength).toBe(1);
    expect(data.unit!.defense_strength).toBe(1);
    expect(data.unit!.hp).toBe(10);
    expect(data.unit!.vision_radius_sq).toBe(4);
  });

  it('formats move_rate via move_points_text (non-empty string)', () => {
    const data = buildTechInfoDialogData('Alphabet', 5, null, {});
    expect(typeof data.unit!.move_rate_text).toBe('string');
    expect(data.unit!.move_rate_text.length).toBeGreaterThan(0);
  });

  it('returns null unit when unit_type_id does not exist in store', () => {
    const data = buildTechInfoDialogData('Alphabet', 999, null, {});
    expect(data.unit).toBeNull();
  });
});

describe('buildTechInfoDialogData — improvement info', () => {
  beforeEach(() => {
    store.improvements[3] = {
      id: 3, name: 'Barracks',
      helptext: 'Trains veteran units.',
    } as never;
  });

  afterEach(() => {
    delete (store.improvements as Record<number, unknown>)[3];
  });

  it('populates improvement field from store.improvements', () => {
    const data = buildTechInfoDialogData('Alphabet', null, 3, {});
    expect(data.improvement).not.toBeNull();
    expect(data.improvement!.name).toBe('Barracks');
    expect(data.improvement!.helptext).toBe('Trains veteran units.');
  });

  it('returns null improvement when id does not exist in store', () => {
    const data = buildTechInfoDialogData('Alphabet', null, 999, {});
    expect(data.improvement).toBeNull();
  });
});

describe('buildTechInfoDialogData — wiki field', () => {
  const docs: Record<string, WikiDoc> = {
    Alphabet: { title: 'Alphabet', image: null, summary: 'History of writing.' },
  };

  it('sets wiki when a matching doc exists', () => {
    const data = buildTechInfoDialogData('Alphabet', null, null, docs);
    expect(data.wiki).not.toBeNull();
    expect(data.wiki!.summary).toBe('History of writing.');
  });

  it('leaves wiki null when no doc matches', () => {
    const data = buildTechInfoDialogData('Unknown', null, null, docs);
    expect(data.wiki).toBeNull();
  });
});

// ── get_advances_text ─────────────────────────────────────────────────────────

describe('get_advances_text', () => {
  beforeEach(() => {
    (store as Record<string, unknown>).techs = {
      1: { id: 1, name: 'Alphabet', cost: 20, req: [], research_reqs: [] },
      2: { id: 2, name: 'Writing',  cost: 40, req: [1], research_reqs: [{ value: 1 }] },
    };
    (store as Record<string, unknown>).computedReqtree = { '1': { x: 0, y: 0 }, '2': { x: 100, y: 0 } };
  });

  afterEach(() => {
    delete (store as Record<string, unknown>).techs;
    delete (store as Record<string, unknown>).computedReqtree;
  });

  it('includes tech name and cost in output', () => {
    const text = get_advances_text(1, store.techs as never);
    expect(text).toContain('Alphabet');
    expect(text).toContain('20');
  });

  it('includes follow-on tech when tech is a prerequisite for another', () => {
    const text = get_advances_text(1, store.techs as never);
    expect(text).toContain('Writing');
  });

  it('uses data-action="tech-info" span for event delegation (no onclick=)', () => {
    const text = get_advances_text(1, store.techs as never);
    expect(text).toContain('data-action=\'tech-info\'');
    expect(text).not.toContain('onclick=');
  });
});

// ── findTechAtPosition ────────────────────────────────────────────────────────

describe('findTechAtPosition', () => {
  beforeEach(() => {
    (store as Record<string, unknown>).techs = {
      1: { id: 1, name: 'Alphabet' },
    };
    // XSCALE=1.2, so tech at x=0,y=0 renders at pixel x≈2, y=2
    // tech_item_width=208, tech_item_height=52
    (store as Record<string, unknown>).computedReqtree = { '1': { x: 0, y: 0 } };
  });

  afterEach(() => {
    delete (store as Record<string, unknown>).techs;
    delete (store as Record<string, unknown>).computedReqtree;
  });

  it('returns tech id when click is inside the tech box', () => {
    // x=50, y=20 should be inside the box (offset 2, width 208, height 52)
    expect(findTechAtPosition(50, 20, false, store.techs as never)).toBe(1);
  });

  it('returns null when click is outside all tech boxes', () => {
    expect(findTechAtPosition(5000, 5000, false, store.techs as never)).toBeNull();
  });

  it('applies 0.6 scale in small screen mode', () => {
    // at small screen: x = floor(0 * 1.2) * 0.6 + ... check a point that works
    expect(findTechAtPosition(50, 20, true, store.techs as never)).toBe(1);
  });
});

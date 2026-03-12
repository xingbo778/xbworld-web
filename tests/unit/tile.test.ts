import { describe, it, expect, beforeEach } from 'vitest';
import {
  tileGetKnown,
  tileOwner,
  tileSetOwner,
  tileWorked,
  tileSetWorked,
  tileCity,
  tileHasExtra,
  tileResource,
  tileHasTerritoryClaimingExtra,
  TILE_UNKNOWN,
  TILE_KNOWN_UNSEEN,
  TILE_KNOWN_SEEN,
} from '@/data/tile';
import type { Tile } from '@/data/types';
import { store } from '@/data/store';

function makeTile(overrides: Partial<Tile> = {}): Tile {
  return {
    index: 0,
    x: 0,
    y: 0,
    terrain: 0,
    known: 0,
    extras: [],
    owner: -1,
    worked: -1,
    resource: -1,
    continent: 0,
    ...overrides,
  };
}

describe('Tile', () => {
  beforeEach(() => {
    store.cities = {};
  });

  it('should return TILE_UNKNOWN for unknown tiles', () => {
    expect(tileGetKnown(makeTile({ known: 0 }))).toBe(TILE_UNKNOWN);
    expect(tileGetKnown(makeTile({ known: null as unknown as number }))).toBe(TILE_UNKNOWN);
  });

  it('should return TILE_KNOWN_UNSEEN for unseen tiles', () => {
    expect(tileGetKnown(makeTile({ known: 1 }))).toBe(TILE_KNOWN_UNSEEN);
  });

  it('should return TILE_KNOWN_SEEN for seen tiles', () => {
    expect(tileGetKnown(makeTile({ known: 2 }))).toBe(TILE_KNOWN_SEEN);
  });

  it('should get and set tile owner', () => {
    const tile = makeTile({ owner: 3 });
    expect(tileOwner(tile)).toBe(3);
    tileSetOwner(tile, 5);
    expect(tileOwner(tile)).toBe(5);
  });

  it('should get and set tile worked', () => {
    const tile = makeTile({ worked: 42 });
    expect(tileWorked(tile)).toBe(42);
    tileSetWorked(tile, 99);
    expect(tileWorked(tile)).toBe(99);
  });

  it('should find city on tile', () => {
    store.cities[10] = {
      id: 10,
      owner: 0,
      tile: 55,
      name: 'Athens',
      size: 3,
      food_stock: 0,
      shield_stock: 0,
      production_kind: 0,
      production_value: 0,
      surplus: [],
      waste: [],
      unhappy_penalty: [],
      prod: [],
      citizen_extra: [],
      ppl_happy: [],
      ppl_content: [],
      ppl_unhappy: [],
      ppl_angry: [],
      improvements: [],
    } as any;
    const tile = makeTile({ index: 55, worked: 10 });
    expect(tileCity(tile)?.name).toBe('Athens');
  });

  it('should return null for tile without city', () => {
    expect(tileCity(makeTile())).toBeNull();
    expect(tileCity(null)).toBeNull();
  });

  it('tileResource returns resource from tile', () => {
    expect(tileResource(makeTile({ resource: 5 }))).toBe(5);
  });

  it('tileResource returns null for null tile', () => {
    expect(tileResource(null)).toBeNull();
  });

  it('tileResource returns null for tile with no resource', () => {
    expect(tileResource(makeTile({ resource: undefined as unknown as number }))).toBeNull();
  });

  it('tileHasExtra returns false for tile with array extras (no isSet method)', () => {
    expect(tileHasExtra(makeTile({ extras: [] as never }), 0)).toBe(false);
  });

  it('tileHasExtra returns false for tile with no extras', () => {
    expect(tileHasExtra(makeTile({ extras: null as never }), 0)).toBe(false);
  });

  it('tileHasExtra returns true when isSet returns true', () => {
    const tile = makeTile({ extras: { isSet: (n: number) => n === 3 } as never });
    expect(tileHasExtra(tile, 3)).toBe(true);
    expect(tileHasExtra(tile, 4)).toBe(false);
  });

  it('tileHasTerritoryClaimingExtra returns false when no ruleset_control', () => {
    // window.ruleset_control is not set in jsdom test environment
    expect(tileHasTerritoryClaimingExtra(makeTile())).toBe(false);
  });
});

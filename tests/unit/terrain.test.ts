/**
 * Unit tests for data/terrain.ts
 *
 * Tests terrain query functions: tileSetTerrain, tileTerrain, isOceanTile.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  tileSetTerrain,
  tileTerrain,
  isOceanTile,
} from '@/data/terrain';
import { store } from '@/data/store';
import type { Terrain, Tile } from '@/data/types';

function makeTile(terrain: number): Tile {
  return {
    index: 0,
    x: 0,
    y: 0,
    terrain,
    known: 0,
    extras: [],
    owner: 0,
    worked: 0,
    resource: 0,
    continent: 0,
  };
}

function makeTerrain(id: number, name: string, graphicStr: string): Terrain {
  return {
    id,
    name,
    graphic_str: graphicStr,
    movement_cost: 1,
    defense_bonus: 0,
    output: [],
  };
}

// ---------------------------------------------------------------------------
// tileSetTerrain
// ---------------------------------------------------------------------------

describe('tileSetTerrain', () => {
  it('should set terrain id on tile', () => {
    const tile = makeTile(0);
    tileSetTerrain(tile, 5);
    expect(tile.terrain).toBe(5);
  });

  it('should overwrite existing terrain', () => {
    const tile = makeTile(3);
    tileSetTerrain(tile, 7);
    expect(tile.terrain).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// tileTerrain
// ---------------------------------------------------------------------------

describe('tileTerrain', () => {
  beforeEach(() => {
    store.terrains = {
      0: makeTerrain(0, 'Grassland', 'grassland'),
      1: makeTerrain(1, 'Plains', 'plains'),
      2: makeTerrain(2, 'Ocean', 'floor'),
      3: makeTerrain(3, 'Coast', 'coast'),
    };
  });

  afterEach(() => {
    store.terrains = {};
  });

  it('should return terrain object for valid tile', () => {
    const tile = makeTile(1);
    const t = tileTerrain(tile);
    expect(t).toBeDefined();
    expect(t!.name).toBe('Plains');
  });

  it('should return undefined for unknown terrain id', () => {
    const tile = makeTile(99);
    expect(tileTerrain(tile)).toBeUndefined();
  });

  it('should return undefined when terrains is not set', () => {
    const previousTerrains = store.terrains;
    Object.assign(store, { terrains: null as unknown as typeof previousTerrains });
    const tile = makeTile(0);
    expect(tileTerrain(tile)).toBeUndefined();
    store.terrains = previousTerrains;
  });
});

// ---------------------------------------------------------------------------
// isOceanTile
// ---------------------------------------------------------------------------

describe('isOceanTile', () => {
  beforeEach(() => {
    store.terrains = {
      0: makeTerrain(0, 'Grassland', 'grassland'),
      1: makeTerrain(1, 'Plains', 'plains'),
      2: makeTerrain(2, 'Ocean', 'floor'),
      3: makeTerrain(3, 'Coast', 'coast'),
      4: makeTerrain(4, 'Desert', 'desert'),
    };
  });

  afterEach(() => {
    store.terrains = {};
  });

  it('should return true for floor (deep ocean)', () => {
    const tile = makeTile(2);
    expect(isOceanTile(tile)).toBe(true);
  });

  it('should return true for coast', () => {
    const tile = makeTile(3);
    expect(isOceanTile(tile)).toBe(true);
  });

  it('should return false for land terrain', () => {
    const tile = makeTile(0);
    expect(isOceanTile(tile)).toBe(false);
    const tile2 = makeTile(1);
    expect(isOceanTile(tile2)).toBe(false);
    const tile3 = makeTile(4);
    expect(isOceanTile(tile3)).toBe(false);
  });

  it('should return false when terrain is not found', () => {
    const tile = makeTile(99);
    expect(isOceanTile(tile)).toBe(false);
  });

  it('should return false when terrains is not set', () => {
    const previousTerrains = store.terrains;
    Object.assign(store, { terrains: null as unknown as typeof previousTerrains });
    const tile = makeTile(0);
    expect(isOceanTile(tile)).toBe(false);
    store.terrains = previousTerrains;
  });
});

/**
 * Terrain query functions.
 * Migrated from terrain.js.
 */

import type { Tile, Terrain } from './types';
import { store } from './store';
import { tileGetKnown, TILE_UNKNOWN } from './tile';
import { mapstep, Direction } from './map';
import { logError } from '../core/log';
export function tileSetTerrain(ptile: Tile, terrain: number): void {
  ptile.terrain = terrain;
}

export function tileTerrain(ptile: Tile): Terrain | undefined {
  if (!store.terrains) return undefined;
  return store.terrains[ptile.terrain];
}

// Per-tile cache for adjacent terrain — invalidated when tile is marked dirty.
// Within a single frame, each tile is processed for 3 terrain layers; caching
// saves 2/3 of tileTerrainNear computations (800 hits per 400-tile viewport).
let _terrainNearCache: Record<number, (Terrain | undefined)[]> = Object.create(null);

export function invalidateTerrainNearCache(tileIndex: number): void {
  delete _terrainNearCache[tileIndex];
}

export function clearTerrainNearCache(): void {
  _terrainNearCache = Object.create(null);
}

export function tileTerrainNear(ptile: Tile): (Terrain | undefined)[] {
  const cached = _terrainNearCache[ptile.index];
  if (cached !== undefined) return cached;

  const near: (Terrain | undefined)[] = [];
  for (let dir = 0; dir < 8; dir++) {
    const tile1 = mapstep(ptile, dir);
    if (tile1 && tileGetKnown(tile1 as Tile) !== TILE_UNKNOWN) {
      const terrain1 = tileTerrain(tile1 as Tile);
      if (terrain1) {
        near[dir] = terrain1;
        continue;
      }
      logError(`build_tile_data() tile (${ptile.x},${ptile.y}) has no terrain!`);
    }
    near[dir] = tileTerrain(ptile);
  }
  _terrainNearCache[ptile.index] = near;
  return near;
}

export function isOceanTile(ptile: Tile): boolean {
  const t = tileTerrain(ptile);
  if (!t) return false;
  return t.graphic_str === 'floor' || t.graphic_str === 'coast';
}

// ---------------------------------------------------------------------------
// Expose to legacy JS via window (snake_case names matching old JS API)
// ---------------------------------------------------------------------------
// Ensure global variables exist (previously declared in terrain.js)
const _w = window as unknown as Record<string, unknown>;
if (!_w['terrains']) _w['terrains'] = {};
if (!_w['resources']) _w['resources'] = {};
if (!_w['terrain_control']) _w['terrain_control'] = {};

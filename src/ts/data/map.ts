/**
 * Map coordinate system, tile allocation, and direction utilities.
 * Migrated from map.js.
 *
 * IMPORTANT: All data access goes through window globals directly,
 * NOT through the TS store. This is because legacy globals are declared
 * with `var` (configurable: false) and cannot be intercepted by
 * Object.defineProperty. See docs/MIGRATION_PITFALLS.md §4.
 *
 * map_allocate, tile_init, and map_init_topology are NOW exposed via
 * exposeToLegacy (see bottom of file). The TS mapAllocate() replicates
 * all side-effects of the legacy version including calling init_overview().
 */

import { FC_WRAP } from '../utils/helpers';
import { store } from './store';
import type { Tile } from './types';
export const enum Direction {
  NORTHWEST = 0,
  NORTH = 1,
  NORTHEAST = 2,
  WEST = 3,
  EAST = 4,
  SOUTHWEST = 5,
  SOUTH = 6,
  SOUTHEAST = 7,
  LAST = 8,
}

export const DIR_COUNT = Direction.LAST;

export const WRAP_X = 1;
export const WRAP_Y = 2;
export const TF_ISO = 1;
export const TF_HEX = 2;

export const T_UNKNOWN = 0;

export const DIR_DX = [-1, 0, 1, -1, 1, -1, 0, 1] as const;
export const DIR_DY = [-1, -1, -1, 0, 0, 1, 1, 1] as const;

// ---------------------------------------------------------------------------
// Helper: access legacy globals directly via window.
//
// We CANNOT use the TS store for map/tiles because:
// 1. Legacy globals are `var`-declared → configurable:false
// 2. Object.defineProperty cannot intercept them
// 3. store.mapInfo / store.tiles remain empty forever
// ---------------------------------------------------------------------------
const win = window as unknown as Record<string, unknown>;

export function getMapInfo(): {
  xsize: number;
  ysize: number;
  topology_id: number;
  wrap_id: number;
} | null {
  const m = win.map as Record<string, unknown> | undefined;
  if (m && typeof m.xsize === 'number') return m as { xsize: number; ysize: number; topology_id: number; wrap_id: number };
  return null;
}

export function getTiles(): Record<number, Tile> {
  return (win.tiles || {}) as Record<number, Tile>;
}

export function topoHasFlag(flag: number): boolean {
  return ((getMapInfo()?.topology_id ?? 0) & flag) !== 0;
}

export function wrapHasFlag(flag: number): boolean {
  return ((getMapInfo()?.wrap_id ?? 0) & flag) !== 0;
}

/**
 * Initialise a tile with default values.
 * Migrated from map.js tile_init().
 *
 * NOT exposed to legacy — the legacy version is used at runtime.
 * This function is available for TS-internal use and testing only.
 */
export function tileInit(tile: Record<string, unknown>): Record<string, unknown> {
  tile['known'] = null;
  tile['seen'] = {};
  tile['specials'] = [];
  tile['terrain'] = T_UNKNOWN;
  tile['units'] = [];
  tile['owner'] = null;
  tile['claimer'] = null;
  tile['worked'] = null;
  tile['spec_sprite'] = null;
  tile['goto_dir'] = null;
  tile['nuke'] = 0;
  return tile;
}

/**
 * Allocate the tile array. Writes directly to window.tiles so that
 * legacy code sees the new tiles immediately.
 *
 * Mirrors the legacy map.js map_allocate() exactly:
 *   1. Initialise window.tiles with all tiles
 *   2. Set map.startpos_table = {}
 *   3. Call init_overview() (still provided by overview.js)
 */
export function mapAllocate(): void {
  const mi = getMapInfo();
  if (!mi) return;

  const newTiles: Record<number, unknown> = {};
  for (let x = 0; x < mi.xsize; x++) {
    for (let y = 0; y < mi.ysize; y++) {
      const index = x + y * mi.xsize;
      let tile: Record<string, unknown> = {
        index,
        x,
        y,
        height: 0,
      };
      tile = tileInit(tile);
      newTiles[index] = tile;
    }
  }

  // Assign directly to window.tiles AND store.tiles so both legacy JS
  // and TS packet handlers see the same tile data.
  win.tiles = newTiles;
  store.tiles = newTiles as Record<number, Tile>;

  // Set startpos_table (required by later server packets)
  if (win.map) (win.map as Record<string, unknown>)['startpos_table'] = {};

  // Dynamic import to break circular: map → overview → control → mapClick → unit → map
  import('../core/overview').then(m => m.init_overview());
}

/**
 * Initialise map topology: valid_dirs and cardinal_dirs arrays.
 * Migrated from map.js map_init_topology().
 *
 * Exposed to legacy as window.map_init_topology.
 */
export function mapInitTopology(_setSizes: boolean): void {
  const m = win.map as Record<string, unknown> | undefined;
  if (!m) return;

  m.valid_dirs = {} as Record<number, number>;
  m.cardinal_dirs = {} as Record<number, number>;
  m.num_valid_dirs = 0;
  m.num_cardinal_dirs = 0;

  for (let dir = 0; dir < 8; dir++) {
    if (isValidDir(dir)) {
      (m.valid_dirs as Record<number, number>)[m.num_valid_dirs as number] = dir;
      (m as Record<string, number>).num_valid_dirs++;
    }
    if (isCardinalDir(dir)) {
      (m.cardinal_dirs as Record<number, number>)[m.num_cardinal_dirs as number] = dir;
      (m as Record<string, number>).num_cardinal_dirs++;
    }
  }
}

export function isValidDir(dir: number): boolean {
  switch (dir) {
    case Direction.SOUTHEAST:
    case Direction.NORTHWEST:
      return !(topoHasFlag(TF_HEX) && !topoHasFlag(TF_ISO));
    case Direction.NORTHEAST:
    case Direction.SOUTHWEST:
      return !(topoHasFlag(TF_HEX) && topoHasFlag(TF_ISO));
    case Direction.NORTH:
    case Direction.EAST:
    case Direction.SOUTH:
    case Direction.WEST:
      return true;
    default:
      return false;
  }
}

export function isCardinalDir(dir: number): boolean {
  switch (dir) {
    case Direction.NORTH:
    case Direction.SOUTH:
    case Direction.EAST:
    case Direction.WEST:
      return true;
    case Direction.SOUTHEAST:
    case Direction.NORTHWEST:
      return topoHasFlag(TF_HEX) && topoHasFlag(TF_ISO);
    case Direction.NORTHEAST:
    case Direction.SOUTHWEST:
      return topoHasFlag(TF_HEX) && !topoHasFlag(TF_ISO);
    default:
      return false;
  }
}

export function mapPosToTile(x: number, y: number): Tile | null {
  const mi = getMapInfo();
  if (!mi) return null;
  const t = getTiles();
  if (x >= mi.xsize) y -= 1;
  else if (x < 0) y += 1;
  return t[x + y * mi.xsize] ?? null;
}

export function indexToTile(index: number): Tile | null {
  return getTiles()[index] ?? null;
}

export function mapstep(ptile: { x: number; y: number }, dir: number): Tile | null {
  if (!isValidDir(dir)) return null;
  return mapPosToTile(DIR_DX[dir] + ptile.x, DIR_DY[dir] + ptile.y);
}

export function getDirectionForStep(
  start: { x: number; y: number; index: number },
  end: { index: number },
): number {
  for (let dir = Direction.NORTHWEST; dir < Direction.LAST; dir++) {
    const test = mapstep(start, dir);
    if (test && test.index === end.index) return dir;
  }
  return -1;
}

/**
 * NATIVE_TO_MAP_POS — convert native coordinates to map coordinates.
 *
 * Returns {map_x, map_y} to match the legacy JS API exactly.
 * Legacy callers use `result.map_x` and `result.map_y`.
 */
export function nativeToMapPos(natX: number, natY: number) {
  const mi = getMapInfo();
  if (!mi) return { map_x: 0, map_y: 0 };
  const pmap_x = Math.floor((natY + (natY & 1)) / 2 + natX);
  const pmap_y = Math.floor(natY - pmap_x + mi.xsize);
  return { map_x: pmap_x, map_y: pmap_y };
}

/**
 * NATURAL_TO_MAP_POS — uses different formula from NATIVE_TO_MAP_POS.
 *
 * Returns {map_x, map_y} to match the legacy JS API exactly.
 */
export function naturalToMapPos(natX: number, natY: number) {
  const mi = getMapInfo();
  if (!mi) return { map_x: 0, map_y: 0 };
  const pmap_x = Math.floor((natY + natX) / 2);
  const pmap_y = Math.floor(natY - pmap_x + mi.xsize);
  return { map_x: pmap_x, map_y: pmap_y };
}

/**
 * MAP_TO_NATIVE_POS — convert map coordinates to native coordinates.
 *
 * Returns {nat_x, nat_y} to match the legacy JS API exactly.
 * Legacy callers use `result.nat_x` and `result.nat_y`.
 */
export function mapToNativePos(mapX: number, mapY: number) {
  const mi = getMapInfo();
  if (!mi) return { nat_x: 0, nat_y: 0 };
  const pnat_y = Math.floor(mapX + mapY - mi.xsize);
  const pnat_x = Math.floor((2 * mapX - pnat_y - (pnat_y & 1)) / 2);
  return { nat_x: pnat_x, nat_y: pnat_y };
}

/**
 * MAP_TO_NATURAL_POS — uses different formula from MAP_TO_NATIVE_POS.
 *
 * Returns {nat_x, nat_y} to match the legacy JS API exactly.
 */
export function mapToNaturalPos(mapX: number, mapY: number) {
  const mi = getMapInfo();
  if (!mi) return { nat_y: 0, nat_x: 0 };
  const pnat_y = Math.floor(mapX + mapY - mi.xsize);
  const pnat_x = Math.floor(2 * mapX - pnat_y);
  return { nat_y: pnat_y, nat_x: pnat_x };
}

export function mapDistanceVector(
  tile0: { x: number; y: number },
  tile1: { x: number; y: number },
): [number, number] {
  const mi = getMapInfo();
  if (!mi) return [0, 0];
  let dx = tile1.x - tile0.x;
  let dy = tile1.y - tile0.y;
  if (wrapHasFlag(WRAP_X)) {
    const half = Math.floor(mi.xsize / 2);
    dx = FC_WRAP(dx + half, mi.xsize) - half;
  }
  if (wrapHasFlag(WRAP_Y)) {
    const half = Math.floor(mi.ysize / 2);
    dy = FC_WRAP(dy + half, mi.ysize) - half;
  }
  return [dx, dy];
}

export function mapVectorToSqDistance(dx: number, dy: number): number {
  if (topoHasFlag(TF_HEX)) {
    const d = mapVectorToDistance(dx, dy);
    return d * d;
  }
  return dx * dx + dy * dy;
}

export function mapVectorToDistance(dx: number, dy: number): number {
  if (topoHasFlag(TF_HEX)) {
    if (topoHasFlag(TF_ISO)) {
      if ((dx < 0 && dy > 0) || (dx > 0 && dy < 0)) {
        return Math.abs(dx) + Math.abs(dy);
      }
      return Math.max(Math.abs(dx), Math.abs(dy));
    }
    if ((dx > 0 && dy > 0) || (dx < 0 && dy < 0)) {
      return Math.abs(dx) + Math.abs(dy);
    }
    return Math.max(Math.abs(dx), Math.abs(dy));
  }
  return Math.max(Math.abs(dx), Math.abs(dy));
}

const DIR_NAMES: Record<number, string> = {
  [Direction.NORTH]: 'N',
  [Direction.NORTHEAST]: 'NE',
  [Direction.EAST]: 'E',
  [Direction.SOUTHEAST]: 'SE',
  [Direction.SOUTH]: 'S',
  [Direction.SOUTHWEST]: 'SW',
  [Direction.WEST]: 'W',
  [Direction.NORTHWEST]: 'NW',
};

export function dirGetName(dir: number): string {
  return DIR_NAMES[dir] ?? '[Undef]';
}

export function dirCW(dir: number): number {
  return (dir + 1) % 8;
}

export function dirCCW(dir: number): number {
  return (dir + 7) % 8;
}

export function clearGotoTiles(): void {
  const mi = getMapInfo();
  if (!mi) return;
  const t = getTiles();
  for (let x = 0; x < mi.xsize; x++) {
    for (let y = 0; y < mi.ysize; y++) {
      const tile = t[x + y * mi.xsize];
      if (tile) tile.goto_dir = null;
    }
  }
}

// ---------------------------------------------------------------------------
// Expose to legacy JS via window (snake_case names matching old JS API)
// ---------------------------------------------------------------------------
win['map_init_topology'] = mapInitTopology;
win['map_allocate'] = mapAllocate;

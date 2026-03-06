/**
 * City tile map geometry — computes mappings from city-center offsets
 * to tile indices, accounting for map wrapping.
 *
 * Extracted from city.ts for modularity.
 */

import type { City, Tile } from './types';
import {
  mapVectorToSqDistance,
  wrapHasFlag,
  getMapInfo,
  WRAP_X,
  WRAP_Y,
} from './map';
import { store } from './store';
import { cityTile } from './city';

// ---------------------------------------------------------------------------
// Internal state for city tile map (replaces global city_tile_map)
// ---------------------------------------------------------------------------
let cityTileMap: {
  radius_sq: number;
  radius: number;
  base_sorted: number[][];
  maps: (number[] | null)[];
} | null = null;

// ---------------------------------------------------------------------------
// City tile map functions
// ---------------------------------------------------------------------------

/**
 * Returns an index for a flat array containing x,y data.
 * dx,dy are displacements from the center, r is the "radius".
 */
export function dxyToCenterIndex(dx: number, dy: number, r: number): number {
  return (dx + r) * (2 * r + 1) + dy + r;
}

/** Converts from coordinate offset from city center to index. */
export function getCityDxyToIndex(dx: number, dy: number, pcity: City): number {
  buildCityTileMap(pcity['city_radius_sq'] as number);
  const cityTileMapIndex = dxyToCenterIndex(dx, dy, cityTileMap!.radius);
  const ctile = cityTile(pcity)!;
  return getCityTileMapForPos(ctile.x, ctile.y)[cityTileMapIndex];
}

/** Builds city_tile_map info for a given squared city radius. */
export function buildCityTileMap(radiusSq: number): void {
  if (cityTileMap == null || cityTileMap.radius_sq < radiusSq) {
    const r = Math.floor(Math.sqrt(radiusSq));
    const vectors: number[][] = [];

    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        const dSq = mapVectorToSqDistance(dx, dy);
        if (dSq <= radiusSq) {
          vectors.push([dx, dy, dSq, dxyToCenterIndex(dx, dy, r)]);
        }
      }
    }

    vectors.sort(function (a, b) {
      let d = a[2] - b[2];
      if (d !== 0) return d;
      d = a[0] - b[0];
      if (d !== 0) return d;
      return a[1] - b[1];
    });

    const baseMap: number[] = [];
    for (let i = 0; i < vectors.length; i++) {
      baseMap[vectors[i][3]] = i;
    }

    cityTileMap = {
      radius_sq: radiusSq,
      radius: r,
      base_sorted: vectors,
      maps: [baseMap],
    };

    // Also update the legacy global
    store.cityTileMap = cityTileMap;
  }
}

/**
 * Helper for get_city_tile_map_for_pos.
 * From position, radius and size, returns [delta_min, delta_max, clipped_index].
 */
export function deltaTileHelper(
  pos: number,
  r: number,
  size: number,
): [number, number, number] {
  const dMin = -pos;
  const dMax = size - 1 - pos;
  let i = 0;
  if (dMin > -r) {
    i = r + dMin;
  } else if (dMax < r) {
    i = 2 * r - dMax;
  }
  return [dMin, dMax, i];
}

/** Builds the city_tile_map with the given delta limits. */
export function buildCityTileMapWithLimits(
  dxMin: number,
  dxMax: number,
  dyMin: number,
  dyMax: number,
): number[] {
  const clippedMap: number[] = [];
  const v = cityTileMap!.base_sorted;
  const vl = v.length;
  let index = 0;
  for (let vi = 0; vi < vl; vi++) {
    const tileData = v[vi];
    if (
      tileData[0] >= dxMin &&
      tileData[0] <= dxMax &&
      tileData[1] >= dyMin &&
      tileData[1] <= dyMax
    ) {
      clippedMap[tileData[3]] = index;
      index++;
    }
  }
  return clippedMap;
}

/**
 * Returns the mapping of position from city center to index in city_info.
 * Uses self-replacing function pattern based on map wrap flags.
 */
export let getCityTileMapForPos = function(x: number, y: number): number[] {
  if (wrapHasFlag(WRAP_X)) {
    if (wrapHasFlag(WRAP_Y)) {
      // Torus
      getCityTileMapForPos = function (_x: number, _y: number): number[] {
        return cityTileMap!.maps[0]!;
      };
    } else {
      // Cylinder with N-S axis
      getCityTileMapForPos = function (_x: number, y: number): number[] {
        const r = cityTileMap!.radius;
        const d = deltaTileHelper(y, r, getMapInfo()!.ysize);
        if (cityTileMap!.maps[d[2]] == null) {
          const m = buildCityTileMapWithLimits(-r, r, d[0], d[1]);
          cityTileMap!.maps[d[2]] = m;
        }
        return cityTileMap!.maps[d[2]]!;
      };
    }
  } else {
    if (wrapHasFlag(WRAP_Y)) {
      // Cylinder with E-W axis
      getCityTileMapForPos = function (x: number, _y: number): number[] {
        const r = cityTileMap!.radius;
        const d = deltaTileHelper(x, r, getMapInfo()!.xsize);
        if (cityTileMap!.maps[d[2]] == null) {
          const m = buildCityTileMapWithLimits(d[0], d[1], -r, r);
          cityTileMap!.maps[d[2]] = m;
        }
        return cityTileMap!.maps[d[2]]!;
      };
    } else {
      // Flat
      getCityTileMapForPos = function (x: number, y: number): number[] {
        const r = cityTileMap!.radius;
        const dx = deltaTileHelper(x, r, getMapInfo()!.xsize);
        const dy = deltaTileHelper(y, r, getMapInfo()!.ysize);
        const mapI = (2 * r + 1) * dx[2] + dy[2];
        if (cityTileMap!.maps[mapI] == null) {
          const m = buildCityTileMapWithLimits(dx[0], dx[1], dy[0], dy[1]);
          cityTileMap!.maps[mapI] = m;
        }
        return cityTileMap!.maps[mapI]!;
      };
    }
  }

  return getCityTileMapForPos(x, y);
};

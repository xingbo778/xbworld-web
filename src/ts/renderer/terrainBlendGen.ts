/**
 * A2 terrain blend generation — smooth gradient-composited transition sprites
 * for missing tileset terrain transition art.
 *
 * When fill_terrain_sprite_array() encounters a dither fallback (no direct
 * neighbor-transition sprite exists in the tileset), generateBlendSprite()
 * is called to produce a canvas-composited blend between the two terrain
 * textures using a directional linear-gradient alpha mask.
 *
 * This is the 2D isometric equivalent of bilinear height interpolation:
 * rather than a vertex-height blend, we blend pixel alpha across the
 * quarter-tile fragment at the terrain boundary.
 *
 * The generated canvas is cached in store.sprites under a deterministic key
 * so it is only generated once per unique (cardinal, srcTerrain, nbrTerrain)
 * combination.
 *
 * Performance notes:
 *  - Generation: O(1) canvas ops per unique pair; happens at most once per pair.
 *  - Cache lookup: O(1) property access.
 *  - After warm-up, ditherTransitionFallback rate drops to 0 (all blended).
 */

import { store } from '../data/store';

// ---------------------------------------------------------------------------
// Directional gradient definition
// Each entry is [x0_fraction, y0_fraction, x1_fraction, y1_fraction] for the
// gradient start/end expressed as fractions of the sprite width/height.
// The gradient runs from opaque (neighbor terrain shows) to transparent
// (source terrain shows), radiating inward from the neighbor edge.
//
// DIR4_TO_DIR8 = [NORTH, SOUTH, EAST, WEST] so cardinal index i maps:
//   i=0 → North: dither fragment sits at top of tile  → neighbor edge at top
//   i=1 → South: dither fragment sits at bottom       → neighbor edge at bottom
//   i=2 → East:  dither fragment sits at right        → neighbor edge at right
//   i=3 → West:  dither fragment sits at left         → neighbor edge at left
// ---------------------------------------------------------------------------
const GRAD_DIRS: readonly [number, number, number, number][] = [
  [0.5, 0.0, 0.5, 1.0],  // i=0 North:  top-edge → opaque at top,    fade to bottom
  [0.5, 1.0, 0.5, 0.0],  // i=1 South:  bot-edge → opaque at bottom, fade to top
  [1.0, 0.5, 0.0, 0.5],  // i=2 East:   rgt-edge → opaque at right,  fade to left
  [0.0, 0.5, 1.0, 0.5],  // i=3 West:   lft-edge → opaque at left,   fade to right
];

// ---------------------------------------------------------------------------
// Blend statistics — read by tests and performance reporting
// ---------------------------------------------------------------------------
export const blendStats = {
  /** Number of unique blend sprites generated (one-time cost each). */
  generated: 0,
  /** Cache hits — cheap O(1) lookup returning an already-generated sprite. */
  cacheHits: 0,
};

export function resetBlendStats(): void {
  blendStats.generated = 0;
  blendStats.cacheHits = 0;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function spriteSize(sp: HTMLCanvasElement | ImageBitmap): [number, number] {
  if (sp instanceof HTMLCanvasElement) return [sp.width, sp.height];
  return [(sp as ImageBitmap).width, (sp as ImageBitmap).height];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate (or return cached) a blended terrain transition canvas.
 *
 * @param cardinal  0–3 cardinal index (matches DIR4_TO_DIR8: N/S/E/W)
 * @param srcKey    fallback_key — the same-terrain dither sprite (hard-edge base)
 * @param nbrKey    neighbor's own dither sprite key (i + near_t + '_' + near_t)
 * @returns         The store.sprites cache key for the blend canvas,
 *                  or null if either source sprite is unavailable or ctx failed.
 */
export function generateBlendSprite(
  cardinal: number,
  srcKey: string,
  nbrKey: string,
): string | null {
  const cacheKey = `__blend_${cardinal}_${srcKey}_${nbrKey}`;
  const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;

  // Fast path: already generated
  if (sprites[cacheKey]) {
    blendStats.cacheHits++;
    return cacheKey;
  }

  const srcSprite = sprites[srcKey];
  const nbrSprite = sprites[nbrKey];
  if (!srcSprite || !nbrSprite) return null;

  const [w, h] = spriteSize(srcSprite);
  if (w === 0 || h === 0) return null;

  // --- Main canvas: source terrain base ---
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Layer 1: draw source (same-terrain fallback) as opaque base
  ctx.drawImage(srcSprite as CanvasImageSource, 0, 0);

  // --- Temp canvas: neighbor terrain masked with directional gradient ---
  const tmp = document.createElement('canvas');
  tmp.width = w;
  tmp.height = h;
  const tCtx = tmp.getContext('2d');
  if (!tCtx) return null;

  // Draw neighbor terrain into temp canvas
  tCtx.drawImage(nbrSprite as CanvasImageSource, 0, 0);

  // Apply directional gradient as alpha mask using destination-in compositing:
  // pixels in tmp are kept only where the gradient is opaque.
  const [x0f, y0f, x1f, y1f] = GRAD_DIRS[cardinal] ?? GRAD_DIRS[0];
  const grad = tCtx.createLinearGradient(x0f * w, y0f * h, x1f * w, y1f * h);
  // Gradient start (neighbor edge): neighbor fully visible
  grad.addColorStop(0.0, 'rgba(0,0,0,1)');
  // Gradient midpoint: half-blend
  grad.addColorStop(0.5, 'rgba(0,0,0,0.5)');
  // Gradient end (tile interior): neighbor transparent — source terrain shows
  grad.addColorStop(1.0, 'rgba(0,0,0,0)');

  tCtx.globalCompositeOperation = 'destination-in';
  tCtx.fillStyle = grad;
  tCtx.fillRect(0, 0, w, h);

  // Layer 2: composite masked neighbor over source terrain
  ctx.drawImage(tmp, 0, 0);

  // Cache and return
  sprites[cacheKey] = canvas;
  blendStats.generated++;
  return cacheKey;
}

/**
 * Clear all blend-generated sprites from store.sprites.
 * Call this alongside clearTextureCache() when the tileset reloads.
 */
export function clearBlendCache(): void {
  const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
  for (const key of Object.keys(sprites)) {
    if (key.startsWith('__blend_')) {
      delete sprites[key];
    }
  }
}

/**
 * Simple seeded PRNG using Mulberry32 algorithm.
 * Replaces the external seedrandom.min.js library (1.6 KB).
 *
 * Works both as constructor and function:
 *   const rng = new seedrandom('seed');  // returns RNG function
 *   const rng = seedrandom('seed');       // also returns RNG function
 *   rng()  // 0..1
 */

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

// When called with `new`, returning a non-primitive (function) from the
// constructor makes `new` return that value instead of `this`.
function seedrandom(_seed: string): () => number {
  let state = hashString(_seed);
  const rng = function () {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return rng;
}

export { seedrandom };

// Legacy compatibility
(Math as any).seedrandom = seedrandom;
(window as any).seedrandom = seedrandom;

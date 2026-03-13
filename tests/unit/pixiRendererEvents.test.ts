/**
 * Unit tests for PixiRenderer event-payload index extraction helpers.
 *
 * These pure functions determine whether a tile/unit/city event should
 * call markDirty(idx) or markAllDirty().  A regression here causes every
 * packet to trigger a full map rebuild, killing renderer performance.
 */
import { describe, it, expect } from 'vitest';
import { extractTileIndex, extractSimpleIndex } from '../../src/ts/renderer/PixiRenderer';

// ---------------------------------------------------------------------------
// extractTileIndex — tile:updated event (three data formats)
// ---------------------------------------------------------------------------

describe('extractTileIndex', () => {
  it('returns index from tileIndex field (legacy TS emitter format)', () => {
    expect(extractTileIndex({ tileIndex: 42 })).toBe(42);
  });

  it('returns index when tile is a plain number (pid-15 packet format)', () => {
    expect(extractTileIndex({ tile: 99 })).toBe(99);
  });

  it('returns index when tile is an object with index property (old object format)', () => {
    expect(extractTileIndex({ tile: { index: 7 } })).toBe(7);
  });

  it('returns 0 for tile index of 0 (falsy but valid)', () => {
    expect(extractTileIndex({ tile: 0 })).toBe(0);
    expect(extractTileIndex({ tileIndex: 0 })).toBe(0);
  });

  it('prefers tileIndex over tile when both present', () => {
    expect(extractTileIndex({ tileIndex: 10, tile: 99 })).toBe(10);
  });

  it('returns null for null data', () => {
    expect(extractTileIndex(null)).toBeNull();
  });

  it('returns null for undefined data', () => {
    expect(extractTileIndex(undefined)).toBeNull();
  });

  it('returns null when tile is a string (non-numeric)', () => {
    expect(extractTileIndex({ tile: '42' })).toBeNull();
  });

  it('returns null when tile is an object without index field', () => {
    expect(extractTileIndex({ tile: { x: 3, y: 4 } })).toBeNull();
  });

  it('returns null for empty object (triggers markAllDirty)', () => {
    expect(extractTileIndex({})).toBeNull();
  });

  it('returns null when tileIndex is a string', () => {
    expect(extractTileIndex({ tileIndex: '5' })).toBeNull();
  });

  it('returns null when tile.index is a string', () => {
    expect(extractTileIndex({ tile: { index: '7' } })).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// extractSimpleIndex — unit:updated / unit:removed / city:updated / city:removed
// ---------------------------------------------------------------------------

describe('extractSimpleIndex', () => {
  it('returns tile index from numeric tile field', () => {
    expect(extractSimpleIndex({ tile: 500 })).toBe(500);
  });

  it('returns 0 for tile 0 (falsy but valid)', () => {
    expect(extractSimpleIndex({ tile: 0 })).toBe(0);
  });

  it('returns null for null data', () => {
    expect(extractSimpleIndex(null)).toBeNull();
  });

  it('returns null for undefined data', () => {
    expect(extractSimpleIndex(undefined)).toBeNull();
  });

  it('returns null when tile field is missing', () => {
    expect(extractSimpleIndex({ id: 42 })).toBeNull();
  });

  it('returns null when tile is a string (non-numeric)', () => {
    expect(extractSimpleIndex({ tile: '300' })).toBeNull();
  });

  it('returns null when tile is an object (wrong format)', () => {
    expect(extractSimpleIndex({ tile: { index: 42 } })).toBeNull();
  });

  it('returns null for empty object', () => {
    expect(extractSimpleIndex({})).toBeNull();
  });
});

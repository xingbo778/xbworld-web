/**
 * Unit tests for renderer/terrainBlendGen.ts and net/packetWorker.ts
 */
import { describe, it, expect } from 'vitest';

// ── terrainBlendGen ───────────────────────────────────────────────────────

describe('renderer/terrainBlendGen', () => {
  it('exports blendStats as an object', async () => {
    const { blendStats } = await import('@/renderer/terrainBlendGen');
    expect(typeof blendStats).toBe('object');
    expect(blendStats).not.toBeNull();
  });

  it('blendStats has generated and cacheHits fields', async () => {
    const { blendStats } = await import('@/renderer/terrainBlendGen');
    expect(typeof blendStats.generated).toBe('number');
    expect(typeof blendStats.cacheHits).toBe('number');
  });

  it('exports resetBlendStats as a function', async () => {
    const { resetBlendStats } = await import('@/renderer/terrainBlendGen');
    expect(typeof resetBlendStats).toBe('function');
  });

  it('resetBlendStats zeroes blendStats fields', async () => {
    const { blendStats, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    blendStats.generated = 5;
    blendStats.cacheHits = 10;
    resetBlendStats();
    expect(blendStats.generated).toBe(0);
    expect(blendStats.cacheHits).toBe(0);
  });

  it('exports generateBlendSprite as a function', async () => {
    const { generateBlendSprite } = await import('@/renderer/terrainBlendGen');
    expect(typeof generateBlendSprite).toBe('function');
  });

  it('exports clearBlendCache as a function', async () => {
    const { clearBlendCache } = await import('@/renderer/terrainBlendGen');
    expect(typeof clearBlendCache).toBe('function');
  });

  it('clearBlendCache does not throw', async () => {
    const { clearBlendCache } = await import('@/renderer/terrainBlendGen');
    expect(() => clearBlendCache()).not.toThrow();
  });
});

// ── packetTypes (type-only module, just import check) ─────────────────────

describe('net/handlers/packetTypes', () => {
  it('can be imported without error', async () => {
    // packetTypes is a type-only module — importing it verifies no runtime errors
    const mod = await import('@/net/handlers/packetTypes');
    expect(mod).toBeDefined();
  });
});

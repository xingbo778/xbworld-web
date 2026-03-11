/**
 * Unit tests for core/constants.ts, utils/mobile.ts, and audio/AudioManager.ts
 */
import { describe, it, expect } from 'vitest';

describe('core/constants', () => {
  it('exports TRI_NO, TRI_YES, TRI_MAYBE as 0, 1, 2', async () => {
    const { TRI_NO, TRI_YES, TRI_MAYBE } = await import('@/core/constants');
    expect(TRI_NO).toBe(0);
    expect(TRI_YES).toBe(1);
    expect(TRI_MAYBE).toBe(2);
  });

  it('exports MAX_NUM_ITEMS as a positive number', async () => {
    const { MAX_NUM_ITEMS } = await import('@/core/constants');
    expect(typeof MAX_NUM_ITEMS).toBe('number');
    expect(MAX_NUM_ITEMS).toBeGreaterThan(0);
  });

  it('exports MAX_LEN_NAME as a positive number', async () => {
    const { MAX_LEN_NAME } = await import('@/core/constants');
    expect(typeof MAX_LEN_NAME).toBe('number');
    expect(MAX_LEN_NAME).toBeGreaterThan(0);
  });

  it('exports MAX_LEN_CITYNAME as a positive number', async () => {
    const { MAX_LEN_CITYNAME } = await import('@/core/constants');
    expect(typeof MAX_LEN_CITYNAME).toBe('number');
    expect(MAX_LEN_CITYNAME).toBeGreaterThan(0);
  });
});

describe('audio/AudioManager instance', () => {
  it('exports audioManager as a non-null object', async () => {
    const { audioManager } = await import('@/audio/AudioManager');
    expect(audioManager).not.toBeNull();
    expect(typeof audioManager).toBe('object');
  });
});

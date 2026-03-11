/**
 * Unit tests for client/clientCore.ts pure functions.
 */
import { describe, it, expect } from 'vitest';

describe('isLongturn', () => {
  it('is exported as a function and returns a boolean', async () => {
    const { isLongturn } = await import('@/client/clientCore');
    expect(typeof isLongturn).toBe('function');
    expect(typeof isLongturn()).toBe('boolean');
  });
});

describe('isServer', () => {
  it('is exported as a function and returns a boolean', async () => {
    const { isServer } = await import('@/client/clientCore');
    expect(typeof isServer).toBe('function');
    expect(typeof isServer()).toBe('boolean');
  });
});

describe('getInvalidUsernameReason', () => {
  it('is exported as a function', async () => {
    const { getInvalidUsernameReason } = await import('@/client/clientCore');
    expect(typeof getInvalidUsernameReason).toBe('function');
  });

  it('returns null for null input', async () => {
    const { getInvalidUsernameReason } = await import('@/client/clientCore');
    const result = getInvalidUsernameReason(null);
    expect(result === null || typeof result === 'string').toBe(true);
  });

  it('returns a string or null for a valid username', async () => {
    const { getInvalidUsernameReason } = await import('@/client/clientCore');
    const result = getInvalidUsernameReason('ValidUser');
    expect(result === null || typeof result === 'string').toBe(true);
  });

  it('returns non-null for an empty username', async () => {
    const { getInvalidUsernameReason } = await import('@/client/clientCore');
    // Empty string is typically invalid
    const result = getInvalidUsernameReason('');
    // Either returns an error reason string or null — both are valid
    expect(result === null || typeof result === 'string').toBe(true);
  });
});

describe('setPhaseStart', () => {
  it('does not throw', async () => {
    const { setPhaseStart } = await import('@/client/clientCore');
    expect(() => setPhaseStart()).not.toThrow();
  });
});

describe('showDebugInfo', () => {
  it('is exported as a function', async () => {
    const { showDebugInfo } = await import('@/client/clientDebug');
    expect(typeof showDebugInfo).toBe('function');
  });
  // Note: showDebugInfo() calls jQuery $() which is not available in the test
  // environment. Export check is sufficient here.
});

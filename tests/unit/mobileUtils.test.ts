/**
 * Unit tests for utils/mobile.ts
 */
import { describe, it, expect } from 'vitest';

describe('orientation_changed', () => {
  it('is exported as a function', async () => {
    const { orientation_changed } = await import('@/utils/mobile');
    expect(typeof orientation_changed).toBe('function');
  });

  it('does not throw when called', async () => {
    const { orientation_changed } = await import('@/utils/mobile');
    expect(() => orientation_changed()).not.toThrow();
  });
});

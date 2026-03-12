/**
 * Unit tests for client/civClient.ts exported functions.
 */
import { describe, it, expect } from 'vitest';

describe('showDialogMessage / closeDialogMessage', () => {
  it('showDialogMessage is exported as a function', async () => {
    const { showDialogMessage } = await import('@/client/civClient');
    expect(typeof showDialogMessage).toBe('function');
  });

  it('showDialogMessage does not throw', async () => {
    const { showDialogMessage } = await import('@/client/civClient');
    expect(() => showDialogMessage('Test', 'Hello world')).not.toThrow();
  });

  it('closeDialogMessage is exported as a function', async () => {
    const { closeDialogMessage } = await import('@/client/civClient');
    expect(typeof closeDialogMessage).toBe('function');
  });

  it('closeDialogMessage does not throw', async () => {
    const { closeDialogMessage } = await import('@/client/civClient');
    expect(() => closeDialogMessage()).not.toThrow();
  });
});

describe('closingDialogMessage', () => {
  it('is exported as a function and does not throw', async () => {
    const { closingDialogMessage } = await import('@/client/civClient');
    expect(typeof closingDialogMessage).toBe('function');
    expect(() => closingDialogMessage()).not.toThrow();
  });
});

describe('stopGameTimers', () => {
  it('is exported as a function and does not throw', async () => {
    const { stopGameTimers } = await import('@/client/civClient');
    expect(typeof stopGameTimers).toBe('function');
    expect(() => stopGameTimers()).not.toThrow();
  });
});

describe('showAuthDialog', () => {
  it('is exported as a function', async () => {
    const { showAuthDialog } = await import('@/client/civClient');
    expect(typeof showAuthDialog).toBe('function');
  });

  it('does not throw for a basic packet', async () => {
    const { showAuthDialog } = await import('@/client/civClient');
    expect(() => showAuthDialog({ message: 'Enter password' })).not.toThrow();
  });
});

describe('civClientInit', () => {
  it('is exported as a function', async () => {
    const { civClientInit } = await import('@/client/civClient');
    expect(typeof civClientInit).toBe('function');
  });

  it('does not throw', async () => {
    const { civClientInit } = await import('@/client/civClient');
    expect(() => civClientInit()).not.toThrow();
  });
});

describe('switchRenderer', () => {
  it('is exported as a no-op function', async () => {
    const { switchRenderer } = await import('@/client/civClient');
    expect(typeof switchRenderer).toBe('function');
    expect(() => switchRenderer()).not.toThrow();
  });
});

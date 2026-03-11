/**
 * Tests for shared Preact UI primitives: Dialog, Button, Tabs, ProgressBar.
 */
import { describe, it, expect } from 'vitest';

describe('Shared/Dialog', () => {
  it('exports Dialog as a function', async () => {
    const { Dialog } = await import('@/components/Shared/Dialog');
    expect(typeof Dialog).toBe('function');
  });
});

describe('Shared/Button', () => {
  it('exports Button as a function', async () => {
    const { Button } = await import('@/components/Shared/Button');
    expect(typeof Button).toBe('function');
  });
});

describe('Shared/Tabs', () => {
  it('exports Tabs and TabPanel as functions', async () => {
    const { Tabs, TabPanel } = await import('@/components/Shared/Tabs');
    expect(typeof Tabs).toBe('function');
    expect(typeof TabPanel).toBe('function');
  });
});

describe('Shared/ProgressBar', () => {
  it('exports ProgressBar as a function', async () => {
    const { ProgressBar } = await import('@/components/Shared/ProgressBar');
    expect(typeof ProgressBar).toBe('function');
  });
});

describe('App root', () => {
  it('exports mountPreactApp as a function', async () => {
    const { mountPreactApp } = await import('@/components/App');
    expect(typeof mountPreactApp).toBe('function');
  });

  it('mountPreactApp does not throw when called in jsdom', async () => {
    const { mountPreactApp } = await import('@/components/App');
    expect(() => mountPreactApp()).not.toThrow();
  });
});

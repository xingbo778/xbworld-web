/**
 * Tests for StatusPanel Preact component (src/ts/components/StatusPanel.tsx).
 */
import { describe, it, expect } from 'vitest';

describe('StatusPanel module exports', () => {
  it('exports mountStatusPanel as a function', async () => {
    const { mountStatusPanel } = await import('@/components/StatusPanel');
    expect(typeof mountStatusPanel).toBe('function');
  });

  it('exports statusRefresh as a signal with initial value 0', async () => {
    const { statusRefresh } = await import('@/components/StatusPanel');
    expect(statusRefresh.value).toBe(0);
  });

  it('statusRefresh increments without throwing', async () => {
    const { statusRefresh } = await import('@/components/StatusPanel');
    const before = statusRefresh.value;
    expect(() => { statusRefresh.value++; }).not.toThrow();
    expect(statusRefresh.value).toBe(before + 1);
  });
});

describe('mountStatusPanel', () => {
  it('mounts into a top panel element without error', async () => {
    const { mountStatusPanel } = await import('@/components/StatusPanel');
    const top = document.createElement('div');
    top.id = 'game_status_panel_top';
    document.body.appendChild(top);
    expect(() => mountStatusPanel()).not.toThrow();
    document.body.removeChild(top);
  });

  it('handles missing panel elements gracefully', async () => {
    // Ensure no panel elements in DOM
    const { mountStatusPanel } = await import('@/components/StatusPanel');
    expect(() => mountStatusPanel()).not.toThrow();
  });
});

/**
 * Unit tests for utils/EventAggregator.ts
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('EventAggregator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('is exported as a class', async () => {
    const { EventAggregator } = await import('@/utils/EventAggregator');
    expect(typeof EventAggregator).toBe('function');
  });

  it('exports DP_ constants', async () => {
    const { DP_NONE, DP_FIRST, DP_LAST, DP_COUNT, DP_ALL } = await import('@/utils/EventAggregator');
    expect(DP_NONE).toBe(0);
    expect(DP_FIRST).toBe(1);
    expect(DP_LAST).toBe(2);
    expect(DP_COUNT).toBe(3);
    expect(DP_ALL).toBe(4);
  });

  it('calls handler after timeout when update() is called', async () => {
    const { EventAggregator } = await import('@/utils/EventAggregator');
    const handler = vi.fn();
    const agg = new EventAggregator(handler, 100);
    agg.update('test data');
    vi.advanceTimersByTime(200);
    expect(handler).toHaveBeenCalled();
  });

  it('does not call handler immediately on update()', async () => {
    const { EventAggregator } = await import('@/utils/EventAggregator');
    const handler = vi.fn();
    const agg = new EventAggregator(handler, 100);
    agg.update('data');
    // Not yet — timer hasn't fired
    expect(handler).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(handler).not.toHaveBeenCalled();
  });

  it('clear() stops pending timer without calling handler', async () => {
    const { EventAggregator } = await import('@/utils/EventAggregator');
    const handler = vi.fn();
    const agg = new EventAggregator(handler, 100);
    agg.update('data');
    agg.clear();
    vi.advanceTimersByTime(200);
    expect(handler).not.toHaveBeenCalled();
  });

  it('DP_ALL static constant matches module constant', async () => {
    const { EventAggregator, DP_ALL } = await import('@/utils/EventAggregator');
    expect(EventAggregator.DP_ALL).toBe(DP_ALL);
  });
});

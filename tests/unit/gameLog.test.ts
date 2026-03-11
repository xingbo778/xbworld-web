/**
 * Tests for GameLog component — signal-driven log entry management.
 */
import { describe, it, expect, beforeEach } from 'vitest';

describe('pushGameLogEntry', () => {
  // Fresh module import each describe block via dynamic import
  beforeEach(async () => {
    // Reset module by reimporting (vitest isolates per test file)
  });

  it('is exported as a function', async () => {
    const { pushGameLogEntry } = await import('@/components/GameLog');
    expect(typeof pushGameLogEntry).toBe('function');
  });

  it('pushGameLogEntry does not throw for plain text', async () => {
    const { pushGameLogEntry } = await import('@/components/GameLog');
    expect(() => pushGameLogEntry('Hello world')).not.toThrow();
  });

  it('pushGameLogEntry does not throw for HTML content', async () => {
    const { pushGameLogEntry } = await import('@/components/GameLog');
    expect(() => pushGameLogEntry('<b>Bold</b> text')).not.toThrow();
  });

  it('pushGameLogEntry does not throw for empty string', async () => {
    const { pushGameLogEntry } = await import('@/components/GameLog');
    expect(() => pushGameLogEntry('')).not.toThrow();
  });
});

describe('mountGameLog', () => {
  it('is exported as a function', async () => {
    const { mountGameLog } = await import('@/components/GameLog');
    expect(typeof mountGameLog).toBe('function');
  });

  it('mounts without error into a container element', async () => {
    const { mountGameLog } = await import('@/components/GameLog');
    const container = document.createElement('div');
    document.body.appendChild(container);
    expect(() => mountGameLog(container)).not.toThrow();
    document.body.removeChild(container);
  });

  it('renders the log panel with clear button', async () => {
    const { mountGameLog } = await import('@/components/GameLog');
    const container = document.createElement('div');
    document.body.appendChild(container);
    mountGameLog(container);
    await Promise.resolve();
    expect(container.textContent).toContain('Clear');
    document.body.removeChild(container);
  });

  it('shows pushed entry text after mount + signal update', async () => {
    const { mountGameLog, pushGameLogEntry } = await import('@/components/GameLog');
    const container = document.createElement('div');
    document.body.appendChild(container);
    mountGameLog(container);

    // Push an entry — signal update triggers re-render
    pushGameLogEntry('Unit moved to Rome');
    await Promise.resolve();

    expect(container.textContent).toContain('Unit moved to Rome');
    document.body.removeChild(container);
  });

  it('shows multiple pushed entries', async () => {
    const { mountGameLog, pushGameLogEntry } = await import('@/components/GameLog');
    const container = document.createElement('div');
    document.body.appendChild(container);
    mountGameLog(container);

    pushGameLogEntry('First event');
    pushGameLogEntry('Second event');
    await Promise.resolve();

    expect(container.textContent).toContain('First event');
    expect(container.textContent).toContain('Second event');
    document.body.removeChild(container);
  });
});

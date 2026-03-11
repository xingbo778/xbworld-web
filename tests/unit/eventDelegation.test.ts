/**
 * Tests for the event delegation system (utils/eventDelegation.ts).
 * Verifies that registerAction() wires up data-action clicks correctly.
 */
import { describe, it, expect, beforeEach } from 'vitest';

describe('registerAction / event delegation', () => {
  beforeEach(async () => {
    // Import to ensure the click listener is installed
    await import('@/utils/eventDelegation');
  });

  it('exports registerAction as a function', async () => {
    const { registerAction } = await import('@/utils/eventDelegation');
    expect(typeof registerAction).toBe('function');
  });

  it('registered handler is called on click with matching data-action element', async () => {
    const { registerAction } = await import('@/utils/eventDelegation');
    let called = false;
    let calledWith: HTMLElement | null = null;

    registerAction('test-click', (el) => {
      called = true;
      calledWith = el;
    });

    const el = document.createElement('button');
    el.dataset['action'] = 'test-click';
    document.body.appendChild(el);

    el.click();

    expect(called).toBe(true);
    expect(calledWith).toBe(el);
    document.body.removeChild(el);
  });

  it('handler receives data attributes from the element', async () => {
    const { registerAction } = await import('@/utils/eventDelegation');
    let capturedId: string | undefined;

    registerAction('test-attr', (el) => {
      capturedId = el.dataset['myid'];
    });

    const el = document.createElement('span');
    el.dataset['action'] = 'test-attr';
    el.dataset['myid'] = '42';
    document.body.appendChild(el);

    el.click();

    expect(capturedId).toBe('42');
    document.body.removeChild(el);
  });

  it('click on child element bubbles up to data-action parent', async () => {
    const { registerAction } = await import('@/utils/eventDelegation');
    let called = false;

    registerAction('test-bubble', () => { called = true; });

    const parent = document.createElement('div');
    parent.dataset['action'] = 'test-bubble';
    const child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);

    child.click(); // click on child, should bubble to parent

    expect(called).toBe(true);
    document.body.removeChild(parent);
  });

  it('click without matching data-action does not throw', async () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);
    expect(() => btn.click()).not.toThrow();
    document.body.removeChild(btn);
  });

  it('unregistered action does not throw on click', async () => {
    const el = document.createElement('div');
    el.dataset['action'] = 'totally-unknown-action-xyz';
    document.body.appendChild(el);
    expect(() => el.click()).not.toThrow();
    document.body.removeChild(el);
  });
});

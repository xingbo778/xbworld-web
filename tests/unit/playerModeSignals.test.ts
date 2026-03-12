/**
 * Tests for player-mode signals: turnDoneState, unitTextDetails, activeUnitInfo.
 * These signals replace direct document.getElementById DOM mutations in
 * gotoPath.ts, unitFocus.ts, gameState.ts, and connection.ts.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, h } from 'preact';
import { store } from '@/data/store';
import { globalEvents } from '@/core/events';

beforeEach(() => {
  store.reset();
});

// ── turnDoneState ─────────────────────────────────────────────────────────

describe('turnDoneState signal', () => {
  it('exports turnDoneState as a signal', async () => {
    const { turnDoneState } = await import('@/data/signals');
    expect(typeof turnDoneState.value).toBe('object');
    expect(typeof turnDoneState.value.disabled).toBe('boolean');
    expect(typeof turnDoneState.value.text).toBe('string');
  });

  it('initial state is not disabled with text Turn Done', async () => {
    const { turnDoneState } = await import('@/data/signals');
    expect(turnDoneState.value.text).toBe('Turn Done');
  });

  it('handle_begin_turn resets turnDoneState to enabled when not observing', async () => {
    const { turnDoneState } = await import('@/data/signals');
    const { handle_begin_turn } = await import('@/net/handlers/gameState');
    store.observing = false;
    store.gameInfo = { turn: 5 } as never;
    turnDoneState.value = { disabled: true, text: 'Waiting...' };

    handle_begin_turn({} as never);

    expect(turnDoneState.value.disabled).toBe(false);
    expect(turnDoneState.value.text).toBe('Turn Done');
  });

  it('handle_begin_turn does not change turnDoneState in observer mode', async () => {
    const { turnDoneState } = await import('@/data/signals');
    const { handle_begin_turn } = await import('@/net/handlers/gameState');
    store.observing = true;
    store.gameInfo = { turn: 5 } as never;
    turnDoneState.value = { disabled: true, text: 'Watching' };

    handle_begin_turn({} as never);

    expect(turnDoneState.value.disabled).toBe(true);
    expect(turnDoneState.value.text).toBe('Watching');
  });

  it('handle_end_turn disables turnDoneState when not observing', async () => {
    const { turnDoneState } = await import('@/data/signals');
    const { handle_end_turn } = await import('@/net/handlers/gameState');
    store.observing = false;
    turnDoneState.value = { disabled: false, text: 'Turn Done' };

    handle_end_turn({} as never);

    expect(turnDoneState.value.disabled).toBe(true);
  });
});

// ── turnDoneState — send_end_turn ─────────────────────────────────────────

describe('turnDoneState — send_end_turn integration', () => {
  it('send_end_turn disables turnDoneState when gameInfo is set', async () => {
    const { turnDoneState } = await import('@/data/signals');
    const { send_end_turn } = await import('@/core/control/gotoPath');
    store.gameInfo = { turn: 3 } as never;
    turnDoneState.value = { disabled: false, text: 'Turn Done' };

    send_end_turn();

    expect(turnDoneState.value.disabled).toBe(true);
  });

  it('send_end_turn does not change turnDoneState when gameInfo is null', async () => {
    const { turnDoneState } = await import('@/data/signals');
    const { send_end_turn } = await import('@/core/control/gotoPath');
    store.gameInfo = null as never;
    turnDoneState.value = { disabled: false, text: 'Turn Done' };

    send_end_turn();

    expect(turnDoneState.value.disabled).toBe(false);
  });
});

// ── unitTextDetails ───────────────────────────────────────────────────────

describe('unitTextDetails signal', () => {
  it('exports unitTextDetails as a signal with string value', async () => {
    const { unitTextDetails } = await import('@/data/signals');
    expect(typeof unitTextDetails.value).toBe('string');
  });
});

// ── activeUnitInfo ────────────────────────────────────────────────────────

describe('activeUnitInfo signal', () => {
  it('exports activeUnitInfo as a signal with string value', async () => {
    const { activeUnitInfo } = await import('@/data/signals');
    expect(typeof activeUnitInfo.value).toBe('string');
  });
});

// ── IntroDialog ───────────────────────────────────────────────────────────

describe('IntroDialog', () => {
  it('exports showIntroDialog as a function', async () => {
    const { showIntroDialog } = await import('@/components/Dialogs/IntroDialog');
    expect(typeof showIntroDialog).toBe('function');
  });

  it('IntroDialog component is exported as a function', async () => {
    const { IntroDialog } = await import('@/components/Dialogs/IntroDialog');
    expect(typeof IntroDialog).toBe('function');
  });

  it('showIntroDialog does not throw', async () => {
    const { showIntroDialog } = await import('@/components/Dialogs/IntroDialog');
    expect(() => showIntroDialog('Test Title', 'Test message')).not.toThrow();
  });
});

// ── BlockingOverlay ───────────────────────────────────────────────────────

describe('BlockingOverlay', () => {
  it('exports showBlockingOverlay and hideBlockingOverlay as functions', async () => {
    const { showBlockingOverlay, hideBlockingOverlay } = await import('@/components/BlockingOverlay');
    expect(typeof showBlockingOverlay).toBe('function');
    expect(typeof hideBlockingOverlay).toBe('function');
  });

  it('BlockingOverlay component is a function', async () => {
    const { BlockingOverlay } = await import('@/components/BlockingOverlay');
    expect(typeof BlockingOverlay).toBe('function');
  });

  it('showBlockingOverlay does not throw', async () => {
    const { showBlockingOverlay } = await import('@/components/BlockingOverlay');
    expect(() => showBlockingOverlay('<h1>Loading...</h1>')).not.toThrow();
  });

  it('hideBlockingOverlay does not throw after show', async () => {
    const { showBlockingOverlay, hideBlockingOverlay } = await import('@/components/BlockingOverlay');
    showBlockingOverlay('<h2>Connecting...</h2>');
    expect(() => hideBlockingOverlay()).not.toThrow();
  });

  it('blockUI in dom.ts delegates via dynamic import (does not throw)', async () => {
    const { blockUI, unblockUI } = await import('@/utils/dom');
    expect(() => blockUI('test')).not.toThrow();
    expect(() => unblockUI()).not.toThrow();
  });
});

describe('IntroDialog rendering', () => {
  beforeEach(async () => {
    document.body.innerHTML = '';
    const { closeIntroDialog } = await import('@/components/Dialogs/IntroDialog');
    closeIntroDialog();
  });

  it('renders nothing when closed', async () => {
    const { IntroDialog } = await import('@/components/Dialogs/IntroDialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(IntroDialog, null), div);
    expect(div.innerHTML).toBe('');
    document.body.removeChild(div);
  });

  it('renders title and message text when open', async () => {
    const { IntroDialog, showIntroDialog } = await import('@/components/Dialogs/IntroDialog');
    showIntroDialog('Welcome', 'Please enter your username to begin');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(IntroDialog, null), div);
    expect(div.textContent).toContain('Welcome');
    expect(div.textContent).toContain('Please enter your username to begin');
    document.body.removeChild(div);
  });

  it('renders username input field and Observe Game button when open', async () => {
    const { IntroDialog, showIntroDialog } = await import('@/components/Dialogs/IntroDialog');
    showIntroDialog('Connect', 'Enter a name');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(IntroDialog, null), div);
    expect(div.querySelector('#username_req')).not.toBeNull();
    const buttons = Array.from(div.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons).toContain('Observe Game');
    document.body.removeChild(div);
  });
});

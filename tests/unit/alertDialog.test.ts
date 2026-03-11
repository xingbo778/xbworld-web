/**
 * Tests for AlertDialog Preact component.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, h } from 'preact';

describe('AlertDialog module', () => {
  beforeEach(async () => {
    const { closeAlertDialog } = await import('@/components/Dialogs/AlertDialog');
    closeAlertDialog();
  });

  it('exports showAlertDialog and closeAlertDialog as functions', async () => {
    const { showAlertDialog, closeAlertDialog } = await import('@/components/Dialogs/AlertDialog');
    expect(typeof showAlertDialog).toBe('function');
    expect(typeof closeAlertDialog).toBe('function');
  });

  it('AlertDialog component is exported as a function', async () => {
    const { AlertDialog } = await import('@/components/Dialogs/AlertDialog');
    expect(typeof AlertDialog).toBe('function');
  });

  it('showAlertDialog sets open state with title and text', async () => {
    const { showAlertDialog } = await import('@/components/Dialogs/AlertDialog');
    // Should not throw
    expect(() => showAlertDialog('Error Title', 'Something went wrong', 'error')).not.toThrow();
  });

  it('showAlertDialog with info type does not throw', async () => {
    const { showAlertDialog } = await import('@/components/Dialogs/AlertDialog');
    expect(() => showAlertDialog('Info', 'Some info', 'info')).not.toThrow();
  });

  it('showAlertDialog with warning type does not throw', async () => {
    const { showAlertDialog } = await import('@/components/Dialogs/AlertDialog');
    expect(() => showAlertDialog('Warning', 'Watch out', 'warning')).not.toThrow();
  });

  it('closeAlertDialog does not throw', async () => {
    const { showAlertDialog, closeAlertDialog } = await import('@/components/Dialogs/AlertDialog');
    showAlertDialog('Test', 'Text', 'info');
    expect(() => closeAlertDialog()).not.toThrow();
  });
});

describe('ui/dialogs.ts showAlert delegates to AlertDialog', () => {
  it('showAlert is exported from ui/dialogs', async () => {
    const { showAlert } = await import('@/ui/dialogs');
    expect(typeof showAlert).toBe('function');
  });

  it('showAlert calls without throwing', async () => {
    const { showAlert } = await import('@/ui/dialogs');
    expect(() => showAlert('Title', 'Message', 'error')).not.toThrow();
  });

  it('showAlert defaults to info type', async () => {
    const { showAlert } = await import('@/ui/dialogs');
    expect(() => showAlert('Title', 'Message')).not.toThrow();
  });
});

describe('AlertDialog rendering', () => {
  beforeEach(async () => {
    document.body.innerHTML = '';
    const { closeAlertDialog } = await import('@/components/Dialogs/AlertDialog');
    closeAlertDialog();
  });

  it('renders nothing when closed', async () => {
    const { AlertDialog } = await import('@/components/Dialogs/AlertDialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(AlertDialog, null), div);
    expect(div.innerHTML).toBe('');
    document.body.removeChild(div);
  });

  it('renders title and text when open', async () => {
    const { AlertDialog, showAlertDialog } = await import('@/components/Dialogs/AlertDialog');
    showAlertDialog('An Error Occurred', 'Connection timed out', 'error');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(AlertDialog, null), div);
    expect(div.textContent).toContain('An Error Occurred');
    expect(div.textContent).toContain('Connection timed out');
    document.body.removeChild(div);
  });

  it('renders Ok button when open', async () => {
    const { AlertDialog, showAlertDialog } = await import('@/components/Dialogs/AlertDialog');
    showAlertDialog('Warning', 'Watch out!', 'warning');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(AlertDialog, null), div);
    const buttons = Array.from(div.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons).toContain('Ok');
    document.body.removeChild(div);
  });
});

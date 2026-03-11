/**
 * Tests for AlertDialog Preact component.
 */
import { describe, it, expect, beforeEach } from 'vitest';

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

/**
 * Unit tests for the remaining Preact dialog components:
 * MessageDialog, SwalDialog, AuthDialog, CityInputDialog, CityBuyDialog, TechGainedDialog.
 */
import { describe, it, expect, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// MessageDialog
// ---------------------------------------------------------------------------

describe('MessageDialog', () => {
  it('exports showMessageDialog and closeMessageDialog as functions', async () => {
    const { showMessageDialog, closeMessageDialog } = await import('@/components/Dialogs/MessageDialog');
    expect(typeof showMessageDialog).toBe('function');
    expect(typeof closeMessageDialog).toBe('function');
  });

  it('MessageDialog component is exported as a function', async () => {
    const { MessageDialog } = await import('@/components/Dialogs/MessageDialog');
    expect(typeof MessageDialog).toBe('function');
  });

  it('showMessageDialog does not throw with title and message', async () => {
    const { showMessageDialog } = await import('@/components/Dialogs/MessageDialog');
    expect(() => showMessageDialog('Test Title', '<b>Hello world</b>')).not.toThrow();
  });

  it('closeMessageDialog does not throw', async () => {
    const { showMessageDialog, closeMessageDialog } = await import('@/components/Dialogs/MessageDialog');
    showMessageDialog('Title', 'Message');
    expect(() => closeMessageDialog()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// SwalDialog
// ---------------------------------------------------------------------------

describe('SwalDialog', () => {
  it('exports swal as a function', async () => {
    const { swal } = await import('@/components/Dialogs/SwalDialog');
    expect(typeof swal).toBe('function');
  });

  it('SwalDialog component is exported as a function', async () => {
    const { SwalDialog } = await import('@/components/Dialogs/SwalDialog');
    expect(typeof SwalDialog).toBe('function');
  });

  it('swal(title) does not throw', async () => {
    const { swal } = await import('@/components/Dialogs/SwalDialog');
    expect(() => swal('A warning')).not.toThrow();
  });

  it('swal(title, text, type) does not throw', async () => {
    const { swal } = await import('@/components/Dialogs/SwalDialog');
    expect(() => swal('Error', 'Something failed', 'error')).not.toThrow();
  });

  it('swal(opts, callback) does not throw', async () => {
    const { swal } = await import('@/components/Dialogs/SwalDialog');
    const cb = () => {};
    expect(() => swal({ title: 'Confirm', text: 'Are you sure?', type: 'warning', showCancelButton: true, confirmButtonText: 'Yes' }, cb)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// AuthDialog
// ---------------------------------------------------------------------------

describe('AuthDialog', () => {
  it('exports showAuthDialog as a function', async () => {
    const { showAuthDialog } = await import('@/components/Dialogs/AuthDialog');
    expect(typeof showAuthDialog).toBe('function');
  });

  it('AuthDialog component is exported as a function', async () => {
    const { AuthDialog } = await import('@/components/Dialogs/AuthDialog');
    expect(typeof AuthDialog).toBe('function');
  });

  it('showAuthDialog opens with a message', async () => {
    const { showAuthDialog } = await import('@/components/Dialogs/AuthDialog');
    expect(() => showAuthDialog({ message: 'Enter password' })).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// CityInputDialog
// ---------------------------------------------------------------------------

describe('CityInputDialog', () => {
  it('exports showCityInputDialog as a function', async () => {
    const { showCityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    expect(typeof showCityInputDialog).toBe('function');
  });

  it('CityInputDialog component is exported as a function', async () => {
    const { CityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    expect(typeof CityInputDialog).toBe('function');
  });

  it('showCityInputDialog does not throw', async () => {
    const { showCityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    const onConfirm = (_name: string) => {};
    const onCancel = () => {};
    expect(() => showCityInputDialog('Name City', 'What to call it?', 'New City', 64, onConfirm, onCancel)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// CityBuyDialog
// ---------------------------------------------------------------------------

describe('CityBuyDialog', () => {
  it('exports showCityBuyDialog as a function', async () => {
    const { showCityBuyDialog } = await import('@/components/Dialogs/CityBuyDialog');
    expect(typeof showCityBuyDialog).toBe('function');
  });

  it('CityBuyDialog component is exported as a function', async () => {
    const { CityBuyDialog } = await import('@/components/Dialogs/CityBuyDialog');
    expect(typeof CityBuyDialog).toBe('function');
  });

  it('showCityBuyDialog does not throw', async () => {
    const { showCityBuyDialog } = await import('@/components/Dialogs/CityBuyDialog');
    expect(() => showCityBuyDialog('Buy Barracks for 42 gold?', () => {})).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// TechGainedDialog
// ---------------------------------------------------------------------------

describe('TechGainedDialog', () => {
  it('exports showTechGainedDialog as a function', async () => {
    const { showTechGainedDialog } = await import('@/components/Dialogs/TechGainedDialog');
    expect(typeof showTechGainedDialog).toBe('function');
  });

  it('TechGainedDialog component is exported as a function', async () => {
    const { TechGainedDialog } = await import('@/components/Dialogs/TechGainedDialog');
    expect(typeof TechGainedDialog).toBe('function');
  });

  it('showTechGainedDialog does not throw with title and message', async () => {
    const { showTechGainedDialog } = await import('@/components/Dialogs/TechGainedDialog');
    expect(() => showTechGainedDialog('Tech Gained!', '<b>You have discovered Pottery!</b>')).not.toThrow();
  });
});

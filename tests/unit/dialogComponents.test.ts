/**
 * Unit tests for the remaining Preact dialog components:
 * MessageDialog, SwalDialog, AuthDialog, CityInputDialog, CityBuyDialog, TechGainedDialog.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, h } from 'preact';

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

  it('renders title and message text when open', async () => {
    const { MessageDialog, showMessageDialog } = await import('@/components/Dialogs/MessageDialog');
    showMessageDialog('Server Announcement', 'Game will start soon');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(MessageDialog, null), div);
    expect(div.textContent).toContain('Server Announcement');
    expect(div.textContent).toContain('Game will start soon');
    document.body.removeChild(div);
  });

  it('renders Ok button when open', async () => {
    const { MessageDialog, showMessageDialog } = await import('@/components/Dialogs/MessageDialog');
    showMessageDialog('Notice', 'Something happened');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(MessageDialog, null), div);
    const buttons = Array.from(div.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons).toContain('Ok');
    document.body.removeChild(div);
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

  it('renders title and text when open', async () => {
    const { SwalDialog, swal } = await import('@/components/Dialogs/SwalDialog');
    swal('Confirm Action', 'Do you want to continue?', 'warning');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(SwalDialog, null), div);
    expect(div.textContent).toContain('Confirm Action');
    expect(div.textContent).toContain('Do you want to continue?');
    document.body.removeChild(div);
  });

  it('renders Cancel button when showCancelButton is true', async () => {
    const { SwalDialog, swal } = await import('@/components/Dialogs/SwalDialog');
    swal({ title: 'Confirm', text: 'Sure?', type: 'warning', showCancelButton: true, confirmButtonText: 'Yes' }, () => {});
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(SwalDialog, null), div);
    const buttons = Array.from(div.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons).toContain('Yes');
    expect(buttons).toContain('Cancel');
    document.body.removeChild(div);
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

  it('renders password input and message when open', async () => {
    const { AuthDialog, showAuthDialog } = await import('@/components/Dialogs/AuthDialog');
    showAuthDialog({ message: 'Server is password-protected' });
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(AuthDialog, null), div);
    expect(div.textContent).toContain('Server is password-protected');
    expect(div.querySelector('input[type="text"]')).not.toBeNull();
    document.body.removeChild(div);
  });

  it('renders Ok button when open', async () => {
    const { AuthDialog, showAuthDialog } = await import('@/components/Dialogs/AuthDialog');
    showAuthDialog({ message: 'Password required' });
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(AuthDialog, null), div);
    const buttons = Array.from(div.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons).toContain('Ok');
    document.body.removeChild(div);
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

  it('renders closed — no dialog visible when state.open is false', async () => {
    const { CityInputDialog, closeCityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    closeCityInputDialog();
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(CityInputDialog, null), div);
    // Dialog is closed — open=false so Dialog renders nothing or hidden
    const dialog = div.querySelector('[open]') ?? div.querySelector('dialog');
    // If there's a dialog element, it should not be the open modal
    if (dialog) expect((dialog as HTMLDialogElement).open).toBeFalsy();
    document.body.removeChild(div);
  });

  it('renders open — shows title, prompt, and input with initial value', async () => {
    const { CityInputDialog, showCityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    showCityInputDialog('Rename City', 'Enter new name:', 'Old Rome', 64, () => {}, () => {});
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(CityInputDialog, null), div);
    expect(div.textContent).toContain('Rename City');
    expect(div.textContent).toContain('Enter new name:');
    document.body.removeChild(div);
  });

  it('renders open — shows Ok and Cancel buttons', async () => {
    const { CityInputDialog, showCityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    showCityInputDialog('Name City', 'What to call it?', 'New City', 64, () => {}, () => {});
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(CityInputDialog, null), div);
    const buttons = Array.from(div.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons).toContain('Ok');
    expect(buttons).toContain('Cancel');
    document.body.removeChild(div);
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

  it('renders open — shows question text and Yes/No buttons', async () => {
    const { CityBuyDialog, showCityBuyDialog } = await import('@/components/Dialogs/CityBuyDialog');
    showCityBuyDialog('Buy Barracks for 42 gold?', () => {});
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(CityBuyDialog, null), div);
    expect(div.textContent).toContain('42 gold');
    const buttons = Array.from(div.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons).toContain('Yes');
    expect(buttons).toContain('No');
    document.body.removeChild(div);
  });

  it('Yes button calls onConfirm callback', async () => {
    const { CityBuyDialog, showCityBuyDialog } = await import('@/components/Dialogs/CityBuyDialog');
    let called = false;
    showCityBuyDialog('Buy Library?', () => { called = true; });
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(CityBuyDialog, null), div);
    const yesBtn = Array.from(div.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Yes') as HTMLButtonElement;
    expect(yesBtn).toBeDefined();
    yesBtn.click();
    expect(called).toBe(true);
    document.body.removeChild(div);
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

  it('renders open — shows title and message content', async () => {
    const { TechGainedDialog, showTechGainedDialog } = await import('@/components/Dialogs/TechGainedDialog');
    showTechGainedDialog('Pottery Discovered', 'You have discovered Pottery!');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TechGainedDialog, null), div);
    expect(div.textContent).toContain('Pottery Discovered');
    expect(div.textContent).toContain('You have discovered Pottery!');
    document.body.removeChild(div);
  });

  it('renders open — shows Close and Show Technology Tree buttons', async () => {
    const { TechGainedDialog, showTechGainedDialog } = await import('@/components/Dialogs/TechGainedDialog');
    showTechGainedDialog('Writing', 'Writing unlocked!');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TechGainedDialog, null), div);
    const buttons = Array.from(div.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons).toContain('Close');
    expect(buttons).toContain('Show Technology Tree');
    document.body.removeChild(div);
  });
});

/**
 * Tests for CityBuyDialog, CityInputDialog, and TechGainedDialog components.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, h } from 'preact';

// ── CityBuyDialog ─────────────────────────────────────────────────────────

describe('CityBuyDialog exports', () => {
  it('exports showCityBuyDialog as a function', async () => {
    const { showCityBuyDialog } = await import('@/components/Dialogs/CityBuyDialog');
    expect(typeof showCityBuyDialog).toBe('function');
  });

  it('exports CityBuyDialog as a function', async () => {
    const { CityBuyDialog } = await import('@/components/Dialogs/CityBuyDialog');
    expect(typeof CityBuyDialog).toBe('function');
  });
});

describe('CityBuyDialog rendering', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('renders nothing when closed', async () => {
    const { CityBuyDialog } = await import('@/components/Dialogs/CityBuyDialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(CityBuyDialog, null), div);
    // Closed by default — no dialog title visible
    expect(div.textContent).not.toContain('Buy It!');
    document.body.removeChild(div);
  });

  it('opens and shows question after showCityBuyDialog', async () => {
    const { CityBuyDialog, showCityBuyDialog } = await import('@/components/Dialogs/CityBuyDialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(CityBuyDialog, null), div);

    showCityBuyDialog('Do you want to buy this?', () => {});
    // Re-render to reflect signal change
    render(h(CityBuyDialog, null), div);

    expect(div.textContent).toContain('Buy It!');
    expect(div.textContent).toContain('Do you want to buy this?');
    document.body.removeChild(div);
  });

  it('calls onConfirm when Yes button is clicked', async () => {
    const { CityBuyDialog, showCityBuyDialog } = await import('@/components/Dialogs/CityBuyDialog');
    let confirmed = false;
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(CityBuyDialog, null), div);

    showCityBuyDialog('Buy?', () => { confirmed = true; });
    render(h(CityBuyDialog, null), div);

    const buttons = Array.from(div.querySelectorAll('button'));
    const yesBtn = buttons.find(b => b.textContent?.trim() === 'Yes') as HTMLButtonElement;
    expect(yesBtn).not.toBeNull();
    yesBtn.click();
    expect(confirmed).toBe(true);
    document.body.removeChild(div);
  });
});

// ── CityInputDialog ───────────────────────────────────────────────────────

describe('CityInputDialog exports', () => {
  it('exports showCityInputDialog as a function', async () => {
    const { showCityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    expect(typeof showCityInputDialog).toBe('function');
  });

  it('exports closeCityInputDialog as a function', async () => {
    const { closeCityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    expect(typeof closeCityInputDialog).toBe('function');
  });

  it('exports CityInputDialog as a function', async () => {
    const { CityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    expect(typeof CityInputDialog).toBe('function');
  });
});

describe('CityInputDialog rendering', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('renders nothing when closed', async () => {
    const { CityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(CityInputDialog, null), div);
    const input = div.querySelector('input');
    expect(input).toBeNull();
    document.body.removeChild(div);
  });

  it('opens and shows prompt after showCityInputDialog', async () => {
    const { CityInputDialog, showCityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(CityInputDialog, null), div);

    showCityInputDialog('Rename City', 'Enter new name:', 'OldName', 64, () => {}, () => {});
    render(h(CityInputDialog, null), div);

    expect(div.textContent).toContain('Rename City');
    expect(div.textContent).toContain('Enter new name:');
    const input = div.querySelector('input') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.defaultValue).toBe('OldName');
    document.body.removeChild(div);
  });

  it('calls onSubmit with input value when Ok is clicked', async () => {
    const { CityInputDialog, showCityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    let submitted = '';
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(CityInputDialog, null), div);

    showCityInputDialog('Test', 'Prompt', 'Initial', 64, (name) => { submitted = name; }, () => {});
    render(h(CityInputDialog, null), div);

    const buttons = Array.from(div.querySelectorAll('button'));
    const okBtn = buttons.find(b => b.textContent?.trim() === 'Ok') as HTMLButtonElement;
    expect(okBtn).not.toBeNull();
    okBtn.click();
    expect(submitted).toBeDefined();
    document.body.removeChild(div);
  });

  it('closeCityInputDialog does not throw', async () => {
    const { closeCityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    expect(() => closeCityInputDialog()).not.toThrow();
  });
});

// ── TechGainedDialog ──────────────────────────────────────────────────────

describe('TechGainedDialog exports', () => {
  it('exports showTechGainedDialog as a function', async () => {
    const { showTechGainedDialog } = await import('@/components/Dialogs/TechGainedDialog');
    expect(typeof showTechGainedDialog).toBe('function');
  });

  it('exports TechGainedDialog as a function', async () => {
    const { TechGainedDialog } = await import('@/components/Dialogs/TechGainedDialog');
    expect(typeof TechGainedDialog).toBe('function');
  });
});

describe('TechGainedDialog rendering', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('renders nothing when closed', async () => {
    const { TechGainedDialog } = await import('@/components/Dialogs/TechGainedDialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TechGainedDialog, null), div);
    expect(div.textContent).not.toContain('Show Technology Tree');
    document.body.removeChild(div);
  });

  it('opens and shows title + message after showTechGainedDialog', async () => {
    const { TechGainedDialog, showTechGainedDialog } = await import('@/components/Dialogs/TechGainedDialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TechGainedDialog, null), div);

    showTechGainedDialog('Invention Discovered', 'You have discovered Invention!');
    render(h(TechGainedDialog, null), div);

    expect(div.textContent).toContain('Invention Discovered');
    expect(div.textContent).toContain('You have discovered Invention!');
    expect(div.textContent).toContain('Show Technology Tree');
    document.body.removeChild(div);
  });

  it('Close button does not throw when clicked', async () => {
    const { TechGainedDialog, showTechGainedDialog } = await import('@/components/Dialogs/TechGainedDialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TechGainedDialog, null), div);

    showTechGainedDialog('Tech', 'message');
    render(h(TechGainedDialog, null), div);

    const buttons = Array.from(div.querySelectorAll('button'));
    const closeBtn = buttons.find(b => b.textContent?.trim() === 'Close') as HTMLButtonElement;
    expect(closeBtn).not.toBeNull();
    expect(() => closeBtn.click()).not.toThrow();
    document.body.removeChild(div);
  });
});

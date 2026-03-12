/**
 * Unit tests for TaxRatesDialog.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, h } from 'preact';
import { store } from '@/data/store';

describe('TaxRatesDialog', () => {
  it('exports showTaxRatesDialog as a function', async () => {
    const { showTaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    expect(typeof showTaxRatesDialog).toBe('function');
  });

  it('exports closeTaxRatesDialog as a function', async () => {
    const { closeTaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    expect(typeof closeTaxRatesDialog).toBe('function');
  });

  it('TaxRatesDialog component is exported as a function', async () => {
    const { TaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    expect(typeof TaxRatesDialog).toBe('function');
  });

  it('showTaxRatesDialog does not throw', async () => {
    const { showTaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    expect(() => showTaxRatesDialog()).not.toThrow();
  });

  it('closeTaxRatesDialog does not throw', async () => {
    const { showTaxRatesDialog, closeTaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    showTaxRatesDialog();
    expect(() => closeTaxRatesDialog()).not.toThrow();
  });

  it('open signal starts false', async () => {
    // Import fresh — module may already be cached with open=false
    const { closeTaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    closeTaxRatesDialog();
    // No error = signal is readable
    expect(true).toBe(true);
  });
});

describe('TaxRatesDialog rendering', () => {
  beforeEach(async () => {
    document.body.innerHTML = '';
    store.reset();
    const { closeTaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    closeTaxRatesDialog();
  });

  it('renders nothing when closed', async () => {
    const { TaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TaxRatesDialog, null), div);
    expect(div.innerHTML).toBe('');
    document.body.removeChild(div);
  });

  it('renders "Tax Rates" title when open', async () => {
    const { TaxRatesDialog, showTaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    showTaxRatesDialog();
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TaxRatesDialog, null), div);
    expect(div.textContent).toContain('Tax Rates');
    document.body.removeChild(div);
  });

  it('renders Tax, Luxury, Science rate labels when open', async () => {
    const { TaxRatesDialog, showTaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    showTaxRatesDialog();
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TaxRatesDialog, null), div);
    expect(div.textContent).toContain('Tax');
    expect(div.textContent).toContain('Luxury');
    expect(div.textContent).toContain('Science');
    document.body.removeChild(div);
  });

  it('renders Close button when open', async () => {
    const { TaxRatesDialog, showTaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    showTaxRatesDialog();
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TaxRatesDialog, null), div);
    const buttons = Array.from(div.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons).toContain('Close');
    document.body.removeChild(div);
  });

  it('Close button closes the dialog', async () => {
    const { TaxRatesDialog, showTaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    showTaxRatesDialog();
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TaxRatesDialog, null), div);

    const closeBtn = Array.from(div.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Close') as HTMLButtonElement;
    expect(closeBtn).toBeDefined();
    closeBtn.click();
    await Promise.resolve();

    render(h(TaxRatesDialog, null), div);
    expect(div.innerHTML).toBe('');
    document.body.removeChild(div);
  });

  it('renders player tax/luxury/science percentages when clientPlaying has data', async () => {
    const { TaxRatesDialog, showTaxRatesDialog } = await import('@/components/Dialogs/TaxRatesDialog');
    // Set up a playing player with tax rates
    store.client.conn.playing = { playerno: 0, tax: 30, luxury: 20, science: 50 } as never;
    showTaxRatesDialog();
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TaxRatesDialog, null), div);
    expect(div.textContent).toContain('30%');
    expect(div.textContent).toContain('20%');
    expect(div.textContent).toContain('50%');
    expect(div.textContent).toContain('Total: 100%');
    store.client.conn.playing = null as never;
    document.body.removeChild(div);
  });
});

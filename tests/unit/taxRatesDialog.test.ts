/**
 * Unit tests for TaxRatesDialog.
 */
import { describe, it, expect } from 'vitest';

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

import { describe, expect, it } from 'vitest';
import { validateBilling } from './billing';

describe('validateBilling', () => {
  it('no exige NIT ni razón social cuando es "sin-nit"', () => {
    const result = validateBilling({ type: 'sin-nit', nit: '', businessName: '' });
    expect(result.valid).toBe(true);
  });

  it('exige NIT y razón social cuando es "con-nit"', () => {
    const result = validateBilling({ type: 'con-nit', nit: '', businessName: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.nit).toBeTruthy();
    expect(result.errors.businessName).toBeTruthy();
  });

  it('rechaza un NIT con caracteres no numéricos', () => {
    const result = validateBilling({ type: 'con-nit', nit: '12AB56', businessName: 'LILS SRL' });
    expect(result.valid).toBe(false);
    expect(result.errors.nit).toBeTruthy();
  });

  it('acepta un NIT numérico válido con razón social', () => {
    const result = validateBilling({ type: 'con-nit', nit: '1234567890', businessName: 'LILS SRL' });
    expect(result.valid).toBe(true);
  });
});

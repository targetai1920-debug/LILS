import type { BillingDetails } from '@/types';
import type { FieldErrors } from './address';

export interface BillingValidationResult {
  valid: boolean;
  errors: FieldErrors;
}

/** Valida los datos de facturación. NIT y razón social solo son obligatorios con "Con NIT". */
export function validateBilling(billing: BillingDetails): BillingValidationResult {
  const errors: FieldErrors = {};

  if (billing.type === 'con-nit') {
    const nitDigits = billing.nit.trim();
    if (!/^\d{5,15}$/.test(nitDigits)) {
      errors.nit = 'Ingresa un número de NIT válido (solo dígitos).';
    }
    if (!billing.businessName.trim()) {
      errors.businessName = 'Ingresa el nombre o razón social.';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

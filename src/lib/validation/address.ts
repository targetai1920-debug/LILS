import type { DeliveryAddress } from '@/types';
import { validateBolivianPhone } from './phone';

export interface FieldErrors {
  [field: string]: string;
}

export interface AddressValidationResult {
  valid: boolean;
  errors: FieldErrors;
}

/**
 * Valida los datos de dirección de envío a domicilio según el orden y las
 * reglas obligatorias definidas para el flujo de delivery.
 */
export function validateDeliveryAddress(address: DeliveryAddress): AddressValidationResult {
  const errors: FieldErrors = {};

  if (!address.mainStreet.trim()) {
    errors.mainStreet = 'La calle o avenida principal es obligatoria.';
  }

  if (!address.noHouseNumber && !address.houseNumber.trim()) {
    errors.houseNumber =
      'Ingresa el número de domicilio o marca "Mi domicilio no tiene número".';
  }

  if (!address.location) {
    errors.location = 'Marca la ubicación exacta en el mapa.';
  }

  const phoneResult = validateBolivianPhone(address.phone);
  if (!phoneResult.valid) {
    errors.phone = phoneResult.error ?? 'Teléfono inválido.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

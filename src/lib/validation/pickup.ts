import type { Branch, PickupDetails } from '@/types';
import type { DeliveryConfig } from '@/types';
import { validatePickupDateTime } from '@/lib/time/pickupSlots';
import type { FieldErrors } from './address';

export interface PickupValidationResult {
  valid: boolean;
  errors: FieldErrors;
}

export function validatePickupDetails(
  pickup: PickupDetails,
  branch: Branch,
  config: DeliveryConfig,
  now: Date = new Date(),
): PickupValidationResult {
  const errors: FieldErrors = {};

  if (!pickup.personName.trim()) {
    errors.personName = 'Ingresa el nombre de quien recogerá el pedido.';
  }

  const timeResult = validatePickupDateTime(pickup.date, pickup.time, {
    openTime: branch.openTime,
    closeTime: branch.closeTime,
    intervalMinutes: config.pickupSlotIntervalMinutes,
    preparationMinutes: config.preparationMinutesEstimate,
    now,
  });

  if (!timeResult.valid) {
    errors.time = timeResult.error ?? 'Horario de recojo inválido.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

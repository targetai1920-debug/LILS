import { getCochabambaNow, minutesToTimeStr, timeStrToMinutes } from './cochabamba';

export interface PickupSlotOptions {
  dateStr: string;
  openTime: string;
  closeTime: string;
  intervalMinutes: number;
  preparationMinutes: number;
  now?: Date;
}

/**
 * Genera los horarios de recojo disponibles para una fecha dada, respetando
 * el horario 17:00–22:00, el intervalo configurado y el tiempo mínimo de
 * preparación cuando la fecha elegida es hoy. Nunca devuelve horas pasadas.
 */
export function generatePickupSlots(options: PickupSlotOptions): string[] {
  const { dateStr, openTime, closeTime, intervalMinutes, preparationMinutes } = options;
  const now = options.now ?? new Date();
  const nowInCochabamba = getCochabambaNow(now);

  const openMinutes = timeStrToMinutes(openTime);
  const closeMinutes = timeStrToMinutes(closeTime);

  const isToday = dateStr === nowInCochabamba.dateStr;
  const isPast = dateStr < nowInCochabamba.dateStr;
  if (isPast) return [];

  let earliestMinutes = openMinutes;
  if (isToday) {
    const minimumReadyMinutes = nowInCochabamba.minutesSinceMidnight + preparationMinutes;
    const nextSlot =
      Math.ceil(minimumReadyMinutes / intervalMinutes) * intervalMinutes;
    earliestMinutes = Math.max(openMinutes, nextSlot);
  }

  const slots: string[] = [];
  for (let minutes = earliestMinutes; minutes < closeMinutes; minutes += intervalMinutes) {
    slots.push(minutesToTimeStr(minutes));
  }
  return slots;
}

export interface PickupTimeValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePickupDateTime(
  dateStr: string,
  timeStr: string,
  options: Omit<PickupSlotOptions, 'dateStr'>,
): PickupTimeValidationResult {
  if (!dateStr) {
    return { valid: false, error: 'Elige una fecha de recojo.' };
  }
  if (!timeStr) {
    return { valid: false, error: 'Elige una hora de recojo.' };
  }

  const availableSlots = generatePickupSlots({ ...options, dateStr });

  if (!availableSlots.includes(timeStr)) {
    return {
      valid: false,
      error: 'La hora seleccionada ya no está disponible. Elige otra hora dentro del horario de atención.',
    };
  }

  return { valid: true };
}

import { describe, expect, it } from 'vitest';
import { generatePickupSlots, validatePickupDateTime } from './pickupSlots';

function utc(dateStr: string, hh: number, mm: number): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year!, month! - 1, day!, hh, mm));
}

const baseOptions = {
  openTime: '17:00',
  closeTime: '22:00',
  intervalMinutes: 15,
  preparationMinutes: 35,
};

describe('generatePickupSlots', () => {
  it('genera todos los horarios del día para una fecha futura', () => {
    const now = utc('2026-08-07', 12, 0); // 08:00 local, muy antes de la fecha futura
    const slots = generatePickupSlots({ ...baseOptions, dateStr: '2026-08-10', now });
    expect(slots[0]).toBe('17:00');
    expect(slots[slots.length - 1]).toBe('21:45');
    expect(slots).not.toContain('22:00');
  });

  it('no genera horarios para una fecha pasada', () => {
    const now = utc('2026-08-10', 12, 0);
    const slots = generatePickupSlots({ ...baseOptions, dateStr: '2026-08-07', now });
    expect(slots).toEqual([]);
  });

  it('para hoy, respeta el tiempo mínimo de preparación redondeado al siguiente intervalo', () => {
    // 21:10 UTC == 17:10 local. +35 min preparación = 17:45 -> siguiente intervalo de 15min = 17:45
    const now = utc('2026-08-07', 21, 10);
    const slots = generatePickupSlots({ ...baseOptions, dateStr: '2026-08-07', now });
    expect(slots[0]).toBe('17:45');
  });

  it('no ofrece horas pasadas del mismo día si ya casi cierra', () => {
    // 01:50 UTC del día siguiente == 21:50 local, +35min => pasado el cierre (22:00)
    const now = utc('2026-08-08', 1, 50);
    const slots = generatePickupSlots({ ...baseOptions, dateStr: '2026-08-07', now });
    expect(slots).toEqual([]);
  });
});

describe('validatePickupDateTime', () => {
  it('es válida para una hora disponible', () => {
    const now = utc('2026-08-07', 12, 0);
    const result = validatePickupDateTime('2026-08-10', '17:00', { ...baseOptions, now });
    expect(result.valid).toBe(true);
  });

  it('rechaza una hora que ya no está disponible (pasada)', () => {
    const now = utc('2026-08-07', 21, 30); // 17:30 local
    const result = validatePickupDateTime('2026-08-07', '17:00', { ...baseOptions, now });
    expect(result.valid).toBe(false);
  });

  it('rechaza cuando falta la fecha o la hora', () => {
    const now = utc('2026-08-07', 12, 0);
    expect(validatePickupDateTime('', '17:00', { ...baseOptions, now }).valid).toBe(false);
    expect(validatePickupDateTime('2026-08-10', '', { ...baseOptions, now }).valid).toBe(false);
  });
});

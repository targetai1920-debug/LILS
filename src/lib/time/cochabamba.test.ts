import { describe, expect, it } from 'vitest';
import { getCochabambaNow, isWithinBusinessHours } from './cochabamba';

// America/La_Paz es UTC-4 todo el año (sin horario de verano).
function utc(dateStr: string, hh: number, mm: number): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year!, month! - 1, day!, hh, mm));
}

describe('getCochabambaNow', () => {
  it('convierte correctamente un instante UTC a hora local de Cochabamba', () => {
    // 21:00 UTC == 17:00 en America/La_Paz (UTC-4)
    const result = getCochabambaNow(utc('2026-08-07', 21, 0));
    expect(result.timeStr).toBe('17:00');
    expect(result.dateStr).toBe('2026-08-07');
  });
});

describe('isWithinBusinessHours', () => {
  it('está abierto exactamente a la hora de apertura (17:00)', () => {
    expect(isWithinBusinessHours(utc('2026-08-07', 21, 0), '17:00', '22:00')).toBe(true);
  });

  it('está cerrado justo a la hora de cierre (22:00, límite exclusivo)', () => {
    expect(isWithinBusinessHours(utc('2026-08-08', 2, 0), '17:00', '22:00')).toBe(false);
  });

  it('está cerrado antes de abrir', () => {
    expect(isWithinBusinessHours(utc('2026-08-07', 19, 0), '17:00', '22:00')).toBe(false);
  });

  it('está abierto en medio del horario de atención', () => {
    expect(isWithinBusinessHours(utc('2026-08-07', 23, 30), '17:00', '22:00')).toBe(true);
  });
});

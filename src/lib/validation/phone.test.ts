import { describe, expect, it } from 'vitest';
import { validateBolivianPhone } from './phone';

describe('validateBolivianPhone', () => {
  it('normaliza un número de 8 dígitos a +591XXXXXXXX', () => {
    const result = validateBolivianPhone('64818054');
    expect(result).toEqual({ valid: true, normalized: '+59164818054' });
  });

  it('acepta el número ya con prefijo +591', () => {
    const result = validateBolivianPhone('+591 6481 8054');
    expect(result.valid).toBe(true);
    expect(result.normalized).toBe('+59164818054');
  });

  it('acepta números que empiezan con 7', () => {
    expect(validateBolivianPhone('71234567').valid).toBe(true);
  });

  it('rechaza números que no empiezan con 6 o 7', () => {
    const result = validateBolivianPhone('51234567');
    expect(result.valid).toBe(false);
    expect(result.normalized).toBeNull();
  });

  it('rechaza números con una cantidad de dígitos incorrecta', () => {
    expect(validateBolivianPhone('123').valid).toBe(false);
    expect(validateBolivianPhone('712345678').valid).toBe(false);
  });

  it('rechaza un campo vacío', () => {
    const result = validateBolivianPhone('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

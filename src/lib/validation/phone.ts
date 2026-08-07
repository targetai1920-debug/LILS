export interface PhoneValidationResult {
  valid: boolean;
  normalized: string | null;
  error?: string;
}

/**
 * Valida un número de celular boliviano y lo normaliza a formato +591XXXXXXXX.
 * Acepta el número con o sin prefijo +591, con espacios o guiones.
 * Los celulares bolivianos tienen 8 dígitos y comienzan con 6 o 7.
 */
export function validateBolivianPhone(rawInput: string): PhoneValidationResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { valid: false, normalized: null, error: 'Ingresa un número de teléfono.' };
  }

  const digitsOnly = trimmed.replace(/[\s-]/g, '');
  const withoutCountryCode = digitsOnly.startsWith('+591')
    ? digitsOnly.slice(4)
    : digitsOnly.startsWith('591') && digitsOnly.length > 8
      ? digitsOnly.slice(3)
      : digitsOnly;

  const isEightDigits = /^\d{8}$/.test(withoutCountryCode);
  const startsWithMobilePrefix = /^[67]/.test(withoutCountryCode);

  if (!isEightDigits || !startsWithMobilePrefix) {
    return {
      valid: false,
      normalized: null,
      error: 'Ingresa un celular boliviano válido de 8 dígitos (empieza con 6 o 7).',
    };
  }

  return { valid: true, normalized: `+591${withoutCountryCode}` };
}

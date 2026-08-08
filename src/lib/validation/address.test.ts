import { describe, expect, it } from 'vitest';
import { validateDeliveryAddress } from './address';
import type { DeliveryAddress } from '@/types';

function makeAddress(overrides: Partial<DeliveryAddress> = {}): DeliveryAddress {
  return {
    mainStreet: 'Av. Melchor Urquidi',
    houseNumber: '123',
    noHouseNumber: false,
    reference: '',
    crossStreet: 'J. A. Rico Toro',
    location: { lat: -17.3895, lng: -66.1568 },
    phone: '71234567',
    phoneNormalized: '',
    ...overrides,
  };
}

describe('validateDeliveryAddress', () => {
  it('es válida cuando todos los campos obligatorios están presentes', () => {
    const result = validateDeliveryAddress(makeAddress());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('exige la calle o avenida principal', () => {
    const result = validateDeliveryAddress(makeAddress({ mainStreet: '  ' }));
    expect(result.valid).toBe(false);
    expect(result.errors.mainStreet).toBeTruthy();
  });

  it('exige el número de domicilio salvo que se marque "sin número"', () => {
    const withoutNumber = validateDeliveryAddress(makeAddress({ houseNumber: '' }));
    expect(withoutNumber.valid).toBe(false);
    expect(withoutNumber.errors.houseNumber).toBeTruthy();

    const flaggedNoNumber = validateDeliveryAddress(
      makeAddress({ houseNumber: '', noHouseNumber: true }),
    );
    expect(flaggedNoNumber.valid).toBe(true);
  });

  it('la calle auxiliar es opcional', () => {
    const result = validateDeliveryAddress(makeAddress({ crossStreet: '' }));
    expect(result.valid).toBe(true);
    expect(result.errors.crossStreet).toBeUndefined();
  });

  it('exige marcar la ubicación en el mapa', () => {
    const result = validateDeliveryAddress(makeAddress({ location: null }));
    expect(result.valid).toBe(false);
    expect(result.errors.location).toBeTruthy();
  });

  it('exige un teléfono boliviano válido', () => {
    const result = validateDeliveryAddress(makeAddress({ phone: '123' }));
    expect(result.valid).toBe(false);
    expect(result.errors.phone).toBeTruthy();
  });

  it('la referencia es opcional', () => {
    const result = validateDeliveryAddress(makeAddress({ reference: '' }));
    expect(result.valid).toBe(true);
  });
});

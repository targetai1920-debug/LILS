import { describe, expect, it } from 'vitest';
import { validateOrderDraftForFinalization } from './draftValidation';
import type { OrderDraft } from '@/types';

const baseLine: OrderDraft['lines'][number] = {
  lineId: 'line-1',
  productId: 'lils-burger',
  variantId: 'doble',
  quantity: 1,
  removedIngredientIds: [],
  extras: [],
  noFries: false,
  notes: '',
};

const deliveryAddress: NonNullable<OrderDraft['address']> = {
  mainStreet: 'Av. Melchor Urquidi',
  houseNumber: '123',
  noHouseNumber: false,
  reference: '',
  crossStreet: 'J. A. Rico Toro',
  location: { lat: -17.3895, lng: -66.1568 },
  phone: '71234567',
  phoneNormalized: '+59171234567',
};

const pickupDetails: NonNullable<OrderDraft['pickup']> = {
  branchId: 'melchor-urquidi',
  personName: 'Ana',
  date: '2026-08-10',
  time: '18:00',
};

function validDeliveryDraft(overrides: Partial<OrderDraft> = {}): OrderDraft {
  return {
    attemptId: 'attempt-1',
    lines: [baseLine],
    fulfillmentType: 'delivery',
    address: deliveryAddress,
    pickup: null,
    billing: { type: 'sin-nit', nit: '', businessName: '' },
    paymentMethod: 'qr-productos',
    deliveryFeeBs: 10,
    distanceKm: 3.2,
    ...overrides,
  };
}

function validPickupDraft(overrides: Partial<OrderDraft> = {}): OrderDraft {
  return {
    attemptId: 'attempt-2',
    lines: [baseLine],
    fulfillmentType: 'pickup',
    address: null,
    pickup: pickupDetails,
    billing: { type: 'sin-nit', nit: '', businessName: '' },
    paymentMethod: 'qr-total',
    deliveryFeeBs: 0,
    distanceKm: null,
    ...overrides,
  };
}

describe('validateOrderDraftForFinalization: casos válidos', () => {
  it('acepta un draft de delivery válido con qr-productos', () => {
    expect(validateOrderDraftForFinalization(validDeliveryDraft())).toBeNull();
  });

  it('acepta un draft de delivery válido con efectivo', () => {
    expect(validateOrderDraftForFinalization(validDeliveryDraft({ paymentMethod: 'efectivo' }))).toBeNull();
  });

  it('acepta un draft de recojo válido con qr-total', () => {
    expect(validateOrderDraftForFinalization(validPickupDraft())).toBeNull();
  });

  it('acepta un draft de recojo válido con caja', () => {
    expect(validateOrderDraftForFinalization(validPickupDraft({ paymentMethod: 'caja' }))).toBeNull();
  });
});

describe('validateOrderDraftForFinalization: 12. un método de pago incompatible nunca pasa', () => {
  it('rechaza delivery con qr-total (método de recojo)', () => {
    const result = validateOrderDraftForFinalization(validDeliveryDraft({ paymentMethod: 'qr-total' }));
    expect(result).not.toBeNull();
    expect(result?.stepId).toBe('payment');
  });

  it('rechaza delivery con caja (método de recojo)', () => {
    const result = validateOrderDraftForFinalization(validDeliveryDraft({ paymentMethod: 'caja' }));
    expect(result?.stepId).toBe('payment');
  });

  it('rechaza recojo con qr-productos (método de delivery)', () => {
    const result = validateOrderDraftForFinalization(validPickupDraft({ paymentMethod: 'qr-productos' }));
    expect(result?.stepId).toBe('payment');
  });

  it('rechaza recojo con efectivo (método de delivery)', () => {
    const result = validateOrderDraftForFinalization(validPickupDraft({ paymentMethod: 'efectivo' }));
    expect(result?.stepId).toBe('payment');
  });
});

describe('validateOrderDraftForFinalization: 13. rechaza drafts contradictorios aunque la UI haya fallado', () => {
  it('rechaza un draft sin productos', () => {
    const result = validateOrderDraftForFinalization(validDeliveryDraft({ lines: [] }));
    expect(result?.stepId).toBe('cart');
  });

  it('rechaza un draft sin tipo de entrega', () => {
    const result = validateOrderDraftForFinalization(validDeliveryDraft({ fulfillmentType: null }));
    expect(result?.stepId).toBe('fulfillment');
  });

  it('rechaza un delivery que además arrastra datos de recojo', () => {
    const result = validateOrderDraftForFinalization(validDeliveryDraft({ pickup: pickupDetails }));
    expect(result?.stepId).toBe('fulfillment');
  });

  it('rechaza delivery sin dirección', () => {
    const result = validateOrderDraftForFinalization(validDeliveryDraft({ address: null }));
    expect(result?.stepId).toBe('details');
  });

  it('rechaza un recojo que además arrastra una dirección de delivery', () => {
    const result = validateOrderDraftForFinalization(validPickupDraft({ address: deliveryAddress }));
    expect(result?.stepId).toBe('fulfillment');
  });

  it('rechaza un recojo que además arrastra tarifa de delivery', () => {
    const result = validateOrderDraftForFinalization(validPickupDraft({ deliveryFeeBs: 10 }));
    expect(result?.stepId).toBe('fulfillment');
  });

  it('rechaza un recojo que además arrastra distancia de delivery', () => {
    const result = validateOrderDraftForFinalization(validPickupDraft({ distanceKm: 3.2 }));
    expect(result?.stepId).toBe('fulfillment');
  });

  it('rechaza recojo sin datos de recojo', () => {
    const result = validateOrderDraftForFinalization(validPickupDraft({ pickup: null }));
    expect(result?.stepId).toBe('details');
  });

  it('rechaza un draft sin facturación', () => {
    const result = validateOrderDraftForFinalization(validDeliveryDraft({ billing: null }));
    expect(result?.stepId).toBe('billing');
  });

  it('rechaza un draft sin método de pago', () => {
    const result = validateOrderDraftForFinalization(validDeliveryDraft({ paymentMethod: null }));
    expect(result?.stepId).toBe('payment');
  });
});

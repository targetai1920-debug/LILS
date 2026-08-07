import { describe, expect, it } from 'vitest';
import { buildOrderFingerprint } from './fingerprint';
import type { OrderDraft } from '@/types';

function draft(overrides: Partial<Omit<OrderDraft, 'attemptId'>> = {}): Omit<OrderDraft, 'attemptId'> {
  return {
    lines: [
      {
        lineId: 'line-1',
        productId: 'lils-burger',
        variantId: 'doble',
        quantity: 1,
        removedIngredientIds: [],
        extras: [],
        noFries: false,
        notes: '',
      },
    ],
    fulfillmentType: 'pickup',
    address: null,
    pickup: { branchId: 'melchor-urquidi', personName: 'Ana', date: '2026-08-10', time: '18:00' },
    billing: { type: 'sin-nit', nit: '', businessName: '' },
    paymentMethod: 'qr-total',
    deliveryFeeBs: 0,
    distanceKm: null,
    ...overrides,
  };
}

describe('buildOrderFingerprint', () => {
  it('produce el mismo fingerprint para el mismo contenido', () => {
    expect(buildOrderFingerprint(draft())).toBe(buildOrderFingerprint(draft()));
  });

  it('ignora el lineId al comparar líneas (mismo contenido, distinto id)', () => {
    const a = draft();
    const b = draft({
      lines: [{ ...a.lines[0]!, lineId: 'otro-id-totalmente-distinto' }],
    });
    expect(buildOrderFingerprint(a)).toBe(buildOrderFingerprint(b));
  });

  it('no depende del orden de selección de ingredientes retirados', () => {
    const a = draft({ lines: [{ ...draft().lines[0]!, removedIngredientIds: ['bbq', 'cebolla-caramelizada'] }] });
    const b = draft({ lines: [{ ...draft().lines[0]!, removedIngredientIds: ['cebolla-caramelizada', 'bbq'] }] });
    expect(buildOrderFingerprint(a)).toBe(buildOrderFingerprint(b));
  });

  it('cambia si cambia la cantidad', () => {
    const a = draft();
    const b = draft({ lines: [{ ...a.lines[0]!, quantity: 2 }] });
    expect(buildOrderFingerprint(a)).not.toBe(buildOrderFingerprint(b));
  });

  it('cambia si cambia el método de pago', () => {
    const a = draft({ paymentMethod: 'qr-total' });
    const b = draft({ paymentMethod: 'caja' });
    expect(buildOrderFingerprint(a)).not.toBe(buildOrderFingerprint(b));
  });

  it('cambia si cambia el tipo de entrega', () => {
    const a = draft({ fulfillmentType: 'pickup' });
    const b = draft({ fulfillmentType: 'delivery', pickup: null, paymentMethod: 'qr-productos' });
    expect(buildOrderFingerprint(a)).not.toBe(buildOrderFingerprint(b));
  });

  it('cambia si cambia la dirección de entrega', () => {
    const a = draft({
      fulfillmentType: 'delivery',
      pickup: null,
      paymentMethod: 'qr-productos',
      address: {
        mainStreet: 'Calle 1',
        houseNumber: '1',
        noHouseNumber: false,
        reference: '',
        crossStreet: 'Calle 2',
        location: { lat: -17.3, lng: -66.1 },
        phone: '71234567',
        phoneNormalized: '+59171234567',
      },
    });
    const b = draft({
      ...a,
      address: { ...a.address!, houseNumber: '2' },
    });
    expect(buildOrderFingerprint(a)).not.toBe(buildOrderFingerprint(b));
  });
});

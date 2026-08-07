import { describe, expect, it } from 'vitest';
import { buildOrderSummary } from './summary';
import { getProductById } from '@/data/menu';
import { defaultBranch } from '@/data/branches';
import type { OrderDraft } from '@/types';

function makeDeliveryDraft(): OrderDraft {
  return {
    attemptId: 'order-test-1',
    lines: [
      {
        lineId: 'line-1',
        productId: 'lils-burger',
        variantId: 'doble',
        quantity: 2,
        removedIngredientIds: ['bbq'],
        extras: [{ id: 'tocino-extra', label: 'Tocino extra', priceBs: 11 }],
        noFries: false,
        notes: 'bien cocida',
      },
    ],
    fulfillmentType: 'delivery',
    address: {
      mainStreet: 'Av. Melchor Urquidi',
      houseNumber: '123',
      noHouseNumber: false,
      reference: '',
      crossStreet: 'J. A. Rico Toro',
      location: { lat: -17.3895, lng: -66.1568 },
      phone: '71234567',
      phoneNormalized: '+59171234567',
    },
    pickup: null,
    billing: { type: 'sin-nit', nit: '', businessName: '' },
    paymentMethod: 'qr-productos',
    deliveryFeeBs: 10,
    distanceKm: 3.2,
  };
}

describe('buildOrderSummary', () => {
  it('devuelve null si faltan datos esenciales del pedido', () => {
    const draft: OrderDraft = { ...makeDeliveryDraft(), fulfillmentType: null };
    expect(buildOrderSummary(draft, getProductById, defaultBranch)).toBeNull();
  });

  it('calcula subtotal, delivery y totales correctamente', () => {
    const summary = buildOrderSummary(makeDeliveryDraft(), getProductById, defaultBranch);
    expect(summary).not.toBeNull();
    // (45 + 11) * 2 = 112
    expect(summary?.subtotalBs).toBe(112);
    expect(summary?.deliveryFeeBs).toBe(10);
    expect(summary?.totalBs).toBe(122);
    expect(summary?.paidNowBs).toBe(112);
    expect(summary?.pendingBs).toBe(10);
  });

  it('incluye ingredientes retirados y extras en la línea', () => {
    const summary = buildOrderSummary(makeDeliveryDraft(), getProductById, defaultBranch);
    expect(summary?.lines[0]?.removedIngredients).toContain('BBQ');
    expect(summary?.lines[0]?.extras[0]?.label).toBe('Tocino extra');
    expect(summary?.lines[0]?.notes).toBe('bien cocida');
  });

  it('es serializable a JSON sin perder información', () => {
    const summary = buildOrderSummary(makeDeliveryDraft(), getProductById, defaultBranch);
    const serialized = JSON.parse(JSON.stringify(summary));
    expect(serialized.attemptId).toBe('order-test-1');
    expect(serialized.totalBs).toBe(122);
    expect(serialized.lines).toHaveLength(1);
  });

  it('no mezcla la tarifa de delivery dentro del subtotal para pickup', () => {
    const pickupDraft: OrderDraft = {
      ...makeDeliveryDraft(),
      fulfillmentType: 'pickup',
      address: null,
      pickup: { branchId: defaultBranch.id, personName: 'Ana', date: '2026-08-10', time: '18:00' },
      paymentMethod: 'qr-total',
      deliveryFeeBs: 0,
      distanceKm: null,
    };
    const summary = buildOrderSummary(pickupDraft, getProductById, defaultBranch);
    expect(summary?.deliveryFeeBs).toBe(0);
    expect(summary?.totalBs).toBe(summary?.subtotalBs);
  });
});

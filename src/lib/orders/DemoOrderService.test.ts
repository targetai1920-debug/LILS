import { describe, expect, it } from 'vitest';
import { DemoOrderService, IdempotencyConflictError } from './DemoOrderService';
import type { OrderDraft } from '@/types';

function draft(overrides: Partial<OrderDraft> = {}): OrderDraft {
  return {
    attemptId: 'attempt-1',
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

describe('DemoOrderService: idempotencia', () => {
  it('la primera llamada crea un resultado nuevo, no marcado como repetido', async () => {
    const service = new DemoOrderService();
    const result = await service.submit(draft());
    expect(result.success).toBe(true);
    expect(result.orderId).toBe('attempt-1');
    expect(result.replayed).toBe(false);
  });

  it('6. dos envíos con la misma clave y el mismo payload devuelven el mismo resultado', async () => {
    const service = new DemoOrderService();
    const first = await service.submit(draft());
    const second = await service.submit(draft());

    expect(second.orderId).toBe(first.orderId);
  });

  it('7. submittedAt y orderId son idénticos en el reintento', async () => {
    const service = new DemoOrderService();
    const first = await service.submit(draft());
    const second = await service.submit(draft());

    expect(second.submittedAt).toBe(first.submittedAt);
    expect(second.orderId).toBe(first.orderId);
  });

  it('8. la respuesta repetida se identifica como idempotente (replayed: true)', async () => {
    const service = new DemoOrderService();
    const first = await service.submit(draft());
    expect(first.replayed).toBe(false);

    const second = await service.submit(draft());
    expect(second.replayed).toBe(true);
  });

  it('9. la misma clave con un payload distinto produce IDEMPOTENCY_CONFLICT', async () => {
    const service = new DemoOrderService();
    await service.submit(draft());

    await expect(
      service.submit(draft({ pickup: { branchId: 'melchor-urquidi', personName: 'Otro nombre', date: '2026-08-10', time: '18:00' } })),
    ).rejects.toThrow(IdempotencyConflictError);
  });

  it('el error de conflicto de idempotencia tiene el código IDEMPOTENCY_CONFLICT', async () => {
    const service = new DemoOrderService();
    await service.submit(draft());

    try {
      await service.submit(draft({ paymentMethod: 'caja' }));
      expect.unreachable('debía lanzar IdempotencyConflictError');
    } catch (error) {
      expect(error).toBeInstanceOf(IdempotencyConflictError);
      expect((error as IdempotencyConflictError).code).toBe('IDEMPOTENCY_CONFLICT');
    }
  });

  it('claves de intento distintas para pedidos distintos no interfieren entre sí', async () => {
    const service = new DemoOrderService();
    const a = await service.submit(draft({ attemptId: 'attempt-a' }));
    const b = await service.submit(draft({ attemptId: 'attempt-b', paymentMethod: 'caja' }));

    expect(a.orderId).toBe('attempt-a');
    expect(b.orderId).toBe('attempt-b');
    expect(a.replayed).toBe(false);
    expect(b.replayed).toBe(false);
  });

  it('no realiza ninguna solicitud de red (fetch nunca se invoca)', async () => {
    const originalFetch = globalThis.fetch;
    let called = false;
    globalThis.fetch = (() => {
      called = true;
      throw new Error('DemoOrderService no debe usar fetch');
    }) as typeof fetch;
    try {
      const service = new DemoOrderService();
      await service.submit(draft());
      expect(called).toBe(false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

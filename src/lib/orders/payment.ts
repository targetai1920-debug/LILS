import type { FulfillmentType, PaymentMethod } from '@/types';

export interface PaymentSplit {
  totalBs: number;
  paidNowBs: number;
  pendingBs: number;
}

/**
 * Calcula cuánto se paga ahora (por QR de demostración) y cuánto queda
 * pendiente para recibir/recoger, según el tipo de entrega y el método de
 * pago elegido. El delivery nunca se mezcla con el QR de productos.
 */
export function calculatePaymentSplit(
  fulfillmentType: FulfillmentType,
  paymentMethod: PaymentMethod,
  subtotalBs: number,
  deliveryFeeBs: number,
): PaymentSplit {
  const totalBs = fulfillmentType === 'delivery' ? subtotalBs + deliveryFeeBs : subtotalBs;

  if (fulfillmentType === 'delivery') {
    if (paymentMethod === 'qr-productos') {
      return { totalBs, paidNowBs: subtotalBs, pendingBs: deliveryFeeBs };
    }
    // efectivo: todo se paga al recibir
    return { totalBs, paidNowBs: 0, pendingBs: totalBs };
  }

  // pickup
  if (paymentMethod === 'qr-total') {
    return { totalBs, paidNowBs: totalBs, pendingBs: 0 };
  }
  // caja: todo pendiente
  return { totalBs, paidNowBs: 0, pendingBs: totalBs };
}

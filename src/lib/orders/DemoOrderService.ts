import type { OrderDraft, OrderResult } from '@/types';
import type { OrderService } from './OrderService';

/**
 * Implementación de demostración de OrderService. No hace ninguna solicitud
 * de red, no contacta al WhatsApp oficial ni guarda datos en un servidor:
 * solo resuelve localmente con el identificador de intento del pedido, que
 * evita el envío duplicado del mismo intento.
 */
export class DemoOrderService implements OrderService {
  async submit(order: OrderDraft): Promise<OrderResult> {
    return {
      success: true,
      orderId: order.attemptId,
      submittedAt: new Date().toISOString(),
    };
  }
}

export const demoOrderService = new DemoOrderService();

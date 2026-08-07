import type { OrderDraft, OrderResult } from '@/types';

/**
 * Contrato para el envío de pedidos. La implementación de demostración
 * (DemoOrderService) no realiza solicitudes externas. Una futura
 * implementación conectada a un backend real de LILS puede sustituirla sin
 * cambiar el resto de la aplicación.
 */
export interface OrderService {
  submit(order: OrderDraft): Promise<OrderResult>;
}

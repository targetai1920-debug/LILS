import { generateId } from '@/lib/cart/id';

/** Identificador único de intento de pedido, usado para evitar doble finalización. */
export function generateOrderAttemptId(): string {
  return generateId('order');
}

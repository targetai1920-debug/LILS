import { generateId } from '@/lib/cart/id';

/** Identificador único de intento de pedido, usado para evitar doble finalización. */
export function generateOrderAttemptId(): string {
  return generateId('order');
}

export interface AttemptIdentity {
  attemptId: string;
  fingerprint: string;
}

/**
 * Decide qué clave de intento (`attemptId`) usar para un envío, siguiendo
 * el mismo principio que `idempotencyKeyRef`/`idempotencyPayloadRef` del
 * frontend de Esquece (web-reservas/app/page.tsx): si el pedido a enviar
 * tiene exactamente el mismo contenido (mismo `fingerprint`) que el último
 * intento conocido, se reutiliza esa misma clave — así un reintento tras un
 * error, o un doble clic, no genera un pedido nuevo. Si el contenido
 * cambió (otro producto, otra dirección, otro método de pago, etc.), se
 * genera una clave nueva.
 *
 * Es una función pura para poder probarla sin React; el componente que la
 * usa (`OrderFlow`) guarda `previous` en un `useRef` y lo actualiza con el
 * resultado.
 */
export function resolveAttemptIdentity(
  previous: AttemptIdentity | null,
  fingerprint: string,
  generate: () => string = generateOrderAttemptId,
): AttemptIdentity {
  if (previous && previous.fingerprint === fingerprint) {
    return previous;
  }
  return { attemptId: generate(), fingerprint };
}

import type { OrderDraft, OrderResult } from '@/types';
import type { OrderService } from './OrderService';
import { buildOrderFingerprint } from './fingerprint';

/**
 * Se lanza cuando se reutiliza una clave de intento (`attemptId`) con un
 * pedido de contenido distinto al que se guardó con esa misma clave la
 * primera vez. Análogo a `ERROR_CODES.IDEMPOTENCY_CONFLICT` en
 * `Esquece/apps-script/Appointments.gs`, adaptado a esta demo sin backend.
 */
export class IdempotencyConflictError extends Error {
  readonly code = 'IDEMPOTENCY_CONFLICT';

  constructor(message = 'Esta clave de intento ya se usó con un pedido distinto.') {
    super(message);
    this.name = 'IdempotencyConflictError';
  }
}

interface StoredAttempt {
  fingerprint: string;
  result: OrderResult;
}

/**
 * Implementación de demostración de OrderService.
 *
 * Adapta a esta demo (sin backend) el patrón anti-duplicados de
 * `Esquece/apps-script/Appointments.gs` `actionCreateAppointment_`: antes
 * de crear nada, busca si la clave de intento ya se usó. Si ya existe con
 * el mismo contenido (`fingerprint`), devuelve exactamente el mismo
 * resultado (mismo `orderId`, mismo `submittedAt`) marcado como reutilizado
 * (`replayed: true`) en vez de crear un pedido nuevo. Si la misma clave se
 * usa con un contenido distinto, lanza `IdempotencyConflictError`.
 *
 * Limitaciones deliberadas de esta demo (ver docs/DEMO_LIMITATIONS.md):
 * - El registro de intentos es un `Map` en memoria del propio servicio: se
 *   pierde al recargar la página y no se comparte entre pestañas ni
 *   dispositivos. Esto evita el doble envío accidental dentro de la misma
 *   sesión (doble clic, reintento tras error), pero NO es una garantía de
 *   backend real.
 * - No hace ninguna solicitud de red.
 * - Cuando exista un backend real, la garantía definitiva contra pedidos
 *   duplicados debe vivir en el servidor: una clave de idempotencia única
 *   persistida (por ejemplo en una base de datos) más una operación
 *   atómica/transaccional que busque-compare-y-escriba sin condiciones de
 *   carrera entre dispositivos concurrentes (equivalente a `withScriptLock_`
 *   en Esquece, adaptado al backend que se elija para LILS — no tiene por
 *   qué ser Google Sheets, `LockService` ni el mismo modelo de datos).
 */
export class DemoOrderService implements OrderService {
  private readonly attempts = new Map<string, StoredAttempt>();

  async submit(order: OrderDraft): Promise<OrderResult> {
    const fingerprint = buildOrderFingerprint(order);
    const existing = this.attempts.get(order.attemptId);

    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        throw new IdempotencyConflictError();
      }
      return { ...existing.result, replayed: true };
    }

    const result: OrderResult = {
      success: true,
      orderId: order.attemptId,
      submittedAt: new Date().toISOString(),
      replayed: false,
    };
    this.attempts.set(order.attemptId, { fingerprint, result });
    return result;
  }
}

export const demoOrderService = new DemoOrderService();

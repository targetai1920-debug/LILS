import type { CartLine, OrderDraft } from '@/types';

/**
 * Representación canónica de una línea de carrito para el fingerprint del
 * pedido. Excluye `lineId` a propósito: dos líneas con el mismo contenido
 * pero distinto `lineId` (por ejemplo, tras editar y volver a agregar)
 * deben producir el mismo fingerprint. Los ingredientes retirados y los
 * extras se ordenan para que el orden de selección en la UI no cambie el
 * resultado.
 */
function canonicalizeLine(line: CartLine) {
  return {
    productId: line.productId,
    variantId: line.variantId,
    quantity: line.quantity,
    removedIngredientIds: [...line.removedIngredientIds].sort(),
    extras: [...line.extras]
      .map((extra) => ({ id: extra.id, priceBs: extra.priceBs }))
      .sort((a, b) => a.id.localeCompare(b.id)),
    noFries: line.noFries,
    notes: line.notes,
  };
}

/**
 * Construye una representación canónica y determinista del contenido
 * "significativo" de un pedido: todo lo que, si cambia, debe producir un
 * pedido distinto. Deliberadamente excluye `attemptId` (es la propia clave
 * de idempotencia, no parte del contenido) y cualquier valor variable como
 * una marca de tiempo. Es la base tanto de la reutilización de la clave de
 * intento en el frontend (mismo payload -> misma clave) como de la
 * detección de conflicto en `DemoOrderService` (misma clave, payload
 * distinto -> error).
 */
export function buildOrderFingerprint(draft: Omit<OrderDraft, 'attemptId'>): string {
  const canonical = {
    lines: draft.lines.map(canonicalizeLine),
    fulfillmentType: draft.fulfillmentType,
    address: draft.address,
    pickup: draft.pickup,
    billing: draft.billing,
    paymentMethod: draft.paymentMethod,
    deliveryFeeBs: draft.deliveryFeeBs,
    distanceKm: draft.distanceKm,
  };
  return JSON.stringify(canonical);
}

import type { Branch, OrderDraft, Product } from '@/types';
import { calculateCartSubtotalBs, calculateLineTotalBs, calculateLineUnitPriceBs } from '@/lib/cart/pricing';
import { calculatePaymentSplit } from './payment';

export interface OrderSummaryLine {
  lineId: string;
  productName: string;
  variantLabel: string;
  quantity: number;
  removedIngredients: string[];
  extras: { label: string; priceBs: number }[];
  noFries: boolean;
  notes: string;
  unitPriceBs: number;
  lineTotalBs: number;
}

export interface OrderSummary {
  attemptId: string;
  lines: OrderSummaryLine[];
  subtotalBs: number;
  fulfillmentType: 'delivery' | 'pickup';
  deliveryFeeBs: number;
  distanceKm: number | null;
  destination: string;
  billingLabel: string;
  paymentLabel: string;
  paidNowBs: number;
  pendingBs: number;
  totalBs: number;
}

/**
 * Construye un objeto plano y serializable (JSON) con el resumen completo
 * del pedido, para la pantalla de revisión final y el comprobante demo.
 */
export function buildOrderSummary(
  draft: OrderDraft,
  resolveProduct: (productId: string) => Product | undefined,
  branch: Branch | undefined,
): OrderSummary | null {
  if (!draft.fulfillmentType || !draft.billing || !draft.paymentMethod) {
    return null;
  }

  const lines: OrderSummaryLine[] = draft.lines.map((line) => {
    const product = resolveProduct(line.productId);
    const variant = product?.variants.find((candidate) => candidate.id === line.variantId);
    const removedLabels = line.removedIngredientIds
      .map((id) => product?.ingredients.find((ingredient) => ingredient.id === id)?.label)
      .filter((label): label is string => Boolean(label));

    return {
      lineId: line.lineId,
      productName: product?.name ?? 'Producto',
      variantLabel: variant?.label ?? '',
      quantity: line.quantity,
      removedIngredients: removedLabels,
      extras: line.extras.map((extra) => ({ label: extra.label, priceBs: extra.priceBs })),
      noFries: line.noFries,
      notes: line.notes,
      unitPriceBs: product ? calculateLineUnitPriceBs(product, line) : 0,
      lineTotalBs: product ? calculateLineTotalBs(product, line) : 0,
    };
  });

  const subtotalBs = calculateCartSubtotalBs(draft.lines, resolveProduct);
  const { paidNowBs, pendingBs, totalBs } = calculatePaymentSplit(
    draft.fulfillmentType,
    draft.paymentMethod,
    subtotalBs,
    draft.deliveryFeeBs,
  );

  const destination =
    draft.fulfillmentType === 'delivery'
      ? [draft.address?.mainStreet, draft.address?.houseNumber].filter(Boolean).join(' ')
      : branch?.name ?? '';

  const billingLabel =
    draft.billing.type === 'con-nit'
      ? `Con NIT (${draft.billing.nit} - ${draft.billing.businessName})`
      : 'Sin NIT';

  const paymentLabelMap: Record<string, string> = {
    'qr-productos': 'QR (productos) + efectivo al recibir (delivery)',
    efectivo: 'Efectivo al recibir',
    'qr-total': 'QR (total)',
    caja: 'Pago en caja',
  };

  return {
    attemptId: draft.attemptId,
    lines,
    subtotalBs,
    fulfillmentType: draft.fulfillmentType,
    deliveryFeeBs: draft.fulfillmentType === 'delivery' ? draft.deliveryFeeBs : 0,
    distanceKm: draft.distanceKm,
    destination,
    billingLabel,
    paymentLabel: paymentLabelMap[draft.paymentMethod] ?? draft.paymentMethod,
    paidNowBs,
    pendingBs,
    totalBs,
  };
}

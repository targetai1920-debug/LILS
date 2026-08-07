import type { OrderDraft } from '@/types';
import type { StepId } from './checkoutReducer';

export interface DraftValidationError {
  message: string;
  stepId: StepId;
}

const deliveryPaymentMethods = new Set(['qr-productos', 'efectivo']);
const pickupPaymentMethods = new Set(['qr-total', 'caja']);

/**
 * Última barrera antes de generar un comprobante: revalida el `OrderDraft`
 * completo, independientemente de si la interfaz ya debería haber impedido
 * llegar aquí con datos inconsistentes. Nunca se debe finalizar (ni generar
 * un QR o comprobante) con una combinación inválida — por ejemplo, un
 * método de pago que no corresponde al tipo de entrega, o un pedido de
 * recojo que arrastra una dirección y tarifa de delivery de un cambio de
 * tipo anterior.
 *
 * Devuelve `null` cuando el draft es válido, o el primer error encontrado
 * junto con el paso al que se debe llevar al usuario para corregirlo.
 */
export function validateOrderDraftForFinalization(draft: OrderDraft): DraftValidationError | null {
  if (draft.lines.length === 0) {
    return { message: 'Tu pedido está vacío. Agrega al menos un producto para continuar.', stepId: 'cart' };
  }

  if (!draft.fulfillmentType) {
    return { message: 'Elige cómo quieres recibir tu pedido: envío a domicilio o recojo en sucursal.', stepId: 'fulfillment' };
  }

  if (!draft.billing) {
    return { message: 'Completa los datos de facturación antes de continuar.', stepId: 'billing' };
  }

  if (!draft.paymentMethod) {
    return { message: 'Elige un método de pago para continuar.', stepId: 'payment' };
  }

  if (draft.fulfillmentType === 'delivery') {
    if (!deliveryPaymentMethods.has(draft.paymentMethod)) {
      return {
        message: 'El método de pago elegido no es válido para envío a domicilio. Elige uno de los métodos disponibles para delivery.',
        stepId: 'payment',
      };
    }
    if (draft.pickup) {
      return {
        message: 'Este pedido tiene datos de recojo que no corresponden a un envío a domicilio. Revisa el tipo de entrega.',
        stepId: 'fulfillment',
      };
    }
    if (!draft.address) {
      return { message: 'Completa la dirección de entrega antes de continuar.', stepId: 'details' };
    }
    return null;
  }

  // draft.fulfillmentType === 'pickup'
  if (!pickupPaymentMethods.has(draft.paymentMethod)) {
    return {
      message: 'El método de pago elegido no es válido para recojo en sucursal. Elige uno de los métodos disponibles para recojo.',
      stepId: 'payment',
    };
  }
  if (draft.address) {
    return {
      message: 'Este pedido tiene una dirección de entrega que no corresponde a un recojo en sucursal. Revisa el tipo de entrega.',
      stepId: 'fulfillment',
    };
  }
  if (draft.deliveryFeeBs !== 0 || draft.distanceKm !== null) {
    return {
      message: 'Este pedido conserva una tarifa o distancia de delivery que no corresponde a un recojo en sucursal. Revisa el tipo de entrega.',
      stepId: 'fulfillment',
    };
  }
  if (!draft.pickup) {
    return { message: 'Completa los datos de recojo antes de continuar.', stepId: 'details' };
  }

  return null;
}

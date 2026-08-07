import type {
  BillingDetails,
  DeliveryAddress,
  FulfillmentType,
  OrderResult,
  PaymentMethod,
  PickupDetails,
} from '@/types';
import { defaultBranch } from '@/data/branches';

export type StepId =
  | 'cart'
  | 'fulfillment'
  | 'details'
  | 'billing'
  | 'payment'
  | 'review'
  | 'receipt';

export function getStepList(): StepId[] {
  return ['cart', 'fulfillment', 'details', 'billing', 'payment', 'review', 'receipt'];
}

export const stepLabels: Record<StepId, string> = {
  cart: 'Productos',
  fulfillment: 'Entrega',
  details: 'Datos',
  billing: 'Facturación',
  payment: 'Pago',
  review: 'Revisión',
  receipt: 'Comprobante',
};

export interface CheckoutState {
  stepIndex: number;
  fulfillmentType: FulfillmentType | null;
  address: DeliveryAddress;
  pickup: PickupDetails;
  billing: BillingDetails;
  paymentMethod: PaymentMethod | null;
  deliveryFeeBs: number;
  distanceKm: number | null;
  finalized: boolean;
  orderResult: OrderResult | null;
}

/**
 * Estados vacíos centralizados: se reutilizan tanto al crear el estado
 * inicial del checkout como al limpiar los datos exclusivos de un tipo de
 * entrega cuando el usuario cambia de delivery a recojo (o viceversa), para
 * no duplicar estos literales en cada sitio que necesita "vaciar" una parte
 * del formulario.
 */
export function createInitialAddress(): DeliveryAddress {
  return {
    mainStreet: '',
    houseNumber: '',
    noHouseNumber: false,
    reference: '',
    crossStreet: '',
    location: null,
    phone: '',
    phoneNormalized: '',
  };
}

export function createInitialPickup(): PickupDetails {
  return {
    branchId: defaultBranch.id,
    personName: '',
    date: '',
    time: '',
  };
}

export function createInitialBilling(): BillingDetails {
  return {
    type: 'sin-nit',
    nit: '',
    businessName: '',
  };
}

export function createInitialCheckoutState(): CheckoutState {
  return {
    stepIndex: 0,
    fulfillmentType: null,
    address: createInitialAddress(),
    pickup: createInitialPickup(),
    billing: createInitialBilling(),
    paymentMethod: null,
    deliveryFeeBs: 0,
    distanceKm: null,
    finalized: false,
    orderResult: null,
  };
}

export type CheckoutAction =
  | { type: 'GO_TO_STEP'; stepIndex: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_FULFILLMENT'; value: FulfillmentType }
  | { type: 'PATCH_ADDRESS'; patch: Partial<DeliveryAddress> }
  | { type: 'PATCH_PICKUP'; patch: Partial<PickupDetails> }
  | { type: 'SET_BILLING'; billing: BillingDetails }
  | { type: 'SET_PAYMENT'; value: PaymentMethod }
  | { type: 'SET_DELIVERY_FEE'; feeBs: number; distanceKm: number | null }
  | { type: 'FINALIZE'; orderResult: OrderResult }
  | { type: 'RESET_CHECKOUT' };

/**
 * Cambiar el tipo de entrega (delivery <-> recojo) reinicia:
 * - el método de pago (las opciones válidas dependen del tipo);
 * - cualquier estado de finalización previo (nunca se llega al comprobante
 *   con datos de un tipo distinto al que se finalizó);
 * - los datos exclusivos del OTRO tipo, que quedarían incompatibles.
 *
 * El carrito y la facturación (con/sin NIT) se conservan siempre: no son
 * exclusivos de un tipo de entrega. Volver a elegir el mismo tipo que ya
 * estaba seleccionado es un no-op explícito para no borrar nada.
 */
function applyFulfillmentChange(state: CheckoutState, value: FulfillmentType): CheckoutState {
  if (state.fulfillmentType === value) {
    return state;
  }

  const base: CheckoutState = {
    ...state,
    fulfillmentType: value,
    paymentMethod: null,
    finalized: false,
    orderResult: null,
  };

  if (value === 'pickup') {
    return {
      ...base,
      address: createInitialAddress(),
      deliveryFeeBs: 0,
      distanceKm: null,
    };
  }

  // value === 'delivery'
  return {
    ...base,
    pickup: createInitialPickup(),
  };
}

export function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'GO_TO_STEP':
      return { ...state, stepIndex: action.stepIndex };
    case 'NEXT_STEP':
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, getStepList().length - 1) };
    case 'PREV_STEP':
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) };
    case 'SET_FULFILLMENT':
      return applyFulfillmentChange(state, action.value);
    case 'PATCH_ADDRESS':
      return { ...state, address: { ...state.address, ...action.patch } };
    case 'PATCH_PICKUP':
      return { ...state, pickup: { ...state.pickup, ...action.patch } };
    case 'SET_BILLING':
      return { ...state, billing: action.billing };
    case 'SET_PAYMENT':
      return { ...state, paymentMethod: action.value };
    case 'SET_DELIVERY_FEE':
      return { ...state, deliveryFeeBs: action.feeBs, distanceKm: action.distanceKm };
    case 'FINALIZE':
      return { ...state, finalized: true, orderResult: action.orderResult };
    case 'RESET_CHECKOUT':
      return createInitialCheckoutState();
    default:
      return state;
  }
}

import type {
  BillingDetails,
  DeliveryAddress,
  FulfillmentType,
  OrderResult,
  PaymentMethod,
  PickupDetails,
} from '@/types';
import { branches } from '@/data/branches';
import { generateOrderAttemptId } from './attemptId';

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
  attemptId: string;
  finalized: boolean;
  orderResult: OrderResult | null;
}

export function createInitialCheckoutState(): CheckoutState {
  return {
    stepIndex: 0,
    fulfillmentType: null,
    address: {
      mainStreet: '',
      houseNumber: '',
      noHouseNumber: false,
      reference: '',
      crossStreet: '',
      location: null,
      phone: '',
      phoneNormalized: '',
    },
    pickup: {
      branchId: branches[0]?.id ?? '',
      personName: '',
      date: '',
      time: '',
    },
    billing: {
      type: 'sin-nit',
      nit: '',
      businessName: '',
    },
    paymentMethod: null,
    deliveryFeeBs: 0,
    distanceKm: null,
    attemptId: generateOrderAttemptId(),
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

export function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'GO_TO_STEP':
      return { ...state, stepIndex: action.stepIndex };
    case 'NEXT_STEP':
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, getStepList().length - 1) };
    case 'PREV_STEP':
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) };
    case 'SET_FULFILLMENT':
      return { ...state, fulfillmentType: action.value };
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

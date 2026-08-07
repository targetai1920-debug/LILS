'use client';

import { useReducer, useState } from 'react';
import type { OrderDraft } from '@/types';
import { useCart } from '@/context/CartContext';
import {
  checkoutReducer,
  createInitialCheckoutState,
  getStepList,
} from '@/lib/orders/checkoutReducer';
import { demoOrderService } from '@/lib/orders/DemoOrderService';
import { getProductById } from '@/data/menu';
import { calculateCartSubtotalBs } from '@/lib/cart/pricing';
import { Stepper } from './Stepper';
import { CartStep } from './CartStep';
import { FulfillmentStep } from './FulfillmentStep';
import { DeliveryDetailsStep } from './DeliveryDetailsStep';
import { PickupDetailsStep } from './PickupDetailsStep';
import { BillingStep } from './BillingStep';
import { PaymentStep } from './PaymentStep';
import { ReviewStep } from './ReviewStep';
import { ReceiptStep } from './ReceiptStep';

export function OrderFlow() {
  const { lines, clearCart } = useCart();
  const [state, dispatch] = useReducer(checkoutReducer, undefined, createInitialCheckoutState);
  const [finalizing, setFinalizing] = useState(false);

  const steps = getStepList();
  const currentStep = steps[state.stepIndex];
  const subtotalBs = calculateCartSubtotalBs(lines, getProductById);

  const draft: OrderDraft = {
    attemptId: state.attemptId,
    lines,
    fulfillmentType: state.fulfillmentType,
    address: state.fulfillmentType === 'delivery' ? state.address : null,
    pickup: state.fulfillmentType === 'pickup' ? state.pickup : null,
    billing: state.billing,
    paymentMethod: state.paymentMethod,
    deliveryFeeBs: state.deliveryFeeBs,
    distanceKm: state.distanceKm,
  };

  async function handleFinalize() {
    if (state.finalized) return;
    setFinalizing(true);
    try {
      const result = await demoOrderService.submit(draft);
      dispatch({ type: 'FINALIZE', orderResult: result });
      dispatch({ type: 'GO_TO_STEP', stepIndex: steps.indexOf('receipt') });
    } finally {
      setFinalizing(false);
    }
  }

  function handleStartNewOrder() {
    clearCart();
    dispatch({ type: 'RESET_CHECKOUT' });
  }

  function handleClearLocalData() {
    clearCart();
    dispatch({ type: 'RESET_CHECKOUT' });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-3xl font-extrabold text-brand-black">Ordenar</h1>
      <div className="mt-4 overflow-x-auto pb-2">
        <Stepper currentStepIndex={state.stepIndex} />
      </div>

      <div className="mt-6 rounded-brand border-2 border-brand-black/10 bg-brand-white p-5 md:p-6">
        {currentStep === 'cart' ? (
          <CartStep onContinue={() => dispatch({ type: 'NEXT_STEP' })} />
        ) : null}

        {currentStep === 'fulfillment' ? (
          <FulfillmentStep
            value={state.fulfillmentType}
            onChange={(value) => dispatch({ type: 'SET_FULFILLMENT', value })}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            onContinue={() => dispatch({ type: 'NEXT_STEP' })}
          />
        ) : null}

        {currentStep === 'details' && state.fulfillmentType === 'delivery' ? (
          <DeliveryDetailsStep
            address={state.address}
            onPatch={(patch) => dispatch({ type: 'PATCH_ADDRESS', patch })}
            onFeeCalculated={(feeBs, distanceKm) => dispatch({ type: 'SET_DELIVERY_FEE', feeBs, distanceKm })}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            onContinue={() => dispatch({ type: 'NEXT_STEP' })}
          />
        ) : null}

        {currentStep === 'details' && state.fulfillmentType === 'pickup' ? (
          <PickupDetailsStep
            pickup={state.pickup}
            onPatch={(patch) => dispatch({ type: 'PATCH_PICKUP', patch })}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            onContinue={() => dispatch({ type: 'NEXT_STEP' })}
          />
        ) : null}

        {currentStep === 'billing' ? (
          <BillingStep
            billing={state.billing}
            onChange={(billing) => dispatch({ type: 'SET_BILLING', billing })}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            onContinue={() => dispatch({ type: 'NEXT_STEP' })}
          />
        ) : null}

        {currentStep === 'payment' && state.fulfillmentType ? (
          <PaymentStep
            fulfillmentType={state.fulfillmentType}
            value={state.paymentMethod}
            onChange={(value) => dispatch({ type: 'SET_PAYMENT', value })}
            subtotalBs={subtotalBs}
            deliveryFeeBs={state.deliveryFeeBs}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            onContinue={() => dispatch({ type: 'NEXT_STEP' })}
          />
        ) : null}

        {currentStep === 'review' ? (
          <ReviewStep
            draft={draft}
            onEditStep={(stepIndex) => dispatch({ type: 'GO_TO_STEP', stepIndex })}
            onBack={() => dispatch({ type: 'PREV_STEP' })}
            onFinalize={handleFinalize}
            finalizing={finalizing}
          />
        ) : null}

        {currentStep === 'receipt' && state.orderResult ? (
          <ReceiptStep
            draft={draft}
            submittedAt={state.orderResult.submittedAt}
            onStartNewOrder={handleStartNewOrder}
            onClearLocalData={handleClearLocalData}
          />
        ) : null}
      </div>
    </div>
  );
}

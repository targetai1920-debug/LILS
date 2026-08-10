'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { OrderDraft } from '@/types';
import { useCart } from '@/context/CartContext';
import {
  checkoutReducer,
  createInitialCheckoutState,
  getStepList,
  type CheckoutAction,
} from '@/lib/orders/checkoutReducer';
import { demoOrderService, IdempotencyConflictError } from '@/lib/orders/DemoOrderService';
import { buildOrderFingerprint } from '@/lib/orders/fingerprint';
import { resolveAttemptIdentity, type AttemptIdentity } from '@/lib/orders/attemptId';
import { validateOrderDraftForFinalization } from '@/lib/orders/draftValidation';
import { getProductById } from '@/data/menu';
import { calculateCartSubtotalBs } from '@/lib/cart/pricing';
import { CART_SUMMARY_ID, VIEW_CART_EVENT } from '@/lib/cart/navigation';
import { Stepper } from './Stepper';
import { CartStep } from './CartStep';
import { FulfillmentStep } from './FulfillmentStep';
import { DeliveryDetailsStep } from './DeliveryDetailsStep';
import { PickupDetailsStep } from './PickupDetailsStep';
import { BillingStep } from './BillingStep';
import { PaymentStep } from './PaymentStep';
import { ReviewStep } from './ReviewStep';
import { ReceiptStep } from './ReceiptStep';

function scrollToOrderSection(id: string) {
  const target = document.getElementById(id);
  if (target && typeof target.scrollIntoView === 'function') {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
}

export function OrderFlow() {
  const { lines, clearCart } = useCart();
  const [state, dispatch] = useReducer(checkoutReducer, undefined, createInitialCheckoutState);
  const [finalizing, setFinalizing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Identidad del intento de envío (clave de idempotencia + huella del
  // contenido que representa). Vive en un ref, no en el reducer: solo debe
  // cambiar en el instante de finalizar, comparando contra el intento
  // anterior — igual que `idempotencyKeyRef`/`idempotencyPayloadRef` en
  // Esquece/web-reservas/app/page.tsx.
  const identityRef = useRef<AttemptIdentity | null>(null);
  // Guarda sincrónica de doble clic: un `useRef` se lee/escribe de inmediato,
  // sin esperar a que React vuelva a renderizar, así que dos clics casi
  // simultáneos (antes de que `finalizing` se refleje en el DOM) no pueden
  // colar una segunda llamada al servicio. El botón deshabilitado por
  // `finalizing` es la protección visual; esta es la protección real.
  const submittingRef = useRef(false);
  const previousStepIndexRef = useRef(state.stepIndex);
  const scrollToCartSummaryRef = useRef(false);

  const steps = getStepList();
  const currentStep = steps[state.stepIndex];
  const subtotalBs = calculateCartSubtotalBs(lines, getProductById);

  const draft: OrderDraft = useMemo(
    () => ({
      attemptId: state.orderResult?.orderId ?? '',
      lines,
      fulfillmentType: state.fulfillmentType,
      address: state.fulfillmentType === 'delivery' ? state.address : null,
      pickup: state.fulfillmentType === 'pickup' ? state.pickup : null,
      billing: state.billing,
      paymentMethod: state.paymentMethod,
      deliveryFeeBs: state.deliveryFeeBs,
      distanceKm: state.distanceKm,
    }),
    [state, lines],
  );

  useEffect(() => {
    if (previousStepIndexRef.current === state.stepIndex) return;

    previousStepIndexRef.current = state.stepIndex;
    const targetId = scrollToCartSummaryRef.current ? CART_SUMMARY_ID : 'paso-pedido-actual';
    scrollToCartSummaryRef.current = false;
    scrollToOrderSection(targetId);
  }, [state.stepIndex]);

  useEffect(() => {
    function showCartSummary() {
      if (state.stepIndex === 0) {
        scrollToOrderSection(CART_SUMMARY_ID);
        return;
      }

      scrollToCartSummaryRef.current = true;
      dispatch({ type: 'GO_TO_STEP', stepIndex: 0 });
    }

    window.addEventListener(VIEW_CART_EVENT, showCartSummary);
    return () => window.removeEventListener(VIEW_CART_EVENT, showCartSummary);
  }, [state.stepIndex]);

  useEffect(() => {
    if (window.location.hash === `#${CART_SUMMARY_ID}`) {
      scrollToOrderSection(CART_SUMMARY_ID);
    }
  }, []);

  /** Despacha una acción y limpia cualquier mensaje de validación pendiente. */
  function act(action: CheckoutAction) {
    setValidationError(null);
    dispatch(action);
  }

  async function handleFinalize() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setFinalizing(true);
    setValidationError(null);

    try {
      const validationIssue = validateOrderDraftForFinalization(draft);
      if (validationIssue) {
        setValidationError(validationIssue.message);
        dispatch({ type: 'GO_TO_STEP', stepIndex: steps.indexOf(validationIssue.stepId) });
        return;
      }

      const fingerprint = buildOrderFingerprint(draft);
      const identity = resolveAttemptIdentity(identityRef.current, fingerprint);
      identityRef.current = identity;

      const result = await demoOrderService.submit({ ...draft, attemptId: identity.attemptId });
      dispatch({ type: 'FINALIZE', orderResult: result });
      dispatch({ type: 'GO_TO_STEP', stepIndex: steps.indexOf('receipt') });
    } catch (error) {
      if (error instanceof IdempotencyConflictError) {
        setValidationError(
          'Tu pedido cambió desde el último intento de envío. Revisa el resumen antes de volver a finalizar.',
        );
      } else {
        setValidationError('No pudimos procesar el pedido de demostración. Intenta nuevamente.');
      }
    } finally {
      submittingRef.current = false;
      setFinalizing(false);
    }
  }

  function handleStartNewOrder() {
    clearCart();
    identityRef.current = null;
    dispatch({ type: 'RESET_CHECKOUT' });
  }

  function handleClearLocalData() {
    clearCart();
    identityRef.current = null;
    dispatch({ type: 'RESET_CHECKOUT' });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <header className="blueprint-pattern rounded-[2.5rem] px-6 py-8 text-brand-white shadow-[0_20px_50px_rgba(23,37,119,0.18)] md:px-9">
        <span className="lils-kicker border-brand-white/20 bg-brand-white/10 text-brand-white">Pedido LILS</span>
        <h1 className="font-display mt-3 text-4xl font-black tracking-[-0.04em] md:text-5xl">Ordenar</h1>
        <p className="mt-2 max-w-xl text-sm text-brand-white/70">Elige, personaliza y revisa todo paso a paso.</p>
      </header>
      <div className="mt-4 overflow-x-auto pb-2">
        <Stepper currentStepIndex={state.stepIndex} />
      </div>

      <div
        id="paso-pedido-actual"
        className={`mt-6 scroll-mt-28 ${currentStep === 'cart' ? '' : 'lils-surface mx-auto max-w-3xl p-5 md:p-7'}`}
      >
        {currentStep === 'cart' ? <CartStep onContinue={() => act({ type: 'NEXT_STEP' })} /> : null}

        {currentStep === 'fulfillment' ? (
          <FulfillmentStep
            value={state.fulfillmentType}
            onChange={(value) => act({ type: 'SET_FULFILLMENT', value })}
            onBack={() => act({ type: 'PREV_STEP' })}
            onContinue={() => act({ type: 'NEXT_STEP' })}
          />
        ) : null}

        {currentStep === 'details' && state.fulfillmentType === 'delivery' ? (
          <DeliveryDetailsStep
            address={state.address}
            onPatch={(patch) => act({ type: 'PATCH_ADDRESS', patch })}
            onFeeCalculated={(feeBs, distanceKm) => act({ type: 'SET_DELIVERY_FEE', feeBs, distanceKm })}
            onBack={() => act({ type: 'PREV_STEP' })}
            onContinue={() => act({ type: 'NEXT_STEP' })}
          />
        ) : null}

        {currentStep === 'details' && state.fulfillmentType === 'pickup' ? (
          <PickupDetailsStep
            pickup={state.pickup}
            onPatch={(patch) => act({ type: 'PATCH_PICKUP', patch })}
            onBack={() => act({ type: 'PREV_STEP' })}
            onContinue={() => act({ type: 'NEXT_STEP' })}
          />
        ) : null}

        {currentStep === 'billing' ? (
          <BillingStep
            billing={state.billing}
            onChange={(billing) => act({ type: 'SET_BILLING', billing })}
            onBack={() => act({ type: 'PREV_STEP' })}
            onContinue={() => act({ type: 'NEXT_STEP' })}
          />
        ) : null}

        {currentStep === 'payment' && state.fulfillmentType ? (
          <PaymentStep
            fulfillmentType={state.fulfillmentType}
            value={state.paymentMethod}
            onChange={(value) => act({ type: 'SET_PAYMENT', value })}
            subtotalBs={subtotalBs}
            deliveryFeeBs={state.deliveryFeeBs}
            onBack={() => act({ type: 'PREV_STEP' })}
            onContinue={() => act({ type: 'NEXT_STEP' })}
          />
        ) : null}

        {currentStep === 'review' ? (
          <ReviewStep
            draft={draft}
            onEditStep={(stepIndex) => act({ type: 'GO_TO_STEP', stepIndex })}
            onBack={() => act({ type: 'PREV_STEP' })}
            onFinalize={handleFinalize}
            finalizing={finalizing}
            errorMessage={validationError}
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

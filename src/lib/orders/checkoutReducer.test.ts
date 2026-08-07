import { describe, expect, it } from 'vitest';
import { checkoutReducer, createInitialCheckoutState, getStepList } from './checkoutReducer';
import type { CheckoutState } from './checkoutReducer';

function deliveryReadyState(): CheckoutState {
  let state = createInitialCheckoutState();
  state = checkoutReducer(state, { type: 'SET_FULFILLMENT', value: 'delivery' });
  state = checkoutReducer(state, {
    type: 'PATCH_ADDRESS',
    patch: {
      mainStreet: 'Av. Melchor Urquidi',
      houseNumber: '123',
      crossStreet: 'J. A. Rico Toro',
      location: { lat: -17.3895, lng: -66.1568 },
      phone: '71234567',
      phoneNormalized: '+59171234567',
    },
  });
  state = checkoutReducer(state, { type: 'SET_DELIVERY_FEE', feeBs: 10, distanceKm: 3.2 });
  state = checkoutReducer(state, { type: 'SET_BILLING', billing: { type: 'con-nit', nit: '123', businessName: 'ACME' } });
  state = checkoutReducer(state, { type: 'SET_PAYMENT', value: 'qr-productos' });
  return state;
}

function pickupReadyState(): CheckoutState {
  let state = createInitialCheckoutState();
  state = checkoutReducer(state, { type: 'SET_FULFILLMENT', value: 'pickup' });
  state = checkoutReducer(state, {
    type: 'PATCH_PICKUP',
    patch: { personName: 'Ana', date: '2026-08-10', time: '18:00' },
  });
  state = checkoutReducer(state, { type: 'SET_BILLING', billing: { type: 'sin-nit', nit: '', businessName: '' } });
  state = checkoutReducer(state, { type: 'SET_PAYMENT', value: 'qr-total' });
  return state;
}

describe('checkoutReducer: navegación', () => {
  it('navega hacia adelante y atrás sin salirse de los límites', () => {
    const initial = createInitialCheckoutState();
    let state = checkoutReducer(initial, { type: 'PREV_STEP' });
    expect(state.stepIndex).toBe(0);

    state = checkoutReducer(initial, { type: 'GO_TO_STEP', stepIndex: getStepList().length - 1 });
    state = checkoutReducer(state, { type: 'NEXT_STEP' });
    expect(state.stepIndex).toBe(getStepList().length - 1);
  });

  it('preserva el pedido al volver a un paso anterior (no borra otros datos)', () => {
    let state = createInitialCheckoutState();
    state = checkoutReducer(state, { type: 'SET_FULFILLMENT', value: 'delivery' });
    state = checkoutReducer(state, {
      type: 'PATCH_ADDRESS',
      patch: { mainStreet: 'Av. Melchor Urquidi', phone: '71234567' },
    });
    state = checkoutReducer(state, { type: 'SET_BILLING', billing: { type: 'con-nit', nit: '123', businessName: 'ACME' } });
    state = checkoutReducer(state, { type: 'GO_TO_STEP', stepIndex: 0 });

    expect(state.fulfillmentType).toBe('delivery');
    expect(state.address.mainStreet).toBe('Av. Melchor Urquidi');
    expect(state.billing.businessName).toBe('ACME');
  });

  it('volver entre pasos sin cambiar el tipo de entrega conserva los datos válidos', () => {
    const ready = deliveryReadyState();
    const afterBack = checkoutReducer(ready, { type: 'PREV_STEP' });
    const afterForward = checkoutReducer(afterBack, { type: 'NEXT_STEP' });

    expect(afterForward.fulfillmentType).toBe('delivery');
    expect(afterForward.address.mainStreet).toBe('Av. Melchor Urquidi');
    expect(afterForward.deliveryFeeBs).toBe(10);
    expect(afterForward.distanceKm).toBe(3.2);
    expect(afterForward.paymentMethod).toBe('qr-productos');
    expect(afterForward.billing.businessName).toBe('ACME');
  });

  it('PATCH_ADDRESS combina el parche sin perder otros campos ya definidos', () => {
    let state = createInitialCheckoutState();
    state = checkoutReducer(state, { type: 'PATCH_ADDRESS', patch: { mainStreet: 'Calle 1', crossStreet: 'Calle 2' } });
    state = checkoutReducer(state, { type: 'PATCH_ADDRESS', patch: { phone: '71234567' } });

    expect(state.address.mainStreet).toBe('Calle 1');
    expect(state.address.crossStreet).toBe('Calle 2');
    expect(state.address.phone).toBe('71234567');
  });

  it('RESET_CHECKOUT devuelve un estado inicial limpio', () => {
    const state = deliveryReadyState();
    const reset = checkoutReducer(state, { type: 'RESET_CHECKOUT' });
    expect(reset.stepIndex).toBe(0);
    expect(reset.fulfillmentType).toBeNull();
    expect(reset.paymentMethod).toBeNull();
    expect(reset.finalized).toBe(false);
  });
});

describe('checkoutReducer: cambio de tipo de entrega', () => {
  it('1. delivery con qr-productos -> cambiar a recojo -> el pago vuelve a null', () => {
    const ready = deliveryReadyState();
    expect(ready.paymentMethod).toBe('qr-productos');

    const afterSwitch = checkoutReducer(ready, { type: 'SET_FULFILLMENT', value: 'pickup' });
    expect(afterSwitch.paymentMethod).toBeNull();
  });

  it('2. delivery -> recojo elimina tarifa, distancia y dirección incompatibles', () => {
    const ready = deliveryReadyState();
    const afterSwitch = checkoutReducer(ready, { type: 'SET_FULFILLMENT', value: 'pickup' });

    expect(afterSwitch.deliveryFeeBs).toBe(0);
    expect(afterSwitch.distanceKm).toBeNull();
    expect(afterSwitch.address).toEqual(createInitialCheckoutState().address);
  });

  it('delivery -> recojo conserva el carrito (no aplica aquí) y la facturación', () => {
    const ready = deliveryReadyState();
    const afterSwitch = checkoutReducer(ready, { type: 'SET_FULFILLMENT', value: 'pickup' });

    expect(afterSwitch.billing).toEqual({ type: 'con-nit', nit: '123', businessName: 'ACME' });
  });

  it('delivery -> recojo elimina cualquier estado de finalización anterior', () => {
    let ready = deliveryReadyState();
    ready = checkoutReducer(ready, {
      type: 'FINALIZE',
      orderResult: { success: true, orderId: 'order-1', submittedAt: '2026-01-01T00:00:00.000Z', replayed: false },
    });
    expect(ready.finalized).toBe(true);

    const afterSwitch = checkoutReducer(ready, { type: 'SET_FULFILLMENT', value: 'pickup' });
    expect(afterSwitch.finalized).toBe(false);
    expect(afterSwitch.orderResult).toBeNull();
  });

  it('3. recojo con qr-total -> cambiar a delivery -> el pago vuelve a null', () => {
    const ready = pickupReadyState();
    expect(ready.paymentMethod).toBe('qr-total');

    const afterSwitch = checkoutReducer(ready, { type: 'SET_FULFILLMENT', value: 'delivery' });
    expect(afterSwitch.paymentMethod).toBeNull();
  });

  it('4. recojo -> delivery elimina los datos incompatibles de recojo', () => {
    const ready = pickupReadyState();
    const afterSwitch = checkoutReducer(ready, { type: 'SET_FULFILLMENT', value: 'delivery' });

    expect(afterSwitch.pickup).toEqual(createInitialCheckoutState().pickup);
  });

  it('recojo -> delivery conserva la facturación', () => {
    const ready = pickupReadyState();
    const afterSwitch = checkoutReducer(ready, { type: 'SET_FULFILLMENT', value: 'delivery' });

    expect(afterSwitch.billing).toEqual({ type: 'sin-nit', nit: '', businessName: '' });
  });

  it('recojo -> delivery elimina cualquier estado de finalización anterior', () => {
    let ready = pickupReadyState();
    ready = checkoutReducer(ready, {
      type: 'FINALIZE',
      orderResult: { success: true, orderId: 'order-1', submittedAt: '2026-01-01T00:00:00.000Z', replayed: false },
    });

    const afterSwitch = checkoutReducer(ready, { type: 'SET_FULFILLMENT', value: 'delivery' });
    expect(afterSwitch.finalized).toBe(false);
    expect(afterSwitch.orderResult).toBeNull();
  });

  it('seleccionar de nuevo el mismo tipo no borra sus datos (no-op)', () => {
    const ready = deliveryReadyState();
    const reselected = checkoutReducer(ready, { type: 'SET_FULFILLMENT', value: 'delivery' });

    expect(reselected).toBe(ready);
    expect(reselected.address.mainStreet).toBe('Av. Melchor Urquidi');
    expect(reselected.paymentMethod).toBe('qr-productos');
    expect(reselected.deliveryFeeBs).toBe(10);
  });

  it('seleccionar de nuevo "recojo" sin cambiarlo tampoco borra sus datos', () => {
    const ready = pickupReadyState();
    const reselected = checkoutReducer(ready, { type: 'SET_FULFILLMENT', value: 'pickup' });

    expect(reselected).toBe(ready);
    expect(reselected.pickup.personName).toBe('Ana');
    expect(reselected.paymentMethod).toBe('qr-total');
  });
});

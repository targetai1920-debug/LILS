import { describe, expect, it } from 'vitest';
import { checkoutReducer, createInitialCheckoutState, getStepList } from './checkoutReducer';

describe('checkoutReducer', () => {
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

  it('PATCH_ADDRESS combina el parche sin perder otros campos ya definidos', () => {
    let state = createInitialCheckoutState();
    state = checkoutReducer(state, { type: 'PATCH_ADDRESS', patch: { mainStreet: 'Calle 1', crossStreet: 'Calle 2' } });
    state = checkoutReducer(state, { type: 'PATCH_ADDRESS', patch: { phone: '71234567' } });

    expect(state.address.mainStreet).toBe('Calle 1');
    expect(state.address.crossStreet).toBe('Calle 2');
    expect(state.address.phone).toBe('71234567');
  });

  it('RESET_CHECKOUT devuelve un estado nuevo (nuevo attemptId)', () => {
    const state = createInitialCheckoutState();
    const reset = checkoutReducer(state, { type: 'RESET_CHECKOUT' });
    expect(reset.attemptId).not.toBe(state.attemptId);
    expect(reset.stepIndex).toBe(0);
  });
});

import { describe, expect, it } from 'vitest';
import { cartReducer, clampQuantity, emptyCartState, MAX_QUANTITY, MIN_QUANTITY } from './reducer';
import type { CartLine } from '@/types';

const baseLine: Omit<CartLine, 'lineId'> = {
  productId: 'lils-burger',
  variantId: 'doble',
  quantity: 1,
  removedIngredientIds: [],
  extras: [],
  noFries: false,
  notes: '',
};

describe('clampQuantity', () => {
  it('no permite cantidades menores al mínimo', () => {
    expect(clampQuantity(0)).toBe(MIN_QUANTITY);
    expect(clampQuantity(-5)).toBe(MIN_QUANTITY);
  });

  it('no permite cantidades mayores al máximo', () => {
    expect(clampQuantity(MAX_QUANTITY + 10)).toBe(MAX_QUANTITY);
  });
});

describe('cartReducer', () => {
  it('agrega una línea nueva con un lineId único', () => {
    const state = cartReducer(emptyCartState, { type: 'ADD_LINE', line: baseLine });
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0]?.lineId).toBeTruthy();
  });

  it('conserva cada personalización como una línea independiente', () => {
    let state = cartReducer(emptyCartState, { type: 'ADD_LINE', line: baseLine });
    state = cartReducer(state, {
      type: 'ADD_LINE',
      line: { ...baseLine, removedIngredientIds: ['bbq'] },
    });
    expect(state.lines).toHaveLength(2);
  });

  it('actualiza la cantidad de una línea existente respetando los límites', () => {
    let state = cartReducer(emptyCartState, { type: 'ADD_LINE', line: baseLine });
    const lineId = state.lines[0]!.lineId;
    state = cartReducer(state, { type: 'SET_QUANTITY', lineId, quantity: 5 });
    expect(state.lines[0]?.quantity).toBe(5);

    state = cartReducer(state, { type: 'SET_QUANTITY', lineId, quantity: 999 });
    expect(state.lines[0]?.quantity).toBe(MAX_QUANTITY);
  });

  it('edita una línea preservando su lineId', () => {
    let state = cartReducer(emptyCartState, { type: 'ADD_LINE', line: baseLine });
    const lineId = state.lines[0]!.lineId;
    state = cartReducer(state, {
      type: 'UPDATE_LINE',
      lineId,
      line: { ...baseLine, variantId: 'triple', notes: 'bien cocida' },
    });
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0]?.lineId).toBe(lineId);
    expect(state.lines[0]?.variantId).toBe('triple');
    expect(state.lines[0]?.notes).toBe('bien cocida');
  });

  it('elimina una línea por su lineId', () => {
    let state = cartReducer(emptyCartState, { type: 'ADD_LINE', line: baseLine });
    const lineId = state.lines[0]!.lineId;
    state = cartReducer(state, { type: 'REMOVE_LINE', lineId });
    expect(state.lines).toHaveLength(0);
  });

  it('vacía el carrito por completo', () => {
    let state = cartReducer(emptyCartState, { type: 'ADD_LINE', line: baseLine });
    state = cartReducer(state, { type: 'CLEAR_CART' });
    expect(state.lines).toHaveLength(0);
  });
});

'use client';

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CartLine } from '@/types';
import { cartReducer, emptyCartState } from '@/lib/cart/reducer';
import { loadCartFromStorage, saveCartToStorage, clearCartStorage } from '@/lib/cart/storage';

interface CartContextValue {
  lines: CartLine[];
  hydrated: boolean;
  addLine: (line: Omit<CartLine, 'lineId'>) => void;
  updateLine: (lineId: string, line: Omit<CartLine, 'lineId'>) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, emptyCartState);

  // Un único dispatch: `loadCartFromStorage()` ya devuelve `hydrated: true`,
  // así que este efecto sincroniza el carrito con localStorage en una sola
  // actualización de estado, en vez de dos (líneas + bandera) que
  // producirían un render en cascada.
  useEffect(() => {
    dispatch({ type: 'REPLACE_STATE', state: loadCartFromStorage() });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    saveCartToStorage(state);
  }, [state]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      hydrated: state.hydrated,
      addLine: (line) => dispatch({ type: 'ADD_LINE', line }),
      updateLine: (lineId, line) => dispatch({ type: 'UPDATE_LINE', lineId, line }),
      setQuantity: (lineId, quantity) => dispatch({ type: 'SET_QUANTITY', lineId, quantity }),
      removeLine: (lineId) => dispatch({ type: 'REMOVE_LINE', lineId }),
      clearCart: () => {
        dispatch({ type: 'CLEAR_CART' });
        clearCartStorage();
      },
    }),
    [state],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return ctx;
}

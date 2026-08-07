import type { CartState } from '@/types';
import { emptyCartState } from './reducer';

const CART_STORAGE_KEY = 'lils-demo-cart-v1';

/**
 * Carga el carrito desde localStorage. Siempre devuelve `hydrated: true`:
 * representa el estado ya resuelto (con o sin datos guardados), listo para
 * reemplazar el estado inicial en un único `dispatch`.
 */
export function loadCartFromStorage(): CartState {
  if (typeof window === 'undefined') return emptyCartState;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { ...emptyCartState, hydrated: true };
    const parsed = JSON.parse(raw) as Partial<CartState>;
    if (!parsed || !Array.isArray(parsed.lines)) return { ...emptyCartState, hydrated: true };
    return { lines: parsed.lines, hydrated: true };
  } catch {
    return { ...emptyCartState, hydrated: true };
  }
}

export function saveCartToStorage(state: CartState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ lines: state.lines }));
  } catch {
    // Almacenamiento no disponible (modo privado, cuota excedida, etc.): se ignora en la demo.
  }
}

export function clearCartStorage(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CART_STORAGE_KEY);
}

export const CART_STORAGE_KEY_NAME = CART_STORAGE_KEY;

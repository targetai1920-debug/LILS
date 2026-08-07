import type { CartState } from '@/types';
import { emptyCartState } from './reducer';

const CART_STORAGE_KEY = 'lils-demo-cart-v1';

export function loadCartFromStorage(): CartState {
  if (typeof window === 'undefined') return emptyCartState;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return emptyCartState;
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed || !Array.isArray(parsed.lines)) return emptyCartState;
    return parsed;
  } catch {
    return emptyCartState;
  }
}

export function saveCartToStorage(state: CartState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Almacenamiento no disponible (modo privado, cuota excedida, etc.): se ignora en la demo.
  }
}

export function clearCartStorage(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CART_STORAGE_KEY);
}

export const CART_STORAGE_KEY_NAME = CART_STORAGE_KEY;

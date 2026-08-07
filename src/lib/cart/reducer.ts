import type { CartLine, CartState } from '@/types';
import { generateId } from './id';

export type CartAction =
  | { type: 'ADD_LINE'; line: Omit<CartLine, 'lineId'> }
  | { type: 'UPDATE_LINE'; lineId: string; line: Omit<CartLine, 'lineId'> }
  | { type: 'SET_QUANTITY'; lineId: string; quantity: number }
  | { type: 'REMOVE_LINE'; lineId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'REPLACE_STATE'; state: CartState };

export const emptyCartState: CartState = { lines: [] };

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 20;

export function clampQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.round(quantity)));
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_LINE': {
      const newLine: CartLine = { ...action.line, lineId: generateId('line') };
      return { lines: [...state.lines, newLine] };
    }
    case 'UPDATE_LINE': {
      return {
        lines: state.lines.map((line) =>
          line.lineId === action.lineId ? { ...action.line, lineId: action.lineId } : line,
        ),
      };
    }
    case 'SET_QUANTITY': {
      return {
        lines: state.lines.map((line) =>
          line.lineId === action.lineId
            ? { ...line, quantity: clampQuantity(action.quantity) }
            : line,
        ),
      };
    }
    case 'REMOVE_LINE': {
      return { lines: state.lines.filter((line) => line.lineId !== action.lineId) };
    }
    case 'CLEAR_CART': {
      return emptyCartState;
    }
    case 'REPLACE_STATE': {
      return action.state;
    }
    default:
      return state;
  }
}

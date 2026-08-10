import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider } from '@/context/CartContext';
import { CART_STORAGE_KEY_NAME } from '@/lib/cart/storage';
import { VIEW_CART_EVENT } from '@/lib/cart/navigation';
import { CartBar } from './CartBar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/LILS/ordenar/',
}));

describe('CartBar', () => {
  it('activa la navegación al resumen al tocar Ver pedido en Ordenar', async () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY_NAME,
      JSON.stringify({
        lines: [
          {
            lineId: 'mobile-cart-line',
            productId: 'lils-burger',
            variantId: 'doble',
            quantity: 1,
            removedIngredientIds: [],
            extras: [],
            noFries: false,
            notes: '',
          },
        ],
      }),
    );
    const listener = vi.fn();
    window.addEventListener(VIEW_CART_EVENT, listener);
    const user = userEvent.setup();

    render(
      <CartProvider>
        <CartBar />
      </CartProvider>,
    );

    await user.click(await screen.findByRole('button', { name: /Ver pedido:/ }));

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(VIEW_CART_EVENT, listener);
  });
});

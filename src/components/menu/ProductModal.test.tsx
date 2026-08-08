import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/context/CartContext';
import { getProductById } from '@/data/menu';
import { ProductModal } from './ProductModal';

const lilsBurger = getProductById('lils-burger')!;

function CartProbe() {
  const { lines } = useCart();
  return (
    <ul data-testid="cart-probe">
      {lines.map((line) => (
        <li key={line.lineId}>
          {line.productId} x{line.quantity} variant:{line.variantId} extras:{line.extras.length}
        </li>
      ))}
    </ul>
  );
}

function renderModal() {
  return render(
    <CartProvider>
      <ProductModal product={lilsBurger} onClose={() => {}} />
      <CartProbe />
    </CartProvider>,
  );
}

describe('ProductModal', () => {
  it('agrega una línea al carrito con la variante, extra y cantidad elegidas', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('radio', { name: /triple/i }));
    await user.click(screen.getByRole('checkbox', { name: /tocino extra/i }));
    await user.click(screen.getByRole('button', { name: /aumentar cantidad/i }));
    await user.click(screen.getByRole('button', { name: /agregar al pedido/i }));

    const probe = screen.getByTestId('cart-probe');
    const item = within(probe).getByText(/lils-burger x2 variant:triple extras:1/i);
    expect(item).toBeInTheDocument();
  });

  it('permite retirar un ingrediente sin afectar el precio unitario mostrado en el total', async () => {
    const user = userEvent.setup();
    renderModal();

    const totalBefore = screen.getByText(/^Bs 45$/);
    expect(totalBefore).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'BBQ' }));

    expect(screen.getByText(/^Bs 45$/)).toBeInTheDocument();
  });

  it('muestra y aplica el descuento por pedir la hamburguesa sin papas', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('checkbox', { name: /sin papas/i }));

    expect(screen.getByText(/^Bs 42$/)).toBeInTheDocument();
  });
});

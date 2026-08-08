import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider } from '@/context/CartContext';
import { CART_STORAGE_KEY_NAME } from '@/lib/cart/storage';
import { demoOrderService } from '@/lib/orders/DemoOrderService';
import { OrderFlow } from './OrderFlow';

function seedCart() {
  window.localStorage.setItem(
    CART_STORAGE_KEY_NAME,
    JSON.stringify({
      lines: [
        {
          lineId: 'seed-line-1',
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
}

async function driveToReview(user: ReturnType<typeof userEvent.setup>) {
  // Paso 1: carrito
  await screen.findAllByText(/LILS Burger/, {}, { timeout: 3000 });
  await user.click(screen.getByRole('button', { name: /Elegir entrega/ }));

  // Paso 2: recojo en sucursal (evita el mapa interactivo, no relevante aquí)
  await user.click(screen.getByText('Recoger en sucursal'));
  await user.click(screen.getByRole('button', { name: 'Continuar' }));

  // Paso 3: datos de recojo
  await user.type(screen.getByLabelText(/Nombre de quien recogerá/), 'Ana Test');
  const timeSelect = screen.getByLabelText(/qué hora pasas hoy/i) as HTMLSelectElement;
  await waitFor(() => {
    expect(timeSelect.options.length).toBeGreaterThan(1);
  });
  const firstAvailableTime = timeSelect.options[1]!.value;
  await user.selectOptions(timeSelect, firstAvailableTime);
  await user.click(screen.getByRole('button', { name: 'Continuar' }));

  // Paso 4: facturación (sin NIT por defecto)
  await screen.findByRole('heading', { name: 'Facturación' });
  await user.click(screen.getByRole('button', { name: 'Continuar' }));

  // Paso 5: pago
  await user.click(screen.getByText('Pagar en caja'));
  await user.click(screen.getByRole('button', { name: 'Continuar' }));

  // Paso 6: revisión
  await screen.findByText('Revisión final');
}

describe('OrderFlow: protección de doble clic en Finalizar pedido', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date('2026-08-07T20:00:00.000Z'));
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('11. dos finalizaciones simultáneas producen una sola creación lógica', async () => {
    seedCart();
    const submitSpy = vi.spyOn(demoOrderService, 'submit');
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <CartProvider>
        <OrderFlow />
      </CartProvider>,
    );

    await driveToReview(user);

    const finalizeButton = screen.getByRole('button', { name: /Finalizar pedido/ });
    // Dos clics "casi simultáneos": se disparan sin esperar entre ellos, tal
    // como podría ocurrir con un doble clic real o un doble toque en móvil.
    fireEvent.click(finalizeButton);
    fireEvent.click(finalizeButton);

    await screen.findByText('Comprobante de demostración, sin validez fiscal.', {}, { timeout: 3000 });

    expect(submitSpy).toHaveBeenCalledTimes(1);
    submitSpy.mockRestore();
  });
});

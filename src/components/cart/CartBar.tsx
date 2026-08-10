'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { getProductById } from '@/data/menu';
import { calculateCartSubtotalBs } from '@/lib/cart/pricing';
import { formatBs } from '@/lib/format';

/** Barra fija de carrito para móvil, visible cuando hay productos agregados. */
export function CartBar() {
  const { lines, hydrated } = useCart();

  if (!hydrated || lines.length === 0) return null;

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = calculateCartSubtotalBs(lines, getProductById);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
      <Link
        href="/ordenar"
        aria-label={`Ver pedido: ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}, subtotal ${formatBs(subtotal)}`}
        className="pointer-events-auto relative z-10 flex min-h-14 touch-manipulation select-none items-center justify-between rounded-full border border-brand-white/25 bg-brand-blue px-4 py-3 text-brand-white shadow-[0_10px_35px_rgba(23,37,119,0.32)] backdrop-blur active:scale-[0.98]"
      >
        <span className="flex items-center gap-2 font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-white text-sm font-bold text-brand-blue">
            {itemCount}
          </span>
          Ver pedido
        </span>
        <span className="font-display text-lg font-extrabold" aria-live="polite">
          {formatBs(subtotal)}
        </span>
      </Link>
    </div>
  );
}

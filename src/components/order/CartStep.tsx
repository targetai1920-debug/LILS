'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { getProductById } from '@/data/menu';
import { calculateCartSubtotalBs } from '@/lib/cart/pricing';
import { formatBs } from '@/lib/format';
import { CartLineItem } from '@/components/cart/CartLineItem';

interface CartStepProps {
  onContinue: () => void;
}

export function CartStep({ onContinue }: CartStepProps) {
  const { lines, clearCart, hydrated } = useCart();
  const [confirmingClear, setConfirmingClear] = useState(false);

  const subtotal = calculateCartSubtotalBs(lines, getProductById);

  if (!hydrated) {
    return <p className="text-sm text-brand-black/60">Cargando tu pedido…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-brand border-2 border-dashed border-brand-black/20 p-8 text-center">
        <p className="font-display text-lg font-bold text-brand-black">Tu pedido está vacío</p>
        <p className="mt-2 text-sm text-brand-black/60">Agrega productos desde el menú para continuar.</p>
        <Link
          href="/menu"
          className="mt-4 inline-block rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-brand-white"
        >
          Ir al menú
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {lines.map((line) => {
          const product = getProductById(line.productId);
          if (!product) return null;
          return <CartLineItem key={line.lineId} line={line} product={product} />;
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/menu" className="text-sm font-bold text-brand-blue hover:underline">
          + Agregar más productos
        </Link>

        {confirmingClear ? (
          <div className="flex items-center gap-2 text-sm">
            <span>¿Vaciar todo el carrito?</span>
            <button
              type="button"
              onClick={() => {
                clearCart();
                setConfirmingClear(false);
              }}
              className="font-bold text-red-700 underline"
            >
              Sí, vaciar
            </button>
            <button type="button" onClick={() => setConfirmingClear(false)} className="text-brand-black/60 underline">
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingClear(true)}
            className="text-sm font-bold text-red-700 underline"
          >
            Vaciar carrito
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-brand-beige px-4 py-3">
        <span className="font-display font-bold text-brand-black">Subtotal</span>
        <span className="font-display text-xl font-extrabold text-brand-blue" aria-live="polite">
          {formatBs(subtotal)}
        </span>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-4 w-full rounded-full bg-brand-blue py-3 text-center font-display font-bold text-brand-white"
      >
        Continuar
      </button>
    </div>
  );
}

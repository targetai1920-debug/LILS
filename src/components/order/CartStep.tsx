'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getProductById } from '@/data/menu';
import { calculateCartSubtotalBs } from '@/lib/cart/pricing';
import { formatBs } from '@/lib/format';
import { CartLineItem } from '@/components/cart/CartLineItem';
import { MenuByCategory } from '@/components/menu/MenuByCategory';

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

  return (
    <div className="space-y-14">
      <section aria-labelledby="choose-products-heading">
        <span className="lils-kicker">Paso 1 · Productos</span>
        <h2 id="choose-products-heading" className="font-display mt-3 text-4xl font-black tracking-[-0.03em] text-brand-black">
          Arma tu pedido
        </h2>
        <p className="mt-2 max-w-2xl text-brand-black/65">Aquí encuentras exactamente el mismo catálogo que en Menú. Agrega todo lo que quieras sin salir de Ordenar.</p>
        <div className="mt-10">
          <MenuByCategory redirectToOrderAfterAdd={false} />
        </div>
      </section>

      <section id="resumen-pedido" aria-labelledby="cart-summary-heading" className="scroll-mt-28">
        <div className="lils-surface p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-blue/60">Tu selección</p>
              <h2 id="cart-summary-heading" className="font-display text-2xl font-black text-brand-black">Resumen del pedido</h2>
            </div>
            {lines.length > 0 && !confirmingClear ? (
              <button type="button" onClick={() => setConfirmingClear(true)} className="lils-button-danger text-xs">
                <span aria-hidden="true">⌫</span> Vaciar carrito
              </button>
            ) : null}
          </div>

          {lines.length === 0 ? (
            <div className="mt-5 rounded-[1.5rem] border-2 border-dashed border-brand-blue/20 bg-brand-blue/5 p-7 text-center">
              <p className="font-display text-lg font-black text-brand-black">Todavía no agregaste nada</p>
              <p className="mt-1 text-sm text-brand-black/55">Elige una opción arriba para empezar.</p>
            </div>
          ) : (
            <>
              {confirmingClear ? (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] bg-red-50 p-4 text-sm">
                  <span className="font-bold text-red-900">¿Seguro que quieres vaciar todo?</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setConfirmingClear(false)} className="lils-button-secondary text-xs">Cancelar</button>
                    <button type="button" onClick={() => { clearCart(); setConfirmingClear(false); }} className="lils-button-danger text-xs">Sí, vaciar</button>
                  </div>
                </div>
              ) : null}

              <ul className="mt-5 flex flex-col gap-3">
                {lines.map((line) => {
                  const product = getProductById(line.productId);
                  if (!product) return null;
                  return <CartLineItem key={line.lineId} line={line} product={product} />;
                })}
              </ul>

              <div className="mt-6 flex items-center justify-between rounded-[1.5rem] bg-brand-blue px-5 py-4 text-brand-white shadow-[0_8px_0_var(--brand-blue-dark)]">
                <span className="font-display font-black">Subtotal</span>
                <span className="font-display text-2xl font-black" aria-live="polite">{formatBs(subtotal)}</span>
              </div>

              <button type="button" onClick={onContinue} className="lils-button-primary mt-6 w-full py-4 text-base">
                Elegir entrega <span aria-hidden="true">→</span>
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

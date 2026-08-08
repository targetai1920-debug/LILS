'use client';

import { useState } from 'react';
import type { CartLine, Product } from '@/types';
import { ProductModal } from '@/components/menu/ProductModal';
import { calculateLineTotalBs, calculateLineUnitPriceBs } from '@/lib/cart/pricing';
import { clampQuantity, MAX_QUANTITY, MIN_QUANTITY } from '@/lib/cart/reducer';
import { formatBs } from '@/lib/format';
import { useCart } from '@/context/CartContext';
import { ProductVisual } from '@/components/menu/ProductVisual';

interface CartLineItemProps {
  line: CartLine;
  product: Product;
}

export function CartLineItem({ line, product }: CartLineItemProps) {
  const { setQuantity, removeLine } = useCart();
  const [editing, setEditing] = useState(false);

  const variant = product.variants.find((candidate) => candidate.id === line.variantId);
  const removedLabels = line.removedIngredientIds
    .map((id) => product.ingredients.find((ingredient) => ingredient.id === id)?.label)
    .filter(Boolean);

  return (
    <li className="grid gap-4 rounded-[1.5rem] border border-brand-blue/10 bg-brand-white p-3 shadow-sm sm:grid-cols-[5.5rem_1fr_auto] sm:items-center sm:p-4">
      <ProductVisual product={product} className="aspect-square w-full rounded-[1.2rem] sm:w-[5.5rem]" sizes="88px" />
      <div className="min-w-0">
        <p className="font-display font-bold text-brand-black">
          {product.name} {variant ? `· ${variant.label}` : ''}
        </p>
        {removedLabels.length > 0 ? (
          <p className="text-xs text-brand-black/60">Sin: {removedLabels.join(', ')}</p>
        ) : null}
        {line.extras.length > 0 ? (
          <p className="text-xs text-brand-black/60">
            Extras: {line.extras.map((extra) => extra.label).join(', ')}
          </p>
        ) : null}
        {line.noFries ? <p className="text-xs text-brand-black/60">Sin papas</p> : null}
        {line.notes ? <p className="text-xs italic text-brand-black/60">&quot;{line.notes}&quot;</p> : null}
        <p className="mt-1 text-sm font-semibold text-brand-blue">
          {formatBs(calculateLineUnitPriceBs(product, line))} c/u
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:max-w-[16rem] sm:justify-end">
        <div className="flex items-center rounded-full bg-brand-blue/5 p-1">
          <button
            type="button"
            onClick={() => setQuantity(line.lineId, clampQuantity(line.quantity - 1))}
            disabled={line.quantity <= MIN_QUANTITY}
            aria-label={`Disminuir cantidad de ${product.name}`}
            className="h-8 w-8 rounded-full bg-brand-white text-brand-blue shadow-sm transition hover:bg-brand-blue hover:text-brand-white disabled:opacity-30"
          >
            −
          </button>
          <span className="w-7 text-center font-bold" aria-live="polite">
            {line.quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(line.lineId, clampQuantity(line.quantity + 1))}
            disabled={line.quantity >= MAX_QUANTITY}
            aria-label={`Aumentar cantidad de ${product.name}`}
            className="h-8 w-8 rounded-full bg-brand-white text-brand-blue shadow-sm transition hover:bg-brand-blue hover:text-brand-white disabled:opacity-30"
          >
            +
          </button>
        </div>

        <span className="w-16 text-right font-display font-black text-brand-black">
          {formatBs(calculateLineTotalBs(product, line))}
        </span>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="lils-button-quiet"
        >
          <span aria-hidden="true">✎</span> Editar
        </button>
        <button
          type="button"
          onClick={() => removeLine(line.lineId)}
          aria-label={`Quitar ${product.name} del pedido`}
          className="lils-button-danger min-h-0 px-3 py-2 text-xs shadow-none"
        >
          <span aria-hidden="true">×</span> Quitar
        </button>
      </div>

      {editing ? (
        <ProductModal product={product} initialLine={line} onClose={() => setEditing(false)} />
      ) : null}
    </li>
  );
}

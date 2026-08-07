'use client';

import { useState } from 'react';
import type { CartLine, Product } from '@/types';
import { ProductModal } from '@/components/menu/ProductModal';
import { calculateLineTotalBs, calculateLineUnitPriceBs } from '@/lib/cart/pricing';
import { clampQuantity, MAX_QUANTITY, MIN_QUANTITY } from '@/lib/cart/reducer';
import { formatBs } from '@/lib/format';
import { useCart } from '@/context/CartContext';

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
    <li className="flex flex-col gap-3 rounded-2xl border-2 border-brand-black/10 bg-brand-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
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

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity(line.lineId, clampQuantity(line.quantity - 1))}
            disabled={line.quantity <= MIN_QUANTITY}
            aria-label={`Disminuir cantidad de ${product.name}`}
            className="h-8 w-8 rounded-full border-2 border-brand-blue text-brand-blue disabled:opacity-30"
          >
            −
          </button>
          <span className="w-5 text-center font-semibold" aria-live="polite">
            {line.quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(line.lineId, clampQuantity(line.quantity + 1))}
            disabled={line.quantity >= MAX_QUANTITY}
            aria-label={`Aumentar cantidad de ${product.name}`}
            className="h-8 w-8 rounded-full border-2 border-brand-blue text-brand-blue disabled:opacity-30"
          >
            +
          </button>
        </div>

        <span className="w-16 text-right font-display font-extrabold text-brand-black">
          {formatBs(calculateLineTotalBs(product, line))}
        </span>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-bold text-brand-blue underline"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => removeLine(line.lineId)}
          aria-label={`Quitar ${product.name} del pedido`}
          className="text-xs font-bold text-red-700 underline"
        >
          Quitar
        </button>
      </div>

      {editing ? (
        <ProductModal product={product} initialLine={line} onClose={() => setEditing(false)} />
      ) : null}
    </li>
  );
}

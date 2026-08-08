'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import { formatBs } from '@/lib/format';
import { ProductModal } from './ProductModal';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const startingPrice = Math.min(...product.variants.map((variant) => variant.priceBs));
  const ingredientSummary = product.ingredients.map((ingredient) => ingredient.label).join(', ');

  return (
    <div className="flex flex-col overflow-hidden rounded-brand border-2 border-brand-black/10 bg-brand-white shadow-sm transition-shadow hover:shadow-md">
      <ProductVisual
        product={product}
        className="aspect-[4/3] w-full"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg font-extrabold text-brand-black">{product.name}</h3>
        {ingredientSummary ? (
          <p className="line-clamp-2 text-sm text-brand-black/70">{ingredientSummary}</p>
        ) : (
          <p className="text-sm text-brand-black/70">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-bold text-brand-blue">
            Desde {formatBs(startingPrice)}
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-brand-blue px-4 py-2 text-sm font-bold text-brand-white transition-transform hover:scale-[1.03]"
          >
            Personalizar
          </button>
        </div>
      </div>

      {open ? <ProductModal product={product} onClose={() => setOpen(false)} /> : null}
    </div>
  );
}

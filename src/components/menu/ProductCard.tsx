'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';
import { formatBs } from '@/lib/format';
import { ProductModal } from './ProductModal';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: Product;
  redirectToOrderAfterAdd?: boolean;
}

function RedirectingProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const router = useRouter();
  return <ProductModal product={product} onClose={onClose} onSaved={() => router.push('/ordenar')} />;
}

export function ProductCard({ product, redirectToOrderAfterAdd = true }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const startingPrice = Math.min(...product.variants.map((variant) => variant.priceBs));
  const ingredientSummary = product.ingredients.map((ingredient) => ingredient.label).join(', ');

  return (
    <article className="hover-bop group flex flex-col overflow-hidden rounded-[1.75rem] border border-brand-blue/10 bg-brand-white/90 shadow-[0_14px_36px_rgba(23,37,119,0.10)] backdrop-blur">
      <button type="button" onClick={() => setOpen(true)} className="relative block overflow-hidden text-left" aria-label={`Personalizar ${product.name}`}>
        <ProductVisual
          product={product}
          className="aspect-[4/3] w-full rounded-b-[2.35rem] transition-transform duration-500 group-hover:scale-[1.045]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand-cream/90 px-3 py-1 font-display text-[11px] font-black uppercase tracking-wide text-brand-blue shadow-sm backdrop-blur">
          {product.categoryId === 'hamburguesas' ? 'Smash' : 'LILS'}
        </span>
        <span className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue text-xl text-brand-white shadow-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" aria-hidden="true">+</span>
      </button>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl font-black tracking-[-0.02em] text-brand-black">{product.name}</h3>
        {ingredientSummary ? (
          <p className="line-clamp-2 text-sm text-brand-black/70">{ingredientSummary}</p>
        ) : (
          <p className="text-sm text-brand-black/70">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-display text-lg font-black text-brand-blue">
            Desde {formatBs(startingPrice)}
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="lils-button-quiet whitespace-nowrap"
          >
            Armar pedido
          </button>
        </div>
      </div>

      {open && redirectToOrderAfterAdd ? (
        <RedirectingProductModal product={product} onClose={() => setOpen(false)} />
      ) : null}
      {open && !redirectToOrderAfterAdd ? (
        <ProductModal product={product} onClose={() => setOpen(false)} />
      ) : null}
    </article>
  );
}

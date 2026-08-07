'use client';

import { useId, useMemo, useState } from 'react';
import type { CartLine, Product } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { BurgerPlaceholder } from '@/components/brand/BurgerPlaceholder';
import { getExtraById } from '@/data/menu';
import { calculateLineUnitPriceBs } from '@/lib/cart/pricing';
import { clampQuantity, MAX_QUANTITY, MIN_QUANTITY } from '@/lib/cart/reducer';
import { formatBs } from '@/lib/format';
import { useCart } from '@/context/CartContext';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  initialLine?: CartLine;
  onSaved?: () => void;
}

export function ProductModal({ product, onClose, initialLine, onSaved }: ProductModalProps) {
  const titleId = useId();
  const { addLine, updateLine } = useCart();

  const [variantId, setVariantId] = useState(
    initialLine?.variantId ?? product.variants[0]?.id ?? '',
  );
  const [quantity, setQuantity] = useState(initialLine?.quantity ?? 1);
  const [removedIngredientIds, setRemovedIngredientIds] = useState<string[]>(
    initialLine?.removedIngredientIds ?? [],
  );
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>(
    initialLine?.extras.map((extra) => extra.id) ?? [],
  );
  const [noFries, setNoFries] = useState(initialLine?.noFries ?? false);
  const [notes, setNotes] = useState(initialLine?.notes ?? '');

  const availableExtras = useMemo(
    () => product.extraIds.map(getExtraById).filter((extra): extra is NonNullable<typeof extra> => Boolean(extra)),
    [product.extraIds],
  );

  const draftLine: CartLine = {
    lineId: initialLine?.lineId ?? 'draft',
    productId: product.id,
    variantId,
    quantity,
    removedIngredientIds,
    extras: selectedExtraIds
      .map(getExtraById)
      .filter((extra): extra is NonNullable<typeof extra> => Boolean(extra))
      .map((extra) => ({ id: extra.id, label: extra.label, priceBs: extra.priceBs })),
    noFries,
    notes,
  };

  const unitPrice = calculateLineUnitPriceBs(product, draftLine);
  const lineTotal = unitPrice * quantity;

  function toggleIngredient(ingredientId: string) {
    setRemovedIngredientIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );
  }

  function toggleExtra(extraId: string) {
    setSelectedExtraIds((current) =>
      current.includes(extraId) ? current.filter((id) => id !== extraId) : [...current, extraId],
    );
  }

  function handleSubmit() {
    const { lineId, ...lineWithoutId } = draftLine;
    if (initialLine) {
      updateLine(initialLine.lineId, lineWithoutId);
    } else {
      addLine(lineWithoutId);
    }
    onSaved?.();
    onClose();
  }

  return (
    <Modal titleId={titleId} onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <h2 id={titleId} className="font-display text-2xl font-extrabold text-brand-black">
          {product.name}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="rounded-full border-2 border-brand-black/20 p-1.5 text-brand-black/70"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <BurgerPlaceholder className="mt-3 aspect-[16/9] w-full rounded-2xl" label={product.name} />

      <p className="mt-3 text-sm text-brand-black/70">{product.description}</p>

      {product.variants.length > 1 ? (
        <fieldset className="mt-4">
          <legend className="text-sm font-bold text-brand-black">Variante</legend>
          <div className="mt-2 flex gap-2">
            {product.variants.map((variant) => (
              <label
                key={variant.id}
                className={`flex-1 cursor-pointer rounded-xl border-2 px-3 py-2 text-center text-sm font-semibold ${
                  variantId === variant.id
                    ? 'border-brand-blue bg-brand-blue text-brand-white'
                    : 'border-brand-black/15 text-brand-black'
                }`}
              >
                <input
                  type="radio"
                  name="variant"
                  value={variant.id}
                  checked={variantId === variant.id}
                  onChange={() => setVariantId(variant.id)}
                  className="sr-only"
                />
                {variant.label} · {formatBs(variant.priceBs)}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {product.ingredients.some((ingredient) => ingredient.removable) ? (
        <fieldset className="mt-4">
          <legend className="text-sm font-bold text-brand-black">
            Ingredientes incluidos (puedes retirar los que no quieras, sin costo)
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.ingredients.map((ingredient) => {
              const removed = removedIngredientIds.includes(ingredient.id);
              if (!ingredient.removable) {
                return (
                  <span
                    key={ingredient.id}
                    className="rounded-full bg-brand-beige px-3 py-1.5 text-xs font-semibold text-brand-black"
                  >
                    {ingredient.label}
                  </span>
                );
              }
              return (
                <button
                  key={ingredient.id}
                  type="button"
                  aria-pressed={!removed}
                  onClick={() => toggleIngredient(ingredient.id)}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold ${
                    removed
                      ? 'border-brand-black/20 text-brand-black/40 line-through'
                      : 'border-brand-blue text-brand-blue'
                  }`}
                >
                  {ingredient.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {availableExtras.length > 0 ? (
        <fieldset className="mt-4">
          <legend className="text-sm font-bold text-brand-black">Extras disponibles</legend>
          <div className="mt-2 flex flex-col gap-2">
            {availableExtras.map((extra) => (
              <label
                key={extra.id}
                className="flex items-center justify-between rounded-xl border-2 border-brand-black/10 px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedExtraIds.includes(extra.id)}
                    onChange={() => toggleExtra(extra.id)}
                    className="h-5 w-5 accent-[var(--brand-blue)]"
                  />
                  {extra.label}
                </span>
                <span className="font-semibold text-brand-blue">+{formatBs(extra.priceBs)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {product.allowsNoFries ? (
        <label className="mt-4 flex items-center justify-between rounded-xl border-2 border-brand-black/10 px-3 py-2 text-sm">
          <span>Sin papas</span>
          <input
            type="checkbox"
            checked={noFries}
            onChange={(event) => setNoFries(event.target.checked)}
            className="h-5 w-5 accent-[var(--brand-blue)]"
          />
        </label>
      ) : null}

      <div className="mt-4">
        <label htmlFor={`${titleId}-notes`} className="text-sm font-bold text-brand-black">
          Notas (opcional)
        </label>
        <textarea
          id={`${titleId}-notes`}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={2}
          maxLength={200}
          className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2 text-sm"
          placeholder="Ej. bien cocida, salsa aparte..."
        />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => clampQuantity(q - 1))}
            disabled={quantity <= MIN_QUANTITY}
            aria-label="Disminuir cantidad"
            className="h-9 w-9 rounded-full border-2 border-brand-blue text-lg font-bold text-brand-blue disabled:opacity-30"
          >
            −
          </button>
          <span className="w-6 text-center text-lg font-bold" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => clampQuantity(q + 1))}
            disabled={quantity >= MAX_QUANTITY}
            aria-label="Aumentar cantidad"
            className="h-9 w-9 rounded-full border-2 border-brand-blue text-lg font-bold text-brand-blue disabled:opacity-30"
          >
            +
          </button>
        </div>
        <div className="text-right">
          <p className="text-xs text-brand-black/60">Precio unitario: {formatBs(unitPrice)}</p>
          <p className="font-display text-xl font-extrabold text-brand-blue" aria-live="polite">
            {formatBs(lineTotal)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-5 w-full rounded-full bg-brand-blue py-3 text-center font-display text-base font-bold text-brand-white"
      >
        {initialLine ? 'Guardar cambios' : 'Agregar al pedido'}
      </button>
    </Modal>
  );
}

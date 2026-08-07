'use client';

import { useState } from 'react';
import type { OrderDraft } from '@/types';
import { getProductById } from '@/data/menu';
import { getBranchById } from '@/data/branches';
import { buildOrderSummary } from '@/lib/orders/summary';
import { formatBs } from '@/lib/format';

interface ReviewStepProps {
  draft: OrderDraft;
  onEditStep: (stepIndex: number) => void;
  onBack: () => void;
  onFinalize: () => Promise<void>;
  finalizing: boolean;
}

export function ReviewStep({ draft, onEditStep, onBack, onFinalize, finalizing }: ReviewStepProps) {
  const [error, setError] = useState<string | null>(null);
  const branch = draft.pickup ? getBranchById(draft.pickup.branchId) : undefined;
  const summary = buildOrderSummary(draft, getProductById, branch);

  if (!summary) {
    return <p className="text-sm text-brand-black/60">Completa los pasos anteriores para ver el resumen.</p>;
  }

  async function handleFinalize() {
    setError(null);
    try {
      await onFinalize();
    } catch {
      setError('No pudimos procesar el pedido de demostración. Intenta nuevamente.');
    }
  }

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-brand-black">Revisión final</h2>

      <section className="mt-4 rounded-2xl border-2 border-brand-black/10 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-brand-black">Productos</h3>
          <button type="button" onClick={() => onEditStep(0)} className="text-xs font-bold text-brand-blue underline">
            Editar
          </button>
        </div>
        <ul className="mt-2 flex flex-col gap-2 text-sm">
          {summary.lines.map((line) => (
            <li key={line.lineId} className="border-b border-brand-black/5 pb-2 last:border-0">
              <p className="font-semibold text-brand-black">
                {line.quantity}× {line.productName} {line.variantLabel ? `· ${line.variantLabel}` : ''}
              </p>
              {line.removedIngredients.length > 0 ? (
                <p className="text-xs text-brand-black/60">Sin: {line.removedIngredients.join(', ')}</p>
              ) : null}
              {line.extras.length > 0 ? (
                <p className="text-xs text-brand-black/60">
                  Extras: {line.extras.map((extra) => extra.label).join(', ')}
                </p>
              ) : null}
              {line.noFries ? <p className="text-xs text-brand-black/60">Sin papas</p> : null}
              {line.notes ? <p className="text-xs italic text-brand-black/60">&quot;{line.notes}&quot;</p> : null}
              <p className="text-right text-sm font-bold text-brand-blue">{formatBs(line.lineTotalBs)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-right font-display font-bold text-brand-black">
          Subtotal: {formatBs(summary.subtotalBs)}
        </p>
      </section>

      <section className="mt-4 rounded-2xl border-2 border-brand-black/10 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-brand-black">
            {summary.fulfillmentType === 'delivery' ? 'Envío a domicilio' : 'Recojo en sucursal'}
          </h3>
          <button type="button" onClick={() => onEditStep(1)} className="text-xs font-bold text-brand-blue underline">
            Editar
          </button>
        </div>
        <div className="mt-2 text-sm text-brand-black/80">
          {summary.fulfillmentType === 'delivery' && draft.address ? (
            <>
              <p>
                {draft.address.mainStreet} {draft.address.noHouseNumber ? '(sin número)' : draft.address.houseNumber}
              </p>
              <p>Entre calle: {draft.address.crossStreet}</p>
              {draft.address.reference ? <p>Referencia: {draft.address.reference}</p> : null}
              <p>Teléfono: {draft.address.phoneNormalized || draft.address.phone}</p>
              {draft.address.location ? (
                <p>
                  Ubicación: {draft.address.location.lat.toFixed(5)}, {draft.address.location.lng.toFixed(5)}
                </p>
              ) : null}
            </>
          ) : null}
          {summary.fulfillmentType === 'pickup' && draft.pickup ? (
            <>
              <p>{branch?.name}</p>
              <p>Recoge: {draft.pickup.personName}</p>
              <p>
                Fecha y hora: {draft.pickup.date} {draft.pickup.time}
              </p>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="mt-1 text-xs font-bold text-brand-blue underline"
          >
            Editar datos
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border-2 border-brand-black/10 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-brand-black">Facturación</h3>
          <button type="button" onClick={() => onEditStep(3)} className="text-xs font-bold text-brand-blue underline">
            Editar
          </button>
        </div>
        <p className="mt-2 text-sm text-brand-black/80">{summary.billingLabel}</p>
      </section>

      <section className="mt-4 rounded-2xl border-2 border-brand-black/10 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-brand-black">Pago</h3>
          <button type="button" onClick={() => onEditStep(4)} className="text-xs font-bold text-brand-blue underline">
            Editar
          </button>
        </div>
        <p className="mt-2 text-sm text-brand-black/80">{summary.paymentLabel}</p>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal productos</dt>
            <dd>{formatBs(summary.subtotalBs)}</dd>
          </div>
          {summary.fulfillmentType === 'delivery' ? (
            <div className="flex justify-between">
              <dt>Tarifa de delivery</dt>
              <dd>{formatBs(summary.deliveryFeeBs)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between font-bold text-brand-blue">
            <dt>Total general</dt>
            <dd>{formatBs(summary.totalBs)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Se paga ahora</dt>
            <dd>{formatBs(summary.paidNowBs)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Queda pendiente</dt>
            <dd>{formatBs(summary.pendingBs)}</dd>
          </div>
        </dl>
      </section>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border-2 border-brand-blue px-5 py-2.5 text-sm font-bold text-brand-blue"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={() => onEditStep(0)}
          className="rounded-full border-2 border-brand-blue px-5 py-2.5 text-sm font-bold text-brand-blue"
        >
          Agregar más productos
        </button>
        <button
          type="button"
          onClick={handleFinalize}
          disabled={finalizing}
          className="flex-1 rounded-full bg-brand-blue py-2.5 text-center font-display font-bold text-brand-white disabled:opacity-50"
        >
          {finalizing ? 'Procesando…' : 'Finalizar pedido'}
        </button>
      </div>
    </div>
  );
}

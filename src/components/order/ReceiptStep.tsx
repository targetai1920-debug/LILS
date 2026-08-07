'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import type { OrderDraft } from '@/types';
import { getProductById } from '@/data/menu';
import { getBranchById } from '@/data/branches';
import { buildOrderSummary } from '@/lib/orders/summary';
import { buildDemoQrPayload } from '@/lib/orders/qr';
import { formatBs } from '@/lib/format';

interface ReceiptStepProps {
  draft: OrderDraft;
  submittedAt: string;
  onStartNewOrder: () => void;
  onClearLocalData: () => void;
}

const qrPaymentMethods = new Set(['qr-productos', 'qr-total']);

export function ReceiptStep({ draft, submittedAt, onStartNewOrder, onClearLocalData }: ReceiptStepProps) {
  const branch = draft.pickup ? getBranchById(draft.pickup.branchId) : undefined;
  const summary = buildOrderSummary(draft, getProductById, branch);
  const isQrPayment = draft.paymentMethod ? qrPaymentMethods.has(draft.paymentMethod) : false;

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [paymentSimulated, setPaymentSimulated] = useState(false);

  useEffect(() => {
    if (!isQrPayment || !summary) return;
    const payload = buildDemoQrPayload(draft.attemptId, summary.paidNowBs);
    QRCode.toDataURL(payload, { margin: 1, width: 220 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [isQrPayment, summary, draft.attemptId]);

  if (!summary) return null;

  const paymentStatusLabel = !isQrPayment ? 'Pago pendiente' : paymentSimulated ? 'Pago simulado' : 'Esperando confirmación de pago (demo)';

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-brand-black">
        {isQrPayment && !paymentSimulated ? 'Escanea el QR de demostración' : 'Comprobante de demostración'}
      </h2>

      {isQrPayment && !paymentSimulated ? (
        <div className="mt-4 flex flex-col items-center rounded-2xl border-2 border-brand-blue bg-brand-beige p-6 text-center">
          <p className="font-display text-sm font-extrabold uppercase tracking-wide text-red-700">
            QR de demostración — no realizar pagos
          </p>
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="Código QR de demostración, no válido para pagos reales" className="mt-3 h-48 w-48" />
          ) : (
            <div className="mt-3 h-48 w-48 animate-pulse rounded-xl bg-brand-white" />
          )}
          <p className="mt-2 text-xs text-brand-black/60">{buildDemoQrPayload(draft.attemptId, summary.paidNowBs)}</p>
          <p className="mt-1 font-display font-bold text-brand-blue">A pagar ahora: {formatBs(summary.paidNowBs)}</p>
          <button
            type="button"
            onClick={() => setPaymentSimulated(true)}
            className="mt-4 rounded-full bg-brand-blue px-6 py-2.5 font-display font-bold text-brand-white"
          >
            Simular pago recibido
          </button>
        </div>
      ) : null}

      {!isQrPayment || paymentSimulated ? (
        <div className="mt-4 rounded-2xl border-2 border-brand-black/10 p-5 print:border-0" aria-live="polite">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl font-extrabold text-brand-black">Pedido #{draft.attemptId.slice(-8)}</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                paymentStatusLabel === 'Pago simulado'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {paymentStatusLabel}
            </span>
          </div>
          <p className="mt-1 text-xs text-brand-black/60">{new Date(submittedAt).toLocaleString('es-BO')}</p>

          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {summary.lines.map((line) => (
              <li key={line.lineId} className="flex justify-between border-b border-brand-black/5 pb-1 last:border-0">
                <span>
                  {line.quantity}× {line.productName} {line.variantLabel ? `· ${line.variantLabel}` : ''}
                </span>
                <span>{formatBs(line.lineTotalBs)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatBs(summary.subtotalBs)}</dd>
            </div>
            {summary.fulfillmentType === 'delivery' ? (
              <div className="flex justify-between">
                <dt>Delivery</dt>
                <dd>{formatBs(summary.deliveryFeeBs)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between font-bold text-brand-blue">
              <dt>Total</dt>
              <dd>{formatBs(summary.totalBs)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Pagado ahora</dt>
              <dd>{formatBs(summary.paidNowBs)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Pendiente</dt>
              <dd>{formatBs(summary.pendingBs)}</dd>
            </div>
          </dl>

          <p className="mt-3 text-sm text-brand-black/80">
            Entrega: {summary.fulfillmentType === 'delivery' ? 'Envío a domicilio' : 'Recojo en sucursal'} —{' '}
            {summary.destination}
          </p>
          <p className="text-sm text-brand-black/80">{summary.billingLabel}</p>

          <p className="mt-4 rounded-lg bg-brand-beige p-2 text-center text-xs font-semibold text-brand-black/70">
            Comprobante de demostración, sin validez fiscal.
          </p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full border-2 border-brand-blue px-5 py-2.5 text-sm font-bold text-brand-blue"
        >
          Imprimir
        </button>
        <button
          type="button"
          onClick={onStartNewOrder}
          className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-brand-white"
        >
          Iniciar otro pedido
        </button>
        <button
          type="button"
          onClick={onClearLocalData}
          className="rounded-full border-2 border-red-700 px-5 py-2.5 text-sm font-bold text-red-700"
        >
          Borrar datos locales
        </button>
      </div>
    </div>
  );
}

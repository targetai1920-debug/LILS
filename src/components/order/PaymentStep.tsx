'use client';

import type { FulfillmentType, PaymentMethod } from '@/types';
import { formatBs } from '@/lib/format';

interface PaymentStepProps {
  fulfillmentType: FulfillmentType;
  value: PaymentMethod | null;
  onChange: (value: PaymentMethod) => void;
  subtotalBs: number;
  deliveryFeeBs: number;
  onBack: () => void;
  onContinue: () => void;
}

export function PaymentStep({
  fulfillmentType,
  value,
  onChange,
  subtotalBs,
  deliveryFeeBs,
  onBack,
  onContinue,
}: PaymentStepProps) {
  const options: { id: PaymentMethod; label: string; description: string }[] =
    fulfillmentType === 'delivery'
      ? [
          {
            id: 'qr-productos',
            label: 'Pagar productos por QR',
            description: `El QR cubre solo el subtotal de productos (${formatBs(subtotalBs)}). La tarifa de delivery (${formatBs(deliveryFeeBs)}) se paga al recibir.`,
          },
          {
            id: 'efectivo',
            label: 'Pagar todo en efectivo al recibir',
            description: `Productos y delivery se pagan juntos al recibir: ${formatBs(subtotalBs + deliveryFeeBs)}.`,
          },
        ]
      : [
          {
            id: 'qr-total',
            label: 'Pagar ahora por QR',
            description: `El QR cubre el total completo: ${formatBs(subtotalBs)}.`,
          },
          {
            id: 'caja',
            label: 'Pagar en caja',
            description: `El total queda pendiente para el recojo: ${formatBs(subtotalBs)}.`,
          },
        ];

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-brand-black">Método de pago</h2>

      <fieldset className="mt-4">
        <legend className="sr-only">Método de pago</legend>
        <div className="flex flex-col gap-3">
          {options.map((option) => (
            <label
              key={option.id}
              className={`hover-bop cursor-pointer rounded-[1.5rem] border-2 p-5 ${
                value === option.id ? 'border-brand-blue bg-brand-blue/5 shadow-md' : 'border-brand-black/10 bg-brand-white'
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={option.id}
                checked={value === option.id}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              <span className="font-display block font-bold text-brand-black">{option.label}</span>
              <span className="mt-1 block text-sm text-brand-black/70">{option.description}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="lils-button-secondary text-sm"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!value}
          className="lils-button-primary flex-1 py-3 text-sm"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

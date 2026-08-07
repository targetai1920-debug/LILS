'use client';

import type { FulfillmentType } from '@/types';

interface FulfillmentStepProps {
  value: FulfillmentType | null;
  onChange: (value: FulfillmentType) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function FulfillmentStep({ value, onChange, onBack, onContinue }: FulfillmentStepProps) {
  const options: { id: FulfillmentType; label: string; description: string }[] = [
    {
      id: 'delivery',
      label: 'Envío a domicilio',
      description: 'Recibe tu pedido en la dirección que indiques, con tarifa según distancia.',
    },
    {
      id: 'pickup',
      label: 'Recoger en sucursal',
      description: 'Pasa a recoger tu pedido en el horario que elijas.',
    },
  ];

  return (
    <div>
      <fieldset>
        <legend className="font-display text-lg font-bold text-brand-black">
          ¿Cómo quieres recibir tu pedido?
        </legend>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {options.map((option) => (
            <label
              key={option.id}
              className={`cursor-pointer rounded-2xl border-2 p-4 ${
                value === option.id ? 'border-brand-blue bg-brand-beige' : 'border-brand-black/15'
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
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
          className="rounded-full border-2 border-brand-blue px-5 py-2.5 text-sm font-bold text-brand-blue"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!value}
          className="flex-1 rounded-full bg-brand-blue py-2.5 text-center font-display font-bold text-brand-white disabled:opacity-40"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

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
              className={`hover-bop cursor-pointer rounded-[1.5rem] border-2 p-5 ${
                value === option.id ? 'border-brand-blue bg-brand-blue/5 shadow-md' : 'border-brand-black/10 bg-brand-white'
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

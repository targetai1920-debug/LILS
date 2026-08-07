'use client';

import { useState } from 'react';
import type { BillingDetails } from '@/types';
import { validateBilling } from '@/lib/validation/billing';

interface BillingStepProps {
  billing: BillingDetails;
  onChange: (billing: BillingDetails) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function BillingStep({ billing, onChange, onBack, onContinue }: BillingStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleContinue() {
    const result = validateBilling(billing);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onContinue();
  }

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-brand-black">Facturación</h2>

      <fieldset className="mt-4">
        <legend className="sr-only">Tipo de facturación</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(['con-nit', 'sin-nit'] as const).map((type) => (
            <label
              key={type}
              className={`cursor-pointer rounded-2xl border-2 p-4 text-center font-display font-bold ${
                billing.type === type ? 'border-brand-blue bg-brand-beige' : 'border-brand-black/15'
              }`}
            >
              <input
                type="radio"
                name="billing-type"
                value={type}
                checked={billing.type === type}
                onChange={() => onChange({ ...billing, type })}
                className="sr-only"
              />
              {type === 'con-nit' ? 'Con NIT' : 'Sin NIT'}
            </label>
          ))}
        </div>
      </fieldset>

      {billing.type === 'con-nit' ? (
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="nit" className="text-sm font-bold text-brand-black">
              Número de NIT <span aria-hidden="true">*</span>
            </label>
            <input
              id="nit"
              type="text"
              inputMode="numeric"
              value={billing.nit}
              onChange={(event) => onChange({ ...billing, nit: event.target.value })}
              aria-required="true"
              aria-invalid={Boolean(errors.nit)}
              aria-describedby={errors.nit ? 'nit-error' : undefined}
              className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
            />
            {errors.nit ? (
              <p id="nit-error" role="alert" className="mt-1 text-xs font-semibold text-red-700">
                {errors.nit}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="businessName" className="text-sm font-bold text-brand-black">
              Nombre o razón social <span aria-hidden="true">*</span>
            </label>
            <input
              id="businessName"
              type="text"
              value={billing.businessName}
              onChange={(event) => onChange({ ...billing, businessName: event.target.value })}
              aria-required="true"
              aria-invalid={Boolean(errors.businessName)}
              aria-describedby={errors.businessName ? 'businessName-error' : undefined}
              className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
            />
            {errors.businessName ? (
              <p id="businessName-error" role="alert" className="mt-1 text-xs font-semibold text-red-700">
                {errors.businessName}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

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
          onClick={handleContinue}
          className="flex-1 rounded-full bg-brand-blue py-2.5 text-center font-display font-bold text-brand-white"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

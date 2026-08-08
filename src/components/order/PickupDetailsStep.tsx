'use client';

import { useMemo, useState } from 'react';
import type { PickupDetails } from '@/types';
import { branches, defaultBranch } from '@/data/branches';
import { deliveryConfig, preparationTimeDisclaimer } from '@/data/delivery';
import { generatePickupSlots } from '@/lib/time/pickupSlots';
import { getCochabambaNow } from '@/lib/time/cochabamba';
import { validatePickupDetails } from '@/lib/validation/pickup';

interface PickupDetailsStepProps {
  pickup: PickupDetails;
  onPatch: (patch: Partial<PickupDetails>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function PickupDetailsStep({ pickup, onPatch, onBack, onContinue }: PickupDetailsStepProps) {
  const branch = branches.find((candidate) => candidate.id === pickup.branchId) ?? defaultBranch;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const todayStr = useMemo(() => getCochabambaNow().dateStr, []);

  const availableSlots = useMemo(() => {
    return generatePickupSlots({
      dateStr: todayStr,
      openTime: branch.openTime,
      closeTime: branch.closeTime,
      intervalMinutes: deliveryConfig.pickupSlotIntervalMinutes,
      preparationMinutes: deliveryConfig.preparationMinutesEstimate,
    });
  }, [todayStr, branch]);

  function handleContinue() {
    const result = validatePickupDetails(pickup, branch, deliveryConfig);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onContinue();
  }

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-brand-black">Recojo en sucursal</h2>

      <div className="mt-4 flex items-start gap-3 rounded-[1.5rem] border border-brand-blue/15 bg-brand-blue/5 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue font-display font-black text-brand-white" aria-hidden="true">~</span>
        <div>
          <p className="font-display font-black text-brand-blue">Tiempo estimado: {deliveryConfig.preparationMinutesEstimate} minutos</p>
          <p className="mt-0.5 text-sm text-brand-black/60">Elige una hora disponible de hoy. Te avisaremos si el tiempo cambia.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {branches.length > 1 ? (
          <div>
            <label htmlFor="branch" className="text-sm font-bold text-brand-black">
              Sucursal
            </label>
            <select
              id="branch"
              value={pickup.branchId}
              onChange={(event) => onPatch({ branchId: event.target.value })}
              className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
            >
              {branches.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="rounded-xl bg-brand-beige p-3 text-sm">
            <p className="font-bold text-brand-black">{branch.name}</p>
            <p className="text-brand-black/70">{branch.addressLine}</p>
          </div>
        )}

        <div>
          <label htmlFor="personName" className="text-sm font-bold text-brand-black">
            Nombre de quien recogerá el pedido <span aria-hidden="true">*</span>
          </label>
          <input
            id="personName"
            type="text"
            value={pickup.personName}
            onChange={(event) => onPatch({ personName: event.target.value })}
            aria-required="true"
            aria-invalid={Boolean(errors.personName)}
            aria-describedby={errors.personName ? 'personName-error' : undefined}
            className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
          />
          {errors.personName ? (
            <p id="personName-error" role="alert" className="mt-1 text-xs font-semibold text-red-700">
              {errors.personName}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="pickupTime" className="text-sm font-bold text-brand-black">
            ¿A qué hora pasas hoy? <span aria-hidden="true">*</span>
          </label>
          <select
            id="pickupTime"
            value={pickup.time}
            onChange={(event) => onPatch({ date: todayStr, time: event.target.value })}
            aria-required="true"
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? 'pickupTime-error' : undefined}
            className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
          >
            <option value="">Elige una hora</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {availableSlots.length === 0 ? (
            <p className="mt-1 text-xs text-brand-black/60">
              Ya no quedan horarios de recojo para hoy. Nuestro horario es {branch.openTime}–{branch.closeTime}.
            </p>
          ) : null}
          {errors.time ? (
            <p id="pickupTime-error" role="alert" className="mt-1 text-xs font-semibold text-red-700">
              {errors.time}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-brand-black/55">{preparationTimeDisclaimer}</p>
        </div>
      </div>

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
          onClick={handleContinue}
          className="lils-button-primary flex-1 py-3 text-sm"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

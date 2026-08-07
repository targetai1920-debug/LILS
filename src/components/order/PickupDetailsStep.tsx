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
    if (!pickup.date) return [];
    return generatePickupSlots({
      dateStr: pickup.date,
      openTime: branch.openTime,
      closeTime: branch.closeTime,
      intervalMinutes: deliveryConfig.pickupSlotIntervalMinutes,
      preparationMinutes: deliveryConfig.preparationMinutesEstimate,
    });
  }, [pickup.date, branch]);

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
          <label htmlFor="pickupDate" className="text-sm font-bold text-brand-black">
            Fecha de recojo <span aria-hidden="true">*</span>
          </label>
          <input
            id="pickupDate"
            type="date"
            min={todayStr}
            value={pickup.date}
            onChange={(event) => onPatch({ date: event.target.value, time: '' })}
            aria-required="true"
            className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
          />
        </div>

        <div>
          <label htmlFor="pickupTime" className="text-sm font-bold text-brand-black">
            Hora de recojo <span aria-hidden="true">*</span>
          </label>
          <select
            id="pickupTime"
            value={pickup.time}
            onChange={(event) => onPatch({ time: event.target.value })}
            disabled={!pickup.date}
            aria-required="true"
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? 'pickupTime-error' : undefined}
            className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5 disabled:bg-brand-beige"
          >
            <option value="">Elige una hora</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {pickup.date && availableSlots.length === 0 ? (
            <p className="mt-1 text-xs text-brand-black/60">
              No hay horarios disponibles para esta fecha (fuera del horario {branch.openTime}–
              {branch.closeTime}). Elige otra fecha.
            </p>
          ) : null}
          {errors.time ? (
            <p id="pickupTime-error" role="alert" className="mt-1 text-xs font-semibold text-red-700">
              {errors.time}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-brand-black/60">{preparationTimeDisclaimer}</p>
        </div>
      </div>

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

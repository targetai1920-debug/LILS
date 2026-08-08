'use client';

import { useEffect, useState } from 'react';
import type { DeliveryAddress } from '@/types';
import { LocationPickerLoader } from '@/components/map/LocationPickerLoader';
import { defaultBranch } from '@/data/branches';
import { deliveryConfig, deliveryFeeDisclaimer } from '@/data/delivery';
import { haversineDistanceKm } from '@/lib/delivery/haversine';
import { calculateDeliveryFee } from '@/lib/delivery/fee';
import { validateBolivianPhone } from '@/lib/validation/phone';
import { validateDeliveryAddress } from '@/lib/validation/address';
import { formatBs } from '@/lib/format';

interface DeliveryDetailsStepProps {
  address: DeliveryAddress;
  onPatch: (patch: Partial<DeliveryAddress>) => void;
  onFeeCalculated: (feeBs: number, distanceKm: number | null) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function DeliveryDetailsStep({
  address,
  onPatch,
  onFeeCalculated,
  onBack,
  onContinue,
}: DeliveryDetailsStepProps) {
  const branch = defaultBranch;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const feeResult = address.location
    ? calculateDeliveryFee(
        haversineDistanceKm(branch.coordinates, address.location),
        deliveryConfig,
      )
    : null;

  useEffect(() => {
    if (feeResult) {
      onFeeCalculated(feeResult.feeBs ?? 0, feeResult.distanceKm);
    } else {
      onFeeCalculated(0, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.location?.lat, address.location?.lng]);

  function handleUseMyLocation() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoError('Tu navegador no admite geolocalización. Marca tu ubicación manualmente en el mapa.');
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onPatch({ location: { lat: position.coords.latitude, lng: position.coords.longitude } });
        setLocating(false);
      },
      () => {
        setGeoError('No pudimos acceder a tu ubicación. Marca el punto manualmente en el mapa.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  function handleContinue() {
    const result = validateDeliveryAddress(address);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    if (feeResult && !feeResult.inCoverage) {
      setErrors({ location: 'Esta ubicación está fuera de la cobertura de demostración.' });
      return;
    }
    const phoneResult = validateBolivianPhone(address.phone);
    onPatch({ phoneNormalized: phoneResult.normalized ?? '' });
    setErrors({});
    onContinue();
  }

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-brand-black">Dirección de entrega</h2>

      <div className="mt-4 flex flex-col gap-4">
        <div>
          <label htmlFor="mainStreet" className="text-sm font-bold text-brand-black">
            Calle o avenida principal <span aria-hidden="true">*</span>
          </label>
          <input
            id="mainStreet"
            type="text"
            value={address.mainStreet}
            onChange={(event) => onPatch({ mainStreet: event.target.value })}
            aria-required="true"
            aria-invalid={Boolean(errors.mainStreet)}
            aria-describedby={errors.mainStreet ? 'mainStreet-error' : undefined}
            className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
          />
          {errors.mainStreet ? (
            <p id="mainStreet-error" role="alert" className="mt-1 text-xs font-semibold text-red-700">
              {errors.mainStreet}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="houseNumber" className="text-sm font-bold text-brand-black">
            Número de domicilio {!address.noHouseNumber && <span aria-hidden="true">*</span>}
          </label>
          <input
            id="houseNumber"
            type="text"
            value={address.houseNumber}
            onChange={(event) => onPatch({ houseNumber: event.target.value })}
            disabled={address.noHouseNumber}
            aria-invalid={Boolean(errors.houseNumber)}
            aria-describedby={errors.houseNumber ? 'houseNumber-error' : undefined}
            className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5 disabled:bg-brand-beige"
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-brand-black/80">
            <input
              type="checkbox"
              checked={address.noHouseNumber}
              onChange={(event) =>
                onPatch({ noHouseNumber: event.target.checked, houseNumber: event.target.checked ? '' : address.houseNumber })
              }
              className="h-4 w-4 accent-[var(--brand-blue)]"
            />
            Mi domicilio no tiene número
          </label>
          {errors.houseNumber ? (
            <p id="houseNumber-error" role="alert" className="mt-1 text-xs font-semibold text-red-700">
              {errors.houseNumber}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="reference" className="text-sm font-bold text-brand-black">
            Referencia (opcional)
          </label>
          <input
            id="reference"
            type="text"
            value={address.reference}
            onChange={(event) => onPatch({ reference: event.target.value })}
            placeholder="Esquina, casi llegando, entre..."
            className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
          />
        </div>

        <div>
          <label htmlFor="crossStreet" className="text-sm font-bold text-brand-black">
            Calle auxiliar (opcional)
          </label>
          <input
            id="crossStreet"
            type="text"
            value={address.crossStreet}
            onChange={(event) => onPatch({ crossStreet: event.target.value })}
            aria-invalid={Boolean(errors.crossStreet)}
            aria-describedby={errors.crossStreet ? 'crossStreet-error' : undefined}
            className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
          />
          {errors.crossStreet ? (
            <p id="crossStreet-error" role="alert" className="mt-1 text-xs font-semibold text-red-700">
              {errors.crossStreet}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-brand-black">
              Ubicación exacta en mapa <span aria-hidden="true">*</span>
            </span>
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={locating}
              className="lils-button-quiet"
            >
              {locating ? 'Ubicando…' : 'Usar mi ubicación'}
            </button>
          </div>
          <div className="mt-2 h-64 w-full overflow-hidden rounded-2xl border-2 border-brand-black/15">
            <LocationPickerLoader
              center={branch.coordinates}
              value={address.location}
              onChange={(coords) => onPatch({ location: coords })}
            />
          </div>
          {geoError ? <p className="mt-1 text-xs text-brand-black/60">{geoError}</p> : null}
          {address.location ? (
            <p className="mt-1 text-xs text-brand-black/60">
              Lat {address.location.lat.toFixed(5)}, Lng {address.location.lng.toFixed(5)}
            </p>
          ) : (
            <p className="mt-1 text-xs text-brand-black/60">
              Toca el mapa o arrastra el marcador para indicar el punto exacto de entrega.
            </p>
          )}
          {errors.location ? (
            <p role="alert" className="mt-1 text-xs font-semibold text-red-700">
              {errors.location}
            </p>
          ) : null}

          {feeResult ? (
            <div
              className={`mt-2 rounded-xl p-3 text-sm ${
                feeResult.inCoverage ? 'bg-brand-beige text-brand-black' : 'bg-red-100 text-red-800'
              }`}
              aria-live="polite"
            >
              {feeResult.inCoverage ? (
                <>
                  Distancia aprox.: {feeResult.distanceKm.toFixed(1)} km · Tarifa de delivery:{' '}
                  {formatBs(feeResult.feeBs ?? 0)}
                </>
              ) : (
                <>Esta ubicación está fuera de la cobertura de demostración ({deliveryConfig.outOfCoverageDistanceKm} km).</>
              )}
              <p className="mt-1 text-xs opacity-80">{deliveryFeeDisclaimer}</p>
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-bold text-brand-black">
            Número de teléfono <span aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={address.phone}
            onChange={(event) => onPatch({ phone: event.target.value })}
            placeholder="7XXXXXXX"
            aria-required="true"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className="mt-1 w-full rounded-xl border-2 border-brand-black/15 p-2.5"
          />
          {errors.phone ? (
            <p id="phone-error" role="alert" className="mt-1 text-xs font-semibold text-red-700">
              {errors.phone}
            </p>
          ) : null}
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

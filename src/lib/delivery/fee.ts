import type { DeliveryConfig } from '@/types';

export interface DeliveryFeeResult {
  inCoverage: boolean;
  feeBs: number | null;
  distanceKm: number;
}

/**
 * Determina la tarifa de delivery de demostración según la distancia,
 * usando las zonas configuradas (ordenadas de menor a mayor alcance).
 * Si la distancia excede la cobertura configurada, el pedido queda
 * fuera de cobertura y debe bloquearse la continuación del flujo.
 */
export function calculateDeliveryFee(
  distanceKm: number,
  config: DeliveryConfig,
): DeliveryFeeResult {
  if (distanceKm > config.outOfCoverageDistanceKm) {
    return { inCoverage: false, feeBs: null, distanceKm };
  }

  const sortedZones = [...config.zones].sort((a, b) => a.maxDistanceKm - b.maxDistanceKm);
  const zone = sortedZones.find((candidate) => distanceKm <= candidate.maxDistanceKm);

  if (!zone) {
    return { inCoverage: false, feeBs: null, distanceKm };
  }

  return { inCoverage: true, feeBs: zone.feeBs, distanceKm };
}

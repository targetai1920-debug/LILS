import type { DeliveryConfig } from '@/types';

/**
 * DEMO_DATA_REPLACE_BEFORE_PRODUCTION
 * Zonas y tarifas de demostración. LILS debe confirmar las zonas reales de
 * cobertura, tarifas y tiempo mínimo de preparación antes de producción.
 * Las tarifas se calculan por distancia en línea recta (Haversine) desde la
 * sucursal hasta el punto marcado en el mapa; no reflejan tiempos ni rutas
 * reales de tráfico.
 */
export const deliveryConfig: DeliveryConfig = {
  zones: [
    { maxDistanceKm: 2, feeBs: 7 },
    { maxDistanceKm: 4, feeBs: 10 },
    { maxDistanceKm: 6, feeBs: 15 },
    { maxDistanceKm: 8, feeBs: 20 },
  ],
  outOfCoverageDistanceKm: 8,
  preparationMinutesEstimate: 35,
  pickupSlotIntervalMinutes: 15,
};

export const deliveryFeeDisclaimer =
  'Tarifa estimada de demostración. Pendiente de confirmación por LILS.';

export const preparationTimeDisclaimer =
  'Tiempo de preparación estimado, pendiente de confirmación del restaurante.';

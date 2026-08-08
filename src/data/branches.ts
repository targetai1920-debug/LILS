import type { Branch } from '@/types';

/**
 * DEMO_DATA_REPLACE_BEFORE_PRODUCTION
 * Solo existe una sucursal confirmada. La estructura admite más sucursales
 * en el futuro sin cambios de componentes: basta con añadir un elemento aquí.
 *
 * DEMO_APPROXIMATE_COORDINATES_REPLACE
 * La coordenada de "Sucursal Melchor Urquidi" es una aproximación de
 * demostración centrada en la referencia pública (cerca del Parque Fidel
 * Anze, Av. Melchor Urquidi, Cochabamba). No es la coordenada oficial del
 * local y debe reemplazarse cuando LILS confirme la ubicación exacta.
 */
export const branches: Branch[] = [
  {
    id: 'melchor-urquidi',
    name: 'Sucursal Melchor Urquidi',
    addressLine: 'Av. Melchor Urquidi entre J. A. Rico Toro y Pasaje Vega, Cochabamba',
    reference: 'A una cuadra y media del Parque Fidel Anze, al lado de Bolivisión',
    coordinates: { lat: -17.3856, lng: -66.1568 },
    coordinatesApproximate: true,
    openTime: '17:00',
    closeTime: '22:00',
    timezone: 'America/La_Paz',
  },
];

export function getBranchById(branchId: string): Branch | undefined {
  return branches.find((branch) => branch.id === branchId);
}

/** Sucursal por defecto para vistas que aún no admiten selección múltiple. */
export const defaultBranch: Branch = branches[0] as Branch;

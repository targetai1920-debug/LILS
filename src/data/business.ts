/**
 * DEMO_DATA_REPLACE_BEFORE_PRODUCTION
 * Información confirmada por el cliente para esta demostración. No inventar
 * datos adicionales (fundadores, historia, sucursales, premios) sin
 * confirmación explícita. Ver docs/CLIENT_INFORMATION_REQUIRED.md.
 */

export const business = {
  legalTradeName: 'LILS Burger',
  city: 'Cochabamba, Bolivia',
  currency: 'BOB',
  currencyLabel: 'Bs',
  phoneDisplay: '+591 64818054',
  phoneWhatsAppE164: '+59164818054',
  instagramUrl: 'https://www.instagram.com/lilsburger.bo',
  tiktokUrl: 'https://www.tiktok.com/@lilsburger.bo',
  openTime: '17:00',
  closeTime: '22:00',
  timezone: 'America/La_Paz',
} as const;

/**
 * Texto "Nosotros" provisional, veraz y sin datos inventados.
 * TODO_CLIENT_APPROVAL: reemplazar con la historia oficial cuando LILS la entregue.
 */
export const aboutUsText =
  'LILS es una propuesta local de smash burgers nacida para darle sabor y personalidad a Cochabamba. ' +
  'Hamburguesas contundentes, combinaciones reconocibles y una identidad hecha para disfrutarse sin complicaciones.';

export const aboutUsStatus = 'TODO_CLIENT_APPROVAL' as const;

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
}

interface MascotProps {
  className?: string;
}

/**
 * Placeholder de marca inspirado en la personalidad del personaje/mascota
 * proporcionado (hamburguesa con anteojos y gesto de "ok"). Es un recurso
 * provisional propio, no una copia exacta: el arte oficial del personaje
 * debe ser entregado por el cliente. Ver docs/ASSET_MANIFEST.md.
 */
export function Mascot({ className }: MascotProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Personaje LILS Burger">
      <circle cx="100" cy="100" r="98" fill="var(--brand-beige)" />
      <g stroke="var(--brand-blue)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M55 120c0-25 20-45 45-45s45 20 45 45" fill="var(--brand-white)" />
        <path d="M52 120h96a4 4 0 0 1 4 4v6a10 10 0 0 1-10 10H58a10 10 0 0 1-10-10v-6a4 4 0 0 1 4-4Z" fill="var(--brand-white)" />
        <circle cx="82" cy="98" r="12" fill="var(--brand-white)" />
        <circle cx="118" cy="98" r="12" fill="var(--brand-white)" />
        <circle cx="82" cy="98" r="3" fill="var(--brand-blue)" stroke="none" />
        <circle cx="118" cy="98" r="3" fill="var(--brand-blue)" stroke="none" />
        <path d="M96 63c8-10 24-10 30-2" />
        <path d="M40 150c6 8 16 12 26 8" />
      </g>
    </svg>
  );
}

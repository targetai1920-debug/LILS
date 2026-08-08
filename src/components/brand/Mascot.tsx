interface MascotProps {
  className?: string;
}

/** Recreación vectorial del personaje mostrado en las referencias de LILS. */
export function Mascot({ className }: MascotProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Personaje LILS Burger">
      <circle cx="100" cy="100" r="98" fill="var(--brand-beige)" />
      <g stroke="var(--brand-blue)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M56 103c4-22 22-35 44-35s40 13 44 35Z" fill="var(--brand-white)" />
        <path d="M55 107h90l-7 13H62Z" fill="var(--brand-blue)" />
        <path d="M60 122h80c6 0 10 5 8 11l-2 7c-2 6-7 9-13 9H67c-6 0-11-3-13-9l-2-7c-2-6 2-11 8-11Z" fill="var(--brand-white)" />
        <ellipse cx="86" cy="94" rx="15" ry="12" fill="var(--brand-white)" />
        <ellipse cx="116" cy="94" rx="15" ry="12" fill="var(--brand-white)" />
        <path d="M78 96h14M108 96h14" fill="none" />
        <path d="M91 112c6 5 13 5 19 0" fill="none" />
        <path d="M97 69c4-13 15-20 27-17l-4 12c10-1 17 2 21 8" fill="var(--brand-blue)" />
        <path d="M57 127c-17 2-24 13-27 24M143 126c14 2 21 12 24 24" fill="none" />
        <path d="M29 151c-5-7-4-16 3-20 6-4 14-2 18 4 3 6 1 13-4 17-6 4-13 2-17-1Z" fill="var(--brand-white)" />
        <circle cx="37" cy="140" r="5" fill="var(--brand-beige)" />
        <path d="M70 150l-8 24M130 150l8 24M52 177h24M124 177h24" fill="none" />
      </g>
    </svg>
  );
}

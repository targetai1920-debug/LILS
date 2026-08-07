interface LogoProps {
  className?: string;
  variant?: 'blue' | 'white';
}

/**
 * Recreación tipográfica del logotipo LILS Burger a partir de las
 * referencias visuales del cliente (no existe todavía un archivo vectorial
 * oficial). Ver docs/ASSET_MANIFEST.md: debe sustituirse por el logo
 * original en cuanto esté disponible.
 */
export function Logo({ className, variant = 'blue' }: LogoProps) {
  const ink = variant === 'blue' ? 'var(--brand-blue)' : 'var(--brand-white)';
  const fill = variant === 'blue' ? 'var(--brand-white)' : 'var(--brand-blue)';

  return (
    <svg
      viewBox="0 0 220 90"
      className={className}
      role="img"
      aria-label="LILS Burger"
    >
      <text
        x="10"
        y="52"
        fontFamily="var(--font-display)"
        fontWeight={800}
        fontSize="46"
        fill={fill}
        stroke={ink}
        strokeWidth="4"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        LILS
      </text>
      <text
        x="14"
        y="78"
        fontFamily="var(--font-display)"
        fontWeight={700}
        fontSize="18"
        letterSpacing="2"
        fill={ink}
      >
        BURGER
      </text>
    </svg>
  );
}

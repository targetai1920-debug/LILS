interface LogoProps {
  className?: string;
  variant?: 'blue' | 'white';
}

/**
 * Logotipo circular extraído de la foto de perfil entregada por LILS. Solo
 * conserva la marca, sin interfaz, marcos ni elementos de la captura.
 */
export function Logo({ className }: LogoProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') ?? '';

  return (
    <svg viewBox="0 0 512 512" className={className} role="img" aria-label="LILS Burger">
      <defs>
        <clipPath id="lils-profile-logo-clip">
          <circle cx="256" cy="256" r="252" />
        </clipPath>
      </defs>
      <image
        href={`${basePath}/brand/lils-profile-logo.webp`}
        width="512"
        height="512"
        clipPath="url(#lils-profile-logo-clip)"
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  );
}

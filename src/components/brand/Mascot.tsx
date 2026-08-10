import { Logo } from './Logo';

interface MascotProps {
  className?: string;
}

/** Emblema original entregado por LILS; evita reinterpretar o redibujar su personaje. */
export function Mascot({ className }: MascotProps) {
  return <Logo className={className} />;
}

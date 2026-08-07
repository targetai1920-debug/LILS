'use client';

import { useEffect, useState } from 'react';
import { isBranchOpenNow } from '@/lib/time/openStatus';
import { business } from '@/data/business';

/**
 * Indicador de abierto/cerrado según la hora actual de Cochabamba. No
 * depende únicamente del color: incluye texto e ícono.
 */
export function OpenStatusBadge() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setIsOpen(isBranchOpenNow(business));
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (isOpen === null) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-beige px-3 py-1.5 text-sm font-semibold text-brand-black">
        Consultando horario…
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
        isOpen ? 'bg-brand-white text-brand-blue' : 'bg-brand-black text-brand-white'
      }`}
      role="status"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <circle cx="5" cy="5" r="5" fill={isOpen ? '#2fae4e' : '#c73b3b'} />
      </svg>
      {isOpen ? 'Abierto ahora' : 'Cerrado ahora'} · {business.openTime}–{business.closeTime}
    </span>
  );
}

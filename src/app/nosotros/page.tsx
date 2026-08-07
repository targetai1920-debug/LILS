import type { Metadata } from 'next';
import { aboutUsText } from '@/data/business';
import { Mascot } from '@/components/brand/Mascot';

export const metadata: Metadata = {
  title: 'Nosotros — LILS Burger',
  description: 'Conoce LILS Burger, smash burgers en Cochabamba.',
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-brand-black md:text-4xl">Nosotros</h1>

      <div className="mt-6 flex flex-col items-start gap-6 md:flex-row">
        <Mascot className="h-32 w-32 shrink-0" />
        <div>
          {/* TODO_CLIENT_APPROVAL: reemplazar por la historia oficial cuando LILS la confirme. */}
          <p className="text-lg leading-relaxed text-brand-black/85">{aboutUsText}</p>
          <p className="mt-4 text-xs uppercase tracking-wide text-brand-black/40">
            Contenido provisional (TODO_CLIENT_APPROVAL) — pendiente de historia oficial del cliente.
          </p>
        </div>
      </div>
    </div>
  );
}

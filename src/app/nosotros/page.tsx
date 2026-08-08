import type { Metadata } from 'next';
import { aboutUsText } from '@/data/business';
import { Mascot } from '@/components/brand/Mascot';

export const metadata: Metadata = {
  title: 'Nosotros — LILS Burger',
  description: 'Conoce LILS Burger, smash burgers en Cochabamba.',
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <header className="blueprint-pattern rounded-[2.5rem] px-6 py-9 text-brand-white shadow-[0_22px_55px_rgba(23,37,119,0.20)] md:px-10">
        <span className="lils-kicker border-brand-white/20 bg-brand-white/10 text-brand-white">Sobre nosotros</span>
        <h1 className="font-display mt-3 text-5xl font-black tracking-[-0.04em] md:text-6xl">Esto es LILS.</h1>
      </header>

      <div className="lils-surface mt-7 flex flex-col items-start gap-6 p-6 md:flex-row md:p-9">
        <Mascot className="h-40 w-40 shrink-0 animate-float" />
        <div>
          {/* TODO_CLIENT_APPROVAL: reemplazar por la historia oficial cuando LILS la confirme. */}
          <p className="text-lg leading-relaxed text-brand-black/85">{aboutUsText}</p>
          <p className="mt-4 text-xs uppercase tracking-wide text-brand-black/40">
            Texto provisional, pendiente de confirmación por LILS.
          </p>
        </div>
      </div>
    </div>
  );
}

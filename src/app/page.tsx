import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/menu/FeaturedProducts';
import { aboutUsText } from '@/data/business';
import { business } from '@/data/business';
import { Mascot } from '@/components/brand/Mascot';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12" aria-labelledby="about-preview-heading">
        <div className="lils-surface soft-squiggle grid items-center gap-8 overflow-hidden p-6 md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <span className="lils-kicker">El sello LILS</span>
            <h2 id="about-preview-heading" className="font-display mt-3 text-3xl font-black tracking-[-0.03em] text-brand-black md:text-4xl">
              Hecha para Cochabamba
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-brand-black/70">{aboutUsText}</p>
            <Link href="/nosotros" className="lils-button-secondary mt-5 text-sm">
              Conocer LILS <span aria-hidden="true">→</span>
            </Link>
          </div>
          <Mascot className="mx-auto h-36 w-36 shrink-0 rotate-3 drop-shadow-xl transition duration-300 hover:-rotate-3 hover:scale-105 md:h-44 md:w-44" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4" aria-labelledby="visit-preview-heading">
        <div className="blueprint-pattern overflow-hidden rounded-[2.5rem] p-6 text-brand-white shadow-[0_22px_55px_rgba(23,37,119,0.20)] md:p-10">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-white/60">Estamos en {business.city}</p>
              <h2 id="visit-preview-heading" className="font-display mt-2 text-4xl font-black tracking-[-0.03em]">
                Ven por tu smash.
              </h2>
              <p className="mt-2 text-brand-white/75">
                {business.openTime} – {business.closeTime}, todos los días
              </p>
            </div>
            <Link href="/ubicacion" className="lils-button-secondary whitespace-nowrap">
              Abrir ubicación <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

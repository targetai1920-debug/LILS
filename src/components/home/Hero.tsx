import Link from 'next/link';
import { Mascot } from '@/components/brand/Mascot';
import { OpenStatusBadge } from './OpenStatusBadge';

export function Hero() {
  return (
    <section className="checker-pattern relative overflow-hidden border-b-4 border-brand-black">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="animate-slide-up rounded-brand bg-brand-cream/95 p-6 shadow-xl md:p-8">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-brand-blue">
            Cochabamba, Bolivia
          </p>
          <h1 className="font-display mt-2 text-4xl font-extrabold leading-tight text-brand-black md:text-5xl">
            Smash burgers con sello cochabambino
          </h1>
          <p className="mt-4 text-base text-brand-black/80 md:text-lg">
            Carnes smash, pan brioche y combinaciones propias de LILS. Pide en línea y elige cómo
            recibirla.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/ordenar"
              className="rounded-full bg-brand-blue px-6 py-3 text-center font-display font-bold text-brand-white shadow transition-transform hover:scale-[1.03]"
            >
              Ordenar ahora
            </Link>
            <Link
              href="/menu"
              className="rounded-full border-2 border-brand-blue bg-brand-white px-6 py-3 text-center font-display font-bold text-brand-blue transition-transform hover:scale-[1.03]"
            >
              Ver menú
            </Link>
          </div>

          <div className="mt-6">
            <OpenStatusBadge />
          </div>
        </div>

        <div className="flex justify-center">
          <Mascot className="h-56 w-56 animate-pop-in drop-shadow-xl md:h-72 md:w-72" />
        </div>
      </div>
    </section>
  );
}

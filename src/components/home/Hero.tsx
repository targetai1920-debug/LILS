import Link from 'next/link';
import { Mascot } from '@/components/brand/Mascot';
import { ProductVisual } from '@/components/menu/ProductVisual';
import { getProductById } from '@/data/menu';
import { OpenStatusBadge } from './OpenStatusBadge';

export function Hero() {
  const heroProduct = getProductById('hawaiana');

  return (
    <>
      <section className="px-3 pb-5 pt-2 md:px-6 md:pt-4">
        <div className="blueprint-pattern relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-brand-blue-dark/30 px-5 py-10 shadow-[0_28px_70px_rgba(23,37,119,0.24)] sm:rounded-[3rem] md:px-10 md:py-14 lg:px-14">
          <div aria-hidden="true" className="absolute -left-12 top-16 h-40 w-40 rounded-full border-[22px] border-brand-white/10" />
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-white/10 blur-2xl" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="animate-soft-rise">
              <span className="lils-kicker border-brand-white/20 bg-brand-white/10 text-brand-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brand-white" /> Cochabamba
              </span>
              <h1 className="font-display mt-5 max-w-2xl text-5xl font-black leading-[0.94] tracking-[-0.04em] text-brand-white sm:text-6xl lg:text-7xl">
                Smash que se nota.
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-brand-white/80 sm:text-lg">
                Pan brioche, carnes smash y combinaciones bien LILS. Arma tu pedido a tu manera y
                elige delivery o recojo.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/ordenar" className="lils-button-secondary px-6 py-3.5">
                  Quiero pedir <span aria-hidden="true">→</span>
                </Link>
                <Link href="/menu" className="inline-flex min-h-12 items-center rounded-full px-5 font-display font-bold text-brand-white ring-1 ring-brand-white/35 transition hover:bg-brand-white/10">
                  Explorar sabores
                </Link>
              </div>

              <div className="mt-7 inline-flex rounded-full bg-brand-black/20 p-1.5 backdrop-blur">
                <OpenStatusBadge />
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
              <div className="animate-float relative mx-auto aspect-square w-[86%] rotate-2 rounded-[3rem] bg-brand-cream p-3 shadow-[0_28px_70px_rgba(0,0,0,0.28)] sm:p-4">
                {heroProduct ? (
                  <ProductVisual
                    product={heroProduct}
                    className="h-full w-full rounded-[2.4rem]"
                    sizes="(min-width: 1024px) 38vw, 82vw"
                    priority
                  />
                ) : null}
                <div className="absolute -bottom-4 -left-4 rotate-[-7deg] rounded-full bg-brand-black px-4 py-2 font-display text-sm font-black text-brand-white shadow-lg">
                  HECHA PARA ANTOJAR
                </div>
              </div>
              <Mascot className="animate-wiggle absolute -bottom-8 -right-2 h-32 w-32 drop-shadow-2xl sm:h-40 sm:w-40" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-3 overflow-hidden rounded-full border border-brand-blue/10 bg-brand-white/75 py-2.5 shadow-sm md:mx-6">
        <div className="marquee-track flex gap-8 whitespace-nowrap font-display text-xs font-black uppercase tracking-[0.2em] text-brand-blue">
          {[0, 1].map((group) => (
            <span key={group} className="flex gap-8" aria-hidden={group === 1 ? 'true' : undefined}>
              <span>Smash burgers</span><span>✦</span><span>Pan brioche</span><span>✦</span>
              <span>Todos los días</span><span>✦</span><span>Cochabamba</span><span>✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

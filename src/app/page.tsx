import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/menu/FeaturedProducts';
import { aboutUsText } from '@/data/business';
import { business } from '@/data/business';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />

      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="about-preview-heading">
        <div className="rounded-brand border-2 border-brand-black/10 bg-brand-white p-6 md:p-8">
          <h2 id="about-preview-heading" className="font-display text-2xl font-extrabold text-brand-black">
            Sobre LILS
          </h2>
          <p className="mt-3 max-w-2xl text-brand-black/80">{aboutUsText}</p>
          <Link href="/nosotros" className="mt-4 inline-block text-sm font-bold text-brand-blue hover:underline">
            Conocer más →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16" aria-labelledby="visit-preview-heading">
        <div className="checker-pattern rounded-brand p-1">
          <div className="rounded-brand bg-brand-white p-6 md:p-8">
            <h2 id="visit-preview-heading" className="font-display text-2xl font-extrabold text-brand-black">
              Visítanos
            </h2>
            <p className="mt-2 text-brand-black/80">{business.city}</p>
            <p className="mt-1 text-brand-black/80">
              {business.openTime} – {business.closeTime}, todos los días
            </p>
            <Link href="/ubicacion" className="mt-4 inline-block text-sm font-bold text-brand-blue hover:underline">
              Ver ubicación y mapa →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

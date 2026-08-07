import Link from 'next/link';
import { business } from '@/data/business';

export function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-brand-blue bg-brand-blue text-brand-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-extrabold">LILS Burger</p>
          <p className="mt-2 text-sm text-brand-beige">{business.city}</p>
          <p className="mt-1 text-sm text-brand-beige">
            {business.openTime} – {business.closeTime}, todos los días
          </p>
        </div>

        <nav aria-label="Enlaces del pie de página" className="text-sm">
          <p className="font-semibold text-brand-white">Explorar</p>
          <ul className="mt-2 space-y-1 text-brand-beige">
            <li><Link href="/menu" className="hover:underline">Menú</Link></li>
            <li><Link href="/ordenar" className="hover:underline">Ordenar</Link></li>
            <li><Link href="/ubicacion" className="hover:underline">Ubicación</Link></li>
            <li><Link href="/contacto" className="hover:underline">Sugerencias y contacto</Link></li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="font-semibold text-brand-white">Contacto</p>
          <p className="mt-2 text-brand-beige">WhatsApp: {business.phoneDisplay}</p>
          <div className="mt-3 flex gap-3">
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-white px-3 py-1.5 text-xs font-semibold text-brand-blue"
            >
              Instagram
            </a>
            <a
              href={business.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-white px-3 py-1.5 text-xs font-semibold text-brand-blue"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-blue-dark px-4 py-4 text-center text-xs text-brand-beige">
        Sitio de demostración comercial para LILS Burger. No procesa pedidos ni pagos reales.
      </div>
    </footer>
  );
}

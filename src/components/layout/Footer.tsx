import Link from 'next/link';
import { business } from '@/data/business';

export function Footer() {
  return (
    <footer className="blueprint-pattern mx-3 mb-3 mt-16 overflow-hidden rounded-[2.5rem] text-brand-white shadow-[0_22px_55px_rgba(23,37,119,0.20)] md:mx-6">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
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
              className="lils-button-secondary min-h-0 px-3 py-2 text-xs shadow-none"
            >
              Instagram
            </a>
            <a
              href={business.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lils-button-secondary min-h-0 px-3 py-2 text-xs shadow-none"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-white/10 px-4 py-4 text-center text-xs text-brand-beige">
        Sitio de demostración comercial para LILS Burger. No procesa pedidos ni pagos reales.
      </div>
    </footer>
  );
}

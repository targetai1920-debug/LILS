import type { Metadata } from 'next';
import { business } from '@/data/business';

export const metadata: Metadata = {
  title: 'Redes sociales — LILS Burger',
  description: 'Síguenos en Instagram y TikTok.',
};

export default function RedesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <header className="soft-squiggle rounded-[2.5rem] bg-brand-blue px-6 py-9 text-brand-white shadow-[0_22px_55px_rgba(23,37,119,0.20)] md:px-10">
        <span className="lils-kicker border-brand-white/20 bg-brand-white/10 text-brand-white">Síguenos</span>
        <h1 className="font-display mt-3 text-5xl font-black tracking-[-0.04em] md:text-6xl">El feed da hambre.</h1>
        <p className="mt-2 text-brand-white/70">Menú, novedades y promociones vigentes.</p>
      </header>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a
          href={business.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="lils-card hover-bop flex flex-1 items-center gap-3 p-5"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-brand-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
            </svg>
          </span>
          <span>
            <span className="block font-display font-bold text-brand-black">Instagram</span>
            <span className="block text-sm text-brand-black/60">@lilsburger.bo</span>
          </span>
        </a>

        <a
          href={business.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="lils-card hover-bop flex flex-1 items-center gap-3 p-5"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-brand-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M16 3c.5 2.6 2 4.2 4.5 4.4v3c-1.6 0-3-.5-4.5-1.4v6.4a5.5 5.5 0 1 1-5.5-5.5c.3 0 .7 0 1 .1v3.1a2.4 2.4 0 1 0 1.7 2.3V3H16Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span>
            <span className="block font-display font-bold text-brand-black">TikTok</span>
            <span className="block text-sm text-brand-black/60">@lilsburger.bo</span>
          </span>
        </a>
      </div>
    </div>
  );
}

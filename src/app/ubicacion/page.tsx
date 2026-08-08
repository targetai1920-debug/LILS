import type { Metadata } from 'next';
import { branches } from '@/data/branches';
import { business } from '@/data/business';
import { BranchMapLoader } from '@/components/map/BranchMapLoader';

export const metadata: Metadata = {
  title: 'Ubicación — LILS Burger',
  description: 'Dirección, horarios y mapa de LILS Burger en Cochabamba.',
};

export default function UbicacionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <header className="blueprint-pattern rounded-[2.5rem] px-6 py-9 text-brand-white shadow-[0_22px_55px_rgba(23,37,119,0.20)] md:px-10">
        <span className="lils-kicker border-brand-white/20 bg-brand-white/10 text-brand-white">Cómo llegar</span>
        <h1 className="font-display mt-3 text-5xl font-black tracking-[-0.04em] md:text-6xl">Encuéntranos.</h1>
        <p className="mt-2 max-w-2xl text-brand-white/70">Abre el mapa, sigue la ruta y ven por tu pedido.</p>
      </header>

      <div className="mt-8 flex flex-col gap-8">
        {branches.map((branch) => {
          // Mientras la coordenada sea aproximada, "Cómo llegar" busca la
          // dirección pública en vez de apuntar a un pin que afirmaría una
          // precisión que todavía no tenemos confirmada por LILS.
          const directionsUrl = branch.coordinatesApproximate
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.addressLine)}`
            : `https://www.google.com/maps/dir/?api=1&destination=${branch.coordinates.lat},${branch.coordinates.lng}`;

          return (
            <article
              key={branch.id}
              className="lils-surface overflow-hidden"
            >
              <div className="h-80 w-full overflow-hidden rounded-b-[2rem] bg-brand-beige md:h-[28rem]">
                <BranchMapLoader branch={branch} />
              </div>
              <div className="p-6">
                <h2 className="font-display text-2xl font-black text-brand-black">{branch.name}</h2>
                <dl className="mt-3 space-y-2 text-sm text-brand-black/80">
                  <div>
                    <dt className="font-semibold text-brand-black">Dirección</dt>
                    <dd>{branch.addressLine}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-brand-black">Referencia</dt>
                    <dd>{branch.reference}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-brand-black">Horario</dt>
                    <dd>
                      {branch.openTime} – {branch.closeTime}, todos los días ({business.city})
                    </dd>
                  </div>
                </dl>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lils-button-primary mt-5 text-sm"
                >
                  Abrir ruta en Google Maps <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

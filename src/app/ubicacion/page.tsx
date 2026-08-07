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
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-brand-black md:text-4xl">Ubicación</h1>
      <p className="mt-2 text-brand-black/70">
        Por ahora contamos con una sucursal confirmada. La estructura del sitio admite más
        sucursales cuando LILS las confirme.
      </p>

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
              className="overflow-hidden rounded-brand border-2 border-brand-black/10 bg-brand-white"
            >
              <div className="h-72 w-full">
                <BranchMapLoader branch={branch} />
              </div>
              {branch.coordinatesApproximate ? (
                <p className="bg-brand-beige px-4 py-2 text-center text-xs text-brand-black/70">
                  Mapa referencial de la demostración. La ubicación exacta se confirmará con LILS
                  antes de habilitar pedidos.
                </p>
              ) : null}
              <div className="p-6">
                <h2 className="font-display text-xl font-extrabold text-brand-black">{branch.name}</h2>
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
                  className="mt-4 inline-block rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-brand-white"
                >
                  Cómo llegar
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

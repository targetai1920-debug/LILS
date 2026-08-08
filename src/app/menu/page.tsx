import type { Metadata } from 'next';
import { MenuByCategory } from '@/components/menu/MenuByCategory';
import { menuCategories } from '@/data/menu';

export const metadata: Metadata = {
  title: 'Menú — LILS Burger',
  description: 'Menú completo de LILS Burger: hamburguesas, para compartir, papas y extras, y bebidas.',
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <header className="soft-squiggle relative overflow-hidden rounded-[2.5rem] bg-brand-blue px-6 py-10 text-brand-white shadow-[0_22px_55px_rgba(23,37,119,0.20)] md:px-10">
        <span className="lils-kicker border-brand-white/20 bg-brand-white/10 text-brand-white">Menú LILS</span>
        <h1 className="font-display mt-3 text-5xl font-black tracking-[-0.04em] md:text-6xl">Elige tu mood.</h1>
        <p className="mt-3 max-w-2xl text-brand-white/75">
          Todas las opciones disponibles para armar tu pedido. Personaliza ingredientes y extras; al agregar te llevamos a Ordenar.
        </p>
      </header>

      <nav aria-label="Categorías del menú" className="sticky top-[4.8rem] z-20 -mx-1 mt-5 overflow-x-auto px-1 py-2">
        <div className="flex w-max gap-2 rounded-full border border-brand-blue/10 bg-brand-cream/90 p-1.5 shadow-lg backdrop-blur">
          {menuCategories.map((category) => (
            <a key={category.id} href={`#${category.id}`} className="rounded-full px-4 py-2 text-sm font-extrabold text-brand-blue transition hover:bg-brand-blue hover:text-brand-white">
              {category.name}
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-10">
        <MenuByCategory />
      </div>
    </div>
  );
}

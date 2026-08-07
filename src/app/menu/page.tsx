import type { Metadata } from 'next';
import { MenuByCategory } from '@/components/menu/MenuByCategory';

export const metadata: Metadata = {
  title: 'Menú — LILS Burger',
  description: 'Menú completo de LILS Burger: hamburguesas, para compartir, papas y extras, y bebidas.',
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-brand-black md:text-4xl">Menú</h1>
      <p className="mt-2 max-w-xl text-brand-black/70">
        Toca &quot;Personalizar&quot; en cualquier producto para elegir variante, ingredientes y extras
        antes de agregarlo a tu pedido.
      </p>
      <div className="mt-8">
        <MenuByCategory />
      </div>
    </div>
  );
}

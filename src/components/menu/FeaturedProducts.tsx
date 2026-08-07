import Link from 'next/link';
import { getFeaturedProducts } from '@/data/menu';
import { ProductCard } from './ProductCard';

export function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="featured-heading">
      <div className="flex items-end justify-between gap-4">
        <h2 id="featured-heading" className="font-display text-3xl font-extrabold text-brand-black">
          Menú destacado
        </h2>
        <Link href="/menu" className="text-sm font-bold text-brand-blue hover:underline">
          Ver menú completo →
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

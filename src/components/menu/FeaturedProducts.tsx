import { getFeaturedProducts } from '@/data/menu';
import { ProductCard } from './ProductCard';

export function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="featured-heading">
      <div className="max-w-2xl">
        <span className="lils-kicker">Los favoritos</span>
        <h2 id="featured-heading" className="font-display mt-3 text-4xl font-black tracking-[-0.03em] text-brand-black md:text-5xl">
          El antojo empieza aquí
        </h2>
        <p className="mt-3 text-brand-black/65">
          Toca una opción, personalízala y te llevamos directo a continuar tu pedido.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

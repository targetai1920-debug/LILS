import { menuCategories, getProductsByCategory } from '@/data/menu';
import { ProductCard } from './ProductCard';

export function MenuByCategory() {
  return (
    <div className="flex flex-col gap-10">
      {menuCategories.map((category) => {
        const categoryProducts = getProductsByCategory(category.id);
        if (categoryProducts.length === 0) return null;
        return (
          <section key={category.id} aria-labelledby={`category-${category.id}`}>
            <h2 id={`category-${category.id}`} className="font-display text-2xl font-extrabold text-brand-blue">
              {category.name}
            </h2>
            <p className="mt-1 text-sm text-brand-black/70">{category.description}</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

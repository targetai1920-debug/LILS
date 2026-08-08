import { menuCategories, getProductsByCategory } from '@/data/menu';
import { ProductCard } from './ProductCard';

interface MenuByCategoryProps {
  redirectToOrderAfterAdd?: boolean;
}

export function MenuByCategory({ redirectToOrderAfterAdd = true }: MenuByCategoryProps) {
  return (
    <div className="flex flex-col gap-14">
      {menuCategories.map((category) => {
        const categoryProducts = getProductsByCategory(category.id);
        if (categoryProducts.length === 0) return null;
        return (
          <section key={category.id} id={category.id} aria-labelledby={`category-${category.id}`} className="scroll-mt-28">
            <div className="flex items-end gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-blue font-display text-sm font-black text-brand-white shadow-[0_5px_0_var(--brand-blue-dark)]" aria-hidden="true">
                {String(menuCategories.indexOf(category) + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 id={`category-${category.id}`} className="font-display text-3xl font-black tracking-[-0.025em] text-brand-blue">
                  {category.name}
                </h2>
                <p className="mt-0.5 text-sm text-brand-black/60">{category.description}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} redirectToOrderAfterAdd={redirectToOrderAfterAdd} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

import Image from 'next/image';
import type { Product } from '@/types';
import { BurgerPlaceholder } from '@/components/brand/BurgerPlaceholder';

interface ProductVisualProps {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Muestra una fotografía limpia cuando existe y conserva el placeholder de
 * marca para los productos que todavía no tienen una foto individual.
 */
export function ProductVisual({ product, className, sizes = '100vw', priority = false }: ProductVisualProps) {
  if (!product.imagePath) {
    return <BurgerPlaceholder className={className} label={product.name} />;
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') ?? '';

  return (
    <div className={`relative overflow-hidden bg-brand-cream ${className ?? ''}`}>
      <Image
        src={`${basePath}${product.imagePath}`}
        alt={`Hamburguesa ${product.name}`}
        fill
        sizes={sizes}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}

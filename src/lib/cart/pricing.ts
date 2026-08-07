import { noFriesDiscountBs } from '@/data/menu';
import type { CartLine, Product } from '@/types';

/**
 * Calcula el precio unitario de una línea de carrito (sin multiplicar por
 * cantidad): precio de variante + extras seleccionados - descuento "sin papas".
 * Los ingredientes retirados no afectan el precio (se retiran sin costo).
 */
export function calculateLineUnitPriceBs(product: Product, line: CartLine): number {
  const variant = product.variants.find((candidate) => candidate.id === line.variantId);
  const basePrice = variant?.priceBs ?? 0;
  const extrasTotal = line.extras.reduce((sum, extra) => sum + extra.priceBs, 0);
  const noFriesDiscount = product.allowsNoFries && line.noFries ? noFriesDiscountBs : 0;
  const unitPrice = basePrice + extrasTotal - noFriesDiscount;
  return Math.max(0, unitPrice);
}

export function calculateLineTotalBs(product: Product, line: CartLine): number {
  return calculateLineUnitPriceBs(product, line) * line.quantity;
}

export function calculateCartSubtotalBs(
  lines: CartLine[],
  resolveProduct: (productId: string) => Product | undefined,
): number {
  return lines.reduce((sum, line) => {
    const product = resolveProduct(line.productId);
    if (!product) return sum;
    return sum + calculateLineTotalBs(product, line);
  }, 0);
}

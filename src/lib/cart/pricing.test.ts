import { describe, expect, it } from 'vitest';
import { calculateCartSubtotalBs, calculateLineTotalBs, calculateLineUnitPriceBs } from './pricing';
import { getProductById } from '@/data/menu';
import type { CartLine, Product } from '@/types';

const lilsBurger = getProductById('lils-burger') as Product;
const lilsKids = getProductById('lils-kids') as Product;

function makeLine(overrides: Partial<CartLine> = {}): CartLine {
  return {
    lineId: 'line-1',
    productId: lilsBurger.id,
    variantId: 'doble',
    quantity: 1,
    removedIngredientIds: [],
    extras: [],
    noFries: false,
    notes: '',
    ...overrides,
  };
}

describe('calculateLineUnitPriceBs', () => {
  it('usa el precio de la variante doble', () => {
    expect(calculateLineUnitPriceBs(lilsBurger, makeLine({ variantId: 'doble' }))).toBe(45);
  });

  it('usa el precio de la variante triple', () => {
    expect(calculateLineUnitPriceBs(lilsBurger, makeLine({ variantId: 'triple' }))).toBe(49);
  });

  it('suma extras seleccionados al precio base', () => {
    const line = makeLine({
      extras: [
        { id: 'tocino-extra', label: 'Tocino extra', priceBs: 11 },
        { id: 'papa-mediana', label: 'Papa mediana', priceBs: 10 },
      ],
    });
    expect(calculateLineUnitPriceBs(lilsBurger, line)).toBe(45 + 11 + 10);
  });

  it('no cambia el precio al retirar ingredientes (son gratis)', () => {
    const line = makeLine({ removedIngredientIds: ['cebolla-caramelizada', 'bbq'] });
    expect(calculateLineUnitPriceBs(lilsBurger, line)).toBe(45);
  });

  it('descuenta Bs 3 al pedir una hamburguesa sin papas', () => {
    const kidsLine = makeLine({ productId: lilsKids.id, variantId: 'unico', noFries: true });
    expect(calculateLineUnitPriceBs(lilsKids, kidsLine)).toBe(42 - 3);

    const burgerLine = makeLine({ noFries: true });
    expect(calculateLineUnitPriceBs(lilsBurger, burgerLine)).toBe(45 - 3);
  });

  it('nunca resulta en un precio negativo', () => {
    const kidsLine = makeLine({ productId: lilsKids.id, variantId: 'unico', noFries: true, extras: [] });
    const price = calculateLineUnitPriceBs(lilsKids, kidsLine);
    expect(price).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateLineTotalBs', () => {
  it('multiplica el precio unitario por la cantidad', () => {
    const line = makeLine({ variantId: 'doble', quantity: 3 });
    expect(calculateLineTotalBs(lilsBurger, line)).toBe(45 * 3);
  });
});

describe('calculateCartSubtotalBs', () => {
  it('suma el total de todas las líneas del carrito', () => {
    const lines: CartLine[] = [
      makeLine({ lineId: 'a', variantId: 'doble', quantity: 2 }),
      makeLine({
        lineId: 'b',
        productId: lilsKids.id,
        variantId: 'unico',
        quantity: 1,
      }),
    ];
    const subtotal = calculateCartSubtotalBs(lines, getProductById);
    expect(subtotal).toBe(45 * 2 + 42);
  });

  it('ignora líneas cuyo producto ya no existe', () => {
    const lines: CartLine[] = [makeLine({ productId: 'producto-inexistente' })];
    expect(calculateCartSubtotalBs(lines, getProductById)).toBe(0);
  });
});

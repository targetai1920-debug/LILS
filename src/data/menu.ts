import type { ExtraOption, MenuCategory, Product } from '@/types';

/**
 * DEMO_DATA_REPLACE_BEFORE_PRODUCTION
 * Todo este contenido proviene de material público (menú físico/digital de
 * LILS Burger) reunido para esta demostración. Precios, ingredientes y
 * disponibilidad deben ser confirmados por el cliente antes de producción.
 * Ver docs/CLIENT_INFORMATION_REQUIRED.md.
 *
 * La estructura (categorías -> productos -> variantes/extras/ingredientes)
 * está diseñada para admitir nuevas categorías y productos agregando datos
 * aquí, sin reescribir componentes.
 */

export const menuCategories: MenuCategory[] = [
  {
    id: 'hamburguesas',
    name: 'Hamburguesas',
    description: 'Smash burgers en pan brioche, servidas dobles o triples.',
  },
  {
    id: 'para-compartir',
    name: 'Para compartir',
    description: 'Ideal para compartir en grupo.',
  },
  {
    id: 'papas-y-extras',
    name: 'Papas y extras',
    description: 'Acompañamientos y extras para sumar a tu pedido.',
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    description: 'Para acompañar tu hamburguesa.',
  },
];

/** Catálogo de extras disponibles. Cada producto referencia los que aplican vía extraIds. */
export const extrasCatalog: ExtraOption[] = [
  { id: 'cebolla-caramelizada', label: 'Cebolla caramelizada', priceBs: 5 },
  { id: 'pepinillos-relish', label: 'Pepinillos relish', priceBs: 5 },
  { id: 'pina-caramelizada', label: 'Piña caramelizada', priceBs: 5 },
  { id: 'mermelada-tocino', label: 'Mermelada de tocino', priceBs: 8 },
  { id: 'carne-extra-cheddar', label: 'Carne extra (con cheddar)', priceBs: 11 },
  { id: 'tocino-extra', label: 'Tocino extra', priceBs: 11 },
  { id: 'papa-mediana', label: 'Papa mediana', priceBs: 10 },
  { id: 'papa-grande', label: 'Papa grande', priceBs: 15 },
];

export function getExtraById(extraId: string): ExtraOption | undefined {
  return extrasCatalog.find((extra) => extra.id === extraId);
}

/** Bs que se descuentan al marcar "Sin papas" en productos que lo permiten. */
export const noFriesDiscountBs = 3;

const commonBurgerExtraIds = [
  'cebolla-caramelizada',
  'pepinillos-relish',
  'pina-caramelizada',
  'mermelada-tocino',
  'carne-extra-cheddar',
  'tocino-extra',
  'papa-mediana',
  'papa-grande',
];

export const products: Product[] = [
  {
    id: 'lils-burger',
    slug: 'lils-burger',
    categoryId: 'hamburguesas',
    name: 'LILS Burger',
    description: 'La firma de la casa: doble o triple smash, tocino ahumado y cebolla caramelizada con BBQ.',
    imagePlaceholderId: 'burger-lils',
    ingredients: [
      { id: 'pan-brioche', label: 'Pan brioche', removable: false },
      { id: 'carnes-smash', label: 'Carnes smash', removable: false },
      { id: 'queso-cheddar', label: 'Queso cheddar', removable: true },
      { id: 'tocino-ahumado', label: 'Tocino ahumado', removable: true },
      { id: 'salsa-lils', label: 'Salsa LILS', removable: true },
      { id: 'cebolla-caramelizada', label: 'Cebolla caramelizada', removable: true },
      { id: 'bbq', label: 'BBQ', removable: true },
    ],
    variants: [
      { id: 'doble', label: 'Doble', priceBs: 45 },
      { id: 'triple', label: 'Triple', priceBs: 49 },
    ],
    extraIds: commonBurgerExtraIds,
    allowsNoFries: false,
    featured: true,
  },
  {
    id: 'triple-b',
    slug: 'triple-b',
    categoryId: 'hamburguesas',
    name: 'Triple B',
    description: 'Smash, cheddar y tocino ahumado con salsa LILS, sin vueltas.',
    imagePlaceholderId: 'burger-triple-b',
    ingredients: [
      { id: 'pan-brioche', label: 'Pan brioche', removable: false },
      { id: 'carnes-smash', label: 'Carnes smash', removable: false },
      { id: 'queso-cheddar', label: 'Queso cheddar', removable: true },
      { id: 'tocino-ahumado', label: 'Tocino ahumado', removable: true },
      { id: 'salsa-lils', label: 'Salsa LILS', removable: true },
    ],
    variants: [
      { id: 'doble', label: 'Doble', priceBs: 44 },
      { id: 'triple', label: 'Triple', priceBs: 49 },
    ],
    extraIds: commonBurgerExtraIds,
    allowsNoFries: false,
    featured: true,
  },
  {
    id: 'relish',
    slug: 'relish',
    categoryId: 'hamburguesas',
    name: 'Relish',
    description: 'Smash y cheddar con cubitos de pepinillos macerados y salsa LILS.',
    imagePlaceholderId: 'burger-relish',
    ingredients: [
      { id: 'pan-brioche', label: 'Pan brioche', removable: false },
      { id: 'carnes-smash', label: 'Carnes smash', removable: false },
      { id: 'queso-cheddar', label: 'Queso cheddar', removable: true },
      { id: 'pepinillos-macerados', label: 'Cubitos de pepinillos macerados', removable: true },
      { id: 'salsa-lils', label: 'Salsa LILS', removable: true },
    ],
    variants: [
      { id: 'doble', label: 'Doble', priceBs: 39 },
      { id: 'triple', label: 'Triple', priceBs: 45 },
    ],
    extraIds: commonBurgerExtraIds,
    allowsNoFries: false,
    featured: false,
  },
  {
    id: 'hawaiana',
    slug: 'hawaiana',
    categoryId: 'hamburguesas',
    name: 'Hawaiana',
    description: 'Smash y cheddar con piña caramelizada en cubitos y salsa LILS.',
    imagePlaceholderId: 'burger-hawaiana',
    ingredients: [
      { id: 'pan-brioche', label: 'Pan brioche', removable: false },
      { id: 'carnes-smash', label: 'Carnes smash', removable: false },
      { id: 'queso-cheddar', label: 'Queso cheddar', removable: true },
      { id: 'pina-caramelizada-cubitos', label: 'Piña caramelizada en cubitos', removable: true },
      { id: 'salsa-lils', label: 'Salsa LILS', removable: true },
    ],
    variants: [
      { id: 'doble', label: 'Doble', priceBs: 46 },
      { id: 'triple', label: 'Triple', priceBs: 49 },
    ],
    extraIds: commonBurgerExtraIds,
    allowsNoFries: false,
    featured: true,
  },
  {
    id: 'sweet-bacon',
    slug: 'sweet-bacon',
    categoryId: 'hamburguesas',
    name: 'Sweet Bacon',
    description: 'Smash y cheddar con mermelada de tocino y salsa LILS.',
    imagePlaceholderId: 'burger-sweet-bacon',
    ingredients: [
      { id: 'pan-brioche', label: 'Pan brioche', removable: false },
      { id: 'carnes-smash', label: 'Carnes smash', removable: false },
      { id: 'queso-cheddar', label: 'Queso cheddar', removable: true },
      { id: 'mermelada-tocino-ingrediente', label: 'Mermelada de tocino', removable: true },
      { id: 'salsa-lils', label: 'Salsa LILS', removable: true },
    ],
    variants: [
      { id: 'doble', label: 'Doble', priceBs: 49 },
      { id: 'triple', label: 'Triple', priceBs: 55 },
    ],
    extraIds: commonBurgerExtraIds,
    allowsNoFries: false,
    featured: true,
  },
  {
    id: 'argentina',
    slug: 'argentina',
    categoryId: 'hamburguesas',
    name: 'Argentina',
    description: 'Smash y cheddar con chorizo criollo argentino y salsa LILS.',
    imagePlaceholderId: 'burger-argentina',
    ingredients: [
      { id: 'pan-brioche', label: 'Pan brioche', removable: false },
      { id: 'carnes-smash', label: 'Carnes smash', removable: false },
      { id: 'queso-cheddar', label: 'Queso cheddar', removable: true },
      { id: 'chorizo-criollo', label: 'Chorizo criollo argentino', removable: true },
      { id: 'salsa-lils', label: 'Salsa LILS', removable: true },
    ],
    variants: [
      { id: 'doble', label: 'Doble', priceBs: 44 },
      { id: 'triple', label: 'Triple', priceBs: 49 },
    ],
    extraIds: commonBurgerExtraIds,
    allowsNoFries: false,
    featured: false,
  },
  {
    id: 'lils-kids',
    slug: 'lils-kids',
    categoryId: 'hamburguesas',
    name: 'LILS Kids',
    description: 'Versión para los más chicos, con carne smash, cheddar, tomate y un juguete especial.',
    imagePlaceholderId: 'burger-kids',
    ingredients: [
      { id: 'pan-brioche', label: 'Pan brioche', removable: false },
      { id: 'carne-smash-kids', label: 'Carne smash', removable: false },
      { id: 'queso-cheddar', label: 'Queso cheddar', removable: true },
      { id: 'tomate', label: 'Tomate', removable: true },
      { id: 'salsa-lils', label: 'Salsa LILS', removable: true },
      { id: 'juguete-especial', label: 'Juguete especial', removable: false },
    ],
    variants: [{ id: 'unico', label: 'Único', priceBs: 42 }],
    extraIds: ['papa-mediana', 'papa-grande'],
    allowsNoFries: true,
    featured: false,
  },
  {
    id: 'lilsitos',
    slug: 'lilsitos',
    categoryId: 'para-compartir',
    name: 'Lilsitos',
    description: 'Seis mini hamburguesas en pan brioche, carne, queso, tocino y salsa LILS. Ideal para compartir.',
    imagePlaceholderId: 'lilsitos',
    ingredients: [
      { id: 'pan-brioche', label: 'Pan brioche', removable: false },
      { id: 'carne-mini', label: 'Carne', removable: false },
      { id: 'queso', label: 'Queso', removable: true },
      { id: 'tocino', label: 'Tocino', removable: true },
      { id: 'salsa-lils', label: 'Salsa LILS', removable: true },
    ],
    variants: [{ id: 'unico', label: '6 unidades', priceBs: 45 }],
    extraIds: [],
    allowsNoFries: false,
    featured: true,
  },
  {
    id: 'papa-mediana-item',
    slug: 'papa-mediana',
    categoryId: 'papas-y-extras',
    name: 'Papa mediana',
    description: 'Porción mediana de papas fritas.',
    imagePlaceholderId: 'papas',
    ingredients: [],
    variants: [{ id: 'unico', label: 'Mediana', priceBs: 10 }],
    extraIds: [],
    allowsNoFries: false,
    featured: false,
  },
  {
    id: 'papa-grande-item',
    slug: 'papa-grande',
    categoryId: 'papas-y-extras',
    name: 'Papa grande',
    description: 'Porción grande de papas fritas.',
    imagePlaceholderId: 'papas',
    ingredients: [],
    variants: [{ id: 'unico', label: 'Grande', priceBs: 15 }],
    extraIds: [],
    allowsNoFries: false,
    featured: false,
  },
  {
    id: 'gaseosa-300',
    slug: 'gaseosa-300',
    categoryId: 'bebidas',
    name: 'Gaseosa 300 ml',
    description: 'Gaseosa fría de 300 ml.',
    imagePlaceholderId: 'bebida',
    ingredients: [],
    variants: [{ id: 'unico', label: '300 ml', priceBs: 7 }],
    extraIds: [],
    allowsNoFries: false,
    featured: false,
  },
  {
    id: 'jugo-300',
    slug: 'jugo-300',
    categoryId: 'bebidas',
    name: 'Jugo 300 ml',
    description: 'Jugo natural de 300 ml.',
    imagePlaceholderId: 'bebida',
    ingredients: [],
    variants: [{ id: 'unico', label: '300 ml', priceBs: 7 }],
    extraIds: [],
    allowsNoFries: false,
    featured: false,
  },
  {
    id: 'agua',
    slug: 'agua',
    categoryId: 'bebidas',
    name: 'Agua',
    description: 'Agua embotellada.',
    imagePlaceholderId: 'bebida',
    ingredients: [],
    variants: [{ id: 'unico', label: 'Única', priceBs: 9 }],
    extraIds: [],
    allowsNoFries: false,
    featured: false,
  },
  {
    id: 'gaseosa-500',
    slug: 'gaseosa-500',
    categoryId: 'bebidas',
    name: 'Gaseosa 500 ml',
    description: 'Gaseosa fría de 500 ml.',
    imagePlaceholderId: 'bebida',
    ingredients: [],
    variants: [{ id: 'unico', label: '500 ml', priceBs: 10 }],
    extraIds: [],
    allowsNoFries: false,
    featured: false,
  },
];

export function getProductById(productId: string): Product | undefined {
  return products.find((product) => product.id === productId);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((product) => product.categoryId === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

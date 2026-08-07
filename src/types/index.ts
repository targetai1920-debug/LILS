export type MenuCategoryId = 'hamburguesas' | 'para-compartir' | 'papas-y-extras' | 'bebidas';

export interface IngredientRef {
  id: string;
  label: string;
  removable: boolean;
}

export interface ExtraOption {
  id: string;
  label: string;
  priceBs: number;
}

export interface ProductVariant {
  id: string;
  label: string;
  priceBs: number;
}

export interface Product {
  id: string;
  slug: string;
  categoryId: MenuCategoryId;
  name: string;
  description: string;
  imagePlaceholderId: string;
  ingredients: IngredientRef[];
  variants: ProductVariant[];
  extraIds: string[];
  allowsNoFries: boolean;
  featured: boolean;
}

export interface MenuCategory {
  id: MenuCategoryId;
  name: string;
  description: string;
}

export interface Branch {
  id: string;
  name: string;
  addressLine: string;
  reference: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  coordinatesApproximate: boolean;
  openTime: string;
  closeTime: string;
  timezone: string;
}

export interface DeliveryZoneRule {
  maxDistanceKm: number;
  feeBs: number;
}

export interface DeliveryConfig {
  zones: DeliveryZoneRule[];
  outOfCoverageDistanceKm: number;
  preparationMinutesEstimate: number;
  pickupSlotIntervalMinutes: number;
}

/* ---------- Carrito ---------- */

export interface CartLineExtra {
  id: string;
  label: string;
  priceBs: number;
}

export interface CartLine {
  lineId: string;
  productId: string;
  variantId: string;
  quantity: number;
  removedIngredientIds: string[];
  extras: CartLineExtra[];
  noFries: boolean;
  notes: string;
}

export interface CartState {
  lines: CartLine[];
  /** true una vez que el carrito terminó de cargarse desde localStorage. */
  hydrated: boolean;
}

/* ---------- Pedido / checkout ---------- */

export type FulfillmentType = 'delivery' | 'pickup';

export interface DeliveryAddress {
  mainStreet: string;
  houseNumber: string;
  noHouseNumber: boolean;
  reference: string;
  crossStreet: string;
  location: { lat: number; lng: number } | null;
  phone: string;
  phoneNormalized: string;
}

export interface PickupDetails {
  branchId: string;
  personName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export type BillingType = 'con-nit' | 'sin-nit';

export interface BillingDetails {
  type: BillingType;
  nit: string;
  businessName: string;
}

export type PaymentMethod = 'qr-productos' | 'efectivo' | 'qr-total' | 'caja';

export interface OrderDraft {
  attemptId: string;
  lines: CartLine[];
  fulfillmentType: FulfillmentType | null;
  address: DeliveryAddress | null;
  pickup: PickupDetails | null;
  billing: BillingDetails | null;
  paymentMethod: PaymentMethod | null;
  deliveryFeeBs: number;
  distanceKm: number | null;
}

export interface OrderResult {
  success: boolean;
  orderId: string;
  submittedAt: string;
  /**
   * true cuando esta respuesta es la reutilización idempotente de un
   * intento anterior (misma clave de intento, mismo pedido), no una
   * creación nueva.
   */
  replayed: boolean;
}

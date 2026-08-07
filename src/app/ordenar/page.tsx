import type { Metadata } from 'next';
import { OrderFlow } from '@/components/order/OrderFlow';

export const metadata: Metadata = {
  title: 'Ordenar — LILS Burger',
  description: 'Arma tu pedido de LILS Burger paso a paso: productos, entrega, facturación y pago.',
};

export default function OrdenarPage() {
  return <OrderFlow />;
}

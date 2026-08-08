import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { DemoModeBanner } from '@/components/layout/DemoModeBanner';
import { CartBar } from '@/components/cart/CartBar';

export const metadata: Metadata = {
  title: 'LILS Burger — Smash burgers en Cochabamba',
  description:
    'Pide smash burgers LILS Burger en Cochabamba: elige, personaliza y recibe a domicilio o recoge en sucursal. Demostración comercial.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2537a0',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-BO">
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <CartProvider>
          <DemoModeBanner />
          <Nav />
          <main id="main-content" className="relative flex-1 pb-24 md:pb-0">
            {children}
          </main>
          <Footer />
          <CartBar />
        </CartProvider>
      </body>
    </html>
  );
}

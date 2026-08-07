'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { useCart } from '@/context/CartContext';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/ordenar', label: 'Ordenar' },
  { href: '/menu', label: 'Menú' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/ubicacion', label: 'Ubicación' },
  { href: '/redes', label: 'Redes sociales' },
  { href: '/contacto', label: 'Sugerencias y contacto' },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { lines } = useCart();
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b-4 border-brand-blue bg-brand-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-2" aria-label="LILS Burger, ir a inicio">
          <Logo className="h-12 w-auto" />
        </Link>

        <button
          type="button"
          className="rounded-full border-2 border-brand-blue p-2 text-brand-blue md:hidden"
          aria-expanded={open}
          aria-controls="main-nav-menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-blue text-brand-white'
                    : 'text-brand-blue hover:bg-brand-beige'
                }`}
              >
                {item.label}
                {item.href === '/ordenar' && itemCount > 0 ? (
                  <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-black px-1 text-xs text-brand-white">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {open ? (
        <nav
          id="main-nav-menu"
          aria-label="Navegación principal (móvil)"
          className="animate-slide-up border-t-2 border-brand-blue bg-brand-cream px-4 pb-4 md:hidden"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3 py-3 text-base font-semibold ${
                      isActive ? 'bg-brand-blue text-brand-white' : 'text-brand-blue'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.href === '/ordenar' && itemCount > 0 ? (
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-black px-1.5 text-xs text-brand-white">
                        {itemCount}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

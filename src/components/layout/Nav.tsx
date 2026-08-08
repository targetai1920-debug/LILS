'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { useCart } from '@/context/CartContext';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/menu', label: 'Menú' },
  { href: '/ordenar', label: 'Ordenar' },
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
    <header className="sticky top-0 z-40 px-3 py-2">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-brand-blue/10 bg-brand-cream/90 px-3 py-2 shadow-[0_12px_35px_rgba(23,37,119,0.14)] backdrop-blur-xl md:px-4">
        <Link href="/" className="group flex items-center gap-2" aria-label="LILS Burger, ir a inicio">
          <Logo className="h-12 w-12 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
          <span className="hidden sm:block">
            <span className="font-display block text-xl font-black leading-none text-brand-blue">LILS</span>
            <span className="block text-[9px] font-black uppercase tracking-[0.28em] text-brand-black/55">Burger</span>
          </span>
        </Link>

        <button
          type="button"
          className="rounded-full border-2 border-brand-blue/20 bg-brand-white p-2.5 text-brand-blue shadow-sm md:hidden"
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
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-full px-3 py-2 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-brand-blue text-brand-white shadow-md'
                    : 'text-brand-blue hover:-translate-y-0.5 hover:bg-brand-white'
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
          className="mx-auto mt-2 max-w-6xl animate-slide-up rounded-[1.75rem] border border-brand-blue/10 bg-brand-cream/95 px-4 pb-4 shadow-xl backdrop-blur md:hidden"
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
                    className={`flex items-center justify-between rounded-2xl px-3 py-3 text-base font-bold ${
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

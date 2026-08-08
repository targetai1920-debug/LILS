import { isDemoMode } from '@/data/business';

export function DemoModeBanner() {
  if (!isDemoMode()) return null;

  return (
    <div className="relative z-50 px-3 pt-2 text-center">
      <p className="mx-auto max-w-3xl rounded-full bg-brand-black px-4 py-2 text-[11px] font-semibold text-brand-white shadow-lg sm:text-xs">
        Demo LILS Burger · los pedidos y pagos todavía no se envían
      </p>
    </div>
  );
}

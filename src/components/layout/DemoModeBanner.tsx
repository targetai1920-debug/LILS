import { isDemoMode } from '@/data/business';

export function DemoModeBanner() {
  if (!isDemoMode()) return null;

  return (
    <div className="bg-brand-black px-4 py-1.5 text-center text-xs font-medium text-brand-white">
      Demostración comercial de LILS Burger — no se envían pedidos ni pagos reales.
    </div>
  );
}

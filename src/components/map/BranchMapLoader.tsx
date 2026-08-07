'use client';

import dynamic from 'next/dynamic';
import type { Branch } from '@/types';

const LeafletBranchMap = dynamic(() => import('./LeafletBranchMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-brand-beige text-sm text-brand-black/60">
      Cargando mapa…
    </div>
  ),
});

export function BranchMapLoader({ branch }: { branch: Branch }) {
  return <LeafletBranchMap branch={branch} />;
}

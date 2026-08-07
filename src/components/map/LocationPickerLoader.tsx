'use client';

import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-brand-beige text-sm text-brand-black/60">
      Cargando mapa…
    </div>
  ),
});

interface LocationPickerLoaderProps {
  center: { lat: number; lng: number };
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
}

export function LocationPickerLoader(props: LocationPickerLoaderProps) {
  return <LocationPickerMap {...props} />;
}

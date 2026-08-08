import type { Branch } from '@/types';

export function BranchMapLoader({ branch }: { branch: Branch }) {
  const query = encodeURIComponent(`LILS Burger, ${branch.addressLine}`);

  return (
    <iframe
      title={`Mapa de ${branch.name}`}
      src={`https://www.google.com/maps?q=${query}&output=embed`}
      className="h-full w-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}

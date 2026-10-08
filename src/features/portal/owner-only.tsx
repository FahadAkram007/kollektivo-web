'use client';

import { useCurrentShop } from '@/features/partner/current-shop';

/** Pages for the shop owner; cashiers who open the link see a short note instead. */
export function OwnerOnly({ children }: { children: React.ReactNode }) {
  const { isOwner } = useCurrentShop();
  if (!isOwner) {
    return <p className="text-ink-muted px-4 md:px-8">Diese Seite ist nur für Inhaber des Ladens.</p>;
  }
  return children;
}

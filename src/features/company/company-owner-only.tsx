'use client';

import { useCurrentCompany } from './current-company';

/** Pages for the company owner; other HR staff who open the link see a short note instead. */
export function CompanyOwnerOnly({ children }: { children: React.ReactNode }) {
  const { isOwner } = useCurrentCompany();
  if (!isOwner) return <p className="px-4 text-ink-muted md:px-8">Diese Seite ist nur für Inhaber der Firma.</p>;
  return children;
}

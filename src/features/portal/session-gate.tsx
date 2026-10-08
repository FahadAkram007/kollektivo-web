'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/features/auth/auth-provider';
import { employerMeQuery } from '@/features/company/company-api';
import { partnerMeQuery } from '@/features/partner/partner-api';
import type { Schemas } from '@/lib/api-client';

export interface PortalAccess {
  partner: Schemas['PartnerMeDto'];
  employer: Schemas['EmployerMeDto'];
  hasShops: boolean;
  hasCompanies: boolean;
}

const PortalAccessContext = createContext<PortalAccess | null>(null);

/** Sends signed-out visitors to /anmelden, then loads which shops and companies the person works for. */
export function SessionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { state, signOut } = useAuth();
  const enabled = state.status === 'signed-in';
  const partner = useQuery({ ...partnerMeQuery, enabled });
  const employer = useQuery({ ...employerMeQuery, enabled });

  useEffect(() => {
    if (state.status === 'signed-out') router.replace('/anmelden');
  }, [state.status, router]);

  if (!enabled || partner.isPending || employer.isPending) return <Spinner />;
  if (partner.isError || employer.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-ink-muted">Ihre Daten konnten nicht geladen werden.</p>
        <div className="flex gap-3">
          <Button onClick={() => void Promise.all([partner.refetch(), employer.refetch()])}>Erneut versuchen</Button>
          <Button variant="secondary" onClick={() => void signOut()}>
            Abmelden
          </Button>
        </div>
      </div>
    );
  }

  const access: PortalAccess = {
    partner: partner.data,
    employer: employer.data,
    hasShops: partner.data.shops.some((shop) => shop.locations.length > 0),
    hasCompanies: employer.data.companies.length > 0,
  };
  return <PortalAccessContext value={access}>{children}</PortalAccessContext>;
}

export function usePortalAccess(): PortalAccess {
  const value = useContext(PortalAccessContext);
  if (!value) throw new Error('usePortalAccess needs a <SessionGate>');
  return value;
}

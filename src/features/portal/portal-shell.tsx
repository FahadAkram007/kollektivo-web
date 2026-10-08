'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/features/auth/auth-provider';
import { CurrentShopProvider } from '@/features/partner/current-shop';
import { partnerMeQuery } from '@/features/partner/partner-api';

import { PortalNav } from './portal-nav';

/** Sends signed-out visitors to /anmelden, loads the person's shops, then shows the navigation. */
export function PortalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { state, signOut } = useAuth();
  const me = useQuery({ ...partnerMeQuery, enabled: state.status === 'signed-in' });

  useEffect(() => {
    if (state.status === 'signed-out') router.replace('/anmelden');
  }, [state.status, router]);

  if (state.status !== 'signed-in' || me.isPending) return <Spinner />;
  if (me.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-ink-muted">Ihre Shop-Daten konnten nicht geladen werden.</p>
        <div className="flex gap-3">
          <Button onClick={() => void me.refetch()}>Erneut versuchen</Button>
          <Button variant="secondary" onClick={() => void signOut()}>
            Abmelden
          </Button>
        </div>
      </div>
    );
  }

  return (
    <CurrentShopProvider me={me.data}>
      <div className="flex flex-1 flex-col md:flex-row">
        <PortalNav />
        <main className="flex flex-1 flex-col pb-20 md:pb-0">{children}</main>
      </div>
    </CurrentShopProvider>
  );
}

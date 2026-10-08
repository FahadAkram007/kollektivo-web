'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Spinner } from '@/components/ui/spinner';

/** Sends people to an area they can use, e.g. HR-only people who open /kasse go to /firma. */
export function AreaRedirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => router.replace(to), [router, to]);
  return <Spinner />;
}

/** For people with neither shop nor company (e.g. access was removed). */
export function NoAccess() {
  return (
    <p className="p-6 text-center text-ink-muted">
      Ihr Zugang ist keinem Laden und keiner Firma zugeordnet. Bitte wenden Sie sich an support@kollektivo.de.
    </p>
  );
}

import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'QR-Code' };

// TODO(portal): built in the next steps of the shop portal plan.
export default function Page() {
  return (
    <>
      <PageHeader title="QR-Code" />
      <p className="text-ink-muted px-4 md:px-8">Folgt in Kürze.</p>
    </>
  );
}

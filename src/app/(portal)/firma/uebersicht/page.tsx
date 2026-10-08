import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'Übersicht' };

// TODO(hr-panel): built in the next steps of the HR panel plan.
export default function Page() {
  return (
    <>
      <PageHeader title="Übersicht" />
      <p className="px-4 text-ink-muted md:px-8">Folgt in Kürze.</p>
    </>
  );
}

import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { TillScreen } from '@/features/till/till-screen';

export const metadata: Metadata = { title: 'Kasse' };

export default function TillPage() {
  return (
    <>
      <PageHeader title="Kasse" />
      <TillScreen />
    </>
  );
}

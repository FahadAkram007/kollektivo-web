import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { MonthsScreen } from '@/features/months/months-screen';

export const metadata: Metadata = { title: 'Übersicht' };

export default function OverviewPage() {
  return (
    <>
      <PageHeader title="Übersicht" />
      <MonthsScreen />
    </>
  );
}

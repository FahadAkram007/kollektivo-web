import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { PaymentsScreen } from '@/features/payments/payments-screen';

export const metadata: Metadata = { title: 'Zahlungen' };

export default function PaymentsPage() {
  return (
    <>
      <PageHeader title="Zahlungen" />
      <PaymentsScreen />
    </>
  );
}

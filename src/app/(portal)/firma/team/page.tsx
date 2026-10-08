import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { HrTeamScreen } from '@/features/company/hr-team-screen';

export const metadata: Metadata = { title: 'HR-Team' };

export default function HrTeamPage() {
  return (
    <>
      <PageHeader title="HR-Team" />
      <HrTeamScreen />
    </>
  );
}

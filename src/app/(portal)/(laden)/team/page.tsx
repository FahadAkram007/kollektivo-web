import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { TeamScreen } from '@/features/team/team-screen';

export const metadata: Metadata = { title: 'Team' };

export default function TeamPage() {
  return (
    <>
      <PageHeader title="Team" />
      <TeamScreen />
    </>
  );
}

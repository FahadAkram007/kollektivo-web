import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { ShopTeamScreen } from '@/features/partner/shop-team-screen';

export const metadata: Metadata = { title: 'Team' };

export default function TeamPage() {
  return (
    <>
      <PageHeader title="Team" />
      <ShopTeamScreen />
    </>
  );
}

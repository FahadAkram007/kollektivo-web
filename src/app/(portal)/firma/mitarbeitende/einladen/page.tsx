import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { InviteScreen } from '@/features/employees/invite-screen';

export const metadata: Metadata = { title: 'Mitarbeitende einladen' };

export default function InvitePage() {
  return (
    <>
      <PageHeader title="Mitarbeitende einladen" />
      <InviteScreen />
    </>
  );
}

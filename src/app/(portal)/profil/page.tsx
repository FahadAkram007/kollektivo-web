import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { ProfileScreen } from '@/features/profile/profile-screen';

export const metadata: Metadata = { title: 'Profil' };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profil" />
      <ProfileScreen />
    </>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';

import { Spinner } from '@/components/ui/spinner';
import { useCurrentShop } from '@/features/partner/current-shop';
import { OwnerOnly } from '@/features/portal/owner-only';

import { AboutSection } from './about-section';
import { DealSection } from './deal-section';
import { LocationSection } from './location-section';
import { PhotoSection } from './photo-section';
import { profileQuery } from './profile-api';

/** "Profil": what employees see about the shop in the app. */
export function ProfileScreen() {
  return (
    <OwnerOnly>
      <ProfileSections />
    </OwnerOnly>
  );
}

function ProfileSections() {
  const { shop, location } = useCurrentShop();
  const profile = useQuery(profileQuery(shop.partnerId));

  if (profile.isPending) return <Spinner />;
  if (profile.isError) return <p className="text-ink-muted px-4 md:px-8">Das Profil konnte nicht geladen werden.</p>;

  const branch = profile.data.locations.find((candidate) => candidate.id === location.id);
  return (
    <div className="grid gap-5 px-4 pb-8 md:px-8 xl:grid-cols-2">
      <div className="flex flex-col gap-5">
        <PhotoSection profile={profile.data} />
        <AboutSection key={`about-${profile.data.partnerId}`} profile={profile.data} />
        <DealSection profile={profile.data} />
      </div>
      {branch && <LocationSection key={branch.id} partnerId={shop.partnerId} location={branch} />}
    </div>
  );
}

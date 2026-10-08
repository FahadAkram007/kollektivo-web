'use client';

import { useQuery } from '@tanstack/react-query';

import { Spinner } from '@/components/ui/spinner';
import { useCurrentShop } from '@/features/partner/current-shop';
import { OwnerOnly } from '@/features/portal/owner-only';

import { InviteForm } from './invite-form';
import { MemberList } from './member-list';
import { teamQuery } from './team-api';

/** "Team": who can use the portal for this shop. */
export function TeamScreen() {
  return (
    <OwnerOnly>
      <TeamSections />
    </OwnerOnly>
  );
}

function TeamSections() {
  const { shop } = useCurrentShop();
  const team = useQuery(teamQuery(shop.partnerId));

  if (team.isPending) return <Spinner />;
  if (team.isError) return <p className="px-4 text-ink-muted md:px-8">Das Team konnte nicht geladen werden.</p>;
  return (
    <div className="grid gap-5 px-4 pb-8 md:px-8 xl:grid-cols-2">
      <MemberList partnerId={shop.partnerId} members={team.data} />
      <InviteForm partnerId={shop.partnerId} />
    </div>
  );
}

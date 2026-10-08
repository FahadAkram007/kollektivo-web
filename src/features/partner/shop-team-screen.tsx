'use client';

import { OwnerOnly } from '@/features/portal/owner-only';
import { TeamView } from '@/features/team/team-view';
import type { TeamConfig } from '@/features/team/team-config';
import { api, unwrap } from '@/lib/api-client';

import { useCurrentShop } from './current-shop';

/** "Team": who can use the portal for this shop. */
export function ShopTeamScreen() {
  return (
    <OwnerOnly>
      <ShopTeam />
    </OwnerOnly>
  );
}

function ShopTeam() {
  const { shop } = useCurrentShop();
  return <TeamView config={shopTeamConfig(shop.partnerId)} />;
}

function shopTeamConfig(partnerId: string): TeamConfig {
  const path = { params: { path: { partnerId } } };
  return {
    queryKey: ['team', 'shop', partnerId],
    list: async () => unwrap(await api.GET('/v1/partner/shops/{partnerId}/members', path)),
    add: async (member) =>
      unwrap(
        await api.POST('/v1/partner/shops/{partnerId}/members', {
          ...path,
          body: { ...member, role: member.role as 'owner' | 'staff' },
        }),
      ),
    remove: async (userId) =>
      unwrap(
        await api.DELETE('/v1/partner/shops/{partnerId}/members/{userId}', {
          params: { path: { partnerId, userId } },
        }),
      ),
    roles: [
      { value: 'staff', label: 'Kasse', description: 'Zahlungen an der Kasse und die Zahlungsliste.' },
      { value: 'owner', label: 'Inhaber/in', description: 'Alles, auch Export, Profil, Team und QR-Code.' },
    ],
    listDescription: 'Entfernte Personen verlieren den Zugang sofort.',
    lastOwnerText: 'Der Laden braucht mindestens eine/n Inhaber/in.',
  };
}

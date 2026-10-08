import { queryOptions } from '@tanstack/react-query';

import { api, unwrap, type Schemas } from '@/lib/api-client';

export type TeamMember = Schemas['TeamMemberDto'];
export type NewMember = Schemas['AddTeamMemberDto'];

export const teamQuery = (partnerId: string) =>
  queryOptions({
    queryKey: ['team', partnerId],
    queryFn: async () =>
      unwrap(await api.GET('/v1/partner/shops/{partnerId}/members', { params: { path: { partnerId } } })),
  });

/** Adds the person and emails them the portal link. */
export async function addMember(partnerId: string, member: NewMember): Promise<void> {
  unwrap(await api.POST('/v1/partner/shops/{partnerId}/members', { params: { path: { partnerId } }, body: member }));
}

export async function removeMember(partnerId: string, userId: string): Promise<void> {
  unwrap(
    await api.DELETE('/v1/partner/shops/{partnerId}/members/{userId}', { params: { path: { partnerId, userId } } }),
  );
}

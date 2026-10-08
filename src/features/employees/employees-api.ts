import { queryOptions } from '@tanstack/react-query';

import { api, unwrap, type Schemas } from '@/lib/api-client';

export type EmployeeRow = Schemas['EmployeeRowDto'];
export type InvitePerson = Schemas['InviteEmployeeDto'];
export type BulkInviteResult = Schemas['BulkInviteResultDto'];

const path = (employerId: string) => ({ params: { path: { employerId } } });

export const employeesQuery = (employerId: string) =>
  queryOptions({
    queryKey: ['employees', employerId],
    queryFn: async () => unwrap(await api.GET('/v1/employer/companies/{employerId}/employees', path(employerId))),
  });

export async function invitePerson(employerId: string, person: InvitePerson): Promise<void> {
  unwrap(await api.POST('/v1/employer/companies/{employerId}/invites', { ...path(employerId), body: person }));
}

/** The API takes up to 200 people per request; larger lists are sent in parts. */
export async function inviteMany(employerId: string, people: InvitePerson[]): Promise<BulkInviteResult[]> {
  const results: BulkInviteResult[] = [];
  for (let start = 0; start < people.length; start += 200) {
    const part = people.slice(start, start + 200);
    results.push(
      ...unwrap(
        await api.POST('/v1/employer/companies/{employerId}/invites/bulk', {
          ...path(employerId),
          body: { people: part },
        }),
      ),
    );
  }
  return results;
}

export async function resendInvite(employerId: string, inviteId: string): Promise<void> {
  unwrap(
    await api.POST('/v1/employer/companies/{employerId}/invites/{inviteId}/resend', {
      params: { path: { employerId, inviteId } },
    }),
  );
}

export async function cancelInvite(employerId: string, inviteId: string): Promise<void> {
  unwrap(
    await api.DELETE('/v1/employer/companies/{employerId}/invites/{inviteId}', {
      params: { path: { employerId, inviteId } },
    }),
  );
}

'use client';

import { TeamView } from '@/features/team/team-view';
import type { TeamConfig } from '@/features/team/team-config';
import { api, unwrap } from '@/lib/api-client';

import { CompanyOwnerOnly } from './company-owner-only';
import { useCurrentCompany } from './current-company';

/** "HR-Team": who can use the HR panel for this company. */
export function HrTeamScreen() {
  return (
    <CompanyOwnerOnly>
      <HrTeam />
    </CompanyOwnerOnly>
  );
}

function HrTeam() {
  const { company } = useCurrentCompany();
  return <TeamView config={hrTeamConfig(company.employerId)} />;
}

function hrTeamConfig(employerId: string): TeamConfig {
  const path = { params: { path: { employerId } } };
  return {
    queryKey: ['team', 'company', employerId],
    list: async () => unwrap(await api.GET('/v1/employer/companies/{employerId}/members', path)),
    add: async (member) =>
      unwrap(
        await api.POST('/v1/employer/companies/{employerId}/members', {
          ...path,
          body: { ...member, role: member.role as 'owner' | 'hr' },
        }),
      ),
    remove: async (userId) =>
      unwrap(
        await api.DELETE('/v1/employer/companies/{employerId}/members/{userId}', {
          params: { path: { employerId, userId } },
        }),
      ),
    roles: [
      { value: 'hr', label: 'HR', description: 'Mitarbeitende einladen und verwalten, Übersicht und Lohn-Export.' },
      { value: 'owner', label: 'Inhaber/in', description: 'Alles, auch das HR-Team verwalten.' },
    ],
    listDescription: 'Wer Zugang zum Firmenportal hat. Entfernte Personen verlieren den Zugang sofort.',
    lastOwnerText: 'Die Firma braucht mindestens eine/n Inhaber/in.',
  };
}

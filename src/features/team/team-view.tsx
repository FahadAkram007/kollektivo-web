'use client';

import { useQuery } from '@tanstack/react-query';

import { Spinner } from '@/components/ui/spinner';

import { InviteForm } from './invite-form';
import { MemberList } from './member-list';
import type { TeamConfig } from './team-config';

/** Members on the left, invite form on the right (stacked on smaller screens). */
export function TeamView({ config }: { config: TeamConfig }) {
  const team = useQuery({ queryKey: config.queryKey, queryFn: config.list });

  if (team.isPending) return <Spinner />;
  if (team.isError) return <p className="px-4 text-ink-muted md:px-8">Das Team konnte nicht geladen werden.</p>;
  return (
    <div className="grid gap-5 px-4 pb-8 md:px-8 xl:grid-cols-2">
      <MemberList config={config} members={team.data} />
      <InviteForm key={String(config.queryKey)} config={config} />
    </div>
  );
}

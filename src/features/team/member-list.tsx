'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { ApiError } from '@/lib/api-client';

import { roleLabel, type TeamConfig, type TeamMember } from './team-config';

export function MemberList({ config, members }: { config: TeamConfig; members: TeamMember[] }) {
  return (
    <SectionCard title="Team" description={config.listDescription}>
      <ul className="flex flex-col divide-y divide-line">
        {members.map((member) => (
          <MemberRow key={member.userId} config={config} member={member} />
        ))}
      </ul>
    </SectionCard>
  );
}

function MemberRow({ config, member }: { config: TeamConfig; member: TeamMember }) {
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = `${member.firstName} ${member.lastName}`.trim() || member.email;

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await config.remove(member.userId);
      await queryClient.invalidateQueries({ queryKey: config.queryKey });
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.code === 'last_owner'
          ? config.lastOwnerText
          : 'Entfernen fehlgeschlagen. Bitte erneut versuchen.',
      );
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="font-medium">
          {name} {member.isYou && <span className="text-sm font-normal text-ink-muted">(Sie)</span>}
        </p>
        <p className="truncate text-sm text-ink-muted">{member.email}</p>
        <p className="mt-1 flex gap-2 text-xs">
          <span className="rounded-full bg-surface px-2 py-0.5">{roleLabel(config, member.role)}</span>
          <span
            className={`rounded-full px-2 py-0.5 ${member.hasSignedIn ? 'bg-green-50 text-success' : 'bg-amber-50'}`}
          >
            {member.hasSignedIn ? 'Aktiv' : 'Eingeladen'}
          </span>
        </p>
        {error && (
          <p role="alert" className="mt-1 text-sm text-error">
            {error}
          </p>
        )}
      </div>
      {!member.isYou &&
        (confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">Wirklich entfernen?</span>
            <Button variant="danger" disabled={busy} onClick={() => void remove()}>
              Ja
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => setConfirming(false)}>
              Nein
            </Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setConfirming(true)}>
            Entfernen
          </Button>
        ))}
    </li>
  );
}

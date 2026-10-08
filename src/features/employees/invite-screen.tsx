'use client';

import Link from 'next/link';
import { useState } from 'react';

import { SectionCard } from '@/components/ui/section-card';
import { useCurrentCompany } from '@/features/company/current-company';

import { ListInvite } from './list-invite';
import { SingleInviteForm } from './single-invite-form';

/** Invite one person, or a whole list from Excel. */
export function InviteScreen() {
  const { company } = useCurrentCompany();
  const [mode, setMode] = useState<'single' | 'list'>('single');

  return (
    <div className="flex flex-col gap-4 px-4 pb-8 md:px-8">
      <Link href="/firma/mitarbeitende" className="text-sm text-brand-purple hover:underline">
        ← Zurück zu Mitarbeitende
      </Link>
      <div role="tablist" className="flex gap-2">
        {(
          [
            ['single', 'Eine Person'],
            ['list', 'Liste aus Excel'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={`min-h-10 rounded-full border px-4 text-sm ${
              mode === key ? 'border-brand-purple bg-brand-purple text-white' : 'border-line bg-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <SectionCard
        title={mode === 'single' ? 'Eine Person einladen' : 'Mehrere Personen einladen'}
        description="Eingeladene bekommen eine E-Mail mit einem Code für die KollektivO-App (14 Tage gültig). Das Guthaben gibt es ab der Anmeldung."
      >
        {mode === 'single' ? (
          <SingleInviteForm employerId={company.employerId} />
        ) : (
          <ListInvite employerId={company.employerId} />
        )}
      </SectionCard>
    </div>
  );
}

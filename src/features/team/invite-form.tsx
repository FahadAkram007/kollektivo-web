'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { TextField } from '@/components/ui/text-field';
import { ApiError } from '@/lib/api-client';

import { addMember, teamQuery, type NewMember } from './team-api';

const EMPTY: NewMember = { email: '', firstName: '', lastName: '', role: 'staff' };

export function InviteForm({ partnerId }: { partnerId: string }) {
  const queryClient = useQueryClient();
  const [member, setMember] = useState<NewMember>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const field = (key: 'email' | 'firstName' | 'lastName') => ({
    value: member[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setMember({ ...member, [key]: event.target.value });
      setResult(null);
    },
  });

  async function submit() {
    setBusy(true);
    setResult(null);
    try {
      await addMember(partnerId, { ...member, email: member.email.trim() });
      await queryClient.invalidateQueries({ queryKey: teamQuery(partnerId).queryKey });
      setResult({ ok: true, text: `Einladung an ${member.email.trim()} gesendet.` });
      setMember(EMPTY);
    } catch (error) {
      setResult({ ok: false, text: inviteError(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <SectionCard
      title="Person einladen"
      description="Sie bekommt eine E-Mail mit dem Link zum Portal und meldet sich mit ihrer E-Mail-Adresse an."
    >
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <TextField label="Vorname" required maxLength={60} autoComplete="off" {...field('firstName')} />
        <TextField label="Nachname" required maxLength={60} autoComplete="off" {...field('lastName')} />
        <div className="sm:col-span-2">
          <TextField label="E-Mail-Adresse" type="email" required autoComplete="off" {...field('email')} />
        </div>
        <fieldset className="flex flex-col gap-2 sm:col-span-2">
          <legend className="mb-1 text-sm font-medium">Rolle</legend>
          <RoleOption
            checked={member.role === 'staff'}
            onSelect={() => setMember({ ...member, role: 'staff' })}
            title="Kasse"
            text="Zahlungen an der Kasse und die Zahlungsliste."
          />
          <RoleOption
            checked={member.role === 'owner'}
            onSelect={() => setMember({ ...member, role: 'owner' })}
            title="Inhaber/in"
            text="Alles, auch Export, Profil, Team und QR-Code."
          />
        </fieldset>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <Button type="submit" disabled={busy}>
            Einladen
          </Button>
          {result && (
            <p role={result.ok ? 'status' : 'alert'} className={`text-sm ${result.ok ? 'text-success' : 'text-error'}`}>
              {result.text}
            </p>
          )}
        </div>
      </form>
    </SectionCard>
  );
}

function RoleOption({
  checked,
  onSelect,
  title,
  text,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  text: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${checked ? 'border-brand-purple bg-surface' : 'border-line'}`}
    >
      <input type="radio" name="role" checked={checked} onChange={onSelect} className="mt-1 accent-brand-purple" />
      <span>
        <span className="block font-medium">{title}</span>
        <span className="text-sm text-ink-muted">{text}</span>
      </span>
    </label>
  );
}

function inviteError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Keine Verbindung. Bitte erneut versuchen.';
  if (error.code === 'already_member') return 'Diese Person ist bereits im Team.';
  if (error.code === 'validation_failed') return 'Bitte Name und eine gültige E-Mail-Adresse angeben.';
  return 'Die Einladung ist fehlgeschlagen. Bitte erneut versuchen.';
}

'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { ApiError } from '@/lib/api-client';

import { employeesQuery, invitePerson } from './employees-api';
import { MAX_MONTHLY_CENTS, parseAmount } from './people-table';

const EMPTY = { firstName: '', lastName: '', email: '', personnelNumber: '', amount: '50' };

export function SingleInviteForm({ employerId }: { employerId: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const field = (key: keyof typeof EMPTY) => ({
    value: form[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [key]: event.target.value });
      setResult(null);
    },
  });

  async function submit() {
    const monthlyAmountCents = parseAmount(form.amount);
    if (monthlyAmountCents === null) {
      setResult({ ok: false, text: `Der Monatsbetrag muss zwischen 0 und ${MAX_MONTHLY_CENTS / 100} € liegen.` });
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      await invitePerson(employerId, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        personnelNumber: form.personnelNumber.trim() || undefined,
        monthlyAmountCents,
      });
      await queryClient.invalidateQueries({ queryKey: employeesQuery(employerId).queryKey });
      setResult({ ok: true, text: `Einladung an ${form.email.trim()} gesendet.` });
      setForm(EMPTY);
    } catch (error) {
      setResult({ ok: false, text: inviteError(error) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="grid max-w-2xl gap-4 sm:grid-cols-2"
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
      <TextField label="Personalnummer (optional)" maxLength={30} autoComplete="off" {...field('personnelNumber')} />
      <TextField label="Monatsbetrag in € (max. 50)" inputMode="decimal" required {...field('amount')} />
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
  );
}

function inviteError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Keine Verbindung. Bitte erneut versuchen.';
  switch (error.code) {
    case 'already_member':
      return 'Diese Person nutzt KollektivO bereits in Ihrer Firma.';
    case 'already_invited':
      return 'Diese Person ist bereits eingeladen. In der Liste können Sie den Code erneut senden.';
    case 'validation_failed':
      return 'Bitte Name und eine gültige E-Mail-Adresse angeben.';
    default:
      return 'Die Einladung ist fehlgeschlagen. Bitte erneut versuchen.';
  }
}

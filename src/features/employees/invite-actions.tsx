'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { cancelInvite, employeesQuery, resendInvite, type EmployeeRow } from './employees-api';

/** For invites not yet accepted: send a new code, or withdraw the invite. */
export function InviteActions({ employerId, row }: { employerId: string; row: EmployeeRow }) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function run(action: () => Promise<void>, done: string) {
    setBusy(true);
    setNote(null);
    try {
      await action();
      setNote(done);
      await queryClient.invalidateQueries({ queryKey: employeesQuery(employerId).queryKey });
    } catch {
      setNote('Fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
      {note && <span className="text-ink-muted">{note}</span>}
      {confirming ? (
        <>
          <span>Einladung zurückziehen?</span>
          <button
            className="font-medium text-error hover:underline"
            disabled={busy}
            onClick={() => void run(() => cancelInvite(employerId, row.id), 'Zurückgezogen')}
          >
            Ja
          </button>
          <button className="text-ink-muted hover:underline" onClick={() => setConfirming(false)}>
            Nein
          </button>
        </>
      ) : (
        <>
          <button
            className="font-medium text-brand-purple hover:underline disabled:opacity-50"
            disabled={busy}
            onClick={() => void run(() => resendInvite(employerId, row.id), 'Neuer Code gesendet')}
          >
            Erneut senden
          </button>
          <button className="text-ink-muted hover:underline" disabled={busy} onClick={() => setConfirming(true)}>
            Zurückziehen
          </button>
        </>
      )}
    </div>
  );
}

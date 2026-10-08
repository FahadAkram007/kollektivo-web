'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { TextField } from '@/components/ui/text-field';
import { berlinToday, formatDay } from '@/lib/berlin-date';

import { EmployeeStatus } from './employee-status';
import {
  blockEmployee,
  cancelLeaving,
  employeesQuery,
  setLeaving,
  unblockEmployee,
  updateEmployee,
  type EmployeeRow,
} from './employees-api';
import { MAX_MONTHLY_CENTS, parseAmount } from './people-table';

type Feedback = { ok: boolean; text: string } | null;

/** Everything HR can change for one employee. */
export function EmployeeDialog({
  employerId,
  row,
  onClose,
}: {
  employerId: string;
  row: EmployeeRow;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  async function run(action: () => Promise<void>, done: string) {
    setBusy(true);
    setFeedback(null);
    try {
      await action();
      await queryClient.invalidateQueries({ queryKey: employeesQuery(employerId).queryKey });
      setFeedback({ ok: true, text: done });
    } catch {
      setFeedback({ ok: false, text: 'Das hat nicht geklappt. Bitte erneut versuchen.' });
    } finally {
      setBusy(false);
    }
  }

  const props = { employerId, row, busy, run };
  return (
    <Modal title={`${row.firstName} ${row.lastName}`} onClose={onClose}>
      <div className="flex flex-col gap-1 text-sm">
        <p className="text-ink-muted">{row.email}</p>
        <div className="flex items-center gap-2">
          <EmployeeStatus status={row.status} />
          {row.startedOn && <span className="text-ink-muted">dabei seit {formatDay(row.startedOn)}</span>}
        </div>
      </div>
      {feedback && (
        <p role={feedback.ok ? 'status' : 'alert'} className={`text-sm ${feedback.ok ? 'text-success' : 'text-error'}`}>
          {feedback.ok ? '✓ ' : ''}
          {feedback.text}
        </p>
      )}
      {row.status === 'ended' ? (
        <p className="rounded-xl bg-surface p-4 text-sm">
          Ausgeschieden{row.benefitEndsOn ? ` zum ${formatDay(row.benefitEndsOn)}` : ''}. Um die Person wieder
          aufzunehmen, laden Sie sie unter „Einladen“ neu ein.
        </p>
      ) : (
        <>
          <AmountSection key={`${row.monthlyAmountCents}-${row.personnelNumber}`} {...props} />
          <LeavingSection {...props} />
          <BlockSection {...props} />
        </>
      )}
    </Modal>
  );
}

interface SectionProps {
  employerId: string;
  row: EmployeeRow;
  busy: boolean;
  run: (action: () => Promise<void>, done: string) => Promise<void>;
}

function AmountSection({ employerId, row, busy, run }: SectionProps) {
  const [amount, setAmount] = useState(String(row.monthlyAmountCents / 100).replace('.', ','));
  const [personnelNumber, setPersonnelNumber] = useState(row.personnelNumber ?? '');
  const [problem, setProblem] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const monthlyAmountCents = parseAmount(amount);
        if (monthlyAmountCents === null) {
          setProblem(`Der Monatsbetrag muss zwischen 0 und ${MAX_MONTHLY_CENTS / 100} € liegen.`);
          return;
        }
        setProblem(null);
        void run(
          () => updateEmployee(employerId, row.id, { monthlyAmountCents, personnelNumber }),
          'Gespeichert. Ein neuer Betrag gilt ab der nächsten Gutschrift.',
        );
      }}
    >
      <h3 className="font-bold">Monatsbetrag & Personalnummer</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="Monatsbetrag in € (max. 50)"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          label="Personalnummer"
          maxLength={30}
          value={personnelNumber}
          onChange={(e) => setPersonnelNumber(e.target.value)}
        />
      </div>
      <p className="text-xs text-ink-muted">
        Ein neuer Betrag gilt ab dem nächsten Monat; dieser Monat ist schon gutgeschrieben.
      </p>
      {problem && <p className="text-sm text-error">{problem}</p>}
      <Button type="submit" variant="secondary" className="self-start" disabled={busy}>
        Speichern
      </Button>
    </form>
  );
}

function LeavingSection({ employerId, row, busy, run }: SectionProps) {
  const [lastDay, setLastDay] = useState('');

  if (row.status === 'leaving' && row.benefitEndsOn) {
    return (
      <section className="flex flex-col gap-3">
        <h3 className="font-bold">Austritt</h3>
        <p className="text-sm">
          Letzter Tag: <strong>{formatDay(row.benefitEndsOn)}</strong>. Bis dahin kann das Guthaben genutzt werden,
          danach gibt es keine Gutschriften mehr.
        </p>
        <Button
          variant="secondary"
          className="self-start"
          disabled={busy}
          onClick={() => void run(() => cancelLeaving(employerId, row.id), 'Austritt zurückgenommen.')}
        >
          Austritt zurücknehmen
        </Button>
      </section>
    );
  }
  if (row.status !== 'active') return null;

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        void run(() => setLeaving(employerId, row.id, lastDay), 'Austritt festgelegt.');
      }}
    >
      <h3 className="font-bold">Austritt</h3>
      <p className="text-sm text-ink-muted">
        Bis zum letzten Tag kann das Guthaben genutzt werden. Danach gibt es keine Gutschriften mehr; was übrig ist,
        geht am Monatsende an Ihre Firma zurück.
      </p>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Letzter Arbeitstag
        <input
          type="date"
          required
          value={lastDay}
          onChange={(event) => setLastDay(event.target.value)}
          className="min-h-12 max-w-xs rounded-xl border border-line px-4 font-normal"
        />
      </label>
      {lastDay && lastDay < berlinToday() && (
        <p className="text-sm text-error">
          Dieser Tag liegt in der Vergangenheit: das Guthaben ist dann sofort gesperrt.
        </p>
      )}
      <Button type="submit" variant="secondary" className="self-start" disabled={busy || !lastDay}>
        Austritt festlegen
      </Button>
    </form>
  );
}

function BlockSection({ employerId, row, busy, run }: SectionProps) {
  const [confirming, setConfirming] = useState(false);

  if (row.status === 'blocked') {
    return (
      <section className="flex flex-col gap-3">
        <h3 className="font-bold">Gesperrt</h3>
        <p className="text-sm">Die Person kann nicht bezahlen und bekommt keine Gutschriften.</p>
        <Button
          variant="secondary"
          className="self-start"
          disabled={busy}
          onClick={() => void run(() => unblockEmployee(employerId, row.id), 'Entsperrt.')}
        >
          Entsperren
        </Button>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 border-t border-line pt-5">
      <h3 className="font-bold">Sperren</h3>
      <p className="text-sm text-ink-muted">
        Zum Beispiel bei Verdacht auf Missbrauch oder langer Abwesenheit: keine Zahlungen und keine Gutschriften, bis
        Sie entsperren.
      </p>
      {confirming ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm">Wirklich sperren?</span>
          <Button
            variant="danger"
            disabled={busy}
            onClick={() =>
              void run(() => blockEmployee(employerId, row.id), 'Gesperrt.').then(() => setConfirming(false))
            }
          >
            Ja, sperren
          </Button>
          <Button variant="secondary" onClick={() => setConfirming(false)}>
            Abbrechen
          </Button>
        </div>
      ) : (
        <Button variant="danger" className="self-start" onClick={() => setConfirming(true)}>
          Sperren
        </Button>
      )}
    </section>
  );
}

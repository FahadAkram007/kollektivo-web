'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { formatCents } from '@/lib/format';

import { employeesQuery, inviteMany, type BulkInviteResult } from './employees-api';
import { decodeCsvFile, parsePeopleTable, TEMPLATE_CSV, type ParsedPerson } from './people-table';

const RESULT_LABELS: Record<BulkInviteResult['result'], string> = {
  invited: 'Eingeladen',
  already_member: 'Nutzt KollektivO bereits',
  already_invited: 'War schon eingeladen',
  failed: 'Fehlgeschlagen',
};

/** Many people at once: a CSV file from Excel, or cells copied out of Excel. Preview first, then invite. */
export function ListInvite({ employerId }: { employerId: string }) {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [people, setPeople] = useState<ParsedPerson[] | null>(null);
  const [pasted, setPasted] = useState('');
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<BulkInviteResult[] | null>(null);
  const [failed, setFailed] = useState(false);

  const valid = people?.filter((person) => person.problems.length === 0) ?? [];
  const invalid = (people?.length ?? 0) - valid.length;

  async function readFile(file: File) {
    setResults(null);
    setPeople(parsePeopleTable(decodeCsvFile(await file.arrayBuffer())));
  }

  async function send() {
    setBusy(true);
    setFailed(false);
    try {
      const answer = await inviteMany(
        employerId,
        valid.map(({ firstName, lastName, email, personnelNumber, monthlyAmountCents }) => ({
          firstName,
          lastName,
          email,
          personnelNumber,
          monthlyAmountCents,
        })),
      );
      setResults(answer);
      setPeople(null);
      setPasted('');
      await queryClient.invalidateQueries({ queryKey: employeesQuery(employerId).queryKey });
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  if (results) return <Results results={results} onAgain={() => setResults(null)} />;

  return (
    <div className="flex flex-col gap-5">
      <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-muted">
        <li>
          <button className="text-brand-purple underline" onClick={downloadTemplate}>
            Vorlage herunterladen
          </button>{' '}
          und in Excel ausfüllen: Vorname, Nachname, E-Mail, Personalnummer (optional), Betrag (leer = 50 €).
        </li>
        <li>
          In Excel „Speichern unter“ → „CSV (Trennzeichen-getrennt)“ und hier hochladen – oder die Zellen kopieren und
          unten einfügen.
        </li>
        <li>Vorschau prüfen und einladen. Jede Person bekommt eine E-Mail mit ihrem Code.</li>
      </ol>

      <div className="flex flex-wrap gap-3">
        <input
          ref={fileInput}
          type="file"
          accept=".csv,.txt,text/csv"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) void readFile(file);
          }}
        />
        <Button variant="secondary" onClick={() => fileInput.current?.click()}>
          CSV-Datei wählen
        </Button>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Oder aus Excel einfügen
        <textarea
          rows={5}
          value={pasted}
          placeholder={'Max\tMustermann\tmax.mustermann@firma.de\t10427\t50'}
          onChange={(event) => {
            setPasted(event.target.value);
            setResults(null);
            setPeople(event.target.value.trim() ? parsePeopleTable(event.target.value) : null);
          }}
          className="rounded-xl border border-line p-3 font-mono text-sm font-normal outline-none focus:border-brand-purple"
        />
      </label>

      {people && (
        <Preview people={people}>
          <div className="flex flex-wrap items-center gap-4">
            <Button disabled={busy || valid.length === 0} onClick={() => void send()}>
              {busy ? 'Wird eingeladen …' : `${valid.length} ${valid.length === 1 ? 'Person' : 'Personen'} einladen`}
            </Button>
            {invalid > 0 && (
              <p className="text-sm text-error">
                {invalid} {invalid === 1 ? 'Zeile wird' : 'Zeilen werden'} übersprungen – bitte in der Datei
                korrigieren.
              </p>
            )}
            {failed && (
              <p role="alert" className="text-sm text-error">
                Die Einladungen konnten nicht gesendet werden. Bitte erneut versuchen.
              </p>
            )}
          </div>
        </Preview>
      )}
    </div>
  );
}

function Preview({ people, children }: { people: ParsedPerson[]; children: React.ReactNode }) {
  if (people.length === 0) return <p className="text-sm text-error">In der Liste wurden keine Personen gefunden.</p>;
  return (
    <div className="flex flex-col gap-4">
      <div className="max-h-[420px] overflow-auto rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-surface text-left text-ink-muted">
            <tr>
              <th className="p-2 font-medium">Zeile</th>
              <th className="p-2 font-medium">Name</th>
              <th className="p-2 font-medium">E-Mail</th>
              <th className="p-2 font-medium">Pers.-Nr.</th>
              <th className="p-2 text-right font-medium">Betrag</th>
              <th className="p-2 font-medium">Prüfung</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.line} className={`border-t border-line ${person.problems.length ? 'bg-red-50' : ''}`}>
                <td className="p-2 text-ink-muted tabular-nums">{person.line}</td>
                <td className="p-2">
                  {person.lastName}, {person.firstName}
                </td>
                <td className="p-2">{person.email}</td>
                <td className="p-2 tabular-nums">{person.personnelNumber ?? '–'}</td>
                <td className="p-2 text-right tabular-nums">{formatCents(person.monthlyAmountCents)}</td>
                <td className="p-2">
                  {person.problems.length ? (
                    <span className="text-error">{person.problems.join(', ')}</span>
                  ) : (
                    <span className="text-success">✓</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {children}
    </div>
  );
}

function Results({ results, onAgain }: { results: BulkInviteResult[]; onAgain: () => void }) {
  const invited = results.filter((result) => result.result === 'invited').length;
  const others = results.filter((result) => result.result !== 'invited');
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-bold text-success">
        ✓ {invited} {invited === 1 ? 'Einladung' : 'Einladungen'} gesendet
      </p>
      {others.length > 0 && (
        <ul className="rounded-xl bg-surface p-4 text-sm">
          {others.map((result) => (
            <li key={result.email}>
              {result.email}: <strong>{RESULT_LABELS[result.result]}</strong>
            </li>
          ))}
        </ul>
      )}
      <Button variant="secondary" className="self-start" onClick={onAgain}>
        Weitere Liste einladen
      </Button>
    </div>
  );
}

function downloadTemplate() {
  const url = URL.createObjectURL(new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'kollektivo-mitarbeitende-vorlage.csv';
  link.click();
  URL.revokeObjectURL(url);
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentCompany } from '@/features/company/current-company';
import { formatDay } from '@/lib/berlin-date';
import { formatCents } from '@/lib/format';

import { monthLabel } from './month-label';
import { MonthTotals } from './month-totals';
import { downloadPayrollCsv, monthDetailQuery, monthsQuery } from './months-api';

/** "Übersicht": per month, what was credited and how it was used, plus the payroll export. */
export function MonthsScreen() {
  // Switching the company starts again at its newest month.
  const { company } = useCurrentCompany();
  return <MonthsOfCompany key={company.employerId} />;
}

function MonthsOfCompany() {
  const { company } = useCurrentCompany();
  const months = useQuery(monthsQuery(company.employerId));
  const [chosen, setChosen] = useState<string | null>(null);

  if (months.isPending) return <Spinner />;
  if (months.isError) {
    return <p className="px-4 text-ink-muted md:px-8">Die Übersicht konnte nicht geladen werden.</p>;
  }
  if (months.data.length === 0) {
    return (
      <p className="mx-4 rounded-2xl bg-surface p-8 text-center text-ink-muted md:mx-8">
        Noch keine Gutschriften. Sobald eingeladene Mitarbeitende sich in der App anmelden, erscheint hier der Monat.
      </p>
    );
  }

  const period = chosen ?? months.data[0].period;
  return (
    <div className="flex flex-col gap-5 px-4 pb-8 md:px-8">
      <label className="flex max-w-xs flex-col gap-1 text-sm text-ink-muted">
        Monat
        <select
          value={period}
          onChange={(event) => setChosen(event.target.value)}
          className="min-h-11 rounded-lg border border-line bg-white px-3 text-base text-ink"
        >
          {months.data.map((month) => (
            <option key={month.period} value={month.period}>
              {monthLabel(month.period)}
              {month.closed ? '' : ' (läuft)'}
            </option>
          ))}
        </select>
      </label>
      <MonthDetail employerId={company.employerId} period={period} />
    </div>
  );
}

function MonthDetail({ employerId, period }: { employerId: string; period: string }) {
  const detail = useQuery(monthDetailQuery(employerId, period));
  const [exporting, setExporting] = useState(false);
  const [exportFailed, setExportFailed] = useState(false);

  async function exportCsv() {
    setExporting(true);
    setExportFailed(false);
    try {
      await downloadPayrollCsv(employerId, period);
    } catch {
      setExportFailed(true);
    } finally {
      setExporting(false);
    }
  }

  if (detail.isPending) return <Spinner />;
  if (detail.isError) return <p className="text-ink-muted">Der Monat konnte nicht geladen werden.</p>;

  return (
    <>
      <MonthTotals summary={detail.data.summary} />

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Gutschriften für die Lohnabrechnung</h2>
            <p className="text-sm text-ink-muted">
              Steuerfreier Sachbezug je Person (§ 8 Abs. 2 Satz 11 EStG). Was einzelne Mitarbeitende ausgeben, sehen Sie
              nicht – das bleibt privat.
            </p>
          </div>
          <Button variant="secondary" disabled={exporting} onClick={() => void exportCsv()}>
            CSV für die Lohnabrechnung
          </Button>
        </div>
        {exportFailed && (
          <p role="alert" className="text-sm text-error">
            Der Export ist fehlgeschlagen. Bitte erneut versuchen.
          </p>
        )}
        <table className="w-full text-sm">
          <thead className="border-b border-line text-left text-ink-muted">
            <tr>
              <th className="py-2 font-medium">Name</th>
              <th className="hidden py-2 font-medium sm:table-cell">Personal-Nr.</th>
              <th className="hidden py-2 font-medium sm:table-cell">Gutgeschrieben am</th>
              <th className="py-2 text-right font-medium">Betrag</th>
            </tr>
          </thead>
          <tbody>
            {detail.data.employees.map((employee) => (
              <tr key={employee.employeeId} className="border-b border-line">
                <td className="py-2.5">
                  {employee.lastName}, {employee.firstName}
                </td>
                <td className="hidden py-2.5 tabular-nums sm:table-cell">{employee.personnelNumber ?? '–'}</td>
                <td className="hidden py-2.5 tabular-nums sm:table-cell">{formatDay(employee.creditedOn)}</td>
                <td className="py-2.5 text-right tabular-nums">{formatCents(employee.creditedCents)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="py-2.5" colSpan={1}>
                Summe
              </td>
              <td className="hidden sm:table-cell" />
              <td className="hidden sm:table-cell" />
              <td className="py-2.5 text-right tabular-nums">{formatCents(detail.data.summary.creditedCents)}</td>
            </tr>
          </tfoot>
        </table>
      </section>
    </>
  );
}

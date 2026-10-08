'use client';

import { formatDay } from '@/lib/berlin-date';
import { formatCents } from '@/lib/format';

import { EmployeeStatus } from './employee-status';
import type { EmployeeRow } from './employees-api';
import { InviteActions } from './invite-actions';

/** Table on tablets and computers, compact rows on phones. */
export function EmployeeList({
  employerId,
  rows,
  onEdit,
}: {
  employerId: string;
  rows: EmployeeRow[];
  onEdit: (employeeId: string) => void;
}) {
  if (rows.length === 0) {
    return <p className="rounded-xl bg-surface p-6 text-center text-ink-muted">Keine Einträge.</p>;
  }
  return (
    <>
      <table className="hidden w-full text-sm md:table">
        <thead className="border-b border-line text-left text-ink-muted">
          <tr>
            <th className="py-2 font-medium">Name</th>
            <th className="py-2 font-medium">Personal-Nr.</th>
            <th className="py-2 font-medium">Status</th>
            <th className="py-2 text-right font-medium">Monatsbetrag</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line align-top">
              <td className="py-3">
                <p className="font-medium">
                  {row.lastName}, {row.firstName}
                </p>
                <p className="text-ink-muted">{row.email}</p>
              </td>
              <td className="py-3 tabular-nums">{row.personnelNumber ?? '–'}</td>
              <td className="py-3">
                <EmployeeStatus status={row.status} />
                <StatusDetail row={row} />
              </td>
              <td className="py-3 text-right tabular-nums">{formatCents(row.monthlyAmountCents)}</td>
              <td className="py-3 text-right">
                {row.kind === 'invite' ? (
                  <InviteActions employerId={employerId} row={row} />
                ) : (
                  <EditButton onClick={() => onEdit(row.id)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="flex flex-col md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-col gap-2 border-b border-line py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">
                  {row.lastName}, {row.firstName}
                </p>
                <p className="truncate text-xs text-ink-muted">{row.email}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="tabular-nums">{formatCents(row.monthlyAmountCents)}</span>
                <EmployeeStatus status={row.status} />
              </div>
            </div>
            {row.kind === 'invite' ? (
              <InviteActions employerId={employerId} row={row} />
            ) : (
              <EditButton onClick={() => onEdit(row.id)} />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="self-end text-sm font-medium text-brand-purple hover:underline" onClick={onClick}>
      Bearbeiten
    </button>
  );
}

function StatusDetail({ row }: { row: EmployeeRow }) {
  const text =
    row.status === 'leaving' && row.benefitEndsOn
      ? `bis ${formatDay(row.benefitEndsOn)}`
      : row.status === 'invited' && row.inviteExpiresAt
        ? `Code gültig bis ${formatDay(row.inviteExpiresAt.slice(0, 10))}`
        : row.status === 'active' && row.startedOn
          ? `seit ${formatDay(row.startedOn)}`
          : null;
  return text ? <p className="mt-1 text-xs text-ink-muted">{text}</p> : null;
}

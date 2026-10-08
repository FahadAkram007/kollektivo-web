import { formatCents } from '@/lib/format';

import type { MonthSummary } from './months-api';

/** Cards with the month's totals and a bar showing how the credited money was used. */
export function MonthTotals({ summary }: { summary: MonthSummary }) {
  const rest = summary.closed ? summary.returnedCents : summary.openCents;
  const cards = [
    { label: 'Mitarbeitende mit Guthaben', value: String(summary.employeeCount) },
    { label: 'Gutgeschrieben', value: formatCents(summary.creditedCents) },
    { label: 'In der Region ausgegeben', value: formatCents(summary.spentCents) },
    {
      label: summary.closed ? 'Zurück an Ihre Firma' : 'Noch nicht ausgegeben',
      value: formatCents(rest),
    },
  ];
  const spentShare = summary.creditedCents ? (summary.spentCents / summary.creditedCents) * 100 : 0;

  return (
    <div className="flex flex-col gap-3">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl bg-surface p-3 md:p-4">
            <dt className="text-xs text-ink-muted md:text-sm">{card.label}</dt>
            <dd className="text-lg font-bold tabular-nums md:text-2xl">{card.value}</dd>
          </div>
        ))}
      </dl>
      <div
        className="flex h-3 overflow-hidden rounded-full bg-line"
        role="img"
        aria-label={`${Math.round(spentShare)} % des Guthabens ausgegeben`}
      >
        <div className="bg-brand-gradient" style={{ width: `${spentShare}%` }} />
      </div>
      <p className="text-xs text-ink-muted">
        {Math.round(spentShare)} % ausgegeben.{' '}
        {summary.closed
          ? 'Der Rest wurde am Monatsende Ihrer Firma gutgeschrieben.'
          : 'Was bis Monatsende nicht ausgegeben wird, geht an Ihre Firma zurück.'}
      </p>
    </div>
  );
}

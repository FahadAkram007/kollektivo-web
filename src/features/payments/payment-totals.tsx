import { formatCents } from '@/lib/format';

import type { PaymentsPage } from './payments-api';

/** Sums over every completed payment in the range. */
export function PaymentTotals({ totals }: { totals: PaymentsPage['totals'] }) {
  const cards = [
    { label: 'Zahlungen', value: String(totals.count) },
    { label: 'Mit Guthaben bezahlt', value: formatCents(totals.amountCents) },
    { label: 'Provision KollektivO', value: formatCents(totals.commissionCents) },
  ];
  return (
    <dl className="grid grid-cols-3 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="bg-surface rounded-xl p-3 md:p-4">
          <dt className="text-ink-muted text-xs md:text-sm">{card.label}</dt>
          <dd className="text-lg font-bold tabular-nums md:text-2xl">{card.value}</dd>
        </div>
      ))}
    </dl>
  );
}

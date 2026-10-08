import { formatDateTime } from '@/lib/berlin-date';
import { formatCents } from '@/lib/format';

import { PaymentStatus } from './payment-status';
import type { PaymentRow } from './payments-api';

const METHOD = { till: 'Kasse', printed_qr: 'QR-Aufkleber' } as const;

/** Table on tablets, compact rows on phones. */
export function PaymentList({ payments }: { payments: PaymentRow[] }) {
  if (payments.length === 0) {
    return <p className="bg-surface text-ink-muted rounded-xl p-6 text-center">Keine Zahlungen in diesem Zeitraum.</p>;
  }
  return (
    <>
      <table className="hidden w-full text-sm md:table">
        <thead className="border-line text-ink-muted border-b text-left">
          <tr>
            <th className="py-2 font-medium">Zeit</th>
            <th className="py-2 font-medium">Referenz</th>
            <th className="py-2 font-medium">Art</th>
            <th className="py-2 font-medium">Status</th>
            <th className="py-2 text-right font-medium">Einkauf</th>
            <th className="py-2 text-right font-medium">Guthaben</th>
            <th className="py-2 text-right font-medium">Provision</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-line border-b">
              <td className="py-3 tabular-nums">{formatDateTime(payment.createdAt)}</td>
              <td className="py-3 font-medium">{payment.reference}</td>
              <td className="py-3">{METHOD[payment.method]}</td>
              <td className="py-3">
                <PaymentStatus status={payment.status} />
              </td>
              <td className="py-3 text-right tabular-nums">{formatCents(payment.purchaseTotalCents)}</td>
              <td className="py-3 text-right font-bold tabular-nums">{formatCents(payment.amountCents)}</td>
              <td className="text-ink-muted py-3 text-right tabular-nums">{formatCents(payment.commissionCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="flex flex-col md:hidden">
        {payments.map((payment) => (
          <li key={payment.id} className="border-line flex items-center justify-between gap-3 border-b py-3">
            <div className="min-w-0">
              <p className="font-medium">{payment.reference}</p>
              <p className="text-ink-muted text-xs">
                {formatDateTime(payment.createdAt)} · {METHOD[payment.method]}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-bold tabular-nums">{formatCents(payment.amountCents)}</span>
              <PaymentStatus status={payment.status} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

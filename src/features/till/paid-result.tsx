import { Button } from '@/components/ui/button';
import { formatCents } from '@/lib/format';

import type { PartnerPayment } from './till-api';

/** Green confirmation; with a split payment, the rest the customer still pays at the till. */
export function PaidResult({ payment, onDone }: { payment: PartnerPayment; onDone: () => void }) {
  const rest = payment.purchaseTotalCents - payment.amountCents;
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 text-center">
      <div className="flex size-24 items-center justify-center rounded-full bg-success text-5xl text-white">✓</div>
      <div>
        <p className="text-3xl font-bold text-success">Bezahlt · {formatCents(payment.amountCents)}</p>
        <p className="mt-1 text-sm text-ink-muted">Referenz {payment.reference}</p>
      </div>
      {rest > 0 && (
        <div className="w-full rounded-xl border-2 border-warning bg-amber-50 p-4">
          <p className="text-sm">Das Guthaben hat nicht ganz gereicht.</p>
          <p className="text-2xl font-bold">Restbetrag an der Kasse: {formatCents(rest)}</p>
        </div>
      )}
      <Button className="w-full" onClick={onDone}>
        Neue Zahlung
      </Button>
    </div>
  );
}

'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useCurrentShop } from '@/features/partner/current-shop';
import { formatCents } from '@/lib/format';

import { playChime } from './chime';
import { acceptPayment, declinePayment, pendingPaymentsQuery, type PartnerPayment } from './till-api';
import { formatSeconds, useSecondsLeft } from './use-seconds-left';

/**
 * Payments started with the shop's printed QR code: the customer typed the amount in the app,
 * the cashier checks it and accepts or declines. Unanswered payments time out (nothing is charged).
 */
export function PendingPayments() {
  const { shop, location } = useCurrentShop();
  const queryClient = useQueryClient();
  const query = pendingPaymentsQuery(shop.partnerId, location.id);
  const pending = useQuery(query);
  const [result, setResult] = useState<{ payment: PartnerPayment; accepted: boolean } | null>(null);
  const seen = useRef(new Set<string>());

  // Chime once for every payment that newly arrives.
  useEffect(() => {
    const arrived = (pending.data ?? []).filter((payment) => !seen.current.has(payment.id));
    arrived.forEach((payment) => seen.current.add(payment.id));
    if (arrived.length > 0) playChime();
  }, [pending.data]);

  async function answer(payment: PartnerPayment, accept: boolean) {
    const answered = accept ? await acceptPayment(payment.id) : await declinePayment(payment.id);
    setResult({ payment: answered, accepted: accept });
    await queryClient.invalidateQueries({ queryKey: query.queryKey });
  }

  const payments = pending.data ?? [];
  return (
    <section aria-label="Zahlungen per gedrucktem QR-Code" className="flex flex-col gap-3">
      <h2 className="text-sm font-bold text-ink-muted">Gedruckter QR-Code</h2>
      {result && <AnswerResult {...result} onClose={() => setResult(null)} />}
      {payments.length === 0 && !result && (
        <p className="rounded-xl bg-surface p-4 text-sm text-ink-muted">
          Keine offenen Zahlungen. Wenn ein Kunde Ihren gedruckten QR-Code scannt, erscheint die Zahlung hier.
        </p>
      )}
      {payments.map((payment) => (
        <PendingCard key={payment.id} payment={payment} onAnswer={(accept) => answer(payment, accept)} />
      ))}
    </section>
  );
}

function PendingCard({ payment, onAnswer }: { payment: PartnerPayment; onAnswer: (accept: boolean) => Promise<void> }) {
  const secondsLeft = useSecondsLeft(payment.acceptUntil ?? payment.createdAt);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function answer(accept: boolean) {
    setBusy(true);
    setFailed(false);
    try {
      await onAnswer(accept);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  if (secondsLeft === 0) return null;
  return (
    <article className="flex flex-col gap-3 rounded-xl border-2 border-brand-purple bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-3xl font-bold tabular-nums">{formatCents(payment.purchaseTotalCents)}</p>
        <p className="text-sm text-ink-muted tabular-nums">noch {formatSeconds(secondsLeft)}</p>
      </div>
      <p className="text-sm text-ink-muted">Stimmt der Betrag mit dem Einkauf überein?</p>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="danger" disabled={busy} onClick={() => void answer(false)}>
          Ablehnen
        </Button>
        <Button disabled={busy} onClick={() => void answer(true)}>
          Annehmen
        </Button>
      </div>
      {failed && (
        <p role="alert" className="text-sm text-error">
          Keine Verbindung. Bitte erneut versuchen.
        </p>
      )}
    </article>
  );
}

function AnswerResult({
  payment,
  accepted,
  onClose,
}: {
  payment: PartnerPayment;
  accepted: boolean;
  onClose: () => void;
}) {
  const rest = payment.purchaseTotalCents - payment.amountCents;
  const [title, detail, tone] =
    payment.status === 'completed'
      ? [
          `Bezahlt · ${formatCents(payment.amountCents)}`,
          rest > 0 ? `Restbetrag an der Kasse: ${formatCents(rest)}` : null,
          'border-success bg-green-50',
        ]
      : payment.status === 'timed_out'
        ? ['Zu spät angenommen', 'Die Zeit war abgelaufen. Es wurde nichts bezahlt.', 'border-warning bg-amber-50']
        : accepted
          ? ['Nicht bezahlt', 'Das Guthaben des Kunden reicht nicht mehr.', 'border-warning bg-amber-50']
          : ['Abgelehnt', 'Es wurde nichts bezahlt.', 'border-line bg-surface'];

  return (
    <div role="status" className={`flex items-start justify-between gap-3 rounded-xl border-2 p-4 ${tone}`}>
      <div>
        <p className="text-xl font-bold">{title}</p>
        {detail && <p className="text-sm">{detail}</p>}
      </div>
      <button className="text-sm text-ink-muted" onClick={onClose} aria-label="Schließen">
        ✕
      </button>
    </div>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { QrImage } from '@/components/ui/qr-image';
import { formatCents } from '@/lib/format';

import { PaidResult } from './paid-result';
import { cancelPaymentRequest, requestStatusQuery, type CreatedRequest, type RequestStatus } from './till-api';
import { formatSeconds, useSecondsLeft } from './use-seconds-left';

/** Step 2: QR + 6-digit code for the customer; turns into the result once they have paid. */
export function CodeStep({
  request,
  amountCents,
  onNewCode,
  onDone,
}: {
  request: CreatedRequest;
  amountCents: number;
  onNewCode: () => void;
  onDone: () => void;
}) {
  const status = useQuery(requestStatusQuery(request.id));
  const secondsLeft = useSecondsLeft(request.expiresAt);
  const [cancelled, setCancelled] = useState<RequestStatus | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const current = cancelled ?? status.data;
  if (current?.payment?.status === 'completed') return <PaidResult payment={current.payment} onDone={onDone} />;

  async function cancel() {
    setCancelling(true);
    try {
      const result = await cancelPaymentRequest(request.id);
      // If the customer paid in the same moment, the result shows the payment instead.
      if (result.status === 'used') setCancelled(result);
      else onDone();
    } finally {
      setCancelling(false);
    }
  }

  const ended = current?.status === 'expired' || current?.status === 'cancelled' || secondsLeft === 0;
  if (ended && current?.status !== 'used') {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 text-center">
        <p className="text-xl font-bold">Der Code ist abgelaufen.</p>
        <p className="text-ink-muted">Es wurde nichts bezahlt.</p>
        <Button className="w-full" onClick={onNewCode}>
          Neuer Code für {formatCents(amountCents)}
        </Button>
        <Button className="w-full" variant="secondary" onClick={onDone}>
          Neue Zahlung
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 text-center">
      <p className="text-ink-muted">Kunde scannt mit der KollektivO-App</p>
      <p className="text-4xl font-bold tabular-nums">{formatCents(amountCents)}</p>
      <QrImage value={request.qrPayload} label="QR-Code zum Bezahlen" />
      <div>
        <p className="text-sm text-ink-muted">oder Code eingeben</p>
        <p className="text-4xl font-bold tracking-widest tabular-nums">
          {request.shortCode.slice(0, 3)} {request.shortCode.slice(3)}
        </p>
      </div>
      <p className="text-sm text-ink-muted" aria-live="off">
        {current?.status === 'used' ? 'Zahlung wird abgeschlossen …' : `Gültig noch ${formatSeconds(secondsLeft)}`}
      </p>
      <Button className="w-full" variant="secondary" onClick={() => void cancel()} disabled={cancelling}>
        Abbrechen
      </Button>
    </div>
  );
}

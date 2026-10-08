'use client';

import { useState } from 'react';

import { useCurrentShop } from '@/features/partner/current-shop';
import { ApiError } from '@/lib/api-client';

import { AmountStep } from './amount-step';
import { CodeStep } from './code-step';
import { PendingPayments } from './pending-payments';
import { createPaymentRequest, type CreatedRequest } from './till-api';

/** The till: amount → QR + code → paid. Printed-QR payments to accept are shown next to it. */
export function TillScreen() {
  const { location } = useCurrentShop();
  const [cents, setCents] = useState(0);
  const [request, setRequest] = useState<CreatedRequest | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function showCode() {
    if (!location.tillId) return;
    setBusy(true);
    setError(null);
    try {
      setRequest(await createPaymentRequest(location.tillId, cents));
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.code === 'forbidden'
          ? 'Ihr Shop ist noch nicht freigeschaltet.'
          : 'Der Code konnte nicht erstellt werden. Bitte erneut versuchen.',
      );
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setRequest(null);
    setCents(0);
  }

  return (
    <div className="grid flex-1 gap-8 px-4 pb-8 md:grid-cols-[1fr_minmax(280px,360px)] md:px-8">
      <div className="order-2 md:order-1">
        {!location.tillId ? (
          <p className="text-ink-muted">
            Für diese Filiale ist keine Kasse eingerichtet. Bitte melden Sie sich beim Support.
          </p>
        ) : request ? (
          <CodeStep
            key={request.id}
            request={request}
            amountCents={cents}
            onNewCode={() => void showCode()}
            onDone={reset}
          />
        ) : (
          <AmountStep cents={cents} onChange={setCents} onSubmit={() => void showCode()} busy={busy} error={error} />
        )}
      </div>
      <div className="order-1 md:order-2">
        <PendingPayments />
      </div>
    </div>
  );
}

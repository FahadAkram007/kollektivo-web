'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { formatCents } from '@/lib/format';

import { keyFromKeyboard, pressKey } from './amount-entry';
import { NumberPad } from './number-pad';

/** Step 1: the cashier types the purchase amount. */
export function AmountStep({
  cents,
  onChange,
  onSubmit,
  busy,
  error,
}: {
  cents: number;
  onChange: (cents: number) => void;
  onSubmit: () => void;
  busy: boolean;
  error: string | null;
}) {
  // Typing on a keyboard works too; Enter shows the code.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
      if (event.key === 'Enter' && cents > 0 && !busy) return onSubmit();
      const key = keyFromKeyboard(event.key);
      if (key) onChange(pressKey(cents, key));
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cents, busy, onChange, onSubmit]);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-5">
      <div className="flex items-end justify-between gap-3 border-b border-line pb-3">
        <span className="text-sm text-ink-muted">Betrag</span>
        <output aria-live="polite" className="text-5xl font-bold tabular-nums">
          {formatCents(cents)}
        </output>
      </div>
      <NumberPad onKey={(key) => onChange(pressKey(cents, key))} />
      <div className="grid grid-cols-[1fr_2fr] gap-3">
        <Button variant="secondary" onClick={() => onChange(0)} disabled={cents === 0}>
          Löschen
        </Button>
        <Button onClick={onSubmit} disabled={cents === 0 || busy}>
          QR anzeigen
        </Button>
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

'use client';

import type { PadKey } from './amount-entry';

const KEYS: { key: PadKey; label: string }[] = [
  ...(['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const).map((key) => ({ key, label: key })),
  { key: '00', label: '00' },
  { key: '0', label: '0' },
  { key: 'back', label: '⌫' },
];

export function NumberPad({ onKey }: { onKey: (key: PadKey) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {KEYS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          aria-label={key === 'back' ? 'Letzte Ziffer löschen' : label}
          onClick={() => onKey(key)}
          className="h-16 rounded-xl border border-line bg-white text-2xl font-medium active:bg-surface md:h-20"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

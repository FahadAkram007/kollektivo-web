/** Largest purchase the API accepts (1.000 €); the customer's credit covers part, the rest is paid at the till. */
export const MAX_AMOUNT_CENTS = 100_000;

export type PadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '00' | 'back' | 'clear';

/**
 * Cash-register style entry: digits fill in from the right, so 6 → 8 → 0 is 6,80 €.
 * Keys that would go above [MAX_AMOUNT_CENTS] are ignored.
 */
export function pressKey(cents: number, key: PadKey): number {
  if (key === 'clear') return 0;
  if (key === 'back') return Math.floor(cents / 10);
  const next = Number(`${cents}${key}`);
  return next > MAX_AMOUNT_CENTS ? cents : next;
}

/** Physical keyboard (USB keypad or laptop) → pad key. */
export function keyFromKeyboard(key: string): PadKey | null {
  if (/^\d$/.test(key)) return key as PadKey;
  if (key === 'Backspace') return 'back';
  if (key === 'Escape' || key === 'Delete') return 'clear';
  return null;
}

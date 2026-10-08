const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

/** 680 → "6,80 €" */
export function formatCents(cents: number): string {
  return euro.format(cents / 100);
}

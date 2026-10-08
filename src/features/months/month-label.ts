const monthFormat = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "2026-10" → "Oktober 2026" */
export function monthLabel(period: string): string {
  const [year, month] = period.split('-').map(Number);
  return monthFormat.format(new Date(Date.UTC(year, month - 1, 1)));
}

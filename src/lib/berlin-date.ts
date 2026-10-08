const dayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' });

/** Today's date in Germany as "2026-10-08" (the API counts days in German time). */
export function berlinToday(now = new Date()): string {
  return dayFormat.format(now);
}

/** "2026-10-08" → "08.10.2026" */
export function formatDay(day: string): string {
  const [year, month, date] = day.split('-');
  return `${date}.${month}.${year}`;
}

const dateTimeFormat = new Intl.DateTimeFormat('de-DE', {
  timeZone: 'Europe/Berlin',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

/** ISO time → "08.10., 14:05" in German time. */
export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

import type { OpeningPeriod } from './profile-api';

export const WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

/** One day in the editor: closed, or one or two periods (e.g. with a lunch break) as "HH:MM". */
export interface DayHours {
  open: boolean;
  periods: { opens: string; closes: string }[];
}

/** 480 → "08:00" */
export function minutesToTime(minutes: number): string {
  if (minutes >= 1440) return '24:00';
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

/** "08:00" → 480; "00:00" as a closing time means midnight (1440). */
export function timeToMinutes(time: string, isClosing = false): number {
  const [hours, minutes] = time.split(':').map(Number);
  const total = hours * 60 + minutes;
  return isClosing && total === 0 ? 1440 : total;
}

/** API periods → 7 editor days (Monday first). */
export function toDays(periods: OpeningPeriod[]): DayHours[] {
  return WEEKDAYS.map((_, index) => {
    const ofDay = periods.filter((period) => period.weekday === index + 1);
    return ofDay.length
      ? {
          open: true,
          periods: ofDay.map((period) => ({
            opens: minutesToTime(period.opensAt),
            closes: minutesToTime(period.closesAt),
          })),
        }
      : { open: false, periods: [{ opens: '08:00', closes: '18:00' }] };
  });
}

/** Editor days → API periods; closed days are left out. */
export function toPeriods(days: DayHours[]): OpeningPeriod[] {
  return days.flatMap((day, index) =>
    day.open
      ? day.periods.map((period) => ({
          weekday: index + 1,
          opensAt: timeToMinutes(period.opens),
          closesAt: timeToMinutes(period.closes, true),
        }))
      : [],
  );
}

/** German text for the first problem in the hours, or null when they are fine. */
export function hoursProblem(days: DayHours[]): string | null {
  for (const [index, day] of days.entries()) {
    if (!day.open) continue;
    const periods = toPeriods([day]);
    for (const [position, period] of periods.entries()) {
      if (period.closesAt <= period.opensAt)
        return `${WEEKDAYS[index]}: Die Schließzeit muss nach der Öffnungszeit liegen.`;
      if (position > 0 && periods[position - 1].closesAt > period.opensAt) {
        return `${WEEKDAYS[index]}: Die Zeiten überschneiden sich.`;
      }
    }
  }
  return null;
}

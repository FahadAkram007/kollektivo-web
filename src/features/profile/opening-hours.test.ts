import { describe, expect, it } from 'vitest';

import { hoursProblem, minutesToTime, timeToMinutes, toDays, toPeriods } from './opening-hours';

describe('opening hours', () => {
  it('converts between minutes and times', () => {
    expect(minutesToTime(480)).toBe('08:00');
    expect(minutesToTime(1440)).toBe('24:00');
    expect(timeToMinutes('18:30')).toBe(1110);
    expect(timeToMinutes('00:00', true)).toBe(1440);
  });

  it('round-trips API periods through the editor', () => {
    const periods = [
      { weekday: 1, opensAt: 360, closesAt: 720 },
      { weekday: 1, opensAt: 840, closesAt: 1080 },
      { weekday: 6, opensAt: 420, closesAt: 660 },
    ];
    const days = toDays(periods);
    expect(days[0]).toEqual({
      open: true,
      periods: [
        { opens: '06:00', closes: '12:00' },
        { opens: '14:00', closes: '18:00' },
      ],
    });
    expect(days[6].open).toBe(false);
    expect(toPeriods(days)).toEqual(periods);
  });

  it('names the day with a problem', () => {
    const days = toDays([]);
    days[2] = { open: true, periods: [{ opens: '18:00', closes: '08:00' }] };
    expect(hoursProblem(days)).toBe('Mittwoch: Die Schließzeit muss nach der Öffnungszeit liegen.');
    days[2] = {
      open: true,
      periods: [
        { opens: '08:00', closes: '13:00' },
        { opens: '12:00', closes: '18:00' },
      ],
    };
    expect(hoursProblem(days)).toBe('Mittwoch: Die Zeiten überschneiden sich.');
  });
});

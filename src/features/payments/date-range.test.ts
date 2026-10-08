import { describe, expect, it } from 'vitest';

import { berlinToday } from '@/lib/berlin-date';

import { presetRange } from './date-range';

describe('presetRange', () => {
  const today = '2026-03-01';

  it('covers today and yesterday across a month end', () => {
    expect(presetRange('today', today)).toEqual({ from: '2026-03-01', to: '2026-03-01' });
    expect(presetRange('yesterday', today)).toEqual({ from: '2026-02-28', to: '2026-02-28' });
  });

  it('covers this and last month, also across a year end', () => {
    expect(presetRange('thisMonth', '2026-10-08')).toEqual({ from: '2026-10-01', to: '2026-10-08' });
    expect(presetRange('lastMonth', today)).toEqual({ from: '2026-02-01', to: '2026-02-28' });
    expect(presetRange('lastMonth', '2027-01-15')).toEqual({ from: '2026-12-01', to: '2026-12-31' });
  });
});

describe('berlinToday', () => {
  it('uses German time, not the device clock', () => {
    // 22:30 UTC on 7 Oct is already 8 Oct in Germany (summer time).
    expect(berlinToday(new Date('2026-10-07T22:30:00Z'))).toBe('2026-10-08');
  });
});

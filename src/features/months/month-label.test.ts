import { describe, expect, it } from 'vitest';

import { monthLabel } from './month-label';

describe('monthLabel', () => {
  it('names the month in German', () => {
    expect(monthLabel('2026-10')).toBe('Oktober 2026');
    expect(monthLabel('2027-03')).toBe('März 2027');
  });
});

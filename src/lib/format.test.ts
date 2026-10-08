import { describe, expect, it } from 'vitest';

import { formatCents } from './format';

describe('formatCents', () => {
  it('formats euros the German way', () => {
    expect(formatCents(680).replace(/\s/g, ' ')).toBe('6,80 €');
    expect(formatCents(123456).replace(/\s/g, ' ')).toBe('1.234,56 €');
  });
});

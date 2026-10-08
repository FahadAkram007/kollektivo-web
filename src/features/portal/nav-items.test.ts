import { describe, expect, it } from 'vitest';

import { navItemsFor } from './nav-items';

describe('navItemsFor', () => {
  it('shows staff only the till and payments', () => {
    expect(navItemsFor(false).map((item) => item.href)).toEqual(['/kasse', '/zahlungen']);
  });

  it('shows owners everything', () => {
    expect(navItemsFor(true)).toHaveLength(5);
  });
});

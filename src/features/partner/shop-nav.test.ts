import { describe, expect, it } from 'vitest';

import { visibleItems } from '@/features/portal/nav-item';

import { SHOP_NAV } from './shop-nav';

describe('shop navigation', () => {
  it('shows staff only the till and payments', () => {
    expect(visibleItems(SHOP_NAV, false).map((item) => item.href)).toEqual(['/kasse', '/zahlungen']);
  });

  it('shows owners everything', () => {
    expect(visibleItems(SHOP_NAV, true)).toHaveLength(5);
  });
});

'use client';

import { AreaRedirect, NoAccess } from '@/features/portal/area-redirect';
import { PortalFrame } from '@/features/portal/portal-frame';
import { usePortalAccess } from '@/features/portal/session-gate';
import { visibleItems } from '@/features/portal/nav-item';

import { CurrentShopProvider, useCurrentShop } from './current-shop';
import { LocationSwitcher } from './location-switcher';
import { SHOP_NAV } from './shop-nav';

/** The shop area (till, payments, profile, team, QR code) for the branch chosen on this device. */
export function ShopShell({ children }: { children: React.ReactNode }) {
  const { partner, hasShops, hasCompanies } = usePortalAccess();
  if (!hasShops) return hasCompanies ? <AreaRedirect to="/firma" /> : <NoAccess />;
  return (
    <CurrentShopProvider me={partner}>
      <ShopFrame>{children}</ShopFrame>
    </CurrentShopProvider>
  );
}

function ShopFrame({ children }: { children: React.ReactNode }) {
  const { isOwner } = useCurrentShop();
  return (
    <PortalFrame area="shop" items={visibleItems(SHOP_NAV, isOwner)} switcher={<LocationSwitcher />}>
      {children}
    </PortalFrame>
  );
}

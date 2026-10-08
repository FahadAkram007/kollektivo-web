'use client';

import { AreaRedirect, NoAccess } from './area-redirect';
import { usePortalAccess } from './session-gate';

/** The start page: shop staff go to the till, HR to the company area. */
export function HomeRedirect() {
  const { hasShops, hasCompanies } = usePortalAccess();
  if (hasShops) return <AreaRedirect to="/kasse" />;
  if (hasCompanies) return <AreaRedirect to="/firma" />;
  return <NoAccess />;
}

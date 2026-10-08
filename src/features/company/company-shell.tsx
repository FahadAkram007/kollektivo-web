'use client';

import { AreaRedirect, NoAccess } from '@/features/portal/area-redirect';
import { visibleItems } from '@/features/portal/nav-item';
import { PortalFrame } from '@/features/portal/portal-frame';
import { usePortalAccess } from '@/features/portal/session-gate';

import { COMPANY_NAV } from './company-nav';
import { CompanySwitcher } from './company-switcher';
import { CurrentCompanyProvider, useCurrentCompany } from './current-company';

/** The HR area ("Firmenportal"): employees, monthly overview, HR team. */
export function CompanyShell({ children }: { children: React.ReactNode }) {
  const { employer, hasCompanies, hasShops } = usePortalAccess();
  if (!hasCompanies) return hasShops ? <AreaRedirect to="/kasse" /> : <NoAccess />;
  return (
    <CurrentCompanyProvider companies={employer.companies}>
      <CompanyFrame>{children}</CompanyFrame>
    </CurrentCompanyProvider>
  );
}

function CompanyFrame({ children }: { children: React.ReactNode }) {
  const { isOwner } = useCurrentCompany();
  return (
    <PortalFrame area="company" items={visibleItems(COMPANY_NAV, isOwner)} switcher={<CompanySwitcher />}>
      {children}
    </PortalFrame>
  );
}

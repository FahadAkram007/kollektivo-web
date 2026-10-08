import type { NavItem } from '@/features/portal/nav-item';

/** HR manages employees and sees the monthly overview; owners also manage the HR team. */
export const COMPANY_NAV: NavItem[] = [
  { href: '/firma/mitarbeitende', label: 'Mitarbeitende', ownerOnly: false },
  { href: '/firma/uebersicht', label: 'Übersicht', ownerOnly: false },
  { href: '/firma/team', label: 'HR-Team', ownerOnly: true },
];

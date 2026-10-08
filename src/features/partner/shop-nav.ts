import type { NavItem } from '@/features/portal/nav-item';

/** Staff use the till and see payments; owners also manage the shop. */
export const SHOP_NAV: NavItem[] = [
  { href: '/kasse', label: 'Kasse', ownerOnly: false },
  { href: '/zahlungen', label: 'Zahlungen', ownerOnly: false },
  { href: '/profil', label: 'Profil', ownerOnly: true },
  { href: '/team', label: 'Team', ownerOnly: true },
  { href: '/qr-code', label: 'QR-Code', ownerOnly: true },
];

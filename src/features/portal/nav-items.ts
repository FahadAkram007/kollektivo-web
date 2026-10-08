export interface NavItem {
  href: string;
  label: string;
  ownerOnly: boolean;
}

/** Staff use the till and see payments; owners also manage the shop. */
export const NAV_ITEMS: NavItem[] = [
  { href: '/kasse', label: 'Kasse', ownerOnly: false },
  { href: '/zahlungen', label: 'Zahlungen', ownerOnly: false },
  { href: '/profil', label: 'Profil', ownerOnly: true },
  { href: '/team', label: 'Team', ownerOnly: true },
  { href: '/qr-code', label: 'QR-Code', ownerOnly: true },
];

export function navItemsFor(isOwner: boolean): NavItem[] {
  return NAV_ITEMS.filter((item) => isOwner || !item.ownerOnly);
}

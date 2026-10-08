export interface NavItem {
  href: string;
  label: string;
  /** Only for shop owners / company owners. */
  ownerOnly: boolean;
}

export function visibleItems(items: NavItem[], isOwner: boolean): NavItem[] {
  return items.filter((item) => isOwner || !item.ownerOnly);
}

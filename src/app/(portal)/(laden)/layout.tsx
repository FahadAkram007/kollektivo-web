import { ShopShell } from '@/features/partner/shop-shell';

/** The shop area: till, payments, profile, team, QR code. */
export default function ShopLayout({ children }: LayoutProps<'/'>) {
  return <ShopShell>{children}</ShopShell>;
}

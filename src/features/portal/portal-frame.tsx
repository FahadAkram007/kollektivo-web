'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/features/auth/auth-provider';

import type { NavItem } from './nav-item';
import { usePortalAccess } from './session-gate';

/**
 * Navigation around every signed-in page: sidebar on tablets and larger, top bar + bottom tabs on phones.
 * [switcher] shows which shop branch or company is being worked on.
 */
export function PortalFrame({
  area,
  items,
  switcher,
  children,
}: {
  area: 'shop' | 'company';
  items: NavItem[];
  switcher: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { partner, hasShops, hasCompanies } = usePortalAccess();
  const otherArea =
    area === 'shop' && hasCompanies
      ? { href: '/firma', label: 'Zum Firmenportal' }
      : area === 'company' && hasShops
        ? { href: '/kasse', label: 'Zum Laden' }
        : null;

  const linkClass = (href: string) =>
    pathname.startsWith(href) ? 'bg-surface font-bold text-brand-purple' : 'text-ink hover:bg-surface';

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex flex-col gap-4 border-b border-line p-4 md:w-60 md:border-r md:border-b-0 print:hidden">
        <div className="flex items-center justify-between md:block">
          <Logo height={28} />
          <button className="text-sm text-ink-muted md:hidden" onClick={() => void signOut()}>
            Abmelden
          </button>
        </div>
        {area === 'company' && <p className="-mt-2 text-xs font-bold tracking-wide text-ink-muted">FIRMENPORTAL</p>}
        {switcher}
        <nav className="hidden flex-col gap-1 md:flex">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={`rounded-lg px-3 py-2.5 ${linkClass(item.href)}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        {otherArea && (
          <Link href={otherArea.href} className="text-sm text-brand-purple hover:underline">
            {otherArea.label} →
          </Link>
        )}
        <div className="mt-auto hidden flex-col gap-1 text-sm md:flex">
          <span className="truncate text-ink-muted">
            {partner.firstName} {partner.lastName}
          </span>
          <button className="text-left text-brand-purple hover:underline" onClick={() => void signOut()}>
            Abmelden
          </button>
        </div>
      </aside>

      <main className="flex flex-1 flex-col pb-20 md:pb-0 print:p-0">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-line bg-white md:hidden print:hidden">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={`flex-1 py-4 text-center text-sm ${linkClass(item.href)}`}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

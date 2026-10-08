'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/features/auth/auth-provider';
import { useCurrentShop } from '@/features/partner/current-shop';

import { LocationSwitcher } from './location-switcher';
import { navItemsFor } from './nav-items';

/** Sidebar on tablets and larger, top bar + bottom tabs on phones. */
export function PortalNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { me, isOwner } = useCurrentShop();
  const items = navItemsFor(isOwner);

  const linkClass = (href: string) =>
    pathname.startsWith(href) ? 'bg-surface font-bold text-brand-purple' : 'text-ink hover:bg-surface';

  return (
    <>
      <aside className="border-line flex flex-col gap-4 border-b p-4 md:w-60 md:border-r md:border-b-0">
        <div className="flex items-center justify-between md:block">
          <Logo height={28} />
          <button className="text-ink-muted text-sm md:hidden" onClick={() => void signOut()}>
            Abmelden
          </button>
        </div>
        <LocationSwitcher />
        <nav className="hidden flex-col gap-1 md:flex">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={`rounded-lg px-3 py-2.5 ${linkClass(item.href)}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden flex-col gap-1 text-sm md:flex">
          <span className="text-ink-muted truncate">
            {me.firstName} {me.lastName}
          </span>
          <button className="text-brand-purple text-left hover:underline" onClick={() => void signOut()}>
            Abmelden
          </button>
        </div>
      </aside>

      <nav className="border-line fixed inset-x-0 bottom-0 z-10 flex border-t bg-white md:hidden">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={`flex-1 py-4 text-center text-sm ${linkClass(item.href)}`}>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

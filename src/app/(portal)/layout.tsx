import { PortalShell } from '@/features/portal/portal-shell';

/** Every page behind sign-in: navigation, the current shop location, owner-only pages. */
export default function PortalLayout({ children }: LayoutProps<'/'>) {
  return <PortalShell>{children}</PortalShell>;
}

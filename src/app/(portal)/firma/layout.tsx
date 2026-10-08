import { CompanyShell } from '@/features/company/company-shell';

/** The HR area ("Firmenportal"). */
export default function CompanyLayout({ children }: LayoutProps<'/firma'>) {
  return <CompanyShell>{children}</CompanyShell>;
}

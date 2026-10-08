import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { EmployeesScreen } from '@/features/employees/employees-screen';

export const metadata: Metadata = { title: 'Mitarbeitende' };

export default function EmployeesPage() {
  return (
    <>
      <PageHeader title="Mitarbeitende" />
      <EmployeesScreen />
    </>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

import { Button, buttonClass } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentCompany } from '@/features/company/current-company';

import { countByFilter, FILTER_LABELS, filterEmployees, type EmployeeFilter } from './employee-filter';
import { EmployeeList } from './employee-list';
import { employeesQuery } from './employees-api';

/** "Mitarbeitende": everyone with the benefit, and open invites. */
export function EmployeesScreen() {
  const { company } = useCurrentCompany();
  const employees = useQuery(employeesQuery(company.employerId));
  const [filter, setFilter] = useState<EmployeeFilter>('all');
  const [search, setSearch] = useState('');

  if (employees.isPending) return <Spinner />;
  if (employees.isError) {
    return (
      <div className="flex flex-col items-start gap-3 px-4 md:px-8">
        <p className="text-ink-muted">Die Mitarbeitenden konnten nicht geladen werden.</p>
        <Button variant="secondary" onClick={() => void employees.refetch()}>
          Erneut versuchen
        </Button>
      </div>
    );
  }

  const counts = countByFilter(employees.data);
  if (counts.all === 0) {
    return (
      <div className="mx-4 flex flex-col items-center gap-4 rounded-2xl bg-surface p-10 text-center md:mx-8">
        <p className="text-lg font-bold">Noch niemand eingeladen</p>
        <p className="max-w-md text-ink-muted">
          Laden Sie Ihre Mitarbeitenden per E-Mail ein – einzeln oder mit einer Liste aus Excel. Sie bekommen einen Code
          für die KollektivO-App.
        </p>
        <Link href="/firma/mitarbeitende/einladen" className={buttonClass()}>
          Mitarbeitende einladen
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FILTER_LABELS) as EmployeeFilter[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`min-h-10 rounded-full border px-4 text-sm ${
                filter === key ? 'border-brand-purple bg-brand-purple text-white' : 'border-line bg-white'
              }`}
            >
              {FILTER_LABELS[key]} ({counts[key]})
            </button>
          ))}
        </div>
        <Link href="/firma/mitarbeitende/einladen" className={buttonClass()}>
          Einladen
        </Link>
      </div>
      <input
        type="search"
        placeholder="Suchen: Name, E-Mail oder Personalnummer"
        aria-label="Mitarbeitende suchen"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="min-h-11 rounded-xl border border-line px-4 outline-none focus:border-brand-purple"
      />
      <EmployeeList employerId={company.employerId} rows={filterEmployees(employees.data, filter, search)} />
    </div>
  );
}

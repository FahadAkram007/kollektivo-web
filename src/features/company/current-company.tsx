'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { Schemas } from '@/lib/api-client';

type Company = Schemas['EmployerCompanyDto'];

interface CurrentCompany {
  company: Company;
  /** Owners also manage the HR team. */
  isOwner: boolean;
  companies: Company[];
  select: (employerId: string) => void;
}

const CurrentCompanyContext = createContext<CurrentCompany | null>(null);
const STORAGE_KEY = 'kollektivo.employerId';

/** Which company HR works on (most manage one; tax advisers or groups may manage several). */
export function CurrentCompanyProvider({ companies, children }: { companies: Company[]; children: React.ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(readStored);

  const select = useCallback((employerId: string) => {
    setSelectedId(employerId);
    try {
      localStorage.setItem(STORAGE_KEY, employerId);
    } catch {
      // Private mode: the choice just isn't remembered.
    }
  }, []);

  const value = useMemo(() => {
    const company = companies.find((candidate) => candidate.employerId === selectedId) ?? companies[0];
    return company ? { company, isOwner: company.role === 'owner', companies, select } : null;
  }, [companies, selectedId, select]);

  if (!value) return null;
  return <CurrentCompanyContext value={value}>{children}</CurrentCompanyContext>;
}

export function useCurrentCompany(): CurrentCompany {
  const value = useContext(CurrentCompanyContext);
  if (!value) throw new Error('useCurrentCompany needs a <CurrentCompanyProvider>');
  return value;
}

function readStored(): string | null {
  try {
    return typeof window === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

import type { EmployeeRow } from './employees-api';

export type EmployeeFilter = 'all' | 'active' | 'invited' | 'inactive';

export const FILTER_LABELS: Record<EmployeeFilter, string> = {
  all: 'Alle',
  active: 'Aktiv',
  invited: 'Eingeladen',
  inactive: 'Ausgeschieden & gesperrt',
};

const GROUPS: Record<Exclude<EmployeeFilter, 'all'>, EmployeeRow['status'][]> = {
  active: ['active', 'leaving'],
  invited: ['invited', 'invite_expired'],
  inactive: ['ended', 'blocked'],
};

/** Status group + free text (name, email or personnel number). */
export function filterEmployees(rows: EmployeeRow[], filter: EmployeeFilter, search: string): EmployeeRow[] {
  const words = search.toLowerCase().split(/\s+/).filter(Boolean);
  return rows.filter((row) => {
    if (filter !== 'all' && !GROUPS[filter].includes(row.status)) return false;
    const haystack = `${row.firstName} ${row.lastName} ${row.email} ${row.personnelNumber ?? ''}`.toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}

export function countByFilter(rows: EmployeeRow[]): Record<EmployeeFilter, number> {
  return {
    all: rows.length,
    active: filterEmployees(rows, 'active', '').length,
    invited: filterEmployees(rows, 'invited', '').length,
    inactive: filterEmployees(rows, 'inactive', '').length,
  };
}

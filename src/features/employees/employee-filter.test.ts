import { describe, expect, it } from 'vitest';

import { countByFilter, filterEmployees } from './employee-filter';
import type { EmployeeRow } from './employees-api';

const row = (overrides: Partial<EmployeeRow>): EmployeeRow => ({
  kind: 'employee',
  id: crypto.randomUUID(),
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max@firma.de',
  personnelNumber: null,
  monthlyAmountCents: 5000,
  status: 'active',
  startedOn: null,
  benefitEndsOn: null,
  inviteExpiresAt: null,
  ...overrides,
});

describe('filterEmployees', () => {
  const rows = [
    row({ firstName: 'Lea', lastName: 'Lehmann', personnelNumber: '10427' }),
    row({ status: 'leaving' }),
    row({ kind: 'invite', status: 'invite_expired', email: 'tom@firma.de' }),
    row({ status: 'blocked' }),
  ];

  it('groups statuses', () => {
    expect(countByFilter(rows)).toEqual({ all: 4, active: 2, invited: 1, inactive: 1 });
  });

  it('searches name, email and personnel number', () => {
    expect(filterEmployees(rows, 'all', 'lea 10427')).toHaveLength(1);
    expect(filterEmployees(rows, 'all', 'TOM@')).toHaveLength(1);
    expect(filterEmployees(rows, 'active', 'tom')).toHaveLength(0);
  });
});

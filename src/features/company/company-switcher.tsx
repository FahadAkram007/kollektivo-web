'use client';

import { useCurrentCompany } from './current-company';

/** Company name and address; a dropdown only when the person manages more than one company. */
export function CompanySwitcher() {
  const { company, companies, select } = useCurrentCompany();

  if (companies.length === 1) {
    return (
      <div className="text-sm">
        <p className="font-bold">{company.name}</p>
        <p className="text-ink-muted">
          {company.street}, {company.city}
        </p>
      </div>
    );
  }

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-ink-muted">Firma</span>
      <select
        className="min-h-11 rounded-lg border border-line bg-white px-3"
        value={company.employerId}
        onChange={(event) => select(event.target.value)}
      >
        {companies.map((candidate) => (
          <option key={candidate.employerId} value={candidate.employerId}>
            {candidate.name}
          </option>
        ))}
      </select>
    </label>
  );
}

import type { EmployeeRow } from './employees-api';

export const STATUS_LABELS: Record<EmployeeRow['status'], string> = {
  invited: 'Eingeladen',
  invite_expired: 'Einladung abgelaufen',
  active: 'Aktiv',
  leaving: 'Scheidet aus',
  ended: 'Ausgeschieden',
  blocked: 'Gesperrt',
};

const STYLES: Record<EmployeeRow['status'], string> = {
  invited: 'bg-amber-50 text-ink',
  invite_expired: 'bg-red-50 text-error',
  active: 'bg-green-50 text-success',
  leaving: 'bg-amber-50 text-ink',
  ended: 'bg-surface text-ink-muted',
  blocked: 'bg-red-50 text-error',
};

export function EmployeeStatus({ status }: { status: EmployeeRow['status'] }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

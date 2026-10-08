import { berlinToday } from '@/lib/berlin-date';

export interface DateRange {
  from: string;
  to: string;
}

export type Preset = 'today' | 'yesterday' | 'thisMonth' | 'lastMonth';

export const PRESET_LABELS: Record<Preset, string> = {
  today: 'Heute',
  yesterday: 'Gestern',
  thisMonth: 'Dieser Monat',
  lastMonth: 'Letzter Monat',
};

/** Date ranges for the quick buttons, as German calendar days. */
export function presetRange(preset: Preset, today = berlinToday()): DateRange {
  const [year, month] = today.split('-').map(Number);
  switch (preset) {
    case 'today':
      return { from: today, to: today };
    case 'yesterday': {
      const day = addDays(today, -1);
      return { from: day, to: day };
    }
    case 'thisMonth':
      return { from: `${today.slice(0, 7)}-01`, to: today };
    case 'lastMonth': {
      const first = month === 1 ? `${year - 1}-12-01` : `${year}-${String(month - 1).padStart(2, '0')}-01`;
      return { from: first, to: addDays(`${today.slice(0, 7)}-01`, -1) };
    }
  }
}

function addDays(day: string, days: number): string {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

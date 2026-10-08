'use client';

import { PRESET_LABELS, presetRange, type DateRange, type Preset } from './date-range';

/** Quick buttons (Heute, Gestern, …) plus two date fields for any range. */
export function RangePicker({ range, onChange }: { range: DateRange; onChange: (range: DateRange) => void }) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      {(Object.keys(PRESET_LABELS) as Preset[]).map((preset) => {
        const presetValue = presetRange(preset);
        const active = presetValue.from === range.from && presetValue.to === range.to;
        return (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(presetValue)}
            className={`min-h-10 rounded-full border px-4 text-sm ${
              active ? 'border-brand-purple bg-brand-purple text-white' : 'border-line bg-white'
            }`}
          >
            {PRESET_LABELS[preset]}
          </button>
        );
      })}
      <label className="text-ink-muted flex flex-col text-xs">
        Von
        <input
          type="date"
          value={range.from}
          max={range.to}
          onChange={(event) => event.target.value && onChange({ ...range, from: event.target.value })}
          className="border-line text-ink min-h-10 rounded-lg border px-2 text-sm"
        />
      </label>
      <label className="text-ink-muted flex flex-col text-xs">
        Bis
        <input
          type="date"
          value={range.to}
          min={range.from}
          onChange={(event) => event.target.value && onChange({ ...range, to: event.target.value })}
          className="border-line text-ink min-h-10 rounded-lg border px-2 text-sm"
        />
      </label>
    </div>
  );
}

'use client';

import { WEEKDAYS, type DayHours } from './opening-hours';

/** Seven days; each closed or open with one period, optionally a second one after a break. */
export function OpeningHoursEditor({ days, onChange }: { days: DayHours[]; onChange: (days: DayHours[]) => void }) {
  const updateDay = (index: number, day: DayHours) => onChange(days.map((old, i) => (i === index ? day : old)));

  return (
    <div className="divide-line flex flex-col divide-y">
      {days.map((day, index) => (
        <div key={WEEKDAYS[index]} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
          <label className="flex w-36 items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={day.open}
              onChange={(event) => updateDay(index, { ...day, open: event.target.checked })}
              className="accent-brand-purple size-5"
            />
            {WEEKDAYS[index]}
          </label>
          {day.open ? (
            <div className="flex flex-wrap items-center gap-2">
              {day.periods.map((period, position) => (
                <span key={position} className="flex items-center gap-1">
                  {position > 0 && <span className="text-ink-muted px-1">und</span>}
                  <TimeInput
                    label={`${WEEKDAYS[index]} öffnet`}
                    value={period.opens}
                    onChange={(opens) =>
                      updateDay(index, {
                        ...day,
                        periods: day.periods.map((p, i) => (i === position ? { ...p, opens } : p)),
                      })
                    }
                  />
                  –
                  <TimeInput
                    label={`${WEEKDAYS[index]} schließt`}
                    value={period.closes}
                    onChange={(closes) =>
                      updateDay(index, {
                        ...day,
                        periods: day.periods.map((p, i) => (i === position ? { ...p, closes } : p)),
                      })
                    }
                  />
                </span>
              ))}
              {day.periods.length === 1 ? (
                <button
                  type="button"
                  className="text-brand-purple text-sm hover:underline"
                  onClick={() => {
                    const [first] = day.periods;
                    updateDay(index, {
                      ...day,
                      periods: [
                        { opens: first.opens, closes: '12:00' },
                        { opens: '14:00', closes: first.closes },
                      ],
                    });
                  }}
                >
                  + Mittagspause
                </button>
              ) : (
                <button
                  type="button"
                  className="text-ink-muted text-sm hover:underline"
                  onClick={() =>
                    updateDay(index, {
                      ...day,
                      periods: [{ opens: day.periods[0].opens, closes: day.periods[day.periods.length - 1].closes }],
                    })
                  }
                >
                  Pause entfernen
                </button>
              )}
            </div>
          ) : (
            <span className="text-ink-muted">Geschlossen</span>
          )}
        </div>
      ))}
    </div>
  );
}

function TimeInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <input
      type="time"
      aria-label={label}
      value={value}
      step={300}
      onChange={(event) => event.target.value && onChange(event.target.value)}
      className="border-line min-h-10 rounded-lg border px-2 tabular-nums"
    />
  );
}

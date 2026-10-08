'use client';

import { useCurrentShop } from '@/features/partner/current-shop';

/** Shop name and branch; a dropdown only when the person works at more than one location. */
export function LocationSwitcher() {
  const { shop, location, choices, select } = useCurrentShop();

  if (choices.length === 1) {
    return (
      <div className="text-sm">
        <p className="font-bold">{shop.name}</p>
        <p className="text-ink-muted">
          {location.street}, {location.city}
        </p>
      </div>
    );
  }

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-ink-muted">Filiale</span>
      <select
        className="border-line min-h-11 rounded-lg border bg-white px-3"
        value={location.id}
        onChange={(event) => select(event.target.value)}
      >
        {choices.map((choice) => (
          <option key={choice.location.id} value={choice.location.id}>
            {choice.shop.name} – {choice.location.street}, {choice.location.city}
          </option>
        ))}
      </select>
    </label>
  );
}

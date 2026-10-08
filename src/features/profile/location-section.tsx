'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { TextField } from '@/components/ui/text-field';

import { hoursProblem, toDays, toPeriods } from './opening-hours';
import { OpeningHoursEditor } from './opening-hours-editor';
import { profileQuery, updateLocation, type ShopProfile } from './profile-api';
import { SaveFeedback, useSave } from './use-save';

type Location = ShopProfile['locations'][number];

/** Phone and opening hours of one branch (the one chosen in the sidebar). */
export function LocationSection({ partnerId, location }: { partnerId: string; location: Location }) {
  const [phone, setPhone] = useState(location.phone ?? '');
  const [days, setDays] = useState(() => toDays(location.openingHours));
  const [problem, setProblem] = useState<string | null>(null);
  const save = useSave(profileQuery(partnerId).queryKey, {
    validation_failed: 'Bitte Telefonnummer und Zeiten prüfen.',
  });

  return (
    <SectionCard
      title="Öffnungszeiten & Telefon"
      description={`${location.street}, ${location.postalCode} ${location.city}`}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          const found = hoursProblem(days);
          setProblem(found);
          if (!found) void save.run(() => updateLocation(partnerId, location.id, phone, toPeriods(days)));
        }}
      >
        <TextField
          label="Telefon (optional)"
          type="tel"
          placeholder="03573 123456"
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            save.reset();
          }}
        />
        <OpeningHoursEditor
          days={days}
          onChange={(next) => {
            setDays(next);
            setProblem(null);
            save.reset();
          }}
        />
        {problem && (
          <p role="alert" className="text-error text-sm">
            {problem}
          </p>
        )}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={save.state.status === 'saving'}>
            Speichern
          </Button>
          <SaveFeedback state={save.state} />
        </div>
      </form>
    </SectionCard>
  );
}

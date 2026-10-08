'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { TextField } from '@/components/ui/text-field';
import { berlinToday, formatDay } from '@/lib/berlin-date';

import { profileQuery, removeDeal, setDeal, type ShopProfile } from './profile-api';
import { SaveFeedback, useSave } from './use-save';

const MAX_TITLE = 80;

/** One running offer for KollektivO users, shown on the shop in the app. */
export function DealSection({ profile }: { profile: ShopProfile }) {
  const [title, setTitle] = useState('');
  const [endsOn, setEndsOn] = useState('');
  const save = useSave(profileQuery(profile.partnerId).queryKey, {
    validation_failed: 'Bitte einen Text und ein Enddatum in der Zukunft angeben.',
  });

  return (
    <SectionCard
      title="Aktion für KollektivO-Nutzer"
      description="z. B. „10 % auf alle Kuchen“. Wird in der App bei Ihrem Laden hervorgehoben."
    >
      {profile.deal && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface p-4">
          <div>
            <p className="font-bold">{profile.deal.title}</p>
            <p className="text-sm text-ink-muted">läuft bis {formatDay(berlinDayOf(profile.deal.endsAt))}</p>
          </div>
          <Button
            variant="danger"
            disabled={save.state.status === 'saving'}
            onClick={() => void save.run(() => removeDeal(profile.partnerId))}
          >
            Beenden
          </Button>
        </div>
      )}
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void save.run(async () => {
            await setDeal(profile.partnerId, title.trim(), endsOn || undefined);
            setTitle('');
            setEndsOn('');
          });
        }}
      >
        <TextField
          label={profile.deal ? 'Neue Aktion (ersetzt die laufende)' : 'Aktion'}
          maxLength={MAX_TITLE}
          placeholder="10 % auf alle Kuchen"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            save.reset();
          }}
        />
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Gültig bis (optional, sonst ein Jahr)
          <input
            type="date"
            min={berlinToday()}
            value={endsOn}
            onChange={(event) => setEndsOn(event.target.value)}
            className="min-h-12 max-w-xs rounded-xl border border-line px-4 font-normal"
          />
        </label>
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={!title.trim() || save.state.status === 'saving'}>
            Aktion starten
          </Button>
          <SaveFeedback state={save.state} />
        </div>
      </form>
    </SectionCard>
  );
}

function berlinDayOf(iso: string): string {
  return berlinToday(new Date(iso));
}

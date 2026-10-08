'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { TextField } from '@/components/ui/text-field';

import { profileQuery, updateProfile, type ShopProfile } from './profile-api';
import { SaveFeedback, useSave } from './use-save';

const MAX_DESCRIPTION = 600;

export function AboutSection({ profile }: { profile: ShopProfile }) {
  const [description, setDescription] = useState(profile.description);
  const [website, setWebsite] = useState(profile.website ?? '');
  const save = useSave(profileQuery(profile.partnerId).queryKey, {
    validation_failed: 'Bitte eine Webadresse wie www.laden.de eingeben.',
  });

  return (
    <SectionCard title="Über den Laden" description="Erscheint auf Ihrer Seite in der KollektivO-App.">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void save.run(() => updateProfile(profile.partnerId, description, website));
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium">
            Beschreibung
          </label>
          <textarea
            id="description"
            rows={4}
            maxLength={MAX_DESCRIPTION}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              save.reset();
            }}
            placeholder="z. B. Familienbäckerei seit 1952 – frische Brötchen ab 6 Uhr."
            className="rounded-xl border border-line p-3 outline-none focus:border-brand-purple"
          />
          <span className="self-end text-xs text-ink-muted">
            {description.length}/{MAX_DESCRIPTION}
          </span>
        </div>
        <TextField
          label="Webseite (optional)"
          inputMode="url"
          placeholder="www.ihr-laden.de"
          value={website}
          onChange={(event) => {
            setWebsite(event.target.value);
            save.reset();
          }}
        />
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

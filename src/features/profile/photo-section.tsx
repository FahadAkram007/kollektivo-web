'use client';

import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';

import { profileQuery, uploadPhoto, type ShopProfile } from './profile-api';
import { shrinkPhoto } from './shrink-photo';
import { SaveFeedback, useSave } from './use-save';

/** The shop's photo in the app (shop page and lists). */
export function PhotoSection({ profile }: { profile: ShopProfile }) {
  const input = useRef<HTMLInputElement>(null);
  const save = useSave(profileQuery(profile.partnerId).queryKey, {
    validation_failed: 'Bitte ein Foto im Format JPG, PNG oder WebP wählen.',
  });

  async function upload(file: File) {
    await save.run(async () => uploadPhoto(profile.partnerId, await shrinkPhoto(file)));
  }

  return (
    <SectionCard title="Foto" description="Am besten ein helles Foto Ihres Ladens oder Ihrer Theke im Querformat.">
      <div className="bg-surface aspect-[16/9] w-full max-w-md overflow-hidden rounded-xl">
        {profile.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- photo comes from the API host
          <img src={profile.imageUrl} alt={`Foto von ${profile.name}`} className="size-full object-cover" />
        ) : (
          <div className="text-ink-muted flex size-full items-center justify-center">Noch kein Foto</div>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) void upload(file);
        }}
      />
      <div className="flex items-center gap-4">
        <Button variant="secondary" disabled={save.state.status === 'saving'} onClick={() => input.current?.click()}>
          {save.state.status === 'saving'
            ? 'Wird hochgeladen …'
            : profile.imageUrl
              ? 'Foto ersetzen'
              : 'Foto hochladen'}
        </Button>
        <SaveFeedback state={save.state} />
      </div>
    </SectionCard>
  );
}

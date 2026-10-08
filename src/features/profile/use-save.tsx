'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ApiError } from '@/lib/api-client';

type SaveState = { status: 'idle' | 'saving' | 'saved' } | { status: 'failed'; message: string };

/** Runs a save, then reloads the profile; [messages] turns API error codes into German texts. */
export function useSave(queryKey: readonly unknown[], messages: Record<string, string> = {}) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SaveState>({ status: 'idle' });

  async function run(action: () => Promise<void>) {
    setState({ status: 'saving' });
    try {
      await action();
      await queryClient.invalidateQueries({ queryKey });
      setState({ status: 'saved' });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? (messages[error.code] ?? 'Speichern fehlgeschlagen. Bitte erneut versuchen.')
          : 'Keine Verbindung. Bitte erneut versuchen.';
      setState({ status: 'failed', message });
    }
  }

  return { state, run, reset: () => setState({ status: 'idle' }) };
}

export function SaveFeedback({ state }: { state: SaveState }) {
  if (state.status === 'saved') return <p className="text-success text-sm">✓ Gespeichert</p>;
  if (state.status === 'failed') {
    return (
      <p role="alert" className="text-error text-sm">
        {state.message}
      </p>
    );
  }
  return null;
}

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { TextField } from '@/components/ui/text-field';

import { useAuth } from './auth-provider';
import { sendSignInCode, signInErrorMessage, verifySignInCode } from './sign-in-api';

/** Two steps, like the app: email → 6-digit code from the email. */
export function SignInForm() {
  const router = useRouter();
  const { state } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setStep('email');
    setCode('');
    setError(null);
  }

  useEffect(() => {
    if (state.status === 'signed-in') router.replace('/');
  }, [state.status, router]);

  // Next.js keeps visited pages in memory (React Activity): clear the form when the page is left, so signing
  // out starts again at the email step instead of showing the old code.
  useLayoutEffect(() => reset, []);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (caught) {
      setError(signInErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  const submitEmail = () =>
    run(async () => {
      await sendSignInCode(email.trim());
      setStep('code');
    });
  const submitCode = () => run(() => verifySignInCode(email.trim(), code));

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        void (step === 'email' ? submitEmail() : submitCode());
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <Logo height={36} />
        <h1 className="text-xl font-bold">Händler- & Firmenportal</h1>
      </div>

      {step === 'email' ? (
        <>
          <p className="text-sm text-ink-muted">
            Melden Sie sich mit der E-Mail-Adresse an, an die Ihre Einladung ging. Wir senden Ihnen einen Code.
          </p>
          <TextField
            label="E-Mail-Adresse"
            type="email"
            autoComplete="email"
            required
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" disabled={busy || !email.trim()}>
            Code senden
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-ink-muted">
            Wir haben einen 6-stelligen Code an <strong className="text-ink">{email.trim()}</strong> gesendet.
          </p>
          <TextField
            label="Code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            autoFocus
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
            className="min-h-14 rounded-xl border border-line px-4 text-center text-2xl tracking-[0.5em] outline-none focus:border-brand-purple"
          />
          <Button type="submit" disabled={busy || code.length !== 6}>
            Anmelden
          </Button>
          <button
            type="button"
            className="text-sm text-brand-purple underline-offset-2 hover:underline"
            onClick={reset}
          >
            Andere E-Mail-Adresse
          </button>
        </>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-error">
          {error}
        </p>
      )}
    </form>
  );
}

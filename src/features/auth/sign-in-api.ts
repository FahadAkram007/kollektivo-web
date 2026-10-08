import { signInWithCustomToken } from 'firebase/auth';

import { api, ApiError, unwrap } from '@/lib/api-client';
import { firebaseAuth } from '@/lib/firebase';

/** Emails a 6-digit code. Only shop staff and HR people get one (`app: 'portal'`). */
export async function sendSignInCode(email: string): Promise<void> {
  unwrap(await api.POST('/v1/auth/sign-in-codes', { body: { email, app: 'portal' } }));
}

/** Checks the code and starts the Firebase session. */
export async function verifySignInCode(email: string, code: string): Promise<void> {
  const session = unwrap(await api.POST('/v1/auth/sessions', { body: { email, code, app: 'portal' } }));
  await signInWithCustomToken(firebaseAuth(), session.firebaseCustomToken);
}

/** What to tell the person when signing in fails. */
export function signInErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung.';
  switch (error.code) {
    case 'account_not_found':
      return 'Für diese E-Mail-Adresse gibt es keinen Zugang zum Portal.';
    case 'sign_in_code_invalid':
      return 'Der Code ist falsch. Bitte prüfen Sie die E-Mail.';
    case 'sign_in_code_expired':
      return 'Der Code ist abgelaufen. Bitte fordern Sie einen neuen an.';
    case 'too_many_attempts':
      return 'Zu viele Versuche. Bitte warten Sie kurz und versuchen Sie es erneut.';
    case 'validation_failed':
      return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    default:
      return 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.';
  }
}

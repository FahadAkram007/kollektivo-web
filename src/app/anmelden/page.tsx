import type { Metadata } from 'next';

import { SignInForm } from '@/features/auth/sign-in-form';

export const metadata: Metadata = { title: 'Anmelden' };

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-surface p-4">
      <SignInForm />
    </main>
  );
}

import type { Metadata } from 'next';

import { SignInForm } from '@/features/auth/sign-in-form';

export const metadata: Metadata = { title: 'Anmelden' };

export default function SignInPage() {
  return (
    <main className="bg-surface flex flex-1 items-center justify-center p-4">
      <SignInForm />
    </main>
  );
}

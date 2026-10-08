'use client';

import { onAuthStateChanged, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { firebaseAuth } from '@/lib/firebase';

type AuthState = { status: 'loading' } | { status: 'signed-out' } | { status: 'signed-in'; user: User };

interface AuthContextValue {
  state: AuthState;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Follows the Firebase session (kept in the browser across reloads). */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(
    () =>
      onAuthStateChanged(firebaseAuth(), (user) =>
        setState(user ? { status: 'signed-in', user } : { status: 'signed-out' }),
      ),
    [],
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(firebaseAuth());
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(() => ({ state, signOut }), [state, signOut]);
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth needs an <AuthProvider>');
  return value;
}

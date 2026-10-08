import { getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';

/**
 * Firebase is only used for the session: the API hands out a custom token after the email code,
 * Firebase turns it into an ID token that is sent with every API request and refreshed automatically.
 * Browser only; call it from effects and event handlers, never while rendering on the server.
 */
export function firebaseAuth(): Auth {
  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });
  return getAuth(app);
}

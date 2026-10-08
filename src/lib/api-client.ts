import createClient, { type Middleware } from 'openapi-fetch';

import type { components, paths } from './api-types';
import { firebaseAuth } from './firebase';

export type Schemas = components['schemas'];

/** The KollektivO API, typed from its OpenAPI file (`npm run api:types` after API changes). */
export const api = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_API_URL });

const bearerToken: Middleware = {
  async onRequest({ request }) {
    const user = firebaseAuth().currentUser;
    if (user) request.headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
    return request;
  },
};
api.use(bearerToken);

/** An expected error from the API: `{ error: { code, message } }`. The UI switches on `code`. */
export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Returns the data of an openapi-fetch result or throws an [ApiError]; for use in TanStack Query. */
export function unwrap<T>(result: { data?: T; error?: unknown; response: Response }): T {
  if (result.error === undefined) return result.data as T;
  const body = result.error as { error?: { code?: string; message?: string } };
  throw new ApiError(
    body.error?.code ?? 'unknown',
    body.error?.message ?? `Request failed (${result.response.status})`,
    result.response.status,
  );
}

import { queryOptions } from '@tanstack/react-query';

import { api, unwrap } from '@/lib/api-client';

/** The signed-in HR person and the companies they manage (empty for shop-only people). */
export const employerMeQuery = queryOptions({
  queryKey: ['employer', 'me'],
  queryFn: async () => unwrap(await api.GET('/v1/employer/me')),
  staleTime: 5 * 60 * 1000,
});

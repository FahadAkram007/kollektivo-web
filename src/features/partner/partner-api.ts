import { queryOptions } from '@tanstack/react-query';

import { api, unwrap } from '@/lib/api-client';

/** The signed-in person with their shops, locations, till and printed QR code. */
export const partnerMeQuery = queryOptions({
  queryKey: ['partner', 'me'],
  queryFn: async () => unwrap(await api.GET('/v1/partner/me')),
  staleTime: 5 * 60 * 1000,
});

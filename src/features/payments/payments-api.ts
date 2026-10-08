import { infiniteQueryOptions } from '@tanstack/react-query';

import { api, unwrap, type Schemas } from '@/lib/api-client';

import type { DateRange } from './date-range';

export type PaymentRow = Schemas['PartnerPaymentRowDto'];
export type PaymentsPage = Schemas['PartnerPaymentsPageDto'];

/** The shop's payments in a date range, 50 at a time ("Ältere laden"). */
export const paymentsQuery = (partnerId: string, range: DateRange, locationId?: string) =>
  infiniteQueryOptions({
    queryKey: ['payments', partnerId, range.from, range.to, locationId ?? 'all'],
    queryFn: async ({ pageParam }) =>
      unwrap(
        await api.GET('/v1/partner/shops/{partnerId}/payments', {
          params: { path: { partnerId }, query: { ...range, locationId, before: pageParam } },
        }),
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextBefore ?? undefined,
    refetchInterval: 30_000,
  });

/** Downloads the CSV export (owners only) as a file. */
export async function downloadPaymentsCsv(partnerId: string, range: DateRange, locationId?: string): Promise<void> {
  const result = await api.GET('/v1/partner/shops/{partnerId}/payments/csv', {
    params: { path: { partnerId }, query: { ...range, locationId } },
    parseAs: 'blob',
  });
  const blob = unwrap(result) as unknown as Blob;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kollektivo-zahlungen-${range.from}-bis-${range.to}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

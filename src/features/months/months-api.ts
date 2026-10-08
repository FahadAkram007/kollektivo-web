import { queryOptions } from '@tanstack/react-query';

import { api, unwrap, type Schemas } from '@/lib/api-client';

export type MonthSummary = Schemas['MonthSummaryDto'];
export type MonthDetail = Schemas['MonthDetailDto'];

export const monthsQuery = (employerId: string) =>
  queryOptions({
    queryKey: ['months', employerId],
    queryFn: async () =>
      unwrap(await api.GET('/v1/employer/companies/{employerId}/months', { params: { path: { employerId } } })),
  });

export const monthDetailQuery = (employerId: string, period: string) =>
  queryOptions({
    queryKey: ['months', employerId, period],
    queryFn: async () =>
      unwrap(
        await api.GET('/v1/employer/companies/{employerId}/months/{period}', {
          params: { path: { employerId, period } },
        }),
      ),
  });

/** Downloads the payroll CSV of [period]. */
export async function downloadPayrollCsv(employerId: string, period: string): Promise<void> {
  const blob = unwrap(
    await api.GET('/v1/employer/companies/{employerId}/months/{period}/payroll', {
      params: { path: { employerId, period } },
      parseAs: 'blob',
    }),
  ) as unknown as Blob;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kollektivo-sachbezug-${period}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

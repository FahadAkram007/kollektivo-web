import { queryOptions } from '@tanstack/react-query';

import { api, unwrap, type Schemas } from '@/lib/api-client';

export type ShopProfile = Schemas['ShopProfileDto'];
export type OpeningPeriod = Schemas['OpeningPeriodDto'];

export const profileQuery = (partnerId: string) =>
  queryOptions({
    queryKey: ['profile', partnerId],
    queryFn: async () =>
      unwrap(await api.GET('/v1/partner/shops/{partnerId}/profile', { params: { path: { partnerId } } })),
  });

const path = (partnerId: string) => ({ params: { path: { partnerId } } });

export async function updateProfile(partnerId: string, description: string, website: string): Promise<void> {
  unwrap(
    await api.PUT('/v1/partner/shops/{partnerId}/profile', { ...path(partnerId), body: { description, website } }),
  );
}

export async function updateLocation(
  partnerId: string,
  locationId: string,
  phone: string,
  openingHours: OpeningPeriod[],
): Promise<void> {
  unwrap(
    await api.PUT('/v1/partner/shops/{partnerId}/locations/{locationId}', {
      params: { path: { partnerId, locationId } },
      body: { phone, openingHours },
    }),
  );
}

export async function setDeal(partnerId: string, title: string, endsOn: string | undefined): Promise<void> {
  unwrap(await api.PUT('/v1/partner/shops/{partnerId}/deal', { ...path(partnerId), body: { title, endsOn } }));
}

export async function removeDeal(partnerId: string): Promise<void> {
  unwrap(await api.DELETE('/v1/partner/shops/{partnerId}/deal', path(partnerId)));
}

export async function uploadPhoto(partnerId: string, photo: Blob): Promise<void> {
  const form = new FormData();
  form.append('photo', photo, 'foto.jpg');
  unwrap(
    await api.POST('/v1/partner/shops/{partnerId}/photo', {
      ...path(partnerId),
      // Sent as multipart as it is; the browser sets the boundary header.
      body: form as unknown as { photo?: string },
      bodySerializer: (body) => body as unknown as FormData,
    }),
  );
}

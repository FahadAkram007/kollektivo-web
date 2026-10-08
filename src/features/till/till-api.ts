import { queryOptions } from '@tanstack/react-query';

import { api, unwrap, type Schemas } from '@/lib/api-client';

export type CreatedRequest = Schemas['CreatedPaymentRequestDto'];
export type RequestStatus = Schemas['PaymentRequestStatusDto'];
export type PartnerPayment = Schemas['PartnerPaymentDto'];

/** The till asks for an amount: returns QR payload + 6-digit code for the customer. */
export async function createPaymentRequest(tillId: string, amountCents: number): Promise<CreatedRequest> {
  return unwrap(await api.POST('/v1/partner/payment-requests', { body: { checkoutPointId: tillId, amountCents } }));
}

export async function cancelPaymentRequest(requestId: string): Promise<RequestStatus> {
  return unwrap(await api.POST('/v1/partner/payment-requests/{id}/cancel', { params: { path: { id: requestId } } }));
}

/** Polled while the code is shown: has the customer paid yet? */
export const requestStatusQuery = (requestId: string) =>
  queryOptions({
    queryKey: ['till', 'request', requestId],
    queryFn: async () =>
      unwrap(await api.GET('/v1/partner/payment-requests/{id}', { params: { path: { id: requestId } } })),
    refetchInterval: (query) => (query.state.data?.status === 'open' ? 1500 : false),
  });

/** Printed-QR payments at this location waiting for the shop's answer. */
export const pendingPaymentsQuery = (partnerId: string, locationId: string) =>
  queryOptions({
    queryKey: ['till', 'pending', partnerId, locationId],
    queryFn: async () =>
      unwrap(
        await api.GET('/v1/partner/shops/{partnerId}/pending-payments', {
          params: { path: { partnerId }, query: { locationId } },
        }),
      ),
    refetchInterval: 3000,
  });

export async function acceptPayment(paymentId: string): Promise<PartnerPayment> {
  return unwrap(await api.POST('/v1/partner/payments/{id}/accept', { params: { path: { id: paymentId } } }));
}

export async function declinePayment(paymentId: string): Promise<PartnerPayment> {
  return unwrap(await api.POST('/v1/partner/payments/{id}/decline', { params: { path: { id: paymentId } } }));
}

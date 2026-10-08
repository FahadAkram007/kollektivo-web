'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useCurrentShop } from '@/features/partner/current-shop';

import { presetRange, type DateRange } from './date-range';
import { RangePicker } from './range-picker';
import { PaymentList } from './payment-list';
import { PaymentTotals } from './payment-totals';
import { downloadPaymentsCsv, paymentsQuery } from './payments-api';

const ALL_LOCATIONS = 'all';

/** "Zahlungen": today by default, any date range, totals, CSV export for owners. */
export function PaymentsScreen() {
  // Switching the branch in the sidebar starts fresh with that branch selected.
  const { location } = useCurrentShop();
  return <PaymentsForLocation key={location.id} />;
}

function PaymentsForLocation() {
  const { shop, location, isOwner } = useCurrentShop();
  const [range, setRange] = useState<DateRange>(() => presetRange('today'));
  const [locationChoice, setLocationChoice] = useState<string>(location.id);
  const [exporting, setExporting] = useState(false);
  const [exportFailed, setExportFailed] = useState(false);

  const locationId = locationChoice === ALL_LOCATIONS ? undefined : locationChoice;
  const payments = useInfiniteQuery(paymentsQuery(shop.partnerId, range, locationId));
  const first = payments.data?.pages[0];

  async function exportCsv() {
    setExporting(true);
    setExportFailed(false);
    try {
      await downloadPaymentsCsv(shop.partnerId, range, locationId);
    } catch {
      setExportFailed(true);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 px-4 pb-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <RangeAndLocation
          range={range}
          onRange={setRange}
          locations={shop.locations}
          locationChoice={locationChoice}
          onLocation={setLocationChoice}
        />
        {isOwner && (
          <Button variant="secondary" onClick={() => void exportCsv()} disabled={exporting}>
            CSV exportieren
          </Button>
        )}
      </div>
      {exportFailed && (
        <p role="alert" className="text-error text-sm">
          Der Export ist fehlgeschlagen. Bitte erneut versuchen.
        </p>
      )}

      {payments.isPending ? (
        <Spinner />
      ) : payments.isError || !first ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-ink-muted">Die Zahlungen konnten nicht geladen werden.</p>
          <Button variant="secondary" onClick={() => void payments.refetch()}>
            Erneut versuchen
          </Button>
        </div>
      ) : (
        <>
          <PaymentTotals totals={first.totals} />
          <PaymentList payments={payments.data.pages.flatMap((page) => page.items)} />
          {payments.hasNextPage && (
            <Button
              variant="secondary"
              className="self-center"
              onClick={() => void payments.fetchNextPage()}
              disabled={payments.isFetchingNextPage}
            >
              Ältere laden
            </Button>
          )}
        </>
      )}
    </div>
  );
}

function RangeAndLocation({
  range,
  onRange,
  locations,
  locationChoice,
  onLocation,
}: {
  range: DateRange;
  onRange: (range: DateRange) => void;
  locations: { id: string; street: string; city: string }[];
  locationChoice: string;
  onLocation: (choice: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <RangePicker range={range} onChange={onRange} />
      {locations.length > 1 && (
        <label className="text-ink-muted flex flex-col text-xs">
          Filiale
          <select
            value={locationChoice}
            onChange={(event) => onLocation(event.target.value)}
            className="border-line text-ink min-h-10 rounded-lg border bg-white px-2 text-sm"
          >
            <option value={ALL_LOCATIONS}>Alle Filialen</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.street}, {location.city}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}

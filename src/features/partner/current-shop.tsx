'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { Schemas } from '@/lib/api-client';

type PartnerMe = Schemas['PartnerMeDto'];
type Shop = Schemas['PartnerShopDto'];
type Location = Schemas['PartnerLocationDto'];

interface CurrentShop {
  me: PartnerMe;
  shop: Shop;
  location: Location;
  /** Owners also see payments export, profile, team and the QR sticker. */
  isOwner: boolean;
  /** Every location the person can work at, across shops. */
  choices: { shop: Shop; location: Location }[];
  select: (locationId: string) => void;
}

const CurrentShopContext = createContext<CurrentShop | null>(null);
const STORAGE_KEY = 'kollektivo.locationId';

/** Which shop location this device works for. Remembered per device, e.g. the tablet at the counter. */
export function CurrentShopProvider({ me, children }: { me: PartnerMe; children: React.ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(readStoredLocation);

  const select = useCallback((locationId: string) => {
    setSelectedId(locationId);
    try {
      localStorage.setItem(STORAGE_KEY, locationId);
    } catch {
      // Private mode: the choice just isn't remembered.
    }
  }, []);

  const value = useMemo(() => {
    const choices = me.shops.flatMap((shop) => shop.locations.map((location) => ({ shop, location })));
    const current = choices.find((choice) => choice.location.id === selectedId) ?? choices[0];
    if (!current) return null;
    return { me, ...current, isOwner: current.shop.role === 'owner', choices, select };
  }, [me, selectedId, select]);

  if (!value) return <NoShopAccess />;
  return <CurrentShopContext value={value}>{children}</CurrentShopContext>;
}

export function useCurrentShop(): CurrentShop {
  const value = useContext(CurrentShopContext);
  if (!value) throw new Error('useCurrentShop needs a <CurrentShopProvider>');
  return value;
}

function readStoredLocation(): string | null {
  try {
    return typeof window === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function NoShopAccess() {
  return (
    <p className="p-6 text-center text-ink-muted">
      Ihr Zugang ist keiner Filiale zugeordnet. Bitte wenden Sie sich an support@kollektivo.de.
    </p>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { useCurrentShop } from '@/features/partner/current-shop';
import { OwnerOnly } from '@/features/portal/owner-only';

import { QrSticker } from './qr-sticker';

/** "QR-Code": preview and print the sticker for the branch chosen in the sidebar. */
export function QrStickerScreen() {
  return (
    <OwnerOnly>
      <StickerForLocation />
    </OwnerOnly>
  );
}

function StickerForLocation() {
  const { shop, location } = useCurrentShop();

  if (!location.printedQrPayload) {
    return (
      <p className="px-4 text-ink-muted md:px-8">
        Für diese Filiale gibt es noch keinen QR-Code. Bitte melden Sie sich beim Support.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 md:flex-row md:items-start md:px-8 print:p-0">
      {/* Only the sticker is printed, at its real size. */}
      <style>{'@page { margin: 10mm; }'}</style>
      <div className="max-w-full overflow-x-auto">
        <QrSticker
          payload={location.printedQrPayload}
          shopName={shop.name}
          address={`${location.street}, ${location.postalCode} ${location.city}`}
        />
      </div>
      <div className="flex max-w-sm flex-col gap-4 print:hidden">
        <p className="text-sm text-ink-muted">
          Kunden scannen diesen Code mit der KollektivO-App und geben den Betrag selbst ein. Die Zahlung erscheint dann
          unter <strong className="text-ink">Kasse</strong> und wird dort angenommen.
        </p>
        <ul className="list-disc pl-5 text-sm text-ink-muted">
          <li>Auf A4 drucken mit „Tatsächliche Größe“ (100 %), dann ausschneiden.</li>
          <li>Gut sichtbar an der Kasse anbringen, am besten laminiert.</li>
          <li>Der Code gehört zu dieser Filiale und ändert sich nicht.</li>
        </ul>
        <Button onClick={() => window.print()}>Drucken</Button>
      </div>
    </div>
  );
}

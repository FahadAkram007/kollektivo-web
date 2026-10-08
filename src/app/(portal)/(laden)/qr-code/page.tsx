import type { Metadata } from 'next';

import { PageHeader } from '@/components/ui/page-header';
import { QrStickerScreen } from '@/features/qr-sticker/qr-sticker-screen';

export const metadata: Metadata = { title: 'QR-Code' };

export default function QrCodePage() {
  return (
    <>
      <PageHeader title="QR-Code für die Kasse" />
      <QrStickerScreen />
    </>
  );
}

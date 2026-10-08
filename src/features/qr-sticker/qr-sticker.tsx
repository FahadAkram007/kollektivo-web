import { QrImage } from '@/components/ui/qr-image';

const STEPS = ['KollektivO-App öffnen', 'Diesen QR-Code scannen', 'Betrag eingeben und bestätigen'];

/**
 * The counter sticker, exactly A6 (105 × 148 mm) on screen and on paper.
 * Customers scan it and type the amount; the till then accepts the payment.
 */
export function QrSticker({ payload, shopName, address }: { payload: string; shopName: string; address: string }) {
  return (
    <div className="flex h-[148mm] w-[105mm] flex-col items-center overflow-hidden rounded-[4mm] border border-line bg-white text-center shadow-sm print:rounded-none print:border-ink print:shadow-none">
      <div className="h-[4mm] w-full bg-brand-gradient print:[print-color-adjust:exact]" />
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, printed as is */}
      <img src="/brand/logo_full.svg" alt="KollektivO" className="mt-[6mm] h-[9mm]" />
      <p className="mt-[5mm] px-[6mm] text-[17pt] leading-tight font-bold">Hier mit KollektivO bezahlen</p>
      <div className="mt-[4mm]">
        <QrImage value={payload} size={264} scale={4} label={`QR-Code von ${shopName}`} />
      </div>
      <p className="mt-[3mm] px-[6mm] text-[11pt] font-bold">{shopName}</p>
      <p className="px-[6mm] text-[8pt] text-ink-muted">{address}</p>
      <ol className="mt-auto mb-[6mm] flex w-full justify-between gap-[2mm] px-[6mm] text-left text-[7.5pt] leading-tight">
        {STEPS.map((step, index) => (
          <li key={step} className="flex flex-1 items-start gap-[1.5mm]">
            <span className="flex size-[5mm] shrink-0 items-center justify-center rounded-full bg-brand-gradient text-[7pt] font-bold text-white print:[print-color-adjust:exact]">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

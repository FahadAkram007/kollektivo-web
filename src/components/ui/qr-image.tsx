'use client';

import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

/** A QR code for [value], drawn in the browser (nothing leaves the device). */
/** [scale] renders more pixels than shown, for sharp printing. */
export function QrImage({
  value,
  size = 280,
  label,
  scale = 2,
}: {
  value: string;
  size?: number;
  label: string;
  scale?: number;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let current = true;
    void QRCode.toDataURL(value, { width: size * scale, margin: 1, errorCorrectionLevel: 'M' }).then((url) => {
      if (current) setSrc(url);
    });
    return () => {
      current = false;
    };
  }, [value, size, scale]);

  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL, nothing to optimise */}
      {src && <img src={src} alt={label} width={size} height={size} style={{ imageRendering: 'pixelated' }} />}
    </div>
  );
}

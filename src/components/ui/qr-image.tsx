'use client';

import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

/** A QR code for [value], drawn in the browser (nothing leaves the device). */
export function QrImage({ value, size = 280, label }: { value: string; size?: number; label: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let current = true;
    void QRCode.toDataURL(value, { width: size * 2, margin: 1, errorCorrectionLevel: 'M' }).then((url) => {
      if (current) setSrc(url);
    });
    return () => {
      current = false;
    };
  }, [value, size]);

  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL, nothing to optimise */}
      {src && <img src={src} alt={label} width={size} height={size} />}
    </div>
  );
}

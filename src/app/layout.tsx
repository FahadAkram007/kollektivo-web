import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import './globals.css';
import { Providers } from './providers';

const poppins = localFont({
  src: [
    { path: '../fonts/Poppins-Regular.ttf', weight: '400' },
    { path: '../fonts/Poppins-Medium.ttf', weight: '500' },
    { path: '../fonts/Poppins-Bold.ttf', weight: '700' },
  ],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: { default: 'KollektivO Shop-Portal', template: '%s · KollektivO' },
  description: 'Zahlungen mit dem KollektivO-Guthaben annehmen.',
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: '#8F306E',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="de" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

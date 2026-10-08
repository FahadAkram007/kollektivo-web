import type { MetadataRoute } from 'next';

/** Installable on the counter tablet or phone ("Zum Startbildschirm hinzufügen"). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KollektivO Shop-Portal',
    short_name: 'KollektivO Kasse',
    description: 'Zahlungen mit dem KollektivO-Guthaben annehmen.',
    start_url: '/kasse',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8F306E',
    lang: 'de',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}

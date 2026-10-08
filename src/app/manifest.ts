import type { MetadataRoute } from 'next';

/** Installable on the counter tablet or phone ("Zum Startbildschirm hinzufügen"). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KollektivO Portal',
    short_name: 'KollektivO',
    description: 'Zahlungen annehmen und Mitarbeitende verwalten.',
    start_url: '/',
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

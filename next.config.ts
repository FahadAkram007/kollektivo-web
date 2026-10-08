import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    // Pages only render after the sign-in check in the browser, so Next.js can't validate instant
    // navigation for them. Validate only segments that opt in with `export const instant`.
    instantInsights: { validationLevel: 'manual-warning' },
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;

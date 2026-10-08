import Image from 'next/image';

/** Gradient fox + black wordmark. */
export function Logo({ height = 32 }: { height?: number }) {
  return <Image src="/brand/logo_full.svg" alt="KollektivO" height={height} width={(height * 535) / 120} priority />;
}

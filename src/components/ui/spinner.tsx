export function Spinner({ label = 'Wird geladen …' }: { label?: string }) {
  return (
    <div role="status" className="flex flex-1 items-center justify-center p-10">
      <span className="border-line border-t-brand-purple size-8 animate-spin rounded-full border-4" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

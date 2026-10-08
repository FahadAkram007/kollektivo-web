export function Spinner({ label = 'Wird geladen …' }: { label?: string }) {
  return (
    <div role="status" className="flex flex-1 items-center justify-center p-10">
      <span className="size-8 animate-spin rounded-full border-4 border-line border-t-brand-purple" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

const STATUS: Record<string, { label: string; className: string }> = {
  completed: { label: 'Bezahlt', className: 'bg-green-50 text-success' },
  declined: { label: 'Abgelehnt', className: 'bg-surface text-ink-muted' },
  timed_out: { label: 'Nicht angenommen', className: 'bg-surface text-ink-muted' },
  refunded: { label: 'Erstattet', className: 'bg-amber-50 text-ink' },
  partially_refunded: { label: 'Teilweise erstattet', className: 'bg-amber-50 text-ink' },
  awaiting_shop: { label: 'Wartet', className: 'bg-amber-50 text-ink' },
};

export function PaymentStatus({ status }: { status: string }) {
  const { label, className } = STATUS[status] ?? { label: status, className: 'bg-surface' };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${className}`}>{label}</span>
  );
}

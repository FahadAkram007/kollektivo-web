export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-line flex flex-col gap-4 rounded-2xl border bg-white p-5">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="text-ink-muted text-sm">{description}</p>}
      </div>
      {children}
    </section>
  );
}

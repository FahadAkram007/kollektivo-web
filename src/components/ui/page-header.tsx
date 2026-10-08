export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 pt-6 pb-4 md:px-8 print:hidden">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </header>
  );
}

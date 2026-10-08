import { useId, type InputHTMLAttributes } from 'react';

export function TextField({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-ink text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        className="border-line focus:border-brand-purple focus:ring-brand-purple/20 min-h-12 rounded-xl border px-4 text-base outline-none focus:ring-2"
        {...props}
      />
    </div>
  );
}

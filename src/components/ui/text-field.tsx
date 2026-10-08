import { useId, type InputHTMLAttributes } from 'react';

export function TextField({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        className="min-h-12 rounded-xl border border-line px-4 text-base outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
        {...props}
      />
    </div>
  );
}

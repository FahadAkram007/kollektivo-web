import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-gradient text-white',
  secondary: 'border border-line bg-white text-ink hover:bg-surface',
  danger: 'border border-error bg-white text-error hover:bg-red-50',
};

/** Classes of a button, e.g. for a link that looks like one. */
export function buttonClass(variant: Variant = 'primary', className = ''): string {
  return `inline-flex min-h-12 items-center justify-center rounded-xl px-5 text-base font-bold transition disabled:opacity-50 ${variants[variant]} ${className}`;
}

/** Large touch-friendly button; Poppins Bold on the gradient for contrast (styleguide). */
export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

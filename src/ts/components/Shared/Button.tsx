import type { ComponentChildren } from 'preact';

export interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  children?: ComponentChildren;
}

const VARIANT_CLASS: Record<string, string> = {
  primary:   'xb-btn-primary',
  secondary: 'xb-btn-secondary',
  danger:    'xb-btn-danger',
};

export function Button({
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  children,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      class={`xb-btn ${VARIANT_CLASS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

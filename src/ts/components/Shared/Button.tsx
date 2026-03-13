import type { ComponentChildren } from 'preact';

export interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  children?: ComponentChildren;
}

const VARIANT_STYLES: Record<string, Record<string, string>> = {
  primary: {
    background: 'var(--xb-btn-primary-bg)',
    color: 'var(--xb-btn-primary-color)',
    border: '1px solid var(--xb-btn-primary-border-color)',
  },
  secondary: {
    background: 'var(--xb-btn-secondary-bg)',
    color: 'var(--xb-btn-secondary-color)',
    border: '1px solid var(--xb-btn-secondary-border-color)',
  },
  danger: {
    background: 'var(--xb-btn-danger-bg)',
    color: 'var(--xb-btn-danger-color)',
    border: '1px solid var(--xb-btn-danger-border-color)',
  },
};

export function Button({
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  children,
}: ButtonProps) {
  const styles = VARIANT_STYLES[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      class={`xb-btn ${className}`}
      style={{
        ...styles,
        padding: 'var(--xb-btn-padding)',
        borderRadius: 'var(--xb-btn-radius)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontSize: 'var(--xb-btn-font-size)',
        fontWeight: 'bold',
        transition: `opacity var(--xb-transition-fast)`,
      }}
    >
      {children}
    </button>
  );
}

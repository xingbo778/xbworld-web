import type { ComponentChildren } from 'preact';

export interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  children: ComponentChildren;
}

const VARIANT_STYLES: Record<string, Record<string, string>> = {
  primary: {
    background: 'linear-gradient(to bottom, #5b9bd5, #3a7cc0)',
    color: '#fff',
    border: '1px solid #2a6ca0',
  },
  secondary: {
    background: 'linear-gradient(to bottom, #555, #444)',
    color: '#ddd',
    border: '1px solid #666',
  },
  danger: {
    background: 'linear-gradient(to bottom, #d55b5b, #c03a3a)',
    color: '#fff',
    border: '1px solid #a02a2a',
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
        padding: '6px 16px',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontSize: '13px',
        fontWeight: 'bold',
        transition: 'opacity 0.15s',
      }}
    >
      {children}
    </button>
  );
}

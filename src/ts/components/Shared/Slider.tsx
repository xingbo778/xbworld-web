import { useCallback } from 'preact/hooks';

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  disabled = false,
}: SliderProps) {
  const handleInput = useCallback(
    (e: Event) => onChange(Number((e.target as HTMLInputElement).value)),
    [onChange],
  );

  return (
    <div
      class="xb-slider"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--xb-space-sm, 8px)',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {label && (
        <label
          style={{
            fontSize: 'var(--xb-font-size-sm, 12px)',
            color: 'var(--xb-text-primary, #e6edf3)',
            whiteSpace: 'nowrap',
            minWidth: '60px',
          }}
        >
          {label}
        </label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onInput={handleInput}
        style={{
          flex: 1,
          height: '6px',
          accentColor: 'var(--xb-accent-blue, #58a6ff)',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
      <span
        style={{
          fontSize: 'var(--xb-font-size-sm, 12px)',
          color: 'var(--xb-text-secondary, #8b949e)',
          minWidth: '32px',
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  );
}

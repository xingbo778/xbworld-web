export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  label?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'var(--xb-accent-blue, #58a6ff)',
  height = 8,
  label,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      class="xb-progress"
      style={{
        position: 'relative',
        width: '100%',
        height: `${label ? Math.max(height, 16) : height}px`,
        background: 'var(--xb-bg-secondary, #161b22)',
        borderRadius: 'var(--xb-radius-sm, 3px)',
        border: '1px solid var(--xb-border-default, #30363d)',
        overflow: 'hidden',
      }}
    >
      <div
        class="xb-progress-fill"
        style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 'var(--xb-radius-sm, 3px)',
          transition: 'width var(--xb-transition-normal, 200ms ease)',
        }}
      />
      {label && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--xb-font-size-xs, 11px)',
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
            pointerEvents: 'none',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

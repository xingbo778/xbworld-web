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
  // height and color are truly dynamic (caller-controlled numbers / player colors)
  const trackStyle = { height: `${label ? Math.max(height, 16) : height}px` };
  const fillStyle = { width: `${pct}%`, background: color };

  return (
    <div class="xb-progress" style={trackStyle}>
      <div class="xb-progress-fill" style={fillStyle} />
      {label && (
        <span class="xb-progress-label">
          {label}
        </span>
      )}
    </div>
  );
}

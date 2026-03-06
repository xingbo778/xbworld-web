import type { ComponentChildren } from 'preact';
import { useState, useCallback } from 'preact/hooks';

export interface TooltipProps {
  text: string;
  children: ComponentChildren;
}

export function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  return (
    <div
      class="xb-tooltip-wrap"
      onMouseEnter={show}
      onMouseLeave={hide}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {visible && (
        <div
          class="xb-tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '6px',
            padding: '4px 8px',
            background: 'var(--xb-bg-elevated, #21262d)',
            color: 'var(--xb-text-primary, #e6edf3)',
            fontSize: 'var(--xb-font-size-xs, 11px)',
            borderRadius: 'var(--xb-radius-sm, 3px)',
            border: '1px solid var(--xb-border-default, #30363d)',
            boxShadow: 'var(--xb-shadow-md, 0 3px 6px rgba(0,0,0,0.4))',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 'var(--xb-z-toast, 9000)',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

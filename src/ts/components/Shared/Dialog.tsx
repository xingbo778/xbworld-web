import type { ComponentChildren, JSX } from 'preact';
import { useState, useRef, useEffect, useCallback } from 'preact/hooks';

export interface DialogProps {
  title: string;
  open: boolean;
  onClose?: () => void;
  width?: number | string;
  height?: number | string;
  modal?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  className?: string;
  children: ComponentChildren;
}

export function Dialog({
  title,
  open,
  onClose,
  width = 'auto',
  height = 'auto',
  modal = true,
  draggable = true,
  className = '',
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Center on first open
  useEffect(() => {
    if (open && pos.x === -1 && dialogRef.current && typeof window !== 'undefined') {
      const rect = dialogRef.current.getBoundingClientRect();
      setPos({
        x: Math.max(0, (window.innerWidth - rect.width) / 2),
        y: Math.max(0, (window.innerHeight - rect.height) / 3),
      });
    }
  }, [open]);

  // Close on Escape key when open
  useEffect(() => {
    if (!open || !onClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const onPointerDown = useCallback((e: JSX.TargetedPointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [draggable, pos]);

  const onPointerMove = useCallback((e: JSX.TargetedPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  if (!open) return null;

  const style: Record<string, string | number> = {
    position: 'fixed',
    zIndex: 10000,
    width,
    height,
    borderRadius: 'var(--xb-dialog-radius, 6px)',
    boxShadow: 'var(--xb-dialog-shadow, 0 8px 32px rgba(0,0,0,0.6))',
    border: '1px solid var(--xb-dialog-border-color, var(--xb-border-default, #30363d))',
    overflow: 'hidden',
    ...(pos.x >= 0 ? { left: pos.x, top: pos.y } : {}),
  };

  return (
    <>
      {modal && (
        <div
          class="xb-dialog-overlay"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--xb-dialog-backdrop-bg)',
            zIndex: 9999,
          }}
        />
      )}
      <div
        ref={dialogRef}
        class={`xb-dialog ${className}`}
        style={style}
      >
        <div
          class="xb-dialog-titlebar"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--xb-dialog-titlebar-padding)',
            background: 'var(--xb-dialog-titlebar-bg)',
            color: 'var(--xb-dialog-titlebar-color)',
            cursor: draggable ? 'move' : 'default',
            userSelect: 'none',
            borderBottom: '2px solid var(--xb-dialog-titlebar-accent, var(--xb-accent-blue, #58a6ff))',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 'var(--xb-dialog-titlebar-font-size)' }}>{title}</span>
          {onClose && (
            <button
              onClick={onClose}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--xb-dialog-titlebar-close-color)',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '2px 6px',
                lineHeight: 1,
                touchAction: 'manipulation',
                minWidth: '28px',
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--xb-radius-sm, 3px)',
                transition: 'background var(--xb-transition-fast, 100ms ease)',
              }}
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>
        <div
          class="xb-dialog-content"
          style={{
            background: 'var(--xb-dialog-content-bg)',
            color: 'var(--xb-dialog-content-color)',
            padding: 'var(--xb-dialog-content-padding)',
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

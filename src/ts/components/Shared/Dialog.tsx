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
  children?: ComponentChildren;
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

  // width/height/position are truly dynamic values — keep as inline style
  const dialogStyle: Record<string, string | number> = {
    width,
    height,
    ...(pos.x >= 0 ? { left: pos.x, top: pos.y } : {}),
  };

  return (
    <>
      {modal && (
        <div
          class="xb-dialog-overlay"
          onClick={onClose}
        />
      )}
      <div
        ref={dialogRef}
        class={`xb-dialog ${className}`}
        style={dialogStyle}
      >
        <div
          class={`xb-dialog-titlebar${draggable ? ' xb-dialog-titlebar-draggable' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <span class="xb-dialog-title">{title}</span>
          {onClose && (
            <button
              onClick={onClose}
              onPointerDown={(e) => e.stopPropagation()}
              class="xb-dialog-close-btn"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>
        <div class="xb-dialog-content">
          {children}
        </div>
      </div>
    </>
  );
}

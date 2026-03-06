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
    if (open && pos.x === -1 && dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      setPos({
        x: Math.max(0, (window.innerWidth - rect.width) / 2),
        y: Math.max(0, (window.innerHeight - rect.height) / 3),
      });
    }
  }, [open]);

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
            background: 'rgba(0,0,0,0.5)',
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
            padding: '6px 10px',
            background: 'linear-gradient(to bottom, #4a4a4a, #333)',
            color: '#fff',
            cursor: draggable ? 'move' : 'default',
            userSelect: 'none',
            borderRadius: '4px 4px 0 0',
          }}
        >
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{title}</span>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#ccc',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0 4px',
                lineHeight: 1,
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
            background: '#1a1a2e',
            color: '#e0e0e0',
            padding: '12px',
            borderRadius: '0 0 4px 4px',
            border: '1px solid #444',
            borderTop: 'none',
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

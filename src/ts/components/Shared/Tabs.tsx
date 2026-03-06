import type { ComponentChildren } from 'preact';
import { useCallback } from 'preact/hooks';

export interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ComponentChildren;
}

export interface TabPanelProps {
  id: string;
  activeTab: string;
  children: ComponentChildren;
}

export function Tabs({ tabs, activeTab, onTabChange, children }: TabsProps) {
  const handleClick = useCallback(
    (id: string) => () => onTabChange(id),
    [onTabChange],
  );

  return (
    <div class="xb-tabs">
      <div
        class="xb-tabs-bar"
        style={{
          display: 'flex',
          gap: '2px',
          borderBottom: '1px solid var(--xb-border-default, #30363d)',
          background: 'var(--xb-bg-secondary, #161b22)',
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={handleClick(t.id)}
            class="xb-tab"
            style={{
              padding: '6px 14px',
              fontSize: 'var(--xb-font-size-sm, 12px)',
              fontWeight: t.id === activeTab ? 'bold' : 'normal',
              color: t.id === activeTab ? '#fff' : 'var(--xb-text-secondary, #8b949e)',
              background: t.id === activeTab
                ? 'var(--xb-bg-surface, #1a1a2e)'
                : 'transparent',
              border: 'none',
              borderBottom: t.id === activeTab
                ? '2px solid var(--xb-accent-blue, #58a6ff)'
                : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color var(--xb-transition-fast, 100ms ease)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        class="xb-tabs-content"
        style={{
          background: 'var(--xb-bg-surface, #1a1a2e)',
          color: 'var(--xb-text-primary, #e6edf3)',
          padding: 'var(--xb-space-md, 12px)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function TabPanel({ id, activeTab, children }: TabPanelProps) {
  if (id !== activeTab) return null;
  return <div class="xb-tab-panel">{children}</div>;
}

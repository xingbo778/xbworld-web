import type { ComponentChildren } from 'preact';
import { useCallback } from 'preact/hooks';

export interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children?: ComponentChildren;
}

export interface TabPanelProps {
  id: string;
  activeTab: string;
  children?: ComponentChildren;
}

export function Tabs({ tabs, activeTab, onTabChange, children }: TabsProps) {
  const handleClick = useCallback(
    (id: string) => () => onTabChange(id),
    [onTabChange],
  );

  return (
    <div class="xb-tabs">
      <div class="xb-tabs-bar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={handleClick(t.id)}
            class={`xb-tab ${t.id === activeTab ? 'xb-tab-active' : 'xb-tab-inactive'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div class="xb-tabs-content">
        {children}
      </div>
    </div>
  );
}

export function TabPanel({ id, activeTab, children }: TabPanelProps) {
  if (id !== activeTab) return null;
  return <div class="xb-tab-panel">{children}</div>;
}

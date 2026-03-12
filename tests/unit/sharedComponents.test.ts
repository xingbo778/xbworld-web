/**
 * Tests for shared Preact UI primitives: Dialog, Button, Tabs, ProgressBar.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, h } from 'preact';

describe('Shared/Dialog', () => {
  it('exports Dialog as a function', async () => {
    const { Dialog } = await import('@/components/Shared/Dialog');
    expect(typeof Dialog).toBe('function');
  });
});

// ---------------------------------------------------------------------------
// Dialog rendering
// ---------------------------------------------------------------------------

describe('Shared/Dialog rendering', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('renders nothing when open=false', async () => {
    const { Dialog } = await import('@/components/Shared/Dialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Dialog, { title: 'Test', open: false }, 'Content'), div);
    expect(div.innerHTML).toBe('');
    document.body.removeChild(div);
  });

  it('renders title and children when open=true', async () => {
    const { Dialog } = await import('@/components/Shared/Dialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Dialog, { title: 'My Dialog', open: true }, 'Hello world'), div);
    expect(div.textContent).toContain('My Dialog');
    expect(div.textContent).toContain('Hello world');
    document.body.removeChild(div);
  });

  it('renders close button when onClose is provided', async () => {
    const { Dialog } = await import('@/components/Shared/Dialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Dialog, { title: 'Close Me', open: true, onClose: () => {} }, 'Content'), div);
    const closeBtn = div.querySelector('[aria-label="Close"]');
    expect(closeBtn).not.toBeNull();
    document.body.removeChild(div);
  });

  it('does not render close button when onClose is absent', async () => {
    const { Dialog } = await import('@/components/Shared/Dialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Dialog, { title: 'No Close', open: true }, 'Content'), div);
    const closeBtn = div.querySelector('[aria-label="Close"]');
    expect(closeBtn).toBeNull();
    document.body.removeChild(div);
  });

  it('calls onClose when close button is clicked', async () => {
    const { Dialog } = await import('@/components/Shared/Dialog');
    let closed = false;
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Dialog, { title: 'Closable', open: true, onClose: () => { closed = true; } }, 'Content'), div);
    const closeBtn = div.querySelector('[aria-label="Close"]') as HTMLButtonElement;
    expect(closeBtn).not.toBeNull();
    closeBtn.click();
    expect(closed).toBe(true);
    document.body.removeChild(div);
  });

  it('renders modal overlay when modal=true', async () => {
    const { Dialog } = await import('@/components/Shared/Dialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Dialog, { title: 'Modal', open: true, modal: true }, 'Content'), div);
    expect(div.querySelector('.xb-dialog-overlay')).not.toBeNull();
    document.body.removeChild(div);
  });

  it('does not render modal overlay when modal=false', async () => {
    const { Dialog } = await import('@/components/Shared/Dialog');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Dialog, { title: 'Non-modal', open: true, modal: false }, 'Content'), div);
    expect(div.querySelector('.xb-dialog-overlay')).toBeNull();
    document.body.removeChild(div);
  });
});

describe('Shared/Button', () => {
  it('exports Button as a function', async () => {
    const { Button } = await import('@/components/Shared/Button');
    expect(typeof Button).toBe('function');
  });
});

describe('Shared/Tabs', () => {
  it('exports Tabs and TabPanel as functions', async () => {
    const { Tabs, TabPanel } = await import('@/components/Shared/Tabs');
    expect(typeof Tabs).toBe('function');
    expect(typeof TabPanel).toBe('function');
  });
});

describe('Shared/ProgressBar', () => {
  it('exports ProgressBar as a function', async () => {
    const { ProgressBar } = await import('@/components/Shared/ProgressBar');
    expect(typeof ProgressBar).toBe('function');
  });
});

describe('App root', () => {
  it('exports mountPreactApp as a function', async () => {
    const { mountPreactApp } = await import('@/components/App');
    expect(typeof mountPreactApp).toBe('function');
  });

  it('mountPreactApp does not throw when called in jsdom', async () => {
    const { mountPreactApp } = await import('@/components/App');
    expect(() => mountPreactApp()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Button rendering
// ---------------------------------------------------------------------------

describe('Shared/Button rendering', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('renders children text', async () => {
    const { Button } = await import('@/components/Shared/Button');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Button, { onClick: () => {} }, 'Click Me'), div);
    expect(div.textContent).toContain('Click Me');
    document.body.removeChild(div);
  });

  it('renders a <button> element', async () => {
    const { Button } = await import('@/components/Shared/Button');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Button, {}, 'OK'), div);
    expect(div.querySelector('button')).not.toBeNull();
    document.body.removeChild(div);
  });

  it('disabled prop sets button disabled attribute', async () => {
    const { Button } = await import('@/components/Shared/Button');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Button, { disabled: true }, 'Disabled'), div);
    const btn = div.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    document.body.removeChild(div);
  });

  it('onClick is called when button is clicked', async () => {
    const { Button } = await import('@/components/Shared/Button');
    let clicked = false;
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Button, { onClick: () => { clicked = true; } }, 'Go'), div);
    (div.querySelector('button') as HTMLButtonElement).click();
    expect(clicked).toBe(true);
    document.body.removeChild(div);
  });
});

// ---------------------------------------------------------------------------
// ProgressBar rendering
// ---------------------------------------------------------------------------

describe('Shared/ProgressBar rendering', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('renders with xb-progress class', async () => {
    const { ProgressBar } = await import('@/components/Shared/ProgressBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(ProgressBar, { value: 50 }), div);
    expect(div.querySelector('.xb-progress')).not.toBeNull();
    document.body.removeChild(div);
  });

  it('renders fill bar with xb-progress-fill class', async () => {
    const { ProgressBar } = await import('@/components/Shared/ProgressBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(ProgressBar, { value: 75, max: 100 }), div);
    const fill = div.querySelector('.xb-progress-fill') as HTMLElement;
    expect(fill).not.toBeNull();
    expect(fill.style.width).toBe('75%');
    document.body.removeChild(div);
  });

  it('renders label text when provided', async () => {
    const { ProgressBar } = await import('@/components/Shared/ProgressBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(ProgressBar, { value: 30, max: 100, label: '30 / 100' }), div);
    expect(div.textContent).toContain('30 / 100');
    document.body.removeChild(div);
  });

  it('clamps value — 0% fill for value=0', async () => {
    const { ProgressBar } = await import('@/components/Shared/ProgressBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(ProgressBar, { value: 0 }), div);
    const fill = div.querySelector('.xb-progress-fill') as HTMLElement;
    expect(fill.style.width).toBe('0%');
    document.body.removeChild(div);
  });

  it('clamps value — 100% fill for value > max', async () => {
    const { ProgressBar } = await import('@/components/Shared/ProgressBar');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(ProgressBar, { value: 999, max: 100 }), div);
    const fill = div.querySelector('.xb-progress-fill') as HTMLElement;
    expect(fill.style.width).toBe('100%');
    document.body.removeChild(div);
  });
});

// ---------------------------------------------------------------------------
// Tabs rendering
// ---------------------------------------------------------------------------

describe('Shared/Tabs rendering', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('renders tab buttons for each tab definition', async () => {
    const { Tabs } = await import('@/components/Shared/Tabs');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Tabs, {
      tabs: [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }],
      activeTab: 'a',
      onTabChange: () => {},
    }, null), div);
    const buttons = Array.from(div.querySelectorAll('button')).map(b => b.textContent?.trim());
    expect(buttons).toContain('Alpha');
    expect(buttons).toContain('Beta');
    document.body.removeChild(div);
  });

  it('onTabChange is called when a tab button is clicked', async () => {
    const { Tabs } = await import('@/components/Shared/Tabs');
    let switched = '';
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(Tabs, {
      tabs: [{ id: 'x', label: 'X' }, { id: 'y', label: 'Y' }],
      activeTab: 'x',
      onTabChange: (id) => { switched = id; },
    }, null), div);
    const yBtn = Array.from(div.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Y') as HTMLButtonElement;
    yBtn.click();
    expect(switched).toBe('y');
    document.body.removeChild(div);
  });
});

describe('Shared/TabPanel rendering', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('renders children when id matches activeTab', async () => {
    const { TabPanel } = await import('@/components/Shared/Tabs');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TabPanel, { id: 'foo', activeTab: 'foo' }, 'Panel content'), div);
    expect(div.textContent).toContain('Panel content');
    document.body.removeChild(div);
  });

  it('renders nothing when id does not match activeTab', async () => {
    const { TabPanel } = await import('@/components/Shared/Tabs');
    const div = document.createElement('div');
    document.body.appendChild(div);
    render(h(TabPanel, { id: 'foo', activeTab: 'bar' }, 'Hidden content'), div);
    expect(div.innerHTML).toBe('');
    document.body.removeChild(div);
  });
});

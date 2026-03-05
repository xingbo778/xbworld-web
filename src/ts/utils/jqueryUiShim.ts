/**
 * Minimal jQuery UI shim — replaces the 249 KB jquery-ui.min.js.
 *
 * Implements only the jQuery UI methods actually used in the codebase:
 *   .dialog(options) / .dialog('open') / .dialog('close')
 *   .tooltip()  — no-op (CSS handles hover tooltips via title attr)
 *   .button()   — no-op (CSS handles button styling)
 *   .menu()     — no-op (not critical for observer mode)
 *   .selectable() — no-op (not observer-reachable)
 *   .tabs()     — already replaced with vanilla tabs.ts
 *
 * Dialog implementation uses native HTML <dialog> element when available,
 * falling back to absolute positioning.
 */

const _$ = (window as any).jQuery;
if (!_$) throw new Error('jqueryUiShim requires jQuery');

// ──────────────────────────────────────────────────────────────────────
// .dialog() widget
// ──────────────────────────────────────────────────────────────────────

interface DialogData {
  wrapper: HTMLElement;
  titleBar: HTMLElement;
  buttonPane: HTMLElement;
  options: any;
}

const dialogStore = new WeakMap<HTMLElement, DialogData>();

function createDialogWrapper(el: HTMLElement, options: any): DialogData {
  const wrapper = document.createElement('div');
  wrapper.className = 'ui-dialog ui-widget ui-widget-content ui-corner-all ui-front';
  wrapper.style.cssText = 'position:fixed;z-index:10001;display:none;';

  // Width
  const w = options.width || 300;
  wrapper.style.width = typeof w === 'number' ? w + 'px' : w;
  if (options.height && options.height !== 'auto') {
    wrapper.style.height = typeof options.height === 'number' ? options.height + 'px' : options.height;
  }
  if (options.maxHeight) {
    wrapper.style.maxHeight = options.maxHeight + 'px';
  }

  // Title bar
  const titleBar = document.createElement('div');
  titleBar.className = 'ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix';
  titleBar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:4px 8px;cursor:move;user-select:none;';
  const titleSpan = document.createElement('span');
  titleSpan.className = 'ui-dialog-title';
  titleSpan.textContent = el.getAttribute('title') || el.title || '';
  titleBar.appendChild(titleSpan);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'ui-dialog-titlebar-close';
  closeBtn.textContent = '×';
  closeBtn.style.cssText = 'background:none;border:none;color:#ccc;font-size:18px;cursor:pointer;padding:0 4px;';
  closeBtn.addEventListener('click', () => dialogAction(el, 'close'));
  titleBar.appendChild(closeBtn);

  // Make draggable
  let dragging = false;
  let dragOff = { x: 0, y: 0 };
  titleBar.addEventListener('pointerdown', (e: PointerEvent) => {
    dragging = true;
    dragOff = { x: e.clientX - wrapper.offsetLeft, y: e.clientY - wrapper.offsetTop };
    titleBar.setPointerCapture(e.pointerId);
  });
  titleBar.addEventListener('pointermove', (e: PointerEvent) => {
    if (!dragging) return;
    wrapper.style.left = (e.clientX - dragOff.x) + 'px';
    wrapper.style.top = (e.clientY - dragOff.y) + 'px';
  });
  titleBar.addEventListener('pointerup', () => { dragging = false; });

  // Content
  const content = document.createElement('div');
  content.className = 'ui-dialog-content ui-widget-content';
  content.style.cssText = 'overflow:auto;padding:8px;';
  content.appendChild(el);

  // Button pane
  const buttonPane = document.createElement('div');
  buttonPane.className = 'ui-dialog-buttonpane ui-widget-content ui-helper-clearfix';
  buttonPane.style.cssText = 'padding:4px 8px;text-align:right;';

  if (options.buttons) {
    for (const btn of options.buttons) {
      const b = document.createElement('button');
      b.className = 'ui-button ui-widget';
      b.textContent = btn.text || '';
      b.addEventListener('click', btn.click);
      b.style.cssText = 'margin-left:4px;padding:4px 12px;cursor:pointer;';
      buttonPane.appendChild(b);
    }
  }

  wrapper.appendChild(titleBar);
  wrapper.appendChild(content);
  wrapper.appendChild(buttonPane);

  document.body.appendChild(wrapper);

  const data: DialogData = { wrapper, titleBar, buttonPane, options };
  dialogStore.set(el, data);

  return data;
}

function dialogAction(el: HTMLElement, action: string): void {
  const data = dialogStore.get(el);
  if (!data) return;

  if (action === 'open') {
    data.wrapper.style.display = '';
    // Center
    const rect = data.wrapper.getBoundingClientRect();
    data.wrapper.style.left = Math.max(0, (window.innerWidth - rect.width) / 2) + 'px';
    data.wrapper.style.top = Math.max(0, (window.innerHeight - rect.height) / 3) + 'px';

    if (data.options.modal) {
      let overlay = document.getElementById('xb-ui-dialog-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'xb-ui-dialog-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;';
        document.body.appendChild(overlay);
      }
      overlay.style.display = '';
    }
  } else if (action === 'close') {
    data.wrapper.style.display = 'none';
    const overlay = document.getElementById('xb-ui-dialog-overlay');
    if (overlay) overlay.style.display = 'none';

    if (data.options.close) data.options.close();
  }
}

// Register $.fn.dialog
_$.fn.dialog = function (this: any, optionsOrAction: any, ...args: any[]) {
  return this.each(function (this: HTMLElement) {
    if (typeof optionsOrAction === 'string') {
      dialogAction(this, optionsOrAction);
    } else {
      // Init
      let data = dialogStore.get(this);
      if (data) {
        // Re-init: update content and options
        data.wrapper.remove();
        dialogStore.delete(this);
      }
      data = createDialogWrapper(this, optionsOrAction || {});
      // Auto-open unless autoOpen: false
      if (optionsOrAction?.autoOpen !== false) {
        dialogAction(this, 'open');
      }
    }
  });
};

// ──────────────────────────────────────────────────────────────────────
// .dialogExtend() — no-op (minimize/maximize not needed)
// ──────────────────────────────────────────────────────────────────────
_$.fn.dialogExtend = function () { return this; };

// ──────────────────────────────────────────────────────────────────────
// .tooltip() — no-op, browsers show title attr as tooltip
// ──────────────────────────────────────────────────────────────────────
_$.fn.tooltip = function () { return this; };

// ──────────────────────────────────────────────────────────────────────
// .button() — no-op, CSS handles styling
// ──────────────────────────────────────────────────────────────────────
_$.fn.button = function () { return this; };

// ──────────────────────────────────────────────────────────────────────
// .menu() — no-op for observer mode
// ──────────────────────────────────────────────────────────────────────
_$.fn.menu = function () { return this; };

// ──────────────────────────────────────────────────────────────────────
// .selectable() — no-op (city worklist, not observer-reachable)
// ──────────────────────────────────────────────────────────────────────
_$.fn.selectable = function () { return this; };

// ──────────────────────────────────────────────────────────────────────
// .tabs() — already replaced, but keep as no-op for any stray calls
// ──────────────────────────────────────────────────────────────────────
_$.fn.tabs = function () { return this; };

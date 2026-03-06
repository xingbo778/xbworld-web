# XBWorld-Web UI 重构计划 (v2 - 2026-03-06 更新)

## 最终目标
让 UI 层完全解耦，可以像换皮肤一样轻松重新设计界面。

---

## 当前状态

### 已完成 ✅
- 删除 globalRegistry (2,543 行)，CSS 精简 79% (474→98 KB)
- Bundle 减少 60% (675→274 KB)
- 6 个 Preact 对话框已迁移 (Message, Auth, Intro, Intel, Pillage, Swal)
- jQuery UI 替换为 204 行 shim
- Design tokens 建立 (tokens.css)
- GameStore + Preact signals 数据层搭建
- 地图拖拽、小地图、聊天面板、单位渲染均已修复
- 62/62 E2E 测试通过，0 运行时错误

### 核心问题 🔴

| 问题 | 严重程度 | 影响 |
|------|---------|------|
| **业务逻辑和 UI 渲染混在一起** | 🔴 致命 | 改 UI 必须理解游戏逻辑 |
| **9 个大文件还在用 jQuery** | 🔴 致命 | 452 个 $.() 调用，无法用新框架渲染 |
| **284 个 window 全局变量** | 🟡 严重 | 组件无法独立测试和复用 |
| **网络请求散落各处** | 🟡 严重 | 改 UI 容易破坏通信逻辑 |
| **innerHTML 拼接 HTML** | 🟡 严重 | 无法复用，难以维护 |

### 需要迁移的大文件 (按优先级)

| 文件 | 行数 | $.() 数 | 复杂度 | 说明 |
|------|------|---------|--------|------|
| cityDialog.ts | 1,314 | 145 | 极高 | 最复杂，混合 Canvas + 网络 + DOM |
| techDialog.ts | 704 | 62 | 高 | Canvas 科技树 + 标签页 |
| diplomacy.ts | 571 | 58 | 高 | 多步骤谈判流程 |
| actionDialog.ts | — | 89 | 高 | 动态操作列表 |
| rates.ts | 296 | — | 中 | 税率滑块 |
| options.ts | 145 | 48 | 中 | 设置表单 |
| helpdata.ts | — | 55 | 中 | 百科全书/帮助 |
| governmentDialog.ts | 155 | 35 | 低 | 政体选择 |
| controls.ts | — | 81 | 中 | 按钮栏 |

---

## 重构路线图 (5 个 Phase)

### Phase 1: 建立 Command 层 — 解耦网络请求 (~2天)

**目标**: 所有网络通信集中到一个模块，UI 层不再直接发包

创建 `src/ts/net/commands.ts`:
```typescript
// 之前: 散落在 cityDialog.ts, actionDialog.ts 等 9+ 个文件
sendRequest(JSON.stringify({ pid: 37, city_id: id, ... }));

// 之后: 统一入口，UI 组件只调函数
export function changeCityProduction(cityId: number, target: number) { ... }
export function sellImprovement(cityId: number, improvId: number) { ... }
export function setResearch(techId: number) { ... }
export function sendDiplomacy(counterpart: number, clause: any) { ... }
export function sendChatMessage(message: string) { ... }
export function setTaxRates(tax: number, science: number, luxury: number) { ... }
```

**收益**: UI 组件只需调用函数，不关心协议细节。重新设计 UI 时零风险破坏通信。

---

### Phase 2: 拆分业务逻辑 — Logic ↔ View 分离 (~5天)

**目标**: 每个大对话框拆成「纯逻辑模块」+「纯视图组件」

```
cityDialog.ts (1,314 行)
  ↓ 拆分为:
  src/ts/logic/cityLogic.ts    — 纯函数: 计算产出、判断可建造、格式化数据
  src/ts/components/game/CityDialog.tsx — Preact 组件: 只渲染 + 接收用户输入
```

**每个文件的拆分策略**:

| 原文件 | → 逻辑层 | → 视图层 | 工作量 |
|--------|---------|---------|-------|
| cityDialog.ts (1,314行) | cityLogic.ts | CityDialog.tsx | 2天 |
| techDialog.ts (704行) | techLogic.ts | TechDialog.tsx | 1天 |
| diplomacy.ts (571行) | diplomacyLogic.ts | DiplomacyDialog.tsx | 1天 |
| actionDialog.ts | actionLogic.ts | ActionDialog.tsx | 0.5天 |
| rates.ts / options.ts / governmentDialog.ts | 各自 Logic | 各自 .tsx | 0.5天 |

**拆分原则**:
- Logic 文件: 纯函数，无 DOM/jQuery/Preact，可单元测试
- View 文件: Preact 组件，通过 props 接收数据，通过 callback 触发动作
- Logic 文件 import store/commands，View 文件 import Logic 和 primitives

**收益**: 改 UI 完全不碰游戏逻辑代码。

---

### Phase 3: Preact 组件库 — 可复用 UI 原语 (~3天)

**目标**: 建立一套游戏 UI 组件，换皮只需改组件样式

```
src/ts/components/
├── primitives/           ← 基础 UI 原语 (换皮改这里)
│   ├── Dialog.tsx        (已有，需增强)
│   ├── Button.tsx        (已有)
│   ├── Tabs.tsx          ← 新建
│   ├── Table.tsx         ← 新建 (排序、筛选)
│   ├── ProgressBar.tsx   ← 新建
│   ├── Slider.tsx        ← 新建 (税率用)
│   ├── Select.tsx        ← 新建 (下拉选择)
│   ├── Tooltip.tsx       ← 新建
│   └── ContextMenu.tsx   ← 新建
│
├── game/                 ← 游戏专用组件 (Phase 2 产出)
│   ├── CityDialog.tsx
│   ├── TechDialog.tsx
│   ├── DiplomacyDialog.tsx
│   ├── ActionDialog.tsx
│   ├── NationsPanel.tsx
│   ├── ChatPanel.tsx
│   ├── MinimapPanel.tsx
│   └── UnitPanel.tsx
│
├── layout/               ← 布局组件 (改布局改这里)
│   ├── GameLayout.tsx    ← 主布局 (地图 + 侧栏 + 底栏)
│   ├── TabBar.tsx        ← 顶部标签栏
│   └── StatusBar.tsx     ← 状态栏
│
└── Dialogs/              ← 已迁移的简单对话框
    ├── MessageDialog.tsx ✅
    ├── AuthDialog.tsx    ✅
    ├── IntroDialog.tsx   ✅
    ├── IntelDialog.tsx   ✅
    ├── PillageDialog.tsx ✅
    └── SwalDialog.tsx    ✅
```

**所有 primitives 组件只用 CSS 变量，不硬编码颜色/间距。**

**收益**: 换皮时只改 primitives 的 CSS/JSX，不碰游戏逻辑。

---

### Phase 4: 消除 jQuery 和 window 全局变量 (~3天，可与 Phase 2 并行)

**目标**: 彻底移除 jQuery，所有数据通过 import 访问

| 替换项 | 数量 | 方案 |
|--------|------|------|
| `$('#id').html(...)` | ~100 | JSX 渲染 |
| `$('#id').dialog()` | ~50 | Preact signal + Dialog 组件 |
| `$('#id').on('click')` | ~80 | JSX onClick |
| `$('#id').show/hide()` | ~60 | CSS class / signal |
| `(window as any).xxx` | 284 | `import { xxx }` |
| jqueryUiShim.ts | 204行 | 删除 |
| micro-jquery | ~10KB | 删除 |
| windowBridge.ts | 70行 | 删除 |

**收益**: Bundle 再减 ~20 KB，代码可 tree-shake，TypeScript 类型检查完整覆盖。

---

### Phase 5: CSS 主题系统 (~1天)

**目标**: 一行代码切换主题

```css
/* tokens.css - 完整主题系统 */
:root[data-theme="dark"] {
  --xb-bg-primary: #0d1117;
  --xb-text-primary: #e6edf3;
  --xb-accent-blue: #58a6ff;
  /* ... 所有颜色 */
}

:root[data-theme="light"] {
  --xb-bg-primary: #ffffff;
  --xb-text-primary: #1f2328;
  --xb-accent-blue: #0969da;
}

:root[data-theme="fantasy"] {
  --xb-bg-primary: #1a0a2e;
  --xb-text-primary: #f0e6d3;
  --xb-accent-blue: #7c3aed;
}
```

切换主题:
```typescript
document.documentElement.dataset.theme = 'fantasy';
```

**收益**: 一行代码换整套视觉风格。

---

## 执行顺序

```
Week 1: Phase 1 (Command 层) + Phase 2 开始 (拆分 cityDialog)
Week 2: Phase 2 完成 + Phase 3 (组件库)
Week 3: Phase 4 (消除 jQuery) + Phase 5 (主题系统)
```

**总计: ~14 天工作量**

---

## 架构对比

### 现在 (紧耦合)
```
用户操作 → jQuery DOM 事件
  → 混合函数(逻辑+渲染+网络) → sendRequest()
                                    ↓
WebSocket ← packhandlers.ts → window全局变量 → jQuery DOM更新
```

**问题**: 改任何 UI 都要理解整条链路。

### 重构后 (解耦)
```
用户操作 → Preact 组件 onClick
  → commands.ts → sendRequest()
                       ↓
WebSocket ← packhandlers.ts → GameStore
  → Preact signals → 组件自动 re-render
```

**关键区别**: 数据单向流动，UI 层纯粹是数据的视觉映射。

---

## 重构完成后，UI 重新设计只需:

1. **改颜色/字体** → 修改 `tokens.css` 的 CSS 变量
2. **改组件样式** → 修改 `primitives/` 的组件 CSS
3. **改页面布局** → 修改 `layout/` 的布局组件
4. **改对话框内容** → 修改 `game/` 的游戏组件 JSX
5. **完全不需要碰**: 游戏逻辑、网络通信、数据层、渲染引擎

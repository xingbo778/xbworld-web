# XBWorld-Web UI 重构计划 (v4 - 2026-03-07 更新)

## 最终目标
Observer-only 模式：UI 层完全解耦，可以像换皮肤一样轻松重新设计界面。

---

## 当前状态

### 已完成 ✅
- 删除 globalRegistry (2,543 行)，CSS 精简 79% (474→98 KB)
- Bundle: 721 KB raw / 217 KB gzip (含 pixi.js)
- **Observer 清理**: 删除/stub 所有 player-only 模块:
  - `ui/actionDialog.ts` → stub (no-ops)
  - `ui/cma.ts` → stub
  - `ui/diplomacy.ts` → stub
  - `ui/cityWorklist.ts` → stub
  - `components/Dialogs/GovernmentDialog.tsx` → 删除
  - `components/Dialogs/RatesDialog.tsx` → 删除
  - `components/Dialogs/PillageDialog.tsx` → 删除
  - `ui/actionDialogFormat/Popup/SelState/Targets.ts` → 删除 (orphaned)
  - `ui/diplomacyLogic.ts` → 删除 (orphaned)
  - `ui/pregame.ts` → 删除 (orphaned)
  - `components/Dialogs/HelpDialog.tsx` → 删除 (orphaned)
  - `components/Shared/Slider|Table|Tooltip.tsx` → 删除 (unused)
  - `core/control/keyboard.ts` → 精简 (只保留导航快捷键)
  - `core/control.ts` → 精简 (移除单位/外交 event handlers)
  - `windowBridge.ts` → 精简 (移除 CMA/worklist/外交/政府绑定)
  - `main.ts` → 移除 player-only 模块导入
  - `ui/controls.ts` → 精简 (只保留观察者导航)
- **Phase 1**: `net/commands.ts` 237行，完整 Command 层 ✅
- **Phase 2**: Logic/View 分离:
  - `ui/cityLogic.ts` ✅, `ui/techLogic.ts` ✅
  - `CityDialog.tsx` ✅ (read-only Preact 组件，含 3 个 tabs)
  - `TechDialog.tsx` ✅ (研究进度 Preact 面板)
- **Phase 3**: Preact 组件库:
  - primitives: Dialog, Button, Tabs, TabPanel, ProgressBar ✅
  - dialogs: MessageDialog, AuthDialog, IntroDialog, IntelDialog, SwalDialog ✅
  - 新增: CityDialog, TechDialog ✅
  - 新增: StatusBar (游戏状态 HUD) ✅
  - 新增: NationOverview (玩家概览面板，lazy-mounted) ✅
- **Phase 4**: jQuery 基本清除 ✅ (TS 代码中 jQuery 调用降至 0)
- **Phase 5**: CSS 主题系统 ✅:
  - `tokens.css` 完整主题: dark (默认) / light / fantasy
  - `utils/theme.ts` 一行切换主题，含系统主题偏好检测
  - 主题选择器注入 Options 面板
- **NationOverview 挂载**: players tab 点击时 lazy render ✅
- **Phase A**: `ui/techDialog.ts` → observer stub (200行，取代 629行 canvas 渲染) ✅
- **Phase B**: `unitPanel.ts` → `update_unit_order_commands()` 加 observer guard ✅
- **Phase C**: `nationScreen.ts` 已有 `clientIsObserver()` guards；NationOverview 与旧 HTML table 共存于 players tab (互补，不冲突) ✅
- **Phase D**: PixiRenderer 集成完成: mapctrl_init_pixi()、resize 处理、类型修复 ✅
- **TS 类型修复**: unit.ts `map_to_gui_pos`/`mapview` ambient decl; tilespec.ts spread fix; renderer.spec.ts 类型修复 ✅
- **Observer 地图点击**: 左键点城市 → CityDialog；左键点其他格子 → tile info popup (popit_req) ✅
- **NationOverview 增强**: 新增 State 列 (Moving/Done/AI/Idle/Dead)，含颜色标识 ✅
- **player:updated 事件**: handle_web_player_info_addition 现在 emit 'player:updated'，NationOverview 实时更新 ✅
- **测试**: 475/475 单元测试通过，0 TypeScript 错误 ✅

- **Phase E**: TechPanel 集成: TechDialog.tsx 新增 TechPanel 组件 + mountTechPanel() ✅
  - `#tabs-tec` 清空旧 canvas HTML，lazy-mount TechPanel（同 NationOverview 模式）
  - `ui/techDialog.ts` 简化: update_tech_screen() → refreshTechPanel()，移除 show_observer_tech_dialog()
  - App.tsx 移除 `<TechDialog>` modal（Research tab 接管）
  - `civClient.ts`: Pixi/WebGL 设为默认渲染器（?renderer=2d 回退 2D canvas）
  - `core/control.ts`: control_init() 只在非 Pixi 模式下调用 mapctrl_init_2d()
- **E2E 测试**: 3/3 通过，tileset 路由拦截解决 ImageBitmap 阻塞问题 ✅

- **techDialog.ts 深度清理** ✅:
  - 移除 13 个未使用导出: `techcoststyle1`, `maxleft`, `clicked_tech_id`, `tech_canvas`, `tech_canvas_ctx`, `tech_canvas_text_font`, `tech_xscale`, `tech_item_width`, `tech_item_height`, `is_tech_tree_init`, `update_tech_dialog_cursor`, `init_tech_screen`, `update_tech_tree`, `scroll_tech_tree`, `tech_mapview_mouse_click`, `get_tech_infobox_html`, `show_tech_gained_dialog`, `check_queued_tech_gained_dialog`, `send_player_tech_goal`
  - `control.ts`: 移除 `tech_mapview_mouse_click` 导入和 `#tech_canvas` no-op 监听器
  - `mouse.ts`: 移除 `update_tech_dialog_cursor` 调用（inline early return）
  - `gameState.ts` / `player.ts`: 移除永远为 false 的 `is_tech_tree_init &&` 判断
  - `TechDialog.tsx`: 移除未使用导入 `AR_ONE`, `AR_TWO`, `computed`

### 还未完成 🔄
- `ui/helpdata.ts` → 保持旧 DOM 渲染 (works fine)

---

## 架构 (现状)

```
用户操作 → Preact 组件 (城市/科技/外交/聊天)
  → net/commands.ts → send_request()
                           ↓
WebSocket ← packhandlers.ts → GameStore
  → Preact signals → 组件自动 re-render
```

## Observer 模式 - 可用功能
- ✅ 地图浏览 (Canvas/WebGL 渲染)
- ✅ 城市查看 (CityDialog Preact - read-only)
- ✅ 科技进度 (TechDialog Preact - all players)
- ✅ 玩家概览 (NationOverview Preact panel in nations tab)
- ✅ 情报报告 (IntelDialog Preact)
- ✅ 聊天 (chat.ts)
- ✅ 帮助百科 (helpdata.ts DOM)
- ✅ 状态栏 (StatusBar: 回合/年份/玩家数)
- ✅ 主题切换 (dark/light/fantasy, 含系统偏好检测)

## CSS 主题切换
```typescript
// 在浏览器控制台或代码中:
setTheme('dark')    // 默认深色游戏主题
setTheme('light')   // 浅色主题
setTheme('fantasy') // 奇幻主题 (紫色)
```

## 下一步优化 (可选)
1. `TechDialog.tsx` 改为取代 canvas tech tab (而非并列显示)
2. 删除 `ui/techDialog.ts` 旧 canvas 渲染代码 (需要先做完整的 Preact 科技树)
3. Pixi.js 渲染集成到主地图 (WebGL 加速)
4. E2E 测试在 mock backend 下完整验证

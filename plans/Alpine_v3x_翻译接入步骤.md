# Alpine.js v3.x 翻译接入步骤

**日期**: 2026-05-26  
**目标**: 将 Alpine.js v3.x 作为新产品接入本项目  
**当前状态**: 分析完成，待开始接入

## 0. 依据和范围

执行前先阅读：

- `docs/05_开发功能细则文档/00_工作流总览.md`
- `docs/05_开发功能细则文档/01_文档采集与翻译工作流.md`
- `docs/05_开发功能细则文档/02_翻译操作指南.md`
- `docs/05_开发功能细则文档/03_翻译校对工作流.md`
- `docs/05_开发功能细则文档/04_新增产品或版本接入工作流.md`
- `docs/05_开发功能细则文档/06_本地化超链接适配工作流.md`

固定上游来源：

```text
repository: https://github.com/alpinejs/alpine
ref: main
docs path: packages/docs/src/en/
official docs URL: https://alpinejs.dev/start-here
local product: alpine
local version: v3.x
```

核心边界：

- Alpine.js 官方**无版本切换机制**，源文件无版本号拆分。本项目统一使用 `v3.x` 作为版本标识。
- 文档源为 `packages/docs/src/en/` 下的纯 Markdown 文件，无框架组件（如 Astro `<Aside>` 等）。
- 分类索引页（`essentials.md`、`directives.md`、`magics.md`、`globals.md`、`plugins.md`、`advanced.md`）为占位文件（<100 字节），不单独发布为站点页面。
- 官方网站中的 UI Components（Dropdown、Modal）在源文件中**无对应 Markdown 文件**，初步跳过，后续按需补充。
- 文档无本地图片资源，无需处理 `raw-assets`。

## 1. 源文档采集

- [ ] 建立采集目录：

```text
sources/_upstream/alpine-v3.x-docs/
sources/alpine/v3.x/raw/docs/
sources/alpine/v3.x/normalized/docs/
```

- [ ] 从 `alpinejs/alpine` 的 `main` 分支采集 `packages/docs/src/en/` 下所有 `.md` 文件。
- [ ] 保留完整原始文档快照到 `sources/alpine/v3.x/raw/docs/`。
- [ ] 创建 `sources/alpine/v3.x/manifest.yml`，记录 repo、ref、路径、采集日期、license。

建议 manifest 初稿：

```yaml
product: alpine
version: v3.x
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  commit: (采集时记录实际 HEAD)
  paths:
    - packages/docs/src/en
    - LICENSE.md
    - README.md
retrieved_at: 2026-05-26
license: MIT
version_tag: 3.15.12
notes:
  - 官方无版本化目录，本项目统一使用 v3.x。
  - essentials.md/directives.md/magics.md/globals.md/plugins.md/advanced.md 为分类索引占位页，不纳入站点页面。
  - UI Components (Dropdown/Modal) 无对应源文件，初步跳过。
  - 文档无图片资源，无 Astro/Vue 等框架组件残留。
```

## 2. 结构清洗

- [ ] 将 `raw/docs/` 中所有 `.md` 文件（排除分类索引占位页）复制到 `sources/alpine/v3.x/normalized/docs/`，保留原有目录结构。

最终 normalized 目录结构：

```text
sources/alpine/v3.x/normalized/docs/
├── start-here.md
├── upgrade-guide.md
├── essentials/
│   ├── installation.md
│   ├── state.md
│   ├── templating.md
│   ├── events.md
│   └── lifecycle.md
├── directives/
│   ├── data.md
│   ├── init.md
│   ├── show.md
│   ├── bind.md
│   ├── on.md
│   ├── text.md
│   ├── html.md
│   ├── model.md
│   ├── modelable.md
│   ├── for.md
│   ├── transition.md
│   ├── effect.md
│   ├── ignore.md
│   ├── ref.md
│   ├── cloak.md
│   ├── teleport.md
│   ├── if.md
│   └── id.md
├── magics/
│   ├── el.md
│   ├── refs.md
│   ├── store.md
│   ├── watch.md
│   ├── dispatch.md
│   ├── nextTick.md
│   ├── root.md
│   ├── data.md
│   └── id.md
├── globals/
│   ├── alpine-data.md
│   ├── alpine-store.md
│   └── alpine-bind.md
├── plugins/
│   ├── mask.md
│   ├── intersect.md
│   ├── resize.md
│   ├── persist.md
│   ├── focus.md
│   ├── collapse.md
│   ├── anchor.md
│   ├── morph.md
│   └── sort.md
└── advanced/
    ├── csp.md
    ├── reactivity.md
    ├── extending.md
    └── async.md
```

- [ ] 排除的分类索引占位页（保留在 raw 中）：`essentials.md`、`directives.md`、`magics.md`、`globals.md`、`plugins.md`、`advanced.md`。

文档统计：总计约 **50 个页面**（2 个顶层 + 5 个 essentials + 18 个 directives + 9 个 magics + 3 个 globals + 9 个 plugins + 4 个 advanced）。

## 3. 最小站点接入（样板页）

- [ ] 建立翻译和站点目录：

```text
content/alpine/v3.x/zh-cn/docs/
site/docs/alpine/v3.x/
site/static/assets/alpine/v3.x/        # Alpine 无图片资源，此目录预留
```

- [ ] 先接入 `start-here.md` 作为样板页，同时写入：

```text
content/alpine/v3.x/zh-cn/docs/start-here.md
site/docs/alpine/v3.x/start-here.md
```

- [ ] 页面 frontmatter 保留来源、版本和翻译状态信息。
- [ ] 代码块语言使用 `html` 和 `javascript`（Alpine.js 特点），确保 Prism 高亮正确。

## 4. 导航和目录

- [ ] 在 `site/src/data/docsCatalog.ts` 中新增 `alpine` 产品和 `v3.x` 版本项（Alpine 排在 Livewire 之后、Filament 之前或最后均可）。

建议结构：

```ts
{
  id: 'alpine',
  name: 'Alpine.js',
  description: '轻量级声明式 JavaScript 框架，直接在 HTML 中实现响应式交互。',
  defaultVersionSlug: 'v3.x',
  versions: [
    {
      label: 'v3.x',
      slug: 'v3.x',
      status: '翻译中',
      pages: '? 个站点页面',
      stage: '接入中',
      docsPath: '/docs/alpine/v3.x/start-here',
      docsBasePath: '/docs/alpine/v3.x',
      sourceHref: 'https://github.com/alpinejs/alpine/tree/main/packages/docs/src/en',
      sourceLabel: 'Alpine.js v3.x',
      sidebarId: 'alpineV3Sidebar',
      docsHref: 'https://alpinejs.dev/start-here',
    },
  ],
}
```

- [ ] 在 `site/sidebars.ts` 中新增 `alpineV3Sidebar`，按官网导航结构组织：

```text
入门         start-here, upgrade-guide
基础         installation, state, templating, events, lifecycle
指令         data, init, show, bind, on, text, html, model, modelable, for,
             transition, effect, ignore, ref, cloak, teleport, if, id
魔法属性     el, refs, store, watch, dispatch, nextTick, root, data, id
全局方法     alpine-data, alpine-store, alpine-bind
插件         mask, intersect, resize, persist, focus, collapse, anchor, morph, sort
高级         csp, reactivity, extending, async
```

- [ ] `site/docusaurus.config.ts` 无需修改（navbar/footer 已通过 `docsProducts` 数据驱动，新增产品自动适配）。
- [ ] 确认首页产品卡片能显示 Alpine.js。
- [ ] 确认顶部产品入口、版本下拉和源文档链接都能到 Alpine.js v3.x。

## 5. 批量页面翻译

按难度和篇幅分批推进（Alpine.js 文档普遍较短，可分 3-4 批完成）：

- [ ] **第一批（入口 + 基础，共 7 页）**：start-here、upgrade-guide、installation、state、templating、events、lifecycle
- [ ] **第二批（指令，共 18 页）**：data、init、show、bind、on、text、html、model、modelable、for、transition、effect、ignore、ref、cloak、teleport、if、id
- [ ] **第三批（魔法 + 全局，共 12 页）**：el、refs、store、watch、dispatch、nextTick、root、data、id、alpine-data、alpine-store、alpine-bind
- [ ] **第四批（插件 + 高级，共 13 页）**：mask、intersect、resize、persist、focus、collapse、anchor、morph、sort、csp、reactivity、extending、async

执行规则：

- 每个页面必须同时同步 `content/` 与 `site/docs/`。
- 未翻译页面创建占位页时，标注 `translation_status: placeholder`，明确提示"翻译中"。
- 不翻译代码、类名、方法名、配置键、命令和命令输出。
- 代码块语言使用 `html` 和 `javascript`，与源文保持一致。
- 链接优先适配到本地真实页面；未接入页面可临时保留 `https://alpinejs.dev/...` 官方链接。
- 终端输出中的日志/注释可选择性翻译以增强可读性。

### 指令页面命名注意事项

部分指令名称 `for`、`if`、`id` 等可能与 Docusaurus 路由或 JS 关键字冲突。但 Docusaurus 文档 ID 使用文件路径，目录前缀 `directives/` 可避免冲突，因此文件名无需改为 `x-for` 等形式。

### `start-here.md` 特殊处理

该文件篇幅较长（约 8KB），包含 counter/dropdown/search 三个完整教学示例。翻译时注意：
- HTML 代码块保持原样。
- 示例中的英文 UI 文本（如 "Increment"、"Toggle"、"Search..."）保留原文或在代码注释中标注中文。
- 文内链接指向真实的本地页面。

## 6. 校对和链接适配

- [ ] 按 `03_翻译校对工作流.md` 对已翻译页面逐篇校对。
- [ ] 检查标题层级、代码块、表格、链接和术语一致性。
- [ ] 按 `06_本地化超链接适配工作流.md` 修复站内链接。
- [ ] 重点检查官方 `https://alpinejs.dev/...` 链接是否映射为本地 `/docs/alpine/v3.x/...`。
- [ ] 检查指令和魔法属性页面间的交叉引用链接。

## 7. 验证

从仓库根目录检查站点文档残留（Alpine 无框架组件，此步主要作为例行检查）：

```bash
grep -rn "raw-assets\|docs-assets" site/docs/alpine/v3.x/
grep -rn "@components\|AutoScreenshot\|<Aside\|<Disclosure\|<RadioGroup\|<UtilityInjection" site/docs/alpine/v3.x/
```

从 `site/` 目录执行：

```bash
npm run typecheck
npm run build
```

验收项：

- [ ] `sources/alpine/v3.x/manifest.yml` 存在且信息完整。
- [ ] `content/alpine/v3.x/zh-cn/docs/` 与 `site/docs/alpine/v3.x/` 页面同步。
- [ ] `site/sidebars.ts` 注册了 `alpineV3Sidebar`。
- [ ] `site/src/data/docsCatalog.ts` 注册了 Alpine.js v3.x。
- [ ] `npm run typecheck` 通过。
- [ ] `npm run build` 通过；如存在 broken links，已记录来源和处理计划。
- [ ] 无 `raw-assets`、`docs-assets` 路径残留。
- [ ] 无上游框架组件（`@components`、`<Aside` 等）残留。

## 8. 收尾文档

- [ ] 更新 `docs/README.md`，补充 Alpine.js v3.x 结构说明和本计划入口。
- [ ] 更新 `docs/01_项目规划与设计/04_目录结构详解.md`，补充 Alpine.js 目录示例。
- [ ] 新增开发历史记录，建议文件名：

```text
docs/03_开发历史记录/10_Alpine_v3x_文档接入记录.md
```

- [ ] 可选：创建 Alpine.js 官方源文件结构详解文档：

```text
docs/05_开发功能细则文档/源文件结构详解/Alpine_v3x_官方GitHub源文件结构详解.md
```

## 9. 与现有产品的差异

| 维度 | Filament / Livewire | Alpine.js |
|------|---------------------|-----------|
| 图片资源 | 有大量截图 | **无图片** |
| 框架组件 | 有 Astro `<Aside>` `<AutoScreenshot>` | **纯 Markdown** |
| 导航文件 | 有 `__nav.md` 或前端导航 | **无独立导航文件，以目录结构为准** |
| 代码块语言 | php, blade | **html, javascript** |
| 文档篇幅 | 每篇 10-50KB | 大部分 0.5-14KB |
| 上游链接格式 | `/docs/3.x/...` | `https://alpinejs.dev/...` |
| 翻译难度 | 高（框架概念复杂） | 低（概念直观，篇幅短） |

# Livewire v3.x 翻译接入步骤

**日期**: 2026-05-25  
**目标**: 将 Livewire v3.x 作为中文翻译文档目标接入本项目  
**当前状态**: 全部 53 页翻译完成  

## 0. 依据和范围

执行前先阅读：

- `docs/05_开发功能细则文档/00_工作流总览.md`
- `docs/05_开发功能细则文档/01_文档采集与翻译工作流.md`
- `docs/05_开发功能细则文档/02_翻译操作指南.md`
- `docs/05_开发功能细则文档/03_翻译校对工作流.md`
- `docs/05_开发功能细则文档/04_新增产品或版本接入工作流.md`
- `docs/05_开发功能细则文档/06_本地化超链接适配工作流.md`
- `docs/05_开发功能细则文档/源文件结构详解/Livewire_v3x_官方GitHub源文件结构详解.md`

固定上游来源：

```text
repository: https://github.com/livewire/livewire
ref: v3.8.0
commit: d81d269243c3f18d302663c0ce5672990df08ca1
docs path: docs/
nav source: docs/__nav.md
official docs prefix: /docs/3.x/
local product: livewire
local version: v3.x
```

核心边界：

- 只接入 Livewire v3.x，不使用 `main` 或 Livewire 4.x 源文件。
- 优先按 `docs/__nav.md` 的 53 个官方导航页面接入。
- `docs/.obsidian`、`docs/rules`、`Untitled*.md`、`__outline.md` 默认不进入站点。
- `docs/morph.md` 应按官方 URI 映射为本地 `morphing.md`。

## 1. 源文档采集

- [x] 建立采集目录：

```text
sources/_upstream/livewire-v3.x-docs/
sources/livewire/v3.x/raw/docs/
sources/livewire/v3.x/raw-assets/
sources/livewire/v3.x/normalized/docs/
```

- [x] 从 `livewire/livewire` 的 `v3.8.0` 标签采集 `docs/`、`LICENSE.md`、`README.md`。
- [x] 保留完整原始 `docs/` 快照到 `sources/livewire/v3.x/raw/docs/`。
- [x] 检查是否存在正文图片或静态资源引用；如有，复制到 `sources/livewire/v3.x/raw-assets/`。
- [x] 创建 `sources/livewire/v3.x/manifest.yml`，记录 repo、ref、commit、路径、采集日期、license 和排除规则。

执行记录：

- 2026-05-25：已克隆 `livewire/livewire` 的 `v3.8.0` 标签到 `sources/_upstream/livewire-v3.x-docs/`，HEAD 为 `d81d269243c3f18d302663c0ce5672990df08ca1`。
- 2026-05-25：`raw/docs` 保存 84 个文件；`raw-assets` 暂无本地资源文件。

## 2. 结构清洗

- [x] 解析 `docs/__nav.md`，生成 53 个可见页面清单。
- [x] 将可见页面复制或规范化到 `sources/livewire/v3.x/normalized/docs/`。
- [x] 按官方 URI 映射文件名，特别处理 `morph.md` -> `morphing.md`。
- [x] 确认 normalized 目录不包含 `.obsidian`、`rules`、`Untitled*.md`、`__outline.md`。
- [x] 记录未进入站点但保留在 raw 中的参考文件，例如 `best-practices.md`、`how-livewire-works.md`、`the-livewire-protocol.md`。

执行记录：

- 2026-05-25：`normalized/docs` 已生成 53 个页面。
- 2026-05-25：`docs/morph.md` 已按官方 URI 输出为 `normalized/docs/morphing.md`。
- 2026-05-25：`best-practices.md`、`blade-components.md`、`component-hooks.md`、`dirty.md`、`how-livewire-works.md`、`polling.md`、`the-livewire-protocol.md`、`__outline.md`、`Untitled*.md` 和 `rules/*.md` 仅保留在 raw 中。
- 2026-05-25：已联网抓取 `https://livewire.laravel.com/docs/3.x/quickstart` 和 `https://livewire.laravel.com/docs/3.x/installation`，提取网页版 `/docs/3.x/...` 导航 slug，与 GitHub `docs/__nav.md` 和本地 `normalized/docs` 对比，三方均为 53 个 slug，差集为空。

## 3. 最小站点接入

- [x] 建立翻译和站点目录：

```text
content/livewire/v3.x/zh-cn/docs/
site/docs/livewire/v3.x/
site/static/assets/livewire/v3.x/
```

- [x] 先接入 `quickstart.md`，同时写入 `content/` 和 `site/docs/`。
- [x] 为页面 frontmatter 保留来源、版本和翻译状态信息。
- [x] 如页面存在图片，站点引用必须转换为 `/assets/livewire/v3.x/...`。

## 4. 导航和目录

- [x] 在 `site/src/data/docsCatalog.ts` 中新增 `livewire` 产品和 `v3.x` 版本项。
- [x] 在 `site/sidebars.ts` 中新增 `livewireV3Sidebar`，按 `docs/__nav.md` 分组组织：

```text
Getting Started → quickstart, installation, upgrading
Essentials → components, properties, actions, forms, events, lifecycle-hooks, nesting, testing
Features → alpine, navigate, lazy, validation, uploads, pagination, url,
           computed-properties, session-properties, redirecting, downloads,
           locked, bundling, offline, teleport
HTML Directives → wire-click, wire-submit, wire-model, wire-loading, wire-navigate,
                  wire-current, wire-cloak, wire-dirty, wire-confirm, wire-transition,
                  wire-init, wire-poll, wire-offline, wire-ignore, wire-replace,
                  wire-show, wire-stream, wire-text
Concepts → morphing, hydration, understanding-nesting
Advanced → troubleshooting, security, javascript, synthesizers, contribution-guide
Packages → volt
```

- [x] 修改 `site/docusaurus.config.ts`，支持多产品入口。
- [x] 2026-05-26：navbar"源文档"下拉新增 `docsHref` 字段，指向官方文档站点（Livewire: `https://livewire.laravel.com/docs/3.x/quickstart`，Filament: `https://filamentphp.com/docs/4.x/getting-started`），与页面"查看原文"的 GitHub `sourceHref` 分离。
- [x] 首页产品卡片显示 Livewire。
- [x] Livewire v3.x 状态已更新为"已完成"。

## 5. 批量页面翻译

全部 53 页翻译完成。按模块分批：

| 批次 | 模块 | 页数 | 状态 | 提交记录 |
|------|------|------|------|----------|
| 第1批 | Getting Started + Essentials（部分） | 8 页 | completed | `5f21135`, `c89ae00`, `93ff55a`, `6f8c59f` |
| 第2批 | Essentials 剩余 + Features | 15 页 | draft | `f6b12ff` |
| 第3批 | HTML Directives | 18 页 | draft | `c4b65e0` |
| 第4批 | Concepts | 3 页 | draft | `7a08f1b` |
| 第5批 | Advanced | 5 页 | draft | `1d0ccf1` |
| 第6批 | Packages（Volt） | 1 页 | draft | `88c1035` |

翻译统计：7 页 `completed` + 46 页 `draft` = 53 页全部有中文内容。

执行规则：

- 每个页面必须同时同步 `content/` 与 `site/docs/`。
- 不翻译代码、类名、方法名、配置键、命令和命令输出。
- GitHub 格式 admonition（`> [!note]`）已统一转为 Docusaurus `:::type[标题]` 格式。
- 内部链接已统一转换为 `/docs/livewire/v3.x/...` 格式。
- 同页锚点已适配为 Docusaurus 生成的中文 slug（如 `#注册自定义指令`）。
- 不兼容 MDX 的内容已处理：Vimeo 交互嵌入移除（morphing）、Alpine 交互预览块移除（wire-transition）、`<br>` 自闭合修复（javascript）。

## 6. 校对和链接适配

- [x] 按 `03_翻译校对工作流.md` 对已翻译页面逐篇校对。
- [x] admonition 格式统一为 Docusaurus `:::type[标题]` 语法。
- [x] 同页锚点适配为 Docusaurus 生成的中文 slug。
- [x] 指向尚未翻译页面（nesting、actions）的锚点暂时移除，保留页面链接，待翻译后恢复。
- [x] 重点检查官方 `/docs/3.x/...` 链接是否全部映射为本地 `/docs/livewire/v3.x/...`。
- [x] 术语一致性和翻译质量审查。

## 7. 验证

从仓库根目录检查站点文档残留：

```bash
grep -rn "raw-assets\|docs-assets" site/docs/livewire/v3.x/
grep -rn "@components\|AutoScreenshot\|<Aside\|<Disclosure\|<RadioGroup\|<UtilityInjection" site/docs/livewire/v3.x/
```

从 `site/` 目录执行：

```bash
npm run typecheck
npm run build
```

验收项：

- [x] `sources/livewire/v3.x/manifest.yml` 存在且信息完整。
- [x] `content/livewire/v3.x/zh-cn/docs/` 与 `site/docs/livewire/v3.x/` 页面同步。
- [x] `site/sidebars.ts` 注册了完整 `livewireV3Sidebar`。
- [x] `site/src/data/docsCatalog.ts` 注册了 Livewire v3.x，状态"已完成"。
- [x] `site/docusaurus.config.ts` 支持多产品导航，navbar 源文档使用官方链接。
- [x] `npm run typecheck` 通过。
- [x] `npm run build` 通过。
- [x] 已知 broken links：部分锚点指向尚未翻译的页面（如 `events#real-time-events-using-laravel-echo`、`components#rendering-components`、`understanding-nesting#every-component-is-an-island` 等），需在对应页面翻译后修复。（随翻译完成已修复）

## 8. 收尾文档

- [x] 更新 `docs/README.md`，补充 Livewire v3.x 结构说明和本计划入口。（已在 docs 索引中补充）
- [x] 更新 `docs/01_项目规划与设计/04_目录结构详解.md`，补充 Livewire 目录示例。
- [x] 新增开发历史记录：`docs/03_开发历史记录/07_Livewire_v3x_翻译完成记录.md`。
- [x] 在最终说明中列出变更文件、验证命令和剩余风险。

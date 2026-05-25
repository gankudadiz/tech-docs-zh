# Livewire v3.x 翻译接入步骤

**日期**: 2026-05-25  
**目标**: 将 Livewire v3.x 作为下一个中文翻译文档目标接入本项目  
**当前状态**: 待开始采集  

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

- [ ] 建立采集目录：

```text
sources/_upstream/livewire-v3.x-docs/
sources/livewire/v3.x/raw/docs/
sources/livewire/v3.x/raw-assets/
sources/livewire/v3.x/normalized/docs/
```

- [ ] 从 `livewire/livewire` 的 `v3.8.0` 标签采集 `docs/`、`LICENSE.md`、`README.md`。
- [ ] 保留完整原始 `docs/` 快照到 `sources/livewire/v3.x/raw/docs/`。
- [ ] 检查是否存在正文图片或静态资源引用；如有，复制到 `sources/livewire/v3.x/raw-assets/`。
- [ ] 创建 `sources/livewire/v3.x/manifest.yml`，记录 repo、ref、commit、路径、采集日期、license 和排除规则。

建议 manifest 初稿：

```yaml
product: livewire
version: v3.x
source:
  repo: https://github.com/livewire/livewire
  ref: v3.8.0
  commit: d81d269243c3f18d302663c0ce5672990df08ca1
  paths:
    - docs
    - LICENSE.md
    - README.md
retrieved_at: 2026-05-25
license: MIT
notes:
  - 以 docs/__nav.md 作为官方可见页面和 sidebar 的主要依据。
  - docs/.obsidian、docs/rules、Untitled*.md、__outline.md 默认不进入站点。
  - docs/morph.md 的官方 URI 是 /docs/3.x/morphing，站点路径应映射为 morphing.md。
```

## 2. 结构清洗

- [ ] 解析 `docs/__nav.md`，生成 53 个可见页面清单。
- [ ] 将可见页面复制或规范化到 `sources/livewire/v3.x/normalized/docs/`。
- [ ] 按官方 URI 映射文件名，特别处理 `morph.md` -> `morphing.md`。
- [ ] 确认 normalized 目录不包含 `.obsidian`、`rules`、`Untitled*.md`、`__outline.md`。
- [ ] 记录未进入站点但保留在 raw 中的参考文件，例如 `best-practices.md`、`how-livewire-works.md`、`the-livewire-protocol.md`。

## 3. 最小站点接入

- [ ] 建立翻译和站点目录：

```text
content/livewire/v3.x/zh-cn/docs/
site/docs/livewire/v3.x/
site/static/assets/livewire/v3.x/
```

- [ ] 先接入 `quickstart.md`，同时写入：

```text
content/livewire/v3.x/zh-cn/docs/quickstart.md
site/docs/livewire/v3.x/quickstart.md
```

- [ ] 为页面 frontmatter 保留来源、版本和翻译状态信息。
- [ ] 如页面存在图片，站点引用必须转换为 `/assets/livewire/v3.x/...`。

## 4. 导航和目录

- [ ] 在 `site/src/data/docsCatalog.ts` 中新增 `livewire` 产品和 `v3.x` 版本项。
- [ ] 在 `site/sidebars.ts` 中新增 `livewireV3Sidebar`。
- [ ] 按 `docs/__nav.md` 的分组组织 sidebar：

```text
Getting Started
Essentials
Features
HTML Directives
Concepts
Advanced
Packages
```

- [ ] 修改 `site/docusaurus.config.ts`，把当前 Filament 专用 navbar/footer 扩展为多产品入口。
- [ ] 确认首页产品卡片能显示 Livewire。
- [ ] 确认顶部产品入口、版本下拉和源文档链接都能到 Livewire v3.x。

## 5. 批量页面占位或翻译

按风险低到高推进：

- [ ] 第一批：Getting Started
  - [ ] quickstart
  - [ ] installation
  - [ ] upgrading
- [ ] 第二批：Essentials
  - [ ] components
  - [ ] properties
  - [ ] actions
  - [ ] forms
  - [ ] events
  - [ ] lifecycle-hooks
  - [ ] nesting
  - [ ] testing
- [ ] 第三批：Features
- [ ] 第四批：HTML Directives
- [ ] 第五批：Concepts、Advanced、Packages

执行规则：

- 每个页面必须同时同步 `content/` 与 `site/docs/`。
- 如果先创建占位页，必须明确标注“翻译中”，不要伪装成完整译文。
- 不翻译代码、类名、方法名、配置键、命令和命令输出。
- 链接优先适配到本地真实页面；未接入页面可临时保留官方链接或创建明确占位页。

## 6. 校对和链接适配

- [ ] 按 `03_翻译校对工作流.md` 对已翻译页面逐篇校对。
- [ ] 检查标题层级、代码块、表格、admonition、链接和术语一致性。
- [ ] 按 `06_本地化超链接适配工作流.md` 修复站内链接。
- [ ] 重点检查官方 `/docs/3.x/...` 链接是否映射为本地 `/docs/livewire/v3.x/...`。
- [ ] 重点检查 `morphing` 页面和锚点链接。

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

- [ ] `sources/livewire/v3.x/manifest.yml` 存在且信息完整。
- [ ] `content/livewire/v3.x/zh-cn/docs/` 与 `site/docs/livewire/v3.x/` 页面同步。
- [ ] `site/sidebars.ts` 注册了 `livewireV3Sidebar`。
- [ ] `site/src/data/docsCatalog.ts` 注册了 Livewire v3.x。
- [ ] `site/docusaurus.config.ts` 支持多产品导航。
- [ ] `npm run typecheck` 通过。
- [ ] `npm run build` 通过；如存在 broken links，已记录来源和处理计划。

## 8. 收尾文档

- [ ] 更新 `docs/README.md`，补充 Livewire v3.x 结构说明和本计划入口。
- [ ] 更新 `docs/01_项目规划与设计/04_目录结构详解.md`，补充 Livewire 目录示例。
- [ ] 新增开发历史记录，建议文件名：

```text
docs/03_开发历史记录/07_Livewire_v3x_文档接入记录.md
```

- [ ] 在最终说明中列出变更文件、验证命令和剩余风险。

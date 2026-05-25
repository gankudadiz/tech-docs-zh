# Livewire v3.x 官方 GitHub 源文件结构详解

**日期**: 2026-05-25  
**适用范围**: 仅适用于 Livewire v3.x  
**状态**: 准备接入  

本文档解释 Livewire v3.x 在官方 GitHub 仓库中的文档源文件结构，用于指导本项目把 Livewire 3.x 作为下一个中文翻译目标。它不是 Livewire 4.x 或其他产品的通用规则。处理其他版本时，应重新联网核对官方仓库结构。

## 1. 当前依据

本说明基于对官方仓库 Livewire v3.8.0 标签的联网核对：

```text
repository: https://github.com/livewire/livewire
tag: v3.8.0
commit: d81d269243c3f18d302663c0ce5672990df08ca1
docs tree: ae89cf882aa4eb770beee0e6ebd81eb0e95660d4
official docs path: docs/
official nav file: docs/__nav.md
official docs URL prefix: /docs/3.x/
```

截至本说明创建时，`v3.8.0` 是已核对到的 Livewire 3.x 稳定标签。当前官方主线已经进入 4.x，因此采集 Livewire 3.x 不应使用 `main` 或 4.x 标签。

建议本项目使用：

```text
product: livewire
version: v3.x
source ref: v3.8.0
site docs base: site/docs/livewire/v3.x
content docs base: content/livewire/v3.x/zh-cn/docs
site assets base: site/static/assets/livewire/v3.x
sidebar id: livewireV3Sidebar
default page: /docs/livewire/v3.x/quickstart
```

## 2. 核心结论

Livewire v3.x 官网文档主要由仓库根 `docs/` 目录提供，不需要像 Filament v4.x 那样合并 `packages/*/docs`。

关键文件是：

```text
docs/__nav.md      # 官网侧边栏和可见文档入口
docs/*.md         # 可翻译 Markdown 页面
docs/rules/       # 写作规则和内部说明，不是官网用户文档
docs/.obsidian/   # Obsidian 配置，不进入翻译
```

`docs/__nav.md` 是本项目生成 Livewire v3.x sidebar 的主要依据。`docs/__outline.md`、`docs/rules/`、`docs/.obsidian/`、`Untitled*.md` 不应直接进入站点页面。

## 3. 官方 docs 结构

Livewire v3.8.0 的 `docs/` 树共核对到 84 个文件，其中包括 Obsidian 配置、内部规则、空白草稿和正式文档页面。

需要采集为原始快照的路径：

```text
docs/
LICENSE.md
README.md
composer.json
```

需要进入 `normalized/docs` 的正式用户文档，优先以 `docs/__nav.md` 为准。官方导航中包含 53 个页面：

```text
Getting Started:
├── quickstart.md
├── installation.md
└── upgrading.md

Essentials:
├── components.md
├── properties.md
├── actions.md
├── forms.md
├── events.md
├── lifecycle-hooks.md
├── nesting.md
└── testing.md

Features:
├── alpine.md
├── navigate.md
├── lazy.md
├── validation.md
├── uploads.md
├── pagination.md
├── url.md
├── computed-properties.md
├── session-properties.md
├── redirecting.md
├── downloads.md
├── locked.md
├── bundling.md
├── offline.md
└── teleport.md

HTML Directives:
├── wire-click.md
├── wire-submit.md
├── wire-model.md
├── wire-loading.md
├── wire-navigate.md
├── wire-current.md
├── wire-cloak.md
├── wire-dirty.md
├── wire-confirm.md
├── wire-transition.md
├── wire-init.md
├── wire-poll.md
├── wire-offline.md
├── wire-ignore.md
├── wire-replace.md
├── wire-show.md
├── wire-stream.md
└── wire-text.md

Concepts:
├── morph.md
├── hydration.md
└── understanding-nesting.md

Advanced:
├── troubleshooting.md
├── security.md
├── javascript.md
├── synthesizers.md
└── contribution-guide.md

Packages:
└── volt.md
```

另外，`docs/` 中存在一些不在官方导航里的 Markdown 文件。它们可以保存在 `raw/docs` 作为参考，但默认不发布到站点：

```text
best-practices.md
blade-components.md
component-hooks.md
dirty.md
how-livewire-works.md
polling.md
the-livewire-protocol.md
__outline.md
Untitled.md
Untitled 1.md
Untitled 2.md
rules/*.md
```

其中 `dirty.md` 与 `wire-dirty.md` 内容来源存在重合风险，站点侧应优先使用官方导航中的 `wire-dirty.md`。

## 4. 官方路径映射规则

Livewire v3.x 的官方源文件没有数字排序前缀，路径映射比 Filament v4.x 简单。

常见映射如下：

| 官方源文件 | 官方路径 | 本项目归档/站点路径 |
| --- | --- | --- |
| `docs/quickstart.md` | `/docs/3.x/quickstart` | `content/livewire/v3.x/zh-cn/docs/quickstart.md` / `site/docs/livewire/v3.x/quickstart.md` |
| `docs/installation.md` | `/docs/3.x/installation` | `content/livewire/v3.x/zh-cn/docs/installation.md` / `site/docs/livewire/v3.x/installation.md` |
| `docs/components.md` | `/docs/3.x/components` | `content/livewire/v3.x/zh-cn/docs/components.md` / `site/docs/livewire/v3.x/components.md` |
| `docs/computed-properties.md` | `/docs/3.x/computed-properties` | `content/livewire/v3.x/zh-cn/docs/computed-properties.md` / `site/docs/livewire/v3.x/computed-properties.md` |
| `docs/wire-model.md` | `/docs/3.x/wire-model` | `content/livewire/v3.x/zh-cn/docs/wire-model.md` / `site/docs/livewire/v3.x/wire-model.md` |
| `docs/morph.md` | `/docs/3.x/morphing` | `content/livewire/v3.x/zh-cn/docs/morphing.md` / `site/docs/livewire/v3.x/morphing.md` |
| `docs/understanding-nesting.md` | `/docs/3.x/understanding-nesting` | `content/livewire/v3.x/zh-cn/docs/understanding-nesting.md` / `site/docs/livewire/v3.x/understanding-nesting.md` |
| `docs/volt.md` | `/docs/3.x/volt` | `content/livewire/v3.x/zh-cn/docs/volt.md` / `site/docs/livewire/v3.x/volt.md` |

映射原则：

- 以 `docs/__nav.md` 的 `uri` 字段作为站点路径依据。
- 大多数文件名可以原样映射为 slug。
- `docs/morph.md` 是例外：官方导航路径是 `/docs/3.x/morphing`，本项目应发布为 `morphing.md`，不要直接发布成 `/morph`。
- 本项目额外保留产品和版本段，即 `/docs/livewire/v3.x/...`。
- `content/` 与 `site/docs/` 应保持同名同步。

## 5. 采集范围要求

首次采集 Livewire v3.x 时，建议建立：

```text
sources/_upstream/livewire-v3.x-docs/
sources/livewire/v3.x/raw/docs/
sources/livewire/v3.x/raw-assets/
sources/livewire/v3.x/normalized/docs/
sources/livewire/v3.x/manifest.yml
content/livewire/v3.x/zh-cn/docs/
site/docs/livewire/v3.x/
site/static/assets/livewire/v3.x/
```

`manifest.yml` 建议写为：

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

## 6. 站点接入提醒

Livewire v3.x 是本项目的全新产品，接入时不能只新增文档文件，还需要同步站点结构：

- `site/src/data/docsCatalog.ts`：新增 `livewire` 产品和 `v3.x` 版本项。
- `site/sidebars.ts`：新增 `livewireV3Sidebar`，按 `docs/__nav.md` 的分组组织。
- `site/docusaurus.config.ts`：当前 navbar/footer 仍显式围绕 Filament 生成，新增 Livewire 时需要扩展为多产品入口。
- `docs/README.md`、`docs/01_项目规划与设计/04_目录结构详解.md`、必要的开发历史记录：按新增产品流程同步。

建议 `docsCatalog` 初始版本项：

```ts
{
  label: 'v3.x',
  slug: 'v3.x',
  status: '翻译中',
  pages: '53 个站点页面',
  stage: '接入中',
  docsPath: '/docs/livewire/v3.x/quickstart',
  docsBasePath: '/docs/livewire/v3.x',
  sourceHref: 'https://github.com/livewire/livewire/tree/v3.8.0/docs',
  sourceLabel: 'Livewire v3.x',
  sidebarId: 'livewireV3Sidebar',
}
```

## 7. 给后续 Agent 的执行提醒

处理 Livewire v3.x 时，先读本文档，再执行通用采集或翻译 SOP。

关键检查项：

- 不要使用 Livewire `main` 或 4.x 标签作为 3.x 翻译来源。
- 不要把 `docs/.obsidian`、`docs/rules`、`Untitled*.md` 当成用户文档。
- 不要凭 `docs/` 文件列表直接生成站点页面，应优先按 `docs/__nav.md` 的 53 个页面接入。
- 注意 `morph.md` 到 `morphing.md` 的路径映射。
- 新增页面时同步 `sources`、`content`、`site/docs`、`site/sidebars.ts` 和 `site/src/data/docsCatalog.ts`。
- 如果只先翻译部分页面，应在 manifest 或阶段记录中写明范围和缺失页面。

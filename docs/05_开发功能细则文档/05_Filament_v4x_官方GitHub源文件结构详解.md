# 05. Filament v4.x 官方 GitHub 源文件结构详解

**日期**: 2026-05-18  
**适用范围**: 仅适用于 Filament v4.x  
**状态**: 正式  

本文档只解释 Filament v4.x 在官方 GitHub 仓库中的文档源文件结构，用于指导本项目后续补齐 Filament v4.x 中文翻译站点。它不是通用规则。其他框架、其他产品、Filament 其他版本，都应由 Agent 重新联网核对官方仓库后独立生成结构说明。

## 1. 当前依据

本说明基于当前项目已采集的 Filament v4.x 上游快照：

```text
repository: https://github.com/filamentphp/filament
branch: 4.x
commit: 1c6be93ed549ad51c04688c8044d726b8f2b050e
manifest: sources/filament/v4.x/manifest.yml
local upstream: sources/_upstream/filament-4.x-docs
```

当前本项目的上游 sparse-checkout 只包含：

```text
/docs
/docs-assets
/LICENSE.md
/README.md
/translators.csv
```

这说明现有快照覆盖了根 `docs/` 和资源目录，但没有 checkout `packages/*/docs`。因此，现有源文件不足以完整复刻官网 4.x 文档树。

## 2. 核心结论

Filament v4.x 官网文档不是只由仓库根目录 `docs/` 生成。

官网文档至少由两类源文件组合而成：

```text
docs/                 # 面板、资源、导航、用户、样式、测试、插件、Blade 组件等主文档
packages/*/docs/      # Forms、Tables、Actions、Schemas、Infolists、Widgets 等包文档
```

其中 `docs/04-_PACKAGES` 是一个空占位文件。它不是待翻译正文，而是官方文档构建流程中插入 `packages/*/docs` 的位置标记。

如果只采集 `docs/`，可以得到 Introduction、Getting started、Resources、Panel configuration、Navigation 等主文档，但会漏掉官网中 Forms、Tables、Actions、Schemas、Infolists、Notifications、Widgets 的大部分页面。

## 3. 根 docs 结构

根 `docs/` 在当前快照中包含 76 篇 Markdown 文档，另有一个空占位文件 `04-_PACKAGES`。

```text
docs/
├── 01-introduction/
│   ├── 01-overview.md
│   ├── 02-installation.md
│   ├── 03-ai.md
│   └── 04-optimizing-local-development.md
├── 02-getting-started.md
├── 03-resources/
│   ├── 01-overview.md
│   ├── 02-listing-records.md
│   ├── 03-creating-records.md
│   ├── 04-editing-records.md
│   ├── 05-viewing-records.md
│   ├── 06-deleting-records.md
│   ├── 07-managing-relationships.md
│   ├── 08-nesting.md
│   ├── 09-singular.md
│   ├── 10-global-search.md
│   ├── 11-widgets.md
│   ├── 12-custom-pages.md
│   └── 13-code-quality-tips.md
├── 04-_PACKAGES
├── 05-panel-configuration.md
├── 06-navigation/
│   ├── 01-overview.md
│   ├── 02-custom-pages.md
│   ├── 03-user-menu.md
│   └── 04-clusters.md
├── 07-users/
│   ├── 01-overview.md
│   ├── 02-multi-factor-authentication.md
│   └── 03-tenancy.md
├── 08-styling/
│   ├── 01-overview.md
│   ├── 02-css-hooks.md
│   ├── 03-colors.md
│   └── 04-icons.md
├── 09-advanced/
│   ├── 01-render-hooks.md
│   ├── 02-assets.md
│   ├── 03-enums.md
│   ├── 04-file-generation.md
│   ├── 05-modular-architecture.md
│   └── 06-security.md
├── 10-testing/
│   ├── 01-overview.md
│   ├── 02-testing-resources.md
│   ├── 03-testing-tables.md
│   ├── 04-testing-schemas.md
│   ├── 05-testing-actions.md
│   └── 06-testing-notifications.md
├── 11-plugins/
│   ├── 01-getting-started.md
│   ├── 02-panel-plugins.md
│   ├── 03-building-a-panel-plugin.md
│   ├── 04-building-a-standalone-plugin.md
│   └── 05-configurable-resources-and-pages.md
├── 12-components/
│   ├── 01-overview.md
│   ├── 02-action.md
│   ├── 02-form.md
│   ├── 02-infolist.md
│   ├── 02-notifications.md
│   ├── 02-schema.md
│   ├── 02-table.md
│   ├── 02-widget.md
│   ├── 03-avatar.md
│   ├── 03-badge.md
│   ├── 03-breadcrumbs.md
│   ├── 03-button.md
│   ├── 03-callout.md
│   ├── 03-checkbox.md
│   ├── 03-dropdown.md
│   ├── 03-empty-state.md
│   ├── 03-fieldset.md
│   ├── 03-icon-button.md
│   ├── 03-input-wrapper.md
│   ├── 03-input.md
│   ├── 03-link.md
│   ├── 03-loading-indicator.md
│   ├── 03-modal.md
│   ├── 03-pagination.md
│   ├── 03-section.md
│   ├── 03-select.md
│   └── 03-tabs.md
├── 13-deployment.md
└── 14-upgrade-guide.md
```

根 `docs/` 的主要特点：

- 文件名前缀用于控制官方阅读顺序，不应进入站点 URL。
- `02-getting-started.md` 在官网侧边栏中属于独立的 Guides 分组，不属于 Introduction 分组。
- `04-_PACKAGES` 不产生页面，不能翻译成站点文档。
- `12-components/` 是 Blade UI 组件文档，不等同于 `packages/forms/docs`、`packages/tables/docs` 等包文档。

## 4. packages docs 结构

当前快照中，官方仓库的 `packages/*/docs` 合计 82 篇 Markdown 文档。这部分是官网 4.x 大量模块页面的来源。

```text
packages/actions/docs/          # 12 篇
packages/forms/docs/            # 23 篇
packages/infolists/docs/        # 9 篇
packages/notifications/docs/    # 3 篇
packages/schemas/docs/          # 9 篇
packages/tables/docs/           # 23 篇
packages/widgets/docs/          # 3 篇
```

详细结构如下：

```text
packages/actions/docs/
├── 01-overview.md
├── 02-modals.md
├── 03-grouping-actions.md
├── 04-create.md
├── 05-edit.md
├── 06-view.md
├── 07-delete.md
├── 08-replicate.md
├── 09-force-delete.md
├── 10-restore.md
├── 11-import.md
└── 12-export.md

packages/forms/docs/
├── 01-overview.md
├── 02-text-input.md
├── 03-select.md
├── 04-checkbox.md
├── 05-toggle.md
├── 06-checkbox-list.md
├── 07-radio.md
├── 08-date-time-picker.md
├── 09-file-upload.md
├── 10-rich-editor.md
├── 11-markdown-editor.md
├── 12-repeater.md
├── 13-builder.md
├── 14-tags-input.md
├── 15-textarea.md
├── 16-key-value.md
├── 17-color-picker.md
├── 18-toggle-buttons.md
├── 19-slider.md
├── 20-code-editor.md
├── 21-hidden.md
├── 22-custom-fields.md
└── 23-validation.md

packages/infolists/docs/
├── 01-overview.md
├── 02-text-entry.md
├── 03-icon-entry.md
├── 04-image-entry.md
├── 05-color-entry.md
├── 06-code-entry.md
├── 07-key-value-entry.md
├── 08-repeatable-entry.md
└── 09-custom-entries.md

packages/notifications/docs/
├── 01-overview.md
├── 02-database-notifications.md
└── 03-broadcast-notifications.md

packages/schemas/docs/
├── 01-overview.md
├── 02-layouts.md
├── 03-sections.md
├── 04-tabs.md
├── 05-wizards.md
├── 06-callouts.md
├── 07-empty-states.md
├── 08-primes.md
└── 09-custom-components.md

packages/tables/docs/
├── 01-overview.md
├── 02-columns/
│   ├── 01-overview.md
│   ├── 02-text.md
│   ├── 03-icon.md
│   ├── 04-image.md
│   ├── 05-color.md
│   ├── 06-select.md
│   ├── 07-toggle.md
│   ├── 08-text-input.md
│   ├── 09-checkbox.md
│   └── 10-custom-columns.md
├── 03-filters/
│   ├── 01-overview.md
│   ├── 02-select.md
│   ├── 03-ternary.md
│   ├── 04-query-builder.md
│   ├── 05-custom.md
│   └── 06-layout.md
├── 04-actions.md
├── 05-layout.md
├── 06-summaries.md
├── 07-grouping.md
├── 08-empty-state.md
└── 09-custom-data.md

packages/widgets/docs/
├── 01-overview.md
├── 02-stats-overview.md
└── 03-charts.md
```

## 5. 官方路径映射规则

本项目发布到 Docusaurus 时，需要把官方排序前缀去掉，并映射到站点路径。

根 `docs/` 的常见映射：

| 官方源文件 | 官网路径 | 本项目归档/站点路径 |
| --- | --- | --- |
| `docs/01-introduction/01-overview.md` | `/docs/4.x/introduction/overview` | `content/.../docs/introduction/overview.md` / `site/docs/filament/v4.x/introduction/overview.md` |
| `docs/02-getting-started.md` | `/docs/4.x/getting-started` | `content/.../docs/getting-started.md` / `site/docs/filament/v4.x/getting-started.md` |
| `docs/03-resources/02-listing-records.md` | `/docs/4.x/resources/listing-records` | `content/.../docs/resources/listing-records.md` / `site/docs/filament/v4.x/resources/listing-records.md` |
| `docs/05-panel-configuration.md` | `/docs/4.x/panel-configuration` | `content/.../docs/panel-configuration.md` / `site/docs/filament/v4.x/panel-configuration.md` |
| `docs/06-navigation/03-user-menu.md` | `/docs/4.x/navigation/user-menu` | `content/.../docs/navigation/user-menu.md` / `site/docs/filament/v4.x/navigation/user-menu.md` |

`packages/*/docs` 的常见映射：

| 官方源文件 | 官网路径 | 本项目归档/站点路径 |
| --- | --- | --- |
| `packages/forms/docs/01-overview.md` | `/docs/4.x/forms/overview` | `content/.../docs/forms/overview.md` / `site/docs/filament/v4.x/forms/overview.md` |
| `packages/forms/docs/02-text-input.md` | `/docs/4.x/forms/text-input` | `content/.../docs/forms/text-input.md` / `site/docs/filament/v4.x/forms/text-input.md` |
| `packages/actions/docs/04-create.md` | `/docs/4.x/actions/create` | `content/.../docs/actions/create.md` / `site/docs/filament/v4.x/actions/create.md` |
| `packages/tables/docs/01-overview.md` | `/docs/4.x/tables/overview` | `content/.../docs/tables/overview.md` / `site/docs/filament/v4.x/tables/overview.md` |
| `packages/tables/docs/02-columns/01-overview.md` | `/docs/4.x/tables/columns/overview` | `content/.../docs/tables/columns/overview.md` / `site/docs/filament/v4.x/tables/columns/overview.md` |
| `packages/tables/docs/03-filters/01-overview.md` | `/docs/4.x/tables/filters/overview` | `content/.../docs/tables/filters/overview.md` / `site/docs/filament/v4.x/tables/filters/overview.md` |
| `packages/schemas/docs/05-wizards.md` | `/docs/4.x/schemas/wizards` | `content/.../docs/schemas/wizards.md` / `site/docs/filament/v4.x/schemas/wizards.md` |
| `packages/widgets/docs/03-charts.md` | `/docs/4.x/widgets/charts` | `content/.../docs/widgets/charts.md` / `site/docs/filament/v4.x/widgets/charts.md` |

映射原则：

- 去掉数字排序前缀，例如 `01-overview.md` -> `overview.md`。
- 根目录文件保留为一级路径，例如 `05-panel-configuration.md` -> `panel-configuration.md`。
- 包名成为官网模块名，例如 `packages/tables/docs` -> `tables/`。
- 子目录继续保留，例如 `03-filters/01-overview.md` -> `tables/filters/overview.md`。
- 本项目额外保留产品和版本段，即 `content/filament/v4.x/zh-cn/docs/...` 和 `site/docs/filament/v4.x/...`。
- `content/` 归档层已经收口为官网 URL 结构，不再保留 `01-introduction/`、`02-getting-started.md`、`03-resources/` 这类 GitHub 编号路径副本。

## 6. 采集范围要求

如果目标是做出接近官网的 Filament v4.x 中文翻译版，后续采集不能只包含：

```text
docs
docs-assets
```

应至少包含：

```text
docs
docs-assets
packages/actions/docs
packages/forms/docs
packages/infolists/docs
packages/notifications/docs
packages/schemas/docs
packages/tables/docs
packages/widgets/docs
LICENSE.md
README.md
translators.csv
```

对应的 `manifest.yml` 也应明确记录这些路径，不能只写 `docs_path: docs`。建议把 `source.paths` 改成数组，并在 `notes` 中说明 `docs/04-_PACKAGES` 的含义。

## 7. 本项目当前状态

截至本文档创建时，本项目状态是：

```text
sources/filament/v4.x/raw/docs        已保存根 docs 快照
sources/filament/v4.x/raw/packages    已保存 package docs 快照
sources/filament/v4.x/normalized/docs 已规范化 introduction、getting-started、resources 部分
content/filament/v4.x/zh-cn/docs      已按官网 URL 结构接入 158 篇译文或占位页
site/docs/filament/v4.x               已按官网 URL 结构接入 158 篇可见页面
```

需要特别注意：

- `site/docs/filament/v4.x/forms/overview.md`、`tables/overview.md`、`actions/overview.md` 等页面存在并不代表对应模块已经完整翻译，很多新页面仍是“翻译中”占位。
- `sources/filament/v4.x/normalized/docs` 当前不是完整英文源，它只是一部分清洗结果。
- `site/sidebars.ts` 当前已按 Filament 4.x 官网侧边栏结构显式列出 158 个页面。

## 8. 给后续 Agent 的执行提醒

处理 Filament v4.x 时，先读本文档，再执行通用采集或翻译 SOP。

关键检查项：

- 不要把 `docs/04-_PACKAGES` 当成正文页面。
- 不要只看 `https://github.com/filamentphp/filament/tree/4.x/docs` 判断官网文档全集。
- 必须检查 `packages/*/docs`，尤其是 `tables`、`forms`、`actions`、`schemas`。
- 新增 `packages/*/docs` 页面时，同时同步 `sources`、`content`、`site/docs` 和 `site/sidebars.ts`。
- 其他版本不要复用本文档结论，应联网重新核对官方仓库结构后另写版本专属说明。

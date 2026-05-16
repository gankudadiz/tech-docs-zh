# 03. Filament v4.x 首轮翻译记录

**日期**: 2026-05-17
**阶段**: 批量翻译与校对

## 1. 翻译范围

本轮翻译覆盖 Filament v4.x 文档的两大章节：

### 01-introduction（介绍）— 4/4 篇，已全部完成

| 文件 | 标题 |
|------|------|
| `01-overview.md` | Filament 是什么？ |
| `02-installation.md` | 安装 |
| `03-ai.md` | AI 辅助开发 |
| `04-optimizing-local-development.md` | 优化本地开发 |

### 03-resources（资源）— 4/13 篇

| 文件 | 标题 |
|------|------|
| `01-overview.md` | 概述 |
| `02-listing-records.md` | 列出记录 |
| `03-creating-records.md` | 创建记录 |
| `04-editing-records.md` | 编辑记录 |

未翻译：`05` 至 `13`（查看记录、删除记录、管理关联、嵌套资源、单例资源、全局搜索、小部件、自定义页面、代码质量建议）。

## 2. 翻译流程

遵循 `docs/05_开发功能细则文档/02_翻译操作指南.md` 中定义的标准流程：

1. 读取 `sources/filament/v4.x/raw/docs/` 中的英文源文件
2. 翻译内容，保存到 `content/filament/v4.x/zh-cn/docs/`
3. 复制到 `site/docs/filament/v4.x/` 并修复图片路径
4. 在 `site/sidebars.ts` 中注册新文档
5. 复制图片资源到 `site/static/assets/`

## 3. 踩坑与修复

### 3.1 侧边栏未显示

**现象**：翻译文件已放入 `site/docs/`，但侧边栏无新增条目。

**原因**：Docusaurus 侧边栏是手动配置的（`site/sidebars.ts`），不会自动扫描文件系统。

**修复**：在 `sidebars.ts` 对应分类的 `items` 数组中添加文档 ID。

**文档更新**：已在 `02_翻译操作指南.md` 新增第 6 节"侧边栏配置"，补充完整操作步骤和示例。

### 3.2 Astro 组件编译报错

**现象**：`Module not found: Can't resolve '@components/AutoScreenshot.astro'`。

**原因**：上游 Filament 文档使用 Astro 框架，源文件中的 `AutoScreenshot`、`Aside` 等组件在 Docusaurus 中不可用。

**修复**：
- `AutoScreenshot` → 标准 Markdown 图片语法 `![alt](/assets/.../name.jpg)`
- `<Aside variant="info">` → `:::info` 自定义容器语法

**文档更新**：已在 `02_翻译操作指南.md` 新增第 7 节"图片资源处理"，说明 Astro 组件转换规则。

### 3.3 图片文件缺失

**现象**：图片路径已转为绝对路径，但构建报错 `couldn't be resolved to an existing local image file`。

**原因**：图片文件存在于上游源码（`sources/_upstream/.../docs-assets/`），但未复制到站点静态目录（`site/static/assets/`）。

**修复**：从上游源码复制缺失的 7 张截图到 `site/static/assets/filament/v4.x/screenshots/images/light/panels/resources/`。

**文档更新**：已在 `02_翻译操作指南.md` 第 7.3 节补充完整的图片处理流程，包括复制和验证步骤。

## 4. 校对结果

对 8 篇已翻译文档进行逐篇对比审核，发现并修复了 3 个问题：

| 文件 | 问题 | 处理 |
|------|------|------|
| `03-resources/01-overview.md` | tip 块多出一句不属于该位置的原文内容 | 已删除多余句子 |
| `03-resources/03-creating-records.md` | 生命周期钩子代码注释被翻译为中文 | 已恢复英文注释 |
| `03-resources/04-editing-records.md` | 生命周期钩子代码注释被翻译为中文 | 已恢复英文注释 |

**无需修复的项**：
- introduction 4 篇缺少 Astro `import` 语句 → 正确行为，已用 Docusaurus 语法替代
- `02-listing-records.md` 中 `UtilityInjection` 组件替换为纯文本 → 正确行为，Docusaurus 不支持该组件
- `02-installation.md` 中 RadioGroup 交互功能丢失 → 结构性问题，Docusaurus 不支持 Alpine.js 交互，内容已平铺为线性文档

## 5. 当前进度总览

| 章节 | 已翻译 | 总计 | 进度 |
|------|--------|------|------|
| 01-introduction | 4 | 4 | 100% |
| 02-getting-started | 1 | 1 | 100% |
| 03-resources | 4 | 13 | 31% |
| 其他章节 | 0 | 58 | 0% |
| **合计** | **9** | **76** | **12%** |

## 6. 后续计划

- 继续翻译 `03-resources` 剩余 9 篇（查看记录、删除记录、管理关联等）
- 翻译 `05-panel-configuration`（面板配置，独立文档）
- 翻译 `06-navigation`（导航，4 篇）
- 翻译 `07-users`（用户，3 篇）

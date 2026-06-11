---
title: 导出主题
description: MarkText 导出文档的主题自定义
sidebar_position: 17
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/EXPORT_THEMES.md
translation_status: translated
---

# 导出主题

MarkText 允许你修改要导出的文档的外观。默认提供三个主题：Academic、GitHub 和 Liber（写作主题）。

## 安装主题

你可以通过将 `.css` 文件复制到[应用数据目录](APPLICATION_DATA_DIRECTORY.md)中的 `themes/export/` 目录来安装主题，但你可能需要重启 MarkText 才能检测到主题。

## 创建主题

MarkText 使用 GitHub 主题作为始终可用的基础样式。自定义主题可以添加额外样式，但必须覆盖 GitHub 样式才能进行更改（如字体或标题下划线）。你可以在[这里](https://github.com/sindresorhus/github-markdown-css/blob/gh-pages/github-markdown.css)查看所有预定义样式。自定义主题的示例可以在[这里](https://github.com/marktext/marktext/blob/develop/src/renderer/assets/themes/export/academic.theme.css)和[这里](https://github.com/marktext/marktext/blob/develop/src/renderer/assets/themes/export/liber.theme.css)找到。

### 主题设置

主题目前只有一个名称（`A-z0-9 -`），通过第一行的 CSS 注释定义，如：

```css
/** Liber **/

.markdown-body {
  /* ... */
}
```

---
title: 主题
description: MarkText 内置 33 个主题的完整列表
sidebar_position: 19
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/THEMES.md
translation_status: translated
---

# 主题

MarkText 包含 33 个内置主题，分为浅色和深色两大类。每个主题为编辑器界面和语法高亮提供完整的配色方案。

下方的名称与 **Theme** 菜单中显示的标签一致。`preferences.json` 中 `theme` 字段存储的底层 ID 可能不同——例如 *Cadmium Light* → `light`，*Cadmium Dark* → `dark`，*Graphite Light* → `graphite`，*Ulysses Light* → `ulysses`。完整的标签↔ID 映射位于 `src/main/menu/templates/theme.ts`。

## 浅色主题

| 主题 | 描述 |
|------|------|
| **Ayu Light** | 温暖舒适的浅色主题，色调柔和 |
| **Cadmium Light** | 简洁极简的浅色主题（默认） |
| **Catppuccin Latte** | 柔和的粉彩主题，暖色调 |
| **Everforest Light** | 灵感来自自然的绿色浅色主题 |
| **Graphite Light** | 冷灰色调的浅色主题 |
| **Gruvbox Light** | 复古风格，温暖的大地色调 |
| **Rosé Pine Dawn** | 优雅主题，带微妙的玫瑰色调 |
| **Solarized Light** | 经典的精确配色方案 |
| **Tokyo Night Light** | Tokyo Night 的现代浅色变体 |
| **Ulysses Light** | 灵感来自 Ulysses 写作应用 |

## 深色主题

| 主题 | 描述 |
|------|------|
| **Ayu Dark** | 深沉舒适的深色主题 |
| **Ayu Mirage** | Ayu 更柔和的深色变体 |
| **Cadmium Dark** | 简洁极简的深色主题 |
| **Catppuccin Mocha** | 丰富的暖色深色彩虹主题 |
| **cyberdream** | 霓虹色调的未来感深色主题 |
| **Dracula** | 流行的紫色调深色主题 |
| **Everforest Dark** | 灵感来自自然森林的深色主题 |
| **Gruvbox Dark** | 复古风格的暖色深色主题 |
| **Horizon Dark** | 温暖鲜艳的深色主题 |
| **Kanagawa** | 灵感来自葛饰北斋的《神奈川冲浪里》 |
| **Material Dark** | Google Material Design 深色主题 |
| **Monokai Pro** | 经典 Monokai 的专业变体 |
| **Nightfox** | 冷色调深色主题，对比度良好 |
| **Nord** | 北欧风蓝色调简洁深色主题 |
| **One Dark** | Atom 编辑器的标志性深色主题 |
| **Oxocarbon Dark** | IBM Carbon 风格极简深色主题 |
| **Palenight** | 优雅的紫色调深色主题 |
| **Rosé Pine** | Soho 风格，柔和的玫瑰色调 |
| **Rosé Pine Moon** | Rosé Pine 的更深变体 |
| **Solarized Dark** | 经典的精确深色配色方案 |
| **Synthwave '84** | 80 年代复古霓虹美学 |
| **Tokyo Night** | 灵感来自 VSCode 的现代深色主题 |
| **Tokyo Night Storm** | 对比度更高的 Tokyo Night 变体 |

## 切换主题

你可以通过以下方式切换主题：

1. **菜单**：前往 `Theme` 菜单并选择你喜欢的主题
2. **偏好设置**：打开 `Preferences` → `Theme` 标签页预览和选择主题
3. **跟随系统**：启用"跟随系统主题"以根据系统设置自动在浅色和深色主题之间切换

## 自定义主题

自定义主题支持计划在未来版本中推出。目前，你可以使用 Preferences → Theme 中的"Custom CSS"选项来覆盖主题样式。

## 主题致谢

许多主题灵感来自开发者社区的流行配色方案：

- [Catppuccin](https://github.com/catppuccin/catppuccin) - MIT License
- [Dracula](https://github.com/dracula/dracula-theme) - MIT License
- [Everforest](https://github.com/sainnhe/everforest) - MIT License
- [Gruvbox](https://github.com/morhetz/gruvbox) - MIT License
- [Nord](https://github.com/nordtheme/nord) - MIT License
- [Rosé Pine](https://github.com/rose-pine/rose-pine-theme) - MIT License
- [Solarized](https://github.com/altercation/solarized) - MIT License
- [Tokyo Night](https://github.com/enkia/tokyo-night-vscode-theme) - MIT License
- [Gogh Themes](https://github.com/Gogh-Co/Gogh) - MIT License（配色参考）

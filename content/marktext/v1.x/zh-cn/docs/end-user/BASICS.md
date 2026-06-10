---
title: 基础入门
description: MarkText 编辑器基础操作指南
sidebar_position: 1
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/BASICS.md
translation_status: translated
---

# 基础入门

## 快速开始

MarkText 是一款支持实时预览的 Markdown 编辑器，支持多种 Markdown 扩展语法。你可以直接编写和编辑文本，MarkText 会自动隐藏所有不必要的语法元素。首次启动 MarkText 时会显示一个空的编辑器窗口。你可以查看[快捷键](KEYBINDINGS.md)或命令面板（<kbd>CmdOrCtrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>）了解所有可用命令，或者直接输入 `@` 来打开包含可用文本元素的覆盖层。MarkText 提供了简洁的界面，接下来的章节将介绍界面和功能。

![](/assets/marktext/v1.x/marktext-default.png)

### 界面

#### 切换侧边栏

侧边栏由三个面板组成，你可以通过按 <kbd>CmdOrCtrl</kbd>+<kbd>J</kbd> 来切换侧边栏：

- 文件系统浏览器（树形视图），显示已打开的根目录。树形视图还包含一个可折叠的*已打开文件*子节点——通过 `openedFilesInSidebar` 偏好设置来切换。
- 文件内搜索
- 当前标签页的目录

#### 切换标签页

MarkText 可以作为单文件编辑器使用，但会将所有文件在单独的标签页中打开。标签页可以通过 <kbd>CmdOrCtrl</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> 切换显示，并支持拖拽重新排序。

**想要使用标签页但不显示它们？**

你可以隐藏标签页并使用快捷键（如 <kbd>CmdOrCtrl</kbd>+<kbd>Tab</kbd>）在标签页之间循环切换，或使用侧边栏的*已打开文件*面板。

![](/assets/marktext/v1.x/marktext-interface-1.png)

#### 切换编辑模式

你可以使用 <kbd>CmdOrCtrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> 在预览模式和源码编辑模式之间切换。实时预览编辑器是默认模式，功能丰富。所有功能的详细概览请参阅[这里](EDITING.md)。

#### 打字机模式和专注模式

使用 <kbd>CmdOrCtrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> 进入无干扰的专注模式，或使用 <kbd>CmdOrCtrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> 进入打字机模式。

<h4 align="center">🐱 编辑模式 🐶</h4>

| 源码模式               | 打字机模式                 | 专注模式               |
|:--------------------:|:------------------------:|:-------------------:|
| ![](/assets/marktext/v1.x/source.gif) | ![](/assets/marktext/v1.x/typewriter.gif) | ![](/assets/marktext/v1.x/focus.gif) |

## 打开和修改 Markdown 文件

### 打开第一个文件

你可以使用菜单 `File -> Open File` 或按 <kbd>CmdOrCtrl</kbd>+<kbd>O</kbd> 打开文件对话框来选择一个 Markdown 文件。另一种方式是通过命令行传入目录或文件来启动 MarkText。

### 保存编辑的文件

修改完成后，你可以通过 <kbd>CmdOrCtrl</kbd>+<kbd>S</kbd> 保存文件，或使用*另存为*来使用不同的文件名。

### 打开目录

MarkText 还支持通过 <kbd>CmdOrCtrl</kbd>+<kbd>Shift</kbd>+<kbd>O</kbd> 或侧边栏的*打开文件夹*按钮来打开目录。打开目录后，所有文件和目录都会显示在侧边栏的树形视图中。树形视图允许你打开更多文件、浏览和修改已打开根目录内的文件或目录。树形视图上方是所有已打开的文件。你还可以使用快速打开（<kbd>CmdOrCtrl</kbd>+<kbd>P</kbd>）来快速打开已打开根目录或编辑器中的文件，通过方向键导航或鼠标选择文件。要查看其他侧边栏面板（如文件内搜索），请点击左侧侧边栏图标。

![](/assets/marktext/v1.x/marktext-interface-2.png)

## 主题

你可以通过点击主题应用菜单中的条目来更改应用主题。

## 偏好设置

你可以在设置窗口中控制和修改所有偏好设置，或编辑[应用数据目录](APPLICATION_DATA_DIRECTORY.md)中的 `preferences.json`。偏好文件的详细信息请参阅[这里](PREFERENCES.md)。

- 通用应用设置
- 控制编辑器外观的设置
- Markdown 相关设置
- 应用主题
- 图片处理选项

![](/assets/marktext/v1.x/marktext-settings.png)

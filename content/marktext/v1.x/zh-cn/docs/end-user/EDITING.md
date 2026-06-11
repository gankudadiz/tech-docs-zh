---
title: 编辑深度讲解
description: MarkText 实时编辑器和编辑功能详解
sidebar_position: 2
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/EDITING.md
translation_status: translated
---

# 编辑深度讲解

让我们深入了解实时编辑器和编辑功能。

## 文本操作

MarkText 实时显示格式化文本，你可以直接编写和编辑文本，也可以使用 Markdown 语法。为了提高写作效率，有很多快捷键可以更好地操作文本。在偏好设置中，你可以控制编辑器设置，如字体设置、自动补全和行宽。

## 选择

你可以用鼠标光标选择文本，双击单词，或使用键盘 <kbd>Shift</kbd>+<kbd>方向键</kbd>。

**格式覆盖层：**

格式覆盖层是一个弹出窗口，当你选择文本时会自动出现。你可以轻松转换文本和行内 Markdown，以及移除格式。

![](/assets/marktext/v1.x/marktext-format-popup.png)

- 粗体
- 斜体
- 下划线
- 删除线
- 行内代码
- 行内数学公式
- 创建链接
- 创建图片
- 移除格式

还有更多覆盖层可用于表情符号、链接、图片和表格。

## 删除

你想删除标题、列表或表格吗？只需选择区域并按退格键。

## 括号和引号自动补全

你可以配置 MarkText 来自动补全 Markdown 语法、括号和引号。默认情况下，输入第一个字符时会自动补全 `()`、`[]`、`{}`、`**`、`__`、`$$`、`""` 和 `''`。

## 链接

链接默认显示为普通文本，但如果你点击链接，它会显示为带有标题和 URL 的 Markdown 链接，如下所示：

![](/assets/marktext/v1.x/marktext-link-preview.png)

## 格式化

MarkText 会根据 CommonMark 和 GitHub Flavored Markdown 规范自动格式化你的 Markdown 文档。一些设置（如列表缩进）可以通过偏好设置控制。

## 编辑功能

#### 快速插入

当你开始一个新行时，只需输入 `/` 即可访问包含所有可用 Markdown 功能的弹出窗口。此时，你可以选择一个条目，该行将转换为所选属性。

![](/assets/marktext/v1.x/marktext-quick-insert.png)

#### 行转换器

你可以通过点击下图中高亮的图标并选择 `Turn Into` 来将一行转换为另一种类型。此外，你可以复制所选行、在所选行上方创建段落或删除该行。

![](/assets/marktext/v1.x/marktext-line-transformer.png)

#### 表格工具

在 Markdown 中编写和管理表格有时很困难。在 MarkText 中，你可以按 <kbd>CmdOrCtrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> 打开表格对话框，创建可变行列数的表格。行数和列数之后可以通过表格工具（表格上方的第一个图标）根据需要更改。你可以在表格单元格中使用所有行内样式，并通过表格顶部的表格工具对齐文本。

**插入和删除行列：**

你可以点击现有单元格，然后点击右侧菜单（针对行）或底部菜单（针对列）来插入或删除行或列。

![](/assets/marktext/v1.x/marktext-table_drag_drop.png)

**移动表格单元格：**

你可以通过点击单元格菜单（如上所述）并按住鼠标左键拖拽来移动行或列，如下所示：

![](/assets/marktext/v1.x/marktext-table-gif.gif)

#### 图片工具

![](/assets/marktext/v1.x/marktext-image-viewer.png)

MarkText 提供了一个图片查看器和一个用于选择和标注图片的弹出窗口。你可以使用鼠标光标调整任何图片的大小；更改会实时应用。点击图片或编写 `![]()` 时，会自动出现一个弹出窗口，允许你从磁盘选择图片，或粘贴路径或 URL。图片可以自动上传到云端，或移动到本地磁盘上的相对或绝对路径。甚至支持粘贴不在磁盘上的图片，这些图片会在后台存储。此外，你可以控制图片对齐方式：行内、左对齐、居中或右对齐。

![](/assets/marktext/v1.x/marktext-image-popup.png)

#### 表情符号选择器

无需长时间搜索即可将表情符号即时添加到 Markdown 文档中。输入时，应用程序会自动刷新可用表情符号列表。

![](/assets/marktext/v1.x/marktext-emoji-picker.png)

#### 专注模式

![](/assets/marktext/v1.x/marktext-focus-mode.png)

专注模式通过淡化其他行来帮助你专注于当前行。要激活专注模式，只需按 <kbd>CmdOrCtrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd>。

#### 打字机模式

在打字机模式下，光标始终保持在编辑器中央。

## 文件编码

MarkText 会在打开文件时自动检测文件的编码和字节顺序标记（BOM）。默认编码是 UTF-8，应该支持所有需要的字符，但可以在设置中更改。你可以禁用自动编码检测；但是，应用程序将假定所有文件都是 UTF-8 编码。当前使用的编码可以通过命令面板显示和更改。

## 行尾

MarkText 会自动分析每个文件并检测使用的行尾，也可以通过命令面板更改。

## 查找和替换

**在编辑器内：**

要快速查找文档中的关键词，请按 <kbd>CmdOrCtrl</kbd>+<kbd>F</kbd> 打开搜索弹出窗口。现在你可以搜索文本或替换给定的关键词。

**在已打开文件夹中搜索：**

MarkText 提供了一个内置的文件系统浏览器（树形视图），带有快速文件搜索器。在搜索栏中输入关键词并选择需要的选项（如正则表达式或不区分大小写搜索）。就这样！MarkText 将在已打开的根目录中搜索所有 Markdown 文件。

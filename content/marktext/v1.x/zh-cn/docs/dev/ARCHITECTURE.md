# 项目架构

## 概述

- `.`：配置文件
- `package.json`：项目设置
- `out/`：编译后的源代码（main、preload、renderer 包）
- `dist/`：用于分发的打包二进制文件和安装程序
- `resources/`：应用程序资源（主题、图标等），包含在构建产物中
- `docs/`：文档和资源
- `node_modules/`：依赖项
- `src`：MarkText 源代码
  - `common/`：只需 Node.js API 的通用源文件。此文件夹中的代码可用于除 `muya` 之外的所有其他文件夹。
  - `main/`：需要 Electron 主进程 API 的主进程源文件。`main` 文件可以使用 `common` 中的源代码。
  - `muya/`：MarkText 的后端，仅使用纯 JavaScript、BOM 和 DOM API。不要使用 Electron 或 Node.js API。
  - `renderer`：需要 Electron 渲染进程 API 的前端，可以使用 `common` 或 `muya` 中的源代码。
- `static/`：应用程序资源（图片、主题等）
- `test/`：包含（单元）测试

## MarkText 简介

MarkText 是一个支持多种 Markdown 扩展的实时预览（所见即所得）Markdown 编辑器，我们的理念是保持简洁、简单和最小化。该应用使用 TypeScript、Vue 3 和 CSS 构建，基于 Electron 运行（Muya 编辑器后端目前仍使用 JavaScript）。我们使用了一些原生 Node 库和 Pinia 来管理渲染进程的状态。MarkText 可以分为三个部分：核心 Muya、主进程和渲染进程。

Muya 通过基于块结构的多个模块提供实时预览和 Markdown 编辑功能。你可以将其想象为编辑器后端，包含 Markdown 解析模块、以块结构存储数据、按照 CommonMark 和 GitHub Flavored Markdown 规范（以及一些额外规范）进行 Markdown 文档转换、事件监听器，以及一个导出器，用于生成独立的 HTML 和 Markdown 文件，同时也生成所见即所得编辑器。Muya 是单线程的，MarkText 也是如此，但使用异步函数来提升性能。

> 注意：MarkText 的源代码编辑器由 CodeMirror 提供，优化程度不高，功能也不丰富。它不是 Muya 的一部分，而是编辑器（渲染进程）的一个功能，它从 Muya 加载 Markdown 文本（导出），对其进行操作，并在切换回预览模式时将文本重新导入 Muya。

> 注意：Muya 需要进行核心重构，以提供更好的模块化、API 和插件支持。此外，数据结构也需要改进以获得更好的性能和稳定性。

编辑器代表视图层，分为两个部分。第一部分是主进程，可以完全访问 Electron 和所有操作系统功能。它主要用于 IO、与原生对话框的用户交互以及控制编辑器窗口。主进程不应被同步操作（长时间）阻塞。渲染进程是真正的编辑器，也是 Muya 的宿主。它负责所有图形元素（`src/renderer/components`）、数据（`src/renderer/store`）和数据同步。每个窗口会生成一个渲染进程，独立运行并受主进程控制。它包含两个文本编辑器：由 Muya 提供的实时预览编辑器和由 CodeMirror 提供的源代码编辑器，具有选项卡、侧边栏和编辑功能等特殊功能。

### 应用入口点

应用有两个入口点：

- `src/main/index.ts` 用于主进程，它首先执行且每个实例仅执行一次。应用初始化后，可以安全地访问所有环境变量和单例，应用程序（`App`）也随之启动（`src/main/app/index.ts`）。在 `App::init()` 成功运行后即可使用该应用。
- `src/renderer/src/main.ts` 用于每个编辑器窗口。初始时加载库，初始化窗口并挂载 Vue 组件。

### Muya 如何工作

待补充

- Muya 组件概览
- Muya 内部工作原理
- 数据结构

### 主进程与渲染进程通信

主进程和渲染进程通过[进程间通信（IPC）](IPC.md)进行异步通信，主要用于 IO 和与原生对话框的用户交互。

### 编辑器窗口（渲染进程）

待补充

### 示例

#### 打开一个 Markdown 文档并渲染它

`MarkdownDocument` 是一个表示磁盘上的 Markdown 文件或未命名文档的文档对象。要获取 Markdown 文档，可以使用 `loadMarkdownFile` 函数，它在主进程中异步返回一个 `RawMarkdownDocument`（= `MarkdownDocument` 加上一些附加信息）。

**打开文件的整体步骤：**

1. 点击 `File -> Open File`，显示文件对话框，发出 `app-open-file-by-id` 事件，携带要打开文件的编辑器窗口 ID 和解析后的绝对文件路径。
2. 应用（`App` 实例）尝试找到指定的编辑器并在该编辑器窗口上调用 `openTab`。如果没有编辑器窗口存在，则创建一个新的编辑器窗口。
3. 编辑器窗口通过 `loadMarkdownFile` 尝试加载 Markdown 文件，并通过 `mt::open-new-tab` 事件将结果发送到渲染进程。
   - 每个打开的文件也会添加到文件系统监视器中，并保存完整路径以跟踪当前编辑器窗口中已打开的文件。
4. 事件在 `src/renderer/src/store/editor.ts`（渲染进程）中触发，进行一些检查并创建一个新的文档状态，表示一个 Markdown 文档和选项卡状态。
5. 新创建的选项卡要么被打开并发出 `file-changed` 事件，要么只是添加到选项卡状态中。
6. Muya 和源代码编辑器都会监听此事件，并相应地更改 Markdown 文档。

> 注意：目前我们还没有高级 API 来自动更改文档文本或行。所有修改都需要用户交互！

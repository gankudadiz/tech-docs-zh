# 性能测试

- 我们主要依赖 Chrome 的 `Performance` 标签页来分析和记录 MarkText 的性能表现

- Electron 分为 3 个进程：`main`（主进程）、`preload`（预加载）和 `renderer`（渲染进程）。我们将重点关注 `main` 和 `renderer`，因为这两个是最重的进程

## 1. 测试 `main` 进程

```
pnpm run perf:inspect-brk
```

- 这将启动 MarkText 的 **生产构建版本**，并在**第一行 JavaScript 运行之前**设置断点

- 同时在端口 `5858` 上附加一个调试器

## 1.1 导航到 Chrome Inspect

- 前往 `chrome://inspect`

- 按 `Configure`，添加 `localhost:5858`

- 在下方出现的条目上按 "Inspect"（可能需要等待一段时间）

## 1.2 记录性能

- 开发者工具首次启动时，你会看到设置的断点

- 只需进入 `Performance`，按 `Record`，等待 MarkText 完全启动，然后停止录制

## 1.3 替代方案：`inspect`

- 如果你不需要用断点来测试启动性能，只需运行：

```
pnpm run perf:inspect
```

# 2. 测试 `renderer` 进程

```
pnpm run start
```

- 这通过 `electron-vite preview` 预览最近一次 `pnpm run build` 的输出，并设置 `PERF_TESTING=true`（使其行为类似于生产启动）。它**不会**重新构建——如果你的源代码有变化，请先重新运行 `pnpm run build:unpack`。

- 按 `F12` 打开开发者工具，然后按 `Reload and Record` 来对启动渲染性能进行基准测试

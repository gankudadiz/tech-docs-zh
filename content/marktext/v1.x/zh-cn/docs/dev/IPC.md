# 进程间通信（IPC）

渲染进程运行在沙箱环境中（`contextIsolation: true`、`sandbox: true`、`nodeIntegration: false`——参见 `src/main/config.ts`），因此它不能直接导入 `electron`。所有渲染进程↔主进程的通信都通过 `src/preload/index.ts` 中暴露的类型化预加载桥进行，以 `window.electron.*` 和几个同级的全局变量（`window.fileUtils`、`window.path`、`window.uploader` 等）形式暴露。

通道名称由 `src/shared/types/ipc.ts` 中的契约定义类型——错误的通道名、错误的参数数量或错误的返回形状都会在 `pnpm typecheck` 时报错。参见 [TYPESCRIPT.md](TYPESCRIPT.md#ipc-契约) 了解 TypeScript 侧的详细信息。

## 通道命名

渲染进程↔主进程的通道以 `mt::` 为前缀（例如 `mt::fs::stat`、`mt::open-new-tab`）。少数遗留的内部通道不遵循此约定（例如 `language-changed`）；新通道应始终使用 `mt::`。

## 四种通道类别

`src/shared/types/ipc.ts` 定义了四个接口：

| 接口                    | 方向               | 语义                                      |
| ----------------------- | ------------------ | ----------------------------------------- |
| `IpcInvokeChannels`     | 渲染进程 → 主进程    | `Promise<T>` 往返（`ipcMain.handle`）      |
| `IpcSendChannels`       | 渲染进程 → 主进程    | 即发即弃（`ipcMain.on`）                   |
| `IpcSyncChannels`       | 渲染进程 → 主进程    | 同步回复（`event.returnValue`）            |
| `IpcMainEventChannels`  | 主进程 → 渲染进程    | 推送事件（`webContents.send` / on）        |

每个条目会告诉你参数元组和（对于 invoke/sync）返回类型：

```ts
'mt::fs::stat': { args: [path: string]; ret: SerializedStat }
'mt::format-link-click': [payload: { data: unknown; dirname: string }]   // send 形状
```

## 渲染进程侧

使用全局 `window.electron.ipcRenderer`（由预加载桥暴露的类型化包装器）。不要使用 `import { ipcRenderer } from 'electron'`——它在沙箱环境下不可用。

```ts
// 往返调用
const stat = await window.electron.ipcRenderer.invoke('mt::fs::stat', fullPath)

// 即发即弃
window.electron.ipcRenderer.send('mt::format-link-click', { data, dirname })

// 订阅主进程 → 渲染进程推送事件（返回取消订阅函数）
const off = window.electron.ipcRenderer.on('mt::screenshot-captured', () => {
  // …
})
off()
```

`once()` 和 `removeAllListeners()` 遵循相同的模式。对于文件系统和路径辅助功能，优先使用已经通过 `window.fileUtils.*`、`window.path.*`、`window.uploader.*` 等暴露的类型化便捷 API——它们封装了底层的 `mt::fs::*` / `mt::uploader::*` 通道，使调用代码更简洁。

## 主进程侧

通道通过 `ipcMain.handle`（invoke）、`ipcMain.on`（send / sync）或 `webContents.send`（push）进行绑定：

```ts
import { ipcMain } from 'electron'

ipcMain.handle('mt::fs::stat', async (_event, path: string) => {
  return await fs.stat(path)
})

ipcMain.on('mt::format-link-click', (_event, { data, dirname }) => {
  // …
})

// 推送到特定的渲染进程窗口：
window.webContents.send('mt::open-new-tab', tabPayload, options, selected)
```

## 添加新通道

1. 在 `src/shared/types/ipc.ts` 的相应接口中添加一个条目（根据方向和形状选择 invoke / send / sync / main-event）。
2. 在 `src/main/ipc/*.ts`（或相关的功能模块）中绑定主进程处理函数。
3. 通过 `window.electron.ipcRenderer.*` 从渲染进程调用，或者如果值得拥有专门的封装，在 `src/preload/index.ts` 的某个类型化桥上暴露一个方法。

在步骤 1 之后，`pnpm typecheck` 会标记所有与新形状不匹配的现有调用点——将其作为你的迁移检查清单。

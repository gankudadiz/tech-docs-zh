# TypeScript

MarkText 是一个 TypeScript 项目。`src/` 下的每个文件（除了 `src/muya/`）、`scripts/` 下的构建脚本、`test/` 下的测试规范、构建配置（`electron.vite.config.ts`）以及测试配置（`vitest.config.ts`、`test/e2e/playwright.config.ts`）都是 TypeScript。

源代码树中唯一以 JavaScript 形式存在的部分是 `src/muya/`——这是旧的编辑器引擎，将被上游 TypeScript 版本的 muya（https://github.com/marktext/muya）取代。迁移过程中的 `src/types/muya.d.ts` 环境声明充当桥梁；消费者始终通过该文件访问，而不是直接使用底层的 `src/muya/lib/*.js`。

## tsconfig 布局

单根项目，不使用 `composite`/`references`：

```
tsconfig.base.json     # 共享编译器选项（strict、paths、libs）
tsconfig.json          # 继承 base，添加 lib/types/jsx + include/exclude
```

为什么要用单项目：`src/` 下的内容都不需要输出声明文件（打包工具是 electron-vite），而且渲染进程、预加载进程和主进程之间共享的类型足够多，将它们拆分为项目引用大多只会增加仪式感。一个 `--noEmit` 的单项目可以保持最小的连接开销而不放弃严格模式。

相关设置（`tsconfig.base.json`）：

- `strict: true`（所有严格标志都开启）
- `noUncheckedIndexedAccess: false`——考虑到现有的索引访问模式（tabs、listToc），打开此选项会带来太多破坏性
- `exactOptionalPropertyTypes: false`——保持关闭，使缓冲状态恢复路径（通过 JSON 序列化携带可选字段）可以容忍 `undefined` ≡ "键不存在"
- `allowJs: false, checkJs: false`——`src/` 下的每个目录现在都是 `.ts`，除了 `src/muya/`，代码树的其余部分通过 `src/types/muya.d.ts` 中的环境声明来访问它
- `noEmit: true`——vue-tsc 仅做类型检查；electron-vite 处理实际的打包

## 路径别名

在 `tsconfig.base.json` 和 `electron.vite.config.ts` 中均需定义（两者必须保持同步）：

| 别名         | 映射到                  |
|-------------|------------------------|
| `@/*`       | `src/renderer/src/*`   |
| `common/*`  | `src/common/*`         |
| `muya/*`    | `src/muya/*`（遗留）    |
| `@shared/*` | `src/shared/*`         |

`vitest.config.ts` 携带相同的别名，外加 `main_renderer` → `src/main`，用于少数需要触及主进程代码的单元测试规范。

## 类型存放位置

- **`src/shared/types/`**——跨进程类型（IPC 契约、文件/选项卡形状、偏好设置、菜单、总线、TypedEmitter 辅助类型）。纯粹的类型制品，无运行时代码。任何进程都可以通过 `@shared/types/*` 导入。
- **`src/types/`**——环境声明（`global.d.ts`、`renderer.d.ts`、`muya.d.ts`、`shims.d.ts`）。仅 `.d.ts`；无运行时代码。
- **同目录共存**——特定于某个功能领域的类型定义与该功能代码放在一起（例如 `src/main/ipc/ripgrep.ts` 定义了它自己的 `SearchOptions`）。

## IPC 契约

唯一的真相来源是 `src/shared/types/ipc.ts`。四个通道映射：

- `IpcInvokeChannels`——渲染进程 → 主进程，返回 `Promise<T>`
- `IpcSendChannels`——渲染进程 → 主进程，即发即弃
- `IpcSyncChannels`——同步的渲染进程 → 主进程
- `IpcMainEventChannels`——主进程 → 渲染进程推送事件

预加载桥（`src/preload/index.ts`）使用泛型来消费这些类型：

```ts
const ipcWrapper = {
  send: <K extends keyof IpcSendChannels>(channel: K, ...args: IpcSendChannels[K]) =>
    ipcRenderer.send(channel, ...args),
  invoke: <K extends keyof IpcInvokeChannels>(
    channel: K,
    ...args: IpcInvokeChannels[K]['args']
  ): Promise<IpcInvokeChannels[K]['ret']> =>
    ipcRenderer.invoke(channel, ...args),
  // ...
}
```

每个渲染进程侧的 `window.electron.ipcRenderer.invoke('mt::fs::stat', p)` 调用都会经过类型检查：错误的通道名、错误的参数数量、错误的参数类型，都会在编译时暴露。

要添加新通道：
1. 在 `src/shared/types/ipc.ts` 的相应接口中添加一个条目。
2. 在 `src/main/ipc/*.ts` 中通过 `ipcMain.handle`/`ipcMain.on` 绑定处理函数。
3. 通过 `window.electron.ipcRenderer.{invoke,send,…}` 从渲染进程使用。

## muya 边界

`src/muya/` 保持为 JavaScript。`src/types/muya.d.ts` 环境声明覆盖了代码库其余部分实际使用的大约 21 个导入路径（`muya/lib/utils`、`muya/lib/utils/dompurify`、`muya/lib/parser/marked/slugger`、十几个 `muya/lib/ui/*` 覆盖层组件等）。大多数条目是 `any` 类型的垫片——对于消费侧来说足够用了，并且在上游 TypeScript 版本的 muya 落地后可以被干净地删除。

## TypedEmitter

历史上继承 `node:events#EventEmitter` 的主进程类现在继承 `TypedEmitter<EventMap>`（来自 `@shared/types/typedEmitter`）。事件名称和监听器参数元组都有类型约束：

```ts
interface BaseWindowEvents {
  'window-ready': []
  'window-blur': []
  'will-close': [id: number, opts: { keepInBackground: boolean }]
}

class BaseWindow extends TypedEmitter<BaseWindowEvents> { ... }
```

错误的事件名称或不匹配的监听器参数数量会在编译时报错。

## Pinia stores

所有 9 个活跃的 Pinia store（`src/renderer/src/store/`）都是类型化的。其中 7 个是 Setup Store（`defineStore('id', () => { return { ...refs, ...computeds, ...actions } })`）；`editor.ts` 和 `preferences.ts` 仍然是 Options Store，因为 Pinia 的 Options Store 类型可以从类型化的 `state: () => State` 工厂中完全推断出来，而转换它们约 80 个跨 store 调用点相比类型化的 Options Store 并没有表达能力上的提升。

编辑器 store 的 `currentFile` 哨兵现在是 `IFileState | null`，而不是之前空对象占位符，消费代码在之前检查 `!currentFile.id` 的地方改为显式 null 窄化。

## 严格模式的隐患

- **`strictPropertyInitialization`**——类字段必须在构造函数中初始化或标记为 `!:`（确定赋值断言）。优先初始化；仅在运行时保证字段在访问前一定被赋值时使用 `!:`。
- **`useUnknownInCatchVariables`**——`catch (err)` 给出 `err: unknown`。使用前先窄化：`err instanceof Error ? err.message : String(err)`。
- **`noImplicitAny`**——每个回调参数都需要类型。对于迭代器（`tabs.find(t => ...)`），TypeScript 从元素类型推断。
- **事件处理器的联合类型**——Electron 的 `BrowserWindow.on` 有大量重载；传递事件名称的联合类型（`'maximize'|'unmaximize'|...`）可能需要通过 `any` 进行类型转换。

## 已完成的后续工作

原始后续工作列表中的四项全部在 PR #4249–#4255 中完成：

- editor.ts + preferences.ts 的 Pinia stores（#4249）
- prefComponents 模式 + 叶子 SFC 控件（#4250）
- 测试规范 ESM + 严格 TS（#4251）
- 侧边栏 + 顶级页面 SFC（#4252）
- 编辑器 + 组件 SFC（#4253）
- 偏好设置页面 SFC（#4254）
- `@typescript-eslint/no-explicit-any` 从 `warn` 翻转为 `error`（#4255）

唯一剩余的 `any` 是 `src/types/muya.d.ts` 中的文件级禁用（有意为之——通向遗留 JS muya 树的桥梁，在上游 TS muya 落地时删除）以及 `src/main/filesystem/watcher.ts` 中的一个针对性 `eslint-disable-next-line`，原因是 chokidar 的 `ignored` 回调选项包的类型签名在不同 chokidar 版本之间有所变化。

少量 `: any` 注解仍然存在于 `.vue` `<script setup lang="ts">` 块中——主要是 muya / CodeMirror 句柄（`MuyaInstance`、`CMInstance` 等），作为文件本地别名有意保留，与 `src/types/muya.d.ts` 并行。该规则目前仅配置在 `.ts` 文件上；将其扩展到 `.vue` 作用域是一个独立的清理任务，等上游 TS muya 用真实类型替换这些句柄后再进行。

## 类型检查

```bash
pnpm typecheck            # vue-tsc --noEmit -p tsconfig.json
pnpm typecheck:watch      # 增量检查
pnpm check                # lint + typecheck
```

`vue-tsc` 是带有 Vue SFC 感知能力的 TypeScript 编译器。普通的 `tsc` 不会对 `.vue` 文件进行类型检查。CI 在 lint 任务中运行 `pnpm typecheck`（参见 `.github/workflows/lint.yml`）。

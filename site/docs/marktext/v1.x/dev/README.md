# 开发者文档

## 1. 项目设置

### 1.1 前置条件

- Python（`>= 3.12`）

- Node.js（`>=20.19.0`）——PR 构建 CI 使用 Node 22.21.1，发布 CI 使用 Node 24.14.1；任何满足最低版本要求的版本应该都能正常工作
  - 使用显著比 Electron 捆绑的 Node 更新的版本可能会导致编译原生插件时出现问题

- 很多耐心

### 1.2 Linux 特定前置条件

- Linux 环境需要额外的依赖项，请参阅 [Linux 特定前置条件](LINUX_DEV.md)

### 1.3 Windows 特定前置条件

- 你需要 [Build Tools for Visual Studio 2022](https://visualstudio.microsoft.com/downloads/)（滚动到页面最底部）
  - 此外，你还需要 **spectre-mitigated MSVC**，前往"Individual Components"选择 "MSVC ... - VS2022 C++ Spectre-Mitigated Libs"
  - 许多原生库还不太支持 ClangCL，因此我们在 `.npmrc` 中强制使用 MSVC（pnpm 会遵循此文件）

### 1.4 克隆并安装

```bash
git clone https://github.com/marktext/marktext.git
cd marktext
pnpm install
```

### 1.5 创建最小化的语言文件

- 这在生产构建时**会自动运行**，但为了性能在开发构建时不会自动运行

```
pnpm run minify-locales
```

### 1.6 在开发模式下运行

```bash
pnpm run dev
```

#### 1.6.1 一些注意事项：

- `main` 和 `preload` 进程在编辑时**不会**自动热加载，不幸的是，你需要在每次编辑后**重新加载开发进程**
  - 好消息是 Vite 打包速度非常非常快，所以这不应该造成太大困扰
- 虽然 `renderer` 进程支持热加载，但状态的丢失经常会导致**奇怪的错误**。如果出现这种情况，我建议进行完整重新加载
- 编译目标：
  - `main` 和 `preload` 仍然编译为 `CommonJS`
  - `renderer` 仅使用 `ESModules`（使用任何旧的 `CommonJS` 库时请注意）

### 1.7 生产构建

```bash
# Windows
$ pnpm run build:win

# macOS
$ pnpm run build:mac

# Linux
$ pnpm run build:linux
```

## 2. 子章节

- [性能测试](PERFORMANCE.md)
- [项目架构](ARCHITECTURE.md)
- [构建说明](BUILD.md)
- [调试](DEBUGGING.md)
- [进程间通信（IPC）](IPC.md)
- [界面](INTERFACE.md)
- [发布 MarkText 的步骤](RELEASE.md)
- [准备热修复版本](RELEASE_HOTFIX.md)
- [TypeScript 布局与约定](TYPESCRIPT.md)

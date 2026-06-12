# Linux 特定前置条件

- 这些已在 Ubuntu 24.04.2 LTS 和 Ubuntu 22.04 LTS 上测试（感谢 "FP Coetzee"）

## 系统要求

- 基本构建需要约 1.2G 磁盘空间。
- 内存：建议至少 4GB（用于 Electron 构建）

## 前置条件

- 
- Ubuntu 软件包：`git`、`build-essential` 和 `xorg-dev`

### 1. 安装系统软件包

Ubuntu：

```bash
sudo apt update && sudo apt install -y git build-essential xorg-dev
```

Fedora：

```bash
sudo dnf install -y xorg-x11-server-devel libxkbfile-devel
```

### 2. 安装 Node

- 我建议使用 [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

## 常见问题与解决方案

### 问题：pnpm install 因 native-keymap 错误而失败

**错误信息：**

```bash
 ERR_PNPM_OPTIONAL_DEPS_REQUIRER  optional dep native-keymap failed
 ...
 node-gyp ERR! build error
 node-gyp ERR! gyp ERR! rebuild
```

**解决方案：**
当 `xorg-dev` 缺失时会出现此问题。安装它：

```bash
sudo apt install xorg-dev
```

然后重试：

```bash
pnpm install
```

### 问题：Electron 因 libglib 错误无法启动

**错误信息：**

```bash
~/marktext/node_modules/electron/dist/electron: error while loading shared libraries:
libglib-2.0.so.0: cannot open shared object file: No such file or directory
```

**解决方案：**
安装 X11/GUI 开发库：

```bash
sudo apt install xorg-dev
```

如果问题仍然存在，你可能需要完整的 X11 环境：

```bash
sudo apt install xorg
```

### 问题：pnpm install 时的权限错误

**解决方案：**
确保不要使用 `sudo` 运行 `pnpm` 命令。pnpm 将软件包存储在全局内容寻址存储中（默认：`~/.local/share/pnpm/store`）。如果遇到权限错误，请确保存储目录属于你的用户：

```bash
# 如有需要，检查并修复存储目录的所有权
sudo chown -R $(whoami) ~/.local/share/pnpm
```

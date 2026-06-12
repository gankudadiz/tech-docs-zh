# 构建说明

**请参见 [此 issue](https://github.com/jacobwhall/marktext/issues/2) 了解我们在现代化此流程方面的进展！**

克隆仓库：

```
git clone https://github.com/marktext/marktext.git
```

## 容器设置

在 Linux 上构建 MarkText 的最简单方式是在容器内进行。
以下是具体步骤：
```sh
# cd 到 marktext 仓库目录

# 运行容器（如果你喜欢，可以用 docker 代替 podman）
podman run -it -v ./:/mnt:Z node:22-bookworm /bin/bash
# 你现在应该正在与容器交互

# 添加 bookworm-backports 以获取 Python 3.12 并安装构建依赖
echo "deb http://deb.debian.org/debian bookworm-backports main" >> /etc/apt/sources.list
apt update
apt-get install -y -t bookworm-backports python3.12
apt-get install -y libx11-dev libxkbfile-dev libsecret-1-dev libfontconfig-dev rpm

cd /mnt
corepack enable
pnpm install
pnpm run build

exit
# 容器现在应该已终止

# 构建产物可以在 dist/ 目录中找到（electron-builder 输出）；
# 中间的 electron-vite 包位于 out/
```

以下是完整的构建说明，可以帮助你排查上述步骤的问题或尝试在其他平台上构建。

### 前提条件

在开始开发之前，你需要设置好构建环境：

- Node.js `>=20.19.0` 和 pnpm `>=10`
- Python `>=3.12` 用于 node-gyp
- C++ 编译器和开发工具
- 构建支持 Linux、macOS 和 Windows

**Linux 上的额外开发依赖：**

- libX11（含头文件）
- libxkbfile（含头文件）
- libsecret（含头文件）
- libfontconfig（含头文件）
- rpm（如果在 Debian 上构建）

在基于 Debian 的 Linux 上：`sudo apt-get install libx11-dev libxkbfile-dev libsecret-1-dev libfontconfig-dev rpm`

在基于 Red Hat 的 Linux 上：`sudo dnf install libX11-devel libxkbfile-devel libsecret-devel fontconfig-devel`

在 Arch Linux 上：`sudo pacman -S libx11 libxkbfile libsecret fontconfig`

**Windows 上的额外开发依赖：**

- Windows 10 SDK（仅在 Windows 10 之前需要）
- Visual Studio 2022（Build Tools for Visual Studio 2022）。你还需要 spectre-mitigated MSVC 库——参见[开发者 README §1.3](README.md#13-windows-特定前置条件) 了解需要安装的确切组件。

### 开始构建

1. 进入 `marktext` 文件夹
2. 安装依赖：`pnpm install`
3. 构建 MarkText 二进制文件和安装包：`pnpm run build`
4. MarkText 二进制文件位于 `dist` 文件夹下（electron-builder 输出）

将构建的应用复制到 applications 文件夹，或在 Windows 上运行可执行安装程序。

### 重要脚本

```
$ pnpm run <script>
```

| 脚本    | 描述                                        |
| ------- | ------------------------------------------- |
| `build` | 为你的操作系统构建 MarkText 二进制文件和安装包  |
| `dev`   | 在开发模式下构建并运行 MarkText               |
| `lint`  | 检查代码风格                                  |
| `test`  | 运行单元测试                                  |

更多脚本请参见 `package.json`。

>[!TIP]
>为了提高开发效率：
> 1. 使用 `pnpm run dev` 进入开发模式。当源代码被修改时，窗口将自动重新加载。
> 2. 如果需要，使用 `Ctrl+R` 在开发模式下手动重新加载应用程序。
> 
> 这种方式可以避免不必要的重新构建，并优化开发工作流。但对于 CI 或发布构建，可能仍然需要进行完整重新构建。

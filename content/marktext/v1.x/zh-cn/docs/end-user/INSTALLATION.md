---
title: 安装指南
description: MarkText 在 Windows、macOS 和 Linux 上的安装方法
sidebar_position: 5
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/INSTALLATION.md
translation_status: translated
---

# 安装指南

MarkText 是一款免费开源的 Markdown 编辑器，支持 **Linux**、**macOS** 和 **Windows**。预构建的二进制文件随每个版本发布在 [GitHub releases](https://github.com/marktext/marktext/releases/latest) 上。请选择与你平台匹配的版本。

## Windows

| 文件 | 适用场景 |
| --- | --- |
| `marktext-win-x64-<version>-setup.exe` | 推荐。NSIS 安装程序；按用户安装，允许选择安装目录，创建开始菜单和桌面快捷方式。 |
| `marktext-win-x64-<version>.zip` | 便携版压缩包。解压后直接运行 `marktext.exe`。详情请参阅[便携模式](PORTABLE.md)。 |

安装后，MarkText 会注册为 `.md`、`.markdown`、`.mmd`、`.mdown`、`.mdtxt` 和 `.mdtext` 文件的处理程序。

## macOS

| 文件 | 适用场景 |
| --- | --- |
| `marktext-mac-arm64-<version>.dmg` | Apple Silicon（M1 / M2 / M3 / M4）。 |
| `marktext-mac-x64-<version>.dmg` | Intel Mac。 |
| `marktext-mac-<arch>-<version>.zip` | DMG 的替代纯压缩包。 |

打开 DMG 并将 MarkText 拖入 **Applications** 文件夹。当前构建版本未经过公证，首次启动时系统门禁可能会提示——右键点击应用并选择 **Open** 以一次性接受。

你也可以通过 Homebrew Cask 安装：

```sh
brew install --cask mark-text
```

## Linux

MarkText 提供五种 Linux 格式。大多数用户推荐使用 AppImage。

| 文件 | 适用场景 |
| --- | --- |
| `marktext-linux-<version>.AppImage` | 推荐。大多数发行版无需 root 权限即可运行。`chmod +x` 后双击（或直接运行）。 |
| `marktext-linux-<version>.deb` | Debian、Ubuntu、Linux Mint、Pop!_OS 等（`sudo apt install ./marktext-linux-<version>.deb`）。 |
| `marktext-linux-<version>.rpm` | Fedora、RHEL、openSUSE 等（`sudo rpm -i marktext-linux-<version>.rpm`）。 |
| `marktext-linux-<version>.snap` | Ubuntu / 任何支持 snap 的发行版（`sudo snap install marktext-linux-<version>.snap --dangerous --classic`）。 |
| `marktext-linux-<version>.tar.gz` | 便携版 tarball。解压并运行包含的 `marktext` 二进制文件。 |

Arch Linux 用户可以从 AUR（`marktext-bin`）安装 MarkText。

:::note
请参阅 [Linux 说明](LINUX.md) 了解特定发行版的提示（沙箱标志、字体配置、文件关联问题）。
:::

## 验证下载

每个版本都包含一个 `latest-<platform>.yml` 文件，其中包含 SHA-512 哈希值。验证方法：

```sh
# macOS / Linux 示例
shasum -a 512 marktext-linux-<version>.AppImage
```

将值与发布页面上 `latest-linux.yml` 中的条目进行比较。

## 从源码构建

如果你想从源码构建——例如跟踪 `develop` 分支、在我们未发布二进制文件的架构上运行，或参与贡献——请参阅开发者文档中的[构建说明](../dev/BUILD.md)。简要步骤：

```sh
git clone https://github.com/marktext/marktext.git
cd marktext
pnpm install
pnpm run build
```

输出的安装程序位于仓库的 `dist/` 文件夹中。

## 更新

MarkText 在启动时检查更新（可在 **Preferences → General → Updates** 中禁用）。当有更新发布时，应用会在后台下载并在下次重启时安装。

便携版和 AppImage 不会自动更新——需要升级时请重新下载最新版本。

## 卸载

| 平台 | 方法 |
| --- | --- |
| Windows | **设置 → 应用**，或运行附带的 `Uninstall MarkText.exe`。 |
| macOS | 将 **MarkText.app** 拖到废纸篓。可选删除 `~/Library/Application Support/marktext`。 |
| Linux (.deb) | `sudo apt remove marktext` |
| Linux (.rpm) | `sudo rpm -e marktext` |
| Linux (snap) | `sudo snap remove marktext` |
| Linux (AppImage / tar.gz) | 删除你解压的文件。 |

要同时清除 MarkText 的用户数据，请删除其[应用数据目录](APPLICATION_DATA_DIRECTORY.md)。

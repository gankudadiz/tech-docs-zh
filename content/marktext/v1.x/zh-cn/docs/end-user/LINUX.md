---
title: Linux 说明
description: MarkText Linux 平台特定安装和配置说明
sidebar_position: 14
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/LINUX.md
translation_status: translated
---

# Linux 安装说明

## AppImage

[下载 AppImage](https://github.com/marktext/marktext/releases/latest) 并输入以下命令：

1. `chmod +x marktext-%version%-x86_64.AppImage`
2. `./marktext-%version%-x86_64.AppImage`
3. 现在你可以运行 MarkText 了。

### 安装

你无法真正"安装" AppImage。它是一个在获得可执行权限后可以直接运行的文件。要将其集成到桌面环境，你可以手动创建桌面条目 **或** 使用 [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher)。

#### 创建桌面文件

参阅[示例桌面文件](https://github.com/marktext/marktext/blob/develop/resources/linux/marktext.desktop)。

```bash
$ curl -L https://raw.githubusercontent.com/marktext/marktext/develop/resources/linux/marktext.desktop -o $HOME/.local/share/applications/marktext.desktop

# 将桌面文件中的 Exec 更新为你的实际 marktext 命令。必要时指定 Path。
$ vim $HOME/.local/share/applications/marktext.desktop

$ update-desktop-database $HOME/.local/share/applications/
```

#### AppImageLauncher 集成

你可以通过 [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher) 将 AppImage 集成到系统中，它会自动处理桌面条目。

### 卸载

1. 删除 AppImage 文件。
2. 如果存在桌面文件，删除它。
3. 删除用户设置：`~/.config/marktext`

### 自定义启动脚本

1. 将 AppImage 保存到某个位置，例如 `~/bin/marktext.AppImage`
2. `chmod +x ~/bin/marktext.AppImage`
3. 创建启动脚本：

   ```sh
   #!/bin/bash
   DESKTOPINTEGRATION=0 ~/bin/marktext.AppImage
   ```

### 已知问题

- MarkText 更新后总是会重新集成到桌面环境

## 二进制包

你可以从[发布页面](https://github.com/marktext/marktext/releases/latest)下载最新的 `marktext-%version%.tar.gz` 包。你可能需要安装 Electron 依赖。

## Arch 用户仓库

MarkText 在 AUR 中以 `marktext-bin` 提供，会自动安装依赖：`glibc`、`gtk3`、`nss`、`alsa-lib`、`libxss`、`cups`、`libxkbcommon`、`libxkbfile`、`mesa` 和 `hicolor-icon-theme`。

通过 AUR 助手安装，如 `yay -S marktext-bin`，或使用：

```bash
git clone https://aur.archlinux.org/marktext.git
cd marktext-bin
makepkg -si
```

注意：AUR 包不由本仓库的维护者维护，可能已过时。请注意版本号，必要时在安装或更新前修改 AUR 上的 PKGBUILD。

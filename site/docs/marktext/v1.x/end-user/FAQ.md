---
title: 常见问题
description: MarkText 常见问题解答
sidebar_position: 7
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/FAQ.md
translation_status: translated
---

# 常见问题（FAQ）

### 支持哪些平台？

MarkText 是桌面应用程序，适用于：

- Linux x64（在 Debian 和 Red Hat 系发行版上测试）
- macOS 11（Big Sur）或更高版本，x64 和 arm64（Apple Silicon）
- Windows 10 或 11，x64 和 arm64

### MarkText 是开源且免费的吗？

是的，MarkText 使用 [MIT](https://github.com/marktext/marktext/blob/develop/LICENSE) 许可证，对所有人完全免费。源代码可在 [GitHub](https://github.com/marktext/marktext) 上获取。

### 我可以将 MarkText 用作笔记管理/记录应用吗？

MarkText 是纯 Markdown 编辑器，不具备知识管理和标签等功能，但你可以通过集成的文件系统浏览器和任务列表来实现这一点。

### 在哪里可以找到文档？

文档目前正在开发中。

- [终端用户文档](https://github.com/marktext/marktext/blob/develop/docs/README.md)
- [开发者文档](https://github.com/marktext/marktext/blob/develop/docs/dev/README.md)

### 我可以运行 MarkText 的便携版吗？

可以，请参阅[这里](PORTABLE.md)了解更多信息。

### 如何报告 bug 和问题？

你可以通过我们的 [GitHub issue tracker](https://github.com/marktext/marktext/issues) 报告 bug 和问题。请提供问题的详细描述以便更好地解决。

### 我无法在 Linux 上启动 MarkText（SUID 沙箱）

> _找到了 SUID 沙箱帮助程序二进制文件，但配置不正确。_

通常你不应该遇到这个错误，但如果你禁用了用户命名空间，启动 MarkText 时可能会在命令输出中出现此错误消息。要解决 Chromium 无法启动沙箱（进程）的问题，你可以选择以下步骤之一：

- 启用 Linux 内核用户命名空间以使用首选沙箱：`sudo sysctl kernel.unprivileged_userns_clone=1`。
- 设置正确的 SUID 沙箱帮助程序二进制文件权限：`sudo chown root <marktext目录路径>/chrome-sandbox && sudo chmod 4755 <marktext目录路径>/chrome-sandbox`。如果你不想启用用户命名空间，这是首选方案。
- 使用 `--no-sandbox` 参数启动 MarkText。

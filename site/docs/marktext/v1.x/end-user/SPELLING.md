---
title: 拼写检查
description: MarkText 拼写检查功能说明
sidebar_position: 4
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/SPELLING.md
translation_status: translated
---

# 拼写检查

MarkText 可以在你输入时自动检查文本中的拼写错误并建议更正。你只需在设置中的 *spelling* 下启用拼写检查，就永远不会遗漏拼写错误的单词。我们在 Linux 和较旧的 Windows 版本上使用 Hunspell，在 macOS 和 Windows 10 上，你可以选择 Hunspell 或系统拼写检查器（默认）。你可以通过设置控制默认校对语言，也可以在运行时通过右键菜单 `Spelling` 下的 `Change Language` 条目更改语言，而无需更改默认语言。默认情况下，MarkText 的 Hunspell 仅支持美式英语，系统拼写检查器支持本地可用语言。你可以通过系统设置为 Hunspell 下载 42 种语言，为 macOS 和 Windows 10 下载更多语言。

![](/assets/marktext/v1.x/marktext-spellchecker-menu.png)

## 功能

**自动语言检测：**

MarkText 可以在你输入时尝试自动检测语言，我们目前通过 Compact Language Detector 支持超过 160 种语言。

**不为拼错的单词添加下划线：**

如果你不喜欢所有拼写错误都用红色高亮显示，你可以在设置中禁用此功能，但仍然可以通过右键菜单手动进行拼写检查。禁用持续拼写检查也会整体提高性能。

**将单词添加到字典：**

你可以右键点击拼写错误的单词并选择 `Add to Dictionary` 来将单词添加到所选字典，或移除之前添加的单词。如果你想临时忽略一个单词，请选择 `Ignore`。

## 管理字典

### macOS 拼写检查器

你需要通过系统偏好设置面板中的 *"Language & Region"* 添加额外的语言字典。

### Windows 拼写检查器

在 Windows 10 上，你需要通过 *"Time & language"* 设置中的 *"Language"* 添加额外的语言字典。添加额外的语言并为每种语言下载 *"Basic typing"* 语言选项。

### Hunspell

请前往拼写设置并滚动到底部。现在你可以看到可用语言字典的列表，并可以通过底部的下拉菜单添加额外的字典。请注意，下载字典需要活动的互联网连接！

![](/assets/marktext/v1.x/marktext-spelling-settings.png)

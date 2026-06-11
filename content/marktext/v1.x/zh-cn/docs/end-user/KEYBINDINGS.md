---
title: 快捷键
description: MarkText 快捷键配置说明
sidebar_position: 9
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/KEYBINDINGS.md
translation_status: translated
---

# 快捷键

所有快捷键都可以通过 `keybindings.json` 文件覆盖。该文件位于[应用数据目录](APPLICATION_DATA_DIRECTORY.md)中。每个条目由 JSON 格式的 `id`/`accelerator` 对组成。

示例：

```json
{
  "file.save": "CmdOrCtrl+Shift+S",
  "file.save-as": "CmdOrCtrl+S"
}
```

## 可用修饰键

- `Cmd`（macOS）
- `Option`（macOS）
- `Ctrl`
- `Shift`
- `Alt`（等同于 macOS 上的 `Option`）

请不要绑定 `AltGr`，请使用 `Ctrl+Alt` 代替。

## 可用按键

- `0-9`、`A-Z`、`F1-F24` 以及标点符号如 `/` 或 `#`
- `Plus`、`Space`、`Tab`、`Backspace`、`Delete`、`Insert`、`Return/Enter`、`Esc`、`Home`、`End` 和 `PrintScreen`
- `Up`、`Down`、`Left` 和 `Right`
- `PageUp` 和 `PageDown`
- 空字符串 `""` 用于取消绑定

## 各平台快捷键列表

- [macOS 快捷键](KEYBINDINGS_OSX.md)
- [Linux 快捷键](KEYBINDINGS_LINUX.md)
- [Windows 快捷键](KEYBINDINGS_WINDOWS.md)

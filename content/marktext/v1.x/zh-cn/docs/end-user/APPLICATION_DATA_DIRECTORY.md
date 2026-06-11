---
title: 应用数据目录
description: MarkText 用户数据存储位置
sidebar_position: 11
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/APPLICATION_DATA_DIRECTORY.md
translation_status: translated
---

# 应用数据目录

每个用户的应用数据目录位于以下位置：

- Windows：`%APPDATA%\marktext`
- Linux：`$XDG_CONFIG_HOME/marktext` 或 `~/.config/marktext`
- macOS：`~/Library/Application Support/marktext`

启用[便携模式](PORTABLE.md)后，目录位置为 `--user-data-dir` 参数指定的路径或 `marktext-user-data` 目录。

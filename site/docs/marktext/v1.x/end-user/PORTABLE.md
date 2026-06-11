---
title: 便携模式
description: MarkText 便携模式配置说明
sidebar_position: 12
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/PORTABLE.md
translation_status: translated
---

# 便携模式

MarkText 将所有用户配置存储在[应用数据目录](APPLICATION_DATA_DIRECTORY.md)中，可以通过 `--user-data-dir` 命令行参数更改该目录。

## Linux 和 Windows

在 Linux 和 Windows 上，你还可以创建一个名为 `marktext-user-data` 的目录来保存所有用户数据。目录结构如下：

```
marktext-portable/
 ├── marktext (Linux) 或 MarkText.exe (Windows)
 ├── marktext-user-data/
 ├── resources/
 ├── THIRD-PARTY-LICENSES.txt
 └── ...
```

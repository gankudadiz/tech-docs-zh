---
title: 命令行界面
description: MarkText 命令行用法
sidebar_position: 8
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/CLI.md
translation_status: translated
---

# 命令行界面

```
用法：marktext [命令] [路径 ...]

  可用命令：

        --debug                   启用调试模式
        --safe                    禁用插件和其他用户配置
    -n, --new-window              在第二个实例上打开新窗口
        --user-data-dir           更改用户数据目录
        --disable-gpu             禁用 GPU 硬件加速
        --disable-spellcheck      禁用本次会话的拼写检查器
    -v, --verbose                 详细输出
        --version                 打印版本信息
    -h, --help                    打印帮助信息
```

`marktext` 应指向你的 MarkText 安装位置。具体位置因平台而异。在 macOS 上，你可以创建一个便捷的别名：

```sh
alias marktext="/Applications/Mark\ Text.app/Contents/MacOS/Mark\ Text"
```

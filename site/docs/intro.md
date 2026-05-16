---
title: 技术文档汉化工作台
slug: /
---

这是一个本地优先的中文技术文档站，用来维护没有官方中文或中文质量不足的技术文档。

当前已接入的上游样本：

- **Filament v4.x**：来自 `filamentphp/filament` 官方仓库 `4.x` 分支。
- 当前状态：已完成官方文档源码 sparse checkout、原文快照、资源快照、manifest、术语表和 5 篇 normalized 样板页。
- 版本提示：Filament 官网当前默认文档是 `5.x`，本项目的 `v4.x` 入口属于旧版本中文整理。

## 工作流

```text
官方文档源 -> 原文快照 -> normalized Markdown -> 术语表匹配 -> 中文初稿 -> 人工校对 -> 本地文档站
```

## 首批样板

- [Filament 是什么](filament/v4.x/introduction/overview)
- [安装](filament/v4.x/introduction/installation)
- [快速开始](filament/v4.x/getting-started)
- [资源概览](filament/v4.x/resources/overview)
- [列出记录](filament/v4.x/resources/listing-records)

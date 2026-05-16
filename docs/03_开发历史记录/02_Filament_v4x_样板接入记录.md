# 02. Filament v4.x 样板接入记录

**日期**: 2026-05-16  
**阶段**: 首个文档源接入与本地站初始化

## 1. 需求背景

以 Filament 官方仓库作为首个样板源，验证“官方源码采集 -> 原文快照 -> normalized 清洗 -> 本地文档站”的基础链路。

## 2. 上游来源

- 仓库：`https://github.com/filamentphp/filament`
- 分支：`4.x`
- commit：`1c6be93ed549ad51c04688c8044d726b8f2b050e`
- sparse checkout 路径：`docs`、`docs-assets`、`LICENSE.md`、`README.md`、`translators.csv`
- 许可：MIT

## 3. 实现要点

- 安装并启动 WSL2 mihomo，解决 GitHub/npm 访问不稳定问题。
- 使用 Git sparse checkout 只拉取 Filament 文档相关路径，避免克隆完整仓库工作区。
- 保存原文快照到 `sources/filament/v4.x/raw/`。
- 保存资源快照到 `sources/filament/v4.x/raw-assets/`。
- 创建 `sources/filament/v4.x/manifest.yml` 记录来源、版本、commit 和样板页面。
- 初始化 `content/glossary/filament.yml` 术语表。
- 清洗 5 篇样板页到 `sources/filament/v4.x/normalized/`。
- 初始化 `site/` Docusaurus 3.10.1 本地站，并接入 Filament v4.x 样板入口。

## 4. 验证结果

- `npm run build` 成功。
- `npm run typecheck` 成功。
- 构建存在 broken link/anchor 警告，原因是当前只接入 5 篇样板页，原文内链仍指向尚未接入的完整 Filament 文档集。

## 5. 后续收口

- 将 normalized 内容生成正式中文初稿。
- 决定未接入页面的内链策略：临时跳官方英文，或批量接入完整文档后保持站内链接。
- 补充采集/清洗脚本，减少后续人工复制。

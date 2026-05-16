# 技术文档汉化工作台

本项目用于维护没有官方中文、或官方中文质量不足的英文技术文档汉化版本。

当前阶段已完成首个产品样板接入：Filament `v4.x` 官方文档已通过 sparse checkout 保存原文快照，并初始化了 Docusaurus 3 本地文档站。

## 当前结论

- 项目形态：本地优先的静态文档站。
- 技术栈：Docusaurus 3 + MDX + TypeScript。
- 本地端口：`127.0.0.1:48763`。
- 首个样板：`Filament v4.x`，原文来源为 `filamentphp/filament` 官方仓库 `4.x` 分支。
- 当前内容状态：已完成 raw、raw-assets、normalized、manifest、术语表和站点样板页；中文译文尚未进入正式校对阶段。
- 后台管理：暂不建设。等出现多人审核、翻译任务流、术语库协作、权限管理时再考虑 Laravel + Filament 管理端。

## 文档入口

- [项目文档索引](docs/README.md)
- [项目草案](docs/01_项目规划与设计/01_项目草案.md)
- [技术栈与架构决策](docs/01_项目规划与设计/02_技术栈与架构决策.md)
- [文档采集与翻译工作流](docs/05_开发功能细则文档/01_文档采集与翻译工作流.md)

## 目录约定

```text
tech-docs-zh/
├── docs/       # 项目级规划、设计、历史记录
├── sources/    # 官方原文、采集快照、来源清单
├── content/    # 汉化后的结构化文档内容
├── scripts/    # 后续采集、转换、校验脚本
└── site/       # Docusaurus 本地文档站
```

## 本地运行

```bash
cd site
npm run start
```

默认访问：

```text
http://127.0.0.1:48763
```

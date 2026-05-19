# 中文技术文档站

收录常用开发框架的官方文档中文翻译版本，提供本地优先的阅读体验。

**线上地址**: https://gankudadiz.github.io/tech-docs-zh/

## 支持的产品

| 产品 | 版本 | 状态 | 说明 |
|------|------|------|------|
| Filament | v4.x | 翻译中 | Laravel 生态的 Server-Driven UI 框架 |

> 未来计划支持：Laravel、Livewire、Alpine.js、Tailwind CSS 等

## 技术栈

- **框架**: Docusaurus 3 + MDX + TypeScript
- **本地端口**: `127.0.0.1:48763`
- **文档来源**: 各产品官方仓库的文档源码

## 本地运行

```bash
cd site
npm run start
```

访问 http://127.0.0.1:48763

## 目录结构

```text
tech-docs-zh/
├── site/           # Docusaurus 文档站（用户看到的内容）
│   └── docs/       # 文档目录
│       └── filament/
│           └── v4.x/
├── sources/        # 官方原文采集（只读参考）
├── content/        # 翻译成果归档
├── docs/           # 项目自身的文档
└── scripts/        # 采集、转换脚本（待建设）
```

## 文档导航

- [项目文档索引](docs/README.md)
- [目录结构详解](docs/01_项目规划与设计/04_目录结构详解.md)
- [翻译操作指南](docs/05_开发功能细则文档/02_翻译操作指南.md)

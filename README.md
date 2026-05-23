# tech-docs-zh | PHP / Laravel 生态技术文档翻译站

> 将 PHP 生态的开源技术文档翻译为中文，一站一框架，逐步积累。

**线上地址**: [https://gankudadiz.github.io/tech-docs-zh/](https://gankudadiz.github.io/tech-docs-zh/)

**English**: [README_EN.md](README_EN.md)

---

## 为什么做这个项目

英文技术文档质量高，但对中文开发者来说存在语言门槛。官方中文文档要么缺失、要么滞后、要么机翻味重。

本项目专注于 **AI 翻译 + 人工校对 + 代码注释增强**，目标是让中文开发者读文档时不用在脑子里做"英译中"的实时翻译。

---

## 收录内容

| 产品 | 版本 | 状态 | 简介 |
|------|------|------|------|
| Filament | v4.x | 翻译中 | Laravel 生态的后台管理框架 |

> 持续扩展中。后续计划收录 Laravel、Livewire、Alpine.js、Tailwind CSS 等主流框架文档。

---

## 特色

- **AI 翻译 + 人工校对** — 利用 AI 提升翻译效率，人工把关术语和表达质量
- **代码注释增强** — 示例代码附带详细中文注释，降低理解成本
- **三层文档结构** — 原文归档、翻译归档、站点发布分离，便于维护和迁移
- **版本化管理** — 同一产品的多个版本并存，互不干扰
- **纯静态站点** — 加载快，可离线部署

---

## 技术栈

- [Docusaurus 3](https://docusaurus.io/) + MDX + TypeScript
- GitHub Pages 部署
- 文档源码来自各产品官方仓库

---

## 本地运行

```bash
cd site
npm install
npm run start
```

访问 http://127.0.0.1:48763

---

## 目录结构

```text
tech-docs-zh/
├── site/           # Docusaurus 站点（实际发布内容）
├── sources/        # 官方英文原文（只读参考）
├── content/        # 中文翻译归档
├── docs/           # 项目开发文档（工作流、设计等）
└── scripts/        # 采集与转换脚本
```

---

## 贡献

欢迎任何形式的贡献：

- 翻译新文档
- 修正翻译错误
- 改善代码注释
- 提出框架收录建议

请先阅读 [翻译操作指南](docs/05_开发功能细则文档/02_翻译操作指南.md) 了解工作流。

---

## License

翻译文档遵循原文项目的许可证。站点代码使用 MIT 许可证。

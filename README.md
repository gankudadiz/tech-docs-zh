# tech-docs-zh | AI 驱动的技术文档翻译工作流

> 一套可复用的 AI 翻译流水线——无论是英文、日文还是任何语言的技术文档，都可以用这套系统翻译成你自己的母语。

**线上地址**: [https://gankudadiz.github.io/tech-docs-zh/](https://gankudadiz.github.io/tech-docs-zh/)

**English**: [README_EN.md](README_EN.md)

---

## 这个项目解决什么问题

高质量技术文档几乎全是英文写成的。如果你的母语不是英文，读文档时你就在脑子里做实时翻译——慢、累、容易出错。官方本地化要么缺失、要么滞后、要么机翻味重。

我们探索出一条务实路线：**让 AI 承担机械翻译劳动，人只负责把关和优化**，并把整个流程沉淀为一套可复用的工作流。

---

## 不止是翻译——一套语言无关的翻译工作流

你完全可以**不关心本项目翻译了什么内容**，直接把这套系统用于你需要的任何技术文档。核心能力：

| 能力 | 说明 |
|------|------|
| **6 条标准化流程（SOP）** | 覆盖采集→翻译→校对→入站→代码注释增强→链接适配的完整流水线 |
| **语言无关设计** | 工作流不绑定任何源语言或目标语言——英文→中文、日文→韩文、法文→英文都可以 |
| **三层文档结构** | `sources/` 原文快照 · `content/` 翻译归档 · `site/` 站点发布，各层职责清晰 |
| **内置 AI Agent 技能** | `skills/` 目录提供 OpenCode / Claude Code 技能文件，加载后 agent 自动按工作流执行 |
| **自动化验证** | TypeScript 类型检查 + Docusaurus 构建 + broken links 扫描，确保翻译质量 |
| **版本化管理** | 同一产品的多个版本并存，目录互不干扰 |
| **图片与组件转换** | 自动处理上游框架组件（AutoScreenshot、Aside 等）到标准 Markdown 的转换 |

工作流文档位于 `docs/05_开发功能细则文档/`，覆盖以下环节：

```text
00_工作流总览.md           ← 入口，任务路由
01_文档采集与翻译工作流.md   ← 从官方仓库获取原文
02_翻译操作指南.md          ← 单篇文档翻译全流程
03_翻译校对工作流.md        ← 翻译质量审查
04_新增产品或版本接入工作流.md ← 接入新产品/版本的 SOP
05_代码注释增强工作流.md     ← 为示例代码补充中文注释
06_本地化超链接适配工作流.md ← 修复站内链接指向
```

---

## 已翻译文档

目前 5 个产品共 **227 页** 完成中文翻译：

| 产品 | 版本 | 页数 | 状态 |
|------|------|------|------|
| [Livewire](https://gankudadiz.github.io/tech-docs-zh/docs/livewire/v3.x/quickstart) | v3.x | 53 | 翻译完成 |
| [Alpine.js](https://gankudadiz.github.io/tech-docs-zh/docs/alpine/v3.x/start-here) | v3.x | 50 | 翻译完成 |
| [Filament](https://gankudadiz.github.io/tech-docs-zh/docs/filament/v4.x/introduction/overview) | v4.x | 32 | 翻译完成 |
| [Flight](https://gankudadiz.github.io/tech-docs-zh/docs/flight/v3.x/learn/) | v3.x | 57 | 翻译完成 |
| [MarkText](https://gankudadiz.github.io/tech-docs-zh/docs/marktext/v1.x/end-user/BASICS) | v1.x | 35 | 翻译完成 |

---

## 开箱即用

### 如果你想查看本站

```bash
git clone https://github.com/gankudadiz/tech-docs-zh.git
cd tech-docs-zh/site
npm install
npm run start
```

### 如果你想复用工作流翻译自己的文档

```bash
# 1. fork 本项目
git clone https://github.com/<你的用户名>/tech-docs-zh.git
cd tech-docs-zh

# 2. 阅读工作流总览
cat docs/05_开发功能细则文档/00_工作流总览.md

# 3. 按流程接入你的目标文档
# 参照 docs/05_开发功能细则文档/04_新增产品或版本接入工作流.md
# 工作流与源语言和目标语言无关——英文→中文、日文→韩文、法文→英文都可以

# 4. （可选）为 AI Agent 加载技能
# 将 skills/tech-docs-zh-translation-workflow/ 配置到你的 OpenCode/Claude Code 技能目录
# Agent 将自动按工作流执行翻译任务
```

---

## AI Agent 技能

本项目附带一个 OpenCode / Claude Code 技能文件，位于：

```text
skills/tech-docs-zh-translation-workflow/SKILL.md
```

加载后，AI agent 会在执行翻译、校对、新增产品等任务时自动路由到正确的工作流文档，并遵循硬性规则（如图片路径转换、残留检查、构建验证）。

即使你翻译的是完全不同的语言和技术栈，这套流程同样适用——工作流文档本身不与任何特定框架或语言耦合。

---

## 目录结构

```text
tech-docs-zh/
├── site/                        # Docusaurus 站点（实际发布内容）
│   ├── docs/                    #   按产品/版本组织的文档页面
│   ├── static/assets/           #   静态资源（图片等）
│   └── src/data/docsCatalog.ts  #   产品/版本元数据集中维护
├── content/                     # 中文翻译归档（不直接发布）
├── sources/                     # 官方英文原文快照（只读参考）
├── skills/                      # AI Agent 技能文件
├── docs/                        # 项目开发文档
│   ├── 01_项目规划与设计/
│   ├── 03_开发历史记录/
│   └── 05_开发功能细则文档/     #   ★ 工作流 SOP 所在
├── plans/                       # 执行态计划文档
│   ├── 进行中/
│   └── 已归档/
└── scripts/                     # 采集与转换脚本
```

---

## 技术栈

- [Docusaurus 3](https://docusaurus.io/) + MDX + TypeScript
- GitHub Pages 部署
- 文档源码来源于各产品官方仓库

---

## 贡献

欢迎任何形式的贡献：

- 翻译新文档或修正翻译错误
- 接入新产品或新版本
- 改进工作流文档
- 优化 AI Agent 技能文件

请先阅读 [工作流总览](docs/05_开发功能细则文档/00_工作流总览.md) 了解整体流程。

---

## License

翻译文档遵循原文项目的许可证。站点代码与工作流文档使用 MIT 许可证。

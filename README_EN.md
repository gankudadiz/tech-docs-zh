# tech-docs-zh | AI-Powered Documentation Translation Workflow

> A reusable AI translation pipeline — translate any technical documentation into your native language.

**Live Site**: [https://gankudadiz.github.io/tech-docs-zh/](https://gankudadiz.github.io/tech-docs-zh/)

**中文版**: [README.md](README.md)

---

## The Problem

The best technical documentation is overwhelmingly written in English. If English isn't your first language, you're doing real-time translation in your head while reading — slow, exhausting, and error-prone. Official localizations are often missing, outdated, or sound like bad machine translation.

We built a practical solution: **let AI handle the mechanical translation work, let humans focus on review and polish**, and package the entire process into a reusable workflow.

---

## What This Project Really Is

Forget the specific docs on this site. The real product is the **workflow system** — language-agnostic, framework-agnostic, and forkable in 30 seconds.

| Capability | Description |
|-----------|-------------|
| **6 Standard Operating Procedures** | Full pipeline: source collection → translation → review → publishing → code comment enhancement → link adaptation |
| **Language-Agnostic** | Not tied to any source or target language — English→Chinese, Japanese→Korean, French→English — all work |
| **Three-Layer Architecture** | `sources/` (original snapshots) · `content/` (translation archive) · `site/` (published site) |
| **Built-in AI Agent Skill** | `skills/` directory ships with an OpenCode/Claude Code skill — load it and agents follow the workflow automatically |
| **Automated Verification** | TypeScript type-checking + Docusaurus build + broken-link scanning |
| **Version Management** | Multiple versions of the same product coexist independently |
| **Component & Image Conversion** | Auto-converts upstream framework components (AutoScreenshot, Aside, etc.) to standard Markdown |

The workflow docs live under `docs/05_开发功能细则文档/` and cover:

```text
00_工作流总览.md          ← Entry point and task routing
01_文档采集与翻译工作流.md  ← Collect docs from official repos
02_翻译操作指南.md         ← Full single-page translation process
03_翻译校对工作流.md       ← Translation quality review
04_新增产品或版本接入工作流.md ← SOP for adding new products/versions
05_代码注释增强工作流.md    ← Add Chinese comments to code examples
06_本地化超链接适配工作流.md ← Fix internal links for localized site
```

> **Note**: All workflow docs are currently in Chinese. English translations are welcome as contributions.

---

## What We've Translated (Proof It Works)

5 products, **227 pages**, all fully translated into Chinese:

| Product | Version | Pages | Status |
|---------|---------|-------|--------|
| [Livewire](https://gankudadiz.github.io/tech-docs-zh/docs/livewire/v3.x/quickstart) | v3.x | 53 | Complete |
| [Alpine.js](https://gankudadiz.github.io/tech-docs-zh/docs/alpine/v3.x/start-here) | v3.x | 50 | Complete |
| [Filament](https://gankudadiz.github.io/tech-docs-zh/docs/filament/v4.x/introduction/overview) | v4.x | 32 | Complete |
| [Flight](https://gankudadiz.github.io/tech-docs-zh/docs/flight/v3.x/learn/) | v3.x | 57 | Complete |
| [MarkText](https://gankudadiz.github.io/tech-docs-zh/docs/marktext/v1.x/end-user/BASICS) | v1.x | 35 | Complete |

---

## Get Started

### View the docs site

```bash
git clone https://github.com/gankudadiz/tech-docs-zh.git
cd tech-docs-zh/site
npm install
npm run start
```

### Fork and translate your own docs

```bash
# 1. Fork this repo
git clone https://github.com/<your-username>/tech-docs-zh.git
cd tech-docs-zh

# 2. Read the workflow overview
cat docs/05_开发功能细则文档/00_工作流总览.md

# 3. Add your target documentation
# Follow: docs/05_开发功能细则文档/04_新增产品或版本接入工作流.md
# The workflow doesn't care what languages you're translating between

# 4. (Optional) Load the AI agent skill
# Copy skills/tech-docs-zh-translation-workflow/ to your OpenCode/Claude Code skills directory
# Your AI agent will automatically follow the translation workflow
```

---

## AI Agent Skill

This repo includes an OpenCode / Claude Code skill at:

```text
skills/tech-docs-zh-translation-workflow/SKILL.md
```

Once loaded, AI agents automatically route themselves to the correct workflow document for any task (translation, proofreading, adding a new product, etc.) and follow the project's hard rules for image paths, component conversion, and build verification.

---

## Project Structure

```text
tech-docs-zh/
├── site/                        # Docusaurus site (published content)
│   ├── docs/                    #   Doc pages organized by product/version
│   ├── static/assets/           #   Static assets (images, etc.)
│   └── src/data/docsCatalog.ts  #   Central product/version metadata
├── content/                     # Translation archive (not directly published)
├── sources/                     # Original source snapshots (read-only)
├── skills/                      # AI Agent skill files
├── docs/                        # Project documentation
│   ├── 01_项目规划与设计/        #   Planning & design
│   ├── 03_开发历史记录/          #   Development history
│   └── 05_开发功能细则文档/      #   ★ Workflow SOPs live here
├── plans/                       # Execution plans
│   ├── 进行中/                   #   In progress
│   └── 已归档/                   #   Archived
└── scripts/                     # Collection & conversion scripts
```

---

## Tech Stack

- [Docusaurus 3](https://docusaurus.io/) + MDX + TypeScript
- GitHub Pages deployment
- Documentation sourced from official product repositories

---

## Contributing

All contributions are welcome:

- Translate new documentation or fix existing translations
- Add support for new products or versions
- Improve workflow documentation
- Enhance the AI agent skill file
- Translate workflow docs into English or other languages

Start by reading the [Workflow Overview](docs/05_开发功能细则文档/00_工作流总览.md).

---

## License

Translated documentation follows the license of the original project. Site code and workflow documentation use the MIT License.

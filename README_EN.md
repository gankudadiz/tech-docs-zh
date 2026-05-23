# tech-docs-zh | Chinese Technical Documentation Translation

> Translating open-source technical documentation into Chinese. One framework at a time.

**Live Site**: [https://gankudadiz.github.io/tech-docs-zh/](https://gankudadiz.github.io/tech-docs-zh/)

**中文版**: [README.md](README.md)

---

## Why This Project

High-quality technical documentation is often English-only, creating a language barrier for Chinese developers. Official Chinese translations are either missing, outdated, or machine-translated with poor readability.

This project focuses on **AI translation + manual review + code comment enhancement**, enabling Chinese developers to read documentation without mentally translating from English in real-time.

---

## What's Included

| Product | Version | Status | Description |
|---------|---------|--------|-------------|
| Filament | v4.x | In Progress | Admin panel framework for Laravel |

> More frameworks coming soon: Laravel, Livewire, Alpine.js, Tailwind CSS, and more.

---

## Features

- **AI Translation + Manual Review** — AI for efficiency, human review for terminology and expression quality
- **Code Comment Enhancement** — Code examples with detailed Chinese comments for easier understanding
- **Three-Layer Document Structure** — Source archive, translation archive, and published site are separated for easy maintenance
- **Version Management** — Multiple versions of the same product coexist independently
- **Static Site** — Fast loading, supports offline deployment

---

## Tech Stack

- [Docusaurus 3](https://docusaurus.io/) + MDX + TypeScript
- GitHub Pages deployment
- Documentation sourced from official product repositories

---

## Getting Started

```bash
cd site
npm install
npm run start
```

Visit http://127.0.0.1:48763

---

## Project Structure

```text
tech-docs-zh/
├── site/           # Docusaurus site (published content)
├── sources/        # Official English source (read-only reference)
├── content/        # Chinese translation archive
├── docs/           # Project development docs (workflows, design, etc.)
└── scripts/        # Collection and conversion scripts
```

---

## Contributing

Contributions of any kind are welcome:

- Translate new documentation
- Fix translation errors
- Improve code comments
- Suggest frameworks to include

Please read the [Translation Guide](docs/05_开发功能细则文档/02_翻译操作指南.md) first to understand the workflow.

---

## License

Translated documentation follows the license of the original project. Site code uses the MIT license.

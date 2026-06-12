---
name: tech-docs-zh-translation-workflow
description: Use when working in the tech-docs-zh repository on Chinese technical documentation translation, proofreading, source acquisition, Docusaurus publishing, image path conversion, sidebar/catalog updates, code-comment enhancement for translated examples, or adding a new product/version. This skill routes the agent to the repository's workflow docs and enforces the core translation/publishing checks without duplicating the full project SOP.
---

# tech-docs-zh Translation Workflow

## Scope

Use this skill only for the `tech-docs-zh` repository. It is a thin dispatcher for the repository workflow documents, not the source of truth.

The authoritative workflow files live in:

```text
docs/05_开发功能细则文档/
```

Do not copy their full content into this skill. Read the relevant repository docs for the current task.

## First Step

Confirm you are in the repository root or locate it:

```bash
pwd
```

Then read:

```text
docs/05_开发功能细则文档/00_工作流总览.md
```

## Task Routing

After reading the overview, choose the smallest applicable workflow:

- Translating or completing one or more docs pages: read `02_翻译操作指南.md`.
- Proofreading or reviewing translation quality: read `03_翻译校对工作流.md`.
- Adding Chinese comments to code examples after proofreading: read `06_代码注释增强工作流.md`.
- Collecting upstream docs, snapshots, assets, or manifests: read `01_文档采集与翻译工作流.md`.
- Adding a new product or version: read `04_新增产品或版本接入工作流.md`.

For tasks involving a specific product/version, check whether there is a matching source-structure note in the same directory, such as:

```text
05_Filament_v4x_官方GitHub源文件结构详解.md
07_...
08_...
```

If a matching note exists, read it. If none exists and the task depends on upstream source structure, verify the official source for that product/version and consider creating a new numbered source-structure note.

## Hard Rules

- Keep `sources/` as source/reference material; do not write translated output there.
- Write Chinese archive translations under `content/{product}/{version}/{lang}/docs/`.
- Write published Docusaurus pages under `site/docs/{product}/{version}/`.
- Keep `content/` and `site/docs/` synchronized for translated pages unless there is a deliberate, documented reason not to.
- Convert site image paths to absolute Docusaurus static paths like `/assets/{product}/{version}/...`.
- Do not leave `raw-assets`, `docs-assets`, `@components`, `AutoScreenshot`, `<Aside`, `<Disclosure`, `<RadioGroup`, or `<UtilityInjection>` in published site docs.
- Preserve Markdown structure, frontmatter intent, admonitions, tables, links, and code blocks.
- Do not translate code, class names, method names, package names, configuration keys, commands, or command output.
- When enhancing comments inside code examples, follow `06_代码注释增强工作流.md`: compare the source and translation first, add comments only with valid syntax for that language, and keep examples behaviorally unchanged.
- Prefer existing local Chinese terminology and nearby translated pages over inventing new wording.
- When adding visible pages, update `site/sidebars.ts` deliberately.
- When adding products or versions, update `site/src/data/docsCatalog.ts` deliberately.
- Do not automatically start `npm run start`; tell the user to refresh the existing page unless they explicitly ask to start the dev server.

## Verification

Use checks appropriate to the change size:

```bash
grep -rn "raw-assets\|docs-assets" site/docs/
grep -rn "@components\|AutoScreenshot\|<Aside\|<Disclosure\|<RadioGroup\|<UtilityInjection" site/docs/
```

For structural MDX/Docusaurus changes, prefer from `site/`:

```bash
npm run typecheck
npm run build
```

For translation-only review, do not claim completeness from filenames, file size, or line count. Read the content and compare with the source where accuracy matters.

## Completion Note

In the final response, summarize:

- Which workflow docs were used.
- Which files were changed, grouped by `content/`, `site/docs/`, assets, sidebar/catalog, or workflow docs.
- Which checks were run and whether they passed.
- Any known broken links, missing upstream source, or remaining translation risks.

# Changelog

## v1.0.0 (2026-06-12)

首个正式版本发布。

### 工作流系统
- 6 条标准化操作流程（SOP）：文档采集、单篇翻译、翻译校对、新产品接入、代码注释增强、链接适配
- 所有流程文档位于 `docs/05_开发功能细则文档/`
- 工作流设计语言无关，可复用翻译任何技术文档

### AI Agent 技能
- 内置 OpenCode / Claude Code 技能文件 `skills/tech-docs-zh-translation-workflow/SKILL.md`
- 加载后 AI agent 自动按工作流执行翻译、校对、新产品接入等任务

### 翻译成果（227 页）
- Livewire v3.x — 53 页
- Alpine.js v3.x — 50 页
- Filament v4.x — 32 页
- Flight v3.x — 57 页
- MarkText v1.x — 35 页

### 站点
- Docusaurus 3 + MDX + TypeScript
- 版本化管理，多产品并存
- GitHub Pages 部署

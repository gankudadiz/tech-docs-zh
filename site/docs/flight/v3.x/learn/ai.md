---
title: AI 与开发者体验 - Flight
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/ai.md
status: 已翻译
---

# AI 与开发者体验 - Flight

## 概述

Flight 让你可以轻松地使用 AI 驱动的工具和现代开发者工作流来增强 PHP 项目。通过内置的连接 LLM（大语言模型）提供商和生成项目特定的 AI 编码指令的命令，Flight 帮助你和你的团队充分利用 AI 助手，如 GitHub Copilot、Cursor、Windsurf 和 Antigravity (Gemini)。

## 理解

当 AI 编码助手理解项目的上下文、约定和目标时，它们最有用。Flight 的 AI 助手让你能够：
- 将项目连接到流行的 LLM 提供商（OpenAI、Grok、Claude 等）
- 为 AI 工具生成和更新项目特定的指令，让每个人都获得一致、相关的帮助
- 保持团队一致性和生产力，减少解释上下文的时间

这些功能内置在 Flight 核心 CLI 和官方的 [flightphp/skeleton](https://github.com/flightphp/skeleton) 入门项目中。

## 基本用法

### 设置 LLM 凭证

`ai:init` 命令引导你将项目连接到 LLM 提供商。

```bash
php runway ai:init
```

你将按提示：
- 选择提供商（OpenAI、Grok、Claude 等）
- 输入你的 API key
- 设置基础 URL 和模型名称

这将为你创建未来 LLM 请求所需的凭证。

**示例：**
```
Welcome to AI Init!
Which LLM API do you want to use? [1] openai, [2] grok, [3] claude: 1
Enter the base URL for the LLM API [https://api.openai.com]:
Enter your API key for openai: sk-...
Enter the model name you want to use (e.g. gpt-4, claude-3-opus, etc) [gpt-4o]:
Credentials saved to .runway-creds.json
```

### 生成项目特定的 AI 指令

`ai:generate-instructions` 命令帮助你为 AI 编码助手创建或更新指令，根据你的项目进行定制。

```bash
php runway ai:generate-instructions
```

你将回答一些关于项目的问题（描述、数据库、模板、安全性、团队规模等）。Flight 使用你的 LLM 提供商生成指令，然后将其写入：
- `.github/copilot-instructions.md`（用于 GitHub Copilot）
- `.cursor/rules/project-overview.mdc`（用于 Cursor）
- `.windsurfrules`（用于 Windsurf）
- `.gemini/GEMINI.md`（用于 Antigravity）

**示例：**
```
Please describe what your project is for? My awesome API
What database are you planning on using? MySQL
What HTML templating engine will you plan on using (if any)? latte
Is security an important element of this project? (y/n) y
...
AI instructions updated successfully.
```

现在，你的 AI 工具将根据项目的实际需求提供更智能、更相关的建议。

## 高级用法

- 你可以使用命令选项自定义凭证或指令文件的位置（参见每个命令的 `--help`）。
- AI 助手设计为与任何支持 OpenAI 兼容 API 的 LLM 提供商一起工作。
- 如果你想在项目发展中更新指令，只需重新运行 `ai:generate-instructions` 并再次回答提示。

## 参见

- [Flight Skeleton](https://github.com/flightphp/skeleton) – 带有 AI 集成的官方入门项目
- [Runway CLI](../../awesome-plugins/runway) – 关于支持这些命令的 CLI 工具的更多信息

## 故障排除

- 如果你看到 "Missing .runway-creds.json"，请先运行 `php runway ai:init`。
- 确保你的 API key 有效且有权访问选定的模型。
- 如果指令没有更新，请检查项目目录中的文件权限。

## 更新日志

- v3.16.0 – 为 AI 集成添加了 `ai:init` 和 `ai:generate-instructions` CLI 命令。

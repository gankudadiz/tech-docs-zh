---
title: FlightPHP MCP Server
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/mcp.md
status: 已翻译
---

# FlightPHP MCP Server

FlightPHP MCP Server 为任何 MCP 兼容的 AI 编码助手提供即时、结构化的对全部 FlightPHP 文档的访问——路由、中间件、插件、指南等。无需 API key，托管的版本无需安装。

访问 [Github 仓库](https://github.com/flightphp/mcp) 获取完整源代码。

## 快速开始

服务器已公开托管，随时可用：

```
https://mcp.flightphp.com/mcp
```

只需将该 URL 添加到你的 AI 编码扩展中。无需注册、无需凭证。参见 [IDE 配置](#ide--ai-扩展配置) 部分的复制粘贴配置。

## 功能

- **浏览所有可用文档** — 列出每个核心主题、指南和插件页面
- **获取任何文档页面** — 检索路由、中间件、请求、安全等完整内容
- **查找插件文档** — 获取 ActiveRecord、Session、Tracy、Runway 等官方插件文档
- **跟随分步指南** — 访问构建博客、REST API 等完整教程
- **搜索所有内容** — 同时搜索核心文档、指南和插件

## IDE / AI 扩展配置

支持 Claude Code、GitHub Copilot、Kilo Code、Continue.dev 等多种工具。配置示例：

```json
{ "mcpServers": { "flightphp-docs": { "type": "http", "url": "https://mcp.flightphp.com/mcp" } } }
```

## 可用工具

| 工具 | 描述 |
|------|------|
| `list_docs_pages` | 列出所有核心文档主题 |
| `get_docs_page` | 按 slug 获取文档页面 |
| `list_guide_pages` | 列出所有指南 |
| `get_guide_page` | 按 slug 获取指南 |
| `list_plugin_pages` | 列出所有插件 |
| `get_plugin_docs` | 按 slug 获取插件文档 |
| `search_docs` | 搜索所有文档 |
| `fetch_url` | 按 URL 获取页面 |

## 自托管

```bash
git clone https://github.com/flightphp/mcp.git
cd mcp
composer install
php server.php
```

默认在 `http://0.0.0.0:8890/mcp` 启动。

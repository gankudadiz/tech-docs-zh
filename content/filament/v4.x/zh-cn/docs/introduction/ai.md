---
title: AI 辅助开发
---

## 简介

:::info[关于本页内容]
本页内容灵感来源于 Laravel 的 [AI 辅助开发文档](https://laravel.com/docs/ai)。Laravel Boost 由 Laravel 团队开发，你可以在他们的官方文档中了解更多详情，以及关于使用 AI 辅助构建 Laravel 项目的信息。
:::

AI 编码助手（如 [Claude Code](https://www.claude.com/product/claude-code)、[Cursor](https://cursor.com) 和 [GitHub Copilot](https://github.com/features/copilot)）可以显著加速你的 Filament 开发。Filament 内置了 [Laravel Boost](https://laravel.com/ai/boost) 的指引，教会 AI 助手如何编写符合 Filament 规范的代码并遵循框架约定。Laravel Boost 甚至允许你的助手在遇到不熟悉的需求时搜索 Filament 文档来寻找答案。

## 安装 Laravel Boost

将 Boost 作为开发依赖安装：

```bash
composer require laravel/boost --dev
```

然后运行交互式安装程序，在提示时选择 **Filament**：

```bash
php artisan boost:install
```

安装程序会检测你的 IDE 和 AI 助手，生成必要的配置文件。要验证安装是否成功，请检查你的 `AGENTS.md`、`CLAUDE.md` 或类似文件中是否出现了新的 **Filament** 部分。

有关 Laravel Boost 的更多信息，包括可用工具、文档搜索和 IDE 集成，请参阅 [Laravel AI 文档](https://laravel.com/docs/ai)。

## Filament Blueprint

Boost 附带的指引主要面向**执行型助手**：它们帮助助手在明确构建目标后编写正确的 Filament 代码。然而，AI 生成代码的质量在很大程度上取决于规划的质量。当执行型助手拥有清晰、详细的规范时，它可以专注于编写正确的代码，而不是猜测需求或假设你的意图。

对于复杂的功能，你可能会发现助手在规划阶段表现挣扎：选择正确的组件、构建关系结构、预判边界情况。模糊的规划会导致模糊的代码，最终你花在纠正助手上的时间可能比使用它节省的时间还多。

**Filament Blueprint 是一个高级扩展，帮助 AI 助手为 Filament 生成准确、详细的实现规划。** 它兼容 Filament v4 及以上版本。

Blueprint 弥合了你想要的和 AI 助手构建的之间的差距。Blueprint 不是寄希望于助手能理解 Filament 的约定，而是提供结构化的规划指引，生成明确无歧义的规范文档。

一份 Blueprint 规划包含了执行型助手所需的一切：

- **模型**：属性、类型转换、关联和枚举的精确语法
- **资源**：完整的命名空间、脚手架命令和配置
- **表单**：字段组件、验证规则和布局结构
- **表格**：列、筛选器、操作和排序行为
- **授权**：可直接翻译为代码的纯英文策略规则
- **测试**：需要测试的内容和验证方法
- **更多**：响应式字段、向导、导入/导出、批量操作、小部件、多租户等

这些指引涵盖了助手容易出错的细节，如命名空间、方法名、组件选择和嵌套布局计算，使执行型助手能够一次就写出正确的代码。

规划指引专为规划型助手设计，不应占用执行型助手的上下文窗口。规划型助手会将所有必要信息（命名空间、需要获取的文档 URL、精确的方法语法）复制到 Blueprint 文档本身，这样执行型助手无需加载指引就能获得所需的一切。

如果你对 Claude Opus 4.5 在有无 Blueprint 的情况下撰写的规划示例感兴趣，请访问 [Blueprint 规划示例](#blueprint-规划示例)部分。

### 安装 Blueprint

Blueprint 兼容 Filament v4 及以上版本。

[购买 Blueprint 许可证](https://packages.filamentphp.com/portal/blueprint/checkout)后，通过 Composer 安装：

```bash
composer config repositories.filament composer https://packages.filamentphp.com/composer
composer config --auth http-basic.packages.filamentphp.com "YOUR_EMAIL_ADDRESS" "YOUR_LICENSE_KEY"
composer require filament/blueprint --dev
```

然后运行 Boost 安装程序，在提示时选择 **Filament Blueprint**：

```bash
php artisan boost:install
```

要验证安装是否成功，请检查你的 `AGENTS.md`、`CLAUDE.md` 或类似文件中是否出现了新的 **Filament Blueprint** 部分。

:::info[访问已购许可证]
要访问你购买的许可证，请使用购买 Blueprint 许可证时使用的邮箱登录 [Filament Packages](https://packages.filamentphp.com)。
:::

### 使用 Blueprint

要创建 Blueprint，请在你的 AI 助手中启用**规划模式**，然后让它为你的功能创建 Filament Blueprint：

```
为一个订单管理系统创建 Filament Blueprint。

订单属于客户，包含多个订单项。每个订单有一个状态
（待处理、已确认、已发货、已送达、已取消）、收货地址和
可选备注。订单项引用产品，包含数量和单价。

我需要按客户名称搜索订单，按状态和日期范围筛选。
订单表单应在添加项目时自动计算行项目小计。
只有管理员可以删除订单，且订单在发货前才能取消。
```

助手将生成一份详细的规范文档，可直接用于实现。

### Blueprint 规划示例

以下提示词在 Claude Code CLI 的规划模式下使用 Claude Opus 4.5 运行：

```markdown
为 Filament v4 应用生成一份实现规划。该应用是一个 SaaS 发票系统，
具备以下功能：

- 管理客户
- 管理产品
- 创建和编辑发票
- 为发票添加行项目
- 向客户发送发票
- 记录和跟踪付款

规划应：
- 描述主要用户流程的端到端过程（例如：创建发票、
  发送发票、记录付款）。
- 将每个领域概念和流程映射到具体的 Filament 原语（资源、
  关联管理器、页面、操作）。
- 识别状态转换（如草稿 → 已发送 → 已付款）以及触发
  这些转换的操作。
```

你可以分别阅读 [**未使用 Blueprint**](https://filamentphp.com/blueprint/examples/invoicing/before.md) 和 [**使用 Blueprint**](https://filamentphp.com/blueprint/examples/invoicing/after.md) 生成的规划，对比细节程度和周全性。你也可以尝试将这些规划传递给你选择的 AI 助手的执行模式，看看它们的表现如何！

:::info[关于提示词]
使用 Blueprint 时，提示词开头会添加 `Using Filament Blueprint`。
:::

### 报告 Blueprint 问题

如果你遇到任何问题或有改进建议，请在 [Filament Blueprint Issues GitHub 仓库](https://github.com/filamentphp/blueprint-issues) 中提交 issue 或讨论。如果你有账户或购买相关的问题，请发送邮件至 [support@filamentphp.com](mailto:support@filamentphp.com)。

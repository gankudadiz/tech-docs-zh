---
title: 优化本地开发
---

本节包含一些可选技巧，用于优化本地运行 Filament 应用时的性能。

如果你在寻找生产环境的优化方案，请查阅[部署到生产环境](../deployment)。

## 启用 OPcache

[OPcache](https://www.php.net/manual/en/book.opcache.php) 通过将预编译的脚本字节码存储在共享内存中来提升 PHP 性能，从而省去了 PHP 在每次请求时加载和解析脚本的开销。这可以显著加速本地开发环境，尤其是对于较大的应用。

### 检查 OPcache 状态

要检查 [OPcache](https://www.php.net/manual/en/book.opcache.php) 是否已启用，运行：

```bash
php -r "echo 'opcache.enable => ' . ini_get('opcache.enable') . PHP_EOL;"
```

你应该看到 `opcache.enable => 1`。如果不是，请在 `php.ini` 中添加以下行来启用它：

```ini
opcache.enable=1 # 启用 OPcache
```

:::tip[提示]
要定位你的 `php.ini` 文件，运行：`php --ini`
:::

### 配置 OPcache 设置

如果你遇到响应时间过长或怀疑 OPcache 空间不足，可以在 `php.ini` 文件中调整以下参数：

```ini
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
```

:::tip[提示]
要定位你的 `php.ini` 文件，运行：`php --ini`
:::

- `opcache.memory_consumption`：定义 OPcache 可用于存储预编译 PHP 代码的内存大小（以兆字节为单位）。你可以先设置为 `128`，然后根据项目需求进行调整。
- `opcache.max_accelerated_files`：设置 OPcache 可以缓存的最大 PHP 文件数量。你可以从 `10000` 开始，如果你的应用包含大量文件，可以适当增加。

这些设置是可选的，但在排查性能问题或开发大型 Laravel 应用时非常有用。

## 将项目文件夹排除在杀毒软件扫描之外

Filament 的性能问题（尤其是在 Windows 上）通常与 [Microsoft Defender](https://www.microsoft.com/en-us/microsoft-365/microsoft-defender-for-individuals) 有关。

安全软件（如实时文件扫描器或杀毒工具）会在每次访问文件时进行扫描，从而拖慢开发环境。这可能会影响 PHP 执行、视图渲染以及整体性能。

如果你感到运行缓慢，考虑将本地项目文件夹排除在实时扫描之外。

[Microsoft Defender](https://www.microsoft.com/en-us/microsoft-365/microsoft-defender-for-individuals) 等工具或类似的杀毒方案可以配置跳过特定目录。请查阅你的杀毒或安全软件文档，了解如何将特定文件夹排除在实时扫描之外。

:::warning[警告]
只有在你完全信任该项目并了解风险的情况下，才应将文件夹排除在扫描之外。
:::

## 禁用调试工具

调试工具在本地开发中非常有用，但在不使用时会显著降低应用速度。在需要最佳性能时临时禁用这些工具，可以明显改善开发体验。

### 在 Laravel Herd 中禁用视图调试

[Laravel Herd](https://herd.laravel.com/) 为 [macOS](https://herd.laravel.com/docs/macos/debugging/dumps#views) 和 [Windows](https://herd.laravel.com/docs/windows/debugging/dumps#views) 提供了视图调试工具。它会在请求期间显示渲染了哪些视图以及传递了什么数据。

虽然对调试很有帮助，但此功能会显著降低应用速度。如果你没有在积极使用它，最好将其关闭。

要在 Herd 中禁用视图调试：

- 打开 Herd > Dumps。
- 点击 Settings。
- 取消勾选 "Views" 选项。

### 禁用 Debugbar

[Laravel Debugbar](https://github.com/barryvdh/laravel-debugbar) 虽然对调试很有用，但会降低应用速度，尤其是在复杂页面上，因为它会在每次请求时收集和渲染大量数据。

如果你感到运行缓慢，尝试在 `.env` 文件中添加以下行来禁用它：

```dotenv
DEBUGBAR_ENABLED=false
```

如果你在开发中仍然需要 Debugbar，可以考虑禁用你不需要的特定收集器。
详情请参阅 [Debugbar 文档](https://github.com/barryvdh/laravel-debugbar?tab=readme-ov-file#debugbar-for-laravel)。

### 禁用 Xdebug

[Xdebug](https://xdebug.org) 是一个强大的调试工具，但会显著降低性能。如果你遇到性能问题，检查是否安装了 `Xdebug` 并考虑禁用它。

如果 `Xdebug` 已安装但未禁用，它默认仍会处于启用状态。如果你已安装，请确保在 `php.ini` 文件中明确禁用它：

```ini
xdebug.mode=off # 禁用 Xdebug
```

:::tip[提示]
要定位你的 `php.ini` 文件，运行：`php --ini`
:::

## 缓存 Blade 图标

缓存 [Blade 图标](https://blade-ui-kit.com/blade-icons)可以帮助提升本地开发时的性能，尤其是在渲染大量图标的视图中。

要启用缓存，运行：

```bash
php artisan icons:cache
```

请确保在安装新的 Blade 图标包后，重新运行该命令以发现新图标。

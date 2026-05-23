---
title: 部署到生产环境
---

## 简介

将使用 Filament 的 Laravel 应用部署到生产环境，与部署其他 Laravel 应用类似。不过，你还需要执行一些额外的步骤，以确保 Filament 面板在性能和安全方面得到优化。

有关本地开发性能优化的建议，请参阅[优化本地开发](introduction/optimizing-local-development)。

## 确保用户有权访问面板

当 Filament 检测到应用的 `APP_ENV` 不是 `local` 时，会要求你为用户设置访问授权。这是为了确保只有被授权的用户才能在生产环境中访问你的 Filament 面板，同时保持本地环境的易用性。

要授权用户访问面板，请参阅[用户章节中的指南](users/overview#authorizing-access-to-the-panel)。

:::warning
如果你未执行上述步骤，且你的用户模型没有实现 `FilamentUser` 接口，在生产环境中将没有任何用户能够登录面板。
:::

## 提升 Filament 面板性能

### 为生产环境优化 Filament

要为生产环境优化 Filament，应在部署脚本中运行以下命令：

```bash
php artisan filament:optimize
```

此命令会[缓存 Filament 组件](#缓存-filament-组件)，同时还会缓存 [Blade Icons](#缓存-blade-icons)，从而显著提升 Filament 面板的性能。该命令是 `php artisan filament:cache-components` 和 `php artisan icons:cache` 的快捷方式。

要一次性清除所有缓存，可以运行：

```bash
php artisan filament:optimize-clear
```

#### 缓存 Filament 组件

如果你没有使用 [`filament:optimize` 命令](#为生产环境优化-filament)，也可以考虑在部署脚本中运行 `php artisan filament:cache-components`，尤其是当你拥有大量组件（资源、页面、小部件、关联管理器、自定义 Livewire 组件等）时。此命令会在应用的 `bootstrap/cache/filament` 目录下创建缓存文件，其中包含每种类型的组件索引。这对某些应用可以显著提升 Filament 的性能，因为它减少了需要扫描和自动发现组件的文件数量。

但是，如果你正在本地进行活跃开发，应避免使用此命令，因为它会阻止发现任何新组件，直到缓存被清除或重建。

你可以随时通过运行 `php artisan filament:clear-cached-components` 来清除缓存而不重建它。

#### 缓存 Blade Icons

如果你没有使用 [`filament:optimize` 命令](#为生产环境优化-filament)，也可以考虑在本地以及部署脚本中运行 `php artisan icons:cache`。这是因为 Filament 使用了 [Blade Icons](https://blade-ui-kit.com/blade-icons) 包，缓存后性能会大幅提升。

### 在服务器上启用 OPcache

要检查 [OPcache](https://www.php.net/manual/en/book.opcache.php) 是否已启用，运行：

```bash
php -r "echo 'opcache.enable => ' . ini_get('opcache.enable') . PHP_EOL;"
```

你应该看到 `opcache.enable => 1`。如果未启用，请在 `php.ini` 中添加以下行：

```ini
opcache.enable=1 # Enable OPcache
```

来自 [Laravel Forge 文档](https://forge.laravel.com/docs/servers/php.html#opcache)：

:::tip
为生产环境优化 PHP OPcache 后，OPcache 会将编译后的 PHP 代码存储在内存中，从而大幅提升性能。
:::

请使用搜索引擎查找与你的环境相关的 OPcache 配置说明。

### 优化你的 Laravel 应用

你还应该考虑在部署脚本中运行 `php artisan optimize` 来为生产环境优化 Laravel 应用。此命令会缓存配置文件和路由。

## 确保资源文件是最新的

在 Filament 安装过程中，Filament 会将 `php artisan filament:upgrade` 命令添加到 `composer.json` 文件的 `post-autoload-dump` 脚本中。此命令会在每次下载包时确保你的资源文件是最新的。

我们强烈建议将此脚本保留在你的 `composer.json` 文件中，否则你可能会在生产环境中遇到资源文件缺失或过时的问题。如果你必须移除它，请确保在部署过程中手动运行该命令。

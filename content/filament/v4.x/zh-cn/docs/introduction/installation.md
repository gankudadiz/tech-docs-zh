---
title: 安装
contents: false
---

Filament 的运行环境要求：

- PHP 8.2+
- Laravel v11.28+
- Tailwind CSS v4.1+

根据你的使用场景，有两种安装方式可供选择：使用面板构建器搭建应用，或者在应用的 Blade 视图中使用独立组件。

- **面板构建器**：大多数人选择这种方式来为应用构建面板（例如后台管理面板）。面板构建器将所有独立组件整合为一个完整的框架。你可以在一个 Laravel 项目中创建多个面板，但只需安装一次。
- **独立组件**：如果你正在使用 Blade 从零构建应用，可以单独安装 Filament 的组件来丰富你的 UI。

## 安装面板构建器

在 Laravel 项目目录中运行以下命令来安装 Filament 面板构建器：

```bash
composer require filament/filament:"^4.0"

php artisan filament:install --panels
```

:::warning
    在 Windows PowerShell 中安装 Filament 时，你可能需要运行以下命令，因为它会忽略版本约束中的 `^` 字符：

    ```bash
    composer require filament/filament:"~4.0"

    php artisan filament:install --panels
    ```
:::

这会创建并注册一个新的 [Laravel 服务提供者](https://laravel.com/docs/providers) `app/Providers/Filament/AdminPanelProvider.php`。

:::tip
    如果访问面板时遇到错误，请检查服务提供者是否已在 `bootstrap/providers.php` 中注册。如果未注册，你需要[手动添加](https://laravel.com/docs/providers#registering-providers)。
:::

使用以下命令创建用户账户：

```bash
php artisan make:filament-user
```

在浏览器中打开 `/admin`，登录后即可[开始构建你的应用](../getting-started)！

## 安装独立组件

使用 Composer 安装你需要的 Filament 组件：

```bash
composer require
    filament/tables:"^4.0"
    filament/schemas:"^4.0"
    filament/forms:"^4.0"
    filament/infolists:"^4.0"
    filament/actions:"^4.0"
    filament/notifications:"^4.0"
    filament/widgets:"^4.0"
```

你可以在项目后续随时添加其他包，无需重复这些安装步骤。

:::warning
    在 Windows PowerShell 中安装 Filament 时，你可能需要运行以下命令，因为它会忽略版本约束中的 `^` 字符：

    ```bash
    composer require
        filament/tables:"~4.0"
        filament/schemas:"~4.0"
        filament/forms:"~4.0"
        filament/infolists:"~4.0"
        filament/actions:"~4.0"
        filament/notifications:"~4.0"
        filament/widgets:"~4.0"
    ```
:::

如果你只需要使用 [Blade UI 组件](../components)，需要在此阶段安装 `filament/support`。

### 新建 Laravel 项目

通过一个简单的命令即可快速开始使用 Filament 组件。请注意，这会覆盖应用中已修改的文件，因此仅适用于新建的 Laravel 项目。

要在新 Laravel 项目中快速搭建 Filament，运行以下命令来安装 [Livewire](https://livewire.laravel.com)、[Alpine.js](https://alpinejs.dev) 和 [Tailwind CSS](https://tailwindcss.com)：

:::warning
    这些命令会覆盖应用中的现有文件。请仅在新建的 Laravel 项目中运行！
:::

运行以下命令安装 Filament 前端资源：

```bash
php artisan filament:install --scaffold

npm install

npm run dev
```

在脚手架安装过程中，如果你已安装 [Notifications](../notifications) 包，Filament 会询问是否在默认布局文件中安装所需的 Livewire 组件。如果你想通过 Filament 发送闪现通知，这个组件是必需的。

### 已有 Laravel 项目

如果你有一个已有的 Laravel 项目，仍然可以安装 Filament，但需要手动操作以保留现有功能。

运行以下命令安装 Filament 前端资源：

```bash
php artisan filament:install
```

### 安装 Tailwind CSS

如果尚未安装，运行以下命令安装 Tailwind CSS 及其 Vite 插件：

```bash
npm install tailwindcss @tailwindcss/vite --save-dev
```

### 配置样式

要配置 Filament 的样式，你需要导入已安装的 Filament 包的 CSS 文件，通常在 `resources/css/app.css` 中进行。

根据你安装的包组合，可以只导入必要的 CSS 文件，以保持应用 CSS 包的体积最小化：

```css
@import 'tailwindcss';

/* 所有组件都需要 */
@import '../../vendor/filament/support/resources/css/index.css';

/* actions 和 tables 需要 */
@import '../../vendor/filament/actions/resources/css/index.css';

/* actions、forms 和 tables 需要 */
@import '../../vendor/filament/forms/resources/css/index.css';

/* actions 和 infolists 需要 */
@import '../../vendor/filament/infolists/resources/css/index.css';

/* notifications 需要 */
@import '../../vendor/filament/notifications/resources/css/index.css';

/* actions、infolists、forms、schemas 和 tables 需要 */
@import '../../vendor/filament/schemas/resources/css/index.css';

/* tables 需要 */
@import '../../vendor/filament/tables/resources/css/index.css';

/* widgets 需要 */
@import '../../vendor/filament/widgets/resources/css/index.css';

@variant dark (&:where(.dark, .dark *));
```

### 配置 Vite 插件

如果尚未配置，请将 `@tailwindcss/vite` 插件添加到 Vite 配置文件（`vite.config.js`）中：

```js
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
})
```

### 编译资源

使用 `npm run dev` 编译新的 CSS 和 JavaScript 资源。

### 配置布局

如果还没有 Blade 布局文件，运行以下命令在 `resources/views/components/layouts/app.blade.php` 创建：

```bash
php artisan livewire:layout
```

将以下代码添加到新创建的布局文件中：

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">

        <meta name="application-name" content="{{ config('app.name') }}">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name') }}</title>

        <style>
            [x-cloak] {
                display: none !important;
            }
        </style>

        @filamentStyles
        @vite('resources/css/app.css')
    </head>

    <body class="antialiased">
        {{ $slot }}

        @livewire('notifications') {{-- 仅在需要发送闪现通知时必须 --}}

        @filamentScripts
        @vite('resources/js/app.js')
    </body>
</html>
```

布局中的关键部分是 `<head>` 中的 `@filamentStyles` 和 `<body>` 末尾的 `@filamentScripts`。同时确保包含 Vite 编译后的应用 CSS 和 JavaScript 文件！

:::info
    `@livewire('notifications')` 这行代码仅在你安装了 [Notifications](../notifications) 包且需要通过 Filament 发送闪现通知时才是必需的。
:::

## 发布配置

Filament 附带了一个配置文件，允许你覆盖所有包共享的默认值。安装面板构建器后发布配置文件，以便查看和自定义设置：

```bash
php artisan vendor:publish --tag=filament-config
```

此命令会创建 `config/filament.php` 文件，你可以在其中配置默认文件系统磁盘、文件生成选项和 UI 默认值等。随时可以重新运行发布命令来获取新增的配置项，然后根据项目需求进行调整。

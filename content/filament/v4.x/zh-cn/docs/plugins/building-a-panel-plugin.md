---
title: 构建面板插件
---

## 前言

请在继续之前阅读[面板插件开发](../plugins/panel-plugins)和[快速入门指南](getting-started)的文档。

## 简介

在本教程中，我们将构建一个简单的插件，添加一个新的表单字段，可以在表单中使用。这也意味着它将在用户的面板中可用。

你可以在 [https://github.com/awcodes/clock-widget](https://github.com/awcodes/clock-widget) 找到此插件的最终代码。

## 第 1 步：创建插件

首先，我们将使用[快速入门指南](getting-started#创建插件)中概述的步骤创建插件。

## 第 2 步：清理

接下来，我们将清理插件以移除不需要的样板代码。这看起来很多，但由于这是一个简单的插件，我们可以移除很多样板代码。

删除以下目录和文件：
1. `config`
1. `database`
1. `src/Commands`
1. `src/Facades`
1. `stubs`

由于我们的插件没有任何设置或功能所需的附加方法，我们也可以删除 `ClockWidgetPlugin.php` 文件。

1. `ClockWidgetPlugin.php`

由于 Filament 建议用户使用自定义 Filament 主题来为插件添加样式，我们将删除在插件中使用 CSS 所需的文件。这是可选的，你仍然可以使用 CSS，但不推荐。

1. `resources/css`
2. `postcss.config.js`

现在我们可以清理 `composer.json` 文件以移除不需要的选项。

```json
"autoload": {
    "psr-4": {
        // 我们可以移除数据库工厂
        "Awcodes\\ClockWidget\\Database\\Factories\\": "database/factories/"
    }
},
"extra": {
    "laravel": {
        // 我们可以移除 facade
        "aliases": {
            "ClockWidget": "Awcodes\\ClockWidget\\Facades\\ClockWidget"
        }
    }
},
```

最后一步是更新 `package.json` 文件以移除不需要的选项。将 `package.json` 的内容替换为以下内容。

```json
{
    "private": true,
    "type": "module",
    "scripts": {
        "dev": "node bin/build.js --dev",
        "build": "node bin/build.js"
    },
    "devDependencies": {
        "esbuild": "^0.17.19"
    }
}
```

然后我们需要安装依赖。

```bash
npm install
```

你也可以删除测试目录和文件，但我们暂时保留它们，尽管我们不会在此示例中使用它们，我们强烈建议你为插件编写测试。

## 第 3 步：设置提供者

现在我们已经清理了插件，可以开始添加代码。`src/ClockWidgetServiceProvider.php` 文件中的样板代码有很多内容，所以让我们删除所有内容并从头开始。

:::info
在此示例中，我们将注册一个[异步 Alpine 组件](../advanced/assets#异步-alpinejs-组件)。由于这些资源仅在请求时加载，我们可以在 `packageBooted()` 方法中正常注册它们。如果你正在注册资源，如 CSS 或 JS 文件，这些文件会在每个页面上加载，无论是否使用，你应该在 `Plugin` 配置对象的 `register()` 方法中注册它们，使用 [`$panel->assets()`](../panel-configuration#为面板注册资源)。否则，如果你在 `packageBooted()` 方法中注册它们，它们将在每个面板中加载，无论插件是否已为该面板注册。
:::

我们需要能够向面板注册我们的 Widget，并在使用 Widget 时加载 Alpine 组件。为此，我们需要在服务提供者的 `packageBooted` 方法中添加以下内容。这将向 Livewire 注册我们的 Widget 组件，并向 Filament 资源管理器注册我们的 Alpine 组件。

```php
use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Facades\FilamentAsset;
use Livewire\Livewire;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class ClockWidgetServiceProvider extends PackageServiceProvider
{
    public static string $name = 'clock-widget';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name)
            ->hasViews()
            ->hasTranslations();
    }

    public function packageBooted(): void
    {
        Livewire::component('clock-widget', ClockWidget::class);

        // 资源注册
        FilamentAsset::register(
            assets:[
                 AlpineComponent::make('clock-widget', __DIR__ . '/../resources/dist/clock-widget.js'),
            ],
            package: 'awcodes/clock-widget'
        );
    }
}
```

## 第 4 步：创建 Widget

现在我们可以创建我们的 Widget。我们首先需要在 `ClockWidget.php` 文件中扩展 Filament 的 `Widget` 类，并告诉它在哪里找到 Widget 的视图。由于我们使用 PackageServiceProvider 来注册视图，我们可以使用 `::` 语法告诉 Filament 在哪里找到视图。

```php
use Filament\Widgets\Widget;

class ClockWidget extends Widget
{
    protected static string $view = 'clock-widget::widget';
}
```

接下来，我们需要为 Widget 创建视图。在 `resources/views/widget.blade.php` 创建一个新文件并添加以下代码。我们将利用 Filament 的 Blade 组件来节省编写 Widget HTML 的时间。

我们使用异步 Alpine 来加载 Alpine 组件，因此我们需要在 div 上添加 `x-load` 属性来告诉 Alpine 加载我们的组件。你可以在文档的[核心概念](../advanced/assets#异步-alpinejs-组件)部分了解更多信息。

```blade
<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            {{ __('clock-widget::clock-widget.title') }}
        </x-slot>

        <div
            x-load
            x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('clock-widget', 'awcodes/clock-widget') }}"
            x-data="clockWidget()"
            class="text-center"
        >
            <p>{{ __('clock-widget::clock-widget.description') }}</p>
            <p class="text-xl" x-text="time"></p>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
```

接下来，我们需要在 `src/js/index.js` 中编写 Alpine 组件。并使用 `npm run build` 构建资源。

```js
export default function clockWidget() {
    return {
        time: new Date().toLocaleTimeString(),
        init() {
            setInterval(() => {
                this.time = new Date().toLocaleTimeString();
            }, 1000);
        }
    }
}
```

我们还应该为 Widget 中的文本添加翻译，以便用户可以将 Widget 翻译成他们的语言。我们将在 `resources/lang/en/widget.php` 中添加翻译。

```php
return [
    'title' => 'Clock Widget',
    'description' => 'Your current time is:',
];
```

## 第 5 步：更新你的 README

你需要更新 `README.md` 文件，包含如何安装插件的说明以及你想与用户分享的任何其他信息，例如如何在他们的项目中使用它。例如：

```php
// 在你的面板提供者中注册插件和/或 Widget：

use Awcodes\ClockWidget\ClockWidgetWidget;

public function panel(Panel $panel): Panel
{
    return $panel
        ->widgets([
            ClockWidgetWidget::class,
        ]);
}
```

就这样，我们的用户现在可以安装我们的插件并在他们的项目中使用它了。

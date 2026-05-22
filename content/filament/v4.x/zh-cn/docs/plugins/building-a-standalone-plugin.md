---
title: 构建独立插件
---

## 前言

请在继续之前阅读[面板插件开发](../plugins/panel-plugins)和[快速入门指南](getting-started)的文档。

## 简介

在本教程中，我们将构建一个简单的插件，添加一个新的表单组件，可以在表单中使用。这也意味着它将在用户的面板中可用。

你可以在 [https://github.com/awcodes/headings](https://github.com/awcodes/headings) 找到此插件的最终代码。

## 第 1 步：创建插件

首先，我们将使用[快速入门指南](getting-started#creating-a-plugin)中概述的步骤创建插件。

## 第 2 步：清理

接下来，我们将清理插件以移除不需要的样板代码。这看起来很多，但由于这是一个简单的插件，我们可以移除很多样板代码。

删除以下目录和文件：
1. `bin`
2. `config`
3. `database`
4. `src/Commands`
5. `src/Facades`
6. `stubs`

现在我们可以清理 `composer.json` 文件以移除不需要的选项。

```json
"autoload": {
    "psr-4": {
        // 我们可以移除数据库工厂
        "Awcodes\\Headings\\Database\\Factories\\": "database/factories/"
    }
},
"extra": {
    "laravel": {
        // 我们可以移除 facade
        "aliases": {
            "Headings": "Awcodes\\Headings\\Facades\\ClockWidget"
        }
    }
},
```

通常，Filament 建议用户使用自定义 Filament 主题来为插件添加样式，但为了示例，让我们提供自己的样式表，可以使用 Filament v3 中新的 `x-load` 功能异步加载。所以，让我们更新 `package.json` 文件以包含 `cssnano`、`postcss`、`postcss-cli` 和 `postcss-nesting` 来构建我们的样式表。

```json
{
    "private": true,
    "scripts": {
        "build": "postcss resources/css/index.css -o resources/dist/headings.css"
    },
    "devDependencies": {
        "cssnano": "^6.0.1",
        "postcss": "^8.4.27",
        "postcss-cli": "^10.1.0",
        "postcss-nesting": "^13.0.0"
    }
}
```

然后我们需要安装依赖。

```bash
npm install
```

我们还需要更新 `postcss.config.js` 文件来配置 postcss。

```js
module.exports = {
    plugins: [
        require('postcss-nesting')(),
        require('cssnano')({
            preset: 'default',
        }),
    ],
};
```

你也可以删除测试目录和文件，但我们暂时保留它们，尽管我们不会在此示例中使用它们，我们强烈建议你为插件编写测试。

## 第 3 步：设置提供者

现在我们已经清理了插件，可以开始添加代码。`src/HeadingsServiceProvider.php` 文件中的样板代码有很多内容，所以让我们删除所有内容并从头开始。

我们需要能够向 Filament 资源管理器注册我们的样式表，以便我们可以在 Blade 视图中按需加载它。为此，我们需要在服务提供者的 `packageBooted` 方法中添加以下内容。

***注意 `loadedOnRequest()` 方法。这很重要，因为它告诉 Filament 仅在需要时加载样式表。***

```php
namespace Awcodes\Headings;

use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class HeadingsServiceProvider extends PackageServiceProvider
{
    public static string $name = 'headings';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name)
            ->hasViews();
    }

    public function packageBooted(): void
    {
        FilamentAsset::register([
            Css::make('headings', __DIR__ . '/../resources/dist/headings.css')->loadedOnRequest(),
        ], 'awcodes/headings');
    }
}
```

## 第 4 步：创建组件

接下来，我们需要创建组件。在 `src/Heading.php` 创建一个新文件并添加以下代码。

```php
namespace Awcodes\Headings;

use Closure;
use Filament\Schemas\Components\Component;
use Filament\Support\Colors\Color;
use Filament\Support\Concerns\HasColor;

class Heading extends Component
{
    use HasColor;

    protected string | int $level = 2;

    protected string | Closure $content = '';

    protected string $view = 'headings::heading';

    final public function __construct(string | int $level)
    {
        $this->level($level);
    }

    public static function make(string | int $level): static
    {
        return app(static::class, ['level' => $level]);
    }

    public function content(string | Closure $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function level(string | int $level): static
    {
        $this->level = $level;

        return $this;
    }

    public function getColor(): array
    {
        return $this->evaluate($this->color) ?? Color::Amber;
    }

    public function getContent(): string
    {
        return $this->evaluate($this->content);
    }

    public function getLevel(): string
    {
        return is_int($this->level) ? 'h' . $this->level : $this->level;
    }
}
```

## 第 5 步：渲染组件

接下来，我们需要为组件创建视图。在 `resources/views/heading.blade.php` 创建一个新文件并添加以下代码。

我们使用 x-load 异步加载样式表，因此它仅在必要时加载。你可以在文档的[核心概念](../advanced/assets#lazy-loading-css)部分了解更多信息。

```blade
@php
    $level = $getLevel();
    $color = $getColor();
@endphp

<{{ $level }}
    x-data
    x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref('headings', package: 'awcodes/headings'))]"
    {{
        $attributes
            ->class([
                'headings-component',
                match ($color) {
                    'gray' => 'text-gray-600 dark:text-gray-400',
                    default => 'text-custom-500',
                },
            ])
            ->style([
                \Filament\Support\get_color_css_variables($color, [500]) => $color !== 'gray',
            ])
    }}
>
    {{ $getContent() }}
</{{ $level }}>
```

## 第 6 步：添加样式

接下来，让我们为字段提供一些自定义样式。我们将在 `resources/css/index.css` 中添加以下内容。并运行 `npm run build` 来编译 CSS。

```css
.headings-component {
    &:is(h1, h2, h3, h4, h5, h6) {
         font-weight: 700;
         letter-spacing: -.025em;
         line-height: 1.1;
     }

    &h1 {
         font-size: 2rem;
     }

    &h2 {
         font-size: 1.75rem;
     }

    &h3 {
         font-size: 1.5rem;
     }

    &h4 {
         font-size: 1.25rem;
     }

    &h5,
    &h6 {
         font-size: 1rem;
     }
}
```

然后我们需要构建样式表。

```bash
npm run build
```

## 第 7 步：更新你的 README

你需要更新 `README.md` 文件，包含如何安装插件的说明以及你想与用户分享的任何其他信息，例如如何在他们的项目中使用它。例如：

```php
use Awcodes\Headings\Heading;

Heading::make(2)
    ->content('Product Information')
    ->color(Color::Lime),
```

就这样，我们的用户现在可以安装我们的插件并在他们的项目中使用它了。

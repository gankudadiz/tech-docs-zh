---
title: 注册资源
---

## 简介

Filament 生态系统中的所有包共享一个资源管理系统。这允许官方插件和第三方插件注册 CSS 和 JavaScript 文件，然后由 Blade 视图使用。

## `FilamentAsset` 门面

`FilamentAsset` 门面用于将文件注册到资源系统中。这些文件可以来自文件系统中的任何位置，但当运行 `php artisan filament:assets` 命令时，它们会被复制到应用的 `/public` 目录中。通过将它们复制到 `/public` 目录，我们可以预测性地在 Blade 视图中加载它们，同时确保第三方包能够加载其资源而不必担心它们的位置。

资源始终有一个由你选择的唯一 ID，当资源被复制到 `/public` 目录时用作文件名。此 ID 也用于在 Blade 视图中引用资源。虽然 ID 是唯一的，但如果你是为插件注册资源，则不必担心 ID 与其他插件冲突，因为资源会被复制到以你的插件命名的目录中。

`FilamentAsset` 门面应在服务提供者的 `boot()` 方法中使用。它可以在应用服务提供者（如 `AppServiceProvider`）中使用，也可以在插件服务提供者中使用。

`FilamentAsset` 门面有一个主要方法 `register()`，接受一个要注册的资源数组：

```php
use Filament\Support\Facades\FilamentAsset;

public function boot(): void
{
    // ...

    FilamentAsset::register([
        // ...
    ]);

    // ...
}
```

### 为插件注册资源

为插件注册资源时，你应该将 Composer 包的名称作为 `register()` 方法的第二个参数传递：

```php
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    // ...
], package: 'danharrin/filament-blog');
```

现在，此插件的所有资源将被复制到 `/public` 中它们自己的目录中，以避免与其他插件同名文件冲突。

## 注册 CSS 文件

要向资源系统注册 CSS 文件，请在服务提供者的 `boot()` 方法中使用 `FilamentAsset::register()` 方法。你必须传入一个 `Css` 对象数组，每个对象代表一个应注册到资源系统中的 CSS 文件。

每个 `Css` 对象有一个唯一 ID 和 CSS 文件的路径：

```php
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    Css::make('custom-stylesheet', __DIR__ . '/../../resources/css/custom.css'),
]);
```

在此示例中，我们使用 `__DIR__` 从当前文件生成资源的相对路径。例如，如果你将此代码添加到 `/app/Providers/AppServiceProvider.php`，则 CSS 文件应存在于 `/resources/css/custom.css` 中。

现在，当运行 `php artisan filament:assets` 命令时，此 CSS 文件将被复制到 `/public` 目录中。此外，它现在会被加载到所有使用 Filament 的 Blade 视图中。如果你只想在页面上的元素需要时才加载 CSS，请查看[延迟加载 CSS](#延迟加载-css)部分。

### 在插件中使用 Tailwind CSS

通常，注册 CSS 文件用于注册应用的自定义样式表。如果你想使用 Tailwind CSS 处理这些文件，你需要考虑其影响，特别是如果你是插件开发者。

Tailwind 构建对每个应用都是唯一的 -- 它们只包含你实际在应用中使用的最小工具类集。这意味着如果你是插件开发者，你可能不应该将 Tailwind CSS 文件构建到你的插件中。相反，你应该提供原始的 CSS 文件并指导用户自行构建 Tailwind CSS 文件。为此，他们需要使用 `@source` 指令将你的 vendor 目录添加到其自定义主题的 CSS 文件中。在他们的[自定义主题](../styling/overview#creating-a-custom-theme) CSS 文件（例如 `resources/css/filament/admin/theme.css`）中，应添加：

```css
@import "tailwindcss";

@source '../../../../app/Filament/**/*';
@source '../../../../resources/views/filament/**/*';
@source '../../../../vendor/danharrin/filament-blog/resources/views/**/*'; /* 你的插件的 vendor 目录 */
```

这意味着当他们构建 Tailwind CSS 文件时，它将包含你的插件视图中使用的所有工具类，以及他们的应用和 Filament 核心中使用的工具类。

然而，使用此技术时，将你的插件与 [Panel Builder](../panel-configuration) 一起使用的用户可能会遇到额外的复杂情况。如果他们有[自定义主题](../styling/overview#creating-a-custom-theme)，他们没问题，因为他们反正都在使用 Tailwind CSS 构建自己的 CSS 文件。但是，如果他们使用的是 Panel Builder 附带的默认样式表，你可能需要注意在插件视图中使用的工具类。例如，如果你使用了默认样式表中未包含的工具类，而用户没有自行编译它，它将不会包含在最终的 CSS 文件中。这意味着你的插件视图可能不会按预期显示。这是少数我建议在你的插件中编译并[注册](#注册-css-文件)一个 Tailwind CSS 编译样式表的情况之一。

### 延迟加载 CSS

默认情况下，所有注册到资源系统的 CSS 文件都会在每个 Filament 页面的 `<head>` 中加载。这是加载 CSS 文件最简单的方式，但有时它们可能相当大且不是每个页面都需要。在这种情况下，你可以利用 Filament 附带的 [Alpine.js Lazy Load Assets](https://github.com/tanthammar/alpine-lazy-load-assets) 包。它允许你使用 Alpine.js 轻松地按需加载 CSS 文件。前提非常简单，你在元素上使用 `x-load-css` 指令，当该元素加载到页面时，指定的 CSS 文件会被加载到页面的 `<head>` 中。这对小型 UI 元素和需要 CSS 文件的整个页面都很适用：

```blade
<div
    x-data="{}"
    x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref('custom-stylesheet'))]"
>
    <!-- ... -->
</div>
```

要防止 CSS 文件自动加载，你可以使用 `loadedOnRequest()` 方法：

```php
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    Css::make('custom-stylesheet', __DIR__ . '/../../resources/css/custom.css')->loadedOnRequest(),
]);
```

如果你的 CSS 文件是[注册到插件的](#为插件注册资源)，你必须将其作为第二个参数传给 `FilamentAsset::getStyleHref()` 方法：

```blade
<div
    x-data="{}"
    x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref('custom-stylesheet', package: 'danharrin/filament-blog'))]"
>
    <!-- ... -->
</div>
```

### 从 URL 注册 CSS 文件

如果你想从 URL 注册 CSS 文件，可以这样做。这些资源将照常在每个页面上加载，但在运行 `php artisan filament:assets` 命令时不会被复制到 `/public` 目录中。这对于注册来自 CDN 的外部样式表，或你已经直接编译到 `/public` 目录中的样式表很有用：

```php
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    Css::make('example-external-stylesheet', 'https://example.com/external.css'),
    Css::make('example-local-stylesheet', asset('css/local.css')),
]);
```

### 注册 CSS 变量

有时，你可能希望在 CSS 文件中使用来自后端的动态数据。为此，你可以在服务提供者的 `boot()` 方法中使用 `FilamentAsset::registerCssVariables()` 方法：

```php
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::registerCssVariables([
    'background-image' => asset('images/background.jpg'),
]);
```

现在，你可以从任何 CSS 文件访问这些变量：

```css
background-image: var(--background-image);
```

## 注册 JavaScript 文件

要向资源系统注册 JavaScript 文件，请在服务提供者的 `boot()` 方法中使用 `FilamentAsset::register()` 方法。你必须传入一个 `Js` 对象数组，每个对象代表一个应注册到资源系统中的 JavaScript 文件。

每个 `Js` 对象有一个唯一 ID 和 JavaScript 文件的路径：

```php
use Filament\Support\Assets\Js;

FilamentAsset::register([
    Js::make('custom-script', __DIR__ . '/../../resources/js/custom.js'),
]);
```

在此示例中，我们使用 `__DIR__` 从当前文件生成资源的相对路径。例如，如果你将此代码添加到 `/app/Providers/AppServiceProvider.php`，则 JavaScript 文件应存在于 `/resources/js/custom.js` 中。

现在，当运行 `php artisan filament:assets` 命令时，此 JavaScript 文件将被复制到 `/public` 目录中。此外，它现在会被加载到所有使用 Filament 的 Blade 视图中。如果你只想在页面上的元素需要时才加载 JavaScript，请查看[延迟加载 JavaScript](#延迟加载-javascript)部分。

### 延迟加载 JavaScript

默认情况下，所有注册到资源系统的 JavaScript 文件都会在每个 Filament 页面的底部加载。这是加载 JavaScript 文件最简单的方式，但有时它们可能相当大且不是每个页面都需要。在这种情况下，你可以利用 Filament 附带的 [Alpine.js Lazy Load Assets](https://github.com/tanthammar/alpine-lazy-load-assets) 包。它允许你使用 Alpine.js 轻松地按需加载 JavaScript 文件。前提非常简单，你在元素上使用 `x-load-js` 指令，当该元素加载到页面时，指定的 JavaScript 文件会被加载到页面底部。这对小型 UI 元素和需要 JavaScript 文件的整个页面都很适用：

```blade
<div
    x-data="{}"
    x-load-js="[@js(\Filament\Support\Facades\FilamentAsset::getScriptSrc('custom-script'))]"
>
    <!-- ... -->
</div>
```

要防止 JavaScript 文件自动加载，你可以使用 `loadedOnRequest()` 方法：

```php
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    Js::make('custom-script', __DIR__ . '/../../resources/js/custom.js')->loadedOnRequest(),
]);
```

如果你的 JavaScript 文件是[注册到插件的](#为插件注册资源)，你必须将其作为第二个参数传给 `FilamentAsset::getScriptSrc()` 方法：

```blade
<div
    x-data="{}"
    x-load-js="[@js(\Filament\Support\Facades\FilamentAsset::getScriptSrc('custom-script', package: 'danharrin/filament-blog'))]"
>
    <!-- ... -->
</div>
```

#### 异步 Alpine.js 组件

有时，你可能想为基于 Alpine.js 的组件加载外部 JavaScript 库。最好的方法是将编译后的 JavaScript 和 Alpine 组件存储在单独的文件中，并在组件渲染时加载它。

首先，你应该通过 NPM 安装 [esbuild](https://esbuild.github.io)，我们将用它来创建一个包含你的外部库和 Alpine 组件的单个 JavaScript 文件：

```bash
npm install esbuild --save-dev
```

然后，你必须创建一个脚本来编译你的 JavaScript 和 Alpine 组件。你可以将其放在任何位置，例如 `bin/build.js`：

```js
import * as esbuild from 'esbuild'

const isDev = process.argv.includes('--dev')

async function compile(options) {
    const context = await esbuild.context(options)

    if (isDev) {
        await context.watch()
    } else {
        await context.rebuild()
        await context.dispose()
    }
}

const defaultOptions = {
    define: {
        'process.env.NODE_ENV': isDev ? `'development'` : `'production'`,
    },
    bundle: true,
    mainFields: ['module', 'main'],
    platform: 'neutral',
    sourcemap: isDev ? 'inline' : false,
    sourcesContent: isDev,
    treeShaking: true,
    target: ['es2020'],
    minify: !isDev,
    plugins: [{
        name: 'watchPlugin',
        setup(build) {
            build.onStart(() => {
                console.log(`Build started at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`)
            })

            build.onEnd((result) => {
                if (result.errors.length > 0) {
                    console.log(`Build failed at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`, result.errors)
                } else {
                    console.log(`Build finished at ${new Date(Date.now()).toLocaleTimeString()}: ${build.initialOptions.outfile}`)
                }
            })
        }
    }],
}

compile({
    ...defaultOptions,
    entryPoints: ['./resources/js/components/test-component.js'],
    outfile: './resources/js/dist/components/test-component.js',
})
```

如你所见，在脚本底部，我们将一个名为 `resources/js/components/test-component.js` 的文件编译到 `resources/js/dist/components/test-component.js`。你可以更改这些路径以满足你的需求。你可以编译任意多的组件。

现在，创建一个名为 `resources/js/components/test-component.js` 的新文件：

```js
// 在这里从 NPM 导入任何外部 JavaScript 库。

export default function testComponent({
    state,
}) {
    return {
        state,

        // 你可以在这里定义任何其他 Alpine.js 属性。

        init() {
            // 如果需要，在这里初始化 Alpine 组件。
        },

        // 你可以在这里定义任何其他 Alpine.js 函数。
    }
}
```

现在，你可以通过运行以下命令将此文件编译到 `resources/js/dist/components/test-component.js`：

```bash
node bin/build.js
```

如果你想监视此文件的更改而不是一次性编译，请尝试以下命令：

```bash
node bin/build.js --dev
```

现在，你需要告诉 Filament 将此编译后的 JavaScript 文件发布到 Laravel 应用的 `/public` 目录中，以便浏览器可以访问。为此，你可以在服务提供者的 `boot()` 方法中使用 `FilamentAsset::register()` 方法，传入一个 `AlpineComponent` 对象：

```php
use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    AlpineComponent::make('test-component', __DIR__ . '/../../resources/js/dist/components/test-component.js'),
]);
```

当你运行 `php artisan filament:assets` 时，编译后的文件将被复制到 `/public` 目录中。

最后，你可以在视图中使用 `x-load` 属性和 `FilamentAsset::getAlpineComponentSrc()` 方法加载此异步 Alpine 组件：

```blade
<div
    x-load
    x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('test-component') }}"
    x-data="testComponent({
        state: $wire.{{ $applyStateBindingModifiers("\$entangle('{$statePath}')") }},
    })"
>
    <input x-model="state" />
</div>
```

此示例用于[自定义表单字段](../forms/custom-fields)。它将 `state` 作为参数传递给 `testComponent()` 函数，该函数与 Livewire 组件属性进行绑定。你可以传入任何参数，并在 `testComponent()` 函数中访问它们。如果你不使用自定义表单字段，可以忽略此示例中的 `state` 参数。

`x-load` 属性来自 [Async Alpine](https://async-alpine.dev/docs/strategies) 包，该包的任何功能都可以在这里使用。

### 注册脚本数据

有时，你可能希望使后端数据在 JavaScript 文件中可用。为此，你可以在服务提供者的 `boot()` 方法中使用 `FilamentAsset::registerScriptData()` 方法：

```php
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::registerScriptData([
    'user' => [
        'name' => auth()->user()?->name,
    ],
]);
```

现在，你可以在运行时从任何 JavaScript 文件访问该数据，使用 `window.filamentData` 对象：

```js
window.filamentData.user.name // 'Dan Harrin'
```

### 从 URL 注册 JavaScript 文件

如果你想从 URL 注册 JavaScript 文件，可以这样做。这些资源将照常在每个页面上加载，但在运行 `php artisan filament:assets` 命令时不会被复制到 `/public` 目录中。这对于注册来自 CDN 的外部脚本，或你已经直接编译到 `/public` 目录中的脚本很有用：

```php
use Filament\Support\Facades\FilamentAsset;
use Filament\Support\Assets\Js;

FilamentAsset::register([
    Js::make('example-external-script', 'https://example.com/external.js'),
    Js::make('example-local-script', asset('js/local.js')),
]);
```

### 使用 Vite 编译的 JavaScript 文件

`php artisan filament:assets` 命令按原样将文件复制到 `/public` 目录，不进行打包或解析依赖。这意味着如果你的 JavaScript 文件使用 `import` 语句引入 npm 包，浏览器将无法解析它们。要使用需要打包的 JavaScript 文件，你应该先用 [Vite](https://vitejs.dev) 编译它们，然后将编译后的输出注册为基于 URL 的资源。

首先，将你的 JavaScript 文件添加为 `vite.config.js` 中的入口点：

```js
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/timezone.js', // 你的自定义脚本
            ],
        }),
    ],
})
```

然后，使用 Vite 编译资源：

```bash
npm run build
```

最后，使用 `Vite::asset()` 注册编译后的资源以解析版本化的 URL：

```php
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Illuminate\Support\Facades\Vite;

FilamentAsset::register([
    Js::make('timezone', Vite::asset('resources/js/timezone.js')),
]);
```

此方法也适用于 TypeScript 文件或任何需要构建步骤的 JavaScript。由于 `Vite::asset()` 返回一个 URL，该资源不会被 `php artisan filament:assets` 复制 -- 它直接从 Vite 的构建输出中提供。

:::info
如果你需要为[异步 Alpine.js 组件](#异步-alpinejs-组件)打包 JavaScript，请考虑使用 esbuild，如该部分所述。
:::

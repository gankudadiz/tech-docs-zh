---
title: 安装
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/installation.md
source_version: v3.8.0
translation_status: draft
---

Livewire 是一个 Laravel 包，因此你需要先有一个运行中的 Laravel 应用才能安装和使用 Livewire。如果你需要帮助创建新的 Laravel 应用，请参考[官方 Laravel 文档](https://laravel.com/docs/installation)。

要安装 Livewire，打开终端并进入你的 Laravel 应用目录，然后运行以下命令：

```shell
composer require livewire/livewire
```

就是这样——真的。如果你想要更多的自定义选项，请继续阅读。否则，你可以直接开始使用 Livewire。

:::warning[`/livewire/livewire.js` 返回 404 状态码]
默认情况下，Livewire 会在你的应用中暴露一个路由来提供 JavaScript 资源：`/livewire/livewire.js`。这对大多数应用来说没有问题，但是，如果你在使用自定义配置的 Nginx，可能会从这个接口收到 404 错误。要解决这个问题，你可以自己编译 Livewire 的 JavaScript 资源，或者[配置 Nginx 允许这个路由](https://benjamincrozat.com/livewire-js-404-not-found)。
:::

## 发布配置文件

Livewire 是"零配置"的，意味着你可以按照约定使用它，无需额外配置。不过，如果需要，你可以通过运行下面的 Artisan 命令来发布和自定义 Livewire 的配置文件：

```shell
php artisan livewire:publish --config
```

这会在你的 Laravel 应用的 `config` 目录下创建一个新的 `livewire.php` 文件。

## 手动引入 Livewire 的前端资源

默认情况下，Livewire 会在每个包含 Livewire 组件的页面上自动注入所需的 JavaScript 和 CSS 资源。

如果你希望对这一行为有更多控制，你可以使用以下 Blade 指令在页面上手动引入资源：

```blade
<html>
<head>
	...
	@livewireStyles
</head>
<body>
	...
	@livewireScripts
</body>
</html>
```

通过在页面上手动引入这些资源，Livewire 就不会再自动注入资源了。

:::warning[AlpineJS 已捆绑在 Livewire 中]
由于 Alpine 已经捆绑在 Livewire 的 JavaScript 资源中，你必须在每个想使用 Alpine 的页面上包含 `@livewireScripts` 指令。即使页面上没有使用 Livewire 也需要这样做。
:::

虽然很少需要，但你也可以通过更新应用 `config/livewire.php` 文件中的 `inject_assets` 配置选项来禁用 Livewire 的自动注入行为：

```php
'inject_assets' => false,
```

如果你希望在单个或多个页面上强制 Livewire 注入资源，可以在当前路由或服务提供者中调用以下全局方法：

```php
\Livewire\Livewire::forceAssetInjection();
```

## 配置 Livewire 的更新端点

Livewire 组件中的每次更新都会向服务器发送网络请求，目标端点为：`https://example.com/livewire/update`

这对某些使用本地化或多租户的应用来说可能会成为一个问题。

在这种情况下，你可以按自己的需求注册端点，只要在 `Livewire::setUpdateRoute()` 内部完成注册，Livewire 就会知道所有组件更新都使用这个端点：

```php
Livewire::setUpdateRoute(function ($handle) {
	return Route::post('/custom/livewire/update', $handle);
});
```

现在，Livewire 将会把组件更新发送到 `/custom/livewire/update`，而不是 `/livewire/update`。

因为 Livewire 允许你注册自己的更新路由，你也可以直接在 `setUpdateRoute()` 中声明 Livewire 需要使用的任何额外中间件：

```php
Livewire::setUpdateRoute(function ($handle) {
	return Route::post('/custom/livewire/update', $handle)
        ->middleware([...]); // [tl! highlight]
});
```

## 自定义资源 URL

默认情况下，Livewire 会从以下 URL 提供 JavaScript 资源：`https://example.com/livewire/livewire.js`。此外，Livewire 会通过类似下面的 script 标签引用该资源：

```blade
<script src="/livewire/livewire.js" ...
```

如果你的应用由于本地化或多租户而有全局路由前缀，你可以注册自己的端点，让 Livewire 在内部获取 JavaScript 时使用。

要使用自定义的 JavaScript 资源端点，你可以在 `Livewire::setScriptRoute()` 中注册自己的路由：

```php
Livewire::setScriptRoute(function ($handle) {
    return Route::get('/custom/livewire/livewire.js', $handle);
});
```

现在，Livewire 会像这样加载 JavaScript：

```blade
<script src="/custom/livewire/livewire.js" ...
```

## 手动编译 Livewire 和 Alpine

默认情况下，Alpine 和 Livewire 是通过 `<script src="livewire.js">` 标签加载的，这意味着你无法控制这些库的加载顺序。因此，如下例所示导入和注册 Alpine 插件的操作将不再有效：

```js
// Warning: This snippet demonstrates what NOT to do...

import Alpine from 'alpinejs'
import Clipboard from '@ryangjchandler/alpine-clipboard'

Alpine.plugin(Clipboard)
Alpine.start()
```

为了解决这个问题，我们需要告知 Livewire 我们想自己使用 ESM（ECMAScript 模块）版本，并阻止注入 `livewire.js` 脚本标签。为此，我们需要在布局文件（`resources/views/components/layouts/app.blade.php`）中添加 `@livewireScriptConfig` 指令：

```blade
<html>
<head>
    <!-- ... -->
    @livewireStyles
    @vite(['resources/js/app.js'])
</head>
<body>
    {{ $slot }}

    @livewireScriptConfig <!-- [tl! highlight] -->
</body>
</html>
```

当 Livewire 检测到 `@livewireScriptConfig` 指令时，它就不会再注入 Livewire 和 Alpine 脚本。如果你使用了 `@livewireScripts` 指令来手动加载 Livewire，请务必将其移除。如果还没有 `@livewireStyles` 指令，请确保添加它。

最后一步是在 `app.js` 文件中导入 Alpine 和 Livewire，这样就可以注册任何自定义资源，并最终启动 Livewire 和 Alpine：

```js
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';
import Clipboard from '@ryangjchandler/alpine-clipboard'

Alpine.plugin(Clipboard)

Livewire.start()
```

:::tip[每次 composer update 后重新构建资源]
如果你在手动编译 Livewire 和 Alpine，请确保每次运行 `composer update` 后都重新构建资源。
:::

:::warning[与 Laravel Mix 不兼容]
如果你在手动编译 Livewire 和 AlpineJS，Laravel Mix 将无法正常工作。我们建议你[切换到 Vite](https://laravel.com/docs/vite)。
:::

## 发布 Livewire 的前端资源

:::warning[发布资源并非必需]
发布 Livewire 的资源不是运行 Livewire 的必要条件。只有在你有特定需求时才需要这样做。
:::

如果你希望 JavaScript 资源由你的 Web 服务器（而不是通过 Laravel）提供，可以使用 `livewire:publish` 命令：

```bash
php artisan livewire:publish --assets
```

为了保持资源更新并在未来升级中避免问题，我们强烈建议将以下命令添加到你的 `composer.json` 文件中：

```json
{
    "scripts": {
        "post-update-cmd": [
            // Other scripts
            "@php artisan vendor:publish --tag=livewire:assets --ansi --force"
        ]
    }
}
```

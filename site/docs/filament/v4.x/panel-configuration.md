---
title: 面板配置
---
## 简介

默认情况下，配置文件位于 `app/Providers/Filament/AdminPanelProvider.php`。继续阅读以了解有关[面板](#面板介绍)以及每个面板如何拥有[自己的配置文件](#创建新面板)的更多信息。

## 面板介绍

默认情况下，当你安装包时，已经为你设置了一个面板 - 它位于 `/admin`。你创建的所有[资源](resources/overview)、[自定义页面](navigation/custom-pages)和[仪表盘小部件](widgets/overview)都会注册到此面板。

但是，你可以创建任意数量的面板，每个面板都可以拥有自己的资源集、页面和小部件。

例如，你可以构建一个用户在 `/app` 登录并访问其仪表盘的面板，管理员在 `/admin` 登录并管理应用。`/app` 面板和 `/admin` 面板拥有各自的资源，因为每组用户有不同的需求。Filament 通过为你提供创建多个面板的能力来实现这一点。

### 默认管理面板

当你运行 `filament:install` 时，会在 `app/Providers/Filament` 中创建一个新文件 - `AdminPanelProvider.php`。此文件包含 `/admin` 面板的配置。

当本文档提到"配置"时，这就是你需要编辑的文件。它允许你完全自定义应用。

### 创建新面板

要创建新面板，你可以使用 `make:filament-panel` 命令，传入新面板的唯一名称：

```bash
php artisan make:filament-panel app
```

此命令将创建一个名为 "app" 的新面板。配置文件将创建在 `app/Providers/Filament/AppPanelProvider.php`。你可以在 `/app` 访问此面板，但如果你不想使用该路径，可以[自定义路径](#更改路径)。

由于此配置文件也是 [Laravel 服务提供者](https://laravel.com/docs/providers)，它需要在 `bootstrap/providers.php`（Laravel 11 应用结构及以上）或 `config/app.php`（Laravel 10 应用结构及以下）中注册。Filament 会尝试为你完成此操作，但如果在尝试访问面板时出现错误，则此过程可能已失败。

## 更改路径

在面板配置文件中，你可以使用 `path()` 方法更改应用可访问的路径：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->path('app');
}
```

如果你想让应用在没有任何前缀的情况下可访问，可以将其设置为空字符串：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->path('');
}
```

确保你的 `routes/web.php` 文件没有已经定义 `''` 或 `'/'` 路由，因为它会优先。

## 渲染钩子

[渲染钩子](advanced/render-hooks)允许你在框架视图的各种位置渲染 Blade 内容。你可以在服务提供者或中间件中[注册全局渲染钩子](advanced/render-hooks#注册渲染钩子)，但它也允许你注册特定于面板的渲染钩子。为此，你可以在面板配置对象上使用 `renderHook()` 方法。以下是一个将 [`wire-elements/modal`](https://github.com/wire-elements/modal) 与 Filament 集成的示例：

```php
use Filament\Panel;
use Filament\View\PanelsRenderHook;
use Illuminate\Support\Facades\Blade;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->renderHook(
            PanelsRenderHook::BODY_START,
            fn (): string => Blade::render('@livewire(\'livewire-ui-modal\')'),
        );
}
```

可用渲染钩子的完整列表可以在[这里](advanced/render-hooks#可用渲染钩子)找到。

## 设置域名

默认情况下，Filament 将响应来自所有域的请求。如果你想将其限定到特定域，可以使用 `domain()` 方法，类似于 Laravel 中的 [`Route::domain()`](https://laravel.com/docs/routing#route-group-subdomain-routing)：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->domain('admin.example.com');
}
```

## 自定义最大内容宽度

默认情况下，Filament 会限制页面上内容的宽度，使其在大屏幕上不会变得太宽。要更改此设置，你可以使用 `maxContentWidth()` 方法。选项对应于 [Tailwind 的最大宽度比例](https://tailwindcss.com/docs/max-width)。选项包括 `ExtraSmall`、`Small`、`Medium`、`Large`、`ExtraLarge`、`TwoExtraLarge`、`ThreeExtraLarge`、`FourExtraLarge`、`FiveExtraLarge`、`SixExtraLarge`、`SevenExtraLarge`、`Full`、`MinContent`、`MaxContent`、`FitContent`、`Prose`、`ScreenSmall`、`ScreenMedium`、`ScreenLarge`、`ScreenExtraLarge` 和 `ScreenTwoExtraLarge`。默认值为 `SevenExtraLarge`：

```php
use Filament\Panel;
use Filament\Support\Enums\Width;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->maxContentWidth(Width::Full);
}
```

![全内容宽度的面板](/assets/filament/v4.x/screenshots/images/light/panels/configuration/content-width-full.jpg)

如果你想为 `SimplePage` 类型的页面（如登录和注册页面）设置最大内容宽度，可以使用 `simplePageMaxContentWidth()` 方法。默认值为 `Large`：

```php
use Filament\Panel;
use Filament\Support\Enums\Width;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->simplePageMaxContentWidth(Width::Small);
}
```

![小最大内容宽度的登录页面](/assets/filament/v4.x/screenshots/images/light/panels/configuration/simple-page-max-content-width.jpg)

## 设置默认子导航位置

子导航默认在每个页面的开头渲染。它可以按页面、资源和集群进行自定义，但你也可以使用 `subNavigationPosition()` 方法一次为整个面板自定义它。值可以是 `SubNavigationPosition::Start`、`SubNavigationPosition::End` 或 `SubNavigationPosition::Top` 以将子导航渲染为标签页：

```php
use Filament\Pages\Enums\SubNavigationPosition;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->subNavigationPosition(SubNavigationPosition::End);
}
```

## 生命周期钩子

钩子可用于在面板的生命周期中执行代码。`bootUsing()` 是一个钩子，在该面板内发生的每个请求上运行。如果你有多个面板，只有当前面板的 `bootUsing()` 会运行。该函数从中间件运行，在所有服务提供者启动之后：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->bootUsing(function (Panel $panel) {
            // ...
        });
}
```

## SPA 模式

SPA 模式利用 [Livewire 的 `wire:navigate` 功能](https://livewire.laravel.com/docs/navigate)使你的服务器渲染面板感觉像单页应用程序，页面加载之间的延迟更少，对于较长的请求有加载条。要在面板上启用 SPA 模式，你可以使用 `spa()` 方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->spa();
}
```

### 为特定 URL 禁用 SPA 导航

默认情况下，启用 SPA 模式时，与当前请求位于同一域上的任何 URL 都将使用 Livewire 的 [`wire:navigate`](https://livewire.laravel.com/docs/navigate) 功能进行导航。如果你想为特定 URL 禁用此功能，可以使用 `spaUrlExceptions()` 方法：

```php
use App\Filament\Resources\Posts\PostResource;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->spa()
        ->spaUrlExceptions(fn (): array => [
            url('/admin'),
            PostResource::getUrl(),
        ]);
}
```

:::info
在此示例中，我们在资源上使用 [`getUrl()`](resources/overview#生成资源页面的 URL) 来获取资源索引页面的 URL。此功能需要面板已经注册，但配置在请求生命周期中过早，无法完成此操作。你可以使用函数来返回 URL，这些 URL 将在面板注册后解析。
:::

这些 URL 需要与用户导航到的 URL 完全匹配，包括域和协议。如果你想使用模式匹配多个 URL，可以使用星号（`*`）作为通配符：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->spa()
        ->spaUrlExceptions([
            '*/admin/posts/*',
        ]);
}
```

### 启用 SPA 预取

SPA 预取通过在用户将鼠标悬停在链接上时自动预取页面来增强用户体验，使导航感觉更加响应。此功能利用了 [Livewire 的 `wire:navigate.hover` 功能](https://livewire.laravel.com/docs/navigate#prefetching-links)。

要启用带预取的 SPA 模式，你可以向 `spa()` 方法传递 `hasPrefetching: true` 参数：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->spa(hasPrefetching: true);
}
```

启用预取后，面板中的所有链接将自动包含 `wire:navigate.hover`，当用户将鼠标悬停在链接上时预取页面内容。这与[URL 例外](#为特定-url-禁用-spa-导航)无缝配合 - 从 SPA 模式排除的任何 URL 也将从预取中排除。

:::info
预取仅在启用 SPA 模式时有效。如果禁用 SPA 模式，预取也将自动禁用。
:::

:::warning
预取重量级页面可能导致带宽使用和服务器负载增加，特别是在用户快速连续悬停在多个链接上时。请谨慎使用此功能，特别是如果你的应用有包含大量数据或复杂查询的页面。
:::

## 未保存更改警告

如果用户尝试在未保存更改的情况下离开页面，你可以向他们发出警告。这应用于资源的[创建](resources/creating-records)和[编辑](resources/editing-records)页面，以及任何打开的操作模态框。要启用此功能，你可以使用 `unsavedChangesAlerts()` 方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->unsavedChangesAlerts();
}
```

## 启用数据库事务

默认情况下，Filament 不会将操作包装在数据库事务中，并允许用户在测试确保其操作可以安全地包装在事务中后自行启用。但是，你可以使用 `databaseTransactions()` 方法一次为所有操作启用数据库事务：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->databaseTransactions();
}
```

对于不想包装在事务中的任何操作，你可以使用 `databaseTransaction(false)` 方法：

```php
CreateAction::make()
    ->databaseTransaction(false)
```

对于像[创建资源](resources/creating-records)和[编辑资源](resources/editing-records)这样的页面，你可以在页面类上将 `$hasDatabaseTransactions` 属性定义为 `false`：

```php
use Filament\Resources\Pages\CreateRecord;

class CreatePost extends CreateRecord
{
    protected ?bool $hasDatabaseTransactions = false;

    // ...
}
```

### 为特定操作和页面选择启用数据库事务

与其到处启用数据库事务并为特定操作和页面选择退出，你可以为特定操作和页面选择启用数据库事务。

对于操作，你可以使用 `databaseTransaction()` 方法：

```php
CreateAction::make()
    ->databaseTransaction()
```

对于像[创建资源](resources/creating-records)和[编辑资源](resources/editing-records)这样的页面，你可以在页面类上将 `$hasDatabaseTransactions` 属性定义为 `true`：

```php
use Filament\Resources\Pages\CreateRecord;

class CreatePost extends CreateRecord
{
    protected ?bool $hasDatabaseTransactions = true;

    // ...
}
```

## 为面板注册资源

你可以注册仅在特定面板内的页面上加载的[资源](advanced/assets)，而不是在应用的其余部分加载。为此，将资源数组传递给 `assets()` 方法：

```php
use Filament\Panel;
use Filament\Support\Assets\Css;
use Filament\Support\Assets\Js;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->assets([
            Css::make('custom-stylesheet', resource_path('css/custom.css')),
            Js::make('custom-script', resource_path('js/custom.js')),
        ]);
}
```

在使用这些[资源](advanced/assets)之前，你需要运行 `php artisan filament:assets`。

## 应用中间件

你可以通过将中间件类数组传递给配置中的 `middleware()` 方法来为所有路由应用额外的中间件：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->middleware([
            // ...
        ]);
}
```

默认情况下，中间件将在页面首次加载时运行，但在后续的 Livewire AJAX 请求上不会运行。如果你想在每个请求上运行中间件，可以通过将 `true` 作为第二个参数传递给 `middleware()` 方法来使其持久化：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->middleware([
            // ...
        ], isPersistent: true);
}
```

### 为已认证路由应用中间件

你可以通过将中间件类数组传递给配置中的 `authMiddleware()` 方法来为所有已认证路由应用中间件：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->authMiddleware([
            // ...
        ]);
}
```

默认情况下，中间件将在页面首次加载时运行，但在后续的 Livewire AJAX 请求上不会运行。如果你想在每个请求上运行中间件，可以通过将 `true` 作为第二个参数传递给 `authMiddleware()` 方法来使其持久化：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->authMiddleware([
            // ...
        ], isPersistent: true);
}
```

## 禁用广播

默认情况下，如果在[发布的 `config/filament.php` 配置文件](introduction/installation#发布配置)中设置了凭据，Laravel Echo 将自动为每个面板连接。要在此面板中禁用此自动连接，你可以使用 `broadcasting(false)` 方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->broadcasting(false);
}
```

## 严格授权模式

默认情况下，当 Filament 授权用户访问资源时，它会首先检查该模型是否存在策略，如果存在，它将检查策略上是否存在执行操作的方法。如果策略或策略方法不存在，它将授予用户对资源的访问权限，因为它假设你尚未设置授权，或者你不需要它。

如果你希望 Filament 在策略或策略方法不存在时抛出异常，可以使用 `strictAuthorization()` 方法启用严格授权模式：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->strictAuthorization();
}
```

## 配置错误通知

当 Laravel 的调试模式被禁用时，Filament 会用更整洁的闪存通知替换 Livewire 的全屏错误模态框。你可以使用 `errorNotifications(false)` 方法禁用此行为：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->errorNotifications(false);
}
```

你可以通过向 `registerErrorNotification()` 方法的 `title` 和 `body` 参数传递字符串来自定义错误通知文本：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->registerErrorNotification(
            title: 'An error occurred',
            body: 'Please try again later.',
        );
}
```

你还可以通过在 `statusCode` 参数中传递该状态码来为特定 HTTP 状态码（如 `404`）注册错误通知文本：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->registerErrorNotification(
            title: 'An error occurred',
            body: 'Please try again later.',
        )
        ->registerErrorNotification(
            title: 'Record not found',
            body: 'A record you are looking for does not exist.',
            statusCode: 404,
        );
}
```

你还可以通过将该状态码传递给 `hiddenErrorNotification()` 方法来选择隐藏特定 HTTP 状态码（如 `403`）的通知。隐藏的状态码仍将被 Filament 捕获，但不会显示通知。

或者，你可以使用 `disabledErrorNotification()` 方法回退到 Livewire 的内置错误处理来处理该状态码。如果你想挂接到 Livewire 错误处理系统来自定义特定状态码的错误处理行为，同时为其他所有内容维护 Filament 的错误通知系统，这很有用。

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->registerErrorNotification(
            title: 'An error occurred',
            body: 'Please try again later.',
        )
        ->hiddenErrorNotification(403)
        ->disabledErrorNotification(503);
}
```

你还可以通过在页面类上设置 `$hasErrorNotifications` 属性来为面板中的特定页面启用或禁用错误通知：

```php
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected ?bool $hasErrorNotifications = true;

    // 或

    protected ?bool $hasErrorNotifications = false;

    // ...
}
```

如果你想运行自定义代码来检查是否应显示错误通知，可以在页面类上使用 `hasErrorNotifications()` 方法：

```php
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    public function hasErrorNotifications(): bool
    {
        return FeatureFlag::active();
    }

    // ...
}
```

你还可以通过在 `setUpErrorNotifications()` 方法内调用页面类上的 `registerErrorNotification()` 方法来注册错误通知文本：

```php
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected function setUpErrorNotifications(): void
    {
        $this->registerErrorNotification(
            title: 'An error occurred',
            body: 'Please try again later.',
        );
    }

    // ...
}
```

你还可以通过在 `statusCode` 参数中传递该状态码来为特定 HTTP 状态码（如 `404`）注册错误通知文本：

```php
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected function setUpErrorNotifications(): void
    {
        $this->registerErrorNotification(
            title: 'An error occurred',
            body: 'Please try again later.',
        );

        $this->registerErrorNotification(
            title: 'Record not found',
            body: 'A record you are looking for does not exist.',
            statusCode: 404,
        );
    }

    // ...
}
```

你还可以通过将该状态码传递给 `hiddenErrorNotification()` 方法来选择隐藏特定 HTTP 状态码（如 `403`）的通知。隐藏的状态码仍将被 Filament 捕获，但不会显示通知。

或者，你可以使用 `disabledErrorNotification()` 方法回退到 Livewire 的内置错误处理来处理该状态码。如果你想挂接到 Livewire 错误处理系统来自定义特定状态码的错误处理行为，同时为其他所有内容维护 Filament 的错误通知系统，这很有用。

```php
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected function setUpErrorNotifications(): void
    {
        $this->registerErrorNotification(
            title: 'An error occurred',
            body: 'Please try again later.',
        );

        $this->hiddenErrorNotification(403);

        $this->disabledErrorNotification(503);
    }

    // ...
}
```

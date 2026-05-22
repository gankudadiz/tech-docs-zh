---
title: 用户菜单
---

## 简介

用户菜单位于管理布局的右上角。它是完全可自定义的。

每个菜单项由一个[操作](../actions)表示，可以用相同的方式自定义。要注册新项，你可以将操作传递给[配置](../panel-configuration)的 `userMenuItems()` 方法：

```php
use App\Filament\Pages\Settings;
use Filament\Actions\Action;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->userMenuItems([
            Action::make('settings')
                ->url(fn (): string => Settings::getUrl())
                ->icon('heroicon-o-cog-6-tooth'),
            // ...
        ]);
}
```

![带有自定义菜单项的用户菜单](/assets/filament/v4.x/screenshots/images/light/panels/navigation/user-menu.jpg)

## 将用户菜单移到侧边栏

默认情况下，用户菜单位于顶部导航栏中。如果顶部导航栏被禁用，则会添加到侧边栏。

你可以通过在[配置](../panel-configuration)中向 `userMenu()` 方法传递 `position` 参数来始终将其移到侧边栏：

```php
use Filament\Enums\UserMenuPosition;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->userMenu(position: UserMenuPosition::Sidebar);
}
```

![用户菜单移到侧边栏](/assets/filament/v4.x/screenshots/images/light/panels/navigation/user-menu-sidebar.jpg)

## 自定义个人资料链接

要自定义用户菜单开头的用户个人资料链接，使用 `profile` 数组键注册一个新项，并传递一个[自定义操作](../actions)对象的函数：

```php
use Filament\Actions\Action;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->userMenuItems([
            'profile' => fn (Action $action) => $action->label('Edit profile'),
            // ...
        ]);
}
```

有关创建个人资料页面的更多信息，请查看[认证功能文档](../users#authentication-features)。

## 自定义退出链接

要自定义用户菜单末尾的用户退出链接，使用 `logout` 数组键注册一个新项，并传递一个[自定义操作](../actions)对象的函数：

```php
use Filament\Actions\Action;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->userMenuItems([
            'logout' => fn (Action $action) => $action->label('Log out'),
            // ...
        ]);
}
```

## 条件隐藏用户菜单项

你还可以通过使用 `visible()` 或 `hidden()` 方法并传入要检查的条件来条件隐藏用户菜单项。传递函数会将条件求值延迟到菜单实际渲染时：

```php
use App\Models\Payment;
use Filament\Actions\Action;

Action::make('payments')
    ->visible(fn (): bool => auth()->user()->can('viewAny', Payment::class))
    // or
    ->hidden(fn (): bool => ! auth()->user()->can('viewAny', Payment::class))
```

## 从用户菜单项发送 `POST` HTTP 请求

你可以通过向 `url()` 方法传递 URL 并使用 `postToUrl()` 从用户菜单项发送 `POST` HTTP 请求：

```php
use Filament\Actions\Action;

Action::make('lockSession')
    ->url(fn (): string => route('lock-session'))
    ->postToUrl()
```

## 禁用用户菜单

你可以通过向 `userMenu()` 方法传入 `false` 来完全禁用用户菜单：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->userMenu(false);
}
```

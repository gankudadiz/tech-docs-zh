---
title: 标签页
---

## 简介

一些 schema 可能很长很复杂。你可能想要使用标签页来减少一次可见的组件数量：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

Tabs::make('标签页')
    ->tabs([
        Tab::make('标签页 1')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 2')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 3')
            ->schema([
                // ...
            ]),
    ])
```

:::tip
除了允许静态值外，`make()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![标签页](/assets/filament/v4.x/screenshots/images/light/schemas/layout/tabs/simple.jpg)

## 设置默认活动标签页

第一个标签页默认是打开的。你可以使用 `activeTab()` 方法更改默认打开的标签页：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

Tabs::make('标签页')
    ->tabs([
        Tab::make('标签页 1')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 2')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 3')
            ->schema([
                // ...
            ]),
    ])
    ->activeTab(2)
```

:::tip
除了允许静态值外，`activeTab()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 设置标签页图标

标签页可以有一个[图标](../styling/icons)，你可以使用 `icon()` 方法设置：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Icons\Heroicon;

Tabs::make('标签页')
    ->tabs([
        Tab::make('通知')
            ->icon(Heroicon::Bell)
            ->schema([
                // ...
            ]),
        // ...
    ])
```

:::tip
除了允许静态值外，`icon()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有图标的标签页](/assets/filament/v4.x/screenshots/images/light/schemas/layout/tabs/icons.jpg)

### 设置标签页图标位置

标签页的图标可以使用 `iconPosition()` 方法定位在标签之前或之后：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Enums\IconPosition;
use Filament\Support\Icons\Heroicon;

Tabs::make('标签页')
    ->tabs([
        Tab::make('通知')
            ->icon(Heroicon::Bell)
            ->iconPosition(IconPosition::After)
            ->schema([
                // ...
            ]),
        // ...
    ])
```

:::tip
除了允许静态值外，`iconPosition()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![图标在标签之后的标签页](/assets/filament/v4.x/screenshots/images/light/schemas/layout/tabs/icons-after.jpg)

## 设置标签页徽章

标签页可以有一个徽章，你可以使用 `badge()` 方法设置：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

Tabs::make('标签页')
    ->tabs([
        Tab::make('通知')
            ->badge(5)
            ->schema([
                // ...
            ]),
        // ...
    ])
```

:::tip
除了允许静态值外，`badge()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有徽章的标签页](/assets/filament/v4.x/screenshots/images/light/schemas/layout/tabs/badges.jpg)

如果你想更改徽章的[颜色](../styling/colors)，可以使用 `badgeColor()` 方法：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

Tabs::make('标签页')
    ->tabs([
        Tab::make('通知')
            ->badge(5)
            ->badgeColor('info')
            ->schema([
                // ...
            ]),
        // ...
    ])
```

:::tip
除了允许静态值外，`badgeColor()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有彩色徽章的标签页](/assets/filament/v4.x/screenshots/images/light/schemas/layout/tabs/badges-color.jpg)

### 延迟加载标签页徽章

如果你有耗时的查询来驱动标签页徽章，初始页面加载可能会很慢。你可以使用 `deferBadge()` 方法延迟加载标签页徽章，这将在页面渲染后异步加载徽章值：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

Tabs::make('标签页')
    ->key('notifications-tabs')
    ->tabs([
        Tab::make('通知')
            ->badge(static fn (): int => Notification::query()->where('unread', true)->count())
            ->deferBadge()
            ->schema([
                // ...
            ]),
        // ...
    ])
```

:::warning
当使用 `deferBadge()` 时，`badge()` 值必须从函数返回。如果你传递一个原始值，如 `badge(Notification::query()->count())`，查询会在标签页构建时立即运行，从而失去延迟的目的。

当使用 `deferBadge()` 时，`Tabs` 组件必须设置 `key()`。没有键，延迟徽章请求无法在服务器上识别正确的组件。
:::

:::tip
除了允许静态值外，`deferBadge()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

当徽章加载时，每个延迟徽章的位置将出现一个小加载指示器。数据获取完成后，加载指示器将被实际的徽章值替换。

## 在标签页中使用网格列

你可以使用 `columns()` 方法自定义标签页内的[网格](layouts#网格系统)：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

Tabs::make('标签页')
    ->tabs([
        Tab::make('标签页 1')
            ->schema([
                // ...
            ])
            ->columns(3),
        // ...
    ])
```

:::tip
除了允许静态值外，`columns()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 禁用可滚动标签页

标签页默认水平渲染，当超过可用宽度时可滚动。

你可以使用 `scrollable(false)` 方法禁用滚动：

```php
use Filament\Schemas\Components\Tabs;

Tabs::make('标签页')
    ->tabs([
        // ...
    ])
    ->scrollable(false)
```

当标签页不可滚动时，组件会自动检测可用宽度。如果无法容纳所有标签页，将出现一个下拉按钮。任何超过可用宽度的标签页将自动分组在此下拉菜单中。

![带有溢出下拉菜单的不可滚动标签页](/assets/filament/v4.x/screenshots/images/light/schemas/layout/tabs/not-scrollable.jpg)

## 使用垂直标签页

你可以使用 `vertical()` 方法垂直渲染标签页：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

Tabs::make('标签页')
    ->tabs([
        Tab::make('标签页 1')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 2')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 3')
            ->schema([
                // ...
            ]),
    ])
    ->vertical()
```

![垂直标签页](/assets/filament/v4.x/screenshots/images/light/schemas/layout/tabs/vertical.jpg)

可选地，你可以向 `vertical()` 方法传递一个布尔值来控制标签页是否应该垂直渲染：

```php
use Filament\Schemas\Components\Tabs;

Tabs::make('标签页')
    ->tabs([
        // ...
    ])
    ->vertical(FeatureFlag::active())
```

:::tip
除了允许静态值外，`vertical()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 移除样式容器

默认情况下，标签页及其内容被包装在一个样式为卡片的容器中。你可以使用 `contained()` 移除样式容器：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

Tabs::make('标签页')
    ->tabs([
        Tab::make('标签页 1')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 2')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 3')
            ->schema([
                // ...
            ]),
    ])
    ->contained(false)
```

:::tip
除了允许静态值外，`contained()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![没有样式容器的标签页](/assets/filament/v4.x/screenshots/images/light/schemas/layout/tabs/not-contained.jpg)

## 在用户会话中持久化当前标签页

默认情况下，当前标签页不会持久化在浏览器的本地存储中。你可以使用 `persistTab()` 方法更改此行为。你还必须为标签页组件传递一个唯一的 `id()`，以将其与应用中的所有其他标签页集区分开来。此 ID 将用作本地存储中存储当前标签页的键：

```php
use Filament\Schemas\Components\Tabs;

Tabs::make('标签页')
    ->tabs([
        // ...
    ])
    ->persistTab()
    ->id('order-tabs')
```

可选地，`persistTab()` 方法接受一个布尔值来控制活动标签页是否应该持久化：

```php
use Filament\Schemas\Components\Tabs;

Tabs::make('标签页')
    ->tabs([
        // ...
    ])
    ->persistTab(FeatureFlag::active())
    ->id('order-tabs')
```

:::tip
除了允许静态值外，`persistTab()` 和 `id()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。
:::

### 在 URL 查询字符串中持久化当前标签页

默认情况下，当前标签页不会持久化在 URL 查询字符串中。你可以使用 `persistTabInQueryString()` 方法更改此行为：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

Tabs::make('标签页')
    ->tabs([
        Tab::make('标签页 1')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 2')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 3')
            ->schema([
                // ...
            ]),
    ])
    ->persistTabInQueryString()
```

启用后，当前标签页使用 `tab` 键持久化在 URL 查询字符串中。你可以通过将其传递给 `persistTabInQueryString()` 方法来更改此键：

```php
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

Tabs::make('标签页')
    ->tabs([
        Tab::make('标签页 1')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 2')
            ->schema([
                // ...
            ]),
        Tab::make('标签页 3')
            ->schema([
                // ...
            ]),
    ])
    ->persistTabInQueryString('settings-tab')
```

:::tip
除了允许静态值外，`persistTabInQueryString()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

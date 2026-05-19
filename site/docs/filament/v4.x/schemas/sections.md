---
title: 区块
---

## 简介

你可能想要将字段分成多个区块，每个区块都有标题和描述。为此，你可以使用区块组件：

```php
use Filament\Schemas\Components\Section;

Section::make('速率限制')
    ->description('通过限制每个时间段的请求数量来防止滥用')
    ->schema([
        // ...
    ])
```

:::tip
除了允许静态值外，`make()` 和 `description()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。
:::

![区块](/assets/filament/v4.x/screenshots/images/light/schemas/layout/section/simple.jpg)

你也可以使用没有标题的区块，它只是将组件包装在一个简单的卡片中：

```php
use Filament\Schemas\Components\Section;

Section::make()
    ->schema([
        // ...
    ])
```

![没有标题的区块](/assets/filament/v4.x/screenshots/images/light/schemas/layout/section/without-header.jpg)

## 向区块标题添加图标

你可以使用 `icon()` 方法向区块标题添加[图标](../styling/icons)：

```php
use Filament\Schemas\Components\Section;
use Filament\Support\Icons\Heroicon;

Section::make('购物车')
    ->description('你已选择购买的商品')
    ->icon(Heroicon::ShoppingBag)
    ->schema([
        // ...
    ])
```

:::tip
除了允许静态值外，`icon()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有图标的区块](/assets/filament/v4.x/screenshots/images/light/schemas/layout/section/icons.jpg)

## 将标题和描述放在侧面

你可以使用 `aside()` 将标题和描述对齐到左侧，组件放在右侧的卡片中：

```php
use Filament\Schemas\Components\Section;

Section::make('速率限制')
    ->description('通过限制每个时间段的请求数量来防止滥用')
    ->aside()
    ->schema([
        // ...
    ])
```

![标题和描述在侧面的区块](/assets/filament/v4.x/screenshots/images/light/schemas/layout/section/aside.jpg)

可选地，你可以传递一个布尔值来控制区块是否应该在侧面：

```php
use Filament\Schemas\Components\Section;

Section::make('速率限制')
    ->description('通过限制每个时间段的请求数量来防止滥用')
    ->aside(FeatureFlag::active())
    ->schema([
        // ...
    ])
```

:::tip
除了允许静态值外，`aside()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 折叠区块

区块可以是 `collapsible()` 的，以可选地隐藏长内容：

```php
use Filament\Schemas\Components\Section;

Section::make('购物车')
    ->description('你已选择购买的商品')
    ->schema([
        // ...
    ])
    ->collapsible()
```

你的区块可以默认是 `collapsed()` 的：

```php
use Filament\Schemas\Components\Section;

Section::make('购物车')
    ->description('你已选择购买的商品')
    ->schema([
        // ...
    ])
    ->collapsed()
```

![折叠的区块](/assets/filament/v4.x/screenshots/images/light/schemas/layout/section/collapsed.jpg)

可选地，`collapsible()` 和 `collapsed()` 方法接受一个布尔值来控制区块是否应该是可折叠的和折叠的：

```php
use Filament\Schemas\Components\Section;

Section::make('购物车')
    ->description('你已选择购买的商品')
    ->schema([
        // ...
    ])
    ->collapsible(FeatureFlag::active())
    ->collapsed(FeatureFlag::active())
```

:::tip
除了允许静态值外，`collapsible()` 和 `collapsed()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。
:::

### 在用户会话中持久化折叠的区块

你可以使用 `persistCollapsed()` 方法在本地存储中持久化区块是否折叠，这样当用户刷新页面时它将保持折叠状态：

```php
use Filament\Schemas\Components\Section;

Section::make('购物车')
    ->description('你已选择购买的商品')
    ->schema([
        // ...
    ])
    ->collapsible()
    ->persistCollapsed()
```

要持久化折叠状态，本地存储需要一个唯一的 ID 来存储状态。此 ID 是基于区块的标题生成的。如果你的区块没有标题，或者你有多个具有相同标题的区块，你不想让它们一起折叠，你可以手动指定该区块的 `id()` 以防止 ID 冲突：

```php
use Filament\Schemas\Components\Section;

Section::make('购物车')
    ->description('你已选择购买的商品')
    ->schema([
        // ...
    ])
    ->collapsible()
    ->persistCollapsed()
    ->id('order-cart')
```

可选地，`persistCollapsed()` 方法接受一个布尔值来控制区块是否应该持久化其折叠状态：

```php
use Filament\Schemas\Components\Section;

Section::make('购物车')
    ->description('你已选择购买的商品')
    ->schema([
        // ...
    ])
    ->collapsible()
    ->persistCollapsed(FeatureFlag::active())
```

:::tip
除了允许静态值外，`persistCollapsed()` 和 `id()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。
:::

## 紧凑区块样式

嵌套区块时，你可以使用更紧凑的样式：

```php
use Filament\Schemas\Components\Section;

Section::make('速率限制')
    ->description('通过限制每个时间段的请求数量来防止滥用')
    ->schema([
        // ...
    ])
    ->compact()
```

![紧凑区块](/assets/filament/v4.x/screenshots/images/light/schemas/layout/section/compact.jpg)

可选地，`compact()` 方法接受一个布尔值来控制区块是否应该是紧凑的：

```php
use Filament\Schemas\Components\Section;

Section::make('速率限制')
    ->description('通过限制每个时间段的请求数量来防止滥用')
    ->schema([
        // ...
    ])
    ->compact(FeatureFlag::active())
```

:::tip
除了允许静态值外，`compact()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 次要区块样式

默认情况下，区块具有对比色背景，使它们在灰色背景上突出。次要样式给区块一个对比度较低的背景，因此通常稍微暗一些。当区块后面的背景颜色与默认区块背景颜色相同时，这是一个更好的样式，例如当区块嵌套在另一个区块内时。可以使用 `secondary()` 方法创建次要区块：

```php
use Filament\Schemas\Components\Section;

Section::make('备注')
    ->schema([
        // ...
    ])
    ->secondary()
    ->compact()
```

![次要区块](/assets/filament/v4.x/screenshots/images/light/schemas/layout/section/secondary.jpg)

可选地，`secondary()` 方法接受一个布尔值来控制区块是否应该是次要的：

```php
use Filament\Schemas\Components\Section;

Section::make('备注')
    ->schema([
        // ...
    ])
    ->secondary(FeatureFlag::active())
```

## 在区块标题中插入操作和其他组件

你可以通过将组件数组传递给 `afterHeader()` 方法，在区块标题中插入[操作](../actions)和任何其他 schema 组件（通常是[基础组件](primes)）：

```php
use Filament\Schemas\Components\Section;

Section::make('速率限制')
    ->description('通过限制每个时间段的请求数量来防止滥用')
    ->afterHeader([
        Action::make('test'),
    ])
    ->schema([
        // ...
    ])
```

:::tip
除了允许静态值外，`afterHeader()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![标题中带有操作的区块](/assets/filament/v4.x/screenshots/images/light/schemas/layout/section/header/actions.jpg)

## 在区块页脚中插入操作和其他组件

你可以通过将组件数组传递给 `footer()` 方法，在区块页脚中插入[操作](../actions)和任何其他 schema 组件（通常是[基础组件](primes)）：

```php
use Filament\Schemas\Components\Section;

Section::make('速率限制')
    ->description('通过限制每个时间段的请求数量来防止滥用')
    ->schema([
        // ...
    ])
    ->footer([
        Action::make('test'),
    ])
```

:::tip
除了允许静态值外，`footer()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![页脚中带有操作的区块](/assets/filament/v4.x/screenshots/images/light/schemas/layout/section/footer/actions.jpg)

## 在区块中使用网格列

你可以使用 `columns()` 方法轻松在区块内创建[网格](layouts#网格系统)：

```php
use Filament\Schemas\Components\Section;

Section::make('标题')
    ->schema([
        // ...
    ])
    ->columns(2)
```

![带有网格列的区块](/assets/filament/v4.x/screenshots/images/light/schemas/layout/section/columns.jpg)

:::tip
除了允许静态值外，`columns()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

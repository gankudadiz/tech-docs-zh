---
title: 操作分组
---
## 简介

你可以使用 `ActionGroup` 对象将多个操作组合到一个下拉菜单中。组可以包含多个操作，也可以包含其他组：

```php
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;

ActionGroup::make([
    Action::make('view'),
    Action::make('edit'),
    Action::make('delete'),
])
```

![操作组](/assets/filament/v4.x/screenshots/images/light/actions/group/simple.jpg)

本页面介绍如何自定义组的触发按钮和下拉菜单的外观。

## 自定义组触发按钮样式

打开下拉菜单的按钮可以像普通操作一样进行自定义。[所有可用于触发按钮的方法](overview)都可以用来自定义组触发按钮：

```php
use Filament\Actions\ActionGroup;
use Filament\Support\Enums\Size;

ActionGroup::make([
    // 操作数组
])
    ->label('More actions')
    ->icon('heroicon-m-ellipsis-vertical')
    ->size(Size::Small)
    ->color('primary')
    ->button()
```

![带自定义触发按钮样式的操作组](/assets/filament/v4.x/screenshots/images/light/actions/group/customized.jpg)

![带按钮操作组的表格](/assets/filament/v4.x/screenshots/images/light/tables/actions/group-button.jpg)

### 为组触发按钮添加工具提示

你可以使用 `tooltip()` 方法为组触发按钮添加工具提示：

```php
use Filament\Actions\ActionGroup;

ActionGroup::make([
    // 操作数组
])
    ->tooltip('Actions')
```

![带操作组工具提示的表格](/assets/filament/v4.x/screenshots/images/light/tables/actions/group-tooltip.jpg)

### 使用按钮组设计

操作组可以不使用下拉菜单，而是渲染为一组按钮。这种设计支持有无按钮标签。要使用此功能，请使用 `buttonGroup()` 方法：

```php
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Support\Icons\Heroicon;

ActionGroup::make([
    Action::make('edit')
        ->color('gray')
        ->icon(Heroicon::PencilSquare)
        ->hiddenLabel(),
    Action::make('delete')
        ->color('gray')
        ->icon(Heroicon::Trash)
        ->hiddenLabel(),
])
    ->buttonGroup()
```

![使用按钮组设计的操作组](/assets/filament/v4.x/screenshots/images/light/actions/group/button-group.jpg)

## 设置下拉菜单的位置

可以使用 `dropdownPlacement()` 方法将下拉菜单定位到触发按钮的相对位置：

```php
use Filament\Actions\ActionGroup;

ActionGroup::make([
    // 操作数组
])
    ->dropdownPlacement('top-start')
```

`dropdownPlacement()` 方法还接受一个函数来动态计算值。你可以向该函数注入各种工具作为参数。

![顶部放置样式的操作组](/assets/filament/v4.x/screenshots/images/light/actions/group/placement.jpg)

或者，你可以使用 `dropdownAutoPlacement()` 方法让下拉菜单根据可用空间自动确定位置：

```php
use Filament\Actions\ActionGroup;

ActionGroup::make([
    // 操作数组
])
    ->dropdownAutoPlacement()
```

## 在操作之间添加分隔线

你可以使用嵌套的 `ActionGroup` 对象在操作组之间添加分隔线：

```php
use Filament\Actions\ActionGroup;

ActionGroup::make([
    ActionGroup::make([
        // 操作数组
    ])->dropdown(false),
    // 操作数组
])
```

`dropdown(false)` 方法会将操作放入父级下拉菜单中，而不是创建一个新的嵌套下拉菜单。

`dropdown()` 方法还接受一个函数来动态计算值。你可以向该函数注入各种工具作为参数。

![带分隔线的嵌套操作组](/assets/filament/v4.x/screenshots/images/light/actions/group/nested.jpg)

## 设置下拉菜单的宽度

可以使用 `dropdownWidth()` 方法设置下拉菜单的宽度。选项对应于 [Tailwind 的 max-width 比例](https://tailwindcss.com/docs/max-width)。选项包括 `ExtraSmall`、`Small`、`Medium`、`Large`、`ExtraLarge`、`TwoExtraLarge`、`ThreeExtraLarge`、`FourExtraLarge`、`FiveExtraLarge`、`SixExtraLarge` 和 `SevenExtraLarge`：

```php
use Filament\Actions\ActionGroup;
use Filament\Support\Enums\Width;

ActionGroup::make([
    // 操作数组
])
    ->dropdownWidth(Width::ExtraSmall)
```

![带自定义下拉菜单宽度的操作组](/assets/filament/v4.x/screenshots/images/light/actions/group/dropdown-width.jpg)

`dropdownWidth()` 方法还接受一个函数来动态计算值。你可以向该函数注入各种工具作为参数。

## 控制下拉菜单的偏移量

你可以使用 `dropdownOffset()` 方法控制下拉菜单的偏移量，默认偏移量为 `8`。

```php
use Filament\Actions\ActionGroup;

ActionGroup::make([
    // 操作数组
])
    ->dropdownOffset(16)
```

`dropdownOffset()` 方法还接受一个函数来动态计算值。你可以向该函数注入各种工具作为参数。

## 控制下拉菜单的最大高度

可以使用 `maxHeight()` 方法为下拉菜单内容设置最大高度，使其可以滚动。你可以传递一个 [CSS 长度值](https://developer.mozilla.org/en-US/docs/Web/CSS/length)：

```php
use Filament\Actions\ActionGroup;

ActionGroup::make([
    // 操作数组
])
    ->maxHeight('400px')
```

`maxHeight()` 方法还接受一个函数来动态计算值。你可以向该函数注入各种工具作为参数。

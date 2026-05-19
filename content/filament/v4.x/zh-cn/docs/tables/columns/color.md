---
title: 颜色列
---

## 简介

颜色列允许你从 CSS 颜色定义中显示颜色预览，通常使用[颜色选择器字段](../../forms/color-picker)输入，支持的格式包括 HEX、HSL、RGB、RGBA。

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
```

![颜色列](/assets/filament/v4.x/screenshots/images/light/tables/columns/color/simple.jpg)

## 允许颜色复制到剪贴板

你可以使颜色可复制，这样点击预览就会将 CSS 值复制到剪贴板，并可选择指定自定义确认消息和持续时间（毫秒）。此功能仅在应用启用 SSL 时有效。

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
    ->copyable()
    ->copyMessage('Copied!')
    ->copyMessageDuration(1500)
```

![带复制按钮的颜色列](/assets/filament/v4.x/screenshots/images/light/tables/columns/color/copyable.jpg)

你可以选择传递一个布尔值来控制文本是否应可复制：

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
    ->copyable(FeatureFlag::active())
```

除固定值外，`copyable()`、`copyMessage()` 和 `copyMessageDuration()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 换行多个颜色块

如果颜色块无法放在一行上，可以使用 `wrap()` 设置换行：

```php
use Filament\Tables\Columns\ColorColumn;

ColorColumn::make('color')
    ->wrap()
```

![换行的颜色列](/assets/filament/v4.x/screenshots/images/light/tables/columns/color/wrap.jpg)

:::tip
换行的"宽度"受列标签影响，因此你可能需要使用更短或隐藏的标签来更紧密地换行。
:::

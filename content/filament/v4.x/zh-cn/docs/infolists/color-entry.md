---
title: 颜色条目
---

## 简介

颜色条目允许你从 CSS 颜色定义中显示颜色预览，通常使用[颜色选择器字段](../forms/color-picker)输入，支持的格式包括 HEX、HSL、RGB、RGBA。

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('color')
```

![颜色条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/color/simple.jpg)

## 允许颜色复制到剪贴板

你可以使颜色可复制，这样点击预览就会将 CSS 值复制到剪贴板，并且可以选择指定自定义确认消息和持续时间（毫秒）。此功能仅在应用程序启用 SSL 时有效。

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('color')
    ->copyable()
    ->copyMessage('Copied!')
    ->copyMessageDuration(1500)
```

![带有复制按钮的颜色条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/color/copyable.jpg)

你可以选择传递一个布尔值来控制颜色是否应该可复制：

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('color')
    ->copyable(FeatureFlag::active())
```

除了允许静态值外，`copyable()`、`copyMessage()` 和 `copyMessageDuration()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。

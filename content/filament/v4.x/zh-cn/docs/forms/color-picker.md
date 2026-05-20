---
title: 颜色选择器
---

## 简介

颜色选择器组件允许你以多种格式选择颜色。

默认情况下，组件使用 HEX 格式：

```php
use Filament\Forms\Components\ColorPicker;

ColorPicker::make('color')
```

![颜色选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/color-picker/simple.jpg)

点击色块会打开颜色选择面板，用户可以在其中直观地选择颜色：

![打开面板的颜色选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/color-picker/panel.jpg)

## 设置颜色格式

虽然默认使用 HEX 格式，但你可以选择使用哪种颜色格式：

```php
use Filament\Forms\Components\ColorPicker;

ColorPicker::make('hsl_color')
    ->hsl()

ColorPicker::make('rgb_color')
    ->rgb()

ColorPicker::make('rgba_color')
    ->rgba()
```

![不同格式选项的颜色选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/color-picker/formats.jpg)

## 颜色选择器验证

你可以使用 Laravel 的验证规则来验证颜色选择器的值：

```php
use Filament\Forms\Components\ColorPicker;

ColorPicker::make('hex_color')
    ->regex('/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\b$/')

ColorPicker::make('hsl_color')
    ->hsl()
    ->regex('/^hsl\(\s*(\d+)\s*,\s*(\d*(?:\.\d+)?%)\s*,\s*(\d*(?:\.\d+)?%)\)$/')

ColorPicker::make('rgb_color')
    ->rgb()
    ->regex('/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/')

ColorPicker::make('rgba_color')
    ->rgba()
    ->regex('/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/')
```

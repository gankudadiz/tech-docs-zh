---
title: Color entry
---

## Introduction

The color entry allows you to show the color preview from a CSS color definition, typically entered using the [color picker field](../forms/color-picker), in one of the supported formats (HEX, HSL, RGB, RGBA).

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('color')
```

![Color entry](/assets/filament/v4.x/screenshots/images/light/infolists/entries/color/simple.jpg)

## Allowing the color to be copied to the clipboard

You may make the color copyable, such that clicking on the preview copies the CSS value to the clipboard, and optionally specify a custom confirmation message and duration in milliseconds. This feature only works when SSL is enabled for the app.

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('color')
    ->copyable()
    ->copyMessage('Copied!')
    ->copyMessageDuration(1500)
```

![Color entry with a button to copy it](/assets/filament/v4.x/screenshots/images/light/infolists/entries/color/copyable.jpg)

Optionally, you may pass a boolean value to control if the color should be copyable or not:

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('color')
    ->copyable(FeatureFlag::active())
```

As well as allowing static values, the `copyable()`, `copyMessage()`, and `copyMessageDuration()` methods also accept functions to dynamically calculate them. You can inject various utilities into the function as parameters.

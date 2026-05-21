---
title: Icon entry
---

## Introduction

Icon entries render an [icon](../styling/icons) representing the state of the entry:

```php
use Filament\Infolists\Components\IconEntry;
use Filament\Support\Icons\Heroicon;

IconEntry::make('status')
    ->icon(fn (string $state): Heroicon => match ($state) {
        'draft' => Heroicon::OutlinedPencil,
        'reviewing' => Heroicon::OutlinedClock,
        'published' => Heroicon::OutlinedCheckCircle,
    })
```

The `icon()` method can inject various utilities into the function as parameters.

![Icon entry](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/simple.jpg)

## Customizing the color

You may change the [color](../styling/colors) of the icon, using the `color()` method:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('status')
    ->color('success')
```

By passing a function to `color()`, you can customize the color based on the state of the entry:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('status')
    ->color(fn (string $state): string => match ($state) {
        'draft' => 'info',
        'reviewing' => 'warning',
        'published' => 'success',
        default => 'gray',
    })
```

The `color()` method can inject various utilities into the function as parameters.

![Icon entry with color](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/color.jpg)

## Customizing the size

The default icon size is `IconSize::Large`, but you may customize the size to be either `IconSize::ExtraSmall`, `IconSize::Small`, `IconSize::Medium`, `IconSize::ExtraLarge` or `IconSize::TwoExtraLarge`:

```php
use Filament\Infolists\Components\IconEntry;
use Filament\Support\Enums\IconSize;

IconEntry::make('status')
    ->size(IconSize::Medium)
```

As well as allowing a static value, the `size()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

![Medium-sized icon entry](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/medium.jpg)

## Handling booleans

Icon entries can display a check or "X" icon based on the state of the entry, either true or false, using the `boolean()` method:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_featured')
    ->boolean()
```

> If this attribute in the model class is already cast as a `bool` or `boolean`, Filament is able to detect this, and you do not need to use `boolean()` manually.

![Icon entry to display a boolean](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/boolean.jpg)

Optionally, you may pass a boolean value to control if the icon should be boolean or not:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_featured')
    ->boolean(FeatureFlag::active())
```

As well as allowing a static value, the `boolean()` method also accepts a function to dynamically calculate it. You can inject various utilities into the function as parameters.

### Customizing the boolean icons

You may customize the [icon](../styling/icons) representing each state:

```php
use Filament\Infolists\Components\IconEntry;
use Filament\Support\Icons\Heroicon;

IconEntry::make('is_featured')
    ->boolean()
    ->trueIcon(Heroicon::OutlinedCheckBadge)
    ->falseIcon(Heroicon::OutlinedXMark)
```

As well as allowing static values, the `trueIcon()` and `falseIcon()` methods also accept functions to dynamically calculate them. You can inject various utilities into the functions as parameters.

![Icon entry to display a boolean with custom icons](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/boolean-icon.jpg)

### Customizing the boolean colors

You may customize the icon [color](../styling/colors) representing each state:

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_featured')
    ->boolean()
    ->trueColor('info')
    ->falseColor('warning')
```

As well as allowing static values, the `trueColor()` and `falseColor()` methods also accept functions to dynamically calculate them. You can inject various utilities into the functions as parameters.

![Icon entry to display a boolean with custom colors](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/boolean-color.jpg)

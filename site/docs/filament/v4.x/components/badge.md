---
title: Badge Blade 组件
---

## 简介

Badge 组件用于渲染一个包含文本的小方框：

```blade
<x-filament::badge>
    New
</x-filament::badge>
```

![一个简单的徽章](/assets/filament/v4.x/screenshots/images/light/components/badge/simple.jpg)

## 设置徽章的大小

默认情况下，徽章的大小为"中等"。你可以使用 `size` 属性将其设置为"超小"或"小"：

```blade
<x-filament::badge size="xs">
    New
</x-filament::badge>

<x-filament::badge size="sm">
    New
</x-filament::badge>
```

![不同大小的徽章](/assets/filament/v4.x/screenshots/images/light/components/badge/sizes.jpg)

## 更改徽章的颜色

默认情况下，徽章的颜色为"primary"。你可以使用 `color` 属性将其更改为 `danger`、`gray`、`info`、`success` 或 `warning`：

```blade
<x-filament::badge color="danger">
    New
</x-filament::badge>

<x-filament::badge color="gray">
    New
</x-filament::badge>

<x-filament::badge color="info">
    New
</x-filament::badge>

<x-filament::badge color="success">
    New
</x-filament::badge>

<x-filament::badge color="warning">
    New
</x-filament::badge>
```

![不同颜色的徽章](/assets/filament/v4.x/screenshots/images/light/components/badge/colors.jpg)

## 为徽章添加图标

你可以使用 `icon` 属性为徽章添加[图标](../styling/icons)：

```blade
<x-filament::badge icon="heroicon-m-sparkles">
    New
</x-filament::badge>
```

你还可以使用 `icon-position` 属性将图标的位置更改为文本之后而非之前：

```blade
<x-filament::badge
    icon="heroicon-m-sparkles"
    icon-position="after"
>
    New
</x-filament::badge>
```

![带图标的徽章](/assets/filament/v4.x/screenshots/images/light/components/badge/icon.jpg)

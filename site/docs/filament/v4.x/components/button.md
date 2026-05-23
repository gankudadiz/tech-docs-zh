---
title: Button Blade 组件
---

## 简介

Button 组件用于渲染一个可点击的按钮，用于执行操作：

```blade
<x-filament::button wire:click="openNewUserModal">
    New user
</x-filament::button>
```

![一个简单的按钮](/assets/filament/v4.x/screenshots/images/light/components/button/simple.jpg)

## 将按钮用作锚链接

默认情况下，按钮的底层 HTML 标签是 `<button>`。你可以使用 `tag` 属性将其更改为 `<a>` 标签：

```blade
<x-filament::button
    href="https://filamentphp.com"
    tag="a"
>
    Filament
</x-filament::button>
```

## 设置按钮的大小

默认情况下，按钮的大小为"中等"。你可以使用 `size` 属性将其设置为"超小"、"小"、"大"或"超大"：

```blade
<x-filament::button size="xs">
    New user
</x-filament::button>

<x-filament::button size="sm">
    New user
</x-filament::button>

<x-filament::button size="lg">
    New user
</x-filament::button>

<x-filament::button size="xl">
    New user
</x-filament::button>
```

![不同大小的按钮](/assets/filament/v4.x/screenshots/images/light/components/button/sizes.jpg)

## 更改按钮的颜色

默认情况下，按钮的颜色为"primary"。你可以使用 `color` 属性将其更改为 `danger`、`gray`、`info`、`success` 或 `warning`：

```blade
<x-filament::button color="danger">
    New user
</x-filament::button>

<x-filament::button color="gray">
    New user
</x-filament::button>

<x-filament::button color="info">
    New user
</x-filament::button>

<x-filament::button color="success">
    New user
</x-filament::button>

<x-filament::button color="warning">
    New user
</x-filament::button>
```

![不同颜色的按钮](/assets/filament/v4.x/screenshots/images/light/components/button/colors.jpg)

## 为按钮添加图标

你可以使用 `icon` 属性为按钮添加[图标](../styling/icons)：

```blade
<x-filament::button icon="heroicon-m-sparkles">
    New user
</x-filament::button>
```

你还可以使用 `icon-position` 属性将图标的位置更改为文本之后而非之前：

```blade
<x-filament::button
    icon="heroicon-m-sparkles"
    icon-position="after"
>
    New user
</x-filament::button>
```

![带图标的按钮](/assets/filament/v4.x/screenshots/images/light/components/button/icon.jpg)

## 将按钮设置为轮廓样式

你可以使用 `outlined` 属性将按钮设置为"轮廓"样式：

```blade
<x-filament::button outlined>
    New user
</x-filament::button>
```

![轮廓按钮](/assets/filament/v4.x/screenshots/images/light/components/button/outlined.jpg)

你可以将 `outlined` 属性与任何[颜色](#更改按钮的颜色)组合使用：

![不同颜色的轮廓按钮](/assets/filament/v4.x/screenshots/images/light/components/button/outlined-colors.jpg)

## 为按钮添加工具提示

你可以使用 `tooltip` 属性为按钮添加工具提示：

```blade
<x-filament::button tooltip="Register a user">
    New user
</x-filament::button>
```

## 为按钮添加徽章

你可以使用 `badge` 插槽在按钮上方渲染一个[徽章](badge)：

```blade
<x-filament::button>
    Mark notifications as read

    <x-slot name="badge">
        3
    </x-slot>
</x-filament::button>
```

你可以使用 `badge-color` 属性[更改徽章的颜色](badge#更改徽章的颜色)：

```blade
<x-filament::button badge-color="danger">
    Mark notifications as read

    <x-slot name="badge">
        3
    </x-slot>
</x-filament::button>
```

![带徽章的按钮](/assets/filament/v4.x/screenshots/images/light/components/button/badge.jpg)

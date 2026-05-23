---
title: Link Blade 组件
---

## 简介

Link 组件用于渲染一个可点击的链接，可以执行某个操作：

```blade
<x-filament::link :href="route('users.create')">
    New user
</x-filament::link>
```

![一个简单的链接](/assets/filament/v4.x/screenshots/images/light/components/link/simple.jpg)

## 将链接用作按钮

默认情况下，Link 的底层 HTML 标签是 `<a>`。你可以通过 `tag` 属性将其更改为 `<button>` 标签：

```blade
<x-filament::link
    wire:click="openNewUserModal"
    tag="button"
>
    New user
</x-filament::link>
```

## 设置链接的大小

默认情况下，Link 的大小为 "medium"。你可以通过 `size` 属性将其设置为 "small"、"large"、"extra large" 或 "extra extra large"：

```blade
<x-filament::link size="sm">
    New user
</x-filament::link>

<x-filament::link size="lg">
    New user
</x-filament::link>

<x-filament::link size="xl">
    New user
</x-filament::link>

<x-filament::link size="2xl">
    New user
</x-filament::link>
```

![不同大小的链接](/assets/filament/v4.x/screenshots/images/light/components/link/sizes.jpg)

## 设置链接的字体粗细

默认情况下，链接的字体粗细为 `semibold`。你可以通过 `weight` 属性将其设置为 `thin`、`extralight`、`light`、`normal`、`medium`、`bold`、`extrabold` 或 `black`：

```blade
<x-filament::link weight="thin">
    New user
</x-filament::link>

<x-filament::link weight="extralight">
    New user
</x-filament::link>

<x-filament::link weight="light">
    New user
</x-filament::link>

<x-filament::link weight="normal">
    New user
</x-filament::link>

<x-filament::link weight="medium">
    New user
</x-filament::link>

<x-filament::link weight="semibold">
    New user
</x-filament::link>

<x-filament::link weight="bold">
    New user
</x-filament::link>

<x-filament::link weight="black">
    New user
</x-filament::link>
```

或者，你也可以传入自定义 CSS 类来定义字体粗细：

```blade
<x-filament::link weight="md:font-[650]">
    New user
</x-filament::link>
```

![不同字体粗细的链接](/assets/filament/v4.x/screenshots/images/light/components/link/weights.jpg)

## 更改链接的颜色

默认情况下，Link 的颜色为 "primary"。你可以通过 `color` 属性将其更改为 `danger`、`gray`、`info`、`success` 或 `warning`：

```blade
<x-filament::link color="danger">
    New user
</x-filament::link>

<x-filament::link color="gray">
    New user
</x-filament::link>

<x-filament::link color="info">
    New user
</x-filament::link>

<x-filament::link color="success">
    New user
</x-filament::link>

<x-filament::link color="warning">
    New user
</x-filament::link>
```

![不同颜色的链接](/assets/filament/v4.x/screenshots/images/light/components/link/colors.jpg)

## 为链接添加图标

你可以使用 `icon` 属性为链接添加[图标](../styling/icons)：

```blade
<x-filament::link icon="heroicon-m-sparkles">
    New user
</x-filament::link>
```

你也可以使用 `icon-position` 属性将图标的位置从文本前方更改为文本后方：

```blade
<x-filament::link
    icon="heroicon-m-sparkles"
    icon-position="after"
>
    New user
</x-filament::link>
```

![带有图标的链接](/assets/filament/v4.x/screenshots/images/light/components/link/icon.jpg)

## 为链接添加工具提示

你可以通过 `tooltip` 属性为链接添加工具提示：

```blade
<x-filament::link tooltip="Register a user">
    New user
</x-filament::link>
```

## 为链接添加徽章

你可以使用 `badge` 插槽在链接上方渲染一个[徽章](badge)：

```blade
<x-filament::link>
    Mark notifications as read

    <x-slot name="badge">
        3
    </x-slot>
</x-filament::link>
```

你可以使用 `badge-color` 属性[更改徽章颜色](badge#changing-the-color-of-the-badge)：

```blade
<x-filament::link badge-color="danger">
    Mark notifications as read

    <x-slot name="badge">
        3
    </x-slot>
</x-filament::link>
```

![带有徽章的链接](/assets/filament/v4.x/screenshots/images/light/components/link/badge.jpg)

---
title: Icon Button Blade 组件
---

## 简介

Icon Button 组件用于渲染一个可点击的按钮，可以执行某个操作：

```blade
<x-filament::icon-button
    icon="heroicon-m-plus"
    wire:click="openNewUserModal"
    label="New label"
/>
```

![不同大小的 Icon Button](/assets/filament/v4.x/screenshots/images/light/components/icon-button/simple.jpg)

## 将 Icon Button 用作锚链接

默认情况下，Icon Button 的底层 HTML 标签是 `<button>`。你可以通过 `tag` 属性将其更改为 `<a>` 标签：

```blade
<x-filament::icon-button
    icon="heroicon-m-arrow-top-right-on-square"
    href="https://filamentphp.com"
    tag="a"
    label="Filament"
/>
```

## 设置 Icon Button 的大小

默认情况下，Icon Button 的大小为 "medium"。你可以通过 `size` 属性将其设置为 "extra small"、"small"、"large" 或 "extra large"：

```blade
<x-filament::icon-button
    icon="heroicon-m-plus"
    size="xs"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-m-plus"
    size="sm"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-s-plus"
    size="lg"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-s-plus"
    size="xl"
    label="New label"
/>
```

![不同大小的 Icon Button](/assets/filament/v4.x/screenshots/images/light/components/icon-button/sizes.jpg)

## 更改 Icon Button 的颜色

默认情况下，Icon Button 的颜色为 "primary"。你可以通过 `color` 属性将其更改为 `danger`、`gray`、`info`、`success` 或 `warning`：

```blade
<x-filament::icon-button
    icon="heroicon-m-plus"
    color="danger"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-m-plus"
    color="gray"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-m-plus"
    color="info"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-m-plus"
    color="success"
    label="New label"
/>

<x-filament::icon-button
    icon="heroicon-m-plus"
    color="warning"
    label="New label"
/>
```

![不同颜色的 Icon Button](/assets/filament/v4.x/screenshots/images/light/components/icon-button/colors.jpg)

## 为 Icon Button 添加工具提示

你可以通过 `tooltip` 属性为 Icon Button 添加工具提示：

```blade
<x-filament::icon-button
    icon="heroicon-m-plus"
    tooltip="Register a user"
    label="New label"
/>
```

## 为 Icon Button 添加徽章

你可以使用 `badge` 插槽在 Icon Button 上方渲染一个[徽章](badge)：

```blade
<x-filament::icon-button
    icon="heroicon-m-x-mark"
    label="Mark notifications as read"
>
    <x-slot name="badge">
        3
    </x-slot>
</x-filament::icon-button>
```

你可以使用 `badge-color` 属性[更改徽章颜色](badge#更改徽章的颜色)：

```blade
<x-filament::icon-button
    icon="heroicon-m-x-mark"
    label="Mark notifications as read"
    badge-color="danger"
>
    <x-slot name="badge">
        3
    </x-slot>
</x-filament::icon-button>
```

![带有徽章的 Icon Button](/assets/filament/v4.x/screenshots/images/light/components/icon-button/badge.jpg)

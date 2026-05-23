---
title: Dropdown Blade 组件
---

## 简介

Dropdown 组件允许你渲染一个下拉菜单及其触发按钮：

```blade
<x-filament::dropdown>
    <x-slot name="trigger">
        <x-filament::button>
            More actions
        </x-filament::button>
    </x-slot>

    <x-filament::dropdown.list>
        <x-filament::dropdown.list.item wire:click="openViewModal">
            View
        </x-filament::dropdown.list.item>

        <x-filament::dropdown.list.item wire:click="openEditModal">
            Edit
        </x-filament::dropdown.list.item>

        <x-filament::dropdown.list.item wire:click="openDeleteModal">
            Delete
        </x-filament::dropdown.list.item>
    </x-filament::dropdown.list>
</x-filament::dropdown>
```

![一个包含操作项的下拉菜单](/assets/filament/v4.x/screenshots/images/light/components/dropdown/simple.jpg)

## 将下拉菜单项用作锚链接

默认情况下，下拉菜单项的底层 HTML 标签是 `<button>`。你可以使用 `tag` 属性将其更改为 `<a>` 标签：

```blade
<x-filament::dropdown.list.item
    href="https://filamentphp.com"
    tag="a"
>
    Filament
</x-filament::dropdown.list.item>
```

## 更改下拉菜单项的颜色

默认情况下，下拉菜单项的颜色为"gray"。你可以使用 `color` 属性将其更改为 `danger`、`info`、`primary`、`success` 或 `warning`：

```blade
<x-filament::dropdown.list.item color="danger">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item color="info">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item color="primary">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item color="success">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item color="warning">
    Edit
</x-filament::dropdown.list.item>
```

![不同颜色的下拉菜单项](/assets/filament/v4.x/screenshots/images/light/components/dropdown/colors.jpg)

## 为下拉菜单项添加图标

你可以使用 `icon` 属性为下拉菜单项添加[图标](../styling/icons)：

```blade
<x-filament::dropdown.list.item icon="heroicon-m-pencil">
    Edit
</x-filament::dropdown.list.item>
```

![带图标的下拉菜单项](/assets/filament/v4.x/screenshots/images/light/components/dropdown/icons.jpg)

### 更改下拉菜单项的图标颜色

默认情况下，图标颜色使用[与菜单项本身相同的颜色](#更改下拉菜单项的颜色)。你可以使用 `icon-color` 属性覆盖它，设置为 `danger`、`info`、`primary`、`success` 或 `warning`：

```blade
<x-filament::dropdown.list.item icon="heroicon-m-pencil" icon-color="danger">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item icon="heroicon-m-pencil" icon-color="info">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item icon="heroicon-m-pencil" icon-color="primary">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item icon="heroicon-m-pencil" icon-color="success">
    Edit
</x-filament::dropdown.list.item>

<x-filament::dropdown.list.item icon="heroicon-m-pencil" icon-color="warning">
    Edit
</x-filament::dropdown.list.item>
```

![不同图标颜色的下拉菜单项](/assets/filament/v4.x/screenshots/images/light/components/dropdown/icon-colors.jpg)

## 为下拉菜单项添加图片

你可以使用 `image` 属性为下拉菜单项添加圆形图片：

```blade
<x-filament::dropdown.list.item image="https://filamentphp.com/dan.jpg">
    Dan Harrin
</x-filament::dropdown.list.item>
```

![带图片的下拉菜单项](/assets/filament/v4.x/screenshots/images/light/components/dropdown/image.jpg)

## 为下拉菜单项添加徽章

你可以使用 `badge` 插槽在下拉菜单项上方渲染一个[徽章](badge)：

```blade
<x-filament::dropdown.list.item>
    Mark notifications as read

    <x-slot name="badge">
        3
    </x-slot>
</x-filament::dropdown.list.item>
```

你可以使用 `badge-color` 属性[更改徽章的颜色](badge#更改徽章的颜色)：

```blade
<x-filament::dropdown.list.item badge-color="danger">
    Mark notifications as read

    <x-slot name="badge">
        3
    </x-slot>
</x-filament::dropdown.list.item>
```

![带徽章的下拉菜单项](/assets/filament/v4.x/screenshots/images/light/components/dropdown/badge.jpg)

## 设置下拉菜单的位置

你可以使用 `placement` 属性将下拉菜单相对于触发按钮进行定位：

```blade
<x-filament::dropdown placement="top-start">
    {{-- Dropdown items --}}
</x-filament::dropdown>
```

## 设置下拉菜单的宽度

你可以使用 `width` 属性设置下拉菜单的宽度。选项对应于 [Tailwind 的最大宽度比例](https://tailwindcss.com/docs/max-width)。可选值为 `xs`、`sm`、`md`、`lg`、`xl`、`2xl`、`3xl`、`4xl`、`5xl`、`6xl` 和 `7xl`：

```blade
<x-filament::dropdown width="xs">
    {{-- Dropdown items --}}
</x-filament::dropdown>
```

![自定义宽度的下拉菜单](/assets/filament/v4.x/screenshots/images/light/components/dropdown/width.jpg)

## 控制下拉菜单的最大高度

你可以使用 `max-height` 属性为下拉菜单内容设置最大高度，使其可以滚动。你可以传入一个 [CSS 长度值](https://developer.mozilla.org/en-US/docs/Web/CSS/length)：

```blade
<x-filament::dropdown max-height="400px">
    {{-- Dropdown items --}}
</x-filament::dropdown>
```

![带最大高度的下拉菜单](/assets/filament/v4.x/screenshots/images/light/components/dropdown/max-height.jpg)

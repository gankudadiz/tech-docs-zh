---
title: Section Blade 组件
---

## 简介

Section 可用于将内容分组在一起，并提供可选的标题：

```blade
<x-filament::section>
    <x-slot name="heading">
        User details
    </x-slot>

    {{-- Content --}}
</x-filament::section>
```

![一个简单的 Section](/assets/filament/v4.x/screenshots/images/light/components/section/simple.jpg)

## 为 Section 添加描述

你可以使用 `description` 插槽在标题下方为 Section 添加描述：

```blade
<x-filament::section>
    <x-slot name="heading">
        User details
    </x-slot>

    <x-slot name="description">
        This is all the information we hold about the user.
    </x-slot>

    {{-- Content --}}
</x-filament::section>
```

![一个带有描述和图标的 Section](/assets/filament/v4.x/screenshots/images/light/components/section/description.jpg)

## 为 Section 头部添加图标

你可以使用 `icon` 属性为 Section 添加[图标](../styling/icons)：

```blade
<x-filament::section icon="heroicon-o-user">
    <x-slot name="heading">
        User details
    </x-slot>

    {{-- Content --}}
</x-filament::section>
```

![一个带有图标的 Section](/assets/filament/v4.x/screenshots/images/light/components/section/icon.jpg)

### 更改 Section 图标的颜色

默认情况下，Section 图标的颜色为 "gray"。你可以使用 `icon-color` 属性将其更改为 `danger`、`info`、`primary`、`success` 或 `warning`：

```blade
<x-filament::section
    icon="heroicon-o-user"
    icon-color="info"
>
    <x-slot name="heading">
        User details
    </x-slot>

    {{-- Content --}}
</x-filament::section>
```

![一个带有彩色图标的 Section](/assets/filament/v4.x/screenshots/images/light/components/section/icon-color.jpg)

### 更改 Section 图标的大小

默认情况下，Section 图标的大小为 "large"。你可以使用 `icon-size` 属性将其更改为 "small" 或 "medium"：

```blade
<x-filament::section
    icon="heroicon-m-user"
    icon-size="sm"
>
    <x-slot name="heading">
        User details
    </x-slot>

    {{-- Content --}}
</x-filament::section>

<x-filament::section
    icon="heroicon-m-user"
    icon-size="md"
>
    <x-slot name="heading">
        User details
    </x-slot>

    {{-- Content --}}
</x-filament::section>
```

![不同图标大小的 Section](/assets/filament/v4.x/screenshots/images/light/components/section/icon-sizes.jpg)

## 在头部末尾添加内容

你可以使用 `afterHeader` 插槽在头部末尾、标题和描述旁边渲染额外的内容：

```blade
<x-filament::section>
    <x-slot name="heading">
        User details
    </x-slot>

    <x-slot name="afterHeader">
        {{-- Input to select the user's ID --}}
    </x-slot>

    {{-- Content --}}
</x-filament::section>
```

![一个在头部之后有内容的 Section](/assets/filament/v4.x/screenshots/images/light/components/section/after-header.jpg)

## 使 Section 可折叠

你可以使用 `collapsible` 属性使 Section 的内容可折叠：

```blade
<x-filament::section collapsible>
    <x-slot name="heading">
        User details
    </x-slot>

    {{-- Content --}}
</x-filament::section>
```

![一个可折叠的 Section](/assets/filament/v4.x/screenshots/images/light/components/section/collapsible.jpg)

### 使 Section 默认折叠

你可以使用 `collapsed` 属性使 Section 默认折叠：

```blade
<x-filament::section
    collapsible
    collapsed
>
    <x-slot name="heading">
        User details
    </x-slot>

    {{-- Content --}}
</x-filament::section>
```

![一个默认折叠的 Section](/assets/filament/v4.x/screenshots/images/light/components/section/collapsed.jpg)

### 持久化折叠状态

你可以使用 `persist-collapsed` 属性将 Section 的折叠状态持久化到本地存储中，这样用户刷新页面后仍保持折叠状态。你还需要一个唯一的 `id` 属性来标识该 Section，以便每个 Section 可以独立持久化自己的折叠状态：

```blade
<x-filament::section
    collapsible
    collapsed
    persist-collapsed
    id="user-details"
>
    <x-slot name="heading">
        User details
    </x-slot>

    {{-- Content --}}
</x-filament::section>
```

## 将 Section 头部放在内容旁边

你可以使用 `aside` 属性将 Section 头部的位置从内容上方更改为内容旁边：

```blade
<x-filament::section aside>
    <x-slot name="heading">
        User details
    </x-slot>

    {{-- Content --}}
</x-filament::section>
```

![一个头部在内容旁边的 Section](/assets/filament/v4.x/screenshots/images/light/components/section/aside.jpg)

### 将内容放在头部之前

你可以使用 `content-before` 属性将内容的位置从头部之后更改为头部之前：

```blade
<x-filament::section
    aside
    content-before
>
    <x-slot name="heading">
        User details
    </x-slot>

    {{-- Content --}}
</x-filament::section>
```

![一个内容在头部之前的 Section](/assets/filament/v4.x/screenshots/images/light/components/section/content-before.jpg)

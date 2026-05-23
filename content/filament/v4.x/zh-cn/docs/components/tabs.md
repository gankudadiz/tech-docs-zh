---
title: Tabs Blade 组件
---

## 简介

Tabs 组件允许你渲染一组标签页，可用于在多个内容区域之间切换：

```blade
<x-filament::tabs label="Content tabs">
    <x-filament::tabs.item>
        Tab 1
    </x-filament::tabs.item>

    <x-filament::tabs.item>
        Tab 2
    </x-filament::tabs.item>

    <x-filament::tabs.item>
        Tab 3
    </x-filament::tabs.item>
</x-filament::tabs>
```

![带有图标的标签页](/assets/filament/v4.x/screenshots/images/light/components/tabs/simple.jpg)

## 触发标签页的激活状态

默认情况下，标签页不会显示为"激活"状态。要使标签页显示为激活状态，你可以使用 `active` 属性：

```blade
<x-filament::tabs>
    <x-filament::tabs.item active>
        Tab 1
    </x-filament::tabs.item>

    {{-- 其他标签页 --}}
</x-filament::tabs>
```

你也可以使用 `active` 属性来有条件地使标签页显示为激活状态：

```blade
<x-filament::tabs>
    <x-filament::tabs.item
        :active="$activeTab === 'tab1'"
        wire:click="$set('activeTab', 'tab1')"
    >
        Tab 1
    </x-filament::tabs.item>

    {{-- 其他标签页 --}}
</x-filament::tabs>
```

或者你可以使用 `alpine-active` 属性通过 Alpine.js 来有条件地使标签页显示为激活状态：

```blade
<x-filament::tabs x-data="{ activeTab: 'tab1' }">
    <x-filament::tabs.item
        alpine-active="activeTab === 'tab1'"
        x-on:click="activeTab = 'tab1'"
    >
        Tab 1
    </x-filament::tabs.item>

    {{-- 其他标签页 --}}
</x-filament::tabs>
```

## 设置标签页图标

标签页可以有一个[图标](../styling/icons)，你可以使用 `icon` 属性来设置：

```blade
<x-filament::tabs>
    <x-filament::tabs.item icon="heroicon-m-bell">
        Notifications
    </x-filament::tabs.item>

    {{-- 其他标签页 --}}
</x-filament::tabs>
```

![带有图标的标签页](/assets/filament/v4.x/screenshots/images/light/components/tabs/icon.jpg)

### 设置标签页图标的位置

你可以使用 `icon-position` 属性将标签页的图标放置在标签文本之前或之后：

```blade
<x-filament::tabs>
    <x-filament::tabs.item
        icon="heroicon-m-bell"
        icon-position="after"
    >
        Notifications
    </x-filament::tabs.item>

    {{-- 其他标签页 --}}
</x-filament::tabs>
```

![图标位于标签文本之后的标签页](/assets/filament/v4.x/screenshots/images/light/components/tabs/icon-position-after.jpg)

## 设置标签页徽章

标签页可以有一个[徽章](badge)，你可以使用 `badge` 插槽来设置：

```blade
<x-filament::tabs>
    <x-filament::tabs.item>
        Notifications

        <x-slot name="badge">
            5
        </x-slot>
    </x-filament::tabs.item>

    {{-- 其他标签页 --}}
</x-filament::tabs>
```

![带有徽章的标签页](/assets/filament/v4.x/screenshots/images/light/components/tabs/badge.jpg)

## 将标签页用作锚链接

默认情况下，标签页的底层 HTML 标签是 `<button>`。你可以通过 `tag` 属性将其更改为 `<a>` 标签：

```blade
<x-filament::tabs>
    <x-filament::tabs.item
        :href="route('notifications')"
        tag="a"
    >
        Notifications
    </x-filament::tabs.item>

    {{-- 其他标签页 --}}
</x-filament::tabs>
```

## 使用垂直标签页

你可以使用 `vertical` 属性将标签页垂直渲染：

```blade
<x-filament::tabs vertical>
    <x-filament::tabs.item>
        Tab 1
    </x-filament::tabs.item>

    <x-filament::tabs.item>
        Tab 2
    </x-filament::tabs.item>

    <x-filament::tabs.item>
        Tab 3
    </x-filament::tabs.item>
</x-filament::tabs>
```

![垂直标签页](/assets/filament/v4.x/screenshots/images/light/components/tabs/vertical.jpg)

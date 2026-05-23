---
title: Avatar Blade 组件
---

## 简介

Avatar 组件用于渲染圆形或方形图片，通常用于将用户或实体表示为"头像"：

```blade
<x-filament::avatar
    src="https://filamentphp.com/dan.jpg"
    alt="Dan Harrin"
/>
```

![头像](/assets/filament/v4.x/screenshots/images/light/components/avatar/simple.jpg)

## 设置头像的圆角

默认情况下，头像是完全圆形的，但你可以通过将 `circular` 属性设置为 `false` 来使其变为方形：

```blade
<x-filament::avatar
    src="https://filamentphp.com/dan.jpg"
    alt="Dan Harrin"
    :circular="false"
/>
```

![方形头像](/assets/filament/v4.x/screenshots/images/light/components/avatar/square.jpg)

## 设置头像的大小

默认情况下，头像的大小为"中等"。你可以使用 `size` 属性将其设置为 `sm`、`md` 或 `lg`：

```blade
<x-filament::avatar
    src="https://filamentphp.com/dan.jpg"
    alt="Dan Harrin"
    size="lg"
/>
```

![不同大小的头像](/assets/filament/v4.x/screenshots/images/light/components/avatar/sizes.jpg)

你还可以将自定义的大小类传入 `size` 属性：

```blade
<x-filament::avatar
    src="https://filamentphp.com/dan.jpg"
    alt="Dan Harrin"
    size="w-12 h-12"
/>
```

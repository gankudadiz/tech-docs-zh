---
title: Breadcrumbs Blade 组件
---

## 简介

Breadcrumbs 组件用于渲染一个简单的线性导航，告知用户他们在应用中的当前位置：

```blade
<x-filament::breadcrumbs :breadcrumbs="[
    '/' => 'Home',
    '/dashboard' => 'Dashboard',
    '/dashboard/users' => 'Users',
    '/dashboard/users/create' => 'Create User',
]" />
```

![面包屑导航](/assets/filament/v4.x/screenshots/images/light/components/breadcrumbs/simple.jpg)

数组的键是用户可以点击导航的 URL，值是每个链接显示的文本。

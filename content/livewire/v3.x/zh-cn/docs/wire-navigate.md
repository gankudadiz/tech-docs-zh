---
title: wire:navigate
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-navigate.md
source_version: v3.8.0
translation_status: draft
---

Livewire 的 `wire:navigate` 功能让页面导航变得更快，为用户提供类似 SPA 的体验。

本页面是 `wire:navigate` 指令的简单参考。请务必阅读 [Livewire 导航功能页面](/docs/livewire/v3.x/navigate) 获取更完整的文档。

以下是在导航栏链接中添加 `wire:navigate` 的简单示例：

```blade
<nav>
    <a href="/" wire:navigate>Dashboard</a>
    <a href="/posts" wire:navigate>Posts</a>
    <a href="/users" wire:navigate>Users</a>
</nav>
```

当点击这些链接中的任意一个时，Livewire 会拦截点击，而不是让浏览器执行完整的页面访问。Livewire 会在后台获取页面，并将其与当前页面进行交换（从而实现更快、更流畅的页面导航）。

## 悬停时预取页面

通过添加 `.hover` 修饰符，Livewire 会在用户悬停在链接上时预取页面。这样当用户点击链接时，页面已经从服务器下载完成。

```blade
<a href="/" wire:navigate.hover>Dashboard</a>
```

## 深入了解

关于此功能的更完整文档，请访问 [Livewire 导航文档页面](/docs/livewire/v3.x/navigate)。

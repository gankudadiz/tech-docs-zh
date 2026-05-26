---
title: wire:current
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-current.md
source_version: v3.8.0
translation_status: draft
---

`wire:current` 指令让你可以轻松检测并样式化当前页面上处于激活状态的链接。

以下是在导航栏链接中添加 `wire:current` 的简单示例，使当前激活的链接具有更粗的字体：

```blade
<nav>
    <a href="/dashboard" ... wire:current="font-bold text-zinc-800">Dashboard</a>
    <a href="/posts" ... wire:current="font-bold text-zinc-800">Posts</a>
    <a href="/users" ... wire:current="font-bold text-zinc-800">Users</a>
</nav>
```

现在当用户访问 `/posts` 时，"Posts"链接将比其他链接具有更粗的字体样式。

请注意，`wire:current` 可以与 `wire:navigate` 链接和页面变更无缝配合使用。

## 精确匹配

默认情况下，`wire:current` 使用部分匹配策略，即如果链接和当前页面共享 URL 路径的开头部分，就会应用该指令。

例如，如果链接是 `/posts`，而当前页面是 `/posts/1`，`wire:current` 指令将会被应用。

如果你希望使用精确匹配，可以为该指令添加 `.exact` 修饰符。

以下是一个你可能需要使用精确匹配的示例，以防止在用户访问 `/posts` 时"Dashboard"链接被高亮：

```blade
<nav>
    <a href="/" wire:current.exact="font-bold">Dashboard</a>
</nav>
```

## 严格匹配

默认情况下，`wire:current` 会在比较时移除尾部斜杠（`/`）。

如果你想禁用此行为并强制进行严格的路径字符串比较，可以附加 `.strict` 修饰符：

```blade
<nav>
    <a href="/posts/" wire:current.strict="font-bold">Dashboard</a>
</nav>
```

## 故障排除

如果 `wire:current` 未正确检测当前链接，请确保以下条件：

* 页面上至少有一个 Livewire 组件，或在布局中硬编码了 `@livewireScripts`
* 链接上存在 `href` 属性

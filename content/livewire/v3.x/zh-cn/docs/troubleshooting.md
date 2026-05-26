---
title: 故障排除
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/troubleshooting.md
source_version: v3.8.0
translation_status: draft
---

在 Livewire 总部，我们努力在问题出现之前消除它们。然而，有时有些问题我们无法在不引入新问题的情况下解决，还有些问题我们无法预料。

以下是你可能在 Livewire 应用中遇到的一些常见错误和场景。

## 组件不匹配

当与页面上的 Livewire 组件交互时，你可能会遇到奇怪的行为或类似以下的错误消息：

```
Error: Component already initialized
```

```
Error: Snapshot missing on Livewire component with id: ...
```

出现这些消息的原因有很多，但最常见的是忘记在 `@foreach` 循环内的元素和组件上添加 `wire:key`。

### 添加 `wire:key`

每当你的 Blade 模板中有像 `@foreach` 这样的循环时，你需要为循环内第一个元素的开始标签添加 `wire:key`：

```blade
@foreach($posts as $post)
    <div wire:key="{{ $post->id }}"> <!-- [tl! highlight] -->
        ...
    </div>
@endforeach
```

这确保了当循环发生变化时，Livewire 能够追踪循环中的不同元素。

同样适用于循环内的 Livewire 组件：

```blade
@foreach($posts as $post)
    <livewire:show-post :$post :key="$post->id" /> <!-- [tl! highlight] -->
@endforeach
```

不过，还有一个你可能没想到的棘手场景：

当你有 Livewire 组件深层嵌套在 `@foreach` 循环中时，你仍然需要为其添加 key。例如：

```blade
@foreach($posts as $post)
    <div wire:key="{{ $post->id }}">
        ...
        <livewire:show-post :$post :key="$post->id" /> <!-- [tl! highlight] -->
        ...
    </div>
@endforeach
```

如果没有在嵌套的 Livewire 组件上添加 key，Livewire 将无法在网络请求之间匹配循环中的组件。

#### 为 key 添加前缀

你可能遇到的另一个棘手场景是同一组件内存在重复的 key。这通常是由于使用模型 ID 作为 key，而它们有时会冲突。

以下示例中，我们需要添加 `post-` 和 `author-` 前缀，以将每组 key 标记为唯一的。否则，如果你有一个 `$post` 和一个 `$author` 模型具有相同的 ID，就会发生 ID 冲突：

```blade
<div>
    @foreach($posts as $post)
        <div wire:key="post-{{ $post->id }}">...</div> <!-- [tl! highlight] -->
    @endforeach

    @foreach($authors as $author)
        <div wire:key="author-{{ $author->id }}">...</div> <!-- [tl! highlight] -->
    @endforeach
</div>
```

## 多个 Alpine 实例

安装 Livewire 时，你可能会遇到类似以下的错误消息：

```
Error: Detected multiple instances of Alpine running
```

```
Alpine Expression Error: $wire is not defined
```

如果是这种情况，你可能在同一页面上运行了两个版本的 Alpine。Livewire 底层包含了自己的 Alpine 捆绑包，因此你必须移除应用中 Livewire 页面上任何其他版本的 Alpine。

发生这种情况的一种常见场景是将 Livewire 添加到已包含 Alpine 的现有应用中。例如，如果你安装了 Laravel Breeze 入门套件，然后又添加了 Livewire，就会遇到此问题。

解决方法很简单：移除额外的 Alpine 实例。

### 移除 Laravel Breeze 的 Alpine

如果你在已有的 Laravel Breeze（Blade + Alpine 版本）中安装 Livewire，需要从 `resources/js/app.js` 中移除以下行：

```js
import './bootstrap';

import Alpine from 'alpinejs'; // [tl! remove:4]

window.Alpine = Alpine;

Alpine.start();
```

### 移除 CDN 版本的 Alpine

由于 Livewire 2 及以下版本默认不包含 Alpine，你可能在布局的 `<head>` 中通过 script 标签引入了 Alpine CDN。在 Livewire v3 中，你可以完全移除此 CDN，Livewire 会自动为你提供 Alpine：

```html
    ...
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script> <!-- [tl! remove] -->
</head>
```

注意：你也可以移除任何额外的 Alpine 插件，因为 Livewire 包含了除 `@alpinejs/ui` 之外的所有 Alpine 插件。

## 缺少 `@alpinejs/ui`

Livewire 捆绑的 Alpine 版本包含了除 `@alpinejs/ui` 之外的所有 Alpine 插件。如果你正在使用依赖于该插件的 [Alpine Components](https://alpinejs.dev/components) 的无头组件，可能会遇到类似以下的错误：

```
Uncaught Alpine: no element provided to x-anchor
```

要解决这个问题，只需在布局文件中以 CDN 方式引入 `@alpinejs/ui` 插件：

```html
    ...
    <script defer src="https://unpkg.com/@alpinejs/ui@3.13.7-beta.0/dist/cdn.min.js"></script> <!-- [tl! add] -->
</head>
```

注意：请确保引入该插件的最新版本，你可以在[任意组件的文档页面](https://alpinejs.dev/component/headless-dialog/docs)上找到。

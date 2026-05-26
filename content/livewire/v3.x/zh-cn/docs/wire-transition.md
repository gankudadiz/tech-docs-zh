---
title: wire:transition
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-transition.md
source_version: v3.8.0
translation_status: draft
---

## 基本用法

在 Livewire 中显示或隐藏内容就像使用 Blade 的条件指令（如 `@if`）一样简单。为了增强用户体验，Livewire 提供了 `wire:transition` 指令，让你可以平滑地过渡条件元素的进入和离开。

例如，下面是一个 `ShowPost` 组件，具有切换查看评论的功能：

```php
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public $showComments = false;
}
```

```blade
<div>
    <!-- ... -->

    <button wire:click="$set('showComments', true)">Show comments</button>

    @if ($showComments)
        <div wire:transition> <!-- [tl! highlight] -->
            @foreach ($post->comments as $comment)
                <!-- ... -->
            @endforeach
        </div>
    @endif
</div>
```

因为在包含文章评论的 `<div>` 上添加了 `wire:transition`，当按下"Show comments"按钮时，`$showComments` 将被设置为 `true`，评论会以"淡入"效果出现在页面上，而不是突然显示。

## 局限性

目前，`wire:transition` 仅支持位于像 `@if` 这样的 Blade 条件内的单个元素。当用于同级元素列表时，它无法按预期工作。例如，以下代码将**无法正常工作**：

```blade
<!-- 警告：以下代码无法正常工作 -->
<ul>
    @foreach ($post->comments as $comment)
        <li wire:transition wire:key="{{ $comment->id }}">{{ $comment->content }}</li>
    @endforeach
</ul>
```

如果上面的某个评论 `<li>` 元素被移除，你可能期望 Livewire 将其过渡消失。但由于 Livewire 底层"morph"机制的限制，情况并非如此。目前还没有办法在 Livewire 中使用 `wire:transition` 来过渡动态列表。

## 默认过渡样式

默认情况下，Livewire 会对带有 `wire:transition` 的元素同时应用不透明度和缩放的 CSS 过渡。

默认过渡使用以下值：

| 过渡进入 | 过渡离开 |
|---------|---------|
| `duration: 150ms` | `duration: 75ms` |
| `opacity: [0 - 100]` | `opacity: [100 - 0]` |
| `transform: scale([0.95 - 1])` | `transform: scale([1 - 0.95])` |

## 自定义过渡

要自定义 Livewire 在过渡时内部使用的 CSS，可以使用任意可用的修饰符组合：

| 修饰符 | 说明 |
|--------|------|
| `.in` | 仅过渡元素"进入" |
| `.out` | 仅过渡元素"离开" |
| `.duration.[?]ms` | 自定义过渡持续时间（毫秒） |
| `.duration.[?]s` | 自定义过渡持续时间（秒） |
| `.delay.[?]ms` | 自定义过渡延迟（毫秒） |
| `.delay.[?]s` | 自定义过渡延迟（秒） |
| `.opacity` | 仅应用不透明度过渡 |
| `.scale` | 仅应用缩放过渡 |
| `.origin.[top\|bottom\|left\|right]` | 自定义缩放"原点" |

以下是一些过渡组合示例，有助于更好地直观理解这些自定义：

**仅淡入淡出过渡**

默认情况下，Livewire 在过渡时会同时淡入淡出和缩放元素。你可以添加 `.opacity` 修饰符来禁用缩放，仅保留淡入淡出效果。这对于过渡全屏覆盖层等场景很有用，缩放效果并不合适。

```html
<div wire:transition.opacity>
```

**仅离开淡出过渡**

一种常见的过渡技术是在过渡进入时立即显示元素，并在过渡离开时淡出。你会注意到大多数原生 MacOS 下拉菜单和菜单都有这种效果。因此它通常用于网页上的下拉菜单、弹出框和菜单。

```html
<div wire:transition.out.opacity.duration.200ms>
```

**顶部原点缩放过渡**

当使用 Livewire 过渡下拉菜单等元素时，从菜单顶部作为原点进行缩放比从中心（Livewire 的默认值）更合理。这样菜单在视觉上会感觉锚定在触发它的元素上。

```html
<div wire:transition.scale.origin.top>
```

:::tip[Livewire 底层使用 Alpine 过渡]
在元素上使用 `wire:transition` 时，Livewire 内部会应用 Alpine 的 `x-transition` 指令。因此你可以使用通常与 `x-transition` 一起使用的大部分（如果不是全部）语法。查看 [Alpine 过渡文档](https://alpinejs.dev/directives/transition) 了解其所有功能。
:::

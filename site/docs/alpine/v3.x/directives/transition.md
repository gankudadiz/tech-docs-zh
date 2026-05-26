---
title: x-transition
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/transition.md
source_version: v3.x
translation_status: draft
---

# x-transition

Alpine 开箱即用地提供了强大的过渡工具。使用几个 `x-transition` 指令，你可以在元素显示或隐藏时创建平滑的过渡。

有两种主要方式来处理 Alpine 中的过渡：

* [过渡辅助器](#the-transition-helper)
* [应用 CSS 类](#applying-css-classes)

## 过渡辅助器

使用 Alpine 实现过渡的最简单方法是向具有 `x-show` 的元素添加 `x-transition`。例如：

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>

    <div x-show="open" x-transition>
        Hello 👋
    </div>
</div>
```

如你所见，默认情况下，`x-transition` 应用令人愉快的默认过渡效果，对显示的元素进行淡入淡出和缩放。

你可以使用附加到 `x-transition` 的修饰符覆盖这些默认设置。让我们看看它们。

### 自定义持续时间

最初，进入时的持续时间设置为 150 毫秒，离开时为 75 毫秒。

你可以使用 `.duration` 修饰符为过渡配置所需的持续时间：

```html
<div ... x-transition.duration.500ms>
```

上面的 `<div>` 将在进入时过渡 500 毫秒，离开时过渡 500 毫秒。

如果你想专门为进入和离开自定义持续时间，可以这样做：

```html
<div ...
    x-transition:enter.duration.500ms
    x-transition:leave.duration.400ms
>
```

> 尽管未包含在上面的代码片段中，但如果没有任何父元素定义 `x-data`，则不能使用 `x-transition`。[→ 阅读更多关于 `x-data` 的内容](./data)

### 自定义延迟

你可以使用 `.delay` 修饰符延迟过渡，如下所示：

```html
<div ... x-transition.delay.50ms>
```

上面的示例将元素进入和离开的过渡延迟 50 毫秒。

### 自定义透明度

默认情况下，Alpine 的 `x-transition` 同时应用缩放和透明度过渡来实现"淡入"效果。

如果你只想应用透明度过渡（无缩放），可以这样做：

```html
<div ... x-transition.opacity>
```

### 自定义缩放

与 `.opacity` 修饰符类似，你可以配置 `x-transition` 只进行缩放（不同时过渡透明度），如下所示：

```html
<div ... x-transition.scale>
```

`.scale` 修饰符还提供了配置其缩放值及其原点值的能力：

```html
<div ... x-transition.scale.80>
```

上面的代码片段将元素上下缩放 80%。

同样，你可以分别为进入和离开过渡自定义这些值，如下所示：

```html
<div ...
    x-transition:enter.scale.80
    x-transition:leave.scale.90
>
```

要自定义缩放过渡的原点，可以使用 `.origin` 修饰符：

```html
<div ... x-transition.scale.origin.top>
```

现在缩放将使用元素的顶部作为原点，而不是默认的中心。

你可能已经猜到，这个自定义的可用值是：`top`、`bottom`、`left` 和 `right`。

如果你愿意，还可以组合两个原点值。例如，如果你希望缩放的原点是"右上角"，可以使用：`.origin.top.right` 作为修饰符。

## 应用 CSS 类

为了直接控制过渡中的具体内容，你可以在过渡的不同阶段应用 CSS 类。

> 以下示例使用 [TailwindCSS](https://tailwindcss.com/docs/transition-property) 工具类。

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>

    <div
        x-show="open"
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 scale-90"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-300"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-90"
    >Hello 👋</div>
</div>
```

| 指令          | 描述 |
| ---            | --- |
| `:enter`       | 在整个进入阶段应用。 |
| `:enter-start` | 在元素插入之前添加，插入后一帧移除。 |
| `:enter-end`   | 在元素插入后一帧添加（同时 `enter-start` 被移除），过渡/动画完成时移除。 |
| `:leave`       | 在整个离开阶段应用。 |
| `:leave-start` | 在离开过渡触发时立即添加，一帧后移除。 |
| `:leave-end`   | 在离开过渡触发后一帧添加（同时 `leave-start` 被移除），过渡/动画完成时移除。 |

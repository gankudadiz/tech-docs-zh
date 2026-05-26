---
title: x-transition
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/transition.md
version: v3.x
translation_status: translated
---

# x-transition

Alpine 开箱即用地提供了强大的过渡工具。

有两种主要方式来处理 Alpine 中的过渡：

* [过渡辅助器](#the-transition-helper)
* [应用 CSS 类](#applying-css-classes)

<a name="the-transition-helper"></a>
## 过渡辅助器

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>

    <div x-show="open" x-transition>
        Hello 👋
    </div>
</div>
```

<a name="customizing-duration"></a>
### 自定义持续时间

```html
<div ... x-transition.duration.500ms>
```

```html
<div ...
    x-transition:enter.duration.500ms
    x-transition:leave.duration.400ms
>
```

<a name="customizing-delay"></a>
### 自定义延迟

```html
<div ... x-transition.delay.50ms>
```

<a name="customizing-opacity"></a>
### 自定义透明度

```html
<div ... x-transition.opacity>
```

<a name="customizing-scale"></a>
### 自定义缩放

```html
<div ... x-transition.scale>
```

```html
<div ... x-transition.scale.80>
```

```html
<div ...
    x-transition:enter.scale.80
    x-transition:leave.scale.90
>
```

```html
<div ... x-transition.scale.origin.top>
```

<a name="applying-css-classes"></a>
## 应用 CSS 类

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
| `:enter-end`   | 在元素插入后一帧添加，过渡/动画完成时移除。 |
| `:leave`       | 在整个离开阶段应用。 |
| `:leave-start` | 在离开过渡触发时立即添加，一帧后移除。 |
| `:leave-end`   | 在离开过渡触发后一帧添加，过渡/动画完成时移除。 |

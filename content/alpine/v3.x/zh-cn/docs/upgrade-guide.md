---
title: 从 V2 升级
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/upgrade-guide.md
version: v3.x
translation_status: translated
---

# 从 V2 升级

以下是从 Alpine V2 升级到 V3 的破坏性变更的详尽指南。如果你更喜欢生动的方式，可以观看 Alpine Day 2021 的 "Future of Alpine" 主题演讲，了解所有变更以及 V3 中的新功能：

从 Alpine V2 升级到 V3 应该相当轻松。在许多情况下，你的代码库不需要做任何更改就能使用 V3。以下是破坏性变更和弃用功能的完整列表，按用户受影响的可能性降序排列：

> 注意：如果你同时使用 Laravel Livewire 和 Alpine，要使用 V3 的 Alpine，你需要升级到 Livewire v2.5.1 或更高版本。

<a name="breaking-changes"></a>
## 破坏性变更

* [`$el` 现在始终是当前元素](#el-no-longer-root)
* [自动评估数据对象上定义的 `init()` 函数](#auto-init)
* [导入后需要调用 `Alpine.start()`](#need-to-call-alpine-start)
* [`x-show.transition` 现在是 `x-transition`](#removed-show-dot-transition)
* [`x-if` 不再支持 `x-transition`](#x-if-no-transitions)
* [`x-data` 级联作用域](#x-data-scope)
* [`x-init` 不再接受回调返回值](#x-init-no-callback)
* [从事件处理程序返回 `false` 不再隐式执行 "preventDefault"](#no-false-return-from-event-handlers)
* [`x-spread` 现在是 `x-bind`](#x-spread-now-x-bind)
* [`x-ref` 不再支持绑定](#x-ref-no-more-dynamic)
* [使用全局生命周期事件代替 `Alpine.deferLoadingAlpine()`](#use-global-events-now)
* [不再支持 IE11](#no-ie-11)

<a name="el-no-longer-root"></a>
### `$el` 现在始终是当前元素

`$el` 现在始终表示执行表达式的元素，而不是组件的根元素。这将取代 `x-ref` 的大部分使用场景，如果你仍想访问组件的根元素，可以使用 `$root`。例如：

```html
<!-- 🚫 之前 -->
<div x-data>
    <button @click="console.log($el)"></button>
    <!-- 在 V2 中，$el 是 <div>，现在它是 <button> -->
</div>

<!-- ✅ 之后 -->
<div x-data>
    <button @click="console.log($root)"></button>
</div>
```

为了更平滑的升级体验，你可以将所有 `$el` 实例替换为自定义魔法属性 `$root`。

[→ 阅读更多关于 V3 中 $el 的内容](/magics/el)
[→ 阅读更多关于 V3 中 $root 的内容](/magics/root)

<a name="auto-init"></a>
### 自动评估数据对象上定义的 `init()` 函数

在 V2 中，常见的做法是在 `x-data` 对象上手动调用 `init()`（或类似名称的方法）。

在 V3 中，Alpine 会自动调用数据对象上的 `init()` 方法。

```html
<!-- 🚫 之前 -->
<div x-data="foo()" x-init="init()"></div>

<!-- ✅ 之后 -->
<div x-data="foo()"></div>

<script>
    function foo() {
        return {
            init() {
                //
            }
        }
    }
</script>
```

[→ 阅读更多关于自动评估 init 函数的内容](/globals/alpine-data#init-functions)

<a name="need-to-call-alpine-start"></a>
### 导入后需要调用 Alpine.start()

如果你从 NPM 导入 Alpine V2，现在需要手动调用 `Alpine.start()` 以使用 V3。如果你使用 Alpine 的构建文件或 `<template>` 标签引入的 CDN，则不受此影响。

```js
// 🚫 之前
import 'alpinejs'

// ✅ 之后
import Alpine from 'alpinejs'

window.Alpine = Alpine

Alpine.start()
```

[→ 阅读更多关于初始化 Alpine V3](/essentials/installation#as-a-module)

<a name="removed-show-dot-transition"></a>
### `x-show.transition` 现在是 `x-transition`

由 `x-show.transition...` 辅助器提供的所有便利功能仍然可用，但现在是来自一个更统一的 API：`x-transition`：

```html
<!-- 🚫 之前 -->
<div x-show.transition="open"></div>
<!-- ✅ 之后 -->
<div x-show="open" x-transition></div>

<!-- 🚫 之前 -->
<div x-show.transition.duration.500ms="open"></div>
<!-- ✅ 之后 -->
<div x-show="open" x-transition.duration.500ms></div>

<!-- 🚫 之前 -->
<div x-show.transition.in.duration.500ms.out.duration.750ms="open"></div>
<!-- ✅ 之后 -->
<div
    x-show="open"
    x-transition:enter.duration.500ms
    x-transition:leave.duration.750ms
></div>
```

[→ 阅读更多关于 x-transition 的内容](/directives/transition)

<a name="x-if-no-transitions"></a>
### `x-if` 不再支持 `x-transition`

Alpine 不再支持在元素从 DOM 移除之前/之后添加过渡效果的能力。

这是一个很少人知道更别说使用的功能。

由于过渡系统较为复杂，从维护角度来看，仅支持对 `x-show` 的元素进行过渡更为合理。

```html
<!-- 🚫 之前 -->
<template x-if.transition="open">
    <div>...</div>
</template>

<!-- ✅ 之后 -->
<div x-show="open" x-transition>...</div>
```

[→ 阅读更多关于 x-if 的内容](/directives/if)

<a name="x-data-scope"></a>
### `x-data` 级联作用域

在 `x-data` 中定义的作用域现在对其所有子元素可用，除非被嵌套的 `x-data` 表达式覆盖。

```html
<!-- 🚫 之前 -->
<div x-data="{ foo: 'bar' }">
    <div x-data="{}">
        <!-- foo 是 undefined -->
    </div>
</div>

<!-- ✅ 之后 -->
<div x-data="{ foo: 'bar' }">
    <div x-data="{}">
        <!-- foo 是 'bar' -->
    </div>
</div>
```

[→ 阅读更多关于 x-data 作用域的内容](/directives/data#scope)

<a name="x-init-no-callback"></a>
### `x-init` 不再接受回调返回值

在 V3 之前，如果 `x-init` 接收到的返回值的 `typeof` 是 "function"，它会在 Alpine 完成初始化树中所有其他指令后执行该回调。现在，你必须手动调用 `$nextTick()` 来实现该行为。`x-init` 不再"识别返回值"。

```html
<!-- 🚫 之前 -->
<div x-data x-init="() => { ... }">...</div>

<!-- ✅ 之后 -->
<div x-data x-init="$nextTick(() => { ... })">...</div>
```

[→ 阅读更多关于 $nextTick 的内容](/magics/next-tick)

<a name="no-false-return-from-event-handlers"></a>
### 从事件处理程序返回 `false` 不再隐式执行 "preventDefault"

Alpine V2 将 `false` 的返回值视为执行 `preventDefault` 的意图。这符合原生内联监听器的标准行为：`<... oninput="someFunctionThatReturnsFalse()">`。Alpine V3 不再支持此 API。大多数人不知道此功能的存在，因此这是一种令人意外的行为。

```html
<!-- 🚫 之前 -->
<div x-data="{ blockInput() { return false } }">
    <input type="text" @input="blockInput()">
</div>

<!-- ✅ 之后 -->
<div x-data="{ blockInput(e) { e.preventDefault() }">
    <input type="text" @input="blockInput($event)">
</div>
```

[→ 阅读更多关于 x-on 的内容](/directives/on)

<a name="x-spread-now-x-bind"></a>
### `x-spread` 现在是 `x-bind`

Alpine 复用功能的方式之一是将 Alpine 指令抽象为对象，并通过 `x-spread` 应用到元素上。此行为仍然相同，只是现在 `x-bind`（不指定属性）是 API 而非 `x-spread`。

```html
<!-- 🚫 之前 -->
<div x-data="dropdown()">
    <button x-spread="trigger">Toggle</button>

    <div x-spread="dialogue">...</div>
</div>

<!-- ✅ 之后 -->
<div x-data="dropdown()">
    <button x-bind="trigger">Toggle</button>

    <div x-bind="dialogue">...</div>
</div>

<script>
    function dropdown() {
        return {
            open: false,

            trigger: {
                'x-on:click'() { this.open = ! this.open },
            },

            dialogue: {
                'x-show'() { return this.open },
                'x-bind:class'() { return 'foo bar' },
            },
        }
    }
</script>
```

[→ 阅读更多关于使用 x-bind 绑定指令的内容](/directives/bind#bind-directives)

<a name="use-global-events-now"></a>
### 使用全局生命周期事件代替 `Alpine.deferLoadingAlpine()`

```html
<!-- 🚫 之前 -->
<script>
    window.deferLoadingAlpine = startAlpine => {
        // 在初始化 Alpine 之前执行

        startAlpine()

        // 在初始化 Alpine 之后执行
    }
</script>

<!-- ✅ 之后 -->
<script>
    document.addEventListener('alpine:init', () => {
        // 在初始化 Alpine 之前执行
    })

    document.addEventListener('alpine:initialized', () => {
        // 在初始化 Alpine 之后执行
    })
</script>
```

[→ 阅读更多关于 Alpine 生命周期事件](/essentials/lifecycle#alpine-initialization)

<a name="x-ref-no-more-dynamic"></a>
### `x-ref` 不再支持绑定

在 Alpine V2 中，对于以下代码：

```html
<div x-data="{options: [{value: 1}, {value: 2}, {value: 3}] }">
    <div x-ref="0">0</div>
    <template x-for="option in options">
        <div :x-ref="option.value" x-text="option.value"></div>
    </template>

    <button @click="console.log($refs[0], $refs[1], $refs[2], $refs[3]);">Display $refs</button>
</div>
```

点击按钮后，所有的 `$refs` 都会被显示。然而，在 Alpine V3 中，只能访问静态创建的元素的 `$refs`，因此只会返回第一个 ref。

<a name="no-ie-11"></a>
### 不再支持 IE11

Alpine 将不再官方支持 Internet Explorer 11。如果你需要 IE11 支持，建议仍使用 Alpine V2。

## 弃用的 API

以下 2 个 API 在 V3 中仍然可用，但被视为已弃用，并可能在未来的某个版本中被移除。

<a name="away-replace-with-outside"></a>
### 事件监听器修饰符 `.away` 应替换为 `.outside`

```html
<!-- 🚫 之前 -->
<div x-show="open" @click.away="open = false">
    ...
</div>

<!-- ✅ 之后 -->
<div x-show="open" @click.outside="open = false">
    ...
</div>
```

<a name="alpine-data-instead-of-global-functions"></a>
### 优先使用 `Alpine.data()` 而非全局 Alpine 函数数据提供者

```html
<!-- 🚫 之前 -->
<div x-data="dropdown()">
    ...
</div>

<script>
    function dropdown() {
        return {
            ...
        }
    }
</script>

<!-- ✅ 之后 -->
<div x-data="dropdown">
    ...
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data('dropdown', () => ({
            ...
        }))
    })
</script>
```

> 注意你需要在调用 `Alpine.start()` 之前定义 `Alpine.data()` 扩展。更多信息请参考[生命周期问题](https://alpinejs.dev/advanced/extending#lifecycle-concerns)和[作为模块安装](https://alpinejs.dev/essentials/installation#as-a-module)文档页面。

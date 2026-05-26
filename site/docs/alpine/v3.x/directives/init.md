---
title: x-init
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/init.md
source_version: v3.x
translation_status: draft
---

# x-init

`x-init` 指令允许你钩入 Alpine 中任何元素的初始化阶段。

```html
<div x-init="console.log('I\'m being initialized!')"></div>
```

在上面的示例中，在 Alpine 进一步更新 DOM 之前，"I\'m being initialized!" 将被输出到控制台。

再考虑另一个示例，在组件被处理之前，使用 `x-init` 获取一些 JSON 并存储在 `x-data` 中。

```html
<div
    x-data="{ posts: [] }"
    x-init="posts = await (await fetch('/posts')).json()"
>...</div>
```

## $nextTick

有时你想等到 Alpine 完全完成渲染后再执行一些代码。

这就像 React 中的 `useEffect(..., [])` 或 Vue 中的 `mount`。

通过使用 Alpine 内部的 `$nextTick` 魔法，你可以实现这一点。

```html
<div x-init="$nextTick(() => { ... })"></div>
```

## 独立的 `x-init`

你可以在 `x-data` HTML 块内部或外部的任何元素上添加 `x-init`。例如：

```html
<div x-data>
    <span x-init="console.log('I can initialize')"></span>
</div>

<span x-init="console.log('I can initialize too')"></span>
```

## 自动评估 init() 方法

如果组件的 `x-data` 对象包含 `init()` 方法，它将被自动调用。例如：

```html
<div x-data="{
    init() {
        console.log('I am called automatically')
    }
}">
    ...
</div>
```

对于使用 `Alpine.data()` 语法注册的组件也是如此。

```js
Alpine.data('dropdown', () => ({
    init() {
        console.log('I will get evaluated when initializing each "dropdown" component.')
    },
}))
```

如果你同时有一个包含 `init()` 方法的 `x-data` 对象和一个 `x-init` 指令，`x-data` 的方法将在指令之前被调用。

```html
<div
    x-data="{
        init() {
            console.log('I am called first')
        }
    }"
    x-init="console.log('I am called second')"
    >
    ...
</div>
```

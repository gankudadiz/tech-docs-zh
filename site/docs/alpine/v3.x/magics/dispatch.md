---
title: $dispatch
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/magics/dispatch.md
source_version: v3.x
translation_status: draft
---

# $dispatch

`$dispatch` 是一个派发浏览器事件的便捷快捷方式。

```html
<div @notify="alert('Hello World!')">
    <button @click="$dispatch('notify')">
        Notify
    </button>
</div>
```

你也可以在派发事件时附带传递数据。这些数据将作为事件的 `.detail` 属性访问：

```html
<div @notify="alert($event.detail.message)">
    <button @click="$dispatch('notify', { message: 'Hello World!' })">
        Notify
    </button>
</div>
```

在底层，`$dispatch` 是更冗长 API 的封装：`element.dispatchEvent(new CustomEvent(...))`

**关于事件传播的说明**

注意，由于[事件冒泡](https://en.wikipedia.org/wiki/Event_bubbling)，当你需要捕获从同一嵌套层级下的节点派发的事件时，你需要使用 [`.window`](https://github.com/alpinejs/alpine#x-on) 修饰符：

**示例：**

```html
<!-- 🚫 不起作用 -->
<div x-data>
    <span @notify="..."></span>
    <button @click="$dispatch('notify')">Notify</button>
</div>

<!-- ✅ 可以工作（因为使用了 .window） -->
<div x-data>
    <span @notify.window="..."></span>
    <button @click="$dispatch('notify')">Notify</button>
</div>
```

> 第一个示例不起作用，因为当派发 `notify` 时，它会传播到其共同祖先 `div`，而不是其兄弟 `<span>`。第二个示例可以工作，因为兄弟元素在 `window` 层级监听 `notify`，自定义事件最终会冒泡到那里。

## 派发到其他组件

你也可以利用前面的技术让你的组件相互通信：

**示例：**

```html
<div
    x-data="{ title: 'Hello' }"
    @set-title.window="title = $event.detail"
>
    <h1 x-text="title"></h1>
</div>

<div x-data>
    <button @click="$dispatch('set-title', 'Hello World!')">Click me</button>
</div>
<!-- 点击后，h1 的内容将设置为 "Hello World!"。 -->
```

## 派发到 x-model

你也可以使用 `$dispatch()` 触发 `x-model` 数据绑定的数据更新。例如：

```html
<div x-data="{ title: 'Hello' }">
    <span x-model="title">
        <button @click="$dispatch('input', 'Hello World!')">Click me</button>
        <!-- 按下按钮后，`x-model` 将捕获冒泡的 "input" 事件，并更新 title。 -->
    </span>
</div>
```

这为制作可以通过 `x-model` 设置值的自定义输入组件打开了大门。

## 可取消的事件

你可以使用 `$dispatch` 的返回值来检查事件是否被取消。这在你想要阻止操作的默认行为时很有用。

```html
<div x-data x-on:open="$event.preventDefault()">
    <div x-data="{ open: false }">
        <button @click="if($dispatch('open')){ open = true; }">Click me</button>
        <!-- 按下按钮时会派发事件，只有当结果为 truthy（未被任何处理程序阻止）时，内容才会显示。 -->

        <div x-show="open">
            <h1>Hello</h1>
        </div>
    </div>
</div>
```

当你想要通过使用事件处理程序阻止打开/关闭模态框等时，这可能很有用。

## 覆盖选项

你可以使用 `$dispatch` 的第三个参数覆盖事件的默认选项。例如，你可以将 `bubbles` 设置为 `false`：

```html
<!-- 🚫 不起作用，因为事件在父元素上被监听 -->
<div x-data="{ title: 'Hello' }" x-on:update-title="title = $event.detail">
    <button @click="$dispatch('update-title', 'Hello World!', {bubbles: false})">Click me</button>
</div>

<!-- ✅ 可以工作，因为事件在同一元素上被监听 -->
<div x-data="{ title: 'Hello' }">
    <button x-on:update-title="title = $event.detail" @click="$dispatch('update-title', 'Hello World!', {bubbles: false})">Click me</button>
</div>
```

当你想要阻止事件冒泡到父元素时，这很有用。

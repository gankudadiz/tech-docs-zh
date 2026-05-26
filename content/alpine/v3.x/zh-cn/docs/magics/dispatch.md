---
title: $dispatch
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/magics/dispatch.md
version: v3.x
translation_status: translated
---

# $dispatch

`$dispatch` 是一个派发浏览器事件的便捷快捷方式。

```html
<div @notify="alert('Hello World!')">
    <button @click="$dispatch('notify')">Notify</button>
</div>
```

你也可以在派发事件时附带传递数据：

```html
<div @notify="alert($event.detail.message)">
    <button @click="$dispatch('notify', { message: 'Hello World!' })">Notify</button>
</div>
```

<a name="dispatching-to-components"></a>
## 派发到其他组件

```html
<div x-data="{ title: 'Hello' }" @set-title.window="title = $event.detail">
    <h1 x-text="title"></h1>
</div>
<div x-data>
    <button @click="$dispatch('set-title', 'Hello World!')">Click me</button>
</div>
```

<a name="dispatching-to-x-model"></a>
## 派发到 x-model

```html
<div x-data="{ title: 'Hello' }">
    <span x-model="title">
        <button @click="$dispatch('input', 'Hello World!')">Click me</button>
    </span>
</div>
```

<a name="cancelable-events"></a>
## 可取消的事件

```html
<div x-data x-on:open="$event.preventDefault()">
    <div x-data="{ open: false }">
        <button @click="if($dispatch('open')){ open = true; }">Click me</button>
        <div x-show="open"><h1>Hello</h1></div>
    </div>
</div>
```

<a name="overwriting-options"></a>
## 覆盖选项

```html
<div x-data="{ title: 'Hello' }" x-on:update-title="title = $event.detail">
    <button @click="$dispatch('update-title', 'Hello World!', {bubbles: false})">Click me</button>
</div>
```

---
title: Focus 插件
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/plugins/focus.md
source_version: v3.x
translation_status: draft
---

# Focus 插件

> 注意：此插件之前名为 "Trap"。Trap 的功能已被整合到此插件中。你可以无缝地将 Trap 替换为 Focus。

Alpine 的 Focus 插件允许你管理页面上的焦点。

## 安装

### 通过 CDN

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/focus@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### 通过 NPM

```shell
npm install @alpinejs/focus
```

```js
import Alpine from 'alpinejs'
import focus from '@alpinejs/focus'
Alpine.plugin(focus)
```

## x-trap

Focus 提供了一个专用 API 用于在元素内"捕获"焦点：`x-trap` 指令。

`x-trap` 接受一个 JS 表达式。如果表达式结果为 true，焦点将被捕获在该元素内，直到表达式变为 false。

```html
<div x-data="{ open: false }">
    <button @click="open = true">Open Dialog</button>

    <span x-show="open" x-trap="open">
        <p>...</p>
        <input type="text" placeholder="Some input...">
        <input type="text" placeholder="Some other input...">
        <button @click="open = false">Close Dialog</button>
    </span>
</div>
```

### 嵌套对话框

`x-trap` 会自动处理焦点的嵌套捕获和释放。

### 修饰符

#### .inert

捕获焦点时，为页面上其他所有元素添加 `aria-hidden="true"`：

```html
<div x-trap.inert="open" ...>
```

#### .noscroll

焦点捕获时禁止页面滚动：

```html
<div x-trap.noscroll="open" ...>
```

#### .noreturn

关闭时焦点不返回之前位置（适用于下拉菜单等场景）：

```html
<div x-trap.noreturn="open" ...>
```

#### .noautofocus

不自动聚焦元素：

```html
<div x-trap.noautofocus="open" ...>
```

## $focus

此插件通过 `$focus` 魔法暴露了多个焦点管理工具：

| 属性 | 描述 |
| ---       | --- |
| `focus(el)` | 聚焦元素 |
| `focusable(el)` | 检测元素是否可聚焦 |
| `focusables()` | 获取当前元素内所有可聚焦元素 |
| `focused()` | 获取当前聚焦的元素 |
| `lastFocused()` | 获取上一个聚焦的元素 |
| `within(el)` | 指定作用域 |
| `first()` | 聚焦第一个可聚焦元素 |
| `last()` | 聚焦最后一个可聚焦元素 |
| `next()` | 聚焦下一个可聚焦元素 |
| `previous()` | 聚焦前一个可聚焦元素 |
| `noscroll()` | 防止滚动到即将聚焦的元素 |
| `wrap()` | 循环获取"下一个"或"前一个" |
| `getFirst()` | 获取第一个可聚焦元素 |
| `getLast()` | 获取最后一个可聚焦元素 |
| `getNext()` | 获取下一个可聚焦元素 |
| `getPrevious()` | 获取前一个可聚焦元素 |

使用箭头键在按钮组中控制焦点：

```html
<div @keydown.right="$focus.next()" @keydown.left="$focus.previous()">
    <button>First</button>
    <button>Second</button>
    <button>Third</button>
</div>
```

使用 `.wrap()` 使焦点循环：

```html
<div @keydown.right="$focus.wrap().next()" @keydown.left="$focus.wrap().previous()">
```

使用 `.within()` 指定作用域：

```html
<button @click="$focus.within($refs.buttons).first()">Focus "First"</button>
<button @click="$focus.within($refs.buttons).last()">Focus "Last"</button>

<div x-ref="buttons" @keydown.right="$focus.wrap().next()" @keydown.left="$focus.wrap().previous()">
    <button>First</button>
    <button>Second</button>
    <button>Third</button>
</div>
```

---
title: x-on
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/on.md
version: v3.x
translation_status: translated
---

# x-on

`x-on` 允许你轻松地在触发的 DOM 事件上运行代码。

以下是点击时显示警告框的简单按钮示例。

```html
<button x-on:click="alert('Hello World!')">Say Hi</button>
```

<a name="shorthand-syntax"></a>
## 简写语法

如果 `x-on:` 对你来说太啰嗦，你可以使用简写语法：`@`。

以下是使用简写语法的相同组件：

```html
<button @click="alert('Hello World!')">Say Hi</button>
```

<a name="the-event-object"></a>
## 事件对象

如果你想从表达式中访问原生 JavaScript 事件对象，可以使用 Alpine 的魔法属性 `$event`。

```html
<button @click="alert($event.target.getAttribute('message'))" message="Hello World">Say Hi</button>
```

此外，Alpine 还会将事件对象传递给任何不带尾部括号引用的方法。例如：

```html
<button @click="handleClick">...</button>

<script>
    function handleClick(e) {
        // 现在你可以直接访问事件对象 (e)
    }
</script>
```

<a name="keyboard-events"></a>
## 键盘事件

Alpine 使监听特定按键上的 `keydown` 和 `keyup` 事件变得容易。

以下是在 input 元素内监听 `Enter` 键的示例。

```html
<input type="text" @keyup.enter="alert('Submitted!')">
```

你还可以链式组合这些按键修饰符来实现更复杂的监听器。

以下是一个在按住 `Shift` 键并按下 `Enter` 时触发的监听器，而不是单独按下 `Enter`。

```html
<input type="text" @keyup.shift.enter="alert('Submitted!')">
```

你可以直接使用任何通过 [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) 暴露的有效键名作为修饰符，将其转换为 kebab-case。

```html
<input type="text" @keyup.page-down="alert('Submitted!')">
```

以下是常见的你可能想监听的按键列表。

| 修饰符                          | 键盘键                            |
| ------------------------------ | --------------------------------- |
| `.shift`                       | Shift                             |
| `.enter`                       | Enter                             |
| `.space`                       | Space                             |
| `.ctrl`                        | Ctrl                              |
| `.cmd`                         | Cmd                               |
| `.meta`                        | Mac 上的 Cmd，Windows 上的 Windows 键 |
| `.alt`                         | Alt                               |
| `.up` `.down` `.left` `.right` | 上/下/左/右方向键                    |
| `.escape`                      | Escape                            |
| `.tab`                         | Tab                               |
| `.caps-lock`                   | Caps Lock                         |
| `.equal`                       | 等号 `=`                           |
| `.period`                      | 句号 `.`                           |
| `.comma`                       | 逗号 `,`                           |
| `.slash`                       | 正斜杠 `/`                         |

<a name="mouse-events"></a>
## 鼠标事件

与上面的键盘事件类似，Alpine 允许使用一些按键修饰符来处理 `click` 事件。

| 修饰符 | 事件键 |
| -------- | --------- |
| `.shift` | shiftKey  |
| `.ctrl`  | ctrlKey   |
| `.cmd`   | metaKey   |
| `.meta`  | metaKey   |
| `.alt`   | altKey    |

这些适用于 `click`、`auxclick`、`context` 和 `dblclick` 事件，甚至 `mouseover`、`mousemove`、`mouseenter`、`mouseleave`、`mouseout`、`mouseup` 和 `mousedown`。

以下是一个按钮在按住 `Shift` 键时改变行为的示例。

```html
<button type="button"
    x-data="{ message: 'select' }"
    @click="message = 'selected'"
    @click.shift="message = 'added to selection'"
    @mousemove.shift="message = 'add to selection'"
    @mouseout="message = 'select'"
    x-text="message"></button>
```

<a name="custom-events"></a>
## 自定义事件

Alpine 事件监听器是原生 DOM 事件监听器的封装。因此，它们可以监听任何 DOM 事件，包括自定义事件。

以下是一个同时派发和监听自定义 DOM 事件的组件示例。

```html
<div x-data @foo="alert('Button Was Clicked!')">
    <button @click="$event.target.dispatchEvent(new CustomEvent('foo', { bubbles: true }))">...</button>
</div>
```

当按钮被点击时，`@foo` 监听器将被调用。

因为 `.dispatchEvent` API 很啰嗦，Alpine 提供了 `$dispatch` 辅助器来简化操作。

以下是使用 `$dispatch` 魔法属性重写的相同组件。

```html
<div x-data @foo="alert('Button Was Clicked!')">
    <button @click="$dispatch('foo')">...</button>
</div>
```

[→ 阅读更多关于 `$dispatch` 的内容](/magics/dispatch)

<a name="modifiers"></a>
## 修饰符

Alpine 提供了一些指令修饰符来定制事件监听器的行为。

<a name="prevent"></a>
### .prevent

`.prevent` 相当于在浏览器事件对象的监听器中调用 `.preventDefault()`。

```html
<form @submit.prevent="console.log('submitted')" action="/foo">
    <button>Submit</button>
</form>
```

在上面的示例中，使用了 `.prevent`，点击按钮将不会向 `/foo` 端点提交表单。相反，Alpine 的监听器会处理它并"阻止"事件进一步被处理。

<a name="stop"></a>
### .stop

与 `.prevent` 类似，`.stop` 相当于在浏览器事件对象的监听器中调用 `.stopPropagation()`。

```html
<div @click="console.log('I will not get logged')">
    <button @click.stop>Click Me</button>
</div>
```

在上面的示例中，点击按钮不会记录消息。

<a name="outside"></a>
### .outside

`.outside` 是一个便利辅助器，用于监听其所附加元素外部的点击。

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>

    <div x-show="open" @click.outside="open = false">
        Contents...
    </div>
</div>
```

<a name="window"></a>
### .window

当存在 `.window` 修饰符时，Alpine 会将事件监听器注册在页面根 `window` 对象上，而不是元素本身。

```html
<div @keyup.escape.window="...">...</div>
```

<a name="document"></a>
### .document

`.document` 的工作方式与 `.window` 类似，只是它将监听器注册在 `document` 全局对象上，而不是 `window` 全局对象。

<a name="once"></a>
### .once

通过向监听器添加 `.once`，你可以确保处理程序只被调用一次。

```html
<button @click.once="console.log('I will only log once')">...</button>
```

<a name="debounce"></a>
### .debounce

有时对事件处理程序进行"防抖"很有用，这样它只会在一定的不活动时间后（默认为 250 毫秒）被调用。

```html
<input @input.debounce="fetchResults">
```

```html
<input @input.debounce.500ms="fetchResults">
```

<a name="throttle"></a>
### .throttle

`.throttle` 与 `.debounce` 类似，只是它每 250 毫秒释放一次处理程序调用，而不是无限期地延迟。

```html
<div @scroll.window.throttle="handleScroll">...</div>
```

```html
<div @scroll.window.throttle.750ms="handleScroll">...</div>
```

<a name="self"></a>
### .self

通过向事件监听器添加 `.self`，你可以确保事件起源于声明它的元素，而不是子元素。

```html
<button @click.self="handleClick">
    Click Me
    <img src="...">
</button>
```

<a name="camel"></a>
### .camel

```html
<div @custom-event.camel="handleCustomEvent">
    ...
</div>
```

<a name="dot"></a>
### .dot

```html
<div @custom-event.dot="handleCustomEvent">
    ...
</div>
```

<a name="passive"></a>
### .passive

```html
<div @touchstart.passive="...">...</div>
```

<a name="passive-false"></a>
### .passive.false

```html
<div @touchmove.passive.false="$event.preventDefault()">...</div>
```

### .capture

```html
<div @click.capture="console.log('I will log first')">
    <button @click="console.log('I will log second')"></button>
</div>
```

---
title: x-on
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/on.md
source_version: v3.x
translation_status: draft
---

# x-on

`x-on` 允许你轻松地在触发的 DOM 事件上运行代码。

以下是点击时显示警告框的简单按钮示例。

```html
<button x-on:click="alert('Hello World!')">Say Hi</button>
```

> `x-on` 只能监听小写名称的事件，因为 HTML 属性不区分大小写。如果你需要监听驼峰命名的自定义事件，可以使用 [`.camel` 辅助器](#camel) 来解决这个限制。或者，你可以使用 [`x-bind`](./bind#bind-directives) 在 JavaScript 代码中附加一个 `x-on` 指令到元素上（大小写将被保留）。

## 简写语法

如果 `x-on:` 对你来说太啰嗦，你可以使用简写语法：`@`。

以下是使用简写语法的相同组件：

```html
<button @click="alert('Hello World!')">Say Hi</button>
```

> 尽管未包含在上面的代码片段中，但如果没有父元素定义 `x-data`，则不能使用 `x-on`。[→ 阅读更多关于 `x-data` 的内容](./data)

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

> 注意：带有某些修饰符（如 `ctrl`）的正常 click 事件在大多数浏览器中会自动变为 `contextmenu` 事件。类似地，右键点击事件将触发 `contextmenu` 事件，但如果 `contextmenu` 事件被阻止，也会触发 `auxclick` 事件。

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

[→ 阅读更多关于 `$dispatch` 的内容](../magics/dispatch)

## 修饰符

Alpine 提供了一些指令修饰符来定制事件监听器的行为。

### .prevent

`.prevent` 相当于在浏览器事件对象的监听器中调用 `.preventDefault()`。

```html
<form @submit.prevent="console.log('submitted')" action="/foo">
    <button>Submit</button>
</form>
```

在上面的示例中，使用了 `.prevent`，点击按钮将不会向 `/foo` 端点提交表单。相反，Alpine 的监听器会处理它并"阻止"事件进一步被处理。

### .stop

与 `.prevent` 类似，`.stop` 相当于在浏览器事件对象的监听器中调用 `.stopPropagation()`。

```html
<div @click="console.log('I will not get logged')">
    <button @click.stop>Click Me</button>
</div>
```

在上面的示例中，点击按钮不会记录消息。这是因为我们立即停止了事件的传播，不允许它冒泡到带有 `@click` 监听器的 `<div>`。

### .outside

`.outside` 是一个便利辅助器，用于监听其所附加元素外部的点击。以下是一个简单的下拉菜单组件示例来演示：

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>

    <div x-show="open" @click.outside="open = false">
        Contents...
    </div>
</div>
```

在上面的示例中，在通过点击"Toggle"按钮显示下拉内容后，你可以通过点击页面上内容之外的任何位置来关闭下拉菜单。

这是因为 `.outside` 监听的不是从其注册的元素发起的点击。

> 值得注意的是，`.outside` 表达式只有在注册它的元素在页面上可见时才会被求值。否则，会有糟糕的竞态条件，比如点击"Toggle"按钮时，当 `@click.outside` 处理程序不可见时也会触发它。

### .window

当存在 `.window` 修饰符时，Alpine 会将事件监听器注册在页面根 `window` 对象上，而不是元素本身。

```html
<div @keyup.escape.window="...">...</div>
```

上述代码片段将监听页面上任何位置的"escape"按键事件。

对于标记的一小部分关注整个页面上发生的事件的情况，添加 `.window` 到监听器非常有用。

### .document

`.document` 的工作方式与 `.window` 类似，只是它将监听器注册在 `document` 全局对象上，而不是 `window` 全局对象。

### .once

通过向监听器添加 `.once`，你可以确保处理程序只被调用一次。

```html
<button @click.once="console.log('I will only log once')">...</button>
```

### .debounce

有时对事件处理程序进行"防抖"很有用，这样它只会在一定的不活动时间后（默认为 250 毫秒）被调用。

例如，如果你有一个搜索字段，用户输入时会触发网络请求，添加防抖将阻止每次按键都触发网络请求。

```html
<input @input.debounce="fetchResults">
```

现在，不会再每次按键后都调用 `fetchResults`，`fetchResults` 只会在 250 毫秒无按键后调用。

如果你想延长或缩短防抖时间，可以在 `.debounce` 修饰符后添加持续时间，如下所示：

```html
<input @input.debounce.500ms="fetchResults">
```

现在，`fetchResults` 只会在 500 毫秒的不活动后调用。

### .throttle

`.throttle` 与 `.debounce` 类似，只是它每 250 毫秒释放一次处理程序调用，而不是无限期地延迟。

这对于可能重复且长时间触发事件的情况很有用，使用 `.debounce` 不起作用，因为你仍然希望每隔一段时间处理事件。

例如：

```html
<div @scroll.window.throttle="handleScroll">...</div>
```

上面的示例是节流的一个很好的用例。没有 `.throttle`，`handleScroll` 方法在用户向下滚动页面时会被调用数百次。这会严重拖慢网站。通过添加 `.throttle`，我们确保 `handleScroll` 每 250 毫秒只被调用一次。

> 有趣的事实：这个确切的策略被用于本网站，以更新右侧侧边栏中当前高亮显示的部分。

就像 `.debounce` 一样，你可以为节流事件添加自定义持续时间：

```html
<div @scroll.window.throttle.750ms="handleScroll">...</div>
```

现在，`handleScroll` 将每 750 毫秒被调用一次。

### .self

通过向事件监听器添加 `.self`，你可以确保事件起源于声明它的元素，而不是子元素。

```html
<button @click.self="handleClick">
    Click Me

    <img src="...">
</button>
```

在上面的示例中，我们在 `<button>` 标签内部有一个 `<img>` 标签。通常，任何在 `<button>` 元素内发起的事件（例如在 `<img>` 上）都会被按钮上的 `@click` 监听器捕获。

然而，在这种情况下，因为我们添加了 `.self`，只有点击按钮本身才会调用 `handleClick`。只有发源于 `<img>` 元素的点击不会被执行。

### .camel

```html
<div @custom-event.camel="handleCustomEvent">
    ...
</div>
```

有时你可能想监听驼峰命名的事件，例如示例中的 `customEvent`。因为在 HTML 属性中不支持驼峰命名，需要添加 `.camel` 修饰符让 Alpine 在内部将事件名称驼峰化。

通过在上面的示例中添加 `.camel`，Alpine 现在监听的是 `customEvent` 而不是 `custom-event`。

### .dot

```html
<div @custom-event.dot="handleCustomEvent">
    ...
</div>
```

与 `.camel` 修饰符类似，可能存在你想监听的事件名称中包含点的情况（例如 `custom.event`）。由于事件名称中的点被 Alpine 保留，你需要用短横线书写它们并添加 `.dot` 修饰符。

在上面的代码示例中，`custom-event.dot` 将对应事件名称 `custom.event`。

### .passive

浏览器优化页面滚动，使其即使在页面执行 JavaScript 时也能快速平滑。然而，实现不当的 touch 和 wheel 监听器可能会阻止这种优化，导致网站性能不佳。

如果你正在监听 touch 事件，请务必向监听器添加 `.passive` 以不阻止滚动性能。

```html
<div @touchstart.passive="...">...</div>
```

[→ 阅读更多关于 passive 监听器的内容](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners)

### .passive.false

在现代浏览器中，touch 和 wheel 事件监听器默认是 passive 的。传入 `.passive.false` 使这些事件可取消，以便你可以对它们调用 `preventDefault`。

```html
<div @touchmove.passive.false="$event.preventDefault()">...</div>
```

### .capture

如果你想在事件的捕获阶段执行此监听器，即事件从目标元素向上冒泡 DOM 之前，添加此修饰符。

```html
<div @click.capture="console.log('I will log first')">
    <button @click="console.log('I will log second')"></button>
</div>
```

[→ 阅读更多关于事件捕获和冒泡阶段的内容](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#usecapture)

---
title: x-bind
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/bind.md
version: v3.x
translation_status: translated
---

# x-bind

`x-bind` 允许你基于 JavaScript 表达式的结果设置元素的 HTML 属性。

例如，这是一个使用 `x-bind` 设置输入框 placeholder 值的组件。

```html
<div x-data="{ placeholderText: 'Type here...' }">
    <input type="text" x-bind:placeholder="placeholderText">
</div>
```

<a name="shorthand-syntax"></a>
## 简写语法

如果 `x-bind:` 对你来说太啰嗦，你可以使用简写：`:`. 例如，以下是同一个输入框元素，但使用简写语法重构。

```html
<input type="text" :placeholder="placeholderText">
```

<a name="binding-classes"></a>
## 绑定 class

`x-bind` 最常用于根据 Alpine 状态设置元素的特定 class。

以下是一个简单的下拉切换示例，但不是使用 `x-show`，而是使用"hidden" class 来切换元素。

```html
<div x-data="{ open: false }">
    <button x-on:click="open = ! open">Toggle Dropdown</button>

    <div :class="open ? '' : 'hidden'">
        Dropdown Contents...
    </div>
</div>
```

现在，当 `open` 为 `false` 时，"hidden" class 将被添加到下拉菜单中。

<a name="shorthand-conditionals"></a>
### 简写条件表达式

在这种情况下，如果你更喜欢更简洁的语法，可以使用 JavaScript 的短路求值代替标准条件表达式：

```html
<div :class="show ? '' : 'hidden'">
<!-- 等同于： -->
<div :class="show || 'hidden'">
```

反之亦然。假设我们使用一个相反值的变量 `closed` 而不是 `open`。

```html
<div :class="closed ? 'hidden' : ''">
<!-- 等同于： -->
<div :class="closed && 'hidden'">
```

<a name="class-object-syntax"></a>
### Class 对象语法

如果你愿意，Alpine 还提供了一种额外的 class 切换语法。通过传递一个 JavaScript 对象，其中 class 是键，布尔值是值，Alpine 将知道哪些 class 需要应用，哪些需要移除。例如：

```html
<div :class="{ 'hidden': ! show }">
```

这种方法相比其他方法有一个独特优势。当使用对象语法时，Alpine 不会保留元素 `class` 属性上原有的 class。

例如，如果你想在 Alpine 加载前给元素应用"hidden" class，并使用 Alpine 切换它的存在，你只能使用对象语法来实现：

```html
<div class="hidden" :class="{ 'hidden': ! show }">
```

<a name="special-behavior"></a>
### 特殊行为

`x-bind:class` 在底层的行为与其他属性不同。

考虑以下情况。

```html
<div class="opacity-50" :class="hide && 'hidden'">
```

如果"class"是任何其他属性，`:class` 绑定会覆盖任何现有的 class 属性，导致 `opacity-50` 被 `hidden` 或 `''` 覆盖。

然而，Alpine 对待 `class` 绑定不同。它足够智能，能保留元素上现有的 class。

例如，如果 `hide` 为 true，上述示例将产生以下 DOM 元素：

```html
<div class="opacity-50 hidden">
```

如果 `hide` 为 false，DOM 元素将如下所示：

```html
<div class="opacity-50">
```

这种行为对大多数用户来说应该是隐形的和直观的，但对于好奇的开发者或可能出现的特殊情况，还是值得明确说明。

<a name="binding-styles"></a>
## 绑定样式

与使用 JavaScript 对象绑定 class 的特殊语法类似，Alpine 也提供了基于对象语法的 `style` 属性绑定。

就像 class 对象一样，这种语法是完全可选的。仅在对你有优势时才使用。

```html
<div :style="{ color: 'red', display: 'flex' }">

<!-- 将渲染为： -->
<div style="color: red; display: flex;" ...>
```

条件内联样式也可以像使用 x-bind:class 一样通过表达式实现。短路运算符也可以在这里使用，以样式对象作为第二个操作数。

```html
<div x-bind:style="true && { color: 'red' }">

<!-- 将渲染为： -->
<div style="color: red;">
```

这种方法的一个优点是能够与元素上现有的样式混合使用：

```html
<div style="padding: 1rem;" :style="{ color: 'red', display: 'flex' }">

<!-- 将渲染为： -->
<div style="padding: 1rem; color: red; display: flex;" ...>
```

像 Alpine 中的大多数表达式一样，你总是可以使用 JavaScript 表达式的结果作为引用：

```html
<div x-data="{ styles: { color: 'red', display: 'flex' }}">
    <div :style="styles">
</div>

<!-- 将渲染为： -->
<div ...>
    <div style="color: red; display: flex;" ...>
</div>
```

<a name="bind-directives"></a>
## 直接绑定 Alpine 指令

`x-bind` 允许你将不同指令和属性的对象绑定到一个元素上。

对象的键可以是任何你通常在 Alpine 中作为属性名称书写的内容。这包括 Alpine 指令和修饰符，也包括普通的 HTML 属性。对象的值可以是普通字符串，或者对于动态 Alpine 指令来说，是由 Alpine 求值的回调函数。

```html
<div x-data="dropdown">
    <button x-bind="trigger">Open Dropdown</button>

    <span x-bind="dialogue">Dropdown Contents</span>
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data('dropdown', () => ({
            open: false,

            trigger: {
                ['x-ref']: 'trigger',
                ['@click']() {
                    this.open = true
                },
            },

            dialogue: {
                ['x-show']() {
                    return this.open
                },
                ['@click.outside']() {
                    this.open = false
                },
            },
        }))
    })
</script>
```

这种使用 `x-bind` 的方式有一些注意事项：

> 当被"绑定"或"应用"的指令是 `x-for` 时，你应该从回调中返回一个普通的表达式字符串。例如：`['x-for']() { return 'item in items' }`

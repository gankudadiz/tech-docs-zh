---
title: x-model
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/model.md
source_version: v3.x
translation_status: draft
---

# x-model

`x-model` 允许你将输入元素的值绑定到 Alpine 数据。

以下是使用 `x-model` 将文本字段的值绑定到 Alpine 数据的简单示例。

```html
<div x-data="{ message: '' }">
    <input type="text" x-model="message">

    <span x-text="message"></span>
</div>
```

现在当用户在文本字段中键入时，`message` 将在 `<span>` 标签中反映出来。

`x-model` 是双向绑定的，意味着它既可"设置"也可"获取"。除了改变数据外，如果数据本身发生变化，元素也会反映这一变化。

我们可以使用与上面相同的示例，但这次添加一个按钮来改变 `message` 属性的值。

```html
<div x-data="{ message: '' }">
    <input type="text" x-model="message">

    <button x-on:click="message = 'changed'">Change Message</button>
</div>
```

现在当 `<button>` 被点击时，输入元素的值将立即更新为"changed"。

`x-model` 适用于以下输入元素：

* `<input type="text">`
* `<textarea>`
* `<input type="checkbox">`
* `<input type="radio">`
* `<select>`
* `<input type="range">`

## 文本输入

```html
<input type="text" x-model="message">

<span x-text="message"></span>
```

> 尽管未包含在上面的代码片段中，但如果没有任何父元素定义 `x-data`，则不能使用 `x-model`。[→ 阅读更多关于 `x-data` 的内容](./data)

## Textarea 输入

```html
<textarea x-model="message"></textarea>

<span x-text="message"></span>
```

## 复选框输入

### 单个复选框与布尔值

```html
<input type="checkbox" id="checkbox" x-model="show">

<label for="checkbox" x-text="show"></label>
```

### 多个复选框绑定到数组

```html
<input type="checkbox" value="red" x-model="colors">
<input type="checkbox" value="orange" x-model="colors">
<input type="checkbox" value="yellow" x-model="colors">

Colors: <span x-text="colors"></span>
```

## 单选框输入

```html
<input type="radio" value="yes" x-model="answer">
<input type="radio" value="no" x-model="answer">

Answer: <span x-text="answer"></span>
```

## Select 输入

### 单个 select

```html
<select x-model="color">
    <option>Red</option>
    <option>Orange</option>
    <option>Yellow</option>
</select>

Color: <span x-text="color"></span>
```

### 带占位符的单个 select

```html
<select x-model="color">
    <option value="" disabled>Select A Color</option>
    <option>Red</option>
    <option>Orange</option>
    <option>Yellow</option>
</select>

Color: <span x-text="color"></span>
```

### 多选 select

```html
<select x-model="color" multiple>
    <option>Red</option>
    <option>Orange</option>
    <option>Yellow</option>
</select>

Colors: <span x-text="color"></span>
```

### 动态填充的 Select 选项

```html
<select x-model="color">
    <template x-for="color in ['Red', 'Orange', 'Yellow']">
        <option x-text="color"></option>
    </template>
</select>

Color: <span x-text="color"></span>
```

## 范围输入

```html
<input type="range" x-model="range" min="0" max="1" step="0.1">

<span x-text="range"></span>
```

## 修饰符

### `.lazy`

在文本输入中，默认情况下，`x-model` 在每次按键时更新属性。通过添加 `.lazy` 修饰符，你可以强制 `x-model` 输入仅在用户离开输入元素时更新属性。

这对于实时表单验证之类的情况很方便，你可能不想在用户"跳转"到另一个字段之前显示输入验证错误。

```html
<input type="text" x-model.lazy="username">
<span x-show="username.length > 20">The username is too long.</span>
```

### `.change`

`.change` 仅在输入失去焦点且其值发生变化时同步数据（原生 `change` 事件）。这在功能上等同于 `.lazy`。

```html
<input type="text" x-model.change="username">
```

### `.blur`

`.blur` 在输入失去焦点时同步数据，无论值是否发生变化。

```html
<input type="text" x-model.blur="email">
```

### `.enter`

`.enter` 在用户按下 Enter 键时同步数据。这对于搜索字段很有用，因为你想仅在用户明确提交时触发操作。

```html
<input type="text" x-model.enter="search">
```

> 注意：`.enter` 不会阻止默认行为。如果输入框在表单内部，表单仍然会提交。

### 组合事件修饰符

`.change`、`.blur` 和 `.enter` 修饰符可以组合以在多个事件上同步。当你希望给用户提供提交数据的灵活性时，这很有用。

```html
<!-- 在 blur 或 enter 时同步 -->
<input type="text" x-model.blur.enter="search" placeholder="Press Enter or click away">

<!-- 在 change、blur 或 enter 时同步 -->
<input type="text" x-model.change.blur.enter="message">
```

### `.number`

默认情况下，通过 `x-model` 存储在属性中的任何数据都存储为字符串。要强制 Alpine 将值存储为 JavaScript 数字，请添加 `.number` 修饰符。

```html
<input type="text" x-model.number="age">
<span x-text="typeof age"></span>
```

### `.boolean`

默认情况下，通过 `x-model` 存储在属性中的任何数据都存储为字符串。要强制 Alpine 将值存储为 JavaScript 布尔值，请添加 `.boolean` 修饰符。整数（1/0）和字符串（true/false）都是有效的布尔值。

```html
<select x-model.boolean="isActive">
    <option value="true">Yes</option>
    <option value="false">No</option>
</select>
<span x-text="typeof isActive"></span>
```

### `.debounce`

通过向 `x-model` 添加 `.debounce`，你可以轻松防抖更新绑定的输入。

这对于实时搜索输入之类的场景很有用，每次搜索属性更改时，它都会从服务器获取新数据。

```html
<input type="text" x-model.debounce="search">
```

默认防抖时间为 250 毫秒，你可以通过添加时间修饰符轻松自定义，如下所示：

```html
<input type="text" x-model.debounce.500ms="search">
```

### `.throttle`

与 `.debounce` 类似，你可以限制 `x-model` 触发的属性更新，使其仅按指定的时间间隔更新。

```html
<input type="text" x-model.throttle="search">
```

默认节流间隔为 250 毫秒，你可以通过添加时间修饰符轻松自定义，如下所示：

```html
<input type="text" x-model.throttle.500ms="search">
```

### `.fill`

默认情况下，如果输入有一个 value 属性，它会被 Alpine 忽略，而是将输入的值设置为使用 `x-model` 绑定的属性的值。

但是如果绑定的属性为空，你可以通过添加 `.fill` 修饰符使用输入的值属性来填充该属性。

```html
<div x-data="{ message: null }">
  <input type="text" x-model.fill="message" value="This is the default message.">
</div>
```

## 编程式访问

Alpine 暴露了底层工具，用于获取和设置使用 `x-model` 绑定的属性。这对于复杂的 Alpine 工具（可能想要覆盖默认的 x-model 行为）或你想在非输入元素上允许 `x-model` 的情况很有用。

你可以通过 `x-model` 元素上的名为 `_x_model` 的属性访问这些工具。`_x_model` 有两个方法用于获取和设置绑定的属性：

* `el._x_model.get()`（返回绑定属性的值）
* `el._x_model.set()`（设置绑定属性的值）

```html
<div x-data="{ username: 'calebporzio' }">
    <div x-ref="div" x-model="username"></div>

    <button @click="$refs.div._x_model.set('phantomatrix')">
        Change username to: 'phantomatrix'
    </button>

    <span x-text="$refs.div._x_model.get()"></span>
</div>
```

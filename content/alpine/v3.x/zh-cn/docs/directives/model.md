---
title: x-model
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/model.md
version: v3.x
translation_status: translated
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

<a name="text-inputs"></a>
## 文本输入

```html
<input type="text" x-model="message">

<span x-text="message"></span>
```

<a name="textarea-inputs"></a>
## Textarea 输入

```html
<textarea x-model="message"></textarea>

<span x-text="message"></span>
```

<a name="checkbox-inputs"></a>
## 复选框输入

<a name="single-checkbox-with-boolean"></a>
### 单个复选框与布尔值

```html
<input type="checkbox" id="checkbox" x-model="show">

<label for="checkbox" x-text="show"></label>
```

<a name="multiple-checkboxes-bound-to-array"></a>
### 多个复选框绑定到数组

```html
<input type="checkbox" value="red" x-model="colors">
<input type="checkbox" value="orange" x-model="colors">
<input type="checkbox" value="yellow" x-model="colors">

Colors: <span x-text="colors"></span>
```

<a name="radio-inputs"></a>
## 单选框输入

```html
<input type="radio" value="yes" x-model="answer">
<input type="radio" value="no" x-model="answer">

Answer: <span x-text="answer"></span>
```

<a name="select-inputs"></a>
## Select 输入

<a name="single-select"></a>
### 单个 select

```html
<select x-model="color">
    <option>Red</option>
    <option>Orange</option>
    <option>Yellow</option>
</select>

Color: <span x-text="color"></span>
```

<a name="single-select-with-placeholder"></a>
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

<a name="multiple-select"></a>
### 多选 select

```html
<select x-model="color" multiple>
    <option>Red</option>
    <option>Orange</option>
    <option>Yellow</option>
</select>

Colors: <span x-text="color"></span>
```

<a name="dynamically-populated-select-options"></a>
### 动态填充的 Select 选项

```html
<select x-model="color">
    <template x-for="color in ['Red', 'Orange', 'Yellow']">
        <option x-text="color"></option>
    </template>
</select>

Color: <span x-text="color"></span>
```

<a name="range-inputs"></a>
## 范围输入

```html
<input type="range" x-model="range" min="0" max="1" step="0.1">

<span x-text="range"></span>
```

<a name="modifiers"></a>
## 修饰符

<a name="lazy"></a>
### `.lazy`

```html
<input type="text" x-model.lazy="username">
```

<a name="change"></a>
### `.change`

```html
<input type="text" x-model.change="username">
```

<a name="blur"></a>
### `.blur`

```html
<input type="text" x-model.blur="email">
```

<a name="enter"></a>
### `.enter`

```html
<input type="text" x-model.enter="search">
```

<a name="combining-event-modifiers"></a>
### 组合事件修饰符

```html
<input type="text" x-model.blur.enter="search" placeholder="Press Enter or click away">
```

<a name="number"></a>
### `.number`

```html
<input type="text" x-model.number="age">
```

<a name="boolean"></a>
### `.boolean`

```html
<select x-model.boolean="isActive">
    <option value="true">Yes</option>
    <option value="false">No</option>
</select>
```

<a name="debounce"></a>
### `.debounce`

```html
<input type="text" x-model.debounce="search">
```

<a name="throttle"></a>
### `.throttle`

```html
<input type="text" x-model.throttle="search">
```

<a name="fill"></a>
### `.fill`

```html
<div x-data="{ message: null }">
  <input type="text" x-model.fill="message" value="This is the default message.">
</div>
```

<a name="programmatic access"></a>
## 编程式访问

```html
<div x-data="{ username: 'calebporzio' }">
    <div x-ref="div" x-model="username"></div>

    <button @click="$refs.div._x_model.set('phantomatrix')">
        Change username to: 'phantomatrix'
    </button>

    <span x-text="$refs.div._x_model.get()"></span>
</div>
```

---
title: $id
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/magics/id.md
source_version: v3.x
translation_status: draft
---

# $id

`$id` 是一个魔法属性，可用于生成元素的 ID，并确保它不会与页面上同名的其他 ID 冲突。

当构建可能在同一页面上多次出现并使用 ID 属性的可复用组件（通常在后端模板中）时，这个工具极其有用。

输入组件、模态框、列表框等都会受益于这个工具。

## 基本用法

假设你的页面上有两个输入元素，你希望它们彼此具有唯一的 ID，可以这样做：

```html
<input type="text" :id="$id('text-input')">
<!-- id="text-input-1" -->

<input type="text" :id="$id('text-input')">
<!-- id="text-input-2" -->
```

如你所见，`$id` 接收一个字符串并输出一个在页面上唯一的附加后缀。

## 使用 x-id 进行分组

现在假设你想要相同的两个输入元素，但这次你需要为每个输入元素添加 `<label>` 元素。

这带来了一个问题：现在你需要能够两次引用相同的 ID。一次用于 `<label>` 的 `for` 属性，另一次用于 input 上的 `id`。

以下是你可以想到的实现此目的的方法，它是完全有效的：

```html
<div x-data="{ id: $id('text-input') }">
    <label :for="id"> <!-- "text-input-1" -->
    <input type="text" :id="id"> <!-- "text-input-1" -->
</div>

<div x-data="{ id: $id('text-input') }">
    <label :for="id"> <!-- "text-input-2" -->
    <input type="text" :id="id"> <!-- "text-input-2" -->
</div>
```

这种方法没问题，然而，必须在组件作用域中命名和存储 ID 感觉有些繁琐。

为了以更灵活的方式完成相同任务，你可以使用 Alpine 的 `x-id` 指令为一组 ID 声明一个"id 作用域"：

```html
<div x-id="['text-input']">
    <label :for="$id('text-input')"> <!-- "text-input-1" -->
    <input type="text" :id="$id('text-input')"> <!-- "text-input-1" -->
</div>

<div x-id="['text-input']">
    <label :for="$id('text-input')"> <!-- "text-input-2" -->
    <input type="text" :id="$id('text-input')"> <!-- "text-input-2" -->
</div>
```

如你所见，`x-id` 接受一个 ID 名称数组。现在在该作用域内的任何 `$id()` 使用都将使用相同的 ID。可以将它们视为"id 组"。

## 嵌套

正如你可能已经猜到的，你可以自由嵌套这些 `x-id` 组，如下所示：

```html
<div x-id="['text-input']">
    <label :for="$id('text-input')"> <!-- "text-input-1" -->
    <input type="text" :id="$id('text-input')"> <!-- "text-input-1" -->

    <div x-id="['text-input']">
        <label :for="$id('text-input')"> <!-- "text-input-2" -->
        <input type="text" :id="$id('text-input')"> <!-- "text-input-2" -->
    </div>
</div>
```

## 带键的 ID（用于循环）

有时，在 ID 末尾指定额外的后缀以在循环中标识它很有帮助。

为此，`$id()` 接受可选的第二个参数，它将作为后缀添加到生成的 ID 末尾。

这种需求的一个常见示例是列表框组件，它使用 `aria-activedescendant` 属性来告诉辅助技术列表中哪个元素是"活动的"：

```html
<ul
    x-id="['list-item']"
    :aria-activedescendant="$id('list-item', activeItem.id)"
>
    <template x-for="item in items" :key="item.id">
        <li :id="$id('list-item', item.id)">...</li>
    </template>
</ul>
```

这是一个不完整的列表框示例，但它仍然有助于演示一个场景：你可能需要组中的每个 ID 在页面上保持唯一，但同时需要在循环中设置键，以便你可以引用该组中的单个 ID。

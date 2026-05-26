---
title: $id
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/magics/id.md
version: v3.x
translation_status: translated
---

# $id

`$id` 可用于生成元素的 ID，并确保它不会与页面上同名的其他 ID 冲突。

<a name="basic-usage"></a>
## 基本用法

```html
<input type="text" :id="$id('text-input')">
<!-- id="text-input-1" -->

<input type="text" :id="$id('text-input')">
<!-- id="text-input-2" -->
```

<a name="groups-with-x-id"></a>
## 使用 x-id 进行分组

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

<a name="nesting"></a>
## 嵌套

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

<a name="keyed-ids"></a>
## 带键的 ID（用于循环）

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

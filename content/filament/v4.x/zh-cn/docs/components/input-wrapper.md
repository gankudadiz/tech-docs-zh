---
title: Input Wrapper Blade 组件
---

## 简介

Input Wrapper 组件应作为 [Input](input) 或 [Select](select) 组件的外层包装使用。它提供了边框以及其他元素，如前缀或后缀。

```blade
<x-filament::input.wrapper>
    <x-filament::input
        type="text"
        wire:model="name"
    />
</x-filament::input.wrapper>

<x-filament::input.wrapper>
    <x-filament::input.select wire:model="status">
        <option value="draft">Draft</option>
        <option value="reviewing">Reviewing</option>
        <option value="published">Published</option>
    </x-filament::input.select>
</x-filament::input.wrapper>
```

## 触发输入框的错误状态

该组件具有特殊的样式，可用于表示输入无效。你可以通过 Blade 或 Alpine.js 来触发此样式。

要通过 Blade 触发错误状态，可以向组件传递 `valid` 属性，该属性根据输入是否有效包含 true 或 false：

```blade
<x-filament::input.wrapper :valid="! $errors->has('name')">
    <x-filament::input
        type="text"
        wire:model="name"
    />
</x-filament::input.wrapper>
```

或者，你可以使用 Alpine.js 表达式来触发错误状态，当表达式求值为 `true` 或 `false` 时生效：

```blade
<div x-data="{ errors: ['name'] }">
    <x-filament::input.wrapper alpine-valid="! errors.includes('name')">
        <x-filament::input
            type="text"
            wire:model="name"
        />
    </x-filament::input.wrapper>
</div>
```

## 禁用输入框

要禁用输入框，你还必须向包装组件传递 `disabled` 属性：

```blade
<x-filament::input.wrapper disabled>
    <x-filament::input
        type="text"
        wire:model="name"
        disabled
    />
</x-filament::input.wrapper>
```

![一个禁用的输入框](/assets/filament/v4.x/screenshots/images/light/components/input/disabled.jpg)

## 在输入框旁添加前后缀文本

你可以使用 `prefix` 和 `suffix` 插槽在输入框前后放置文本：

```blade
<x-filament::input.wrapper>
    <x-slot name="prefix">
        https://
    </x-slot>

    <x-filament::input
        type="text"
        wire:model="domain"
    />

    <x-slot name="suffix">
        .com
    </x-slot>
</x-filament::input.wrapper>
```

![带有前缀的输入框](/assets/filament/v4.x/screenshots/images/light/components/input/prefix.jpg)

### 使用图标作为前后缀

你可以使用 `prefix-icon` 和 `suffix-icon` 属性在输入框前后放置[图标](../styling/icons)：

```blade
<x-filament::input.wrapper suffix-icon="heroicon-m-globe-alt">
    <x-filament::input
        type="url"
        wire:model="domain"
    />
</x-filament::input.wrapper>
```

![带有前缀图标的输入框](/assets/filament/v4.x/screenshots/images/light/components/input/icon.jpg)

#### 设置前后缀图标的颜色

前后缀图标默认为灰色，你可以使用 `prefix-icon-color` 和 `affix-icon-color` 属性设置不同的颜色：

```blade
<x-filament::input.wrapper
    suffix-icon="heroicon-m-check-circle"
    suffix-icon-color="success"
>
    <x-filament::input
        type="url"
        wire:model="domain"
    />
</x-filament::input.wrapper>
```

![带有彩色后缀图标的输入框](/assets/filament/v4.x/screenshots/images/light/components/input/suffix-icon-color.jpg)

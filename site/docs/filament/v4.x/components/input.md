---
title: Input Blade 组件
---

## 简介

Input 组件是对原生 `<input>` 元素的包装。它提供了一个简单的界面，用于输入单行文本。

```blade
<x-filament::input.wrapper>
    <x-filament::input
        type="text"
        wire:model="name"
    />
</x-filament::input.wrapper>
```

![一个简单的输入框](/assets/filament/v4.x/screenshots/images/light/components/input/simple.jpg)

要使用 Input 组件，你必须将其包装在一个 "Input Wrapper" 组件中，该组件提供了边框以及其他元素，如前缀或后缀。你可以在[这里](input-wrapper)了解更多关于自定义 Input Wrapper 组件的信息。

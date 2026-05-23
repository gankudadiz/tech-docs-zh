---
title: Select Blade 组件
---

## 简介

Select 组件是对原生 `<select>` 元素的包装。它提供了一个简单的界面，用于从选项列表中选择单个值：

```blade
<x-filament::input.wrapper>
    <x-filament::input.select wire:model="status">
        <option value="draft">Draft</option>
        <option value="reviewing">Reviewing</option>
        <option value="published">Published</option>
    </x-filament::input.select>
</x-filament::input.wrapper>
```

![一个选择输入框](/assets/filament/v4.x/screenshots/images/light/components/select/simple.jpg)

要使用 Select 组件，你必须将其包装在一个 "Input Wrapper" 组件中，该组件提供了边框以及其他元素，如前缀或后缀。你可以在[这里](input-wrapper)了解更多关于自定义 Input Wrapper 组件的信息。

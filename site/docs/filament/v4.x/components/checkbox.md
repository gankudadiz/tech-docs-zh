---
title: Checkbox Blade 组件
---

## 简介

你可以使用 Checkbox 组件来渲染一个复选框输入，用于切换布尔值：

```blade
<label>
    <x-filament::input.checkbox wire:model="isAdmin" />

    <span>
        Is Admin
    </span>
</label>
```

![带标签的复选框](/assets/filament/v4.x/screenshots/images/light/components/checkbox/simple.jpg)

## 触发复选框的错误状态

复选框具有特殊样式，当其无效时可以使用。要触发此样式，你可以使用 Blade 或 Alpine.js。

要使用 Blade 触发错误状态，你可以将 `valid` 属性传递给组件，该属性根据复选框是否有效包含 true 或 false：

```blade
<x-filament::input.checkbox
    wire:model="isAdmin"
    :valid="! $errors->has('isAdmin')"
/>
```

或者，你可以使用 Alpine.js 表达式来触发错误状态，基于表达式求值结果为 `true` 还是 `false`：

```blade
<div x-data="{ errors: ['isAdmin'] }">
    <x-filament::input.checkbox
        x-model="isAdmin"
        alpine-valid="! errors.includes('isAdmin')"
    />
</div>
```

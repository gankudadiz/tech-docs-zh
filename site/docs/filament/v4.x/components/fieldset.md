---
title: Fieldset Blade 组件
---

## 简介

你可以使用 Fieldset 将多个表单字段组合在一起，并可选择添加标签：

```blade
<x-filament::fieldset>
    <x-slot name="label">
        Address
    </x-slot>

    {{-- Form fields --}}
</x-filament::fieldset>
```

![一个包含表单字段的 Fieldset](/assets/filament/v4.x/screenshots/images/light/components/fieldset/simple.jpg)

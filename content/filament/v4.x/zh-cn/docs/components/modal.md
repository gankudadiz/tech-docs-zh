---
title: Modal Blade 组件
---

## 简介

Modal 组件能够打开一个对话框窗口或滑出式面板，其中可以包含任何内容：

```blade
<x-filament::modal>
    <x-slot name="trigger">
        <x-filament::button>
            打开 Modal
        </x-filament::button>
    </x-slot>

    {{-- Modal 内容 --}}
</x-filament::modal>
```

![一个包含标题、描述和页脚操作的 Modal](/assets/filament/v4.x/screenshots/images/light/components/modal/simple.jpg)

## 通过 JavaScript 控制 Modal

你可以使用 `trigger` 插槽来渲染一个打开 Modal 的按钮。不过，这不是必须的。你可以通过 JavaScript 完全控制 Modal 的打开和关闭。首先，给 Modal 一个 ID 以便引用：

```blade
<x-filament::modal id="edit-user">
    {{-- Modal 内容 --}}
</x-filament::modal>
```

现在，你可以派发 `open-modal` 或 `close-modal` 浏览器事件，传入 Modal 的 ID，即可打开或关闭 Modal。例如，从 Livewire 组件中：

```php
$this->dispatch('open-modal', id: 'edit-user');
```

或从 Alpine.js 中：

```php
$dispatch('open-modal', { id: 'edit-user' })
```

## 为 Modal 添加标题

你可以使用 `heading` 插槽为 Modal 添加标题：

```blade
<x-filament::modal>
    <x-slot name="heading">
        Modal 标题
    </x-slot>

    {{-- Modal 内容 --}}
</x-filament::modal>
```

## 为 Modal 添加描述

你可以使用 `description` 插槽在标题下方添加描述：

```blade
<x-filament::modal>
    <x-slot name="heading">
        Modal 标题
    </x-slot>

    <x-slot name="description">
        Modal 描述
    </x-slot>

    {{-- Modal 内容 --}}
</x-filament::modal>
```

![一个包含标题和描述的 Modal](/assets/filament/v4.x/screenshots/images/light/components/modal/heading.jpg)

## 为 Modal 添加图标

你可以使用 `icon` 属性为 Modal 添加[图标](../styling/icons)：

```blade
<x-filament::modal icon="heroicon-o-information-circle">
    <x-slot name="heading">
        Modal 标题
    </x-slot>

    {{-- Modal 内容 --}}
</x-filament::modal>
```

默认情况下，图标的颜色为 "primary"。你可以使用 `icon-color` 属性将其更改为 `danger`、`gray`、`info`、`success` 或 `warning`：

```blade
<x-filament::modal
    icon="heroicon-o-exclamation-triangle"
    icon-color="danger"
>
    <x-slot name="heading">
        Modal 标题
    </x-slot>

    {{-- Modal 内容 --}}
</x-filament::modal>
```

![一个带有 danger 图标的 Modal](/assets/filament/v4.x/screenshots/images/light/components/modal/icon.jpg)

## 为 Modal 添加页脚

你可以使用 `footer` 插槽为 Modal 添加页脚：

```blade
<x-filament::modal>
    {{-- Modal 内容 --}}
    
    <x-slot name="footer">
        {{-- Modal 页脚内容 --}}
    </x-slot>
</x-filament::modal>
```

或者，你可以使用 `footerActions` 插槽在页脚中添加操作按钮：

```blade
<x-filament::modal>
    {{-- Modal 内容 --}}

    <x-slot name="footerActions">
        {{-- Modal 页脚操作 --}}
    </x-slot>
</x-filament::modal>
```

![一个带有自定义页脚的 Modal](/assets/filament/v4.x/screenshots/images/light/components/modal/footer.jpg)

## 更改 Modal 的对齐方式

默认情况下，Modal 内容会对齐到起始位置，如果 Modal 的[宽度](#更改-modal-宽度)为 `xs` 或 `sm` 则居中对齐。如果你想更改 Modal 中内容的对齐方式，可以使用 `alignment` 属性并传入 `start` 或 `center`：

```blade
<x-filament::modal alignment="center">
    {{-- Modal 内容 --}}
</x-filament::modal>
```

![一个居中对齐内容的 Modal](/assets/filament/v4.x/screenshots/images/light/components/modal/alignment.jpg)

## 使用滑出式面板代替 Modal

你可以使用 `slide-over` 属性打开"滑出式"对话框而不是 Modal：

```blade
<x-filament::modal slide-over>
    {{-- 滑出式面板内容 --}}
</x-filament::modal>
```

![一个滑出式 Modal](/assets/filament/v4.x/screenshots/images/light/components/modal/slide-over.jpg)

## 使 Modal 头部固定

当 Modal 内容超出 Modal 大小时，头部会随内容一起滚动出视图。然而，滑出式面板有一个固定头部，始终可见。你可以使用 `sticky-header` 属性来控制此行为：

```blade
<x-filament::modal sticky-header>
    <x-slot name="heading">
        Modal 标题
    </x-slot>

    {{-- Modal 内容 --}}
</x-filament::modal>
```

![一个带有固定头部的 Modal](/assets/filament/v4.x/screenshots/images/light/components/modal/sticky-header.jpg)

## 使 Modal 页脚固定

默认情况下，Modal 的页脚在内容之后内联渲染。然而，滑出式面板有一个固定页脚，在滚动内容时始终显示。你也可以使用 `sticky-footer` 属性为 Modal 启用此功能：

```blade
<x-filament::modal sticky-footer>
    {{-- Modal 内容 --}}

    <x-slot name="footer">
        {{-- Modal 页脚内容 --}}
    </x-slot>
</x-filament::modal>
```

![一个带有固定页脚的 Modal](/assets/filament/v4.x/screenshots/images/light/components/modal/sticky-footer.jpg)

## 更改 Modal 宽度

你可以使用 `width` 属性更改 Modal 的宽度。选项对应于 [Tailwind 的 max-width 比例](https://tailwindcss.com/docs/max-width)。选项包括 `xs`、`sm`、`md`、`lg`、`xl`、`2xl`、`3xl`、`4xl`、`5xl`、`6xl`、`7xl` 和 `screen`：

```blade
<x-filament::modal width="5xl">
    {{-- Modal 内容 --}}
</x-filament::modal>
```

![一个自定义宽度的 Modal](/assets/filament/v4.x/screenshots/images/light/components/modal/width.jpg)

## 点击外部关闭 Modal

默认情况下，当你点击 Modal 外部时，它会自动关闭。如果你想为特定操作禁用此行为，可以使用 `close-by-clicking-away` 属性：

```blade
<x-filament::modal :close-by-clicking-away="false">
    {{-- Modal 内容 --}}
</x-filament::modal>
```

## 按 Escape 键关闭 Modal

默认情况下，当你在 Modal 上按 Escape 键时，它会自动关闭。如果你想为特定操作禁用此行为，可以使用 `close-by-escaping` 属性：

```blade
<x-filament::modal :close-by-escaping="false">
    {{-- Modal 内容 --}}
</x-filament::modal>
```

## 隐藏 Modal 关闭按钮

默认情况下，带有头部的 Modal 在右上角有一个关闭按钮。你可以使用 `close-button` 属性从 Modal 中移除关闭按钮：

```blade
<x-filament::modal :close-button="false">
    <x-slot name="heading">
        Modal 标题
    </x-slot>

    {{-- Modal 内容 --}}
</x-filament::modal>
```

## 阻止 Modal 自动聚焦

默认情况下，Modal 在打开时会自动聚焦到第一个可聚焦元素。如果你想禁用此行为，可以使用 `autofocus` 属性：

```blade
<x-filament::modal :autofocus="false">
    {{-- Modal 内容 --}}
</x-filament::modal>
```

## 禁用 Modal 触发按钮

默认情况下，即使触发按钮被禁用，它也会打开 Modal，因为点击事件监听器注册在按钮本身的包装元素上。如果你想阻止 Modal 打开，还应该在触发插槽上使用 `disabled` 属性：

```blade
<x-filament::modal>
    <x-slot name="trigger" disabled>
        <x-filament::button :disabled="true">
            打开 Modal
        </x-filament::button>
    </x-slot>
    {{-- Modal 内容 --}}
</x-filament::modal>
```

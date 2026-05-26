---
title: 形态变换
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/morph.md
source_version: v3.8.0
translation_status: draft
---

当 Livewire 组件更新浏览器的 DOM 时，它会以一种智能的方式进行，我们称之为"形态变换"（morphing）。_morph_ 这个词与 _replace_（替换）相对。

Livewire 不会在每次组件更新时用新渲染的 HTML _替换_ 组件的当前 HTML，而是动态比较当前 HTML 与新 HTML，识别差异，并仅在需要更改的地方对 HTML 进行精确的局部修改。

这样做的好处是保留组件上已有的、未更改的元素。例如，事件监听器、焦点状态和表单输入值都会在 Livewire 更新之间保持不变。当然，与每次更新时清除并重新渲染新的 DOM 相比，形态变换还提供了更好的性能。

## 形态变换的工作原理

要理解 Livewire 如何在两次请求之间决定更新哪些元素，来看下面这个简单的 `Todos` 组件：

```php
class Todos extends Component
{
    public $todo = '';

    public $todos = [
        'first',
        'second',
    ];

    public function add()
    {
        $this->todos[] = $this->todo;
    }
}
```

```blade
<form wire:submit="add">
    <ul>
        @foreach ($todos as $item)
            <li>{{ $item }}</li>
        @endforeach
    </ul>

    <input wire:model="todo">
</form>
```

该组件的初始渲染将输出以下 HTML：

```html
<form wire:submit="add">
    <ul>
        <li>first</li>

        <li>second</li>
    </ul>

    <input wire:model="todo">
</form>
```

现在，假设你在输入框中输入了"third"并按下了 `[Enter]` 键。新渲染的 HTML 将变为：

```html
<form wire:submit="add">
    <ul>
        <li>first</li>

        <li>second</li>

        <li>third</li> <!-- [tl! add] -->
    </ul>

    <input wire:model="todo">
</form>
```

当 Livewire 处理组件更新时，它会将原始 DOM _形态变换_ 为新渲染的 HTML。以下是其工作原理的直观说明：

如你所见，Livewire 同时遍历两个 HTML 树。当它遇到两个树中的每个元素时，会比较它们是否有变化、新增或移除。如果检测到其中之一，它会精确地做出相应的局部修改。

## 形态变换的局限性

以下是形态变换算法无法正确识别 HTML 树中变更，进而导致应用出现问题的场景。

### 插入中间元素

考虑以下虚构的 `CreatePost` 组件的 Livewire Blade 模板：

```blade
<form wire:submit="save">
    <div>
        <input wire:model="title">
    </div>

    @if ($errors->has('title'))
        <div>{{ $errors->first('title') }}</div>
    @endif

    <div>
        <button>Save</button>
    </div>
</form>
```

如果用户尝试提交表单，但遇到了验证错误，会出现以下问题：

如你所见，当 Livewire 遇到新的错误消息 `<div>` 时，它不知道是应该原地修改现有的 `<div>`，还是在中间插入新的 `<div>`。

更明确地重述一下发生了什么：

* Livewire 在两个树中都遇到了第一个 `<div>`。它们相同，所以继续。
* Livewire 在两个树中都遇到了第二个 `<div>`，并认为它们是同一个 `<div>`，只是其中一个的内容发生了变化。因此，它不是将错误消息作为新元素插入，而是将 `<button>` 改为错误消息。
* 然后，在错误地修改了前一个元素后，Livewire 注意到比较末尾有一个额外的元素。它便在前一个元素之后创建并追加了该元素。
* 因此，本应只是简单移动的元素被销毁后重新创建。

这个场景是几乎所有与形态变换相关 bug 的根源。

这些问题的一些具体的负面影响包括：
* 事件监听器和元素状态在更新之间丢失
* 事件监听器和状态被错误地放置在错误的元素上
* 整个 Livewire 组件可能被重置或复制，因为 Livewire 组件也只是 DOM 树中的元素
* Alpine 组件和状态可能丢失或错位

幸运的是，Livewire 通过以下方法努力减轻了这些问题：

### 内部前瞻

Livewire 在其形态变换算法中有一个额外的步骤，在更改元素之前会检查后续元素及其内容。

这在许多情况下可以防止上述场景的发生。

以下是"前瞻"算法的工作原理说明：

### 注入形态变换标记

在后端，Livewire 会自动检测 Blade 模板中的条件语句，并将其包裹在 HTML 注释标记中，Livewire 的 JavaScript 可以在形态变换时将其作为引导使用。

以下是前面的 Blade 模板，但带有 Livewire 注入的标记：

```blade
<form wire:submit="save">
    <div>
        <input wire:model="title">
    </div>

    <!--[if BLOCK]><![endif]--> <!-- [tl! highlight] -->
    @if ($errors->has('title'))
        <div>Error: {{ $errors->first('title') }}</div>
    @endif
    <!--[if ENDBLOCK]><![endif]--> <!-- [tl! highlight] -->

    <div>
        <button>Save</button>
    </div>
</form>
```

有了这些注入到模板中的标记，Livewire 现在可以更容易地区分变更和新增。

此功能对 Livewire 应用极为有利，但由于它需要通过正则表达式解析模板，有时可能无法正确检测条件语句。如果此功能对你的应用弊大于利，可以通过应用 `config/livewire.php` 文件中的以下配置禁用它：

```php
'inject_morph_markers' => false,
```

#### 包裹条件语句

如果上述两种解决方案无法覆盖你的情况，避免形态变换问题的最可靠方法是将条件语句和循环语句包裹在它们自己始终存在的元素中。

例如，以下是用包裹 `<div>` 元素重写后的 Blade 模板：

```blade
<form wire:submit="save">
    <div>
        <input wire:model="title">
    </div>

    <div> <!-- [tl! highlight] -->
        @if ($errors->has('title'))
            <div>{{ $errors->first('title') }}</div>
        @endif
    </div> <!-- [tl! highlight] -->

    <div>
        <button>Save</button>
    </div>
</form>
```

现在条件语句已被包裹在一个持久存在的元素中，Livewire 就能正确地对两个不同的 HTML 树进行形态变换。

#### 绕过形态变换

如果你需要完全绕过某个元素的形态变换，可以使用 [wire:replace](/docs/livewire/v3.x/wire-replace) 来指示 Livewire 替换某个元素的所有子元素，而不是尝试对现有元素进行形态变换。

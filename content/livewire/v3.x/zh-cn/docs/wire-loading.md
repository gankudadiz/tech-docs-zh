---
title: wire:loading
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-loading.md
source_version: v3.8.0
translation_status: draft
---

加载指示器是打造良好用户界面的重要组成部分。它们能在向服务器发起请求时为用户提供视觉反馈，让用户知道正在等待某个过程完成。

## 基本用法

Livewire 提供了一套简单而强大的语法来控制加载指示器：`wire:loading`。在任意元素上添加 `wire:loading`，默认会将其隐藏（使用 CSS 的 `display: none`），并在向服务器发送请求时将其显示。

以下是一个 `CreatePost` 组件表单的基本示例，使用 `wire:loading` 来切换加载提示信息的显示：

```blade
<form wire:submit="save">
    <!-- ... -->

    <button type="submit">Save</button>

    <div wire:loading> <!-- [tl! highlight:2] -->
        Saving post...
    </div>
</form>
```

当用户按下"Save"时，在"save"动作执行期间，"Saving post..."消息会出现在按钮下方。当收到服务器响应并被 Livewire 处理后，该消息会消失。

### 移除元素

你也可以附加 `.remove` 来达到相反的效果：默认显示元素，在向服务器请求时将其隐藏：

```blade
<div wire:loading.remove>...</div>
```

## 切换类

除了切换整个元素的可见性，通常还需要在向服务器请求时通过切换 CSS 类来改变现有元素的样式。这种技术可用于改变背景色、降低不透明度、触发旋转动画等场景。

以下是一个简单示例，使用 [Tailwind](https://tailwindcss.com/) 的 `opacity-50` 类让"Save"按钮在表单提交时变淡：

```blade
<button wire:loading.class="opacity-50">Save</button>
```

与切换元素类似，你可以附加 `.remove` 来执行反向的类操作。在下面的示例中，按钮的 `bg-blue-500` 类会在按下"Save"按钮时被移除：

```blade
<button class="bg-blue-500" wire:loading.class.remove="bg-blue-500">
    Save
</button>
```

## 切换属性

默认情况下，当表单提交时，Livewire 会自动禁用提交按钮，并在表单处理期间为每个输入元素添加 `readonly` 属性。

除了此默认行为外，Livewire 还提供了 `.attr` 修饰符，允许你切换元素上的其他属性，或切换表单外部元素的属性：

```blade
<button
    type="button"
    wire:click="remove"
    wire:loading.attr="disabled"
>
    Remove
</button>
```

由于上面的按钮不是提交按钮，按下时不会受 Livewire 默认表单处理行为的禁用影响。我们手动添加了 `wire:loading.attr="disabled"` 来实现这一行为。

## 定位特定动作

默认情况下，`wire:loading` 会在组件向服务器发起任何请求时触发。

然而，在组件中有多个可以触发服务器请求的元素时，你应该将加载指示器作用域限定到单个动作。

例如，考虑下面的"保存文章"表单。除了提交表单的"Save"按钮外，可能还有一个"Remove"按钮，用于执行组件上的"remove"动作。

通过在 `wire:loading` 元素上添加 `wire:target`，你可以指示 Livewire 只在点击"Remove"按钮时显示加载提示信息：

```blade
<form wire:submit="save">
    <!-- ... -->

    <button type="submit">Save</button>

    <button type="button" wire:click="remove">Remove</button>

    <div wire:loading wire:target="remove">  <!-- [tl! highlight:2] -->
        Removing post...
    </div>
</form>
```

当上面的"Remove"按钮被按下时，"Removing post..."消息会显示给用户。但按下"Save"按钮时不会显示该消息。

### 定位多个动作

有时你可能希望 `wire:loading` 对页面上的一部分（而非全部）动作做出响应。在这种情况下，你可以通过逗号分隔将多个动作传递给 `wire:target`。例如：

```blade
<form wire:submit="save">
    <input type="text" wire:model.blur="title">

    <!-- ... -->

    <button type="submit">Save</button>

    <button type="button" wire:click="remove">Remove</button>

    <div wire:loading wire:target="save, remove">  <!-- [tl! highlight:2] -->
        Updating post...
    </div>
</form>
```

现在加载指示器（"Updating post..."）只会在按下"Remove"或"Save"按钮时显示，而不会在 `$title` 字段被发送到服务器时显示。

### 定位动作参数

当同一动作从页面上不同位置以不同参数触发时，你可以通过传入额外参数进一步限定 `wire:target` 的作用范围。例如，考虑以下场景：页面上每篇文章都有一个"Remove"按钮：

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h2>{{ $post->title }}</h2>

            <button wire:click="remove({{ $post->id }})">Remove</button>

            <div wire:loading wire:target="remove({{ $post->id }})">  <!-- [tl! highlight:2] -->
                Removing post...
            </div>
        </div>
    @endforeach
</div>
```

如果不将 `{{ $post->id }}` 传递给 `wire:target="remove"`，页面上的任意按钮被点击时都会显示"Removing post..."消息。

但是，由于我们为每个 `wire:target` 实例传入了唯一的参数，Livewire 只会在匹配的参数传递给"remove"动作时显示加载提示信息。

### 定位属性更新

Livewire 还允许你通过将属性名传递给 `wire:target` 指令来定位特定的组件属性更新。

考虑以下示例：一个名为 `username` 的表单输入使用 `wire:model.live` 在用户输入时进行实时验证：

```blade
<form wire:submit="save">
    <input type="text" wire:model.live="username">
    @error('username') <span>{{ $message }}</span> @enderror

    <div wire:loading wire:target="username"> <!-- [tl! highlight:2] -->
        Checking availability of username...
    </div>

    <!-- ... -->
</form>
```

当服务器随着用户在输入字段中键入而更新新的用户名时，"Checking availability..."消息会显示出来。

### 排除特定的加载目标

有时你可能希望为除某个特定属性或动作之外的每个 Livewire 请求都显示加载指示器。在这些情况下，可以使用 `wire:target.except` 修饰符：

```blade
<div wire:loading wire:target.except="download">...</div>
```

上面的加载指示器将针对组件上的每个 Livewire 更新请求显示，但"download"动作除外。

## 自定义 CSS display 属性

当元素上添加 `wire:loading` 时，Livewire 会更新该元素的 CSS `display` 属性来显示和隐藏元素。默认情况下，Livewire 使用 `none` 隐藏，使用 `inline-block` 显示。

如果你要切换的元素使用了 `inline-block` 以外的 display 值（如下例中的 `flex`），可以为 `wire:loading` 附加 `.flex`：

```blade
<div class="flex" wire:loading.flex>...</div>
```

以下是可用 display 值的完整列表：

```blade
<div wire:loading.inline-flex>...</div>
<div wire:loading.inline>...</div>
<div wire:loading.block>...</div>
<div wire:loading.table>...</div>
<div wire:loading.flex>...</div>
<div wire:loading.grid>...</div>
```

## 延迟加载指示器

在快速连接上，更新通常发生得非常快，导致加载指示器只在屏幕上短暂闪烁就被移除了。在这种情况下，指示器更像是一种干扰，而不是有用的提示。

因此，Livewire 提供了 `.delay` 修饰符来延迟指示器的显示。例如，像这样在元素上添加 `wire:loading.delay`：

```blade
<div wire:loading.delay>...</div>
```

上面的元素只有在请求耗时超过 200 毫秒时才会出现。如果请求在此之前完成，用户永远不会看到该指示器。

要自定义加载指示器的延迟时间，可以使用 Livewire 提供的便捷间隔别名：

```blade
<div wire:loading.delay.shortest>...</div> <!-- 50ms -->
<div wire:loading.delay.shorter>...</div>  <!-- 100ms -->
<div wire:loading.delay.short>...</div>    <!-- 150ms -->
<div wire:loading.delay>...</div>          <!-- 200ms -->
<div wire:loading.delay.long>...</div>     <!-- 300ms -->
<div wire:loading.delay.longer>...</div>   <!-- 500ms -->
<div wire:loading.delay.longest>...</div>  <!-- 1000ms -->
```

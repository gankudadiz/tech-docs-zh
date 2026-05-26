---
title: 嵌套
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/nesting.md
source_version: v3.8.0
translation_status: completed
---

Livewire 允许你在父组件中嵌套额外的 Livewire 组件。这个功能非常强大，因为它让你可以在整个应用程序中共享的 Livewire 组件中重用和封装行为。

:::warning[警告]
你可能不需要一个 Livewire 组件
在将模板的一部分提取到嵌套的 Livewire 组件之前，先问自己：这个组件中的内容需要是"动态"的吗？如果不需要，我们建议你创建一个简单的 [Blade 组件](https://laravel.com/docs/blade#components)。只有在组件能从 Livewire 的动态特性中受益，或者有明显的性能优势时，才创建 Livewire 组件。
:::

查阅我们关于 [Livewire 组件嵌套的深入技术分析](/docs/livewire/v3.x/understanding-nesting)，了解有关嵌套 Livewire 组件的性能、使用影响和约束的更多信息。

## 嵌套组件

要将 Livewire 组件嵌套在父组件中，只需在父组件的 Blade 视图中包含它即可。下面是一个 `Dashboard` 父组件示例，其中包含一个嵌套的 `TodoList` 组件：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Dashboard extends Component
{
    public function render()
    {
        return view('livewire.dashboard');
    }
}
```

```blade
<div>
    <h1>仪表盘</h1>

    <livewire:todo-list /> <!-- [tl! highlight] -->
</div>
```

在页面的初始渲染时，`Dashboard` 组件会遇到 `<livewire:todo-list />` 并在原位渲染它。在对 `Dashboard` 的后续网络请求中，嵌套的 `todo-list` 组件将跳过渲染，因为它在页面上已经是独立的组件。有关嵌套和渲染背后的技术概念的更多信息，请查阅我们关于[嵌套组件是"孤岛"](/docs/livewire/v3.x/understanding-nesting#every-component-is-an-island)的文档。

关于渲染组件的语法更多信息，请查阅我们的[渲染组件文档](/docs/livewire/v3.x/components#rendering-components)。

## 向子组件传递 Props

从父组件向子组件传递数据非常简单。实际上，它与向典型的 [Blade 组件](https://laravel.com/docs/blade#components) 传递 props 非常相似。

例如，让我们看一个 `TodoList` 组件，它将一个 `$todos` 集合传递给名为 `TodoCount` 的子组件：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class TodoList extends Component
{
    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

```blade
<div>
    <livewire:todo-count :todos="$todos" />

    <!-- ... -->
</div>
```

如你所见，我们使用语法 `:todos="$todos"` 将 `$todos` 传递给 `todo-count`。

现在 `$todos` 已传递给子组件，你可以通过子组件的 `mount()` 方法接收该数据：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Todo;

class TodoCount extends Component
{
    public $todos;

    public function mount($todos)
    {
        $this->todos = $todos;
    }

    public function render()
    {
        return view('livewire.todo-count', [
            'count' => $this->todos->count(),
        ]);
    }
}
```

:::tip[省略 `mount()` 的简便方式]
如果你觉得上面示例中的 `mount()` 方法是多余的样板代码，只要属性和参数名匹配，就可以省略它：
```php
public $todos; // [tl! highlight]
```
:::

### 传递静态 Props

在前面的示例中，我们使用 Livewire 的动态 prop 语法向子组件传递 props，该语法支持 PHP 表达式，如下所示：

```blade
<livewire:todo-count :todos="$todos" />
```

但是，有时你可能想向组件传递简单的静态值，例如字符串。在这些情况下，你可以省略语句开头的冒号：

```blade
<livewire:todo-count :todos="$todos" label="待办计数：" />
```

布尔值可以通过仅指定键来提供给组件。例如，要向组件传递一个值为 `true` 的 `$inline` 变量，我们可以简单地在组件标签上放置 `inline`：

```blade
<livewire:todo-count :todos="$todos" inline />
```

### 简化的属性语法

当向组件传递 PHP 变量时，变量名和 prop 名通常是相同的。为了避免重复写两次名称，Livewire 允许你只需在变量前加上冒号：

```blade
<livewire:todo-count :todos="$todos" /> <!-- [tl! remove] -->

<livewire:todo-count :$todos /> <!-- [tl! add] -->
```

## 在循环中渲染子组件

在循环中渲染子组件时，你应该为每次迭代包含一个唯一的 `key` 值。

组件 key 是 Livewire 在后续渲染中追踪每个组件的方式，特别是当组件已经被渲染过，或者多个组件在页面上被重新排列时。

你可以通过在子组件上指定一个 `:key` prop 来指定组件的 key：

```blade
<div>
    <h1>待办事项</h1>

    @foreach ($todos as $todo)
        <livewire:todo-item :$todo :key="$todo->id" />
    @endforeach
</div>
```

如你所见，每个子组件都有一个设置为每个 `$todo` ID 的唯一 key。这确保了如果待办事项被重新排序，key 仍然是唯一且可追踪的。

:::warning[警告]
Key 不是可选的
如果你使用过 Vue 或 Alpine 等前端框架，你熟悉在循环中为嵌套元素添加 key。但在这些框架中，key 不是_强制_的，意思是元素仍然会渲染，但重新排序可能无法正确追踪。然而，Livewire 更依赖 key，没有 key 将无法正常运行。
:::

## 响应式 Props

Livewire 的新手通常期望 props 默认是"响应式"的。换句话说，他们期望当父组件更改传递给子组件的 prop 值时，子组件会自动更新。但默认情况下，Livewire 的 props 不是响应式的。

使用 Livewire 时，[每个组件都是一个孤岛](/docs/livewire/v3.x/understanding-nesting#every-component-is-an-island)。这意味着当父组件触发更新并发送网络请求时，只有父组件的状态被发送到服务端重新渲染——而不是子组件的状态。这种行为背后的意图是只发送最少的数据在服务端和客户端之间来回传输，使更新尽可能高效。

但是，如果你希望或需要 prop 是响应式的，你可以使用 `#[Reactive]` 属性参数轻松启用此行为。

例如，下面是一个父组件 `TodoList` 的模板。其中渲染了一个 `TodoCount` 组件并传入了当前的待办列表：

```blade
<div>
    <h1>待办事项：</h1>

    <livewire:todo-count :$todos />

    <!-- ... -->
</div>
```

现在让我们在 `TodoCount` 组件中为 `$todos` prop 添加 `#[Reactive]`。完成后，父组件中添加或移除的任何待办事项都将自动触发 `TodoCount` 组件内的更新：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Reactive;
use Livewire\Component;
use App\Models\Todo;

class TodoCount extends Component
{
    #[Reactive] // [tl! highlight]
    public $todos;

    public function render()
    {
        return view('livewire.todo-count', [
            'count' => $this->todos->count(),
        ]);
    }
}
```

响应式属性是一个非常强大的功能，使 Livewire 更类似于 Vue 和 React 等前端组件库。但是，了解此功能的性能影响非常重要，只在特定场景有意义时才添加 `#[Reactive]`。

## 使用 `wire:model` 绑定子组件数据

在父组件和子组件之间共享状态的另一种强大模式是直接通过 Livewire 的 `Modelable` 功能在子组件上使用 `wire:model`。

当将输入元素提取到专用的 Livewire 组件中，同时仍然在父组件中访问其状态时，这种行为非常常见。

下面是一个父组件 `TodoList` 的示例，它包含一个 `$todo` 属性用于追踪用户即将添加的当前待办事项：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Todo;

class TodoList extends Component
{
    public $todo = '';

    public function add()
    {
        Todo::create([
            'content' => $this->pull('todo'),
        ]);
    }

    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

如 `TodoList` 模板所示，`wire:model` 被用于将 `$todo` 属性直接绑定到嵌套的 `TodoInput` 组件：

```blade
<div>
    <h1>待办事项</h1>

    <livewire:todo-input wire:model="todo" /> <!-- [tl! highlight] -->

    <button wire:click="add">添加待办</button>

    <div>
        @foreach ($todos as $todo)
            <livewire:todo-item :$todo :key="$todo->id" />
        @endforeach
    </div>
</div>
```

Livewire 提供了一个 `#[Modelable]` 属性，你可以将其添加到任何子组件属性上，使其可以从父组件进行"模型绑定"。

下面是 `TodoInput` 组件，在 `$value` 属性上方添加了 `#[Modelable]` 属性，以向 Livewire 表明如果父组件在该组件上声明了 `wire:model`，则应绑定到此属性：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Modelable;

class TodoInput extends Component
{
    #[Modelable] // [tl! highlight]
    public $value = '';

    public function render()
    {
        return view('livewire.todo-input');
    }
}
```

```blade
<div>
    <input type="text" wire:model="value" >
</div>
```

现在，父组件 `TodoList` 可以像对待其他输入元素一样对待 `TodoInput`，并使用 `wire:model` 直接绑定到它的值。

:::warning[警告]
目前 Livewire 只支持单个 `#[Modelable]` 属性，所以只有第一个会被绑定。
:::

## 监听来自子组件的事件

另一种强大的父子组件通信技术是 Livewire 的事件系统，它允许你在服务端或客户端分发事件，其他组件可以拦截这些事件。

我们的 [Livewire 事件系统完整文档](/docs/livewire/v3.x/events) 提供了关于事件的更详细信息，但下面我们将讨论一个使用事件来触发父组件更新的简单示例。

考虑一个具有显示和移除待办事项功能的 `TodoList` 组件：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Todo;

class TodoList extends Component
{
    public function remove($todoId)
    {
        $todo = Todo::find($todoId);

        $this->authorize('delete', $todo);

        $todo->delete();
    }

    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

```blade
<div>
    @foreach ($todos as $todo)
        <livewire:todo-item :$todo :key="$todo->id" />
    @endforeach
</div>
```

要从子组件 `TodoItem` 内部调用 `remove()`，你可以通过 `#[On]` 属性在 `TodoList` 上添加事件监听器：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Todo;
use Livewire\Attributes\On;

class TodoList extends Component
{
    #[On('remove-todo')] // [tl! highlight]
    public function remove($todoId)
    {
        $todo = Todo::find($todoId);

        $this->authorize('delete', $todo);

        $todo->delete();
    }

    public function render()
    {
        return view('livewire.todo-list', [
            'todos' => Auth::user()->todos,
        ]);
    }
}
```

一旦属性添加到动作上，你就可以从 `TodoList` 的子组件中分发 `remove-todo` 事件：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Todo;

class TodoItem extends Component
{
    public Todo $todo;

    public function remove()
    {
        $this->dispatch('remove-todo', todoId: $this->todo->id); // [tl! highlight]
    }

    public function render()
    {
        return view('livewire.todo-item');
    }
}
```

```blade
<div>
    <span>{{ $todo->content }}</span>

    <button wire:click="remove">移除</button>
</div>
```

现在，当在 `TodoItem` 中点击"移除"按钮时，父组件 `TodoList` 将拦截分发的事件并执行待办事项移除。

在父组件中移除待办事项后，列表将重新渲染，分发 `remove-todo` 事件的子组件将从页面中移除。

### 通过客户端分发提高性能

尽管上面的示例可以工作，但完成单个操作需要两次网络请求：

1. 第一次网络请求来自 `TodoItem` 组件，触发 `remove` 动作，分发 `remove-todo` 事件。
2. 第二次网络请求是在 `remove-todo` 事件在客户端分发给 `TodoList` 拦截并调用其 `remove` 动作之后。

你可以通过在客户端直接分发 `remove-todo` 事件来完全避免第一次请求。下面是一个更新后的 `TodoItem` 组件，在分发 `remove-todo` 事件时不触发网络请求：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Todo;

class TodoItem extends Component
{
    public Todo $todo;

    public function render()
    {
        return view('livewire.todo-item');
    }
}
```

```blade
<div>
    <span>{{ $todo->content }}</span>

    <button wire:click="$dispatch('remove-todo', { todoId: {{ $todo->id }} })">移除</button>
</div>
```

作为经验法则，尽可能优先选择客户端分发。

## 从子组件直接访问父组件

事件通信增加了一层间接性。父组件可能监听一个从未从子组件分发的事件，而子组件可能分发一个从未被父组件拦截的事件。

这种间接性有时是可取的；但在其他情况下，你可能更愿意直接从子组件访问父组件。

Livewire 允许你通过在 Blade 模板中提供一个神奇的 `$parent` 变量来实现这一点，你可以使用它直接从子组件访问父组件的动作和属性。下面是使用神奇的 `$parent` 变量重写的上述 `TodoItem` 模板，直接调用父组件上的 `remove()` 动作：

```blade
<div>
    <span>{{ $todo->content }}</span>

    <button wire:click="$parent.remove({{ $todo->id }})">移除</button>
</div>
```

事件和直接父组件通信是在父子组件之间进行双向通信的几种方式之一。理解它们的权衡使你能在特定场景下做出更明智的模式选择。

## 动态子组件

有时，你可能直到运行时才知道应该在页面上渲染哪个子组件。因此，Livewire 允许你通过 `<livewire:dynamic-component ...>` 在运行时选择子组件，它接收一个 `:is` prop：

```blade
<livewire:dynamic-component :is="$current" />
```

动态子组件在多种不同场景中都很有用，但下面是一个使用动态组件在多步骤表单中渲染不同步骤的示例：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Steps extends Component
{
    public $current = 'step-one';

    protected $steps = [
        'step-one',
        'step-two',
        'step-three',
    ];

    public function next()
    {
        $currentIndex = array_search($this->current, $this->steps);

        $this->current = $this->steps[$currentIndex + 1];
    }

    public function render()
    {
        return view('livewire.todo-list');
    }
}
```

```blade
<div>
    <livewire:dynamic-component :is="$current" :key="$current" />

    <button wire:click="next">下一步</button>
</div>
```

现在，如果 `Steps` 组件的 `$current` prop 设置为 "step-one"，Livewire 将渲染名为 "step-one" 的组件，如下所示：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class StepOne extends Component
{
    public function render()
    {
        return view('livewire.step-one');
    }
}
```

如果你愿意，可以使用替代语法：

```blade
<livewire:is :component="$current" :key="$current" />
```

:::warning[警告]
不要忘记为每个子组件分配唯一的 key。虽然 Livewire 会自动为 `<livewire:dynamic-child />` 和 `<livewire:is />` 生成 key，但同一个 key 将适用于_所有_子组件，这意味着后续渲染将被跳过。

请参阅[强制子组件重新渲染](#forcing-a-child-component-to-re-render)以更深入地了解 key 如何影响组件渲染。
:::

## 递归组件

虽然大多数应用程序很少需要，但 Livewire 组件可以递归嵌套，这意味着父组件可以将自身渲染为子组件。

想象一个包含 `SurveyQuestion` 组件的调查，该组件可以有附加到自身的子问题：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Question;

class SurveyQuestion extends Component
{
    public Question $question;

    public function render()
    {
        return view('livewire.survey-question', [
            'subQuestions' => $this->question->subQuestions,
        ]);
    }
}
```

```blade
<div>
    问题：{{ $question->content }}

    @foreach ($subQuestions as $subQuestion)
        <livewire:survey-question :question="$subQuestion" :key="$subQuestion->id" />
    @endforeach
</div>
```

:::warning[警告]
当然，递归的标准规则也适用于递归组件。最重要的是，你应该在模板中设置逻辑，以确保模板不会无限递归。在上面的示例中，如果 `$subQuestion` 包含原始问题作为其自己的 `$subQuestion`，就会发生无限循环。
:::

## 强制子组件重新渲染

在幕后，Livewire 会为其模板中的每个嵌套 Livewire 组件生成一个 key。

例如，考虑以下嵌套的 `todo-count` 组件：

```blade
<div>
    <livewire:todo-count :$todos />
</div>
```

Livewire 在内部将一个随机字符串 key 附加到组件上，如下所示：

```blade
<div>
    <livewire:todo-count :$todos key="lska" />
</div>
```

当父组件渲染并遇到上述子组件时，它会将 key 存储在附加到父组件的子组件列表中：

```php
'children' => ['lska'],
```

Livewire 在后续渲染中使用此列表作为参考，以检测子组件是否已在先前请求中渲染过。如果已渲染，则跳过该组件。记住，[嵌套组件是孤岛](/docs/livewire/v3.x/understanding-nesting#every-component-is-an-island)。但是，如果子组件的 key 不在列表中，意味着它尚未渲染，Livewire 将创建组件的新实例并在原位渲染。

这些细微差别都是幕后的行为，大多数用户不需要了解；然而，在子组件上设置 key 的概念是控制子渲染的强大工具。

利用这一点，如果你想强制组件重新渲染，只需更改其 key。

下面是一个示例，如果传递给 `todo-count` 组件的 `$todos` 发生变化，我们可能希望销毁并重新初始化该组件：

```blade
<div>
    <livewire:todo-count :todos="$todos" :key="$todos->pluck('id')->join('-')" />
</div>
```

如上所示，我们基于 `$todos` 的内容生成一个动态的 `:key` 字符串。这样，`todo-count` 组件将正常运行，直到 `$todos` 本身发生变化。此时，组件将被完全重新初始化，旧组件将被丢弃。

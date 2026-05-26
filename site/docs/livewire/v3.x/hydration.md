---
title: 水合与脱水
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/hydration.md
source_version: v3.8.0
translation_status: draft
---

使用 Livewire 就像将一个服务端 PHP 类直接挂载到网页浏览器上。比如直接从按钮点击调用服务端方法这种事情，支持了这种错觉。但实际上，这确实只是一种错觉。

在底层，Livewire 的行为实际上更接近标准的 Web 应用。它向浏览器渲染静态 HTML，监听浏览器事件，然后发起 AJAX 请求来调用服务端代码。

因为 Livewire 向服务器发出的每个 AJAX 请求都是"无状态"的（意味着没有长期运行的后端进程保持组件状态），Livewire 必须在进行任何更新之前重新创建组件的上一次已知状态。

它通过在每次服务端更新后对 PHP 组件进行"快照"（snapshot）来实现这一点，这样组件就可以在下一次请求中被重新创建或*恢复*。

在本文档中，我们将获取快照的过程称为"脱水"（dehydration），将根据快照重新创建组件的过程称为"水合"（hydration）。

## 脱水

当 Livewire 对一个服务端组件进行_脱水_时，它会做两件事：

* 将组件的模板渲染为 HTML
* 创建组件的 JSON 快照

### 渲染 HTML

在组件挂载或更新完成后，Livewire 调用组件的 `render()` 方法将 Blade 模板转换为原始 HTML。

以下面的 `Counter` 组件为例：

```php
class Counter extends Component
{
    public $count = 1;

    public function increment()
    {
        $this->count++;
    }

    public function render()
    {
        return <<<'HTML'
        <div>
            Count: {{ $count }}

            <button wire:click="increment">+</button>
        </div>
        HTML;
    }
}
```

每次挂载或更新后，Livewire 会将上述 `Counter` 组件渲染为以下 HTML：

```html
<div>
    Count: 1

    <button wire:click="increment">+</button>
</div>
```

### 快照

为了在下一次请求时在服务器上重新创建 `Counter` 组件，Livewire 会创建一个 JSON 快照，尝试尽可能多地捕获组件状态：

```js
{
    state: {
        count: 1,
    },

    memo: {
        name: 'counter',

        id: '1526456',
    },
}
```

注意快照中有两个不同的部分：`memo` 和 `state`。

`memo` 部分用于存储识别和重新创建组件所需的信息，而 `state` 部分存储组件所有公共属性的值。

:::info[关于快照]
以上快照是 Livewire 中实际快照的精简版本。在实际应用中，快照包含更多的信息，比如验证错误、子组件列表、区域设置等。要更详细地了解快照对象，可以参考[快照模式文档](/docs/livewire/v3.x/javascript#the-snapshot-object)。
:::

### 将快照嵌入 HTML

当组件首次渲染时，Livewire 会将快照以 JSON 形式存储在名为 `wire:snapshot` 的 HTML 属性中。这样，Livewire 的 JavaScript 核心就可以提取 JSON 并将其转换为运行时对象：

```html
<div wire:id="..." wire:snapshot="{ state: {...}, memo: {...} }">
    Count: 1

    <button wire:click="increment">+</button>
</div>
```

## 水合

当触发组件更新时，例如点击 `Counter` 组件中的"+"按钮，类似以下的负载会被发送到服务器：

```js
{
    calls: [
        { method: 'increment', params: [] },
    ],

    snapshot: {
        state: {
            count: 1,
        },

        memo: {
            name: 'counter',

            id: '1526456',
        },
    }
}
```

在 Livewire 能够调用 `increment` 方法之前，它必须首先创建一个新的 `Counter` 实例，并用快照中的状态进行初始化。

以下是实现此结果的 PHP 伪代码：

```php
$state = request('snapshot.state');
$memo = request('snapshot.memo');

$instance = Livewire::new($memo['name'], $memo['id']);

foreach ($state as $property => $value) {
    $instance[$property] = $value;
}
```

如果你跟随上述脚本，你会看到在创建 `Counter` 对象后，其公共属性会根据快照提供的状态进行设置。

## 高级水合

上面的 `Counter` 示例很好地演示了水合的概念；然而，它只演示了 Livewire 如何处理简单值（如整数 `1`）的水合。

你可能知道，Livewire 支持许多比整数更复杂的属性类型。

让我们来看一个稍微复杂一些的例子——一个 `Todos` 组件：

```php
class Todos extends Component
{
    public $todos;

    public function mount() {
        $this->todos = collect([
            'first',
            'second',
            'third',
        ]);
    }
}
```

如你所见，我们将 `$todos` 属性设置为一个 [Laravel 集合](https://laravel.com/docs/collections#main-content)，其中包含三个字符串作为其内容。

单独的 JSON 无法表示 Laravel 集合，因此 Livewire 创建了自己的模式，在快照中为纯数据关联元数据。

以下是该 `Todos` 组件的快照 state 对象：

```js
state: {
    todos: [
        [ 'first', 'second', 'third' ],
        { s: 'clctn', class: 'Illuminate\\Support\\Collection' },
    ],
},
```

如果你期望的是类似以下更直接的表示方式，可能会感到困惑：

```js
state: {
    todos: [ 'first', 'second', 'third' ],
},
```

然而，如果 Livewire 仅根据这段数据来水合组件，它将无法知道这是一个集合，而不是一个普通数组。

因此，Livewire 支持一种替代的状态语法，采用元组（一个包含两个元素的数组）的形式：

```js
todos: [
    [ 'first', 'second', 'third' ],
    { s: 'clctn', class: 'Illuminate\\Support\\Collection' },
],
```

当 Livewire 在水合组件状态时遇到元组，它会使用元组第二个元素中存储的信息来更智能地水合第一个元素中存储的状态。

为了更清楚地演示，以下是简化的代码，展示 Livewire 如何根据上述快照重新创建集合属性：

```php
[ $state, $metadata ] = request('snapshot.state.todos');

$collection = new $metadata['class']($state);
```

如你所见，Livewire 使用与状态关联的元数据来推导完整的集合类。

### 深层嵌套的元组

这种方法的显著优势之一是能够对深层嵌套的属性进行脱水和水合。

例如，考虑上面的 `Todos` 示例，但现在集合的第三项是一个 [Laravel Stringable](https://laravel.com/docs/helpers#method-str) 而不是普通字符串：

```php
class Todos extends Component
{
    public $todos;

    public function mount() {
        $this->todos = collect([
            'first',
            'second',
            str('third'),
        ]);
    }
}
```

该组件状态的脱水快照现在看起来像这样：

```js
todos: [
    [
        'first',
        'second',
        [ 'third', { s: 'str' } ],
    ],
    { s: 'clctn', class: 'Illuminate\\Support\\Collection' },
],
```

如你所见，集合中的第三项已被脱水为元数据元组。元组的第一个元素是纯字符串值，第二个元素是一个标志，告诉 Livewire 这个字符串是一个 _stringable_。

### 支持自定义属性类型

在内部，Livewire 为最常见的 PHP 和 Laravel 类型提供了水合支持。然而，如果你希望支持未支持的类型，可以使用 [Synthesizers](/docs/livewire/v3.x/synthesizers) —— Livewire 用于水合/脱水非基础属性类型的内部机制。

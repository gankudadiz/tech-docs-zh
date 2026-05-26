---
title: 属性
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/properties.md
source_version: v3.8.0
translation_status: completed
---

属性用于在 Livewire 组件中存储和管理数据。它们被定义为组件类上的公共属性，可以在服务端和客户端进行访问和修改。

## 初始化属性

你可以在组件的 `mount()` 方法中为属性设置初始值。

请看下面的例子：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

// 所有 Livewire 组件都继承自 Component 基类
class TodoList extends Component
{
    // 声明两个公共属性：todos 存储已有待办列表，todo 存储当前输入
    public $todos = [];

    public $todo = '';

    // mount() 是 Livewire 组件的初始化方法，仅在首次渲染时调用一次
    public function mount()
    {
        // 从当前已认证用户加载已有待办事项，填充到 todos 属性
        $this->todos = Auth::user()->todos; // [tl! highlight]
    }

    // ...
}
```

在这个例子中，我们定义了一个空的 `todos` 数组，并用当前已认证用户的待办事项对其进行了初始化。这样，当组件首次渲染时，数据库中所有现有的待办事项都会显示给用户。

## 批量赋值

有时在 `mount()` 方法中逐个初始化多个属性会显得冗长。为了简化此操作，Livewire 提供了 `fill()` 方法，让你可以通过一个关联数组同时为多个属性赋值，从而减少 `mount()` 中的重复代码。

例如：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    // 保存从路由隐式绑定的 Post 模型实例
    public $post;

    // 待批量填充的标量属性
    public $title;

    public $description;

    // mount() 支持 Laravel 路由模型绑定，自动注入匹配的 Post 实例
    public function mount(Post $post)
    {
        $this->post = $post;

        // fill() 接收关联数组并一次性赋值给对应属性
        // $post->only(...) 返回 ['title' => ..., 'description' => ...]
        $this->fill( // [tl! highlight]
            $post->only('title', 'description'), // [tl! highlight]
        ); // [tl! highlight]
    }

    // ...
}
```

因为 `$post->only(...)` 返回一个由模型属性和值组成的关联数组（基于传入的字段名），`$title` 和 `$description` 属性将被初始化为数据库中 `$post` 模型对应的 `title` 和 `description` 值，无需逐个设置。

## 数据绑定

Livewire 通过 `wire:model` HTML 属性支持双向数据绑定。这让你可以轻松地在组件属性和 HTML 输入之间同步数据，保持用户界面与组件状态一致。

让我们在 `TodoList` 组件的输入框上使用 `wire:model` 绑定 `$todo` 属性：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class TodoList extends Component
{
    public $todos = [];

    public $todo = '';

    // add() 是 Livewire 动作，通过 wire:click 从 Blade 模板触发
    public function add()
    {
        // 将当前输入框中的 $todo 追加到 $todos 列表末尾
        $this->todos[] = $this->todo;

        // 追加后清空输入框，方便用户输入下一个待办
        $this->todo = '';
    }

    // ...
}
```

```blade
<div>
    <!-- wire:model="todo" 实现双向数据绑定：输入变化同步到 $todo，反之亦然 -->
    <input type="text" wire:model="todo" placeholder="待办事项..."> <!-- [tl! highlight] -->

    <!-- wire:click="add" 表示点击时触发服务端组件中的 add() 方法 -->
    <button wire:click="add">添加待办</button>

    <ul>
        <!-- Blade 的 @foreach 直接读取 $todos 属性渲染待办列表 -->
        @foreach ($todos as $todo)
            <li>{{ $todo }}</li>
        @endforeach
    </ul>
</div>
```

在上面的例子中，当点击"添加待办"按钮时，文本输入框的值将与服务端的 `$todo` 属性同步。

这只是 `wire:model` 的基本用法。关于数据绑定的更多信息，请查看我们的[表单文档](/docs/livewire/v3.x/forms)。

## 重置属性

有时你需要在用户执行某个操作后将属性重置为初始状态。Livewire 提供了 `reset()` 方法，它接受一个或多个属性名，并将其值重置为初始状态。

在下面的例子中，我们可以使用 `$this->reset()` 在点击"添加待办"按钮后重置 `todo` 字段，避免代码重复：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class ManageTodos extends Component
{
    public $todos = [];

    public $todo = '';

    public function addTodo()
    {
        $this->todos[] = $this->todo;

        // reset() 将指定属性重置为其声明时的初始值（空字符串）
        // 这里避免手动写 $this->todo = ''，减少重复代码
        $this->reset('todo'); // [tl! highlight]
    }

    // ...
}
```

在上面的例子中，用户点击"添加待办"后，包含刚添加的待办事项的输入框会被清空，让用户可以输入新的待办事项。

:::warning[警告]
`reset()` 不适用于在 `mount()` 中设置的值
`reset()` 会将属性重置为调用 `mount()` 方法之前的状态。如果你在 `mount()` 中将该属性初始化为不同的值，则需要手动重置该属性。
:::

## 取出属性

你也可以使用 `pull()` 方法在一次操作中同时重置和获取值。

下面是上面例子的简化版本，使用了 `pull()`：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class ManageTodos extends Component
{
    public $todos = [];

    public $todo = '';

    public function addTodo()
    {
        // pull('todo') 相当于先 $this->todo 再 $this->reset('todo')
        // 获取 $todo 的当前值并立即重置，一行代码完成两件事
        $this->todos[] = $this->pull('todo'); // [tl! highlight]
    }

    // ...
}
```

`pull()` 也支持批量操作，效果等同于 `all()`/`only()` 与 `reset()` 的组合：

```php
// 获取所有属性并全部重置，相当于 $this->all() 加 $this->reset()
$this->pull();

// 只获取指定属性并只重置它们，相当于 $this->only(...) 加 $this->reset(...)
$this->pull(['title', 'content']);
```

## 支持的属性类型

由于 Livewire 在服务端请求之间管理组件数据的独特方式，它只支持有限的属性类型。

Livewire 组件中的每个属性在请求之间会被序列化（"脱水"）为 JSON，然后在下一个请求中从 JSON 重新"水合"回 PHP。

这种双向转换过程存在一定限制，因此限制了 Livewire 可以处理的属性类型。

### 原始类型

Livewire 支持字符串、整数等原始类型。这些类型可以轻松地与 JSON 相互转换，非常适合用作 Livewire 组件中的属性。

Livewire 支持以下原始属性类型：`Array`（数组）、`String`（字符串）、`Integer`（整数）、`Float`（浮点数）、`Boolean`（布尔值）和 `Null`（空值）。

```php
class TodoList extends Component
{
    // 以下属性展示了 Livewire 支持的所有原始类型

    public $todos = []; // Array — 空数组，需在 mount() 中填充

    public $todo = ''; // String — 空字符串作为默认值

    public $maxTodos = 10; // Integer — 限制最大待办数量

    public $showTodos = false; // Boolean — 控制是否显示列表

    public $todoFilter; // Null — 未初始化时默认为 null
}
```

### 常见 PHP 类型

除了原始类型，Livewire 还支持 Laravel 应用程序中常用的 PHP 对象类型。但需要注意的是，这些类型在每次请求时会被_脱水_为 JSON，再_水合_回 PHP。这意味着该属性可能无法保留运行时的值（如闭包）。此外，对象的类名等信息可能会暴露给 JavaScript。

支持的 PHP 类型：

| 类型 | 完整类名 |
|------|---------|
| BackedEnum | `BackedEnum` |
| Collection | `Illuminate\Support\Collection` |
| Eloquent Collection | `Illuminate\Database\Eloquent\Collection` |
| Model | `Illuminate\Database\Eloquent\Model` |
| DateTime | `DateTime` |
| Carbon | `Carbon\Carbon` |
| Stringable | `Illuminate\Support\Stringable` |

:::warning[警告]
Eloquent 集合和模型
当在 Livewire 属性中存储 Eloquent 集合和模型时，额外的查询约束（如 `select(...)`）在后续请求中不会重新应用。

更多信息请参阅 [Eloquent 约束在请求之间不保留](#eloquent-约束在请求之间不保留)。
:::

以下是设置这些不同类型属性的简单示例：

```php
public function mount()
{
    // Laravel 基础集合
    $this->todos = collect([]); // Collection

    // Eloquent 查询全部记录，返回 Eloquent Collection
    $this->todos = Todos::all(); // Eloquent Collection

    // 取单个 Eloquent 模型实例
    $this->todo = Todos::first(); // Model

    // PHP 原生日期类
    $this->date = new DateTime('now'); // DateTime

    // Carbon 扩展日期类（Laravel 默认日期库）
    $this->date = new Carbon('now'); // Carbon

    // Laravel 的字符串链式操作封装
    $this->todo = str(''); // Stringable
}
```

### 支持自定义类型

Livewire 允许你的应用程序通过两种强大的机制支持自定义类型：

* Wireables
* Synthesizers

对于大多数应用程序来说，Wireables 简单易用，因此我们将在下面进行介绍。如果你是高级用户或包作者，需要更高的灵活性，[Synthesizers 是更好的选择](/docs/livewire/v3.x/synthesizers)。

#### Wireables

Wireables 是应用程序中实现了 `Wireable` 接口的任何类。

例如，假设你的应用程序中有一个 `Customer` 对象，其中包含客户的主要数据：

```php
// 普通的 PHP 类，没有实现 Livewire 的特殊接口
class Customer
{
    protected $name;
    protected $age;

    public function __construct($name, $age)
    {
        $this->name = $name;
        $this->age = $age;
    }
}
```

尝试将此类的实例设置为 Livewire 组件属性将导致错误，提示不支持该 `Customer` 属性类型：

```php
class ShowCustomer extends Component
{
    // 即使使用 PHP 类型声明，Livewire 也不知道如何序列化这个类型
    public Customer $customer;

    public function mount()
    {
        // 直接赋值会抛出异常：Property type [Customer] not supported
        $this->customer = new Customer('Caleb', 29);
    }
}
```

但是，你可以通过实现 `Wireable` 接口，并在类中添加 `toLivewire()` 和 `fromLivewire()` 方法来解决这个问题。这些方法告诉 Livewire 如何将此类型的属性转换为 JSON 以及如何从 JSON 还原：

```php
use Livewire\Wireable;

// 实现 Wireable 接口后，Livewire 就懂得如何序列化/反序列化这个类
class Customer implements Wireable
{
    protected $name;
    protected $age;

    public function __construct($name, $age)
    {
        $this->name = $name;
        $this->age = $age;
    }

    // 将对象序列化为纯数组，供 Livewire 脱水为 JSON
    public function toLivewire()
    {
        return [
            'name' => $this->name,
            'age' => $this->age,
        ];
    }

    // 从 JSON 还原时，Livewire 调用此方法重新构造对象
    public static function fromLivewire($value)
    {
        $name = $value['name'];
        $age = $value['age'];

        return new static($name, $age);
    }
}
```

现在，你可以自由地在 Livewire 组件上设置 `Customer` 对象，Livewire 将知道如何将这些对象转换为 JSON 并还原为 PHP。

如前所述，如果你希望更全局、更强大地支持类型，Livewire 提供了 Synthesizers，这是其处理不同属性类型的高级内部机制。[了解更多关于 Synthesizers 的信息](/docs/livewire/v3.x/synthesizers)。

## 从 JavaScript 访问属性

由于 Livewire 属性也可以通过 JavaScript 在浏览器中使用，因此你可以从 [AlpineJS](https://alpinejs.dev/) 访问和操作它们的 JavaScript 表示形式。

Alpine 是一个轻量级的 JavaScript 库，随 Livewire 一起提供。Alpine 提供了一种在 Livewire 组件中构建轻量级交互的方式，无需完整的服务端往返。

在内部，Livewire 的前端是构建在 Alpine 之上的。实际上，每个 Livewire 组件在底层都是一个 Alpine 组件。这意味着你可以自由地在 Livewire 组件中使用 Alpine。

本页剩余部分假定你对 Alpine 有基本了解。如果你不熟悉 Alpine，[请查看 Alpine 文档](https://alpinejs.dev/docs)。

### 访问属性

Livewire 向 Alpine 暴露了一个神奇的 `$wire` 对象。你可以从 Livewire 组件内的任何 Alpine 表达式中访问 `$wire` 对象。

`$wire` 对象可以看作是 Livewire 组件的 JavaScript 版本。它具有与 PHP 版本相同的所有属性和方法，还包含一些专用方法用于在你的模板中执行特定功能。

例如，我们可以使用 `$wire` 来实时显示 `todo` 输入框的字符数：

```blade
<div>
    <!-- wire:model 保持服务端 $todo 与输入框值同步 -->
    <input type="text" wire:model="todo">

    <!-- x-text 是 Alpine 指令，$wire.todo.length 读取客户端缓存的属性长度 -->
    <!-- 整个过程无需服务端通信，纯前端实时更新 -->
    待办字符长度：<h2 x-text="$wire.todo.length"></h2>
</div>
```

当用户在输入框中输入时，当前待办事项的字符长度会显示在页面中并实时更新，无需向服务端发送网络请求。

如果你愿意，也可以使用更明确的 `.get()` 方法实现相同的效果：

```blade
<div>
    <input type="text" wire:model="todo">

    <!-- $wire.get('todo') 显式获取属性值，与直接 $wire.todo 效果相同 -->
    待办字符长度：<h2 x-text="$wire.get('todo').length"></h2>
</div>
```

### 操作属性

同样，你可以在 JavaScript 中使用 `$wire` 来操作 Livewire 组件的属性。

例如，让我们为 `TodoList` 组件添加一个"清空"按钮，让用户可以仅使用 JavaScript 重置输入框：

```blade
<div>
    <input type="text" wire:model="todo">

    <!-- x-on:click 是 Alpine 的点击事件处理器 -->
    <!-- $wire.todo = '' 直接在客户端更新属性，不发送网络请求 -->
    <button x-on:click="$wire.todo = ''">清空</button>
</div>
```

用户点击"清空"后，输入框将被重置为空字符串，无需向服务端发送网络请求。

在后续请求中（如点击"添加待办"时），服务端的 `$todo` 值将被更新并同步。

如果你愿意，也可以使用更明确的 `.set()` 方法来在客户端设置属性。但需要注意的是，使用 `.set()` 默认会立即触发网络请求并与服务端同步状态。如果你需要这种行为，那么这是一个极好的 API：

```blade
<!-- $wire.set() 默认触发网络请求，立即同步到服务端 -->
<button x-on:click="$wire.set('todo', '')">清空</button>
```

为了在不向服务端发送网络请求的情况下更新属性，你可以传入第三个布尔参数 `false`。这将延迟网络请求，在后续请求时状态将在服务端同步：

```blade
<!-- 第三个参数 false 表示仅更新客户端，延迟到下次请求再同步服务端 -->
<button x-on:click="$wire.set('todo', '', false)">清空</button>
```

## 安全问题

虽然 Livewire 属性是一个强大的功能，但在使用之前需要注意一些安全方面的考虑。

简而言之，始终将公共属性视为用户输入——就像传统接口中的请求输入一样。因此，在将属性持久化到数据库之前，必须对它们进行验证和授权——就像在处理控制器中的请求输入时一样。

### 不要信任属性值

为了演示忽略授权和验证属性可能给应用程序带来的安全漏洞，下面的 `UpdatePost` 组件容易受到攻击：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    // 安全隐患：$id 作为公共属性，客户端可以任意修改
    public $id;
    public $title;
    public $content;

    public function mount(Post $post)
    {
        // 通过路由模型绑定注入原始文章数据
        $this->id = $post->id;
        $this->title = $post->title;
        $this->content = $post->content;
    }

    public function update()
    {
        // 存在漏洞：$this->id 可能已被客户端篡改为其他文章 ID
        $post = Post::findOrFail($this->id);

        // 如果 $id 被篡改，此处会更新非预期的文章
        $post->update([
            'title' => $this->title,
            'content' => $this->content,
        ]);

        session()->flash('message', '文章更新成功！');
    }

    public function render()
    {
        return view('livewire.update-post');
    }
}
```

```blade
<!-- 模板中只绑定了 title 和 content，没有绑定 id 的输入框 -->
<form wire:submit="update">
    <input type="text" wire:model="title">
    <input type="text" wire:model="content">

    <button type="submit">更新</button>
</form>
```

初看之下，这个组件可能完全正常。但是，让我们看看攻击者如何利用该组件在你的应用程序中进行未经授权的操作。

因为我们将文章的 `id` 作为公共属性存储在组件上，所以它可以在客户端像 `title` 和 `content` 属性一样被篡改。

即使我们没有编写带有 `wire:model="id"` 的输入框也无济于事。恶意用户可以轻松地使用浏览器的开发者工具将视图修改为以下内容：

```blade
<!-- 攻击者通过 DevTools 手动添加了 wire:model="id" 的输入框 -->
<form wire:submit="update">
    <input type="text" wire:model="id"> <!-- [tl! highlight] -->
    <input type="text" wire:model="title">
    <input type="text" wire:model="content">

    <button type="submit">更新</button>
</form>
```

现在，恶意用户可以将 `id` 输入框修改为其他文章模型的 ID。当表单提交并调用 `update()` 时，`Post::findOrFail()` 将返回并更新该用户没有所有权的文章。

为了防止此类攻击，我们可以使用以下一种或两种策略：

* 授权输入
* 锁定属性，防止更新

#### 授权输入

由于 `$id` 可以通过类似 `wire:model` 的方式在客户端被篡改，就像在控制器中一样，我们可以使用 [Laravel 的授权功能](https://laravel.com/docs/authorization) 来确保当前用户可以更新文章：

```php
public function update()
{
    $post = Post::findOrFail($this->id);

    // 即使 $id 被篡改，authorize() 会检查当前用户是否有权更新该文章
    $this->authorize('update', $post); // [tl! highlight]

    $post->update(...);
}
```

如果恶意用户篡改了 `$id` 属性，添加的授权机制将捕获到并抛出错误。

#### 锁定属性

Livewire 还允许你"锁定"属性，以防止属性在客户端被修改。你可以使用 `#[Locked]` 属性来"锁定"属性，防止客户端篡改：

```php
use Livewire\Attributes\Locked;
use Livewire\Component;

class UpdatePost extends Component
{
    // #[Locked] 属性标记后，任何客户端的修改操作都会抛出异常
    #[Locked] // [tl! highlight]
    public $id;

    // ...
}
```

现在，如果用户尝试在前端修改 `$id`，将会抛出错误。

通过使用 `#[Locked]`，你可以确信此属性在组件类之外没有被篡改。

关于锁定属性的更多信息，[请查看 Locked 属性文档](/docs/livewire/v3.x/locked)。

#### Eloquent 模型与锁定

当 Eloquent 模型被赋值给 Livewire 组件属性时，Livewire 会自动锁定该属性，确保 ID 不被更改，从而使你免受此类攻击：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    // 类型声明为 Eloquent Model 后，Livewire 会自动锁定其主键
    // 即使客户端尝试修改 $post 的 ID，Livewire 也会阻止
    public Post $post; // [tl! highlight]
    public $title;
    public $content;

    public function mount(Post $post)
    {
        $this->post = $post;
        $this->title = $post->title;
        $this->content = $post->content;
    }

    public function update()
    {
        // $this->post 的 ID 是安全的，不会被客户端篡改
        $this->post->update([
            'title' => $this->title,
            'content' => $this->content,
        ]);

        session()->flash('message', '文章更新成功！');
    }

    public function render()
    {
        return view('livewire.update-post');
    }
}
```

### 属性会将系统信息暴露给浏览器

另一个需要记住的关键点是，Livewire 属性在发送到浏览器之前会被序列化（"脱水"）。这意味着它们的值会被转换成一种可以通过网络传输且能被 JavaScript 理解的格式。这种格式可能会将应用程序的信息暴露给浏览器，包括属性的名称和类名。

例如，假设你有一个 Livewire 组件，定义了一个名为 `$post` 的公共属性。该属性包含了数据库中 `Post` 模型的一个实例。在这种情况下，通过线路发送的该属性的脱水值可能如下所示：

```json
{
    "type": "model",
    "class": "App\Models\Post",
    "key": 1,
    "relationships": []
}
```

如你所见，`$post` 属性的脱水值包含了模型的类名（`App\Models\Post`）以及 ID 和任何已预加载的关系。

如果你不希望暴露模型的类名，可以在服务提供程序中使用 Laravel 的 `morphMap` 功能，为模型类名分配一个别名：

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // morphMap 为模型类名注册别名，脱水时使用别名而非完整类名
        // 这样浏览器端看到的 class 字段是 'post' 而不是 'App\Models\Post'
        Relation::morphMap([
            'post' => 'App\Models\Post',
        ]);
    }
}
```

现在，当 Eloquent 模型被"脱水"（序列化）时，原始的类名不会暴露，只会暴露 "post" 别名：

```json
{
    "type": "model",
    "class": "App\Models\Post", // [tl! remove]
    "class": "post", // [tl! add]
    "key": 1,
    "relationships": []
}
```

### Eloquent 约束在请求之间不保留

通常，Livewire 能够在请求之间保留并重新创建服务端属性；但是，在某些情况下，无法在请求之间保留值。

例如，当将 Eloquent 集合存储为 Livewire 属性时，额外的查询约束（如 `select(...)`）在后续请求中不会重新应用。

为演示这一点，请考虑下面的 `ShowTodos` 组件，它对 `Todos` Eloquent 集合应用了 `select()` 约束：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class ShowTodos extends Component
{
    // 公共属性存储 Eloquent 集合时，select 约束不会跨请求保留
    public $todos;

    public function mount()
    {
        $this->todos = Auth::user()
            ->todos()
            ->select(['title', 'content']) // [tl! highlight]
            ->get();
    }

    public function render()
    {
        return view('livewire.show-todos');
    }
}
```

当此组件首次加载时，`$todos` 属性将被设置为该用户待办事项的 Eloquent 集合；但是，数据库中每行的只有 `title` 和 `content` 字段被查询并加载到每个模型中。

当 Livewire 在后续请求中将该属性的 JSON 重新_水合_为 PHP 时，select 约束将丢失。

为确保 Eloquent 查询的完整性，我们建议你使用[计算属性](/docs/livewire/v3.x/computed-properties)代替常规属性。

计算属性是组件中使用 `#[Computed]` 属性标记的方法。它们可以作为动态属性访问，不作为组件状态的一部分存储，而是按需实时计算。

下面是使用计算属性重写的上述示例：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;

class ShowTodos extends Component
{
    // #[Computed] 将方法标记为计算属性，每次请求都会重新执行
    // 不会序列化到客户端，也不存在跨请求约束丢失的问题
    #[Computed] // [tl! highlight]
    public function todos()
    {
        return Auth::user()
            ->todos()
            ->select(['title', 'content'])
            ->get();
    }

    public function render()
    {
        return view('livewire.show-todos');
    }
}
```

以下是在 Blade 视图中访问这些 _todos_ 的方式：

```blade
<ul>
    <!-- 在 Blade 中必须通过 $this->todos 访问计算属性 -->
    <!-- 不能直接使用 $todos，因为计算属性不是普通变量 -->
    @foreach ($this->todos as $todo)
        <li>{{ $todo }}</li>
    @endforeach
</ul>
```

注意，在视图中，你只能通过 `$this` 对象访问计算属性，像这样：`$this->todos`。

你也可以在类内部访问 `$todos`。例如，如果你有一个 `markAllAsComplete()` 动作：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;

class ShowTodos extends Component
{
    #[Computed]
    public function todos()
    {
        return Auth::user()
            ->todos()
            ->select(['title', 'content'])
            ->get();
    }

    // 在类方法中也可以通过 $this->todos 访问计算属性
    // 计算属性在同一请求内会缓存结果，多次调用不重复执行查询
    public function markAllComplete() // [tl! highlight:3]
    {
        $this->todos->each->complete();
    }

    public function render()
    {
        return view('livewire.show-todos');
    }
}
```

你可能想知道为什么不直接调用 `$this->todos()` 方法，而使用 `#[Computed]`？

原因是计算属性具有性能优势，它们在单个请求中首次使用后会自动缓存。这意味着你可以在组件中自由访问 `$this->todos`，并且可以确保实际方法只会被调用一次，从而避免在同一个请求中多次执行昂贵的查询。

更多信息，请[查看计算属性文档](/docs/livewire/v3.x/computed-properties)。

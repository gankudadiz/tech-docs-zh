---
title: 组件
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/components.md
source_version: v3.8.0
translation_status: draft
---

组件是 Livewire 应用的构建块。它们将状态和行为组合在一起，为前端创建可复用的 UI 部件。本文将介绍创建和渲染组件的基础知识。

## 创建组件

一个 Livewire 组件就是一个继承自 `Livewire\Component` 的 PHP 类。你可以手动创建组件文件，也可以使用下面的 Artisan 命令：

```shell
php artisan make:livewire CreatePost
```

如果你更喜欢短横线命名方式，也可以这样使用：

```shell
php artisan make:livewire create-post
```

运行这个命令后，Livewire 会在你的应用中创建两个新文件。第一个是组件的类：`app/Livewire/CreatePost.php`

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
	public function render()
	{
		return view('livewire.create-post');
	}
}
```

第二个是组件的 Blade 视图：`resources/views/livewire/create-post.blade.php`

```blade
<div>
	{{-- ... --}}
</div>
```

你可以使用命名空间语法或点号表示法在子目录中创建组件。例如，以下命令会在 `Posts` 子目录中创建一个 `CreatePost` 组件：

```shell
php artisan make:livewire Posts\\CreatePost
php artisan make:livewire posts.create-post
```

### 内联组件

如果你的组件比较小，你可能希望创建一个*内联*组件。内联组件是单文件的 Livewire 组件，其视图模板直接包含在 `render()` 方法中，而不是放在单独的文件中：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
	public function render()
	{
		return <<<'HTML' // [tl! highlight:4]
		<div>
		    {{-- Your Blade template goes here... --}}
		</div>
		HTML;
	}
}
```

你可以通过给 `make:livewire` 命令添加 `--inline` 标志来创建内联组件：

```shell
php artisan make:livewire CreatePost --inline
```

### 省略 render 方法

为了减少组件中的样板代码，你可以完全省略 `render()` 方法，Livewire 会使用其内部默认的 `render()` 方法，返回一个与组件名称对应的约定视图：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    //
}
```

如果上面的组件在页面上渲染，Livewire 会自动确定应使用 `livewire.create-post` 模板来渲染它。

### 自定义组件模板

你可以通过运行以下命令来自定义 Livewire 用于生成新组件的文件（或称*模板*）：

```shell
php artisan livewire:stubs
```

这会在你的应用中创建七个新文件：

* `stubs/livewire.stub` —— 用于生成新组件
* `stubs/livewire.attribute.stub` —— 用于生成属性类
* `stubs/livewire.form.stub` —— 用于生成表单类
* `stubs/livewire.inline.stub` —— 用于生成*内联*组件
* `stubs/livewire.pest-test.stub` —— 用于生成 Pest 测试文件
* `stubs/livewire.test.stub` —— 用于生成 PHPUnit 测试文件
* `stubs/livewire.view.stub` —— 用于生成组件视图

即使这些文件存在于你的应用中，你仍然可以使用 `make:livewire` Artisan 命令，Livewire 会自动使用你的自定义模板来生成文件。

## 设置属性

Livewire 组件拥有属性（properties），用于存储数据，并且可以在组件类和 Blade 视图中轻松访问。本节介绍如何为组件添加属性并在应用中使用它们。

要为 Livewire 组件添加一个属性，只需在组件类中声明一个公共属性。例如，让我们在 `CreatePost` 组件中创建一个 `$title` 属性：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title = 'Post title...';

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

### 在视图中访问属性

组件的属性会自动传递到组件的 Blade 视图中。你可以使用标准 Blade 语法来引用它。下面我们显示 `$title` 属性的值：

```blade
<div>
    <h1>Title: "{{ $title }}"</h1>
</div>
```

该组件渲染后的输出为：

```blade
<div>
    <h1>Title: "Post title..."</h1>
</div>
```

### 向视图传递额外数据

除了从视图中访问属性外，你还可以像在控制器中那样，从 `render()` 方法显式地向视图传递数据。当你希望在不必先将数据存储为属性的情况下传递额外数据时，这非常有用——因为属性有[特定的性能和安全影响](https://livewire.laravel.com/docs/3.x/properties#security-concerns)。

要通过 `render()` 方法向视图传递数据，你可以在视图实例上使用 `with()` 方法。例如，假设你想将文章作者的名字传递给视图。这里文章的作者就是当前已认证的用户：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class CreatePost extends Component
{
    public $title;

    public function render()
    {
        return view('livewire.create-post')->with([
	        'author' => Auth::user()->name,
	    ]);
    }
}
```

现在你可以在组件的 Blade 视图中访问 `$author` 属性：

```blade
<div>
	<h1>Title: {{ $title }}</h1>

	<span>Author: {{ $author }}</span>
</div>
```

### 在 `@foreach` 循环中添加 `wire:key`

当使用 `@foreach` 在 Livewire 模板中循环数据时，你必须在循环渲染的根元素上添加一个唯一的 `wire:key` 属性。

如果在 Blade 循环中没有 `wire:key` 属性，当循环变化时，Livewire 将无法正确地将旧元素匹配到新位置。这可能会导致你的应用中出现许多难以诊断的问题。

例如，如果你正在循环遍历一个文章数组，可以将 `wire:key` 属性设置为文章的 ID：

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}"> <!-- [tl! highlight] -->
            <!-- ... -->
        </div>
    @endforeach
</div>
```

如果你正在循环渲染 Livewire 组件的数组，可以通过组件属性 `:key` 设置键，或者在 `@livewire` 指令中作为第三个参数传入。

```blade
<div>
    @foreach ($posts as $post)
        <livewire:post-item :$post :key="$post->id">

        @livewire(PostItem::class, ['post' => $post], key($post->id))
    @endforeach
</div>
```

### 将输入绑定到属性

Livewire 最强大的功能之一是"数据绑定"：自动保持属性与页面上的表单输入同步。

让我们使用 `wire:model` 指令将 `CreatePost` 组件中的 `$title` 属性绑定到一个文本输入框：

```blade
<form>
    <label for="title">Title:</label>

    <input type="text" id="title" wire:model="title"> <!-- [tl! highlight] -->
</form>
```

对文本输入框所做的任何更改都会自动同步到 Livewire 组件中的 `$title` 属性。

:::warning["为什么我的组件没有实时更新？"]
如果你已经在浏览器中尝试过，并且困惑为什么标题没有自动更新，那是因为 Livewire 只有在提交"动作"时——比如按下提交按钮——才会更新组件，而不是在用户输入字段时。这可以减少网络请求并提高性能。要启用用户输入时的"实时"更新，你可以改用 `wire:model.live`。[了解更多关于数据绑定的信息](https://livewire.laravel.com/docs/3.x/properties#data-binding)。
:::

Livewire 属性非常强大，是理解 Livewire 的重要概念。更多信息请查阅 [Livewire 属性文档](https://livewire.laravel.com/docs/3.x/properties)。

## 调用动作

动作（Actions）是 Livewire 组件中的方法，用于处理用户交互或执行特定任务。它们通常用于响应页面上的按钮点击或表单提交。

为了更好地理解动作，让我们为 `CreatePost` 组件添加一个 `save` 动作：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $title;

    public function save() // [tl! highlight:8]
    {
		Post::create([
			'title' => $this->title
		]);

		return redirect()->to('/posts')
			 ->with('status', 'Post created!');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

接下来，让我们通过向 `<form>` 元素添加 `wire:submit` 指令，从组件的 Blade 视图中调用 `save` 动作：

```blade
<form wire:submit="save"> <!-- [tl! highlight] -->
    <label for="title">Title:</label>

    <input type="text" id="title" wire:model="title">

	<button type="submit">Save</button>
</form>
```

当点击"Save"按钮时，Livewire 组件中的 `save()` 方法将被执行，然后组件会重新渲染。

要继续学习 Livewire 动作，请访问[动作文档](https://livewire.laravel.com/docs/3.x/actions)。

## 渲染组件

有兩種方式可以在页面上渲染 Livewire 组件：

1. 将其包含在现有的 Blade 视图中
2. 直接将其分配给路由，作为全页组件

我们先介绍第一种方式，因为它更简单。

你可以使用 `<livewire:component-name />` 语法在 Blade 模板中引入 Livewire 组件：

```blade
<livewire:create-post />
```

如果组件类嵌套在 `app/Livewire/` 目录的更深处，你可以使用 `.` 字符来表示目录层级。例如，假设组件位于 `app/Livewire/EditorPosts/CreatePost.php`，可以这样渲染：

```blade
<livewire:editor-posts.create-post />
```

:::warning[必须使用短横线命名法]
正如你在上面的代码片段中看到的，你必须使用组件的*短横线命名*版本。使用*大驼峰命名*版本（`<livewire:CreatePost />`）是无效的，Livewire 无法识别。
:::

### 向组件传递数据

要将外部数据传入 Livewire 组件，你可以在组件标签上使用属性。当你希望用特定数据初始化组件时，这非常有用。

要向 `CreatePost` 组件的 `$title` 属性传递初始值，可以使用以下语法：

```blade
<livewire:create-post title="Initial Title" />
```

如果你需要传递动态值或变量给组件，可以通过在组件属性前加冒号来编写 PHP 表达式：

```blade
<livewire:create-post :title="$initialTitle" />
```

传入组件的数据通过 `mount()` 生命周期钩子作为方法参数接收。在这种情况下，要将 `$title` 参数赋值给属性，你需要编写如下的 `mount()` 方法：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title;

    public function mount($title = null)
    {
        $this->title = $title;
    }

    // ...
}
```

在这个示例中，`$title` 属性将被初始化为值 "Initial Title"。

你可以把 `mount()` 方法看作类的构造函数。它会在组件初始加载时运行，但不会在页面内的后续请求中执行。你可以在[生命周期文档](https://livewire.laravel.com/docs/3.x/lifecycle-hooks)中了解更多关于 `mount()` 和其他有用的生命周期钩子。

为了减少组件中的样板代码，你也可以省略 `mount()` 方法，Livewire 会自动将组件上名称匹配的属性设置为传入的值：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title; // [tl! highlight]

    // ...
}
```

这实际上与在 `mount()` 方法中赋值 `$title` 的效果相同。

:::warning[这些属性默认不是响应式的]
`$title` 属性不会在外部 `:title="$initialValue"` 变化后自动更新。这是使用 Livewire 时常见的混淆点，尤其是对于使用过 Vue 或 React 等 JavaScript 框架的开发者来说，他们可能会认为这些"参数"的行为类似于那些框架中的"响应式属性"。不过别担心，Livewire 允许你选择[使属性变为响应式](https://livewire.laravel.com/docs/3.x/nesting#reactive-props)。
:::

## 全页组件

Livewire 允许你将组件直接分配给 Laravel 应用中的路由。这些被称为"全页组件"。你可以使用它们来构建独立页面，将逻辑和视图完全封装在一个 Livewire 组件中。

要创建全页组件，在 `routes/web.php` 文件中定义路由，并使用 `Route::get()` 方法将组件直接映射到特定 URL。例如，假设你想让 `CreatePost` 组件在 `/posts/create` 路由上渲染。

你可以通过在 `routes/web.php` 文件中添加以下代码来实现：

```php
use App\Livewire\CreatePost;

Route::get('/posts/create', CreatePost::class);
```

现在，当你在浏览器中访问 `/posts/create` 路径时，`CreatePost` 组件将作为全页组件渲染。

### 布局文件

记住，全页组件会使用应用的布局文件，通常定义在 `resources/views/components/layouts/app.blade.php`。

如果这个文件不存在，你可以通过运行以下命令来创建：

```shell
php artisan livewire:layout
```

这个命令会生成一个名为 `resources/views/components/layouts/app.blade.php` 的文件。

请确保你已在此位置创建了一个 Blade 文件，并包含 `{{ $slot }}` 占位符：

```blade
<!-- resources/views/components/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
```

#### 全局布局配置

要为所有组件使用自定义布局，你可以将 `config/livewire.php` 中的 `layout` 键设置为自定义布局的路径（相对于 `resources/views`）。例如：

```php
'layout' => 'layouts.app',
```

通过以上配置，Livewire 会将全页组件渲染在 `resources/views/layouts/app.blade.php` 布局文件中。

#### 组件级布局配置

要为特定组件使用不同的布局，你可以在组件的 `render()` 方法上方放置 Livewire 的 `#[Layout]` 属性，并传入自定义布局的相对视图路径：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

class CreatePost extends Component
{
	// ...

	#[Layout('layouts.app')] // [tl! highlight]
	public function render()
	{
	    return view('livewire.create-post');
	}
}
```

或者，如果你愿意，也可以将这个属性放在类声明上方：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts.app')] // [tl! highlight]
class CreatePost extends Component
{
	// ...
}
```

PHP 属性只支持字面量值。如果你需要传递动态值，或者更喜欢另一种语法，可以在组件的 `render()` 方法中使用流畅的 `->layout()` 方法：

```php
public function render()
{
    return view('livewire.create-post')
	     ->layout('layouts.app'); // [tl! highlight]
}
```

此外，Livewire 也支持使用传统的 `@extends` Blade 布局文件。

假设有以下布局文件：

```blade
<body>
    @yield('content')
</body>
```

你可以使用 `->extends()` 而不是 `->layout()` 来配置 Livewire 引用它：

```php
public function render()
{
    return view('livewire.show-posts')
        ->extends('layouts.app'); // [tl! highlight]
}
```

如果你需要配置组件使用的 `@section`，也可以通过 `->section()` 方法来进行配置：

```php
public function render()
{
    return view('livewire.show-posts')
        ->extends('layouts.app')
        ->section('body'); // [tl! highlight]
}
```

### 设置页面标题

为应用中的每个页面设置独特的标题对用户和搜索引擎都很有帮助。

要为全页组件设置自定义页面标题，首先确保你的布局文件包含一个动态标题：

```blade
<head>
    <title>{{ $title ?? 'Page Title' }}</title>
</head>
```

接下来，在 Livewire 组件的 `render()` 方法上方添加 `#[Title]` 属性，并传入你的页面标题：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Title;
use Livewire\Component;

class CreatePost extends Component
{
	// ...

	#[Title('Create Post')] // [tl! highlight]
	public function render()
	{
	    return view('livewire.create-post');
	}
}
```

这将会为 `CreatePost` Livewire 组件设置页面标题。在这个示例中，页面标题将是 "Create Post"。

如果你愿意，也可以将这个属性放在类声明上方：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('Create Post')] // [tl! highlight]
class CreatePost extends Component
{
	// ...
}
```

如果你需要传递动态标题，例如使用组件属性的标题，可以在组件的 `render()` 方法中使用 `->title()` 流畅方法：

```php
public function render()
{
    return view('livewire.create-post')
	     ->title('Create Post'); // [tl! highlight]
}
```

### 设置布局文件中的额外插槽

如果你的布局文件除了 `$slot` 之外还有其他命名插槽，你可以通过在 Blade 视图的根元素外部定义 `<x-slot>` 来设置它们的内容。例如，如果你希望能够为每个组件单独设置页面语言，可以在布局文件的 HTML 起始标签中添加一个动态的 `$lang` 插槽：

```blade
<!-- resources/views/components/layouts/app.blade.php -->

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $lang ?? app()->getLocale()) }}"> <!-- [tl! highlight] -->
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? 'Page Title' }}</title>
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
```

然后，在你的组件视图中，在根元素外部定义一个 `<x-slot>` 元素：

```blade
<x-slot:lang>fr</x-slot> 此组件使用法语 <!-- [tl! highlight] -->

<div>
    // French content goes here...
</div>
```

### 访问路由参数

在使用全页组件时，你可能需要在 Livewire 组件中访问路由参数。

为了演示，首先在 `routes/web.php` 文件中定义一个带参数的路由：

```php
use App\Livewire\ShowPost;

Route::get('/posts/{id}', ShowPost::class);
```

这里，我们定义了一个带 `id` 参数的路由，代表文章的 ID。

接下来，更新你的 Livewire 组件，在 `mount()` 方法中接收路由参数：

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public Post $post;

    public function mount($id) // [tl! highlight]
    {
        $this->post = Post::findOrFail($id);
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

在这个示例中，由于参数名 `$id` 与路由参数 `{id}` 匹配，如果访问 `/posts/1` URL，Livewire 会将值 "1" 作为 `$id` 传入。

### 使用路由模型绑定

Laravel 的路由模型绑定允许你从路由参数中自动解析 Eloquent 模型。

首先在 `routes/web.php` 文件中定义一个带模型参数的路由：

```php
use App\Livewire\ShowPost;

Route::get('/posts/{post}', ShowPost::class);
```

现在，你可以通过组件的 `mount()` 方法接收路由模型参数：

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public Post $post;

    public function mount(Post $post) // [tl! highlight]
    {
        $this->post = $post;
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

Livewire 知道使用"路由模型绑定"，是因为 `mount()` 中的 `$post` 参数前面有 `Post` 类型提示。

和之前一样，你可以通过省略 `mount()` 方法来减少样板代码：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post; // [tl! highlight]

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

`$post` 属性会自动被赋值为通过路由的 `{post}` 参数绑定的模型。

### 修改响应

在某些场景下，你可能想修改响应并设置自定义响应头。你可以通过调用视图的 `response()` 方法，并使用闭包来修改响应对象：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Http\Response;

class ShowPost extends Component
{
    public function render()
    {
        return view('livewire.show-post')
            ->response(function(Response $response) {
                $response->header('X-Custom-Header', true);
            });
    }
}
```

## 使用 JavaScript

在许多情况下，Livewire 和 Alpine 内置的功能不足以在 Livewire 组件中实现你的目标。

幸运的是，Livewire 提供了许多有用的扩展点和工具，用于与自定义 JavaScript 交互。你可以在 [JavaScript 文档页面](https://livewire.laravel.com/docs/3.x/javascript)上找到详尽的参考。不过现在，这里有一些在 Livewire 组件中使用自定义 JavaScript 的有用方式。

### 执行脚本

Livewire 提供了一个方便的 `@script` 指令，当包裹 `<script>` 元素时，它会在组件在页面上初始化时执行给定的 JavaScript。

下面是一个简单的 `@script` 示例，它使用 JavaScript 的 `setInterval()` 每两秒刷新一次组件：

```blade
@script
<script>
    setInterval(() => {
        $wire.$refresh()
    }, 2000)
</script>
@endscript
```

你会注意到我们在 `<script>` 中使用了一个名为 `$wire` 的对象来控制组件。Livewire 会自动在任何 `@script` 内部提供这个对象。如果你对 `$wire` 不熟悉，可以在以下文档中了解更多：

* [从 JavaScript 访问属性](https://livewire.laravel.com/docs/3.x/properties#accessing-properties-from-javascript)
* [从 JS/Alpine 调用 Livewire 动作](https://livewire.laravel.com/docs/3.x/actions#calling-actions-from-alpine)
* [`$wire` 对象参考](https://livewire.laravel.com/docs/3.x/javascript#the-wire-object)

### 加载资源

除了单次使用的 `@script`，Livewire 还提供了一个方便的 `@assets` 工具，用于在页面上轻松加载任何脚本/样式依赖。

它还能确保提供的资源在每个浏览器页面只加载一次，这与 `@script` 不同——`@script` 会在每次初始化 Livewire 组件新实例时执行。

下面是一个使用 `@assets` 加载名为 [Pikaday](https://github.com/Pikaday/Pikaday) 的日期选择器库，然后使用 `@script` 在组件内初始化它的示例：

```blade
<div>
    <input type="text" data-picker>
</div>

@assets
<script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js" defer></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
@endassets

@script
<script>
    new Pikaday({ field: $wire.$el.querySelector('[data-picker]') });
</script>
@endscript
```

:::info[在 Blade 组件中使用 `@script` 和 `@assets`]
如果你正在使用 [Blade 组件](https://laravel.com/docs/blade#components)来提取部分标记，你也可以在它们内部使用 `@script` 和 `@assets`；即使同一 Livewire 组件中有多个 Blade 组件也没问题。但是，`@script` 和 `@assets` 目前仅在 Livewire 组件的上下文中受支持，这意味着如果你完全在 Livewire 之外使用某个 Blade 组件，这些脚本和资源将不会被加载到页面上。
:::

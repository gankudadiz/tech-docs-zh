---
title: Volt
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/volt.md
source_version: v3.8.0
translation_status: draft
---

:::warning[先熟悉 Livewire 基础]
在使用 Volt 之前，我们建议先熟悉标准、基于类的 Livewire 用法。这将使你能够快速将 Livewire 的知识迁移到使用 Volt 的函数式 API 编写组件。
:::

Volt 是一个精心设计的 Livewire 函数式 API，支持单文件组件，允许组件的 PHP 逻辑和 Blade 模板共存于同一个文件中。在后台，函数式 API 被编译为 Livewire 类组件，并与同一文件中的模板关联。

一个简单的 Volt 组件如下所示：

```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

?>

<div>
    <h1>{{ $count }}</h1>
    <button wire:click="increment">+</button>
</div>
```

## 安装

首先，使用 Composer 包管理器将 Volt 安装到你的项目中：

```bash
composer require livewire/volt
```

安装 Volt 后，你可以执行 `volt:install` Artisan 命令，该命令将在你的应用中安装 Volt 的服务提供者文件。此服务提供者指定了 Volt 将搜索单文件组件的挂载目录：

```bash
php artisan volt:install
```

## 创建组件

你可以通过在 Volt 的任何挂载目录中放置一个 `.blade.php` 扩展名的文件来创建一个 Volt 组件。默认情况下，`VoltServiceProvider` 挂载 `resources/views/livewire` 和 `resources/views/pages` 目录，但你可以在 Volt 服务提供者的 `boot` 方法中自定义这些目录。

为了方便，你可以使用 `make:volt` Artisan 命令来创建新的 Volt 组件：

```bash
php artisan make:volt counter
```

在生成组件时添加 `--test` 指令，也会生成相应的测试文件。如果你希望关联的测试使用 [Pest](https://pestphp.com/)，应该使用 `--pest` 标志：

```bash
php artisan make:volt counter --test --pest
```

添加 `--class` 指令，将生成基于类的 Volt 组件。

```bash
php artisan make:volt counter --class
```

## API 风格

通过利用 Volt 的函数式 API，我们可以通过导入的 `Livewire\Volt` 函数来定义 Livewire 组件的逻辑。Volt 然后将函数式代码转换并编译为传统的 Livewire 类，使我们能够以更少的样板代码利用 Livewire 的广泛功能。

Volt 的 API 会自动将任何使用的闭包绑定到底层组件上。因此，在任何时候，操作、计算属性或监听器都可以通过 `$this` 变量引用组件：

```php
use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

// ...
```

### 基于类的 Volt 组件

如果你希望在享受 Volt 单文件组件能力的同时仍然编写基于类的组件，我们也能满足你的需求。首先，定义一个扩展 `Livewire\Volt\Component` 的匿名类。在类中，你可以使用传统的 Livewire 语法来使用 Livewire 的所有功能：

```blade
<?php

use Livewire\Volt\Component;

new class extends Component {
    public $count = 0;

    public function increment()
    {
        $this->count++;
    }
} ?>

<div>
    <h1>{{ $count }}</h1>
    <button wire:click="increment">+</button>
</div>
```

#### 类属性

与典型的 Livewire 组件一样，Volt 组件也支持类属性。当使用匿名 PHP 类时，类属性应在 `new` 关键字之后定义：

```blade
<?php

use Livewire\Attributes\{Layout, Title};
use Livewire\Volt\Component;

new
#[Layout('layouts.guest')]
#[Title('Login')]
class extends Component
{
    public string $name = '';

    // ...
```

#### 提供额外的视图数据

当使用基于类的 Volt 组件时，渲染的视图是同一文件中的模板。如果你需要在每次渲染时向视图传递额外的数据，可以使用 `with` 方法。这些数据将在组件的公共属性之外传递给视图：

```blade
<?php

use Livewire\WithPagination;
use Livewire\Volt\Component;
use App\Models\Post;

new class extends Component {
    use WithPagination;

    public function with(): array
    {
        return [
            'posts' => Post::paginate(10),
        ];
    }
} ?>

<div>
    <!-- ... -->
</div>
```

#### 修改视图实例

有时你可能希望直接与视图实例交互，例如使用翻译字符串设置视图的标题。为此，你可以在组件上定义一个 `rendering` 方法：

```blade
<?php

use Illuminate\View\View;
use Livewire\Volt\Component;

new class extends Component {
    public function rendering(View $view): void
    {
        $view->title('Create Post');

        // ...
    }

    // ...
```

## 渲染和挂载组件

与典型的 Livewire 组件一样，Volt 组件可以使用 Livewire 的标签语法或 `@livewire` Blade 指令进行渲染：

```blade
<livewire:user-index :users="$users" />
```

要声明组件的接受属性，可以使用 `state` 函数：

```php
use function Livewire\Volt\{state};

state('users');

// ...
```

如果需要，你可以通过向 `state` 函数提供一个闭包来拦截传递给组件的属性，从而与给定的值进行交互和修改：

```php
use function Livewire\Volt\{state};

state(['count' => fn ($users) => count($users)]);
```

`mount` 函数可用于定义 Livewire 组件的"挂载"[生命周期钩子](/docs/livewire/v3.x/lifecycle-hooks)。提供给组件的参数将被注入到此方法中。mount 钩子所需的任何其他参数将由 Laravel 的服务容器解析：

```php
use App\Services\UserCounter;
use function Livewire\Volt\{mount};

mount(function (UserCounter $counter, $users) {
    $counter->store('userCount', count($users));

    // ...
});
```

### 全页面组件

可选地，你可以通过在你的应用 `routes/web.php` 文件中定义一个 Volt 路由，将 Volt 组件渲染为全页面组件：

```php
use Livewire\Volt\Volt;

Volt::route('/users', 'user-index');
```

默认情况下，组件将使用 `components.layouts.app` 布局渲染。你可以使用 `layout` 函数自定义布局文件：

```php
use function Livewire\Volt\{layout, state};

state('users');

layout('components.layouts.admin');

// ...
```

你还可以使用 `title` 函数自定义页面标题：

```php
use function Livewire\Volt\{layout, state, title};

state('users');

layout('components.layouts.admin');

title('Users');

// ...
```

如果标题依赖于组件状态或外部依赖，你可以改为向 `title` 函数传递一个闭包：

```php
use function Livewire\Volt\{layout, state, title};

state('users');

layout('components.layouts.admin');

title(fn () => 'Users: ' . $this->users->count());
```

## 属性

Volt 属性与 Livewire 属性一样，可以在视图中方便地访问，并在 Livewire 更新之间持久化。你可以使用 `state` 函数定义属性：

```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

?>

<div>
    {{ $count }}
</div>
```

如果 state 属性的初始值依赖于外部依赖，如数据库查询、模型或容器服务，其解析应该封装在闭包中。这样可以防止值在绝对必要之前被解析：

```php
use App\Models\User;
use function Livewire\Volt\{state};

state(['count' => fn () => User::count()]);
```

如果 state 属性的初始值是通过 [Laravel Folio](https://github.com/laravel/folio) 的路由模型绑定注入的，它也应该被封装在闭包中：

```php
use App\Models\User;
use function Livewire\Volt\{state};

state(['user' => fn () => $user]);
```

当然，属性也可以在不显式指定初始值的情况下声明。在这种情况下，其初始值将为 `null`，或将根据组件渲染时传递的属性进行设置：

```php
use function Livewire\Volt\{mount, state};

state(['count']);

mount(function ($users) {
    $this->count = count($users);

    //
});
```

### 锁定属性

Livewire 提供了保护属性的能力，允许你"锁定"它们，从而防止任何客户端修改。要使用 Volt 实现此功能，只需在你希望保护的 state 上链式调用 `locked` 方法：

```php
state(['id'])->locked();
```

### 响应式属性

当使用嵌套组件时，你可能会遇到需要将属性从父组件传递给子组件，并让子组件在父组件更新属性时[自动更新](/docs/livewire/v3.x/nesting)的情况。

要使用 Volt 实现此功能，你可以在希望成为响应式的 state 上链式调用 `reactive` 方法：

```php
state(['todos'])->reactive();
```

### 可模型绑定属性

如果你不想使用响应式属性，Livewire 提供了一个[可模型绑定功能](/docs/livewire/v3.x/nesting)，你可以直接在子组件上使用 `wire:model` 来在父组件和子组件之间共享状态。

要使用 Volt 实现此功能，只需在希望成为可模型绑定的 state 上链式调用 `modelable` 方法：

```php
state(['form'])->modelable();
```

### 计算属性

Livewire 还允许你定义[计算属性](/docs/livewire/v3.x/computed-properties)，这对懒加载获取组件所需的信息非常有用。计算属性的结果在单个 Livewire 请求生命周期内会被"记忆化"（memoized）或缓存在内存中。

要定义计算属性，你可以使用 `computed` 函数。变量名将决定计算属性的名称：

```php
<?php

use App\Models\User;
use function Livewire\Volt\{computed};

$count = computed(function () {
    return User::count();
});

?>

<div>
    {{ $this->count }}
</div>
```

你可以通过在计算属性定义上链式调用 `persist` 方法，将计算属性的值持久化到你应用的缓存中：

```php
$count = computed(function () {
    return User::count();
})->persist();
```

默认情况下，Livewire 将计算属性的值缓存 3600 秒。你可以通过向 `persist` 方法提供所需的秒数来自定义此值：

```php
$count = computed(function () {
    return User::count();
})->persist(seconds: 10);
```

## 操作

Livewire 的[操作](/docs/livewire/v3.x/actions)提供了一种方便的方式来监听页面交互并调用组件上的相应方法，从而导致组件重新渲染。通常，操作在用户点击按钮时被调用。

要使用 Volt 定义 Livewire 操作，你只需定义一个闭包。包含闭包的变量名将决定操作的名称：

```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

?>

<div>
    <h1>{{ $count }}</h1>
    <button wire:click="increment">+</button>
</div>
```

在闭包内部，`$this` 变量被绑定到底层的 Livewire 组件，使你可以像在典型的 Livewire 组件中一样访问组件上的其他方法：

```php
use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = function () {
    $this->dispatch('count-updated');

    //
};
```

你的操作还可以接收参数或依赖来自 Laravel 服务容器的注入：

```php
use App\Repositories\PostRepository;
use function Livewire\Volt\{state};

state(['postId']);

$delete = function (PostRepository $posts) {
    $posts->delete($this->postId);

    // ...
};
```

### 无渲染操作

在某些情况下，你的组件可能声明了一个操作，该操作不会执行任何会导致组件渲染的 Blade 模板发生变化的操作。如果是这种情况，你可以通过将操作封装在 `action` 函数中并在其定义上链式调用 `renderless` 方法来[跳过 Livewire 生命周期的渲染阶段](/docs/livewire/v3.x/actions)：

```php
use function Livewire\Volt\{action};

$incrementViewCount = action(fn () => $this->viewCount++)->renderless();
```

### 受保护的辅助方法

默认情况下，所有 Volt 操作都是"公共"的，可以被客户端调用。如果你希望创建一个[只能从操作内部访问](/docs/livewire/v3.x/actions)的方法，可以使用 `protect` 函数：

```php
use App\Repositories\PostRepository;
use function Livewire\Volt\{protect, state};

state(['postId']);

$delete = function (PostRepository $posts) {
    $this->ensurePostCanBeDeleted();

    $posts->delete($this->postId);

    // ...
};

$ensurePostCanBeDeleted = protect(function () {
    // ...
});
```

## 表单

Livewire 的[表单](/docs/livewire/v3.x/forms)提供了一种在单个类中处理表单验证和提交的便捷方式。要在 Volt 组件中使用 Livewire 表单，你可以使用 `form` 函数：

```php
<?php

use App\Livewire\Forms\PostForm;
use function Livewire\Volt\{form};

form(PostForm::class);

$save = function () {
    $this->form->store();

    // ...
};

?>

<form wire:submit="save">
    <input type="text" wire:model="form.title">
    @error('form.title') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">Save</button>
</form>
```

如你所见，`form` 函数接受一个 Livewire 表单类的名称。定义后，可以通过组件上的 `$this->form` 属性访问该表单。

如果你想为表单使用不同的属性名，可以将名称作为第二个参数传递给 `form` 函数：

```php
form(PostForm::class, 'postForm');

$save = function () {
    $this->postForm->store();

    // ...
};
```

## 监听器

Livewire 的全局[事件系统](/docs/livewire/v3.x/events)支持组件之间的通信。如果页面上存在两个 Livewire 组件，它们可以通过利用事件和监听器进行通信。使用 Volt 时，可以使用 `on` 函数定义监听器：

```php
use function Livewire\Volt\{on};

on(['eventName' => function () {
    //
}]);
```

如果你需要为事件监听器分配动态名称，例如基于当前登录用户或传递给组件的数据，你可以向 `on` 函数传递一个闭包。此闭包可以接收任何组件参数，以及将通过 Laravel 服务容器解析的其他依赖项：

```php
on(fn ($post) => [
    'event-'.$post->id => function () {
        //
    }),
]);
```

为了方便，在定义监听器时也可以使用"点"表示法引用组件数据：

```php
on(['event-{post.id}' => function () {
    //
}]);
```

## 生命周期钩子

Livewire 有各种[生命周期钩子](/docs/livewire/v3.x/lifecycle-hooks)，可以在组件生命周期的各个点上执行代码。使用 Volt 便捷的 API，你可以使用相应的函数定义这些生命周期钩子：

```php
use function Livewire\Volt\{boot, booted, ...};

boot(fn () => /* ... */);
booted(fn () => /* ... */);
mount(fn () => /* ... */);
hydrate(fn () => /* ... */);
hydrate(['count' => fn () => /* ... */]);
dehydrate(fn () => /* ... */);
dehydrate(['count' => fn () => /* ... */]);
updating(['count' => fn () => /* ... */]);
updated(['count' => fn () => /* ... */]);
```

## 懒加载占位符

当渲染 Livewire 组件时，你可以向 Livewire 组件传递 `lazy` 参数来[延迟其加载](/docs/livewire/v3.x/lazy)，直到初始页面完全加载。默认情况下，Livewire 会在 DOM 中插入 `<div></div>` 标签作为组件加载的位置。

如果你想自定义在初始页面加载期间组件占位符中显示的 HTML，可以使用 `placeholder` 函数：

```php
use function Livewire\Volt\{placeholder};

placeholder('<div>Loading...</div>');
```

## 验证

Livewire 提供了对 Laravel 强大的[验证功能](/docs/livewire/v3.x/validation)的便捷访问。使用 Volt 的 API，你可以使用 `rules` 函数定义组件的验证规则。与传统的 Livewire 组件一样，这些规则将在你调用 `validate` 方法时应用于你的组件数据：

```php
<?php

use function Livewire\Volt\{rules};

rules(['name' => 'required|min:6', 'email' => 'required|email']);

$submit = function () {
    $this->validate();

    // ...
};

?>

<form wire:submit.prevent="submit">
    //
</form>
```

如果你需要动态定义规则，例如基于当前登录用户或数据库信息的规则，可以向 `rules` 函数提供一个闭包：

```php
rules(fn () => [
    'name' => ['required', 'min:6'],
    'email' => ['required', 'email', 'not_in:'.Auth::user()->email]
]);
```

### 错误消息和属性

要修改验证期间使用的验证消息或属性，你可以在 `rules` 定义上链式调用 `messages` 和 `attributes` 方法：

```php
use function Livewire\Volt\{rules};

rules(['name' => 'required|min:6', 'email' => 'required|email'])
    ->messages([
        'email.required' => 'The :attribute may not be empty.',
        'email.email' => 'The :attribute format is invalid.',
    ])->attributes([
        'email' => 'email address',
    ]);
```

## 文件上传

使用 Volt 时，得益于 Livewire，[上传和存储文件](/docs/livewire/v3.x/uploads)变得容易得多。要在函数式 Volt 组件上引入 `Livewire\WithFileUploads` trait，可以使用 `usesFileUploads` 函数：

```php
use function Livewire\Volt\{state, usesFileUploads};

usesFileUploads();

state(['photo']);

$save = function () {
    $this->validate([
        'photo' => 'image|max:1024',
    ]);

    $this->photo->store('photos');
};
```

## URL 查询参数

有时，当你的组件状态发生变化时，[更新浏览器的 URL 查询参数](/docs/livewire/v3.x/url)是很有用的。在这些情况下，你可以使用 `url` 方法指示 Livewire 将 URL 查询参数与一段组件状态同步：

```php
<?php

use App\Models\Post;
use function Livewire\Volt\{computed, state};

state(['search'])->url();

$posts = computed(function () {
    return Post::where('title', 'like', '%'.$this->search.'%')->get();
});

?>

<div>
    <input wire:model.live="search" type="search" placeholder="Search posts by title...">

    <h1>Search Results:</h1>

    <ul>
        @foreach($this->posts as $post)
            <li wire:key="{{ $post->id }}">{{ $post->title }}</li>
        @endforeach
    </ul>
</div>
```

Livewire 支持的其他 URL 查询参数选项，如 URL 查询参数别名，也可以提供给 `url` 方法：

```php
use App\Models\Post;
use function Livewire\Volt\{state};

state(['page' => 1])->url(as: 'p', history: true, keep: true);

// ...
```

## 分页

Livewire 和 Volt 也完全支持[分页](/docs/livewire/v3.x/pagination)。要在函数式 Volt 组件上引入 Livewire 的 `Livewire\WithPagination` trait，可以使用 `usesPagination` 函数：

```php
<?php

use function Livewire\Volt\{with, usesPagination};

usesPagination();

with(fn () => ['posts' => Post::paginate(10)]);

?>

<div>
    @foreach ($posts as $post)
        //
    @endforeach

    {{ $posts->links() }}
</div>
```

与 Laravel 一样，Livewire 的默认分页视图使用 Tailwind 类进行样式设置。如果你在应用中使用 Bootstrap，可以在调用 `usesPagination` 函数时指定所需的主题来启用 Bootstrap 分页主题：

```php
usesPagination(theme: 'bootstrap');
```

## 自定义 trait 和接口

要在函数式 Volt 组件上引入任意 trait 或接口，你可以使用 `uses` 函数：

```php
use function Livewire\Volt\{uses};

use App\Contracts\Sorting;
use App\Concerns\WithSorting;

uses([Sorting::class, WithSorting::class]);
```

## 匿名组件

有时，你可能想将页面的一小部分转换为 Volt 组件，而不需要将其提取到单独的文件中。例如，假设一个 Laravel 路由返回以下视图：

```php
Route::get('/counter', fn () => view('pages/counter.blade.php'));
```

该视图的内容是典型的 Blade 模板，包括布局定义和插槽。然而，通过将视图的一部分包裹在 `@volt` Blade 指令中，我们可以将该部分视图转换为一个完整功能的 Volt 组件：

```php
<?php

use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;

?>

<x-app-layout>
    <x-slot name="header">
        Counter
    </x-slot>

    @volt('counter')
        <div>
            <h1>{{ $count }}</h1>
            <button wire:click="increment">+</button>
        </div>
    @endvolt
</x-app-layout>
```

#### 向匿名组件传递数据

当渲染一个包含匿名组件的视图时，给定给该视图的所有数据也将对匿名 Volt 组件可用：

```php
use App\Models\User;

Route::get('/counter', fn () => view('users.counter', [
    'count' => User::count(),
]));
```

当然，你可以在 Volt 组件上将此数据声明为"state"。当从视图代理给组件的数据初始化状态时，你只需要声明 state 变量的名称。Volt 将自动使用代理的视图数据来水合 state 的默认值：

```php
<?php

use function Livewire\Volt\{state};

state('count');

$increment = function () {
    // 将新的计数值存储到数据库中...

    $this->count++;
};

?>

<x-app-layout>
    <x-slot name="header">
        Initial value: {{ $count }}
    </x-slot>

    @volt('counter')
        <div>
            <h1>{{ $count }}</h1>
            <button wire:click="increment">+</button>
        </div>
    @endvolt
</x-app-layout>
```

## 测试组件

要开始测试 Volt 组件，你可以调用 `Volt::test` 方法，提供组件的名称：

```php
use Livewire\Volt\Volt;

it('increments the counter', function () {
    Volt::test('counter')
        ->assertSee('0')
        ->call('increment')
        ->assertSee('1');
});
```

在测试 Volt 组件时，你可以使用标准 [Livewire 测试 API](/docs/livewire/v3.x/testing) 提供的所有方法。

如果你的 Volt 组件是嵌套的，你可以使用"点"表示法来指定你想要测试的组件：

```php
Volt::test('users.stats')
```

在测试包含匿名 Volt 组件的页面时，你可以使用 `assertSeeVolt` 方法来断言组件已渲染：

```php
$this->get('/users')
    ->assertSeeVolt('stats');
```

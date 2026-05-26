---
title: 生命周期钩子
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/lifecycle-hooks.md
source_version: v3.8.0
translation_status: completed
---

Livewire 提供了多种生命周期钩子，让你可以在组件生命周期的特定时刻执行代码。这些钩子使你能够在特定事件之前或之后执行操作，例如初始化组件、更新属性或渲染模板。

以下是所有可用的组件生命周期钩子列表：

| 钩子方法 | 说明 |
|---------|------|
| `mount()` | 组件创建时调用 |
| `hydrate()` | 组件在后续请求开始时重新水合时调用 |
| `boot()` | 每次请求开始时调用，包括初始请求和后续请求 |
| `updating()` | 组件属性更新之前调用 |
| `updated()` | 属性更新之后调用 |
| `rendering()` | `render()` 被调用之前调用 |
| `rendered()` | `render()` 被调用之后调用 |
| `dehydrate()` | 每个组件请求结束时调用 |
| `exception($e, $stopPropagation)` | 抛出异常时调用 |

## Mount

在标准的 PHP 类中，构造函数（`__construct()`）接收外部参数并初始化对象的状态。但在 Livewire 中，你使用 `mount()` 方法来接收参数和初始化组件的状态。

Livewire 组件不使用 `__construct()`，因为 Livewire 组件在后续网络请求中会_重新构造_，而我们只希望在组件首次创建时初始化一次。

以下是使用 `mount()` 方法初始化 `UpdateProfile` 组件的 `name` 和 `email` 属性的示例：

```php
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class UpdateProfile extends Component
{
    public $name;

    public $email;

    public function mount()
    {
        $this->name = Auth::user()->name;

        $this->email = Auth::user()->email;
    }

    // ...
}
```

如前所述，`mount()` 方法将通过方法参数接收传入组件的数据：

```php
use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public $title;

    public $content;

    public function mount(Post $post)
    {
        $this->title = $post->title;

        $this->content = $post->content;
    }

    // ...
}
```

:::tip[你可以对所有钩子方法使用依赖注入]
Livewire 允许你通过在生命周期钩子的方法参数上进行类型提示，从 [Laravel 的服务容器](https://laravel.com/docs/container#automatic-injection) 中解析依赖。
:::

`mount()` 方法是使用 Livewire 的关键部分。以下文档提供了使用 `mount()` 方法完成常见任务的更多示例：

* [初始化属性](/docs/livewire/v3.x/properties#initializing-properties)
* [从父组件接收数据](/docs/livewire/v3.x/nesting#passing-props-to-children)
* [访问路由参数](/docs/livewire/v3.x/components#accessing-route-parameters)

## Boot

尽管 `mount()` 很有用，但它每个组件的生命周期只运行一次，而你可能希望在每个对给定组件的服务端请求开始时都运行某些逻辑。

对于这些情况，Livewire 提供了 `boot()` 方法，你可以在其中编写希望在每次组件类启动时运行的组件设置代码：包括初始化时和后续请求时。

`boot()` 方法可用于初始化受保护属性等场景，这些属性在请求之间不会持久化。以下是一个将受保护属性初始化为 Eloquent 模型的示例：

```php
use Livewire\Attributes\Locked;
use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    #[Locked]
    public $postId = 1;

    protected Post $post;

    public function boot() // [tl! highlight:3]
    {
        $this->post = Post::find($this->postId);
    }

    // ...
}
```

你可以使用此技术完全控制 Livewire 组件中组件属性的初始化。

:::tip[大多数情况下，你可以使用计算属性]
上面使用的技术很强大；然而，通常更好的做法是使用 [Livewire 的计算属性](/docs/livewire/v3.x/computed-properties) 来解决这类问题。
:::

:::warning[警告]
始终锁定敏感公共属性
如上所示，我们在 `$postId` 属性上使用了 `#[Locked]` 属性。在像上面这样的场景中，你希望确保 `$postId` 属性不会被用户在客户端篡改，那么在使用该属性的值之前进行授权验证，或者添加 `#[Locked]` 属性确保它永远不会被更改，是非常重要的。

更多信息请查看 [Locked 属性文档](/docs/livewire/v3.x/locked)。
:::

## Update

客户端用户可以通过多种方式更新公共属性，最常见的是修改带有 `wire:model` 的输入框。

Livewire 提供了方便的钩子来拦截公共属性的更新，以便你可以在设置值之前进行验证或授权，或确保属性以指定格式设置。

下面是一个使用 `updating` 阻止修改 `$postId` 属性的示例。

值得注意的是，对于这个特定的示例，在实际应用程序中，你应该像上面的示例一样使用 [`#[Locked]` 属性](/docs/livewire/v3.x/locked)。

```php
use Exception;
use Livewire\Component;

class ShowPost extends Component
{
    public $postId = 1;

    public function updating($property, $value)
    {
        // $property: 当前正在更新的属性名
        // $value: 将要设置到属性的值

        if ($property === 'postId') {
            throw new Exception;
        }
    }

    // ...
}
```

上面的 `updating()` 方法在属性更新之前运行，允许你捕获无效输入并阻止属性更新。下面是一个使用 `updated()` 确保属性值保持一致的示例：

```php
use Livewire\Component;

class CreateUser extends Component
{
    public $username = '';

    public $email = '';

    public function updated($property)
    {
        // $property: 当前已更新的属性名

        if ($property === 'username') {
            $this->username = strtolower($this->username);
        }
    }

    // ...
}
```

现在，无论何时在客户端更新 `$username` 属性，我们都能确保该值始终为小写。

由于你在使用更新钩子时通常针对的是特定属性，Livewire 允许你直接在方法名中指定属性名。下面是使用此技术重写的同一示例：

```php
use Livewire\Component;

class CreateUser extends Component
{
    public $username = '';

    public $email = '';

    public function updatedUsername()
    {
        $this->username = strtolower($this->username);
    }

    // ...
}
```

当然，你也可以将这种技术应用于 `updating` 钩子。

### 数组

数组属性有一个额外的 `$key` 参数传递给这些函数，用于指定变化的元素。

注意，当数组本身被更新而不是特定键时，`$key` 参数为 null。

```php
use Livewire\Component;

class UpdatePreferences extends Component
{
    public $preferences = [];

    public function updatedPreferences($value, $key)
    {
        // $value = 'dark'
        // $key   = 'theme'
    }

    // ...
}
```

## Hydrate & Dehydrate

Hydrate 和 Dehydrate 是较少人知晓和使用的钩子。但在特定场景下，它们可以非常强大。

"dehydrate"（脱水）和"hydrate"（水合）这两个术语指的是 Livewire 组件被序列化为 JSON 发送到客户端，然后在后续请求中反序列化回 PHP 对象的过程。

我们在 Livewire 的代码库和文档中经常使用"hydrate"和"dehydrate"来指代这个过程。如果你想更清楚地了解这些术语，可以查阅[我们的水合文档](/docs/livewire/v3.x/hydration)。

让我们看一个同时使用 `mount()`、`hydrate()` 和 `dehydrate()` 的示例，以支持使用自定义[数据传输对象 (DTO)](https://en.wikipedia.org/wiki/Data_transfer_object) 而不是 Eloquent 模型来在组件中存储文章数据：

```php
use Livewire\Component;

class ShowPost extends Component
{
    public $post;

    public function mount($title, $content)
    {
        // 在首次初始请求开始时运行...

        $this->post = new PostDto([
            'title' => $title,
            'content' => $content,
        ]);
    }

    public function hydrate()
    {
        // 在每个"后续"请求开始时运行...
        // 这不会在初始请求上运行（"mount"会）...

        $this->post = new PostDto($this->post);
    }

    public function dehydrate()
    {
        // 在每个请求结束时运行...

        $this->post = $this->post->toArray();
    }

    // ...
}
```

现在，从动作和组件内的其他位置，你可以访问 `PostDto` 对象而不是原始数据。

上面的示例主要演示了 `hydrate()` 和 `dehydrate()` 钩子的能力和性质。但是，建议你使用 [Wireables 或 Synthesizers](/docs/livewire/v3.x/properties#supporting-custom-types) 来实现此功能。

## Render

如果你想挂钩到组件 Blade 视图的渲染过程，可以使用 `rendering()` 和 `rendered()` 钩子：

```php
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function render()
    {
        return view('livewire.show-posts', [
            'post' => Post::all(),
        ])
    }

    public function rendering($view, $data)
    {
        // 在提供的视图被渲染之前运行...
        //
        // $view: 即将被渲染的视图
        // $data: 提供给视图的数据
    }

    public function rendered($view, $html)
    {
        // 在提供的视图被渲染之后运行...
        //
        // $view: 已渲染的视图
        // $html: 最终的渲染 HTML
    }

    // ...
}
```

## Exception

有时拦截并捕获错误会很有帮助，例如自定义错误消息或忽略特定类型的异常。`exception()` 钩子允许你做到这一点：你可以检查 `$error`，并使用 `$stopPropagation` 参数来捕获问题。
当你希望停止进一步执行代码（提前返回）时，这也开启了一些强大的模式，这就是 `validate()` 等内部方法的工作方式。

```php
use Livewire\Component;

class ShowPost extends Component
{
    public function mount() // [tl! highlight:3]
    {
        $this->post = Post::find($this->postId);
    }

    public function exception($e, $stopPropagation) {
        if ($e instanceof NotFoundException) {
            $this->notify('未找到文章');
            $stopPropagation();
        }
    }

    // ...
}
```

## 在 Trait 中使用钩子

Trait 是在组件之间重用代码或将代码从单个组件提取到专用文件中的有用方式。

为了避免多个 trait 在声明生命周期钩子方法时相互冲突，Livewire 支持在钩子方法名前加上声明该方法的 trait 的_驼峰式_名称。

这样，你可以让多个 trait 使用相同的生命周期钩子，同时避免方法定义冲突。

下面是一个引用 `HasPostForm` trait 的组件示例：

```php
use Livewire\Component;

class CreatePost extends Component
{
    use HasPostForm;

    // ...
}
```

下面是实际的 `HasPostForm` trait，包含所有可用的带前缀钩子：

```php
trait HasPostForm
{
    public $title = '';

    public $content = '';

    public function mountHasPostForm()
    {
        // ...
    }

    public function hydrateHasPostForm()
    {
        // ...
    }

    public function bootHasPostForm()
    {
        // ...
    }

    public function updatingHasPostForm()
    {
        // ...
    }

    public function updatedHasPostForm()
    {
        // ...
    }

    public function renderingHasPostForm()
    {
        // ...
    }

    public function renderedHasPostForm()
    {
        // ...
    }

    public function dehydrateHasPostForm()
    {
        // ...
    }

    // ...
}
```

## 在表单对象中使用钩子

Livewire 中的表单对象支持属性更新钩子。这些钩子的工作方式类似于[组件更新钩子](#update)，让你可以在表单对象中的属性发生变化时执行操作。

下面是一个使用 `PostForm` 表单对象的组件示例：

```php
use Livewire\Component;

class CreatePost extends Component
{
    public PostForm $form;

    // ...
}
```

以下是包含所有可用钩子的 `PostForm` 表单对象：

```php
namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class PostForm extends Form
{
    public $title = '';

    public $tags = [];

    public function updating($property, $value)
    {
        // ...
    }

    public function updated($property, $value)
    {
        // ...
    }

    public function updatingTitle($value)
    {
        // ...
    }

    public function updatedTitle($value)
    {
        // ...
    }

    public function updatingTags($value, $key)
    {
        // ...
    }

    public function updatedTags($value, $key)
    {
        // ...
    }

    // ...
}
```

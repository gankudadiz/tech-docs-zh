---
title: 表单
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/forms.md
source_version: v3.8.0
translation_status: completed
---

因为表单是大多数 Web 应用程序的核心，Livewire 提供了大量有用的工具来构建表单。从处理简单的输入元素，到实时验证或文件上传等复杂功能，Livewire 都提供了简单且文档完善的工具，让你更轻松，也让用户更满意。

让我们开始吧。

## 提交表单

首先来看一个 `CreatePost` 组件中非常简单的表单。这个表单将包含两个简单的文本输入框和一个提交按钮，以及后端管理表单状态和提交的代码：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $title = '';

    public $content = '';

    public function save()
    {
        Post::create(
            $this->only(['title', 'content'])
        );

        session()->flash('status', '文章更新成功。');

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit="save">
    <input type="text" wire:model="title">

    <input type="text" wire:model="content">

    <button type="submit">保存</button>
</form>
```

如你所见，我们在上面的表单中使用 `wire:model" 绑定了公共属性 `$title` 和 `$content`。这是 Livewire 最常用且最强大的功能之一。

除了绑定 `$title` 和 `$content`，我们还使用 `wire:submit` 在点击"保存"按钮时捕获 `submit` 事件并调用 `save()` 动作。该动作将表单输入持久化到数据库。

在数据库中创建新文章后，我们将用户重定向到 `ShowPosts` 组件页面，并向他们显示一条"flash"消息，告知新文章已创建。

### 添加验证

为了避免存储不完整或危险的用户输入，大多数表单都需要某种输入验证。

Livewire 让表单验证变得非常简单，只需在要验证的属性上方添加 `#[Validate]` 属性即可。

一旦属性附加了 `#[Validate]` 属性，每次在服务端更新该属性时，都会应用验证规则。

让我们为 `CreatePost` 组件中的 `$title` 和 `$content` 属性添加一些基本的验证规则：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Validate; // [tl! highlight]
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required')] // [tl! highlight]
    public $title = '';

    #[Validate('required')] // [tl! highlight]
    public $content = '';

    public function save()
    {
        $this->validate(); // [tl! highlight]

        Post::create(
            $this->only(['title', 'content'])
        );

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

我们还需要修改 Blade 模板，在页面上显示验证错误信息。

```blade
<form wire:submit="save">
    <input type="text" wire:model="title">
    <div>
        @error('title') <span class="error">{{ $message }}</span> @enderror <!-- [tl! highlight] -->
    </div>

    <input type="text" wire:model="content">
    <div>
        @error('content') <span class="error">{{ $message }}</span> @enderror <!-- [tl! highlight] -->
    </div>

    <button type="submit">保存</button>
</form>
```

现在，如果用户未填写任何字段就尝试提交表单，他们将看到验证消息，提示在保存文章之前需要填写哪些字段。

Livewire 还有更多验证功能。更多信息请访问我们的[验证文档页面](/docs/livewire/v3.x/validation)。

### 提取表单对象

如果你正在处理一个大型表单，并希望将所有属性、验证逻辑等提取到单独的类中，Livewire 提供了表单对象。

表单对象允许你在组件之间重用表单逻辑，并通过将所有表单相关代码分组到单独的类中，让组件类保持整洁。

你可以手动创建表单类，也可以使用便捷的 artisan 命令：

```shell
php artisan livewire:form PostForm
```

上面的命令将创建一个名为 `app/Livewire/Forms/PostForm.php` 的文件。

让我们重写 `CreatePost` 组件，使用 `PostForm` 类：

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';
}
```

```php
<?php

namespace App\Livewire;

use App\Livewire\Forms\PostForm;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public PostForm $form; // [tl! highlight]

    public function save()
    {
        $this->validate();

        Post::create(
            $this->form->only(['title', 'content']) // [tl! highlight]
        );

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit="save">
    <input type="text" wire:model="form.title">
    <div>
        @error('form.title') <span class="error">{{ $message }}</span> @enderror
    </div>

    <input type="text" wire:model="form.content">
    <div>
        @error('form.content') <span class="error">{{ $message }}</span> @enderror
    </div>

    <button type="submit">保存</button>
</form>
```

如果你愿意，也可以将文章创建逻辑提取到表单对象中，如下所示：

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    public function store() // [tl! highlight:5]
    {
        $this->validate();

        Post::create($this->only(['title', 'content']));
    }
}
```

现在你可以从组件中调用 `$this->form->store()`：

```php
class CreatePost extends Component
{
    public PostForm $form;

    public function save()
    {
        $this->form->store(); // [tl! highlight]

        return $this->redirect('/posts');
    }

    // ...
}
```

如果你希望将此表单对象同时用于创建和更新表单，可以轻松调整以处理这两种场景。

以下是使用同一表单对象用于 `UpdatePost` 组件并填充初始数据的示例：

```php
<?php

namespace App\Livewire;

use App\Livewire\Forms\PostForm;
use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public PostForm $form;

    public function mount(Post $post)
    {
        $this->form->setPost($post);
    }

    public function save()
    {
        $this->form->update();

        return $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;
use App\Models\Post;

class PostForm extends Form
{
    public ?Post $post;

    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    public function setPost(Post $post)
    {
        $this->post = $post;

        $this->title = $post->title;

        $this->content = $post->content;
    }

    public function store()
    {
        $this->validate();

        Post::create($this->only(['title', 'content']));
    }

    public function update()
    {
        $this->validate();

        $this->post->update(
            $this->only(['title', 'content'])
        );
    }
}
```

如你所见，我们为 `PostForm` 对象添加了 `setPost()` 方法，以便可选地用现有数据填充表单，并将文章存储在表单对象上供后续使用。我们还添加了 `update()` 方法用于更新现有文章。

使用 Livewire 时不一定需要使用表单对象，但它们确实提供了一种很好的抽象方式，让组件免于重复的样板代码。

### 重置表单字段

如果你使用表单对象，可能希望在提交后重置表单。可以通过调用 `reset()` 方法来实现：

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    // ...

    public function store()
    {
        $this->validate();

        Post::create($this->only(['title', 'content']));

        $this->reset(); // [tl! highlight]
    }
}
```

你也可以通过将属性名传递给 `reset()` 方法来重置特定属性：

```php
$this->reset('title');

// 或者同时重置多个...

$this->reset(['title', 'content']);
```

### 取出表单字段

你也可以使用 `pull()` 方法在一次操作中同时获取表单属性并重置它们。

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:5')]
    public $title = '';

    #[Validate('required|min:5')]
    public $content = '';

    // ...

    public function store()
    {
        $this->validate();

        Post::create(
            $this->pull() // [tl! highlight]
        );
    }
}
```

你也可以通过将属性名传递给 `pull()` 方法来取出特定属性：

```php
// 取出单个值后重置...
$this->pull('title');

 // 取出键值对数组后重置...
$this->pull(['title', 'content']);
```

### 使用 Rule 对象

如果你有更复杂的验证场景，需要使用 Laravel 的 `Rule` 对象，你也可以定义一个 `rules()` 方法来声明验证规则，如下所示：

```php
<?php

namespace App\Livewire\Forms;

use Illuminate\Validation\Rule;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    public ?Post $post;

    public $title = '';

    public $content = '';

    protected function rules()
    {
        return [
            'title' => [
                'required',
                Rule::unique('posts')->ignore($this->post), // [tl! highlight]
            ],
            'content' => 'required|min:5',
        ];
    }

    // ...

    public function update()
    {
        $this->validate();

        $this->post->update($this->only(['title', 'content']));

        $this->reset();
    }
}
```

使用 `rules()` 方法而不是 `#[Validate]` 时，Livewire 只会在你调用 `$this->validate()` 时运行验证规则，而不是每次属性更新时都运行。

如果你正在使用实时验证或任何其他希望 Livewire 在每次请求后验证特定字段的场景，可以使用不带任何规则的 `#[Validate]`，如下所示：

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Illuminate\Validation\Rule;
use App\Models\Post;
use Livewire\Form;

class PostForm extends Form
{
    public ?Post $post;

    #[Validate] // [tl! highlight]
    public $title = '';

    public $content = '';

    protected function rules()
    {
        return [
            'title' => [
                'required',
                Rule::unique('posts')->ignore($this->post),
            ],
            'content' => 'required|min:5',
        ];
    }

    // ...

    public function update()
    {
        $this->validate();

        $this->post->update($this->only(['title', 'content']));

        $this->reset();
    }
}
```

现在，如果在表单提交之前 `$title` 属性被更新——例如使用 [`wire:model.blur`](/docs/livewire/v3.x/wire-model#updating-on-blur-event)——`$title` 的验证将会运行。

### 显示加载指示器

默认情况下，在表单提交时，Livewire 会自动禁用提交按钮并将输入标记为 `readonly`，防止用户在处理第一个提交时再次提交表单。

但是，如果不在应用程序的 UI 中添加额外的提示，用户可能很难察觉到这种"加载"状态。

下面是一个通过 `wire:loading` 在"保存"按钮上添加小加载动画的示例，让用户知道表单正在提交：

```blade
<button type="submit">
    保存

    <div wire:loading>
        <svg>...</svg> <!-- SVG 加载动画 -->
    </div>
</button>
```

现在，当用户按下"保存"时，会出现一个内联的小加载动画。

Livewire 的 `wire:loading` 功能远不止于此。访问[加载文档了解更多信息](/docs/livewire/v3.x/wire-loading)。

## 实时更新字段

默认情况下，Livewire 仅在表单提交（或调用任何其他[动作](/docs/livewire/v3.x/actions)）时发送网络请求，而不是在填写表单时发送。

以 `CreatePost` 组件为例。如果你想确保"标题"输入框在用户输入时与后端的 `$title` 属性同步，可以给 `wire:model` 添加 `.live` 修饰符，如下所示：

```blade
<input type="text" wire:model.live="title">
```

现在，当用户在该字段中输入时，网络请求将被发送到服务端以更新 `$title`。这对于实时搜索等场景非常有用，当用户在搜索框中输入时，数据集会被过滤。

## 仅在失焦时更新字段

在大多数情况下，`wire:model.live` 对于实时表单字段更新来说已经足够；但在文本输入框上，它可能过于消耗网络资源。

如果你不想在用户输入时发送网络请求，而是希望在用户"跳转"出文本输入框时（也称为"失焦"）才发送请求，可以使用 `.blur` 修饰符：

```blade
<input type="text" wire:model.blur="title" >
```

现在，服务端的组件类只有在用户按 Tab 键或点击输入框外的其他位置时才会更新。

## 实时验证

有时，你可能希望在用户填写表单时就显示验证错误。这样他们可以提前发现错误，而不必等到整个表单填完。

Livewire 会自动处理这类情况。通过在 `wire:model` 上使用 `.live` 或 `.blur`，Livewire 会在用户填写表单时发送网络请求。每个网络请求在更新属性之前都会运行相应的验证规则。如果验证失败，该属性在服务端将不会被更新，并向用户显示验证消息：

```blade
<input type="text" wire:model.blur="title">

<div>
    @error('title') <span class="error">{{ $message }}</span> @enderror
</div>
```

```php
#[Validate('required|min:5')]
public $title = '';
```

现在，如果用户只在"标题"输入框中输入了三个字符，然后点击表单中的下一个输入框，他们将看到一条验证消息，提示该字段至少需要五个字符。

更多信息请查看[验证文档页面](/docs/livewire/v3.x/validation)。

## 实时保存表单

如果你希望在用户填写表单时自动保存，而不是等用户点击"提交"，可以使用 Livewire 的 `updated()` 钩子：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
    public Post $post;

    #[Validate('required')]
    public $title = '';

    #[Validate('required')]
    public $content = '';

    public function mount(Post $post)
    {
        $this->post = $post;
        $this->title = $post->title;
        $this->content = $post->content;
    }

    public function updated($name, $value) // [tl! highlight:5]
    {
        $this->post->update([
            $name => $value,
        ]);
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit>
    <input type="text" wire:model.blur="title">
    <div>
        @error('title') <span class="error">{{ $message }}</span> @enderror
    </div>

    <input type="text" wire:model.blur="content">
    <div>
        @error('content') <span class="error">{{ $message }}</span> @enderror
    </div>
</form>
```

在上面的例子中，当用户完成一个字段（通过点击或 Tab 键跳到下一个字段）时，会发送一个网络请求来更新组件上的该属性。属性在类上更新后，`updated()` 钩子会为该特定属性名及其新值被调用。

我们可以使用这个钩子仅更新数据库中该特定字段。

此外，由于这些属性上附加了 `#[Validate]` 属性，验证规则会在属性更新和 `updated()` 钩子调用之前运行。

要了解更多关于"updated"生命周期钩子及其他钩子的信息，[请访问生命周期钩子文档](/docs/livewire/v3.x/lifecycle-hooks)。

## 显示脏数据指示器

在上面讨论的实时保存场景中，向用户提示某个字段尚未持久化到数据库可能会很有帮助。

例如，如果用户访问 `UpdatePost` 页面并开始在文本输入框中修改文章的标题，他们可能不清楚标题何时被实际更新到数据库中，尤其是当表单底部没有"保存"按钮时。

Livewire 提供了 `wire:dirty` 指令，允许你在输入的值与服务端组件值不同步时切换元素或修改样式类：

```blade
<input type="text" wire:model.blur="title" wire:dirty.class="border-yellow">
```

在上面的例子中，当用户输入到输入框时，输入框周围会出现黄色边框。当用户通过 Tab 键离开时，网络请求被发送，边框消失；这向用户表明输入已被持久化，不再处于"脏"状态。

如果你想切换整个元素的可见性，可以将 `wire:dirty` 与 `wire:target` 结合使用。`wire:target` 用于指定要监视"脏状态"的字段。在本例中，监视"title"字段：

```blade
<input type="text" wire:model="title">

<div wire:dirty wire:target="title">未保存...</div>
```

## 防抖输入

在文本输入框上使用 `.live` 时，你可能希望对网络请求的发送频率进行更精细的控制。默认情况下，输入会应用"250ms"的防抖时间；但你可以使用 `.debounce` 修饰符进行自定义：

```blade
<input type="text" wire:model.live.debounce.150ms="title" >
```

现在，该字段添加了 `.debounce.150ms`，在处理此字段的输入更新时将使用更短的"150ms"防抖时间。换句话说，当用户输入时，只有用户在至少 150 毫秒内停止输入时才会发送网络请求。

## 节流输入

如前所述，对字段应用输入防抖时，只有在用户停止输入一段时间后才会发送网络请求。这意味着如果用户继续输入长消息，在网络请求发送之前必须等用户完成输入。

有时这不是期望的行为，你更希望在用户输入时发送请求，而不是等他们完成或暂停。

在这些情况下，你可以使用 `.throttle` 来表示发送网络请求的时间间隔：

```blade
<input type="text" wire:model.live.throttle.150ms="title" >
```

在上面的例子中，当用户在"标题"字段中持续输入时，每 150 毫秒就会发送一次网络请求，直到用户输入结束。

## 将输入字段提取到 Blade 组件

即使在我们一直在讨论的 `CreatePost` 这样的小组件中，我们最终也会重复很多表单字段的样板代码，比如验证消息和标签。

将重复的 UI 元素提取到专用的 [Blade 组件](https://laravel.com/docs/blade#components)中并在应用程序中共享是非常有用的。

例如，下面是来自 `CreatePost` 组件的原始 Blade 模板。我们将把以下两个文本输入提取到专用的 Blade 组件中：

```blade
<form wire:submit="save">
    <input type="text" wire:model="title"> <!-- [tl! highlight:3] -->
    <div>
        @error('title') <span class="error">{{ $message }}</span> @enderror
    </div>

    <input type="text" wire:model="content"> <!-- [tl! highlight:3] -->
    <div>
        @error('content') <span class="error">{{ $message }}</span> @enderror
    </div>

    <button type="submit">保存</button>
</form>
```

以下是提取名为 `<x-input-text>` 的可重用 Blade 组件后的模板：

```blade
<form wire:submit="save">
    <x-input-text name="title" wire:model="title" /> <!-- [tl! highlight] -->

    <x-input-text name="content" wire:model="content" /> <!-- [tl! highlight] -->

    <button type="submit">保存</button>
</form>
```

接下来是 `x-input-text` 组件的源代码：

```blade
<!-- resources/views/components/input-text.blade.php -->

@props(['name'])

<input type="text" name="{{ $name }}" {{ $attributes }}>

<div>
    @error($name) <span class="error">{{ $message }}</span> @enderror
</div>
```

如你所见，我们将重复的 HTML 放入了一个专用的 Blade 组件中。

在大多数情况下，Blade 组件只包含从原始组件中提取的 HTML。不过，我们添加了两项内容：

* `@props` 指令
* 输入上的 `{{ $attributes }}` 语句

让我们逐一讨论这些新增内容：

通过使用 `@props(['name'])` 将 `name` 指定为"prop"，我们告诉 Blade：如果在该组件上设置了名为"name"的属性，就获取其值并在组件内部以 `$name` 的形式提供。

对于没有明确用途的其他属性，我们使用了 `{{ $attributes }}` 语句。这用于"属性转发"，换句话说，就是将写在 Blade 组件上的任何 HTML 属性转发到组件内的某个元素上。

这确保了 `wire:model="title"` 和任何其他额外属性（如 `disabled`、`class="..."` 或 `required`）仍然会转发到实际的 `<input>` 元素。

### 自定义表单控件

在前面的示例中，我们将一个输入元素"包装"成一个可重用的 Blade 组件，像使用原生 HTML 输入元素一样使用它。

这种模式非常有用；但有时你可能希望从头开始创建一个完整的输入组件（没有底层的原生输入元素），但仍然能够使用 `wire:model` 将其值绑定到 Livewire 属性。

例如，假设你想创建一个 `<x-input-counter />` 组件，它是一个用 Alpine 编写的简单"计数器"输入。

在创建 Blade 组件之前，让我们先看一个简单的纯 Alpine "计数器"组件作为参考：

```blade
<div x-data="{ count: 0 }">
    <button x-on:click="count--">-</button>

    <span x-text="count"></span>

    <button x-on:click="count++">+</button>
</div>
```

如你所见，上面的组件显示一个数字以及两个用于增减该数字的按钮。

现在，假设我们要将这个组件提取为一个名为 `<x-input-counter />` 的 Blade 组件，在另一个组件中使用，如下所示：

```blade
<x-input-counter wire:model="quantity" />
```

创建这个组件大部分是简单的。我们将计数器的 HTML 放入一个 Blade 组件模板中，例如 `resources/views/components/input-counter.blade.php`。

但是，要使其与 `wire:model="quantity"` 配合工作，以便你可以轻松地将 Livewire 组件中的数据绑定到此 Alpine 组件内部的"count"，还需要一个额外的步骤。

以下是该组件的源代码：

```blade
<!-- resources/view/components/input-counter.blade.php -->

<div x-data="{ count: 0 }" x-modelable="count" {{ $attributes}}>
    <button x-on:click="count--">-</button>

    <span x-text="count"></span>

    <button x-on:click="count++">+</button>
</div>
```

如你所见，这段 HTML 中唯一不同的部分是 `x-modelable="count"` 和 `{{ $attributes }}`。

`x-modelable` 是 Alpine 的一个工具，告诉 Alpine 让某一块数据可以从外部进行绑定。[Alpine 文档中有关于此指令的更多信息。](https://alpinejs.dev/directives/modelable)

`{{ $attributes }}` 如前所述，将从外部传入 Blade 组件的任何属性转发出去。在本例中，`wire:model` 指令将被转发。

由于使用了 `{{ $attributes }}`，当 HTML 在浏览器中渲染时，`wire:model="quantity"` 将与 `x-modelable="count"` 一起被渲染在 Alpine 组件的根 `<div>` 上，如下所示：

```blade
<div x-data="{ count: 0 }" x-modelable="count" wire:model="quantity">
```

`x-modelable="count"` 告诉 Alpine 查找任何 `x-model` 或 `wire:model` 语句，并使用"count"作为要绑定的数据。

因为 `x-modelable` 同时适用于 `wire:model` 和 `x-model`，你也可以在纯 Alpine 上下文中交替使用此 Blade 组件。以下是在纯 Alpine 上下文中使用此 Blade 组件的示例：

```blade
<x-input-counter x-model="quantity" />
```

在应用程序中创建自定义输入元素非常强大，但需要更深入地理解 Livewire 和 Alpine 提供的工具以及它们之间的交互方式。

---
title: 在 Blade 视图中渲染表单
---

:::warning
在继续之前，请确保 `filament/forms` 已安装在你的项目中。可以通过运行以下命令检查：

```bash
composer show filament/forms
```
如果尚未安装，请参考[安装指南](../introduction/installation#installing-the-individual-components)并按照说明配置**独立组件**。
:::

## 设置 Livewire 组件

首先，生成一个新的 Livewire 组件：

```bash
php artisan make:livewire CreatePost
```

然后，在页面上渲染你的 Livewire 组件：

```blade
@livewire('create-post')
```

或者，你可以使用全页 Livewire 组件：

```php
use App\Livewire\CreatePost;
use Illuminate\Support\Facades\Route;

Route::get('posts/create', CreatePost::class);
```

## 添加表单

:::warning
在继续之前，请确保**表单包**已安装在你的项目中。请参考[安装指南](../introduction/installation#installing-the-individual-components)并按照说明配置**独立组件**。
:::

在 Livewire 组件类中添加表单有 5 个主要任务，每个都必不可少：

1) 实现 `HasSchemas` 接口并使用 `InteractsWithSchemas` trait。
2) 定义一个公共 Livewire 属性来存储表单数据。在我们的示例中，我们称之为 `$data`，但你可以随意命名。
3) 添加一个 `form()` 方法，这是你配置表单的地方。[添加表单的 schema](../forms/overview#form-schemas)，并告诉 Filament 将表单数据存储在 `$data` 属性中（使用 `statePath('data')`）。
4) 在 `mount()` 中使用 `$this->form->fill()` 初始化表单。这对于你构建的每个表单都是必须的，即使没有初始数据也是如此。
5) 定义一个方法来处理表单提交。在我们的示例中，我们称之为 `create()`，但你可以随意命名。在该方法内部，你可以使用 `$this->form->getState()` 来验证和获取表单数据。使用此方法而不是直接访问 `$this->data` 属性很重要，因为表单数据需要在返回之前经过验证和转换。

```php
<?php

namespace App\Livewire;

use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Illuminate\Contracts\View\View;
use Filament\Schemas\Schema;
use Livewire\Component;

class CreatePost extends Component implements HasSchemas
{
    use InteractsWithSchemas;
    
    public ?array $data = [];
    
    public function mount(): void
    {
        $this->form->fill();
    }
    
    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                MarkdownEditor::make('content'),
                // ...
            ])
            ->statePath('data');
    }
    
    public function create(): void
    {
        dd($this->form->getState());
    }
    
    public function render(): View
    {
        return view('livewire.create-post');
    }
}
```

最后，在 Livewire 组件的视图中渲染表单：

```blade
<div>
    <form wire:submit="create">
        {{ $this->form }}
        
        <button type="submit">
            Submit
        </button>
    </form>
    
    <x-filament-actions::modals />
</div>
```

:::info
`<x-filament-actions::modals />` 用于渲染表单组件的[操作模态框](../actions/modals)。该代码可以放在 `<form>` 元素外部的任何位置，只要在 Livewire 组件内即可。
:::

在浏览器中访问你的 Livewire 组件，你应该能看到来自 `components()` 的表单组件。

提交表单并填入数据后，你会看到表单数据被转储到屏幕上。你可以将数据保存到模型中而不是转储它：

```php
use App\Models\Post;

public function create(): void
{
    Post::create($this->form->getState());
}
```

:::info
`filament/forms` 还包含以下包：

- `filament/actions`
- `filament/schemas`
- `filament/support`

这些包允许你在 Livewire 组件中使用它们的组件。
例如，如果你的表单使用了[操作](../actions)，请记得在 Livewire 组件类上实现 `HasActions` 接口并使用 `InteractsWithActions` trait。

如果你在表单中使用了任何其他 [Filament 组件](overview#package-components)，请确保也安装并集成了相应的包。
:::

## 使用数据初始化表单

要使用数据填充表单，只需将数据传递给 `$this->form->fill()` 方法。例如，如果你正在编辑现有的帖子，可以这样做：

```php
use App\Models\Post;

public function mount(Post $post): void
{
    $this->form->fill($post->attributesToArray());
}
```

使用 `$this->form->fill()` 方法而不是直接将数据赋值给 `$this->data` 属性很重要。这是因为帖子的数据需要在存储之前在内部转换为有用的格式。

## 设置表单模型

让 `$form` 访问模型在以下几种情况下很有用：

- 它允许该表单中的字段从该模型加载信息。例如，选择器字段可以[自动从数据库加载选项](../forms/select#integrating-with-an-eloquent-relationship)。
- 表单可以自动加载和保存模型的关系数据。例如，你有一个编辑帖子的表单，其中有一个管理该帖子关联评论的[重复器](../forms/repeater#integrating-with-an-eloquent-relationship)。当你调用 `$this->form->fill([...])` 时，Filament 会自动加载该帖子的评论，并在调用 `$this->form->getState()` 时将它们保存回关系中。
- `exists()` 和 `unique()` 等验证规则可以自动从模型中获取数据库表名。

建议在有模型时始终将模型传递给表单。如前所述，它解锁了 Filament 表单系统的许多新能力。

要将模型传递给表单，请使用 `$form->model()` 方法：

```php
use Filament\Schemas\Schema;

public Post $post;

public function form(Schema $schema): Schema
{
    return $schema
        ->components([
            // ...
        ])
        ->statePath('data')
        ->model($this->post);
}
```

### 在表单提交后传递表单模型

在某些情况下，表单的模型在表单提交之前不可用。例如，在创建帖子的表单中，帖子在表单提交之前不存在。因此，你无法将其传入 `$form->model()`。但是，你可以传入一个模型类：

```php
use App\Models\Post;
use Filament\Schemas\Schema;

public function form(Schema $schema): Schema
{
    return $schema
        ->components([
            // ...
        ])
        ->statePath('data')
        ->model(Post::class);
}
```

仅这样做不如传递模型实例强大。例如，关系不会在帖子创建后保存到帖子中。为此，你需要在帖子创建后将其传递给表单，并调用 `saveRelationships()` 来保存关系：

```php
use App\Models\Post;

public function create(): void
{
    $post = Post::create($this->form->getState());
    
    // 在帖子创建后，将表单中的关系保存到帖子。
    $this->form->model($post)->saveRelationships();
}
```

## 将表单数据保存到独立属性

在我们之前的所有示例中，我们一直将表单数据保存到 Livewire 组件上的公共 `$data` 属性中。但是，你也可以将数据保存到独立属性中。例如，如果你有一个包含 `title` 字段的表单，你可以将表单数据保存到 `$title` 属性中。为此，不要向表单传递 `statePath()`。确保所有字段在类上都有自己的**公共**属性。

```php
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

public ?string $title = null;

public ?string $content = null;

public function form(Schema $schema): Schema
{
    return $schema
        ->components([
            TextInput::make('title')
                ->required(),
            MarkdownEditor::make('content'),
            // ...
        ]);
}
```

## 使用多个表单

可以使用 `InteractsWithSchemas` trait 定义多个表单。每个表单应使用同名的方法：

```php
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

public ?array $postData = [];

public ?array $commentData = [];

public function editPostForm(Schema $schema): Schema
{
    return $schema
        ->components([
            TextInput::make('title')
                ->required(),
            MarkdownEditor::make('content'),
            // ...
        ])
        ->statePath('postData')
        ->model($this->post);
}

public function createCommentForm(Schema $schema): Schema
{
    return $schema
        ->components([
            TextInput::make('name')
                ->required(),
            TextInput::make('email')
                ->email()
                ->required(),
            MarkdownEditor::make('content')
                ->required(),
            // ...
        ])
        ->statePath('commentData')
        ->model(Comment::class);
}
```

现在，每个表单可以通过其名称而不是 `form` 来访问。例如，要填充帖子表单，你可以使用 `$this->editPostForm->fill([...])`，或者要从评论表单获取数据，你可以使用 `$this->createCommentForm->getState()`。

你会注意到每个表单都有自己唯一的 `statePath()`。每个表单会将其状态写入 Livewire 组件上的不同数组中，因此在此示例中定义公共属性 `$postData` 和 `$commentData` 很重要。

## 重置表单数据

你可以随时通过调用 `$this->form->fill()` 将表单重置为默认数据。例如，你可能希望在每次提交后清空表单内容：

```php
use App\Models\Comment;

public function createComment(): void
{
    Comment::create($this->form->getState());

    // 重新初始化表单以清空其数据。
    $this->form->fill();
}
```

## 使用 CLI 生成表单 Livewire 组件

建议你先学习如何手动设置带有表单的 Livewire 组件，但当你熟练后，可以使用 CLI 为你生成表单。

```bash
php artisan make:filament-livewire-form RegistrationForm
```

这将生成一个新的 `app/Livewire/RegistrationForm.php` 组件，你可以自定义它。

### 为 Eloquent 模型生成表单

Filament 还能够为特定的 Eloquent 模型生成表单。这些更强大，因为它们会自动为你保存表单中的数据，并[确保表单字段正确配置](#设置表单模型)以访问该模型。

使用 `make:livewire-form` 命令生成表单时，它会询问模型的名称：

```bash
php artisan make:filament-livewire-form Products/CreateProduct
```

#### 为 Eloquent 记录生成编辑表单

默认情况下，将模型传递给 `make:livewire-form` 命令将生成一个在数据库中创建新记录的表单。如果你向命令传递 `--edit` 标志，它将为特定记录生成编辑表单。这将自动用记录中的数据填充表单，并在表单提交时将数据保存回模型。

```bash
php artisan make:filament-livewire-form Products/EditProduct --edit
```

### 自动生成表单 schema

Filament 还能够根据模型的数据库列猜测你想要的表单字段。你可以在生成表单时使用 `--generate` 标志：

```bash
php artisan make:filament-livewire-form Products/CreateProduct --generate
```

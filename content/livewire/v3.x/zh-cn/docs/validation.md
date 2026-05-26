---
title: 验证
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/validation.md
source_version: v3.8.0
translation_status: draft
---

Livewire 致力于让验证用户输入和提供反馈尽可能愉快。通过建立在 Laravel 的验证功能之上，Livewire 既利用了你的现有知识，又提供了强大的额外功能，如实时验证。

以下是一个 `CreatePost` 组件示例，演示了 Livewire 中最基本的验证工作流程：

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
        $validated = $this->validate([ // [tl! highlight:3]
			'title' => 'required|min:3',
			'content' => 'required|min:3',
        ]);

		Post::create($validated);

		return redirect()->to('/posts');
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
    <div>@error('title') {{ $message }} @enderror</div>

	<textarea wire:model="content"></textarea>
    <div>@error('content') {{ $message }} @enderror</div>

	<button type="submit">Save</button>
</form>
```

如你所见，Livewire 提供了 `validate()` 方法，你可以调用它来验证组件的属性。它返回经过验证的数据集，你可以安全地将其插入数据库。

在前端，你可以使用 Laravel 现有的 Blade 指令向用户显示验证消息。

更多信息，请参阅 [Laravel 关于在 Blade 中渲染验证错误的文档](https://laravel.com/docs/blade#validation-errors)。

## Validate 属性

如果你更倾向于将组件的验证规则与属性放在一起，可以使用 Livewire 的 `#[Validate]` 属性。

通过使用 `#[Validate]` 将验证规则与属性关联，Livewire 会在每次更新前自动运行属性的验证规则。但是，在将数据持久化到数据库之前，你仍然应该运行 `$this->validate()`，以便那些未更新的属性也被验证。

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required|min:3')] // [tl! highlight]
	public $title = '';

    #[Validate('required|min:3')] // [tl! highlight]
    public $content = '';

    public function save()
    {
        $this->validate();

		Post::create([
            'title' => $this->title,
            'content' => $this->content,
		]);

		return redirect()->to('/posts');
    }

    // ...
}
```

:::info Validate 属性不支持 Rule 对象
PHP 属性（Attributes）仅限于某些语法，如纯字符串和数组。如果你希望使用运行时的语法，如 Laravel 的 Rule 对象（`Rule::exists(...)`），你应该改为在组件中[定义 `rules()` 方法](#定义-rules-方法)。
:::

:::info
更多信息请参阅[使用 Laravel Rule 对象与 Livewire](#使用-laravel-rule-对象) 的文档。
:::

如果你希望对属性何时进行验证有更多控制，可以向 `#[Validate]` 属性传递 `onUpdate: false` 参数。这将禁用任何自动验证，并假定你希望使用 `$this->validate()` 方法手动验证属性：

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required|min:3', onUpdate: false)]
	public $title = '';

    #[Validate('required|min:3', onUpdate: false)]
    public $content = '';

    public function save()
    {
        $validated = $this->validate();

		Post::create($validated);

		return redirect()->to('/posts');
    }

    // ...
}
```

### 自定义属性名称

如果你希望自定义注入到验证消息中的属性名称，可以使用 `as:` 参数：

```php
use Livewire\Attributes\Validate;

#[Validate('required', as: 'date of birth')]
public $dob;
```

当上述代码片段中的验证失败时，Laravel 将在验证消息中使用 "date of birth" 而不是 "dob" 作为字段名称。生成的消息将是 "The date of birth field is required" 而不是 "The dob field is required"。

### 自定义验证消息

要绕过 Laravel 的验证消息并将其替换为你自己的，可以在 `#[Validate]` 属性中使用 `message:` 参数：

```php
use Livewire\Attributes\Validate;

#[Validate('required', message: 'Please provide a post title')]
public $title;
```

现在，当此属性的验证失败时，消息将是 "Please provide a post title" 而不是 "The title field is required"。

如果你想为不同的规则添加不同的消息，可以简单地提供多个 `#[Validate]` 属性：

```php
#[Validate('required', message: 'Please provide a post title')]
#[Validate('min:3', message: 'This title is too short')]
public $title;
```

### 选择退出本地化

默认情况下，Livewire 规则消息和属性使用 Laravel 的翻译辅助函数 `trans()` 进行本地化。

你可以通过向 `#[Validate]` 属性传递 `translate: false` 参数来选择退出本地化：

```php
#[Validate('required', message: 'Please provide a post title', translate: false)]
public $title;
```

### 自定义键

当使用 `#[Validate]` 属性直接将验证规则应用于属性时，Livewire 假定验证键应为属性本身的名称。但是，有时你可能希望自定义验证键。

例如，你可能希望为数组属性及其子项提供单独的验证规则。在这种情况下，你不是将验证规则作为第一个参数传递给 `#[Validate]` 属性，而是传递一个键值对数组：

```php
#[Validate([
    'todos' => 'required',
    'todos.*' => [
        'required',
        'min:3',
        new Uppercase,
    ],
])]
public $todos = [];
```

现在，当用户更新 `$todos`，或者调用 `validate()` 方法时，这两个验证规则都将被应用。

## 表单对象

随着 Livewire 组件中属性和验证规则的增加，组件可能会开始变得过于拥挤。为了缓解这个问题，同时提供一种有助于代码复用的抽象，你可以使用 Livewire 的*表单对象（Form Object）*来存储你的属性和验证规则。

以下是相同的 `CreatePost` 示例，但现在属性和规则已被提取到一个名为 `PostForm` 的专用表单对象中：

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Attributes\Validate;
use Livewire\Form;

class PostForm extends Form
{
    #[Validate('required|min:3')]
	public $title = '';

    #[Validate('required|min:3')]
    public $content = '';
}
```

上面的 `PostForm` 现在可以作为 `CreatePost` 组件上的一个属性来定义：

```php
<?php

namespace App\Livewire;

use App\Livewire\Forms\PostForm;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public PostForm $form;

    public function save()
    {
		Post::create(
    		$this->form->all()
    	);

		return redirect()->to('/posts');
    }

    // ...
}
```

如你所见，无需逐个列出每个属性，我们可以使用表单对象上的 `->all()` 方法检索所有属性值。

另外，在模板中引用属性名称时，必须在每个实例前加上 `form.`：

```blade
<form wire:submit="save">
	<input type="text" wire:model="form.title">
    <div>@error('form.title') {{ $message }} @enderror</div>

	<textarea wire:model="form.content"></textarea>
    <div>@error('form.content') {{ $message }} @enderror</div>

	<button type="submit">Save</button>
</form>
```

当使用表单对象时，`#[Validate]` 属性验证将在每次属性更新时运行。但是，如果你通过在属性上指定 `onUpdate: false` 来禁用此行为，你可以使用 `$this->form->validate()` 手动运行表单对象的验证：

```php
public function save()
{
    Post::create(
        $this->form->validate()
    );

    return redirect()->to('/posts');
}
```

表单对象是大多数较大数据集的实用抽象，并且具有各种额外功能使其更加强大。更多信息，请查看全面的[表单对象文档](/docs/livewire/v3.x/forms#extracting-a-form-object)。

## 实时验证

实时验证是指当用户填写表单时就验证其输入，而不是等到表单提交时才验证。

通过直接在 Livewire 属性上使用 `#[Validate]` 属性，每当发送网络请求以在服务器上更新属性的值时，所提供的验证规则都将被应用。

这意味着要为用户在特定输入上提供实时验证体验，不需要额外后端工作。唯一需要的是使用 `wire:model.live` 或 `wire:model.blur` 来指示 Livewire 在填写字段时触发网络请求。

在下面的示例中，已为文本输入添加了 `wire:model.blur`。现在，当用户在字段中键入内容然后按 tab 键或点击离开字段时，将触发带有更新值的网络请求，并运行验证规则：

```blade
<form wire:submit="save">
    <input type="text" wire:model.blur="title">

    <!-- -->
</form>
```

如果你使用 `rules()` 方法为属性声明验证规则，而不是使用 `#[Validate]` 属性，你仍然可以包含一个不带参数的 `#[Validate]` 属性来保留实时验证行为：

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate] // [tl! highlight]
	public $title = '';

    public $content = '';

    protected function rules()
    {
        return [
            'title' => 'required|min:5',
            'content' => 'required|min:5',
        ];
    }

    public function save()
    {
        $validated = $this->validate();

		Post::create($validated);

		return redirect()->to('/posts');
    }
```

现在，在上面的示例中，即使 `#[Validate]` 是空的，它也会告诉 Livewire 在每次属性更新时运行由 `rules()` 提供的字段验证。

## 自定义错误消息

开箱即用，Laravel 提供了合理的验证消息，如 "The title field is required."（如果 `$title` 属性附加了 `required` 规则）。

但是，你可能需要自定义这些错误消息的语言，以更好地适应你的应用及其用户。

### 自定义属性名称

有时你正在验证的属性名称不适合向用户显示。例如，如果你的应用中有名为 `dob` 的数据库字段，代表"Date of birth"，你希望向用户显示 "The date of birth field is required" 而不是 "The dob field is required"。

Livewire 允许你使用 `as:` 参数为属性指定替代名称：

```php
use Livewire\Attributes\Validate;

#[Validate('required', as: 'date of birth')]
public $dob = '';
```

现在，如果 `required` 验证规则失败，错误消息将显示 "The date of birth field is required." 而不是 "The dob field is required."。

### 自定义消息

如果自定义属性名称还不够，你可以使用 `message:` 参数自定义整个验证消息：

```php
use Livewire\Attributes\Validate;

#[Validate('required', message: 'Please fill out your date of birth.')]
public $dob = '';
```

如果你有多个需要自定义消息的规则，建议为每个规则使用完全独立的 `#[Validate]` 属性，如下所示：

```php
use Livewire\Attributes\Validate;

#[Validate('required', message: 'Please enter a title.')]
#[Validate('min:5', message: 'Your title is too short.')]
public $title = '';
```

如果你希望使用 `#[Validate]` 属性的数组语法，可以像这样指定自定义属性和消息：

```php
use Livewire\Attributes\Validate;

#[Validate([
    'titles' => 'required',
    'titles.*' => 'required|min:5',
], message: [
    'required' => 'The :attribute is missing.',
    'titles.required' => 'The :attribute are missing.',
    'min' => 'The :attribute is too short.',
], attribute: [
    'titles.*' => 'title',
])]
public $titles = [];
```

## 定义 `rules()` 方法

作为 Livewire 的 `#[Validate]` 属性的替代方案，你可以在组件中定义一个名为 `rules()` 的方法，并返回字段列表及相应的验证规则。如果你试图使用 PHP 属性（Attributes）不支持的运行时语法，例如 Laravel 的规则对象如 `Rule::password()`，这会很有帮助。

这些规则将在你在组件中运行 `$this->validate()` 时被应用。你还可以定义 `messages()` 和 `validationAttributes()` 函数。

以下是一个示例：

```php
use Livewire\Component;
use App\Models\Post;
use Illuminate\Validation\Rule;

class CreatePost extends Component
{
	public $title = '';

    public $content = '';

    protected function rules() // [tl! highlight:6]
    {
        return [
            'title' => Rule::exists('posts', 'title'),
            'content' => 'required|min:3',
        ];
    }

    protected function messages() // [tl! highlight:6]
    {
        return [
            'content.required' => 'The :attribute are missing.',
            'content.min' => 'The :attribute is too short.',
        ];
    }

    protected function validationAttributes() // [tl! highlight:6]
    {
        return [
            'content' => 'description',
        ];
    }

    public function save()
    {
        $this->validate();

		Post::create([
            'title' => $this->title,
            'content' => $this->content,
		]);

		return redirect()->to('/posts');
    }

    // ...
}
```

:::warning `rules()` 方法不会在数据更新时验证
当通过 `rules()` 方法定义规则时，Livewire 仅在你运行 `$this->validate()` 时使用这些验证规则来验证属性。这与标准的 `#[Validate]` 属性不同，后者在每次通过 `wire:model` 等方式更新字段时都会应用。要每次更新时应用这些验证规则，你仍然可以使用不带额外参数的 `#[Validate]`。
:::

:::warning 不要与 Livewire 的机制冲突
在使用 Livewire 的验证工具时，你的组件**不应**有名为 `rules`、`messages`、`validationAttributes` 或 `validationCustomValues` 的属性或方法，除非你在自定义验证过程。否则，这些将与 Livewire 的机制冲突。
:::

## 使用 Laravel Rule 对象

Laravel `Rule` 对象是为表单添加高级验证行为的一种非常强大的方式。

以下是结合 Livewire 的 `rules()` 方法使用 Rule 对象以实现更复杂验证的示例：

```php
<?php

namespace App\Livewire;

use Illuminate\Validation\Rule;
use App\Models\Post;
use Livewire\Form;

class UpdatePost extends Form
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

    public function mount()
    {
        $this->title = $this->post->title;
        $this->content = $this->post->content;
    }

    public function update()
    {
        $this->validate(); // [tl! highlight]

        $this->post->update($this->all());

        $this->reset();
    }

    // ...
}
```

## 手动控制验证错误

Livewire 的验证工具应该能处理最常见的验证场景；但是，有时你可能希望完全控制组件中的验证消息。

以下是操作 Livewire 组件中验证错误的所有可用方法：

| 方法 | 描述 |
| --- | --- |
| `$this->addError([key], [message])` | 手动向错误包中添加验证消息 |
| `$this->resetValidation([?key])` | 重置指定键的验证错误，如果未提供键则重置所有错误 |
| `$this->getErrorBag()` | 检索 Livewire 组件中使用的底层 Laravel 错误包 |

:::info 在表单对象中使用 `$this->addError()`
在表单对象中使用 `$this->addError` 手动添加错误时，键会自动以前缀形式加上该表单在父组件中分配到的属性名称。例如，如果你的组件中将表单分配给了名为 `$data` 的属性，则键将变为 `data.key`。
:::

## 访问验证器实例

有时你可能希望访问 Livewire 在 `validate()` 方法内部使用的 Validator 实例。这可以通过 `withValidator` 方法实现。你提供的闭包接收完全构造的验证器作为参数，允许你在实际评估验证规则之前调用其任何方法。

以下是拦截 Livewire 内部验证器以手动检查条件并添加额外验证消息的示例：

```php
use Livewire\Attributes\Validate;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    #[Validate('required|min:3')]
	public $title = '';

    #[Validate('required|min:3')]
    public $content = '';

    public function boot()
    {
        $this->withValidator(function ($validator) {
            $validator->after(function ($validator) {
                if (str($this->title)->startsWith('"')) {
                    $validator->errors()->add('title', 'Titles cannot start with quotations');
                }
            });
        });
    }

    public function save()
    {
		Post::create($this->all());

		return redirect()->to('/posts');
    }

    // ...
}
```

## 使用自定义验证器

如果你希望在 Livewire 中使用自己的验证系统，这也没问题。Livewire 会捕获组件内抛出的任何 `ValidationException` 异常，并将错误提供给视图，就像你使用 Livewire 自己的 `validate()` 方法一样。

以下是 `CreatePost` 组件的示例，但不是使用 Livewire 的验证功能，而是创建并应用了一个完全自定义的验证器到组件属性：

```php
use Illuminate\Support\Facades\Validator;
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
	public $title = '';

    public $content = '';

    public function save()
    {
        $validated = Validator::make(
            // 要验证的数据...
            ['title' => $this->title, 'content' => $this->content],

            // 要应用的验证规则...
            ['title' => 'required|min:3', 'content' => 'required|min:3'],

            // 自定义验证消息...
            ['required' => 'The :attribute field is required'],
         )->validate();

		Post::create($validated);

		return redirect()->to('/posts');
    }

    // ...
}
```

## 测试验证

Livewire 为验证场景提供了有用的测试工具，例如 `assertHasErrors()` 方法。

以下是一个基本测试用例，确保如果未为 `title` 属性设置输入，则会抛出验证错误：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_cant_create_post_without_title()
    {
        Livewire::test(CreatePost::class)
            ->set('content', 'Sample content...')
            ->call('save')
            ->assertHasErrors('title');
    }
}
```

除了测试错误的存在之外，`assertHasErrors` 还允许你通过将规则作为方法的第二个参数传入，将断言缩小到特定规则：

```php
public function test_cant_create_post_with_title_shorter_than_3_characters()
{
    Livewire::test(CreatePost::class)
        ->set('title', 'Sa')
        ->set('content', 'Sample content...')
        ->call('save')
        ->assertHasErrors(['title' => ['min:3']]);
}
```

你还可以同时断言多个属性的验证错误存在：

```php
public function test_cant_create_post_without_title_and_content()
{
    Livewire::test(CreatePost::class)
        ->call('save')
        ->assertHasErrors(['title', 'content']);
}
```

有关 Livewire 提供的其他测试工具的更多信息，请查看[测试文档](/docs/livewire/v3.x/testing)。

## 已弃用的 `[#Rule]` 属性

当 Livewire v3 首次发布时，它在其验证属性（`#[Rule]`）中使用了 "Rule" 而不是 "Validate"。

由于与 Laravel 的 Rule 对象存在命名冲突，此后已更改为 `#[Validate]`。两者在 Livewire v3 中均受支持，但建议你将所有 `#[Rule]` 替换为 `#[Validate]` 以保持最新。

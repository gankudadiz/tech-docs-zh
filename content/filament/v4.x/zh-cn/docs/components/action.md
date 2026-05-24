---
title: 在 Livewire 组件中渲染操作
---

:::warning
在继续之前，请确保 `filament/actions` 已安装在你的项目中。可以通过运行以下命令检查：

```bash
composer show filament/actions
```
如果尚未安装，请参考[安装指南](../introduction/installation#安装独立组件)并按照说明配置**独立组件**。
:::

## 设置 Livewire 组件

首先，生成一个新的 Livewire 组件：

```bash
php artisan make:livewire ManagePost
```

然后，在页面上渲染你的 Livewire 组件：

```blade
@livewire('manage-post')
```

或者，你可以使用全页 Livewire 组件：

```php
use App\Livewire\ManagePost;
use Illuminate\Support\Facades\Route;

Route::get('posts/{post}/manage', ManagePost::class);
```

你必须在 Livewire 组件类上使用 `InteractsWithActions` 和 `InteractsWithSchemas` trait，并实现 `HasActions` 和 `HasSchemas` 接口：

```php
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Livewire\Component;

class ManagePost extends Component implements HasActions, HasSchemas
{
    use InteractsWithActions;
    use InteractsWithSchemas;

    // ...
}
```

## 添加操作

添加一个返回操作的方法。该方法必须与操作同名，或者在操作名后加上 `Action`：

```php
use App\Models\Post;
use Filament\Actions\Action;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Livewire\Component;

class ManagePost extends Component implements HasActions, HasSchemas
{
    use InteractsWithActions;
    use InteractsWithSchemas;

    public Post $post;

    public function deleteAction(): Action
    {
        return Action::make('delete')
            ->color('danger')
            ->requiresConfirmation()
            ->action(fn () => $this->post->delete());
    }
    
    // 这个方法名也可以工作，因为操作名称是 `delete`：
    // public function delete(): Action
    
    // 这个方法名不行，因为操作名称是 `delete`，而不是 `deletePost`：
    // public function deletePost(): Action

    // ...
}
```

最后，你需要在视图中渲染操作。为此，可以使用 `{{ $this->deleteAction }}`，将 `deleteAction` 替换为你的操作方法名：

```blade
<div>
    {{ $this->deleteAction }}

    <x-filament-actions::modals />
</div>
```

你还需要 `<x-filament-actions::modals />`，它会注入渲染操作模态框所需的 HTML。无论该组件有多少个操作，这在 Livewire 组件中只需要包含一次。

:::info
`filament/actions` 还包含以下包：

- `filament/forms`
- `filament/infolists`
- `filament/notifications`
- `filament/support`

这些包允许你在 Livewire 组件中使用它们的组件。
例如，如果你的操作使用了[通知](notifications)，请记得在布局中包含 `@livewire('notifications')`，并在 CSS 文件中添加 `@import '../../vendor/filament/notifications/resources/css/index.css'`。

如果你在操作中使用了任何其他 [Filament 组件](overview#包组件)，请确保也安装并集成了相应的包。
:::

## 传递操作参数

有时，你可能希望向操作传递参数。例如，如果你在同一视图中多次渲染相同的操作，但每次针对不同的模型，你可以将模型 ID 作为参数传递，然后稍后获取它。为此，你可以在视图中调用操作并以数组形式传入参数：

```php
<div>
    @foreach ($posts as $post)
        <h2>{{ $post->title }}</h2>

        {{ ($this->deleteAction)(['post' => $post->id]) }}
    @endforeach

    <x-filament-actions::modals />
</div>
```

现在，你可以在操作方法中访问帖子 ID：

```php
use App\Models\Post;
use Filament\Actions\Action;

public function deleteAction(): Action
{
    return Action::make('delete')
        ->color('danger')
        ->requiresConfirmation()
        ->action(function (array $arguments) {
            $post = Post::find($arguments['post']);

            $post?->delete();
        });
}
```

## 在 Livewire 视图中隐藏操作

如果你使用 `hidden()` 或 `visible()` 来控制操作是否渲染，你应该将操作包裹在对 `isVisible()` 的 `@if` 检查中：

```blade
<div>
    @if ($this->deleteAction->isVisible())
        {{ $this->deleteAction }}
    @endif
    
    {{-- 或者 --}}
    
    @if (($this->deleteAction)(['post' => $post->id])->isVisible())
        {{ ($this->deleteAction)(['post' => $post->id]) }}
    @endif
</div>
```

`hidden()` 和 `visible()` 方法还会控制操作是否被 `disabled()`，因此它们对于保护操作在用户没有权限时仍然有用。将此逻辑封装在操作本身的 `hidden()` 或 `visible()` 中是最佳实践，否则你需要在视图和 `disabled()` 中都定义条件。

你还可以利用此特性来隐藏在操作隐藏时不需要渲染的包裹元素：

```blade
<div>
    @if ($this->deleteAction->isVisible())
        <div>
            {{ $this->deleteAction }}
        </div>
    @endif
</div>
```

## 在 Livewire 视图中分组操作

你可以使用 `<x-filament-actions::group>` Blade 组件将[操作分组到下拉菜单](../actions/grouping-actions)中，将 `actions` 数组作为属性传入：

```blade
<div>
    <x-filament-actions::group :actions="[
        $this->editAction,
        $this->viewAction,
        $this->deleteAction,
    ]" />

    <x-filament-actions::modals />
</div>
```

你还可以传入任何属性来自定义触发按钮和下拉菜单的外观：

```blade
<div>
    <x-filament-actions::group
        :actions="[
            $this->editAction,
            $this->viewAction,
            $this->deleteAction,
        ]"
        label="Actions"
        icon="heroicon-m-ellipsis-vertical"
        color="primary"
        size="md"
        tooltip="More actions"
        dropdown-placement="bottom-start"
    />

    <x-filament-actions::modals />
</div>
```

## 链式操作

你可以将多个操作链接在一起，通过调用 `replaceMountedAction()` 方法在当前操作完成后替换为另一个操作：

```php
use App\Models\Post;
use Filament\Actions\Action;

public function editAction(): Action
{
    return Action::make('edit')
        ->schema([
            // ...
        ])
        // ...
        ->action(function (array $arguments) {
            $post = Post::find($arguments['post']);

            // ...

            $this->replaceMountedAction('publish', $arguments);
        });
}

public function publishAction(): Action
{
    return Action::make('publish')
        ->requiresConfirmation()
        // ...
        ->action(function (array $arguments) {
            $post = Post::find($arguments['post']);

            $post->publish();
        });
}
```

现在，当第一个操作提交后，第二个操作将在其位置打开。最初传递给第一个操作的[参数](#传递操作参数)会被传递给第二个操作，因此你可以使用它们在请求之间持久化数据。

如果第一个操作被取消，第二个操作不会打开。如果第二个操作被取消，第一个操作已经运行且无法取消。

## 以编程方式触发操作

有时你可能需要在不点击内置触发按钮的情况下触发操作，特别是从 JavaScript 中。以下是一个可以在 Livewire 组件上注册的示例操作：

```php
use Filament\Actions\Action;

public function testAction(): Action
{
    return Action::make('test')
        ->requiresConfirmation()
        ->action(function (array $arguments) {
            dd('Test action called', $arguments);
        });
}
```

你可以使用 `wire:click` 属性在 HTML 中通过点击触发该操作，调用 `mountAction()` 方法并可选地传入任何你想要的参数：

```blade
<button wire:click="mountAction('test', { id: 12345 })">
    Button
</button>
```

要从 JavaScript 触发该操作，你可以使用 [`$wire` 工具](https://livewire.laravel.com/docs/alpine#controlling-livewire-from-alpine-using-wire)，传入相同的参数：

```js
$wire.mountAction('test', { id: 12345 })
```

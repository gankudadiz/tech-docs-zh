---
title: URL 状态
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/url.md
source_version: v3.8.0
translation_status: draft
---

Livewire 允许你将组件属性存储在 URL 的查询字符串中。例如，你可能希望组件中的 `$search` 属性包含在 URL 中：`https://example.com/users?search=bob`。这对于筛选、排序和分页等功能特别有用，因为它允许用户共享和收藏页面的特定状态。

## 基本用法

以下是一个 `ShowUsers` 组件，允许用户通过简单的文本输入按姓名搜索用户：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Url;
use Livewire\Component;
use App\Models\User;

class ShowUsers extends Component
{
    public $search = '';

    public function render()
    {
        return view('livewire.show-users', [
            'users' => User::search($this->search)->get(),
        ]);
    }
}
```

```blade
<div>
    <input type="text" wire:model.live="search">

    <ul>
        @foreach ($users as $user)
            <li wire:key="{{ $user->id }}">{{ $user->name }}</li>
        @endforeach
    </ul>
</div>
```

如你所见，由于文本输入使用了 `wire:model.live="search"`，当用户输入时，将发送网络请求以更新 `$search` 属性并在页面上显示筛选后的用户集。

然而，如果访问者刷新页面，搜索值和结果将丢失。

为了在页面加载之间保留搜索值，以便访问者可以刷新页面或分享 URL，我们可以通过为 `$search` 属性添加 `#[Url]` attribute（属性）将搜索值存储在 URL 的查询字符串中，如下所示：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Url;
use Livewire\Component;
use App\Models\User;

class ShowUsers extends Component
{
    #[Url] // [tl! highlight]
    public $search = '';

    public function render()
    {
        return view('livewire.show-users', [
            'posts' => User::search($this->search)->get(),
        ]);
    }
}
```

现在，如果用户在搜索字段中输入"bob"，浏览器地址栏将显示：

```
https://example.com/users?search=bob
```

如果用户现在从新的浏览器窗口加载此 URL，"bob"将填入搜索字段，用户结果也将相应地被筛选。

## 从 URL 初始化属性

正如你在前面的示例中所看到的，当属性使用 `#[Url]` 时，它不仅会将更新后的值存储在 URL 的查询字符串中，还会在页面加载时引用任何现有的查询字符串值。

例如，如果用户访问 URL `https://example.com/users?search=bob`，Livewire 会将 `$search` 的初始值设置为"bob"。

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url]
    public $search = ''; // 将被设置为 "bob"...

    // ...
}
```

### 可为空的属性

默认情况下，如果页面加载时查询字符串条目为空（如 `?search=`），Livewire 会将该值视为空字符串。在许多情况下，这是符合预期的，但有时你可能希望将 `?search=` 视为 `null`。

在这些情况下，你可以使用可空的类型提示，如下所示：

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url]
    public ?string $search; // [tl! highlight]

    // ...
}
```

由于上述类型提示中包含了 `?`，Livewire 会将 `?search=` 视为空字符串，并将 `$search` 设置为 `null` 而不是空字符串。

反之亦然，如果你在应用中将 `$this->search = null`，它将在查询字符串中表示为 `?search=`。

## 使用别名

Livewire 让你完全控制 URL 查询字符串中显示的名称。例如，你可能有一个 `$search` 属性，但希望隐藏实际属性名或将其缩短为 `q`。

你可以通过向 `#[Url]` attribute 提供 `as` 参数来指定查询字符串别名：

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(as: 'q')]
    public $search = '';

    // ...
}
```

现在，当用户在搜索字段中输入"bob"时，URL 将显示：`https://example.com/users?q=bob` 而不是 `?search=bob`。

## 排除特定值

默认情况下，Livewire 仅在其值相对于初始化时发生变化时，才会在查询字符串中添加条目。大多数情况下，这是期望的行为，但在某些场景下，你可能希望对 Livewire 从查询字符串中排除哪些值拥有更多控制。在这些情况下，你可以使用 `except` 参数。

例如，在下面的组件中，`$search` 的初始值在 `mount()` 中被修改了。为了确保只有当 `search` 值为空字符串时，浏览器才会从查询字符串中排除 `search`，我们在 `#[Url]` 中添加了 `except` 参数：

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(except: '')]
    public $search = '';

    public function mount() {
        $this->search = auth()->user()->username;
    }

    // ...
}
```

在上面的示例中，如果没有 `except`，Livewire 会在 `search` 的值等于初始值 `auth()->user()->username` 时将其从查询字符串中移除。而由于使用了 `except: ''`，Livewire 将保留所有查询字符串值，除非 `search` 为空字符串。

## 页面加载时显示

默认情况下，Livewire 仅在页面上的值发生更改后才在查询字符串中显示该值。例如，如果 `$search` 的默认值是空字符串 `""`，那么当实际搜索框为空时，URL 中不会显示任何值。

如果你希望 `?search` 条目始终包含在查询字符串中，即使值为空，你也可以向 `#[Url]` attribute 提供 `keep` 参数：

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(keep: true)]
    public $search = '';

    // ...
}
```

现在，页面加载时，URL 将被更改为：`https://example.com/users?search=`

## 存储在历史记录中

默认情况下，Livewire 使用 [`history.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) 而不是 [`history.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) 来修改 URL。这意味着当 Livewire 更新查询字符串时，它修改的是浏览器历史记录中的当前条目，而不是添加新条目。

由于 Livewire 会"替换"当前历史记录，点击浏览器的"返回"按钮将导航到上一个页面，而不是上一个 `?search=` 值。

要强制 Livewire 在更新 URL 时使用 `history.pushState`，你可以向 `#[Url]` attribute 提供 `history` 参数：

```php
use Livewire\Attributes\Url;
use Livewire\Component;

class ShowUsers extends Component
{
    #[Url(history: true)]
    public $search = '';

    // ...
}
```

在上面的示例中，当用户将搜索值从"bob"更改为"frank"然后点击浏览器的返回按钮时，搜索值（以及 URL）将被设置回"bob"，而不是导航到之前访问的页面。

## 使用 queryString 方法

查询字符串也可以定义为组件上的一个方法。这在某些属性具有动态选项时非常有用。

```php
use Livewire\Component;

class ShowUsers extends Component
{
    // ...

    protected function queryString()
    {
        return [
            'search' => [
                'as' => 'q',
            ],
        ];
    }
}
```

## Trait 钩子

Livewire 也为查询字符串提供了[钩子](/docs/livewire/v3.x/lifecycle-hooks)。

```php
trait WithSorting
{
    // ...

    protected function queryStringWithSorting()
    {
        return [
            'sortBy' => ['as' => 'sort'],
            'sortDirection' => ['as' => 'direction'],
        ];
    }
}
```

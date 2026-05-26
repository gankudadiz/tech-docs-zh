---
title: 分页
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/pagination.md
source_version: v3.8.0
translation_status: draft
---

Laravel 的 pagination（分页）功能允许你查询数据的子集，并为用户提供在结果页之间导航的能力。

由于 Laravel 的 paginator（分页器）是为静态应用设计的，在非 Livewire 应用中，每次页面导航都会触发浏览器完整访问一个包含所需页码的新 URL（`?page=2`）。

然而，当你在 Livewire 组件中使用分页时，用户可以在同一页面内切换页面。Livewire 会在幕后处理所有事情，包括更新 URL 查询字符串中的当前页码。

## 基本用法

以下是在 `ShowPosts` 组件中使用分页的最基本示例，每次仅显示十条帖子：

> [!warning] 必须使用 `WithPagination` trait
> 要使用 Livewire 的分页功能，包含分页的每个组件都必须使用 `Livewire\WithPagination` trait。

```php
<?php

namespace App\Livewire;

use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    use WithPagination;

    public function render()
    {
        return view('show-posts', [
            'posts' => Post::paginate(10),
        ]);
    }
}
```

```blade
<div>
    <div>
        @foreach ($posts as $post)
            <!-- ... -->
        @endforeach
    </div>

    {{ $posts->links() }}
</div>
```

如你所见，除了通过 `Post::paginate()` 方法限制显示的帖子数量外，我们还使用 `$posts->links()` 来渲染页面导航链接。

有关使用 Laravel 进行分页的更多信息，请查阅 [Laravel 的全面分页文档](https://laravel.com/docs/pagination)。

## 禁用 URL 查询字符串跟踪

默认情况下，Livewire 的 paginator 会在浏览器 URL 的查询字符串中跟踪当前页，例如：`?page=2`。

如果你希望继续使用 Livewire 的分页功能，但禁用查询字符串跟踪，可以使用 `WithoutUrlPagination` trait：

```php
use Livewire\WithoutUrlPagination;
use Livewire\WithPagination;
use Livewire\Component;

class ShowPosts extends Component
{
    use WithPagination, WithoutUrlPagination; // [tl! highlight]

    // ...
}
```

现在，分页功能将正常工作，但当前页码不会出现在查询字符串中。这也意味着当前页在页面切换后不会被持久化。

## 自定义滚动行为

默认情况下，Livewire 的分页器在每次页面切换后会滚动到页面顶部。

你可以通过向 `links()` 方法的 `scrollTo` 参数传递 `false` 来禁用此行为：

```blade
{{ $posts->links(data: ['scrollTo' => false]) }}
```

或者，你可以向 `scrollTo` 参数提供任意 CSS 选择器，Livewire 会找到匹配该选择器的最近元素，并在每次导航后滚动到该元素：

```blade
{{ $posts->links(data: ['scrollTo' => '#paginated-posts']) }}
```

## 重置页码

在对结果进行排序或筛选时，通常需要将页码重置为 `1`。

因此，Livewire 提供了 `$this->resetPage()` 方法，允许你在组件中任意位置重置页码。

以下组件演示了在提交搜索表单后使用此方法重置页码：

```php
<?php

namespace App\Livewire;

use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Post;

class SearchPosts extends Component
{
    use WithPagination;

    public $query = '';

    public function search()
    {
        $this->resetPage();
    }

    public function render()
    {
        return view('show-posts', [
            'posts' => Post::where('title', 'like', '%'.$this->query.'%')->paginate(10),
        ]);
    }
}
```

```blade
<div>
    <form wire:submit="search">
        <input type="text" wire:model="query">

        <button type="submit">Search posts</button>
    </form>

    <div>
        @foreach ($posts as $post)
            <!-- ... -->
        @endforeach
    </div>

    {{ $posts->links() }}
</div>
```

现在，如果用户在第 `5` 页并通过点击"Search posts"进一步筛选结果，页面将被重置回 `1`。

### 可用的页面导航方法

除了 `$this->resetPage()`，Livewire 还提供了其他在组件中编程导航页面的有用方法：

| 方法        | 说明                               |
|-----------------|-------------------------------------------|
| `$this->setPage($page)`    | 将分页器设置为指定页码 |
| `$this->resetPage()`    | 将页面重置为 1 |
| `$this->nextPage()`    | 前往下一页 |
| `$this->previousPage()`    | 前往上一页 |

## 多个分页器

由于 Laravel 和 Livewire 都使用 URL 查询字符串参数来存储和跟踪当前页码，如果单个页面包含多个分页器，则必须为它们指定不同的名称。

为了更好地说明问题，请考虑以下 `ShowClients` 组件：

```php
use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Client;

class ShowClients extends Component
{
    use WithPagination;

    public function render()
    {
        return view('show-clients', [
            'clients' => Client::paginate(10),
        ]);
    }
}
```

如上所示，上述组件包含一组分页显示的 *clients*。如果用户导航到该结果集的第 `2` 页，URL 可能如下所示：

```
http://application.test/?page=2
```

假设该页面还包含一个也使用分页的 `ShowInvoices` 组件。要独立跟踪每个分页器的当前页，你需要为第二个分页器指定一个名称：

```php
use Livewire\WithPagination;
use Livewire\Component;
use App\Models\Invoices;

class ShowInvoices extends Component
{
    use WithPagination;

    public function render()
    {
        return view('show-invoices', [
            'invoices' => Invoice::paginate(10, pageName: 'invoices-page'),
        ]);
    }
}
```

现在，由于 `paginate` 方法中添加了 `pageName` 参数，当用户访问 *invoices* 的第 `2` 页时，URL 将包含以下内容：

```
https://application.test/customers?page=2&invoices-page=2
```

在命名分页器上使用 Livewire 的页面导航方法时，必须将页面名称作为额外参数提供：

```php
$this->setPage(2, pageName: 'invoices-page');

$this->resetPage(pageName: 'invoices-page');

$this->nextPage(pageName: 'invoices-page');

$this->previousPage(pageName: 'invoices-page');
```

## 钩入页面更新

Livewire 允许你在页面更新前后执行代码，只需在组件中定义以下任一方法：

```php
use Livewire\WithPagination;

class ShowPosts extends Component
{
    use WithPagination;

    public function updatingPage($page)
    {
        // 在此组件页面更新之前执行...
    }

    public function updatedPage($page)
    {
        // 在此组件页面更新之后执行...
    }

    public function render()
    {
        return view('show-posts', [
            'posts' => Post::paginate(10),
        ]);
    }
}
```

### 命名分页器钩子

上述钩子仅适用于默认分页器。如果你使用的是命名分页器，则必须使用分页器的名称来定义方法。

例如，以下是一个名为 `invoices-page` 的分页器的钩子示例：

```php
public function updatingInvoicesPage($page)
{
    //
}
```

### 通用分页器钩子

如果你不想在钩子方法名中引用分页器名称，可以使用更通用的替代方法，只需将 `$pageName` 作为钩子方法的第二个参数接收：

```php
public function updatingPaginators($page, $pageName)
{
    // 在此组件页面更新之前执行...
}

public function updatedPaginators($page, $pageName)
{
    // 在此组件页面更新之后执行...
}
```

## 使用简单主题

你可以使用 Laravel 的 `simplePaginate()` 方法代替 `paginate()` 以获得更高的速度和简洁性。

使用此方法对结果进行分页时，只向用户显示 *上一页* 和 *下一页* 导航链接，而不是每个页码的单独链接：

```php
public function render()
{
    return view('show-posts', [
        'posts' => Post::simplePaginate(10),
    ]);
}
```

有关简单分页的更多信息，请查阅 [Laravel 的 "simplePaginator" 文档](https://laravel.com/docs/pagination#simple-pagination)。

## 使用游标分页

Livewire 也支持使用 Laravel 的 cursor pagination（游标分页）——一种在大型数据集中非常有用的更快分页方法：

```php
public function render()
{
    return view('show-posts', [
        'posts' => Post::cursorPaginate(10),
    ]);
}
```

通过使用 `cursorPaginate()` 而不是 `paginate()` 或 `simplePaginate()`，应用 URL 中的查询字符串将存储一个编码后的 *cursor*（游标）而不是标准页码。例如：

```
https://example.com/posts?cursor=eyJpZCI6MTUsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0
```

有关游标分页的更多信息，请查阅 [Laravel 的游标分页文档](https://laravel.com/docs/pagination#cursor-pagination)。

## 使用 Bootstrap 代替 Tailwind

如果你使用 [Bootstrap](https://getbootstrap.com/) 而不是 [Tailwind](https://tailwindcss.com/) 作为应用的 CSS 框架，你可以配置 Livewire 使用 Bootstrap 样式的分页视图，而不是默认的 Tailwind 视图。

要实现这一点，在应用的 `config/livewire.php` 文件中设置 `pagination_theme` 配置值：

```php
'pagination_theme' => 'bootstrap',
```

> [!info] 发布 Livewire 的配置文件
> 在自定义分页主题之前，你必须先通过运行以下命令将 Livewire 的配置文件发布到应用的 `/config` 目录：
> ```shell
> php artisan livewire:publish --config
> ```

## 修改默认分页视图

如果你想修改 Livewire 的分页视图以适配应用的样式，可以通过以下命令 *发布* 它们：

```shell
php artisan livewire:publish --pagination
```

运行此命令后，以下四个文件将被插入到 `resources/views/vendor/livewire` 目录中：

| 视图文件名        | 说明                               |
|-----------------|-------------------------------------------|
| `tailwind.blade.php`    | 标准 Tailwind 分页主题 |
| `tailwind-simple.blade.php`    | *简单* Tailwind 分页主题 |
| `bootstrap.blade.php`    | 标准 Bootstrap 分页主题 |
| `bootstrap-simple.blade.php`    | *简单* Bootstrap 分页主题 |

文件发布后，你就拥有对它们的完全控制权。当在模板中使用分页结果的 `->links()` 方法渲染分页链接时，Livewire 将使用这些文件代替自带的文件。

## 使用自定义分页视图

如果你希望完全绕过 Livewire 的分页视图，可以通过以下两种方式之一渲染自己的视图：

1. Blade 视图中的 `->links()` 方法
2. 组件中的 `paginationView()` 或 `paginationSimpleView()` 方法

### 通过 `->links()`

第一种方法是直接将自定义分页 Blade 视图名称传递给 `->links()` 方法：

```blade
{{ $posts->links('custom-pagination-links') }}
```

渲染分页链接时，Livewire 现在将在 `resources/views/custom-pagination-links.blade.php` 中查找视图。

### 通过 `paginationView()` 或 `paginationSimpleView()`

第二种方法是在组件中声明一个 `paginationView` 或 `paginationSimpleView` 方法，该方法返回你想使用的视图名称：

```php
public function paginationView()
{
    return 'custom-pagination-links-view';
}

public function paginationSimpleView()
{
    return 'custom-simple-pagination-links-view';
}
```

### 分页视图示例

以下是一个未设置样式的简单 Livewire 分页视图示例，供你参考。

如你所见，你可以直接在模板中使用 Livewire 的页面导航辅助方法（如 `$this->nextPage()`），只需将 `wire:click="nextPage"` 添加到按钮上：

```blade
<div>
    @if ($paginator->hasPages())
        <nav role="navigation" aria-label="Pagination Navigation">
            <span>
                @if ($paginator->onFirstPage())
                    <span>Previous</span>
                @else
                    <button wire:click="previousPage" wire:loading.attr="disabled" rel="prev">Previous</button>
                @endif
            </span>

            <span>
                @if ($paginator->onLastPage())
                    <span>Next</span>
                @else
                    <button wire:click="nextPage" wire:loading.attr="disabled" rel="next">Next</button>
                @endif
            </span>
        </nav>
    @endif
</div>
```

---
title: Pagination Blade 组件
---

## 简介

Pagination 组件只能在 Livewire Blade 视图中使用。它可以渲染一个分页链接列表：

```php
use App\Models\User;
use Illuminate\Contracts\View\View;
use Livewire\Component;

class ListUsers extends Component
{
    // ...

    public function render(): View
    {
        return view('livewire.list-users', [
            'users' => User::query()->paginate(10),
        ]);
    }
}
```

```blade
<x-filament::pagination :paginator="$users" />
```

![分页](/assets/filament/v4.x/screenshots/images/light/components/pagination/simple.jpg)

或者，你可以使用简单分页或游标分页，它们只会渲染"上一页"和"下一页"按钮：

```php
use App\Models\User;

User::query()->simplePaginate(10)
User::query()->cursorPaginate(10)
```

![简单分页](/assets/filament/v4.x/screenshots/images/light/components/pagination/simple-paginator.jpg)

## 允许用户自定义每页显示数量

你可以通过向 `page-options` 属性传递一个选项数组来允许用户自定义每页显示的项目数量。你还需要定义一个 Livewire 属性来存储用户的选择：

```php
use App\Models\User;
use Illuminate\Contracts\View\View;
use Livewire\Component;

class ListUsers extends Component
{
    public int | string $perPage = 10;
    
    // ...
    
    public function render(): View
    {
        return view('livewire.list-users', [
            'users' => User::query()->paginate($this->perPage),
        ]);
    }
}
```

```blade
<x-filament::pagination
    :paginator="$users"
    :page-options="[5, 10, 20, 50, 100, 'all']"
    current-page-option-property="perPage"
/>
```

![带有页面大小选项的分页](/assets/filament/v4.x/screenshots/images/light/components/pagination/page-options.jpg)

## 显示首页和末页链接

极端链接是指首页和末页链接。你可以通过向组件传递 `extreme-links` 属性来添加它们：

```blade
<x-filament::pagination
    :paginator="$users"
    extreme-links
/>
```

![带有极端链接的分页](/assets/filament/v4.x/screenshots/images/light/components/pagination/extreme-links.jpg)

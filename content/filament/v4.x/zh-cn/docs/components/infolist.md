---
title: 在 Blade 视图中渲染信息列表
---

:::warning
在继续之前，请确保 `filament/infolists` 已安装在你的项目中。可以通过运行以下命令检查：

```bash
composer show filament/infolists
```
如果尚未安装，请参考[安装指南](../introduction/installation#安装独立组件)并按照说明配置**独立组件**。
:::

## 设置 Livewire 组件

首先，生成一个新的 Livewire 组件：

```bash
php artisan make:livewire ViewProduct
```

然后，在页面上渲染你的 Livewire 组件：

```blade
@livewire('view-product')
```

或者，你可以使用全页 Livewire 组件：

```php
use App\Livewire\ViewProduct;
use Illuminate\Support\Facades\Route;

Route::get('products/{product}', ViewProduct::class);
```

你必须在 Livewire 组件类上使用 `InteractsWithSchemas` trait，并实现 `HasSchemas` 接口：

```php
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Livewire\Component;

class ViewProduct extends Component implements HasSchemas
{
    use InteractsWithSchemas;

    // ...
}
```

## 添加信息列表

接下来，向 Livewire 组件添加一个方法，该方法接受一个 `$schema` 对象，修改它并返回它：

```php
use Filament\Schemas\Schema;

public function productInfolist(Schema $schema): Schema
{
    return $schema
        ->record($this->product)
        ->components([
            // ...
        ]);
}
```

最后，在 Livewire 组件的视图中渲染信息列表：

```blade
{{ $this->productInfolist }}
```

:::info
`filament/infolists` 还包含以下包：

- `filament/actions`
- `filament/schemas`
- `filament/support`

这些包允许你在 Livewire 组件中使用它们的组件。
例如，如果你的信息列表使用了[操作](../actions)，请记得在 Livewire 组件类上实现 `HasActions` 接口并使用 `InteractsWithActions` trait。

如果你在信息列表中使用了任何其他 [Filament 组件](overview#包组件)，请确保也安装并集成了相应的包。
:::

## 向信息列表传递数据

你可以通过两种方式向信息列表传递数据：

将 Eloquent 模型实例传递给信息列表的 `record()` 方法，以自动将所有模型属性和关系映射到信息列表 schema 中的条目：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

public function productInfolist(Schema $schema): Schema
{
    return $schema
        ->record($this->product)
        ->components([
            TextEntry::make('name'),
            TextEntry::make('category.name'),
            // ...
        ]);
}
```

或者，你可以将数据数组传递给信息列表的 `state()` 方法，以手动将数据映射到信息列表 schema 中的条目：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

public function productInfolist(Schema $schema): Schema
{
    return $schema
        ->constantState([
            'name' => 'MacBook Pro',
            'category' => [
                'name' => 'Laptops',
            ],
            // ...
        ])
        ->components([
            TextEntry::make('name'),
            TextEntry::make('category.name'),
            // ...
        ]);
}
```

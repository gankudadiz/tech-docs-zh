---
title: 在 Blade 视图中渲染 Schema
---

:::warning
在继续之前，请确保 `filament/schemas` 已安装在你的项目中。可以通过运行以下命令检查：

```bash
composer show filament/schemas
```
如果尚未安装，请参考[安装指南](../introduction/installation#installing-the-individual-components)并按照说明配置**独立组件**。
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

## 添加 Schema

接下来，向 Livewire 组件添加一个方法，该方法接受一个 `$schema` 对象，修改它并返回它：

```php
use Filament\Schemas\Schema;

public function productSchema(Schema $schema): Schema
{
    return $schema
        ->components([
            // ...
        ]);
}
```

最后，在 Livewire 组件的视图中渲染 schema：

```blade
{{ $this->productSchema }}
```

:::info
`filament/schemas` 还包含以下包：

- `filament/actions`
- `filament/support`

这些包允许你在 Livewire 组件中使用它们的组件。
例如，如果你的 schema 使用了[操作](../actions)，请记得在 Livewire 组件类上实现 `HasActions` 接口并使用 `InteractsWithActions` trait。

如果你在 schema 中使用了任何其他 [Filament 组件](overview#package-components)，请确保也安装并集成了相应的包。
:::

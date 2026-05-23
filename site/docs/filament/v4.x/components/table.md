---
title: 在 Blade 视图中渲染表格
---

:::warning
在继续之前，请确保 `filament/tables` 已安装在你的项目中。可以通过运行以下命令检查：

```bash
composer show filament/tables
```
如果尚未安装，请参考[安装指南](../introduction/installation#installing-the-individual-components)并按照说明配置**独立组件**。
:::

## 设置 Livewire 组件

首先，生成一个新的 Livewire 组件：

```bash
php artisan make:livewire ListProducts
```

然后，在页面上渲染你的 Livewire 组件：

```blade
@livewire('list-products')
```

或者，你可以使用全页 Livewire 组件：

```php
use App\Livewire\ListProducts;
use Illuminate\Support\Facades\Route;

Route::get('products', ListProducts::class);
```

## 添加表格

在 Livewire 组件类中添加表格有 3 个任务：

1) 实现 `HasTable` 和 `HasSchemas` 接口，并使用 `InteractsWithTable` 和 `InteractsWithSchemas` trait。
2) 添加一个 `table()` 方法，这是你配置表格的地方。[添加表格的列、过滤器和操作](../tables/overview#columns)。
3) 确保定义用于获取表格行的基础查询。例如，如果你正在列出 `Product` 模型的产品，你需要返回 `Product::query()`。

```php
<?php

namespace App\Livewire;

use App\Models\Shop\Product;
use Filament\Actions\Concerns\InteractsWithActions;  
use Filament\Actions\Contracts\HasActions;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Illuminate\Contracts\View\View;
use Livewire\Component;

class ListProducts extends Component implements HasActions, HasSchemas, HasTable
{
    use InteractsWithActions;
    use InteractsWithSchemas;
    use InteractsWithTable;
    
    public function table(Table $table): Table
    {
        return $table
            ->query(Product::query())
            ->columns([
                TextColumn::make('name'),
            ])
            ->filters([
                // ...
            ])
            ->recordActions([
                // ...
            ])
            ->toolbarActions([
                // ...
            ]);
    }
    
    public function render(): View
    {
        return view('livewire.list-products');
    }
}
```

最后，在 Livewire 组件的视图中渲染表格：

```blade
<div>
    {{ $this->table }}
</div>
```

在浏览器中访问你的 Livewire 组件，你应该能看到表格。

:::info
`filament/tables` 还包含以下包：

- `filament/actions`
- `filament/forms`
- `filament/support`

这些包允许你在 Livewire 组件中使用它们的组件。
例如，如果你的表格使用了[操作](action#setting-up-the-livewire-component)，请记得实现 `HasActions` 接口并包含 `InteractsWithActions` trait。

如果你在表格中使用了任何其他 [Filament 组件](overview#package-components)，请确保也安装并集成了相应的包。
:::

## 为 Eloquent 关系构建表格

如果你想为 Eloquent 关系构建表格，可以在 `$table` 上使用 `relationship()` 和 `inverseRelationship()` 方法，而不是传递 `query()`。`HasMany`、`HasManyThrough`、`BelongsToMany`、`MorphMany` 和 `MorphToMany` 关系是兼容的：

```php
use App\Models\Category;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

public Category $category;

public function table(Table $table): Table
{
    return $table
        ->relationship(fn (): BelongsToMany => $this->category->products())
        ->inverseRelationship('categories')
        ->columns([
            TextColumn::make('name'),
        ]);
}
```

在此示例中，我们有一个 `$category` 属性，它保存了一个 `Category` 模型实例。该分类有一个名为 `products` 的关系。我们使用一个函数来返回关系实例。这是一个多对多关系，因此反向关系称为 `categories`，定义在 `Product` 模型上。我们只需要将此关系的名称传递给 `inverseRelationship()` 方法，而不是整个实例。

现在表格使用的是关系而不是普通的 Eloquent 查询，所有操作都将在关系上执行，而不是查询。例如，如果你使用 [`CreateAction`](../actions/create)，新产品将自动附加到该分类。

如果你的关系使用了中间表，你可以像使用表格上的普通列一样使用所有中间表列，只要它们列在关系*和*反向关系定义的 `withPivot()` 方法中。

关系表在面板构建器中用作["关系管理器"](../resources/managing-relationships#creating-a-relation-manager)。关系管理器的大部分文档化功能也适用于关系表。例如，[附加和分离](../resources/managing-relationships#attaching-and-detaching-records)以及[关联和取消关联](../resources/managing-relationships#associating-and-dissociating-records)操作。

## 使用 CLI 生成表格 Livewire 组件

建议你先学习如何手动设置带有表格构建器的 Livewire 组件，但当你熟练后，可以使用 CLI 为你生成表格。

```bash
php artisan make:livewire-table Products/ListProducts
```

这将询问你预构建模型的名称，例如 `Product`。最后，它将生成一个新的 `app/Livewire/Products/ListProducts.php` 组件，你可以自定义它。

### 自动生成表格列

Filament 还能够根据模型的数据库列猜测你想要的表格列。你可以在生成表格时使用 `--generate` 标志：

```bash
php artisan make:livewire-table Products/ListProducts --generate
```

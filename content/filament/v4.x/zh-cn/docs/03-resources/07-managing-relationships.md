---
title: 管理关联关系
---

## 为任务选择合适的工具

Filament 提供了多种管理应用中关联关系的方式。你应该使用哪个功能，取决于你正在管理的关联类型以及你想要的 UI 形式。

### 关联管理器 - 资源表单下方的交互式表格

:::info
    这些适用于 `HasMany`、`HasManyThrough`、`BelongsToMany`、`MorphMany` 和 `MorphToMany` 关联关系。
:::

[关联管理器](#创建关联管理器)是交互式表格，允许管理员在不离开资源的编辑或查看页面的情况下，列出、创建、关联、关联（关联模型）、编辑、取消关联、取消关联（关联模型）和删除关联记录。

### Select 和复选框列表 - 从现有记录中选择或创建新记录

:::info
    这些适用于 `BelongsTo`、`MorphTo` 和 `BelongsToMany` 关联关系。
:::

使用 [select](../forms/select#integrating-with-an-eloquent-relationship) 时，用户可以从现有记录列表中进行选择。你还可以[添加一个按钮，允许在模态框内创建新记录](../forms/select#creating-new-records)，而无需离开页面。

当 `BelongsToMany` 关联关系配合 select 使用时，你可以选择多个选项，而不仅仅是一个。提交表单时，记录会自动添加到你的中间表中。如果你愿意，可以用简单的[复选框列表](../forms/checkbox-list#integrating-with-an-eloquent-relationship)替换多选下拉框。两个组件的工作方式相同。

### Repeater - 在所有者表单内对多个关联记录进行 CRUD

:::info
    这些适用于 `HasMany` 和 `MorphMany` 关联关系。
:::

[Repeater](../forms/repeater#integrating-with-an-eloquent-relationship)是标准的表单组件，可以渲染一组可无限重复的字段。它们可以连接到关联关系，从而自动从关联表中读取、创建、更新和删除记录。它们位于主表单 schema 内，可以在资源页面中使用，也可以嵌套在操作模态框内。

从用户体验角度来看，此解决方案仅适用于关联模型只有少量字段的情况。否则，表单会变得非常长。

### 布局表单组件 - 将表单字段保存到单个关联关系

:::info
    这些适用于 `BelongsTo`、`HasOne` 和 `MorphOne` 关联关系。
:::

所有布局表单组件（[Grid](../schemas/layouts#grid-component)、[Section](../schemas/sections)、[Fieldset](../schemas/layouts#fieldset-component) 等）都有一个 [`relationship()` 方法](../forms/overview#saving-data-to-relationships)。当你使用它时，该布局内的所有字段都会保存到关联模型，而不是所有者模型：

```php
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Fieldset;

Fieldset::make('Metadata')
    ->relationship('metadata')
    ->schema([
        TextInput::make('title'),
        Textarea::make('description'),
        FileUpload::make('image'),
    ])
```

在这个例子中，`title`、`description` 和 `image` 会自动从 `metadata` 关联关系加载，并在表单提交时再次保存。如果 `metadata` 记录不存在，它会被自动创建。

此功能在[表单文档](../forms/overview#saving-data-to-relationships)中有更深入的解释。请访问该页面了解更多关于如何使用它的信息。

## 创建关联管理器

要创建关联管理器，你可以使用 `make:filament-relation-manager` 命令：

```bash
php artisan make:filament-relation-manager CategoryResource posts title
```

- `CategoryResource` 是所有者（父）模型的资源类名称。
- `posts` 是你要管理的关联关系名称。
- `title` 是用于标识帖子的属性名称。

这将创建一个 `CategoryResource/RelationManagers/PostsRelationManager.php` 文件。其中包含一个类，你可以在其中定义关联管理器的[表单](overview#resource-forms)和[表格](overview#resource-tables)：

```php
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

public function form(Schema $schema): Schema
{
    return $schema
        ->components([
            Forms\Components\TextInput::make('title')->required(),
            // ...
        ]);
}

public function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('title'),
            // ...
        ]);
}
```

你必须在资源的 `getRelations()` 方法中注册新的关联管理器：

```php
public static function getRelations(): array
{
    return [
        RelationManagers\PostsRelationManager::class,
    ];
}
```

一旦为关联管理器定义了表格和表单，就可以访问资源的[编辑](editing-records)或[查看](viewing-records)页面来查看效果。

![关联管理器](../../../raw-assets/docs-assets/screenshots/images/light/panels/resources/relation-manager.jpg)

### 自定义关联管理器的 URL 参数

如果你向 `getRelations()` 返回的数组传递一个键，它将用于在多个关联管理器之间切换时的 URL 中。例如，你可以传递 `posts` 来使用 URL 中的 `?relation=posts`，而不是数字数组索引：

```php
public static function getRelations(): array
{
    return [
        'posts' => RelationManagers\PostsRelationManager::class,
    ];
}
```

### 只读模式

关联管理器通常显示在资源的编辑或查看页面上。在查看页面上，Filament 会自动隐藏所有修改关联关系的操作，例如创建、编辑和删除。我们称之为"只读模式"，默认情况下启用以保持查看页面的只读行为。但是，你可以通过在关联管理器类上覆盖 `isReadOnly()` 方法，使其始终返回 `false` 来禁用此行为：

```php
public function isReadOnly(): bool
{
    return false;
}
```

或者，如果你不喜欢此功能，可以在面板[配置](../panel-configuration)中一次性为所有关联管理器禁用它：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->readOnlyRelationManagersOnResourceViewPagesByDefault(false);
}
```

### 非常规的反向关联名称

对于不遵循 Laravel 命名规范的反向关联关系，你可能需要使用表格上的 `inverseRelationship()` 方法：

```php
use Filament\Tables;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('title'),
            // ...
        ])
        ->inverseRelationship('section'); // 由于反向关联模型是 `Category`，通常应该是 `category`，而不是 `section`。
}
```

### 处理软删除

默认情况下，你无法与关联管理器中已删除的记录进行交互。如果你希望在关联管理器中添加恢复、强制删除和筛选已删除记录的功能，请在生成关联管理器时使用 `--soft-deletes` 标志：

```bash
php artisan make:filament-relation-manager CategoryResource posts title --soft-deletes
```

你可以在[这里](#删除关联记录)了解更多关于软删除的信息。

## 列出关联记录

关联记录将以表格形式列出。整个关联管理器都基于此表格，其中包含[创建](#创建关联记录)、[编辑](#编辑关联记录)、[关联 / 取消关联](#关联和取消关联记录)、[关联 / 取消关联](#关联和取消关联记录)以及删除记录的操作。

你可以使用 [Table Builder](../tables) 的任何功能来自定义关联管理器。

### 带中间表属性的列表

对于 `BelongsToMany` 和 `MorphToMany` 关联关系，你还可以添加中间表属性。例如，如果你的 `UserResource` 有一个 `TeamsRelationManager`，并且你想将 `role` 中间表属性添加到表格中，可以使用：

```php
use Filament\Tables;

public function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('name'),
            Tables\Columns\TextColumn::make('role'),
        ]);
}
```

请确保任何中间表属性都在关联关系*和*反向关联关系的 `withPivot()` 方法中列出。

## 创建关联记录

### 带中间表属性的创建

对于 `BelongsToMany` 和 `MorphToMany` 关联关系，你还可以添加中间表属性。例如，如果你的 `UserResource` 有一个 `TeamsRelationManager`，并且你想将 `role` 中间表属性添加到创建表单中，可以使用：

```php
use Filament\Forms;
use Filament\Schemas\Schema;

public function form(Schema $schema): Schema
{
    return $schema
        ->components([
            Forms\Components\TextInput::make('name')->required(),
            Forms\Components\TextInput::make('role')->required(),
            // ...
        ]);
}
```

请确保任何中间表属性都在关联关系*和*反向关联关系的 `withPivot()` 方法中列出。

### 自定义 `CreateAction`

要了解如何自定义 `CreateAction`，包括修改表单数据、更改通知和添加生命周期钩子，请参阅[操作文档](../actions/create)。

## 编辑关联记录

### 带中间表属性的编辑

对于 `BelongsToMany` 和 `MorphToMany` 关联关系，你还可以编辑中间表属性。例如，如果你的 `UserResource` 有一个 `TeamsRelationManager`，并且你想将 `role` 中间表属性添加到编辑表单中，可以使用：

```php
use Filament\Forms;
use Filament\Schemas\Schema;

public function form(Schema $schema): Schema
{
    return $schema
        ->components([
            Forms\Components\TextInput::make('name')->required(),
            Forms\Components\TextInput::make('role')->required(),
            // ...
        ]);
}
```

请确保任何中间表属性都在关联关系*和*反向关联关系的 `withPivot()` 方法中列出。

### 自定义 `EditAction`

要了解如何自定义 `EditAction`，包括修改表单数据、更改通知和添加生命周期钩子，请参阅[操作文档](../actions/edit)。

## 关联和取消关联记录

Filament 能够为 `BelongsToMany` 和 `MorphToMany` 关联关系关联和取消关联记录。

生成关联管理器时，你可以传递 `--attach` 标志来同时添加 `AttachAction`、`DetachAction` 和 `DetachBulkAction` 到表格中：

```bash
php artisan make:filament-relation-manager CategoryResource posts title --attach
```

或者，如果你已经生成了资源，只需将操作添加到 `$table` 数组中即可：

```php
use Filament\Actions\AttachAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DetachAction;
use Filament\Actions\DetachBulkAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->headerActions([
            // ...
            AttachAction::make(),
        ])
        ->recordActions([
            // ...
            DetachAction::make(),
        ])
        ->toolbarActions([
            BulkActionGroup::make([
                // ...
                DetachBulkAction::make(),
            ]),
        ]);
}
```

![关联管理器关联模态框](../../../raw-assets/docs-assets/screenshots/images/light/panels/resources/relation-manager-attach.jpg)

### 预加载关联模态框的 select 选项

默认情况下，当你搜索要关联的记录时，选项会通过 AJAX 从数据库加载。如果你希望在表单首次加载时预加载这些选项，可以使用 `AttachAction` 的 `preloadRecordSelect()` 方法：

```php
use Filament\Actions\AttachAction;

AttachAction::make()
    ->preloadRecordSelect()
```

### 带中间表属性的关联

当你使用"关联"按钮关联记录时，你可能希望定义一个自定义表单来向关联关系添加中间表属性：

```php
use Filament\Actions\AttachAction;
use Filament\Forms;

AttachAction::make()
    ->schema(fn (AttachAction $action): array => [
        $action->getRecordSelect(),
        Forms\Components\TextInput::make('role')->required(),
    ])
```

在这个例子中，`$action->getRecordSelect()` 返回用于选择要关联记录的 select 字段。`role` 文本输入框的值将保存到中间表的 `role` 列中。

请确保任何中间表属性都在关联关系*和*反向关联关系的 `withPivot()` 方法中列出。

### 限定可关联的选项范围

你可能想要限定 `AttachAction` 可用的选项范围：

```php
use Filament\Actions\AttachAction;
use Illuminate\Database\Eloquent\Builder;

AttachAction::make()
    ->recordSelectOptionsQuery(fn (Builder $query) => $query->whereBelongsTo(auth()->user()))
```

### 跨多列搜索可关联的选项

默认情况下，`AttachAction` 可用的选项会在表格的 `recordTitleAttribute()` 中搜索。如果你希望跨多列搜索，可以使用 `recordSelectSearchColumns()` 方法：

```php
use Filament\Actions\AttachAction;

AttachAction::make()
    ->recordSelectSearchColumns(['title', 'description'])
```

### 关联多条记录

`AttachAction` 组件上的 `multiple()` 方法允许你选择多个值：

```php
use Filament\Actions\AttachAction;

AttachAction::make()
    ->multiple()
```

### 自定义关联模态框中的 select 字段

你可以通过向 `recordSelect()` 方法传递一个函数来自定义关联过程中使用的 select 字段对象：

```php
use Filament\Actions\AttachAction;
use Filament\Forms\Components\Select;

AttachAction::make()
    ->recordSelect(
        fn (Select $select) => $select->placeholder('Select a post'),
    )
```

#### 使用模态框表格选择要关联的记录

你可以使用 `tableSelect()` 方法在关联模态框中使用完整的 Filament 表格来选择记录，而不是简单的 select 下拉框：

```php
use App\Filament\Resources\Products\Tables\ProductsTable;
use Filament\Actions\AttachAction;

AttachAction::make()
    ->tableSelect(ProductsTable::class)
```

在这个例子中，`ProductsTable` 类是一个标准的 Filament 表格类，其中的 `configure()` 方法定义了表格的列：

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

public static function configure(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('name'),
            TextColumn::make('sku'),
            // ...
        ])
        ->filters([
            // ...
        ]);
}
```

### 处理重复记录

默认情况下，不允许你多次关联同一条记录。这是因为要使此功能正常工作，你还必须在中间表上设置主键 `id` 列。

请确保 `id` 属性在关联关系*和*反向关联关系的 `withPivot()` 方法中列出。

最后，将 `allowDuplicates()` 方法添加到表格中：

```php
public function table(Table $table): Table
{
    return $table
        ->allowDuplicates();
}
```

### 提高批量取消关联操作的性能

默认情况下，`DetachBulkAction` 会在循环遍历并逐个取消关联之前，将所有 Eloquent 记录加载到内存中。

如果你要取消关联大量记录，可以使用 `chunkSelectedRecords()` 方法一次获取少量记录。这将减少应用的内存使用量：

```php
use Filament\Actions\DetachBulkAction;

DetachBulkAction::make()
    ->chunkSelectedRecords(250)
```

Filament 在取消关联之前将 Eloquent 记录加载到内存中有两个原因：

- 允许在取消关联之前使用模型策略对集合中的单条记录进行授权（例如使用 `authorizeIndividualRecords('delete')`）。
- 确保在取消关联记录时运行模型事件，例如模型观察者中的 `deleting` 和 `deleted` 事件。

如果你不需要单条记录的策略授权和模型事件，可以使用 `fetchSelectedRecords(false)` 方法，它不会在取消关联之前将记录获取到内存中，而是通过单个查询来取消关联：

```php
use Filament\Actions\DetachBulkAction;

DetachBulkAction::make()
    ->fetchSelectedRecords(false)
```

## 关联和取消关联合记录

Filament 能够为 `HasMany` 和 `MorphMany` 关联关系关联和取消关联合记录。

生成关联管理器时，你可以传递 `--associate` 标志来同时添加 `AssociateAction`、`DissociateAction` 和 `DissociateBulkAction` 到表格中：

```bash
php artisan make:filament-relation-manager CategoryResource posts title --associate
```

或者，如果你已经生成了资源，只需将操作添加到 `$table` 数组中即可：

```php
use Filament\Actions\AssociateAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DissociateAction;
use Filament\Actions\DissociateBulkAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->headerActions([
            // ...
            AssociateAction::make(),
        ])
        ->recordActions([
            // ...
            DissociateAction::make(),
        ])
        ->toolbarActions([
            BulkActionGroup::make([
                // ...
                DissociateBulkAction::make(),
            ]),
        ]);
}
```

### 预加载关联模态框的 select 选项

默认情况下，当你搜索要关联的记录时，选项会通过 AJAX 从数据库加载。如果你希望在表单首次加载时预加载这些选项，可以使用 `AssociateAction` 的 `preloadRecordSelect()` 方法：

```php
use Filament\Actions\AssociateAction;

AssociateAction::make()
    ->preloadRecordSelect()
```

### 限定可关联的选项范围

你可能想要限定 `AssociateAction` 可用的选项范围：

```php
use Filament\Actions\AssociateAction;
use Illuminate\Database\Eloquent\Builder;

AssociateAction::make()
    ->recordSelectOptionsQuery(fn (Builder $query) => $query->whereBelongsTo(auth()->user()))
```

### 跨多列搜索可关联的选项

默认情况下，`AssociateAction` 可用的选项会在表格的 `recordTitleAttribute()` 中搜索。如果你希望跨多列搜索，可以使用 `recordSelectSearchColumns()` 方法：

```php
use Filament\Actions\AssociateAction;

AssociateAction::make()
    ->recordSelectSearchColumns(['title', 'description'])
```

### 关联多条记录

`AssociateAction` 组件上的 `multiple()` 方法允许你选择多个值：

```php
use Filament\Actions\AssociateAction;

AssociateAction::make()
    ->multiple()
```

### 自定义关联模态框中的 select 字段

你可以通过向 `recordSelect()` 方法传递一个函数来自定义关联过程中使用的 select 字段对象：

```php
use Filament\Actions\AssociateAction;
use Filament\Forms\Components\Select;

AssociateAction::make()
    ->recordSelect(
        fn (Select $select) => $select->placeholder('Select a post'),
    )
```

### 提高批量取消关联合操作的性能

默认情况下，`DissociateBulkAction` 会在循环遍历并逐个取消关联合之前，将所有 Eloquent 记录加载到内存中。

如果你要取消关联合大量记录，可以使用 `chunkSelectedRecords()` 方法一次获取少量记录。这将减少应用的内存使用量：

```php
use Filament\Actions\DissociateBulkAction;

DissociateBulkAction::make()
    ->chunkSelectedRecords(250)
```

Filament 在取消关联合之前将 Eloquent 记录加载到内存中有两个原因：

- 允许在取消关联合之前使用模型策略对集合中的单条记录进行授权（例如使用 `authorizeIndividualRecords('update')`）。
- 确保在取消关联合记录时运行模型事件，例如模型观察者中的 `updating` 和 `updated` 事件。

如果你不需要单条记录的策略授权和模型事件，可以使用 `fetchSelectedRecords(false)` 方法，它不会在取消关联合之前将记录获取到内存中，而是通过单个查询来取消关联合：

```php
use Filament\Actions\DissociateBulkAction;

DissociateBulkAction::make()
    ->fetchSelectedRecords(false)
```

## 查看关联记录

生成关联管理器时，你可以传递 `--view` 标志来同时添加 `ViewAction` 到表格中：

```bash
php artisan make:filament-relation-manager CategoryResource posts title --view
```

或者，如果你已经生成了关联管理器，只需将 `ViewAction` 添加到 `$table->recordActions()` 数组中即可：

```php
use Filament\Actions\ViewAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->recordActions([
            ViewAction::make(),
            // ...
        ]);
}
```

## 删除关联记录

默认情况下，你无法与关联管理器中已删除的记录进行交互。如果你希望在关联管理器中添加恢复、强制删除和筛选已删除记录的功能，请在生成关联管理器时使用 `--soft-deletes` 标志：

```bash
php artisan make:filament-relation-manager CategoryResource posts title --soft-deletes
```

或者，你可以将软删除功能添加到现有的关联管理器中：

```php
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

public function table(Table $table): Table
{
    return $table
        ->modifyQueryUsing(fn (Builder $query) => $query->withoutGlobalScopes([
            SoftDeletingScope::class,
        ]))
        ->columns([
            // ...
        ])
        ->filters([
            TrashedFilter::make(),
            // ...
        ])
        ->recordActions([
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
            // ...
        ])
        ->toolbarActions([
            BulkActionGroup::make([
                DeleteBulkAction::make(),
                ForceDeleteBulkAction::make(),
                RestoreBulkAction::make(),
                // ...
            ]),
        ]);
}
```

### 自定义 `DeleteAction`

要了解如何自定义 `DeleteAction`，包括更改通知和添加生命周期钩子，请参阅[操作文档](../actions/delete)。

## 导入关联记录

[`ImportAction`](../actions/import) 可以添加到关联管理器的头部来导入记录。在这种情况下，你可能希望告诉导入器这些新记录属于哪个所有者。你可以使用[导入选项](../actions/import#using-import-options)来传递所有者记录的 ID：

```php
ImportAction::make()
    ->importer(ProductImporter::class)
    ->options(['categoryId' => $this->getOwnerRecord()->getKey()])
```

现在，在导入器类中，你可以在一对多关联关系中将所有者与导入的记录关联起来：

```php
public function resolveRecord(): ?Product
{
    $product = Product::firstOrNew([
        'sku' => $this->data['sku'],
    ]);
    
    $product->category()->associate($this->options['categoryId']);
    
    return $product;
}
```

或者，你可以使用导入器的 `afterSave()` 钩子在多对多关联关系中关联记录：

```php
protected function afterSave(): void
{
    $this->record->categories()->syncWithoutDetaching([$this->options['categoryId']]);
}
```

## 访问关联关系的所有者记录

关联管理器是 Livewire 组件。当它们首次加载时，所有者记录（作为父级的 Eloquent 记录 - 主资源模型）会被保存到一个属性中。你可以使用以下方式读取此属性：

```php
$this->getOwnerRecord()
```

但是，如果你在 `static` 方法（如 `form()` 或 `table()`）内，`$this` 是不可访问的。因此，你可以[使用回调](../forms/overview#field-utility-injection)来访问 `$livewire` 实例：

```php
use Filament\Forms;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;

public function form(Schema $schema): Schema
{
    return $schema
        ->components([
            Forms\Components\Select::make('store_id')
                ->options(function (RelationManager $livewire): array {
                    return $livewire->getOwnerRecord()->stores()
                        ->pluck('name', 'id')
                        ->toArray();
                }),
            // ...
        ]);
}
```

Filament 中的所有方法都接受一个回调，你可以在其中访问 `$livewire->ownerRecord`。

## 对关联管理器进行分组

你可以选择将多个关联管理器组合到一个选项卡中。为此，你可以将多个管理器包装在一个 `RelationGroup` 对象中，并指定标签：

```php
use Filament\Resources\RelationManagers\RelationGroup;

public static function getRelations(): array
{
    return [
        RelationGroup::make('Interactions', [
            RelationManagers\CommentsRelationManager::class,
            RelationManagers\TagsRelationManager::class,
        ]),
        RelationGroup::make('Links', [
            RelationManagers\LinksRelationManager::class,
        ]),
    ];
}
```

![带分组选项卡的关联管理器](../../../raw-assets/docs-assets/screenshots/images/light/panels/resources/relation-manager-grouped.jpg)

## 条件显示关联管理器

默认情况下，如果关联模型策略的 `viewAny()` 方法返回 `true`，关联管理器将可见。

你可以使用 `canViewForRecord()` 方法来确定关联管理器是否对特定的所有者记录和页面可见：

```php
use Illuminate\Database\Eloquent\Model;

public static function canViewForRecord(Model $ownerRecord, string $pageClass): bool
{
    return $ownerRecord->status === Status::Draft;
}
```

## 将关联管理器选项卡与表单合并

在编辑或查看页面类上，覆盖 `hasCombinedRelationManagerTabsWithContent()` 方法：

```php
public function hasCombinedRelationManagerTabsWithContent(): bool
{
    return true;
}
```

![带合并关联管理器选项卡的资源编辑页面](../../../raw-assets/docs-assets/screenshots/images/light/panels/resources/editing-combined-tabs.jpg)

### 自定义内容选项卡

在编辑或查看页面类上，覆盖 `getContentTabComponent()` 方法，并使用任何 [Tab](../schemas/tabs) 自定义方法：

```php
use Filament\Schemas\Components\Tabs\Tab;

public function getContentTabComponent(): Tab
{
    return Tab::make('Settings')
        ->icon('heroicon-m-cog');
}
```

### 设置表单选项卡的位置

默认情况下，表单选项卡渲染在关联选项卡之前。要将其渲染在之后，你可以在编辑或查看页面类上覆盖 `getContentTabPosition()` 方法：

```php
use Filament\Resources\Pages\Enums\ContentTabPosition;

public function getContentTabPosition(): ?ContentTabPosition
{
    return ContentTabPosition::After;
}
```

## 自定义关联管理器选项卡

要自定义关联管理器的选项卡，覆盖 `getTabComponent()` 方法，并使用任何 [Tab](../schemas/tabs) 自定义方法：

```php
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Model;

public static function getTabComponent(Model $ownerRecord, string $pageClass): Tab
{
    return Tab::make('Blog posts')
        ->badge($ownerRecord->posts()->count())
        ->badgeColor('info')
        ->badgeTooltip('The number of posts in this category')
        ->icon('heroicon-m-document-text');
}
```

除了允许静态值外，`badgeColor()` 和 `badgeTooltip()` 方法还接受函数来动态计算它们。你可以在函数中注入各种实用工具作为参数。

如果你使用的是[关联分组](#对关联管理器进行分组)，可以使用 `tab()` 方法：

```php
use Filament\Resources\RelationManagers\RelationGroup;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Model;

RelationGroup::make('Contacts', [
    // ...
])
    ->tab(fn (Model $ownerRecord): Tab => Tab::make('Blog posts')
        ->badge($ownerRecord->posts()->count())
        ->badgeColor('info')
        ->badgeTooltip('The number of posts in this category')
        ->icon('heroicon-m-document-text'));
```

除了允许静态值外，`badgeColor()` 和 `badgeTooltip()` 方法还接受函数来动态计算它们。你可以在函数中注入各种实用工具作为参数。

### 延迟加载关联管理器选项卡的徽章

如果 `getBadge()` 运行的查询开销较大，你可以通过将 `$isBadgeDeferred` 属性设置为 `true` 来延迟徽章，使其在页面渲染后异步加载：

```php
use Illuminate\Database\Eloquent\Model;

protected static bool $isBadgeDeferred = true;

public static function getBadge(Model $ownerRecord, string $pageClass): ?string
{
    $count = $ownerRecord->tickets()->count();

    return $count > 0 ? (string) $count : null;
}
```

或者，你可以覆盖 `isBadgeDeferred()` 方法来定义动态行为：

```php
use Illuminate\Database\Eloquent\Model;

public static function isBadgeDeferred(Model $ownerRecord, string $pageClass): bool
{
    return FeatureFlag::active();
}
```

如果你使用的是[关联分组](#对关联管理器进行分组)，请使用流式 `deferBadge()` 方法：

```php
use Filament\Resources\RelationManagers\RelationGroup;

RelationGroup::make('Contacts', [
    // ...
])
    ->badge(fn (Model $ownerRecord): string => (string) $ownerRecord->contacts()->count())
    ->deferBadge();
```

## 与关联管理器共享资源的表单和表格

你可能希望资源的表单和表格与关联管理器的完全一致，从而重用之前编写的代码。这很简单，只需从关联管理器中调用资源的 `form()` 和 `table()` 方法即可：

```php
use App\Filament\Resources\Blog\Posts\PostResource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

public function form(Schema $schema): Schema
{
    return PostResource::form($schema);
}

public function table(Table $table): Table
{
    return PostResource::table($table);
}
```

### 在关联管理器上隐藏共享的表单组件

如果你正在将资源的表单组件与关联管理器共享，你可能希望在关联管理器上隐藏它。当你想在关联管理器上隐藏所有者记录的 `Select` 字段时，这尤其有用，因为 Filament 无论如何都会为你处理。为此，你可以使用 `hiddenOn()` 方法，传入关联管理器的名称：

```php
use App\Filament\Resources\Blog\Posts\PostResource\RelationManagers\CommentsRelationManager;
use Filament\Forms\Components\Select;

Select::make('post_id')
    ->relationship('post', 'title')
    ->hiddenOn(CommentsRelationManager::class)
```

### 在关联管理器上隐藏共享的表格列

如果你正在将资源的表格列与关联管理器共享，你可能希望在关联管理器上隐藏它。当你想在关联管理器上隐藏所有者记录的列时，这尤其有用，因为当所有者记录已列在关联管理器上方时，这并不合适。为此，你可以使用 `hiddenOn()` 方法，传入关联管理器的名称：

```php
use App\Filament\Resources\Blog\Posts\PostResource\RelationManagers\CommentsRelationManager;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('post.title')
    ->hiddenOn(CommentsRelationManager::class)
```

### 在关联管理器上隐藏共享的表格筛选器

如果你正在将资源的表格筛选器与关联管理器共享，你可能希望在关联管理器上隐藏它。当你想在关联管理器上隐藏所有者记录的筛选器时，这尤其有用，因为当表格已按所有者记录筛选时，这并不合适。为此，你可以使用 `hiddenOn()` 方法，传入关联管理器的名称：

```php
use App\Filament\Resources\Blog\Posts\PostResource\RelationManagers\CommentsRelationManager;
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('post')
    ->relationship('post', 'title')
    ->hiddenOn(CommentsRelationManager::class)
```

### 在关联管理器上覆盖共享的配置

你在资源中进行的任何配置都可以在关联管理器上覆盖。例如，如果你想要禁用关联管理器的继承表格的分页，但不禁止资源本身的分页：

```php
use App\Filament\Resources\Blog\Posts\PostResource;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return PostResource::table($table)
        ->paginated(false);
}
```

如果你想在关联管理器上添加头部操作来[创建](#创建关联记录)、[关联](#关联和取消关联记录)或[关联](#关联和取消关联合记录)记录，在关联管理器上提供额外配置也很有用：

```php
use App\Filament\Resources\Blog\Posts\PostResource;
use Filament\Actions\AttachAction;
use Filament\Actions\CreateAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return PostResource::table($table)
        ->headerActions([
            CreateAction::make(),
            AttachAction::make(),
        ]);
}
```

## 自定义关联管理器的 Eloquent 查询

你可以应用自己的查询约束或[模型作用域](https://laravel.com/docs/eloquent#query-scopes)来影响整个关联管理器。为此，你可以向表格的 `modifyQueryUsing()` 方法传递一个函数，在其中自定义查询：

```php
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;

public function table(Table $table): Table
{
    return $table
        ->modifyQueryUsing(fn (Builder $query) => $query->where('is_active', true))
        ->columns([
            // ...
        ]);
}
```

## 自定义关联管理器标题

要设置关联管理器的标题，你可以使用关联管理器类上的 `$title` 属性：

```php
protected static ?string $title = 'Posts';
```

要动态设置关联管理器的标题，你可以覆盖关联管理器类上的 `getTitle()` 方法：

```php
use Illuminate\Database\Eloquent\Model;

public static function getTitle(Model $ownerRecord, string $pageClass): string
{
    return __('relation-managers.posts.title');
}
```

标题将反映在[表格标题](../tables/overview#customizing-the-table-header)中，如果存在多个关联管理器，还会反映在关联管理器选项卡中。如果你想独立自定义表格标题，仍然可以使用 `$table->heading()` 方法：

```php
use Filament\Tables;

public function table(Table $table): Table
{
    return $table
        ->heading('Posts')
        ->columns([
            // ...
        ]);
}
```

## 自定义关联管理器记录标题

关联管理器使用"记录标题属性"的概念来确定关联模型的哪个属性应用于标识它。创建关联管理器时，此属性作为第三个参数传递给 `make:filament-relation-manager` 命令：

```bash
php artisan make:filament-relation-manager CategoryResource posts title
```

在这个例子中，`Post` 模型的 `title` 属性将用于在关联管理器中标识帖子。

这主要由操作类使用。例如，当你[关联](#关联和取消关联记录)或[关联](#关联和取消关联合记录)记录时，标题将列在 select 字段中。当你[编辑](#编辑关联记录)、[查看](#查看关联记录)或[删除](#删除关联记录)记录时，标题将用于模态框的标题中。

在某些情况下，你可能希望将多个属性拼接在一起形成标题。你可以通过将 `recordTitleAttribute()` 配置方法替换为 `recordTitle()` 来实现，传入一个将模型转换为标题的函数：

```php
use App\Models\Post;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->recordTitle(fn (Post $record): string => "{$record->title} ({$record->id})")
        ->columns([
            // ...
        ]);
}
```

如果你使用 `recordTitle()`，并且有[关联操作](#关联和取消关联合记录)或[关联操作](#关联和取消关联记录)，你还需要为这些操作指定搜索列：

```php
use Filament\Actions\AssociateAction;
use Filament\Actions\AttachAction;

AssociateAction::make()
    ->recordSelectSearchColumns(['title', 'id']);

AttachAction::make()
    ->recordSelectSearchColumns(['title', 'id'])
```

## 关联页面

使用 `ManageRelatedRecords` 页面是使用关联管理器的替代方案，如果你希望将管理关联关系的功能与编辑或查看所有者记录分开。

如果你使用[资源子导航](overview#resource-sub-navigation)，此功能非常理想，因为你可以轻松地在查看或编辑页面与关联页面之间切换。

要创建关联页面，你应该使用 `make:filament-page` 命令：

```bash
php artisan make:filament-page ManageCustomerAddresses --resource=CustomerResource --type=ManageRelatedRecords
```

运行此命令时，你将被问及一系列问题来自定义页面，例如关联关系的名称及其标题属性。

你必须在资源的 `getPages()` 方法中注册这个新页面：

```php
public static function getPages(): array
{
    return [
        'index' => Pages\ListCustomers::route('/'),
        'create' => Pages\CreateCustomer::route('/create'),
        'view' => Pages\ViewCustomer::route('/{record}'),
        'edit' => Pages\EditCustomer::route('/{record}/edit'),
        'addresses' => Pages\ManageCustomerAddresses::route('/{record}/addresses'),
    ];
}
```

:::warning
    使用关联页面时，你不需要使用 `make:filament-relation-manager` 生成关联管理器，也不需要在资源的 `getRelations()` 方法中注册它。
:::

现在，你可以像自定义关联管理器一样自定义页面，使用相同的 `table()` 和 `form()` 方法。

### 将关联页面添加到资源子导航

如果你使用[资源子导航](overview#resource-sub-navigation)，你可以在资源的 `getRecordSubNavigation()` 中正常注册此页面：

```php
use App\Filament\Resources\Customers\Pages;
use Filament\Resources\Pages\Page;

public static function getRecordSubNavigation(Page $page): array
{
    return $page->generateNavigationItems([
        // ...
        Pages\ManageCustomerAddresses::class,
    ]);
}
```

## 向关联管理器传递属性

在资源中注册关联管理器时，你可以使用 `make()` 方法向其传递一个 [Livewire 属性](https://livewire.laravel.com/docs/properties)数组：

```php
use App\Filament\Resources\Blog\Posts\PostResource\RelationManagers\CommentsRelationManager;

public static function getRelations(): array
{
    return [
        CommentsRelationManager::make([
            'status' => 'approved',
        ]),
    ];
}
```

此属性数组会被映射到关联管理器类上的[公共 Livewire 属性](https://livewire.laravel.com/docs/properties)：

```php
use Filament\Resources\RelationManagers\RelationManager;

class CommentsRelationManager extends RelationManager
{
    public string $status;

    // ...
}
```

现在，你可以在关联管理器类中使用 `$this->status` 访问 `status`。

## 禁用懒加载

默认情况下，关联管理器是懒加载的。这意味着它们只会在页面上可见时才被加载。

要禁用此行为，你可以覆盖关联管理器类上的 `$isLazy` 属性：

```php
protected static bool $isLazy = false;
```

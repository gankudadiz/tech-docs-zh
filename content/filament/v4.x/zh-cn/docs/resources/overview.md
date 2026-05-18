---
title: 概述
---

## 简介

资源是用于为 Eloquent 模型构建 CRUD 界面的静态类。它们描述了管理员如何通过表格和表单与应用中的数据进行交互。

![资源列表页](/assets/filament/v4.x/screenshots/images/light/panels/resources/listing.jpg)

## 创建资源

为 `App\Models\Customer` 模型创建资源：

```bash
php artisan make:filament-resource Customer
```

这会在 `app/Filament/Resources` 目录下创建多个文件：

```
.
+-- Customers
|   +-- CustomerResource.php
|   +-- Pages
|   |   +-- CreateCustomer.php
|   |   +-- EditCustomer.php
|   |   +-- ListCustomers.php
|   +-- Schemas
|   |   +-- CustomerForm.php
|   +-- Tables
|   |   +-- CustomersTable.php
```

你的新资源类位于 `CustomerResource.php` 中。

`Pages` 目录中的类用于自定义与资源交互的页面。它们都是全页的 [Livewire](https://livewire.laravel.com) 组件，你可以按需进行任意定制。

`Schemas` 目录中的类用于定义资源的[表单](../forms)和[信息列表](../infolists)内容。`Tables` 目录中的类用于构建资源的表格。

:::tip
    创建了资源但没有出现在导航菜单中？如果你有[模型策略](#authorization)，请确保 `viewAny()` 方法返回 `true`。
:::

### 简单（模态）资源

有时候，你的模型足够简单，只需要在一个页面中管理记录，使用模态窗口来创建、编辑和删除记录。生成带模态窗口的简单资源：

```bash
php artisan make:filament-resource Customer --simple
```

你的资源会有一个"管理"页面，这是一个带有模态窗口的列表页。

此外，简单资源不会有 `getRelations()` 方法，因为[关联管理器](managing-relationships)只在编辑页和查看页上显示，而简单资源中没有这些页面。其他部分则完全相同。

![简单资源的创建模态窗口](/assets/filament/v4.x/screenshots/images/light/panels/resources/simple-modal-create.jpg)

![简单资源的编辑模态窗口](/assets/filament/v4.x/screenshots/images/light/panels/resources/simple-modal-edit.jpg)

### 自动生成表单和表格

如果你想节省时间，Filament 可以根据模型的数据库字段自动生成[表单](#resource-forms)和[表格](#resource-tables)，使用 `--generate` 参数：

```bash
php artisan make:filament-resource Customer --generate
```

### 处理软删除

默认情况下，你无法在应用中与已删除的记录进行交互。如果你想在资源中添加恢复、强制删除和筛选已删除记录的功能，在生成资源时使用 `--soft-deletes` 参数：

```bash
php artisan make:filament-resource Customer --soft-deletes
```

更多关于软删除的信息，请参阅[此处](deleting-records#handling-soft-deletes)。

### 生成查看页

默认情况下，资源只生成列表页、创建页和编辑页。如果你还需要[查看页](viewing-records)，使用 `--view` 参数：

```bash
php artisan make:filament-resource Customer --view
```

### 指定自定义模型命名空间

默认情况下，Filament 假设你的模型位于 `App\Models` 目录中。你可以使用 `--model-namespace` 参数指定不同的模型命名空间：

```bash
php artisan make:filament-resource Customer --model-namespace=Custom\\Path\\Models
```

在这个例子中，模型应该位于 `Custom\Path\Models\Customer`。请注意命令中需要使用双反斜杠 `\\`。

这样在[生成资源](#automatically-generating-forms-and-tables)时，Filament 就能定位模型并读取数据库结构。

### 同时生成模型、迁移文件和工厂

如果你想在搭建资源时节省时间，Filament 可以同时生成模型、迁移文件和工厂，使用 `--model`、`--migration` 和 `--factory` 参数的任意组合：

```bash
php artisan make:filament-resource Customer --model --migration --factory
```

## 记录标题

你可以为资源设置 `$recordTitleAttribute`，这是模型中用于标识记录的字段名称。

例如，可以是博客文章的 `title` 或客户的 `name`：

```php
protected static ?string $recordTitleAttribute = 'name';
```

这是[全局搜索](global-search)等功能正常工作所必需的。

:::tip
    如果单个字段不足以标识记录，你可以指定 [Eloquent 访问器](https://laravel.com/docs/eloquent-mutators#defining-an-accessor)的名称。
:::

## 资源表单

资源类包含一个 `form()` 方法，用于在[创建页](creating-records)和[编辑页](editing-records)上构建表单。

默认情况下，Filament 会为你创建一个表单 Schema 文件，并在 `form()` 方法中引用它。这样做是为了保持资源类的整洁和有序，否则它可能会变得很长：

```php
use App\Filament\Resources\Customers\Schemas\CustomerForm;
use Filament\Schemas\Schema;

public static function form(Schema $schema): Schema
{
    return CustomerForm::configure($schema);
}
```

在 `CustomerForm` 类中，你可以定义表单的字段和布局：

```php
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

public static function configure(Schema $schema): Schema
{
    return $schema
        ->components([
            TextInput::make('name')->required(),
            TextInput::make('email')->email()->required(),
            // ...
        ]);
}
```

`components()` 方法用于定义表单的结构。它是一个包含[字段](../forms/overview#available-fields)和[布局组件](../schemas/layouts#available-layout-components)的数组，按照它们在表单中出现的顺序排列。

查看表单文档，了解如何使用 Filament 构建表单的[指南](../forms)。

:::tip
    如果你更喜欢直接在资源类中定义表单，可以这样做并删除表单 Schema 类：

    ```php
    use Filament\Forms\Components\TextInput;
    use Filament\Schemas\Schema;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')->required(),
                TextInput::make('email')->email()->required(),
                // ...
            ]);
    }
    ```
:::

### 根据当前操作隐藏组件

表单组件的 `hiddenOn()` 方法允许你根据当前页面或操作动态隐藏字段。

在这个例子中，我们在 `edit` 页面上隐藏 `password` 字段：

```php
use Filament\Forms\Components\TextInput;
use Filament\Support\Enums\Operation;

TextInput::make('password')
    ->password()
    ->required()
    ->hiddenOn(Operation::Edit),
```

或者，我们可以使用 `visibleOn()` 快捷方法，只在某个页面或操作上显示字段：

```php
use Filament\Forms\Components\TextInput;
use Filament\Support\Enums\Operation;

TextInput::make('password')
    ->password()
    ->required()
    ->visibleOn(Operation::Create),
```

## 资源表格

资源类包含一个 `table()` 方法，用于在[列表页](listing-records)上构建表格。

默认情况下，Filament 会为你创建一个表格文件，并在 `table()` 方法中引用它。这样做是为了保持资源类的整洁和有序，否则它可能会变得很长：

```php
use App\Filament\Resources\Customers\Tables\CustomersTable;
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return CustomersTable::configure($table);
}
```

在 `CustomersTable` 类中，你可以定义表格的列、筛选器和操作：

```php
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

public static function configure(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('name'),
            TextColumn::make('email'),
            // ...
        ])
        ->filters([
            Filter::make('verified')
                ->query(fn (Builder $query): Builder => $query->whereNotNull('email_verified_at')),
            // ...
        ])
        ->recordActions([
            EditAction::make(),
        ])
        ->toolbarActions([
            BulkActionGroup::make([
                DeleteBulkAction::make(),
            ]),
        ]);
}
```

查看[表格](../tables)文档，了解如何添加表格列、筛选器、操作等。

:::tip
    如果你更喜欢直接在资源类中定义表格，可以这样做并删除表格类：

    ```php
    use Filament\Actions\BulkActionGroup;
    use Filament\Actions\DeleteBulkAction;
    use Filament\Actions\EditAction;
    use Filament\Tables\Columns\TextColumn;
    use Filament\Tables\Filters\Filter;
    use Filament\Tables\Table;
    use Illuminate\Database\Eloquent\Builder;
    
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('email'),
                // ...
            ])
            ->filters([
                Filter::make('verified')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('email_verified_at')),
                // ...
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
    ```
:::

## 自定义模型标签

每个资源都有一个"模型标签"，它根据模型名称自动生成。例如，`App\Models\Customer` 模型的标签是 `customer`。

这个标签在 UI 的多个地方使用，你可以使用 `$modelLabel` 属性进行自定义：

```php
protected static ?string $modelLabel = 'cliente';
```

或者，你可以使用 `getModelLabel()` 方法定义动态标签：

```php
public static function getModelLabel(): string
{
    return __('filament/resources/customer.label');
}
```

### 自定义复数模型标签

资源还有一个"复数模型标签"，它根据模型标签自动生成。例如，`customer` 标签会被复数化为 `customers`。

你可以使用 `$pluralModelLabel` 属性自定义标签的复数形式：

```php
protected static ?string $pluralModelLabel = 'clientes';
```

或者，你可以在 `getPluralModelLabel()` 方法中设置动态复数标签：

```php
public static function getPluralModelLabel(): string
{
    return __('filament/resources/customer.plural_label');
}
```

### 模型标签自动首字母大写

默认情况下，Filament 会在 UI 的某些部分自动将模型标签中的每个单词首字母大写。例如，在页面标题、导航菜单和面包屑中。

如果你想为某个资源禁用这个行为，可以在资源中设置 `$hasTitleCaseModelLabel`：

```php
protected static bool $hasTitleCaseModelLabel = false;
```

## 资源导航项

Filament 会使用[复数标签](#plural-label)自动为你的资源生成导航菜单项。

如果你想自定义导航项标签，可以使用 `$navigationLabel` 属性：

```php
protected static ?string $navigationLabel = 'Mis Clientes';
```

或者，你可以在 `getNavigationLabel()` 方法中设置动态导航标签：

```php
public static function getNavigationLabel(): string
{
    return __('filament/resources/customer.navigation_label');
}
```

### 设置资源导航图标

`$navigationIcon` 属性支持任何 Blade 组件的名称。默认已安装 [Heroicons](https://heroicons.com)。如果你愿意，也可以创建自定义图标组件或安装其他图标库。

```php
use BackedEnum;

protected static string | BackedEnum | null $navigationIcon = 'heroicon-o-user-group';
```

或者，你可以在 `getNavigationIcon()` 方法中设置动态导航图标：

```php
use BackedEnum;
use Illuminate\Contracts\Support\Htmlable;

public static function getNavigationIcon(): string | BackedEnum | Htmlable | null
{
    return 'heroicon-o-user-group';
}
```

### 排序资源导航项

`$navigationSort` 属性允许你指定导航项的排列顺序：

```php
protected static ?int $navigationSort = 2;
```

或者，你可以在 `getNavigationSort()` 方法中设置动态导航项顺序：

```php
public static function getNavigationSort(): ?int
{
    return 2;
}
```

### 分组资源导航项

你可以通过指定 `$navigationGroup` 属性来对导航项进行分组：

```php
use UnitEnum;

protected static string | UnitEnum | null $navigationGroup = 'Shop';
```

或者，你可以使用 `getNavigationGroup()` 方法设置动态分组标签：

```php
public static function getNavigationGroup(): ?string
{
    return __('filament/navigation.groups.shop');
}
```

#### 将资源导航项嵌套在其他项下

你可以将导航项作为其他项的子项，通过将父项的标签传递给 `$navigationParentItem`：

```php
use UnitEnum;

protected static ?string $navigationParentItem = 'Products';

protected static string | UnitEnum | null $navigationGroup = 'Shop';
```

如上所示，如果父项有导航分组，也需要定义该导航分组，以便正确识别父项。

你也可以使用 `getNavigationParentItem()` 方法设置动态父项标签：

```php
public static function getNavigationParentItem(): ?string
{
    return __('filament/navigation.groups.shop.items.products');
}
```

:::tip
    如果你需要像这样的三级导航，应该考虑使用[集群](../navigation/clusters)来替代。集群是资源和[自定义页面](../navigation/custom-pages)的逻辑分组，可以共享独立的导航。
:::

## 生成资源页面的 URL

Filament 在资源类上提供了 `getUrl()` 静态方法，用于生成资源及其特定页面的 URL。传统上，你需要手动构建 URL 或使用 Laravel 的 `route()` 辅助函数，但这些方法依赖于对资源的 slug 或路由命名约定的了解。

不带参数的 `getUrl()` 方法会生成资源[列表页](listing-records)的 URL：

```php
use App\Filament\Resources\Customers\CustomerResource;

CustomerResource::getUrl(); // /admin/customers
```

你也可以生成资源内特定页面的 URL。每个页面的名称是资源 `getPages()` 数组中的键。例如，生成[创建页](creating-records)的 URL：

```php
use App\Filament\Resources\Customers\CustomerResource;

CustomerResource::getUrl('create'); // /admin/customers/create
```

`getPages()` 方法中的某些页面使用 URL 参数，如 `record`。要生成这些页面的 URL 并传入记录，你应该使用第二个参数：

```php
use App\Filament\Resources\Customers\CustomerResource;

CustomerResource::getUrl('edit', ['record' => $customer]); // /admin/customers/edit/1
```

在这个例子中，`$customer` 可以是 Eloquent 模型对象或 ID。

### 生成资源模态窗口的 URL

如果你使用的是只有单个页面的[简单资源](#simple-modal-resources)，这会特别有用。

要为资源表格中的操作生成 URL，你应该将 `tableAction` 和 `tableActionRecord` 作为 URL 参数传递：

```php
use App\Filament\Resources\Customers\CustomerResource;
use Filament\Actions\EditAction;

CustomerResource::getUrl(parameters: [
    'tableAction' => EditAction::getDefaultName(),
    'tableActionRecord' => $customer,
]); // /admin/customers?tableAction=edit&tableActionRecord=1
```

或者，如果你想为页面上的操作（如头部的 `CreateAction`）生成 URL，可以将其传递给 `action` 参数：

```php
use App\Filament\Resources\Customers\CustomerResource;
use Filament\Actions\CreateAction;

CustomerResource::getUrl(parameters: [
    'action' => CreateAction::getDefaultName(),
]); // /admin/customers?action=create
```

### 生成其他面板中资源的 URL

如果你的应用中有多个面板，`getUrl()` 会在当前面板内生成 URL。你也可以通过将面板 ID 传递给 `panel` 参数来指定资源所属的面板：

```php
use App\Filament\Resources\Customers\CustomerResource;

CustomerResource::getUrl(panel: 'marketing');
```

## 自定义资源 Eloquent 查询

在 Filament 中，对资源模型的每次查询都从 `getEloquentQuery()` 方法开始。

因此，你可以非常方便地应用自定义查询约束或[模型作用域](https://laravel.com/docs/eloquent#query-scopes)来影响整个资源：

```php
public static function getEloquentQuery(): Builder
{
    return parent::getEloquentQuery()->where('is_active', true);
}
```

### 禁用全局作用域

默认情况下，Filament 会遵循模型上注册的所有全局作用域。但如果你想要访问软删除的记录等，这可能不是理想的行为。

要解决这个问题，你可以重写 Filament 使用的 `getEloquentQuery()` 方法：

```php
public static function getEloquentQuery(): Builder
{
    return parent::getEloquentQuery()->withoutGlobalScopes();
}
```

或者，你可以移除特定的全局作用域：

```php
public static function getEloquentQuery(): Builder
{
    return parent::getEloquentQuery()->withoutGlobalScopes([ActiveScope::class]);
}
```

更多关于移除全局作用域的信息，请参阅 [Laravel 文档](https://laravel.com/docs/eloquent#removing-global-scopes)。

## 自定义资源 URL

默认情况下，Filament 会根据资源名称生成 URL。你可以通过设置资源的 `$slug` 属性来自定义：

```php
protected static ?string $slug = 'pending-orders';
```

## 资源子导航

子导航允许用户在资源内的不同页面之间切换。通常，子导航中的所有页面都与资源中的同一记录相关。例如，在客户资源中，你可能有以下页面的子导航：

- 查看客户，一个 [`ViewRecord` 页面](viewing-records)，提供客户详细信息的只读视图。
- 编辑客户，一个 [`EditRecord` 页面](editing-records)，允许用户编辑客户的详细信息。
- 编辑客户联系方式，一个 [`EditRecord` 页面](editing-records)，允许用户编辑客户的联系方式。你可以[学习如何创建多个编辑页](editing-records#creating-another-edit-page)。
- 管理地址，一个 [`ManageRelatedRecords` 页面](managing-relationships#relation-pages)，允许用户管理客户的地址。
- 管理付款，一个 [`ManageRelatedRecords` 页面](managing-relationships#relation-pages)，允许用户管理客户的付款。

要为资源中的每个"单一记录"页面添加子导航，你可以在资源类中添加 `getRecordSubNavigation()` 方法：

```php
use Filament\Resources\Pages\Page;

public static function getRecordSubNavigation(Page $page): array
{
    return $page->generateNavigationItems([
        ViewCustomer::class,
        EditCustomer::class,
        EditCustomerContact::class,
        ManageCustomerAddresses::class,
        ManageCustomerPayments::class,
    ]);
}
```

子导航中的每个项都可以使用与普通页面相同的[导航方法](../navigation)进行自定义。

![带子导航的资源](/assets/filament/v4.x/screenshots/images/light/panels/resources/sub-navigation.jpg)

:::tip
    如果你想在资源和[自定义页面](../navigation/custom-pages)之间切换，你可能需要的是[集群](../navigation/clusters)，它用于将这些组合在一起。`getRecordSubNavigation()` 方法旨在构建资源内与特定记录相关的页面之间的导航。
:::

### 设置资源子导航的位置

子导航默认渲染在页面的开头。你可以通过设置资源的 `$subNavigationPosition` 属性来更改所有页面的位置。值可以是 `SubNavigationPosition::Start`、`SubNavigationPosition::End` 或 `SubNavigationPosition::Top`（将子导航渲染为标签页）：

```php
use Filament\Pages\Enums\SubNavigationPosition;

protected static ?SubNavigationPosition $subNavigationPosition = SubNavigationPosition::End;
```

![末尾位置的子导航](/assets/filament/v4.x/screenshots/images/light/panels/resources/sub-navigation-end.jpg)

`SubNavigationPosition::Top` 选项将子导航渲染为页面内容上方的标签页：

![顶部位置的子导航](/assets/filament/v4.x/screenshots/images/light/panels/resources/sub-navigation-top.jpg)

## 删除资源页面

如果你想从资源中删除某个页面，只需从资源的 `Pages` 目录中删除该页面文件，并从 `getPages()` 方法中移除其条目。

例如，你可能有一个不允许任何人创建记录的资源。删除 `Create` 页面文件，然后从 `getPages()` 中移除它：

```php
public static function getPages(): array
{
    return [
        'index' => ListCustomers::route('/'),
        'edit' => EditCustomer::route('/{record}/edit'),
    ];
}
```

删除页面不会删除链接到该页面的操作。任何操作都会打开模态窗口，而不是将用户发送到不存在的页面。例如，列表页上的 `CreateAction`、表格或查看页上的 `EditAction`，或表格或编辑页上的 `ViewAction`。如果你想移除这些按钮，也必须删除相应的操作。

## 安全

## 授权

对于授权，Filament 会遵循应用中注册的任何[模型策略](https://laravel.com/docs/authorization#creating-policies)。使用以下方法：

- `viewAny()` 用于完全隐藏导航菜单中的资源，并阻止用户访问任何页面。
- `create()` 用于控制[创建新记录](creating-records)。
- `update()` 用于控制[编辑记录](editing-records)。
- `view()` 用于控制[查看记录](viewing-records)。
- `delete()` 用于阻止删除单条记录。`deleteAny()` 用于阻止批量删除记录。Filament 使用 `deleteAny()` 方法是因为遍历多条记录并检查 `delete()` 策略的性能不佳。使用 `DeleteBulkAction` 时，如果你想为每条记录调用 `delete()` 方法，应该使用 `DeleteBulkAction::make()->authorizeIndividualRecords()` 方法。任何未通过授权检查的记录都不会被处理。
- `forceDelete()` 用于阻止强制删除单条软删除记录。`forceDeleteAny()` 用于阻止批量强制删除记录。Filament 使用 `forceDeleteAny()` 方法是因为遍历多条记录并检查 `forceDelete()` 策略的性能不佳。使用 `ForceDeleteBulkAction` 时，如果你想为每条记录调用 `forceDelete()` 方法，应该使用 `ForceDeleteBulkAction::make()->authorizeIndividualRecords()` 方法。任何未通过授权检查的记录都不会被处理。
- `restore()` 用于阻止恢复单条软删除记录。`restoreAny()` 用于阻止批量恢复记录。Filament 使用 `restoreAny()` 方法是因为遍历多条记录并检查 `restore()` 策略的性能不佳。使用 `RestoreBulkAction` 时，如果你想为每条记录调用 `restore()` 方法，应该使用 `RestoreBulkAction::make()->authorizeIndividualRecords()` 方法。任何未通过授权检查的记录都不会被处理。
- `reorder()` 用于控制[在表格中重新排序记录](listing-records#reordering-records)。

### 跳过授权

如果你想跳过资源的授权，可以将 `$shouldSkipAuthorization` 属性设置为 `true`：

```php
protected static bool $shouldSkipAuthorization = true;
```

### 保护模型属性

Filament 会将所有模型属性暴露给 JavaScript，除非它们在模型上被设置为 `$hidden`。这是 Livewire 处理模型绑定的行为。我们保留这个功能是为了便于在表单字段初始加载后动态添加和移除字段，同时保留它们可能需要的数据。

:::danger
    虽然属性可能在 JavaScript 中可见，但只有具有表单字段的属性才能被用户编辑。这不是批量赋值的问题。
:::

要在编辑页和查看页上从 JavaScript 中移除某些属性，你可以重写[填充表单前的 `mutateFormDataBeforeFill()` 方法](editing-records#customizing-data-before-filling-the-form)：

```php
protected function mutateFormDataBeforeFill(array $data): array
{
    unset($data['is_admin']);

    return $data;
}
```

在这个例子中，我们从 JavaScript 中移除了 `is_admin` 属性，因为它没有被表单使用。

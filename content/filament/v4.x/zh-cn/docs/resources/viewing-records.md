---
title: 查看记录
---

![资源查看页面](/assets/filament/v4.x/screenshots/images/light/panels/resources/viewing.jpg)

## 创建带查看页面的资源

要创建一个新的带查看页面的资源，你可以使用 `--view` 标志：

```bash
php artisan make:filament-resource User --view
```

## 使用信息列表替代禁用的表单

默认情况下，查看页面会显示一个带有记录数据的禁用表单。如果你希望以"信息列表"的形式显示记录的数据，可以在资源类中定义 `infolist()` 方法：

```php
use Filament\Infolists;
use Filament\Schemas\Schema;

public static function infolist(Schema $schema): Schema
{
    return $schema
        ->components([
            Infolists\Components\TextEntry::make('name'),
            Infolists\Components\TextEntry::make('email'),
            Infolists\Components\TextEntry::make('notes')
                ->columnSpanFull(),
        ]);
}
```

`components()` 方法用于定义信息列表的结构。它是一个由[条目](../infolists/overview#定义条目)和[布局组件](../schemas/layouts#基本布局组件)组成的数组，按它们在信息列表中出现的顺序排列。

请查阅信息列表文档，了解如何使用 Filament 构建信息列表的[指南](../infolists/overview)。

## 向现有资源添加查看页面

如果你想向现有资源添加查看页面，请在资源的 `Pages` 目录中创建一个新页面：

```bash
php artisan make:filament-page ViewUser --resource=UserResource --type=ViewRecord
```

你必须在资源的 `getPages()` 方法中注册这个新页面：

```php
public static function getPages(): array
{
    return [
        'index' => Pages\ListUsers::route('/'),
        'create' => Pages\CreateUser::route('/create'),
        'view' => Pages\ViewUser::route('/{record}'),
        'edit' => Pages\EditUser::route('/{record}/edit'),
    ];
}
```

## 在模态框中查看记录

如果你的资源比较简单，你可能希望在模态框中查看记录，而不是在[查看页面](viewing-records)上查看。如果是这种情况，你可以直接[删除查看页面](overview#删除资源页面)。

如果你的资源没有包含 `ViewAction`，你可以将其添加到 `$table->recordActions()` 数组中：

```php
use Filament\Actions\ViewAction;
use Filament\Tables\Table;

public static function table(Table $table): Table
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

## 在填充表单前自定义数据

你可能希望在将记录数据填充到表单之前对其进行修改。为此，你可以在查看页面类中定义 `mutateFormDataBeforeFill()` 方法来修改 `$data` 数组，并在填充到表单之前返回修改后的版本：

```php
protected function mutateFormDataBeforeFill(array $data): array
{
    $data['user_id'] = auth()->id();

    return $data;
}
```

或者，如果你在模态操作中查看记录，请查阅[操作文档](../actions/view#在填充表单前自定义数据)。

## 生命周期钩子

钩子可用于在页面生命周期的不同节点执行代码，例如在表单填充之前。要设置钩子，请在查看页面类中创建一个以钩子名称命名的 protected 方法：

```php
use Filament\Resources\Pages\ViewRecord;

class ViewUser extends ViewRecord
{
    // ...

    protected function beforeFill(): void
    {
        // Runs before the disabled form fields are populated from the database. Not run on pages using an infolist.
    }

    protected function afterFill(): void
    {
        // Runs after the disabled form fields are populated from the database. Not run on pages using an infolist.
    }
}
```

## 授权

在授权方面，Filament 会遵循应用中注册的所有[模型策略](https://laravel.com/docs/authorization#creating-policies)。

如果模型策略的 `view()` 方法返回 `true`，用户可以访问查看页面。

## 创建另一个查看页面

一个查看页面可能没有足够的空间让用户浏览大量的信息。你可以为资源创建任意多个查看页面。如果你使用[资源子导航](overview#资源子导航)，这一点尤其有用，因为你可以轻松地在不同的查看页面之间切换。

要创建查看页面，你应该使用 `make:filament-page` 命令：

```bash
php artisan make:filament-page ViewCustomerContact --resource=CustomerResource --type=ViewRecord
```

你必须在资源的 `getPages()` 方法中注册这个新页面：

```php
public static function getPages(): array
{
    return [
        'index' => Pages\ListCustomers::route('/'),
        'create' => Pages\CreateCustomer::route('/create'),
        'view' => Pages\ViewCustomer::route('/{record}'),
        'view-contact' => Pages\ViewCustomerContact::route('/{record}/contact'),
        'edit' => Pages\EditCustomer::route('/{record}/edit'),
    ];
}
```

现在，你可以为此页面定义 `infolist()` 或 `form()`，其中可以包含主查看页面中不存在的其他组件：

```php
use Filament\Schemas\Schema;

public function infolist(Schema $schema): Schema
{
    return $schema
        ->components([
            // ...
        ]);
}
```

## 为特定查看页面自定义关联管理器

你可以通过定义 `getAllRelationManagers()` 方法来指定哪些关联管理器应该显示在查看页面上：

```php
protected function getAllRelationManagers(): array
{
    return [
        CustomerAddressesRelationManager::class,
        CustomerContactsRelationManager::class,
    ];
}
```

当你有[多个查看页面](#创建另一个查看页面)并且需要在每个页面上显示不同的关联管理器时，这非常有用：

```php
// ViewCustomer.php
protected function getAllRelationManagers(): array
{
    return [
        RelationManagers\OrdersRelationManager::class,
        RelationManagers\SubscriptionsRelationManager::class,
    ];
}

// ViewCustomerContact.php 
protected function getAllRelationManagers(): array
{
    return [
        RelationManagers\ContactsRelationManager::class,
        RelationManagers\AddressesRelationManager::class,
    ];
}
```

如果未定义 `getAllRelationManagers()`，则会使用资源中定义的所有关联管理器。

## 将查看页面添加到资源子导航

如果你使用[资源子导航](overview#资源子导航)，你可以在资源的 `getRecordSubNavigation()` 中正常注册此页面：

```php
use App\Filament\Resources\Customers\Pages;
use Filament\Resources\Pages\Page;

public static function getRecordSubNavigation(Page $page): array
{
    return $page->generateNavigationItems([
        // ...
        Pages\ViewCustomerContact::class,
    ]);
}
```

## 自定义页面内容

Filament 中的每个页面都有自己的[模式](../schemas/overview)，用于定义整体结构和内容。你可以通过在页面上定义 `content()` 方法来覆盖页面的模式。查看页面的 `content()` 方法默认包含以下组件：

```php
use Filament\Schemas\Schema;

public function content(Schema $schema): Schema
{
    return $schema
        ->components([
            $this->hasInfolist() // This method returns `true` if the page has an infolist defined
                ? $this->getInfolistContentComponent() // This method returns a component to display the infolist that is defined in this resource
                : $this->getFormContentComponent(), // This method returns a component to display the form that is defined in this resource
            $this->getRelationManagersContentComponent(), // This method returns a component to display the relation managers that are defined in this resource
        ]);
}
```

在 `components()` 数组中，你可以插入任何[模式组件](../schemas/overview)。你可以通过更改数组的顺序来重新排列组件，或移除不需要的组件。

### 使用自定义 Blade 视图

为了进一步自定义，你可以覆盖页面类上的静态 `$view` 属性为应用中的自定义视图：

```php
protected string $view = 'filament.resources.users.pages.view-user';
```

这假设你已在 `resources/views/filament/resources/users/pages/view-user.blade.php` 创建了视图：

```blade
<x-filament-panels::page>
    {{-- `$this->getRecord()` 将返回此页面的当前 Eloquent 记录 --}}
    
    {{ $this->content }} {{-- 这将渲染 `content()` 方法中定义的页面内容，如果你想从头开始可以移除它 --}}
</x-filament-panels::page>
```

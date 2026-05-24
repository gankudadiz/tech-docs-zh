---
title: 列出记录
---

![资源列表页](/assets/filament/v4.x/screenshots/images/light/panels/resources/listing.jpg)

## 使用标签页筛选记录

你可以在表格上方添加标签页，用于根据预定义条件筛选记录。每个标签页可以以不同的方式修改表格的 Eloquent 查询。要注册标签页，在列表页类中添加 `getTabs()` 方法，并返回一个 `Tab` 对象数组：

```php
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

public function getTabs(): array
{
    return [
        'all' => Tab::make(),
        'active' => Tab::make()
            ->modifyQueryUsing(fn (Builder $query) => $query->where('active', true)),
        'inactive' => Tab::make()
            ->modifyQueryUsing(fn (Builder $query) => $query->where('active', false)),
    ];
}
```

![带标签页的资源列表页](/assets/filament/v4.x/screenshots/images/light/panels/resources/listing-tabs.jpg)

### 自定义筛选标签页的标签

数组的键将用作标签页的标识符，以便它们可以持久化到 URL 的查询字符串中。每个标签页的标签也是从键生成的，但你可以通过在标签页的 `make()` 方法中传入标签来覆盖它：

```php
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

public function getTabs(): array
{
    return [
        'all' => Tab::make('所有客户'),
        'active' => Tab::make('活跃客户')
            ->modifyQueryUsing(fn (Builder $query) => $query->where('active', true)),
        'inactive' => Tab::make('非活跃客户')
            ->modifyQueryUsing(fn (Builder $query) => $query->where('active', false)),
    ];
}
```

### 为筛选标签页添加图标

你可以通过在标签页的 `icon()` 方法中传入[图标](../styling/icons)来为标签页添加图标：

```php
use Filament\Schemas\Components\Tabs\Tab;

Tab::make()
    ->icon('heroicon-m-user-group')
```

![带图标的资源列表页标签页](/assets/filament/v4.x/screenshots/images/light/panels/resources/listing-tabs-icons.jpg)

你也可以使用 `iconPosition()` 方法将图标位置改为标签之后：

```php
use Filament\Support\Enums\IconPosition;

Tab::make()
    ->icon('heroicon-m-user-group')
    ->iconPosition(IconPosition::After)
```

### 为筛选标签页添加徽章

你可以通过在标签页的 `badge()` 方法中传入字符串来为标签页添加徽章：

```php
use Filament\Schemas\Components\Tabs\Tab;

Tab::make()
    ->badge(Customer::query()->where('active', true)->count())
```

#### 更改筛选标签页徽章的颜色

可以使用 `badgeColor()` 方法更改徽章的颜色：

```php
use Filament\Schemas\Components\Tabs\Tab;

Tab::make()
    ->badge(Customer::query()->where('active', true)->count())
    ->badgeColor('success')
```

`badgeColor()` 方法除了接受静态值外，还接受一个函数来动态计算颜色。你可以将各种工具作为参数注入到函数中。

![带彩色徽章的资源列表页标签页](/assets/filament/v4.x/screenshots/images/light/panels/resources/listing-tabs-badge-colors.jpg)

#### 延迟加载筛选标签页徽章

如果你的标签页徽章背后有耗时的查询（例如统计大数据集），初始页面加载可能会很慢。你可以使用 `deferBadge()` 方法延迟加载标签页徽章，它会在页面渲染后异步加载徽章值：

```php
use Filament\Schemas\Components\Tabs\Tab;

Tab::make()
    ->badge(static fn (): int => Customer::query()->where('active', true)->count())
    ->deferBadge()
```

:::danger
    使用 `deferBadge()` 时，`badge()` 的值必须通过函数返回。如果你传递一个原始值如 `badge(Customer::query()->count())`，查询会在标签页构建时立即执行，失去延迟加载的意义。
:::

在徽章加载期间，每个延迟加载的徽章位置会显示一个小的加载指示器。数据获取完成后，加载指示器会被实际的徽章值替换。

### 为筛选标签页添加额外属性

你也可以使用 `extraAttributes()` 为筛选标签页传递额外的 HTML 属性：

```php
use Filament\Schemas\Components\Tabs\Tab;

Tab::make()
    ->extraAttributes(['data-cy' => 'statement-confirmed-tab'])
```

### 自定义默认标签页

要自定义页面加载时默认选中的标签页，你可以从 `getDefaultActiveTab()` 方法中返回标签页的数组键：

```php
use Filament\Schemas\Components\Tabs\Tab;

public function getTabs(): array
{
    return [
        'all' => Tab::make(),
        'active' => Tab::make(),
        'inactive' => Tab::make(),
    ];
}

public function getDefaultActiveTab(): string | int | null
{
    return 'active';
}
```

### 在解析记录时排除标签页查询

当用户与表格记录交互（例如点击操作按钮）时，Filament 会从数据库中解析该记录。默认情况下，会应用当前标签页的查询条件，确保用户无法访问当前标签页范围之外的记录。

然而，当记录的状态在用户看到后发生变化时，你可能仍然希望用户能够与之交互。例如，如果你有一个"活跃"标签页，而某个操作将记录设置为非活跃，那么在同一模态窗口中的后续操作将无法解析该记录。

你可以使用 `excludeQueryWhenResolvingRecord()` 方法标记一个标签页在解析记录时被排除：

```php
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

public function getTabs(): array
{
    return [
        'active' => Tab::make()
            ->modifyQueryUsing(fn (Builder $query) => $query->where('active', true))
            ->excludeQueryWhenResolvingRecord(),
        'inactive' => Tab::make()
            ->modifyQueryUsing(fn (Builder $query) => $query->where('active', false))
            ->excludeQueryWhenResolvingRecord(),
    ];
}
```

:::danger
    不要在执行授权规则的标签页上使用 `excludeQueryWhenResolvingRecord()`。例如，如果你有一个按租户或用户所有权限制记录的标签页，这些标签页应该保持强制执行以防止未授权访问。
:::

## 授权

对于授权，Filament 会遵循应用中注册的任何[模型策略](https://laravel.com/docs/authorization#creating-policies)。

如果模型策略的 `viewAny()` 方法返回 `true`，用户可以访问列表页。

`reorder()` 方法用于控制[重新排序记录](../tables/overview#重新排序记录)。

## 自定义表格 Eloquent 查询

虽然你可以[为整个资源自定义 Eloquent 查询](overview#自定义资源-eloquent-查询)，但你也可以为列表页表格进行特定的修改。为此，在资源的 `table()` 方法中使用 `modifyQueryUsing()` 方法：

```php
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

public static function table(Table $table): Table
{
    return $table
        ->modifyQueryUsing(fn (Builder $query) => $query->withoutGlobalScopes());
}
```

## 自定义页面内容

Filament 中的每个页面都有自己的 [Schema](../schemas)，用于定义整体结构和内容。你可以通过在页面上定义 `content()` 方法来覆盖页面的 Schema。列表页的 `content()` 方法默认包含以下组件：

```php
use Filament\Schemas\Components\EmbeddedTable;
use Filament\Schemas\Components\RenderHook;
use Filament\Schemas\Schema;

public function content(Schema $schema): Schema
{
    return $schema
        ->components([
            $this->getTabsContentComponent(), // 此方法返回一个在表格上方显示标签页的组件
            RenderHook::make(PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABLE_BEFORE),
            EmbeddedTable::make(), // 这是渲染此资源中定义的表格的组件
            RenderHook::make(PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABLE_AFTER),
        ]);
}
```

在 `components()` 数组中，你可以插入任何 [Schema 组件](../schemas)。你可以通过更改数组的顺序来重新排列组件，或删除不需要的组件。

### 使用自定义 Blade 视图

为了进一步自定义，你可以将页面类上的静态 `$view` 属性覆盖为应用中的自定义视图：

```php
protected string $view = 'filament.resources.users.pages.list-users';
```

这假设你已经在 `resources/views/filament/resources/users/pages/list-users.blade.php` 创建了视图：

```blade
<x-filament-panels::page>
    {{ $this->content }} {{-- 这将渲染在 `content()` 方法中定义的页面内容，如果你想从头开始可以删除它 --}}
</x-filament-panels::page>
```

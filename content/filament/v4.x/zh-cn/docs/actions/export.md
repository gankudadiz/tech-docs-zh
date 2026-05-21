---
title: 导出操作
---
## 简介

Filament 包含一个能够将行导出为 CSV 或 XLSX 文件的操作。当触发按钮被点击时，会打开一个模态框要求用户选择要导出的列及其标签。此功能使用[作业批次](https://laravel.com/docs/queues#job-batching)和[数据库通知](../notifications/database-notifications)，因此你需要从 Laravel 发布这些迁移。此外，你还需要发布 Filament 用于存储导出信息的表的迁移：

```bash
php artisan make:queue-batches-table
php artisan make:notifications-table
php artisan vendor:publish --tag=filament-actions-migrations
php artisan migrate
```

如果你想在面板中接收导出通知，可以在[面板配置](../notifications/database-notifications#enabling-database-notifications-in-a-panel)中启用它们。

:::info
如果你使用 PostgreSQL，请确保通知迁移中的 `data` 列使用 `json()`：`$table->json('data')`。
:::

:::info
如果你的 `User` 模型使用 UUID，请确保通知迁移中的 `notifiable` 列使用 `uuidMorphs()`：`$table->uuidMorphs('notifiable')`。
:::

你可以像这样使用 `ExportAction`：

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportAction;

ExportAction::make()
    ->exporter(ProductExporter::class)
```

![导出操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/export-action/modal.jpg)

如果你想将此操作添加到表格的头部，可以像这样操作：

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->headerActions([
            ExportAction::make()
                ->exporter(ProductExporter::class),
        ]);
}
```

或者如果你想将其添加为表格批量操作，让用户可以选择要导出哪些行，可以使用 `Filament\Actions\ExportBulkAction`：

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportBulkAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->toolbarActions([
            ExportBulkAction::make()
                ->exporter(ProductExporter::class),
        ]);
}
```

需要[创建"导出器"类](#创建导出器)来告诉 Filament 如何导出每一行。

## 创建导出器

要为模型创建导出器类，你可以使用 `make:filament-exporter` 命令，传入模型的名称：

```bash
php artisan make:filament-exporter Product
```

这将在 `app/Filament/Exports` 目录中创建一个新类。你现在需要定义可以导出的[列](#定义导出器列)。

### 自动生成导出器列

如果你想节省时间，Filament 可以根据模型的数据库列自动生成[列](#定义导出器列)，使用 `--generate`：

```bash
php artisan make:filament-exporter Product --generate
```

## 定义导出器列

要定义可以导出的列，你需要在导出器类中重写 `getColumns()` 方法，返回一个 `ExportColumn` 对象数组：

```php
use Filament\Actions\Exports\ExportColumn;

public static function getColumns(): array
{
    return [
        ExportColumn::make('name'),
        ExportColumn::make('sku')
            ->label('SKU'),
        ExportColumn::make('price'),
    ];
}
```

### 自定义导出列的标签

每列的标签将从其名称自动生成，但你可以通过调用 `label()` 方法来覆盖它：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('sku')
    ->label('SKU')
```

### 配置默认列选择

默认情况下，当用户被询问要导出哪些列时，所有列都会被选中。你可以使用 `enabledByDefault()` 方法自定义列的默认选择状态：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('description')
    ->enabledByDefault(false)
```

你可以在 `ExportAction` 上使用 `enableVisibleTableColumnsByDefault()` 方法，默认只启用当前在表格中可见的列。使用 `enabledByDefault(false)` 的列也将默认被禁用：

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportAction;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->enableVisibleTableColumnsByDefault()
```

### 配置列选择表单布局

默认情况下，列选择表单使用单列布局。你可以使用 `columnMappingColumns()` 方法更改此设置，传入你希望在大屏幕上使用的列数：

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportAction;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->columnMappingColumns(3)
```

这将以 3 列布局显示列选择复选框和标签输入框，当你有很多可导出列时，可以更好地利用可用空间。请注意，虽然大屏幕上布局会有三列，但布局仍然是响应式的，在较小屏幕上会显示更少的列。

### 禁用列选择

默认情况下，用户会被询问要导出哪些列。你可以使用 `columnMapping(false)` 禁用此功能：

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportAction;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->columnMapping(false)
```

### 计算导出列状态

有时你需要计算列的状态，而不是直接从数据库列读取。

通过向 `state()` 方法传递回调函数，你可以根据 `$record` 自定义该列的返回状态：

```php
use App\Models\Order;
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('amount_including_vat')
    ->state(function (Order $record): float {
        return $record->amount * (1 + $record->vat_rate);
    })
```

除了 `$record`，`state()` 函数还可以注入各种工具作为参数。

### 格式化导出列的值

你也可以向 `formatStateUsing()` 传递自定义格式化回调，该回调接受单元格的 `$state`，以及可选的 Eloquent `$record`：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('status')
    ->formatStateUsing(fn (string $state): string => __("statuses.{$state}"))
```

除了 `$state`，`formatStateUsing()` 函数还可以注入各种工具作为参数。

如果列中有[多个值](#在单元格中导出多个值)，该函数将对每个值调用一次。

#### 限制文本长度

你可以使用 `limit()` 限制单元格值的长度：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('description')
    ->limit(50)
```

除了允许静态值，`limit()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

#### 限制字数

你可以使用 `words()` 限制单元格中显示的字数：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('description')
    ->words(10)
```

除了允许静态值，`words()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

#### 添加前缀或后缀

你可以使用 `prefix()` 或 `suffix()` 为单元格值添加前缀或后缀：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('domain')
    ->prefix('https://')
    ->suffix('.com')
```

除了允许静态值，`prefix()` 和 `suffix()` 方法还接受函数来动态计算。你可以向这些函数注入各种工具作为参数。

### 在单元格中导出多个值

默认情况下，如果列中有多个值，它们将以逗号分隔。你可以使用 `listAsJson()` 方法将它们列为 JSON 数组：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('tags')
    ->listAsJson()
```

### 显示关系数据

你可以使用"点表示法"访问关系中的列。关系名称在前，后跟一个点，再后跟要显示的列名：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('author.name')
```

### 计算关系数量

如果你想在列中计算相关记录的数量，可以使用 `counts()` 方法：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('users_count')
    ->counts('users')
```

在此示例中，`users` 是要计数的关系名称。列的名称必须是 `users_count`，因为这是 [Laravel 使用](https://laravel.com/docs/eloquent-relationships#counting-related-models)的存储结果的约定。

如果你想在计数之前限定关系范围，可以向该方法传递一个数组，其中键是关系名称，值是用于限定 Eloquent 查询的函数：

```php
use Filament\Actions\Exports\ExportColumn;
use Illuminate\Database\Eloquent\Builder;

ExportColumn::make('users_count')
    ->counts([
        'users' => fn (Builder $query) => $query->where('is_active', true),
    ])
```

### 确定关系是否存在

如果你只想指示列中是否存在相关记录，可以使用 `exists()` 方法：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('users_exists')
    ->exists('users')
```

在此示例中，`users` 是要检查存在性的关系名称。列的名称必须是 `users_exists`，因为这是 [Laravel 使用](https://laravel.com/docs/eloquent-relationships#other-aggregate-functions)的存储结果的约定。

如果你想在检查存在性之前限定关系范围，可以向该方法传递一个数组，其中键是关系名称，值是用于限定 Eloquent 查询的函数：

```php
use Filament\Actions\Exports\ExportColumn;
use Illuminate\Database\Eloquent\Builder;

ExportColumn::make('users_exists')
    ->exists([
        'users' => fn (Builder $query) => $query->where('is_active', true),
    ])
```

### 聚合关系

Filament 提供了多种聚合关系字段的方法，包括 `avg()`、`max()`、`min()` 和 `sum()`。例如，如果你想在列中显示所有相关记录的某个字段的平均值，可以使用 `avg()` 方法：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('users_avg_age')
    ->avg('users', 'age')
```

在此示例中，`users` 是关系名称，`age` 是要平均的字段。列的名称必须是 `users_avg_age`，因为这是 [Laravel 使用](https://laravel.com/docs/eloquent-relationships#other-aggregate-functions)的存储结果的约定。

如果你想在聚合之前限定关系范围，可以向该方法传递一个数组，其中键是关系名称，值是用于限定 Eloquent 查询的函数：

```php
use Filament\Actions\Exports\ExportColumn;
use Illuminate\Database\Eloquent\Builder;

ExportColumn::make('users_avg_age')
    ->avg([
        'users' => fn (Builder $query) => $query->where('is_active', true),
    ], 'age')
```

## 配置导出格式

默认情况下，导出操作将生成 CSV 和 XLSX 格式，并允许用户在通知中选择。你可以使用 `ExportFormat` 枚举来自定义此设置，通过向操作的 `formats()` 方法传递格式数组：

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportAction;
use Filament\Actions\Exports\Enums\ExportFormat;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->formats([
        ExportFormat::Csv,
    ])
    // 或者
    ->formats([
        ExportFormat::Xlsx,
    ])
    // 或者
    ->formats([
        ExportFormat::Xlsx,
        ExportFormat::Csv,
    ])
```

或者，你可以重写导出器类中的 `getFormats()` 方法，这将为使用该导出器的所有操作设置默认格式：

```php
use Filament\Actions\Exports\Enums\ExportFormat;

public function getFormats(): array
{
    return [
        ExportFormat::Csv,
    ];
}
```

## 修改导出查询

默认情况下，如果你将 `ExportAction` 与表格一起使用，该操作将使用表格当前过滤和排序的查询来导出数据。如果你没有表格，它将使用模型的默认查询。要在导出前修改查询构建器，你可以在操作上使用 `modifyQueryUsing()` 方法：

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportAction;
use Illuminate\Database\Eloquent\Builder;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->modifyQueryUsing(fn (Builder $query) => $query->where('is_active', true))
```

你可以向函数注入 `$options` 参数，这是该导出的[选项](#使用导出选项)数组：

```php
use App\Filament\Exports\ProductExporter;
use Illuminate\Database\Eloquent\Builder;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->modifyQueryUsing(fn (Builder $query, array $options) => $query->where('is_active', $options['isActive'] ?? true))
```

或者，你可以重写导出器类中的 `modifyQuery()` 方法，这将修改使用该导出器的所有操作的查询：

```php
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphTo;

public static function modifyQuery(Builder $query): Builder
{
    return $query->with([
        'purchasable' => fn (MorphTo $morphTo) => $morphTo->morphWith([
            ProductPurchase::class => ['product'],
            ServicePurchase::class => ['service'],
            Subscription::class => ['plan'],
        ]),
    ]);
}
```

## 配置导出文件系统

### 自定义存储磁盘

默认情况下，导出的文件将上传到[配置文件](../introduction/installation#publishing-configuration)中定义的存储磁盘，默认为 `public`。你可以设置 `FILESYSTEM_DISK` 环境变量来更改此设置。

虽然使用 `public` 磁盘对 Filament 的许多部分来说是好的默认值，但将其用于导出会导致导出文件存储在公共位置。因此，如果默认文件系统磁盘是 `public` 且你的 `config/filesystems.php` 中存在 `local` 磁盘，Filament 将改用 `local` 磁盘进行导出。如果你将磁盘覆盖为 `ExportAction` 或导出器类中的 `public`，Filament 将使用该磁盘。

在生产环境中，你应该使用具有私有访问策略的磁盘（如 `s3`），以防止对导出文件的未授权访问。

如果你想为特定导出使用不同的磁盘，可以将磁盘名称传递给操作上的 `disk()` 方法：

```php
use Filament\Actions\ExportAction;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->fileDisk('s3')
```

你可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中一次性为所有导出操作设置磁盘：

```php
use Filament\Actions\ExportAction;

ExportAction::configureUsing(fn (ExportAction $action) => $action->fileDisk('s3'));
```

或者，你可以重写导出器类中的 `getFileDisk()` 方法，返回磁盘的名称：

```php
public function getFileDisk(): string
{
    return 's3';
}
```

创建的导出文件由开发人员负责删除（如果需要的话）。Filament 不会删除这些文件，以防导出需要稍后再次下载。

### 配置导出文件名

默认情况下，导出文件会根据导出的 ID 和类型生成名称。你可以使用操作上的 `fileName()` 方法自定义文件名：

```php
use Filament\Actions\ExportAction;
use Filament\Actions\Exports\Models\Export;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->fileName(fn (Export $export): string => "products-{$export->getKey()}")
```

或者，你可以重写导出器类中的 `getFileName()` 方法并返回自定义字符串：

```php
use Filament\Actions\Exports\Models\Export;

public function getFileName(Export $export): string
{
    return "products-{$export->getKey()}";
}
```

## 使用导出选项

导出操作可以渲染额外的表单组件，用户在导出 CSV 时可以与之交互。这对于允许用户自定义导出器的行为非常有用。例如，你可能希望用户在导出时能够选择特定列的格式。为此，你可以在导出器类的 `getOptionsFormComponents()` 方法中返回选项表单组件：

```php
use Filament\Forms\Components\TextInput;

public static function getOptionsFormComponents(): array
{
    return [
        TextInput::make('descriptionLimit')
            ->label('Limit the length of the description column content')
            ->integer(),
    ];
}
```

或者，你可以通过操作上的 `options()` 方法向导出器传递一组静态选项：

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportAction;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->options([
        'descriptionLimit' => 250,
    ])
```

除了允许静态值，`options()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

现在，你可以在导出器类中通过向任何闭包函数注入 `$options` 参数来访问这些选项的数据。例如，你可能希望在 `formatStateUsing()` 中使用它来[格式化列的值](#格式化导出列的值)：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('description')
    ->formatStateUsing(function (string $state, array $options): string {
        return (string) str($state)->limit($options['descriptionLimit'] ?? 100);
    })
```

或者，由于 `$options` 参数会传递给所有闭包函数，你可以在 `limit()` 中访问它：

```php
use Filament\Actions\Exports\ExportColumn;

ExportColumn::make('description')
    ->limit(fn (array $options): int => $options['descriptionLimit'] ?? 100)
```

## 使用自定义用户模型

默认情况下，`exports` 表有一个 `user_id` 列。该列被约束到 `users` 表：

```php
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
```

在 `Export` 模型中，`user()` 关系被定义为与 `App\Models\User` 模型的 `BelongsTo` 关系。如果 `App\Models\User` 模型不存在，或者你想使用不同的模型，你可以在服务提供者的 `register()` 方法中将新的 `Authenticatable` 模型绑定到容器：

```php
use App\Models\Admin;
use Illuminate\Contracts\Auth\Authenticatable;

$this->app->bind(Authenticatable::class, Admin::class);
```

如果你的可认证模型使用与 `users` 不同的表，你应该将该表名传递给 `constrained()`：

```php
$table->foreignId('user_id')->constrained('admins')->cascadeOnDelete();
```

### 使用多态用户关系

如果你想将导出与多个用户模型关联，可以使用多态 `MorphTo` 关系。为此，你需要替换 `exports` 表中的 `user_id` 列：

```php
$table->morphs('user');
```

然后，在服务提供者的 `boot()` 方法中，你应该调用 `Export::polymorphicUserRelationship()` 将 `Export` 模型上的 `user()` 关系交换为 `MorphTo` 关系：

```php
use Filament\Actions\Exports\Models\Export;

Export::polymorphicUserRelationship();
```

## 限制可导出的最大行数

为防止服务器过载，你可能希望限制一个 CSV 文件可导出的最大行数。你可以通过在操作上调用 `maxRows()` 方法来实现：

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportAction;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->maxRows(100000)
```

## 更改导出分块大小

Filament 将对 CSV 进行分块，并在不同的排队作业中处理每个块。默认情况下，每次分块为 100 行。你可以通过在操作上调用 `chunkSize()` 方法来更改此设置：

```php
use App\Filament\Exports\ProductExporter;
use Filament\Actions\ExportAction;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->chunkSize(250)
```

除了允许静态值，`chunkSize()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

:::tip
如果你在导入大型 CSV 文件时遇到内存或超时问题，你可能需要减小分块大小。
:::

## 更改 CSV 分隔符

CSV 的默认分隔符是逗号（`,`）。如果你想使用不同的分隔符导出，可以重写导出器类中的 `getCsvDelimiter()` 方法，返回一个新的分隔符：

```php
public static function getCsvDelimiter(): string
{
    return ';';
}
```

除了允许静态值，`csvDelimiter()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你只能指定单个字符，否则将抛出异常。

## 自定义 XLSX 文件

### 设置 XLSX 行样式

如果你想设置 XLSX 文件的单元格样式，可以重写导出器类中的 `getXlsxCellStyle()` 方法，返回一个 [OpenSpout `Style` 对象](https://github.com/openspout/openspout/blob/4.x/docs/documentation.md#styling)：

```php
use OpenSpout\Common\Entity\Style\Style;

public function getXlsxCellStyle(): ?Style
{
    return (new Style())
        ->setFontSize(12)
        ->setFontName('Consolas');
}
```

如果你只想为 XLSX 文件的标题单元格使用不同的样式，可以重写导出器类中的 `getXlsxHeaderCellStyle()` 方法，返回一个 [OpenSpout `Style` 对象](https://github.com/openspout/openspout/blob/4.x/docs/documentation.md#styling)：

```php
use OpenSpout\Common\Entity\Style\CellAlignment;
use OpenSpout\Common\Entity\Style\CellVerticalAlignment;
use OpenSpout\Common\Entity\Style\Color;
use OpenSpout\Common\Entity\Style\Style;

public function getXlsxHeaderCellStyle(): ?Style
{
    return (new Style())
        ->setFontBold()
        ->setFontItalic()
        ->setFontSize(14)
        ->setFontName('Consolas')
        ->setFontColor(Color::rgb(255, 255, 77))
        ->setBackgroundColor(Color::rgb(0, 0, 0))
        ->setCellAlignment(CellAlignment::CENTER)
        ->setCellVerticalAlignment(CellVerticalAlignment::CENTER);
}
```

### 设置 XLSX 列样式

导出器类上的 `makeXlsxRow()` 和 `makeXlsxHeaderRow()` 方法允许你自定义行中单个单元格的样式。默认情况下，这些方法的实现如下：

```php
use OpenSpout\Common\Entity\Row;
use OpenSpout\Common\Entity\Style\Style;

/**
 * @param array<mixed> $values
 */
public function makeXlsxRow(array $values, ?Style $style = null): Row
{
    return Row::fromValues($values, $style);
}
```

当用户导出时，他们可以选择要导出的列。因此，`$this->columnMap` 属性可用于确定正在导出哪些列以及它们的顺序。你可以用 `Cell` 对象数组替换 `Row::fromValues()`，这允许你使用 [OpenSpout `Style` 对象](https://github.com/openspout/openspout/blob/4.x/docs/documentation.md#styling)单独设置它们的样式。`StyleMerger` 可用于将默认样式与单元格的自定义样式合并，允许你在默认样式之上应用额外的样式：

```php
use OpenSpout\Common\Entity\Cell;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Common\Entity\Style\Style;
use OpenSpout\Writer\Common\Manager\Style\StyleMerger;

/**
 * @param array<mixed> $values
 */
public function makeXlsxRow(array $values, ?Style $style = null): Row
{
    $styleMerger = new StyleMerger();

    $cells = [];
    
    foreach (array_keys($this->columnMap) as $columnIndex => $column) {
        $cells[] = match ($column) {
            'name' => Cell::fromValue(
                $values[$columnIndex],
                $styleMerger->merge(
                    (new Style())->setFontUnderline(),
                    $style,
                ),
            ),
            'price' => Cell::fromValue(
                $values[$columnIndex],
                (new Style())->setFontSize(12),
            ),
            default => Cell::fromValue($values[$columnIndex]),
        },
    }
    
    return new Row($cells, $style);
}
```

### 自定义 XLSX 写入器

如果你想向 [OpenSpout XLSX `Writer`](https://github.com/openspout/openspout/blob/4.x/docs/documentation.md#column-widths) 传递"选项"，可以从导出器类的 `getXlsxWriterOptions()` 方法返回一个 `OpenSpout\Writer\XLSX\Options` 实例：

```php
use OpenSpout\Writer\XLSX\Options;

public function getXlsxWriterOptions(): ?Options
{
    $options = new Options();
    $options->setColumnWidth(10, 1);
    $options->setColumnWidthForRange(12, 2, 3);
    
    return $options;
}
```

如果你想在 XLSX 写入器关闭之前对其进行自定义，可以重写导出器类上的 `configureXlsxWriterBeforeClosing()` 方法。此方法接收 `Writer` 实例作为参数，你可以在关闭之前对其进行修改：

```php
use OpenSpout\Writer\XLSX\Entity\SheetView;
use OpenSpout\Writer\XLSX\Writer;

public function configureXlsxWriterBeforeClose(Writer $writer): Writer
{
    $sheetView = new SheetView();
    $sheetView->setFreezeRow(2);
    $sheetView->setFreezeColumn('B');
    
    $sheet = $writer->getCurrentSheet();
    $sheet->setSheetView($sheetView);
    $sheet->setName('export');
    
    return $writer;
}
```

## 自定义完成通知

当导出完成时，Filament 会向启动导出的用户发送通知。你可以通过重写导出器上的 `getCompletedNotificationTitle()` 和 `getCompletedNotificationBody()` 来自定义该通知的标题和正文：

```php
use Filament\Actions\Exports\Models\Export;

public static function getCompletedNotificationTitle(Export $export): string
{
    return 'Your product export is ready';
}

public static function getCompletedNotificationBody(Export $export): string
{
    return $export->successful_rows . ' products were exported.';
}
```

对于标题和正文之外的任何内容——例如，更改通知颜色、添加额外操作或替换图标——请重写 `modifyCompletedNotification()`。你可以修改传入的 `Notification` 并返回它，也可以构建并返回一个全新的通知：

```php
use Filament\Actions\Action;
use Filament\Actions\Exports\Models\Export;
use Filament\Notifications\Notification;

public static function modifyCompletedNotification(Notification $notification, Export $export): Notification
{
    $notification->icon('heroicon-o-shopping-bag');

    if ($export->getOptions()['notifyTeam'] ?? false) {
        $notification->actions([
            ...$notification->getActions(),
            Action::make('shareWithTeam')
                ->url(route('exports.share', $export)),
        ]);
    }

    return $notification;
}
```

`Export` 模型通过 `$export->getColumnMap()` 和 `$export->getOptions()` 暴露用户选择的列映射和选项，因此你可以根据用户导出的内容来定制通知。

## 自定义导出作业

处理导出的默认作业是 `Filament\Actions\Exports\Jobs\PrepareCsvExport`。如果你想扩展此类并重写其任何方法，可以在服务提供者的 `register()` 方法中替换原始类：

```php
use App\Jobs\PrepareCsvExport;
use Filament\Actions\Exports\Jobs\PrepareCsvExport as BasePrepareCsvExport;

$this->app->bind(BasePrepareCsvExport::class, PrepareCsvExport::class);
```

或者，你可以将新作业类传递给操作上的 `job()` 方法，以自定义特定导出的作业：

```php
use App\Filament\Exports\ProductExporter;
use App\Jobs\PrepareCsvExport;
use Filament\Actions\ExportAction;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->job(PrepareCsvExport::class)
```

### 自定义导出队列和连接

默认情况下，导出系统将使用默认队列和连接。如果你想自定义某个导出器的作业所使用的队列，可以重写导出器类中的 `getJobQueue()` 方法：

```php
public function getJobQueue(): ?string
{
    return 'exports';
}
```

你还可以通过重写导出器类中的 `getJobConnection()` 方法来自定义某个导出器的作业所使用的连接：

```php
public function getJobConnection(): ?string
{
    return 'sqs';
}
```

### 自定义导出作业中间件

默认情况下，导出系统将只从每个导出中一次处理一个作业。这是为了防止服务器过载，以及其他作业被大型导出延迟。该功能在导出器类的 `WithoutOverlapping` 中间件中定义：

```php
public function getJobMiddleware(): array
{
    return [
        (new WithoutOverlapping("export{$this->export->getKey()}"))->expireAfter(600),
    ];
}
```

如果你想自定义应用于某个导出器的作业的中间件，可以在导出器类中重写此方法。你可以在 [Laravel 文档](https://laravel.com/docs/queues#job-middleware)中阅读更多关于作业中间件的内容。

### 自定义导出作业重试

默认情况下，导出系统将重试作业 24 小时，或者直到它以 5 个未处理异常失败，以先发生者为准。这是为了允许临时问题（如数据库不可用）得到解决。你可以更改作业重试的时间段，这在导出器类的 `getJobRetryUntil()` 方法中定义：

```php
use Carbon\CarbonInterface;

public function getJobRetryUntil(): ?CarbonInterface
{
    return now()->addHours(12);
}
```

你可以在 [Laravel 文档](https://laravel.com/docs/queues#max-job-attempts-and-timeout)中阅读更多关于作业重试的内容。

#### 自定义导出作业退避策略

默认情况下，导出系统将在重试作业之前等待 1 分钟，然后 2 分钟，然后 5 分钟，然后 10 分钟。这是为了防止服务器被反复失败的作业过载。该功能在导出器类的 `getJobBackoff()` 方法中定义：

```php
/**
* @return int | array<int> | null
 */
public function getJobBackoff(): int | array | null
{
    return [60, 120, 300, 600];
}
```

你可以在 [Laravel 文档](https://laravel.com/docs/queues#dealing-with-failed-jobs)中阅读更多关于作业退避的内容，包括如何配置指数退避。

### 自定义导出作业标签

默认情况下，导出系统将使用导出的 ID 标记每个作业。这是为了让你能够轻松找到与某个导出相关的所有作业。该功能在导出器类的 `getJobTags()` 方法中定义：

```php
public function getJobTags(): array
{
    return ["export{$this->export->getKey()}"];
}
```

如果你想自定义应用于某个导出器的作业的标签，可以在导出器类中重写此方法。

### 自定义导出作业批次名称

默认情况下，导出系统不会为作业批次定义任何名称。如果你想自定义应用于某个导出器的作业批次的名称，可以在导出器类中重写 `getJobBatchName()` 方法：

```php
public function getJobBatchName(): ?string
{
    return 'product-export';
}
```

## 授权

默认情况下，只有启动导出的用户才能下载生成的文件。如果你想自定义授权逻辑，可以创建一个 `ExportPolicy` 类，并[在你的 `AuthServiceProvider` 中注册它](https://laravel.com/docs/authorization#registering-policies)：

```php
use App\Policies\ExportPolicy;
use Filament\Actions\Exports\Models\Export;

protected $policies = [
    Export::class => ExportPolicy::class,
];
```

策略的 `view()` 方法将用于授权对下载的访问。

请注意，如果你定义了策略，确保只有启动导出的用户才能访问的现有逻辑将被移除。如果你想保留该逻辑，需要将其添加到你的策略中：

```php
use App\Models\User;
use Filament\Actions\Exports\Models\Export;

public function view(User $user, Export $export): bool
{
    return $export->user()->is($user);
}
```

## 安全

### 逐记录授权

导出系统不执行逐记录授权检查。当导出被触发时，所有匹配表格查询的记录（或模型的完整数据集，如果在表格外使用）都会被包含在导出中，而不会咨询你应用程序的 [Laravel 策略](https://laravel.com/docs/authorization#creating-policies)。这意味着，如果用户被允许触发导出，他们可能会收到通常不被授权通过应用程序 UI 查看的记录。

如果你需要限制导出哪些记录，应该使用 [`modifyQueryUsing()` 方法](#修改导出查询)来限定查询范围：

```php
use Illuminate\Database\Eloquent\Builder;

ExportAction::make()
    ->exporter(ProductExporter::class)
    ->modifyQueryUsing(fn (Builder $query) => $query->whereBelongsTo(auth()->user()))
```

你也可以对模型应用[全局作用域](https://laravel.com/docs/eloquent#global-scopes)，以确保只查询授权的记录。

:::danger
如果你的应用程序有逐记录可见性规则，你应该限定导出查询范围，以确保用户只收到他们被授权查看的记录。
:::

### CSV 公式注入

Filament 的导出系统将数据按原样写入 CSV 和 XLSX 文件，不进行任何转换。这意味着，如果你的数据库包含以 `=`、`+`、`-` 或 `@` 等字符开头的值，它们将以未更改的形式出现在导出的文件中。当在 Microsoft Excel 或 Google Sheets 等电子表格软件中打开时，这些值可能会被解释为公式，如果你的数据包含不受信任或用户提交的内容，这可能会带来安全风险。你应该确保你的用户了解此风险，或者在导出前使用每列上的 [`formatStateUsing()` 方法](#格式化导出列的值)清理数据，例如在值前加单引号（`'`）以防止公式解释。

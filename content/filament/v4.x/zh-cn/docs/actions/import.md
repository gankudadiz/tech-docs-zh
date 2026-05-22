---
title: 导入操作
---
## 简介

Filament 包含一个能够从 CSV 导入行的操作。当触发按钮被点击时，会打开一个模态框要求用户上传文件。上传后，他们可以将 CSV 中的每一列映射到数据库中的实际列。如果任何行验证失败，它们将被编译成一个可下载的 CSV，供用户在其余行导入完成后查看。用户还可以下载一个包含所有可导入列的示例 CSV 文件。

此功能使用[作业批次](https://laravel.com/docs/queues#job-batching)和[数据库通知](../notifications/database-notifications)，因此你需要从 Laravel 发布这些迁移。此外，你还需要发布 Filament 用于存储导入信息的表的迁移：

```bash
php artisan make:queue-batches-table
php artisan make:notifications-table
php artisan vendor:publish --tag=filament-actions-migrations
php artisan migrate
```

如果你想在面板中接收导入通知，可以在[面板配置](../notifications/database-notifications#enabling-database-notifications-in-a-panel)中启用它们。

:::info
如果你使用 PostgreSQL，请确保通知迁移中的 `data` 列使用 `json()`：`$table->json('data')`。
:::

:::info
如果你的 `User` 模型使用 UUID，请确保通知迁移中的 `notifiable` 列使用 `uuidMorphs()`：`$table->uuidMorphs('notifiable')`。
:::

你可以像这样使用 `ImportAction`：

```php
use App\Filament\Imports\ProductImporter;
use Filament\Actions\ImportAction;

// 创建导入操作，用于从 CSV 导入数据
ImportAction::make()
    ->importer(ProductImporter::class)            // 指定导入器类，定义如何导入数据
```

![导入操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/import-action/modal.jpg)

如果你想将此操作添加到表格的头部，可以像这样操作：

```php
use App\Filament\Imports\ProductImporter;
use Filament\Actions\ImportAction;
use Filament\Tables\Table;

// 将导入操作添加到表格头部
public function table(Table $table): Table
{
    return $table
        ->headerActions([                        // 头部操作区域
            ImportAction::make()
                ->importer(ProductImporter::class)
        ]);
}
```

需要[创建"导入器"类](#创建导入器)来告诉 Filament 如何导入 CSV 的每一行。

如果你在同一位置有多个 `ImportAction`，你应该在 `make()` 方法中为每个操作指定唯一的名称：

```php
use Filament\Actions\ImportAction;

// 同一位置有多个导入操作时，需要指定唯一名称
ImportAction::make('importProducts')             // 产品导入操作
    ->importer(ProductImporter::class)

ImportAction::make('importBrands')               // 品牌导入操作
    ->importer(BrandImporter::class)
```

## 创建导入器

要为模型创建导入器类，你可以使用 `make:filament-importer` 命令，传入模型的名称：

```bash
php artisan make:filament-importer Product
```

这将在 `app/Filament/Imports` 目录中创建一个新类。你现在需要定义可以导入的[列](#定义导入器列)。

### 自动生成导入器列

如果你想节省时间，Filament 可以根据模型的数据库列自动生成[列](#定义导入器列)，使用 `--generate`：

```bash
php artisan make:filament-importer Product --generate
```

## 定义导入器列

要定义可以导入的列，你需要在导入器类中重写 `getColumns()` 方法，返回一个 `ImportColumn` 对象数组：

```php
use Filament\Actions\Imports\ImportColumn;

// 定义可以导入的列
public static function getColumns(): array
{
    return [
        ImportColumn::make('name')                // 名称列
            ->requiredMapping()                   // 必须映射到 CSV 列
            ->rules(['required', 'max:255']),     // 验证规则
        ImportColumn::make('sku')                 // SKU 列
            ->label('SKU')                        // 自定义标签
            ->requiredMapping()
            ->rules(['required', 'max:32']),
        ImportColumn::make('price')               // 价格列
            ->numeric()                           // 类型转换为数字
            ->rules(['numeric', 'min:0']),
    ];
}
```

### 自定义导入列的标签

每列的标签将从其名称自动生成，但你可以通过调用 `label()` 方法来覆盖它：

```php
use Filament\Actions\Imports\ImportColumn;

// 自定义导入列的标签
ImportColumn::make('sku')
    ->label('SKU')                               // 覆盖默认标签
```

### 要求导入列映射到 CSV 列

你可以调用 `requiredMapping()` 方法来要求列必须映射到 CSV 中的列。数据库中必需的列应该要求映射：

```php
use Filament\Actions\Imports\ImportColumn;

// 要求列必须映射到 CSV 列
ImportColumn::make('sku')
    ->requiredMapping()                          // 用户必须选择 CSV 中的对应列
```

如果你在数据库中要求某列，还需要确保它有 [`rules(['required'])` 验证规则](#验证-csv-数据)。

如果列未被映射，它将不会被验证，因为没有数据可验证。

如果你允许导入创建记录以及[更新现有记录](#导入时更新现有记录)，但只要求在创建记录时映射列（因为它是必填字段），你可以使用 `requiredMappingForNewRecordsOnly()` 方法代替 `requiredMapping()`：

```php
use Filament\Actions\Imports\ImportColumn;

// 仅在创建新记录时要求映射（更新时可选）
ImportColumn::make('sku')
    ->requiredMappingForNewRecordsOnly()         // 新记录必填，更新时可选
```

如果 `resolveRecord()` 方法返回一个尚未保存到数据库的模型实例，该列将仅对该行要求映射。如果用户未映射该列，且导入中的某行在数据库中尚不存在，仅该行将失败，并在所有行分析完毕后将消息添加到失败行 CSV 中。

### 验证 CSV 数据

你可以调用 `rules()` 方法为列添加验证规则。这些规则将在每行数据从 CSV 保存到数据库之前检查：

```php
use Filament\Actions\Imports\ImportColumn;

// 为导入列添加验证规则
ImportColumn::make('sku')
    ->rules(['required', 'max:32'])               // 必填，最大 32 字符
```

任何未通过验证的行将不会被导入。相反，它们将被编译成一个新的"失败行" CSV，用户可以在导入完成后下载。用户将看到每行失败的验证错误列表。

除了允许静态值，`rules()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

### 类型转换

在[验证](#验证-csv-数据)之前，CSV 中的数据可以进行类型转换。这对于将字符串转换为正确的数据类型很有用，否则验证可能会失败。例如，如果你的 CSV 中有 `price` 列，你可能希望将其转换为浮点数：

```php
use Filament\Actions\Imports\ImportColumn;

// 自定义类型转换：清理价格字符串并转换为浮点数
ImportColumn::make('price')
    ->castStateUsing(function (string $state): ?float {
        if (blank($state)) {
            return null;                         // 空值返回 null
        }
        
        $state = preg_replace('/[^0-9.]/', '', $state);  // 移除非数字字符
        $state = floatval($state);               // 转换为浮点数
    
        return round($state, precision: 2);      // 四舍五入到 2 位小数
    })
```

除了 `$state`，`castStateUsing()` 方法还允许你向函数注入各种工具作为参数。

在此示例中，我们传入一个用于转换 `$state` 的函数。此函数从字符串中删除所有非数字字符，将其转换为浮点数，并四舍五入到两位小数。

:::info
如果列未被[验证要求](#验证-csv-数据)，且为空，则不会进行类型转换。
:::

Filament 还附带了一些内置的类型转换方法：

```php
use Filament\Actions\Imports\ImportColumn;

// 内置类型转换方法
ImportColumn::make('price')
    ->numeric()                                  // 转换为浮点数

ImportColumn::make('price')
    ->numeric(decimalPlaces: 2)                  // 转换为浮点数，保留 2 位小数

ImportColumn::make('quantity')
    ->integer()                                  // 转换为整数

ImportColumn::make('is_visible')
    ->boolean()                                  // 转换为布尔值
```

#### 类型转换后修改状态

如果你使用[内置类型转换方法](#类型转换)或[数组转换](#处理单列中的多个值)，你可以通过向 `castStateUsing()` 方法传递函数来在类型转换后修改状态：

```php
use Filament\Actions\Imports\ImportColumn;

// 类型转换后修改状态（乘以 100 转换为分）
ImportColumn::make('price')
    ->numeric()                                  // 先转换为浮点数
    ->castStateUsing(function (float $state): ?float {
        if (blank($state)) {
            return null;
        }
    
        return round($state * 100);              // 元转换为分
    })
```

你甚至可以通过在函数中定义 `$originalState` 参数来访问类型转换前的原始状态：

```php
use Filament\Actions\Imports\ImportColumn;

// 访问类型转换前的原始状态
ImportColumn::make('price')
    ->numeric()
    ->castStateUsing(function (float $state, mixed $originalState): ?float {
        // $state 是转换后的值，$originalState 是原始字符串
        // ...
    })
```

除了 `$state`，`castStateUsing()` 方法还允许你向函数注入各种工具作为参数。

### 处理单列中的多个值

你可以使用 `multiple()` 方法将列中的值转换为数组。它接受分隔符作为第一个参数，用于将列中的值分割成数组。例如，如果你的 CSV 中有 `documentation_urls` 列，你可能希望将其转换为 URL 数组：

```php
use Filament\Actions\Imports\ImportColumn;

// 将单列中的值转换为数组
ImportColumn::make('documentation_urls')
    ->multiple(',')                             // 使用逗号分隔
```

除了允许静态值，`multiple()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

在此示例中，我们传入逗号作为分隔符，因此列中的值将按逗号分割并转换为数组。

#### 转换数组中的每个项目

如果你想将数组中的每个项目转换为不同的数据类型，可以链式调用[内置类型转换方法](#类型转换)：

```php
use Filament\Actions\Imports\ImportColumn;

// 转换数组中的每个项目为整数
ImportColumn::make('customer_ratings')
    ->multiple(',')                             // 分隔为数组
    ->integer()                                  // 每个元素转换为整数
```

#### 验证数组中的每个项目

如果你想验证数组中的每个项目，可以链式调用 `nestedRecursiveRules()` 方法：

```php
use Filament\Actions\Imports\ImportColumn;

// 验证数组中的每个项目
ImportColumn::make('customer_ratings')
    ->multiple(',')
    ->integer()
    ->rules(['array'])                           // 验证为数组
    ->nestedRecursiveRules(['integer', 'min:1', 'max:5'])  // 每个元素：1-5 的整数
```

除了允许静态值，`nestedRecursiveRules()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

### 导入关系

你可以使用 `relationship()` 方法导入关系。目前支持 `BelongsTo` 和 `BelongsToMany` 关系。例如，如果你的 CSV 中有 `category` 列，你可能希望导入分类 `BelongsTo` 关系：

```php
use Filament\Actions\Imports\ImportColumn;

// 导入 BelongsTo 关系
ImportColumn::make('author')
    ->relationship()                             // CSV 中的 author 列映射到 author_id
```

在此示例中，CSV 中的 `author` 列将映射到数据库中的 `author_id` 列。CSV 应包含作者的主键，通常是 `id`。

如果列有值，但找不到作者，导入将验证失败。Filament 会自动为所有关系列添加验证，以确保在需要时关系不为空。

如果你想导入 `BelongsToMany` 关系，请确保列设置为 [`multiple()`](#处理单列中的多个值)，值之间使用正确的分隔符：

```php
use Filament\Actions\Imports\ImportColumn;

// 导入 BelongsToMany 关系
ImportColumn::make('authors')
    ->relationship()
    ->multiple(',')                             // 多个值用逗号分隔
```

#### 自定义关系导入解析

如果你想使用不同的列查找相关记录，可以将列名作为 `resolveUsing` 传递：

```php
use Filament\Actions\Imports\ImportColumn;

// 使用 email 列查找关联记录（而非默认的 id）
ImportColumn::make('author')
    ->relationship(resolveUsing: 'email')        // 通过 email 匹配作者
```

你可以向 `resolveUsing` 传递多个列，它们将以"或"的方式用于查找作者。例如，如果你传入 `['email', 'username']`，可以通过电子邮件或用户名找到记录：

```php
use Filament\Actions\Imports\ImportColumn;

// 通过 email 或 username 查找记录（或逻辑）
ImportColumn::make('author')
    ->relationship(resolveUsing: ['email', 'username'])
```

你还可以通过向 `resolveUsing` 传递函数来自定义解析过程，该函数应返回要与关系关联的记录：

```php
use App\Models\Author;
use Filament\Actions\Imports\ImportColumn;

// 自定义关系解析函数
ImportColumn::make('author')
    ->relationship(resolveUsing: function (string $state): ?Author {
        return Author::query()
            ->where('email', $state)             // 优先通过 email 查找
            ->orWhere('username', $state)        // 然后通过 username 查找
            ->first();
    })
```

传递给 `resolveUsing` 的函数允许你向函数注入各种工具作为参数。

如果你使用 `BelongsToMany` 关系，`$state` 将是一个数组，你应该返回已解析的记录集合：

```php
use App\Models\Author;
use Filament\Actions\Imports\ImportColumn;
use Illuminate\Database\Eloquent\Collection;

// BelongsToMany 关系解析（返回集合）
ImportColumn::make('authors')
    ->relationship(resolveUsing: function (array $state): Collection {
        return Author::query()
            ->whereIn('email', $state)           // 批量匹配 email
            ->orWhereIn('username', $state)      // 或批量匹配 username
            ->get();
    })
```

你甚至可以使用此函数动态确定使用哪些列来解析记录：

```php
use App\Models\Author;
use Filament\Actions\Imports\ImportColumn;

// 动态确定使用哪列解析关系
ImportColumn::make('author')
    ->relationship(resolveUsing: function (string $state): ?Author {
        if (filter_var($state, FILTER_VALIDATE_EMAIL)) {
            return 'email';                      // 如果是邮箱，使用 email 列
        }
    
        return 'username';                       // 否则使用 username 列
    })
```

### 将列数据标记为敏感数据

当导入行验证失败时，它们会被记录到数据库中，准备在导入完成后导出。你可能希望将某些列从此日志记录中排除，以避免以纯文本形式存储敏感数据。为此，你可以在 `ImportColumn` 上使用 `sensitive()` 方法来防止其数据被记录：

```php
use Filament\Actions\Imports\ImportColumn;

// 标记列数据为敏感数据（不记录到失败 CSV）
ImportColumn::make('ssn')
    ->label('Social security number')
    ->sensitive()                                // 防止数据被记录到失败行 CSV
    ->rules(['required', 'digits:9'])
```

### 自定义列如何填充到记录中

如果你想自定义列状态如何填充到记录中，可以向 `fillRecordUsing()` 方法传递函数：

```php
use App\Models\Product;
use Filament\Actions\Imports\ImportColumn;

// 自定义列如何填充到记录中
ImportColumn::make('sku')
    ->fillRecordUsing(function (Product $record, string $state): void {
        $record->sku = strtoupper($state);       // 转换为大写
    })
```

传递给 `fillRecordUsing()` 方法的函数允许你向函数注入各种工具作为参数。

### 在导入列下方添加帮助文本

有时，你可能希望在验证之前为用户提供额外信息。你可以通过向列添加 `helperText()` 来实现，它将显示在映射选择下方：

```php
use Filament\Actions\Imports\ImportColumn;

// 在导入列下方添加帮助文本
ImportColumn::make('skus')
    ->multiple(',')
    ->helperText('A comma-separated list of SKUs.')  // 显示在映射选择下方
```

## 导入时更新现有记录

生成导入器类时，你会看到这个 `resolveRecord()` 方法：

```php
use App\Models\Product;

// 默认的 resolveRecord 方法（创建新记录）
public function resolveRecord(): ?Product
{
    // return Product::firstOrNew([
    //     // 更新现有记录，按指定列匹配
    //     'email' => $this->data['email'],
    // ]);

    return new Product();                        // 默认创建新记录
}
```

此方法对 CSV 中的每一行调用，负责返回一个模型实例，该实例将被填充 CSV 中的数据并保存到数据库。默认情况下，它将为每一行创建一个新记录。但是，你可以自定义此行为来更新现有记录。例如，你可能希望在产品已存在时更新它，不存在时创建新产品。为此，你可以取消 `firstOrNew()` 行的注释，并传递要匹配的列名。对于产品，我们可能希望匹配 `sku` 列：

```php
use App\Models\Product;

// 更新或创建记录（按 SKU 匹配）
public function resolveRecord(): ?Product
{
    return Product::firstOrNew([
        'sku' => $this->data['sku'],             // 按 SKU 查找，不存在则创建
    ]);
}
```

### 仅在导入时更新现有记录

如果你想编写一个仅更新现有记录而不创建新记录的导入器，如果未找到记录，可以返回 `null`：

```php
use App\Models\Product;

// 仅更新现有记录（找不到则返回 null）
public function resolveRecord(): ?Product
{
    return Product::query()
        ->where('sku', $this->data['sku'])
        ->first();                               // 找不到记录时返回 null
}
```

如果你想在未找到记录时使导入行失败，可以抛出带有消息的 `RowImportFailedException`：

```php
use App\Models\Product;
use Filament\Actions\Imports\Exceptions\RowImportFailedException;

// 找不到记录时抛出异常（导入行失败）
public function resolveRecord(): ?Product
{
    $product = Product::query()
        ->where('sku', $this->data['sku'])
        ->first();

    if (! $product) {
        throw new RowImportFailedException("No product found with SKU [{$this->data['sku']}].");
    }

    return $product;
}
```

导入完成后，用户将能够下载包含错误消息的失败行 CSV。

### 忽略导入列的空白状态

默认情况下，如果 CSV 中的列为空，且已被用户映射，且验证不要求，该列将在数据库中作为 `null` 导入。如果你想忽略空白状态，改用数据库中的现有值，可以调用 `ignoreBlankState()` 方法：

```php
use Filament\Actions\Imports\ImportColumn;

// 忽略空白状态（使用数据库中的现有值）
ImportColumn::make('price')
    ->ignoreBlankState()                         // CSV 中为空时保留原值
```

## 使用导入选项

导入操作可以渲染额外的表单组件，用户在导入 CSV 时可以与之交互。这对于允许用户自定义导入器的行为非常有用。例如，你可能希望用户能够选择导入时是否更新现有记录，还是只创建新记录。为此，你可以在导入器类的 `getOptionsFormComponents()` 方法中返回选项表单组件：

```php
use Filament\Forms\Components\Checkbox;

// 定义导入选项表单
public static function getOptionsFormComponents(): array
{
    return [
        Checkbox::make('updateExisting')          // 是否更新现有记录选项
            ->label('Update existing records'),
    ];
}
```

或者，你可以通过操作上的 `options()` 方法向导入器传递一组静态选项：

```php
use App\Filament\Imports\ProductImporter;
use Filament\Actions\ImportAction;

// 通过操作传递静态选项值
ImportAction::make()
    ->importer(ProductImporter::class)
    ->options([
        'updateExisting' => true,                // 启用更新现有记录
    ])
```

现在，你可以在导入器类中通过调用 `$this->options` 来访问这些选项的数据。例如，你可能希望在 `resolveRecord()` 中使用它来[更新现有产品](#导入时更新现有记录)：

```php
use App\Models\Product;

// 在 resolveRecord 中使用选项
public function resolveRecord(): ?Product
{
    if ($this->options['updateExisting'] ?? false) {
        return Product::firstOrNew([             // 更新模式：找到则更新，否则创建
            'sku' => $this->data['sku'],
        ]);
    }

    return new Product();                        // 创建模式：总是创建新记录
}
```

## 改进导入列映射猜测

默认情况下，Filament 将尝试"猜测"CSV 中的哪些列与数据库中的哪些列匹配，以节省用户时间。它通过尝试查找列名的不同组合来实现，包括带空格、`-`、`_` 的情况，都不区分大小写。但是，如果你想改进猜测，可以使用 `csv()` 中可能出现的列名的更多示例调用 `guess()` 方法：

```php
use Filament\Actions\Imports\ImportColumn;

// 改进列映射猜测（提供更多可能的列名）
ImportColumn::make('sku')
    ->guess(['id', 'number', 'stock-keeping unit'])
    // CSV 列名可能是 id、number 或 stock-keeping unit
```

## 提供示例 CSV 数据

在用户上传 CSV 之前，他们可以选择下载一个示例 CSV 文件，其中包含所有可导入的可用列。这很有用，因为它允许用户将此文件直接导入到他们的电子表格软件中并填写。

你还可以向 CSV 添加示例行，以向用户展示数据应该是什么样子。要填写此示例行，你可以向 `example()` 方法传入示例列值：

```php
use Filament\Actions\Imports\ImportColumn;

// 为示例 CSV 提供示例值
ImportColumn::make('sku')
    ->example('ABC123')                          // 示例 SKU 值
```

或者如果你想添加多个示例行，可以向 `examples()` 方法传递数组：

```php
use Filament\Actions\Imports\ImportColumn;

// 提供多个示例值
ImportColumn::make('sku')
    ->examples(['ABC123', 'DEF456'])             // 多行示例数据
```

默认情况下，列的名称用于示例 CSV 的标题中。你可以使用 `exampleHeader()` 自定义每列的标题：

```php
use Filament\Actions\Imports\ImportColumn;

// 自定义示例 CSV 的列标题
ImportColumn::make('sku')
    ->exampleHeader('SKU')                       // 使用 "SKU" 作为标题
```

## 使用自定义用户模型

默认情况下，`imports` 表有一个 `user_id` 列。该列被约束到 `users` 表：

```php
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
```

在 `Import` 模型中，`user()` 关系被定义为与 `App\Models\User` 模型的 `BelongsTo` 关系。如果 `App\Models\User` 模型不存在，或者你想使用不同的模型，你可以在服务提供者的 `register()` 方法中将新的 `Authenticatable` 模型绑定到容器：

```php
use App\Models\Admin;
use Illuminate\Contracts\Auth\Authenticatable;

// 绑定自定义用户模型到容器
$this->app->bind(Authenticatable::class, Admin::class);
// 在服务提供者的 register() 方法中调用
```

如果你的可认证模型使用与 `users` 不同的表，你应该将该表名传递给 `constrained()`：

```php
// 如果用户模型使用不同的表名
$table->foreignId('user_id')->constrained('admins')->cascadeOnDelete();
// 约束到 admins 表
```

### 使用多态用户关系

如果你想将导入与多个用户模型关联，可以使用多态 `MorphTo` 关系。为此，你需要替换 `imports` 表中的 `user_id` 列：

```php
// 使用多态关系代替外键
$table->morphs('user');                         // 创建 user_type 和 user_id 列
```

然后，在服务提供者的 `boot()` 方法中，你应该调用 `Import::polymorphicUserRelationship()` 将 `Import` 模型上的 `user()` 关系交换为 `MorphTo` 关系：

```php
use Filament\Actions\Imports\Models\Import;

// 启用多态用户关系
Import::polymorphicUserRelationship();
// 在服务提供者的 boot() 方法中调用
```

## 限制可导入的最大行数

为防止服务器过载，你可能希望限制一个 CSV 文件可导入的最大行数。你可以通过在操作上调用 `maxRows()` 方法来实现：

```php
use App\Filament\Imports\ProductImporter;
use Filament\Actions\ImportAction;

// 限制导入的最大行数
ImportAction::make()
    ->importer(ProductImporter::class)
    ->maxRows(100000)                            // 最多导入 10 万行
```

除了允许静态值，`maxRows()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

## 更改导入分块大小

Filament 将对 CSV 进行分块，并在不同的排队作业中处理每个块。默认情况下，每次分块为 100 行。你可以通过在操作上调用 `chunkSize()` 方法来更改此设置：

```php
use App\Filament\Imports\ProductImporter;
use Filament\Actions\ImportAction;

// 更改导入分块大小
ImportAction::make()
    ->importer(ProductImporter::class)
    ->chunkSize(250)                             // 每次处理 250 行
```

除了允许静态值，`chunkSize()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

:::tip
如果你在导入大型 CSV 文件时遇到内存或超时问题，你可能需要减小分块大小。
:::

## 更改 CSV 分隔符

CSV 的默认分隔符是逗号（`,`）。如果你的导入使用不同的分隔符，可以在操作上调用 `csvDelimiter()` 方法，传入新的分隔符：

```php
use App\Filament\Imports\ProductImporter;
use Filament\Actions\ImportAction;

// 更改 CSV 分隔符
ImportAction::make()
    ->importer(ProductImporter::class)
    ->csvDelimiter(';')                          // 使用分号分隔
```

除了允许静态值，`csvDelimiter()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你只能指定单个字符，否则将抛出异常。

## 更改列标题偏移量

如果你的列标题不在 CSV 的第一行，可以在操作上调用 `headerOffset()` 方法，传入要跳过的行数：

```php
use App\Filament\Imports\ProductImporter;
use Filament\Actions\ImportAction;

// 更改列标题偏移量（跳过前 5 行）
ImportAction::make()
    ->importer(ProductImporter::class)
    ->headerOffset(5)                            // 标题在第 6 行
```

除了允许静态值，`headerOffset()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

## 自定义完成通知

当导入完成时，Filament 会向启动导入的用户发送通知。你可以通过重写导入器上的 `getCompletedNotificationTitle()` 和 `getCompletedNotificationBody()` 来自定义该通知的标题和正文：

```php
use Filament\Actions\Imports\Models\Import;

// 自定义导入完成通知的标题
public static function getCompletedNotificationTitle(Import $import): string
{
    return 'Your product import has finished';
}

// 自定义导入完成通知的正文
public static function getCompletedNotificationBody(Import $import): string
{
    return $import->successful_rows . ' products were imported.';
}
```

对于标题和正文之外的任何内容——例如，更改通知颜色、添加额外操作或替换图标——请重写 `modifyCompletedNotification()`。你可以修改传入的 `Notification` 并返回它，也可以构建并返回一个全新的通知：

```php
use Filament\Actions\Action;
use Filament\Actions\Imports\Models\Import;
use Filament\Notifications\Notification;

// 完全自定义导入完成通知
public static function modifyCompletedNotification(Notification $notification, Import $import): Notification
{
    $notification->icon('heroicon-o-shopping-bag');  // 自定义图标

    // 如果用户选择了发送欢迎邮件选项
    if ($import->getOptions()['sendWelcomeEmails'] ?? false) {
        $notification->actions([
            ...$notification->getActions(),
            Action::make('viewWelcomeEmails')     // 添加查看邮件操作
                ->url(route('emails.sent')),
        ]);
    }

    return $notification;
}
```

`Import` 模型通过 `$import->getColumnMap()` 和 `$import->getOptions()` 暴露用户选择的列映射和选项，因此你可以根据用户导入的内容来定制通知。

## 自定义导入作业

处理导入的默认作业是 `Filament\Actions\Imports\Jobs\ImportCsv`。如果你想扩展此类并重写其任何方法，可以在服务提供者的 `register()` 方法中替换原始类：

```php
use App\Jobs\ImportCsv;
use Filament\Actions\Imports\Jobs\ImportCsv as BaseImportCsv;

// 全局替换导入作业类
$this->app->bind(BaseImportCsv::class, ImportCsv::class);
// 在服务提供者的 register() 方法中调用
```

或者，你可以将新作业类传递给操作上的 `job()` 方法，以自定义特定导入的作业：

```php
use App\Filament\Imports\ProductImporter;
use App\Jobs\ImportCsv;
use Filament\Actions\ImportAction;

// 为特定导入操作设置自定义作业
ImportAction::make()
    ->importer(ProductImporter::class)
    ->job(ImportCsv::class)                      // 使用自定义作业类
```

### 自定义导入队列和连接

默认情况下，导入系统将使用默认队列和连接。如果你想自定义某个导入器的作业所使用的队列，可以重写导入器类中的 `getJobQueue()` 方法：

```php
// 自定义导入作业使用的队列
public function getJobQueue(): ?string
{
    return 'imports';                            // 使用 imports 队列
}
```

你还可以通过重写导入器类中的 `getJobConnection()` 方法来自定义某个导入器的作业所使用的连接：

```php
// 自定义导入作业使用的连接
public function getJobConnection(): ?string
{
    return 'sqs';                                // 使用 SQS 连接
}
```

### 自定义导入作业中间件

默认情况下，导入系统将只从每个导入中一次处理一个作业。这是为了防止服务器过载，以及其他作业被大型导入延迟。该功能在导入器类的 `WithoutOverlapping` 中间件中定义：

```php
use Illuminate\Queue\Middleware\WithoutOverlapping;

// 自定义导入作业中间件
public function getJobMiddleware(): array
{
    return [
        (new WithoutOverlapping("import{$this->import->getKey()}"))->expireAfter(600),
        // 防止重叠执行，600 秒后过期
    ];
}
```

如果你想自定义应用于某个导入器的作业的中间件，可以在导入器类中重写此方法。你可以在 [Laravel 文档](https://laravel.com/docs/queues#job-middleware)中阅读更多关于作业中间件的内容。

### 自定义导入作业重试

默认情况下，导入系统将重试作业 24 小时，或者直到它以 5 个未处理异常失败，以先发生者为准。这是为了允许临时问题（如数据库不可用）得到解决。你可以更改作业重试的时间段，这在导入器类的 `getJobRetryUntil()` 方法中定义：

```php
use Carbon\CarbonInterface;

// 自定义导入作业重试时间
public function getJobRetryUntil(): ?CarbonInterface
{
    return now()->addHours(12);                  // 12 小时内重试
}
```

你可以在 [Laravel 文档](https://laravel.com/docs/queues#max-job-attempts-and-timeout)中阅读更多关于作业重试的内容。

#### 自定义导入作业退避策略

默认情况下，导入系统将在重试作业之前等待 1 分钟，然后 2 分钟，然后 5 分钟，然后 10 分钟。这是为了防止服务器被反复失败的作业过载。该功能在导入器类的 `getJobBackoff()` 方法中定义：

```php
/**
* @return int | array<int> | null
 */
// 自定义导入作业退避策略
public function getJobBackoff(): int | array | null
{
    return [60, 120, 300, 600];                  // 1分钟、2分钟、5分钟、10分钟
}
```

你可以在 [Laravel 文档](https://laravel.com/docs/queues#dealing-with-failed-jobs)中阅读更多关于作业退避的内容，包括如何配置指数退避。

### 自定义导入作业标签

默认情况下，导入系统将使用导入的 ID 标记每个作业。这是为了让你能够轻松找到与某个导入相关的所有作业。该功能在导入器类的 `getJobTags()` 方法中定义：

```php
// 自定义导入作业标签
public function getJobTags(): array
{
    return ["import{$this->import->getKey()}"];  // 使用导入 ID 作为标签
}
```

如果你想自定义应用于某个导入器的作业的标签，可以在导入器类中重写此方法。

### 自定义导入作业批次名称

默认情况下，导入系统不会为作业批次定义任何名称。如果你想自定义应用于某个导入器的作业批次的名称，可以在导入器类中重写 `getJobBatchName()` 方法：

```php
// 自定义导入作业批次名称
public function getJobBatchName(): ?string
{
    return 'product-import';                    // 批次名称
}
```

## 自定义导入验证消息

导入系统将在导入前自动验证 CSV 文件。如果有任何错误，用户将看到错误列表，导入将不会被处理。如果你想覆盖任何默认验证消息，可以通过重写导入器类中的 `getValidationMessages()` 方法来实现：

```php
// 自定义导入验证消息
public function getValidationMessages(): array
{
    return [
        'name.required' => 'The name column must not be empty.',  // 自定义必填错误消息
    ];
}
```

要了解更多关于自定义验证消息的信息，请阅读 [Laravel 文档](https://laravel.com/docs/validation#customizing-the-error-messages)。

### 自定义导入验证属性

当列验证失败时，它们的标签用于错误消息中。要自定义字段错误消息中使用的标签，请使用 `validationAttribute()` 方法：

```php
use Filament\Actions\Imports\ImportColumn;

// 自定义验证属性名称（用于错误消息）
ImportColumn::make('name')
    ->validationAttribute('full name')           // 使用 "full name" 而非 "name"
```

## 自定义导入文件验证

你可以使用 `fileRules()` 方法为导入文件添加新的 [Laravel 验证规则](https://laravel.com/docs/validation#available-validation-rules)：

```php
use Filament\Actions\ImportAction;
use Illuminate\Validation\Rules\File;

// 自定义导入文件验证规则
ImportAction::make()
    ->importer(ProductImporter::class)
    ->fileRules([
        'max:1024',                              // 文件大小限制 1MB
        // 或者使用 File 规则
        File::types(['csv', 'txt'])->max(1024),  // 只允许 CSV 和 TXT 文件
    ]),
```

除了允许静态值，`fileRules()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

## 生命周期钩子

钩子可用于在导入器生命周期的不同阶段执行代码，例如在记录保存之前。要设置钩子，请在导入器类上创建一个以钩子名称命名的受保护方法：

```php
// 生命周期钩子：保存前执行
protected function beforeSave(): void
{
    // 在数据保存到数据库之前执行
    // ...
}
```

在此示例中，`beforeSave()` 方法中的代码将在 CSV 中经过验证的数据保存到数据库之前调用。

导入器有多个可用的钩子：

```php
use Filament\Actions\Imports\Importer;

class ProductImporter extends Importer
{
    // ...

    protected function beforeValidate(): void
    {
        // 验证前：在行的 CSV 数据验证之前运行
    }

    protected function afterValidate(): void
    {
        // 验证后：在行的 CSV 数据验证之后运行
    }

    protected function beforeFill(): void
    {
        // 填充前：在 CSV 数据填充到模型之前运行
    }

    protected function afterFill(): void
    {
        // 填充后：在 CSV 数据填充到模型之后运行
    }

    protected function beforeSave(): void
    {
        // 保存前：在记录保存到数据库之前运行
    }

    protected function beforeCreate(): void
    {
        // 创建前：类似于 beforeSave()，但仅在创建新记录时运行
    }

    protected function beforeUpdate(): void
    {
        // 更新前：类似于 beforeSave()，但仅在更新现有记录时运行
    }

    protected function afterSave(): void
    {
        // 保存后：在记录保存到数据库之后运行
    }
    
    protected function afterCreate(): void
    {
        // 创建后：类似于 afterSave()，但仅在创建新记录时运行
    }
    
    protected function afterUpdate(): void
    {
        // 更新后：类似于 afterSave()，但仅在更新现有记录时运行
    }
}
```

在这些钩子中，你可以使用 `$this->data` 访问当前行的数据。你还可以使用 `$this->originalData` 访问 CSV 中的原始行数据（在[类型转换](#类型转换)或映射之前）。

当前记录（如果已存在）可通过 `$this->record` 访问，[导入表单选项](#使用导入选项)可通过 `$this->options` 访问。

## 授权

默认情况下，只有启动导入的用户才能访问导入部分失败时生成的失败 CSV 文件。如果你想自定义授权逻辑，可以创建一个 `ImportPolicy` 类，并[在你的 `AuthServiceProvider` 中注册它](https://laravel.com/docs/authorization#registering-policies)：

```php
use App\Policies\ImportPolicy;
use Filament\Actions\Imports\Models\Import;

// 注册导入模型的授权策略
protected $policies = [
    Import::class => ImportPolicy::class,
];
```

策略的 `view()` 方法将用于授权对失败 CSV 文件的访问。

请注意，如果你定义了策略，确保只有启动导入的用户才能访问失败 CSV 文件的现有逻辑将被移除。如果你想保留该逻辑，需要将其添加到你的策略中：

```php
use App\Models\User;
use Filament\Actions\Imports\Models\Import;

// 策略的 view 方法：检查用户是否有权访问失败 CSV
public function view(User $user, Import $import): bool
{
    return $import->user()->is($user);           // 只有启动导入的用户才能访问
}
```

## 安全

### 逐记录授权

导入系统在创建或更新记录时不执行逐记录授权检查。CSV 中的每一行都由导入器的 `resolveRecord()`、`fillRecord()` 和 `saveRecord()` 方法处理，而不会咨询你应用程序的 [Laravel 策略](https://laravel.com/docs/authorization#creating-policies)。这意味着，如果用户被允许触发导入，他们可以创建或更新导入器支持的任何记录，无论他们通常是否被授权通过应用程序 UI 执行此操作。

如果你需要在导入期间进行逐记录授权，应在导入器的[生命周期钩子](#生命周期钩子)中添加检查，例如 `beforeCreate()` 或 `beforeUpdate()`，以针对记录授权当前用户。

:::danger
如果你的应用程序允许不受信任的用户触发导入，你应该实现逐记录授权检查，以防止未经授权的记录创建或修改。
:::

### CSV 公式注入

当导入期间行验证失败时，Filament 会将它们编译成可下载的 CSV 供用户查看。此失败 CSV 包含上传文件中的原始数据，按原样提交，不进行任何转换。如果上传的 CSV 包含以 `=`、`+`、`-` 或 `@` 等字符开头的值，它们将以未更改的形式出现在失败 CSV 中。当在 Microsoft Excel 或 Google Sheets 等电子表格软件中打开时，这些值可能会被解释为公式，如果原始 CSV 由不受信任的来源提供，这可能会带来安全风险。你应该确保用户在查看失败 CSV 时了解此风险，或者在导入器的生命周期钩子中实现清理，以在潜在危险值作为失败行存储之前中和它们。

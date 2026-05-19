---
title: 自定义数据
---

## 简介

[Filament 的表格构建器](overview/#introduction)最初设计用于在 Laravel 应用程序中使用 [Eloquent 模型](https://laravel.com/docs/eloquent)直接从 SQL 数据库渲染数据。Filament 表格中的每一行对应数据库中的一行，由一个 Eloquent 模型实例表示。

然而，这种设置并非总是可行或实用的。你可能需要显示未存储在数据库中的数据——或者存储了但无法通过 Eloquent 访问的数据。

在这种情况下，你可以使用自定义数据。将一个函数传递给表格构建器的 `records()` 方法，该函数返回一个数据数组。此函数在表格渲染时调用，其返回值用于填充表格。

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->records(fn (): array => [
            1 => [
                'title' => 'First item',
                'slug' => 'first-item',
                'is_featured' => true,
            ],
            2 => [
                'title' => 'Second item',
                'slug' => 'second-item',
                'is_featured' => false,
            ],
            3 => [
                'title' => 'Third item',
                'slug' => 'third-item',
                'is_featured' => true,
            ],
        ])
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('slug'),
            IconColumn::make('is_featured')
                ->boolean(),
        ]);
}
```

:::warning
数组键（例如 1、2、3）代表记录 ID。使用唯一且一致的键以确保正确的差异比较和状态跟踪。这有助于防止在 Livewire 交互和更新期间出现记录完整性问题。
:::

## 列

表格中的[列](columns)与使用 [Eloquent 模型](https://laravel.com/docs/eloquent)时的工作方式类似，但有一个关键区别：列名表示 `records()` 函数返回的数组中的键，而不是模型属性或关联关系。

在列函数中使用当前记录时，将 `$record` 类型设置为 `array` 而不是 `Model`。例如，要使用 [`state()`](columns#setting-the-state-of-a-column) 函数定义列，你可以这样做：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('is_featured')
    ->state(function (array $record): string {
        return $record['is_featured'] ? 'Featured' : 'Not featured';
    })
```

### 排序

Filament 的内置[排序](columns#sorting)功能使用 SQL 对数据进行排序。使用自定义数据时，你需要自己处理排序。

要访问当前排序的列和方向，你可以将 `$sortColumn` 和 `$sortDirection` 注入到 `records()` 函数中。如果没有应用排序，这些变量为 `null`。

在下面的示例中，使用[集合](https://laravel.com/docs/collections#method-sortby)按键对数据进行排序。这里返回的是集合而不是数组；Filament 会以相同方式处理二者。不过，使用此功能并不要求你必须使用集合。

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Collection;

public function table(Table $table): Table
{
    return $table
        ->records(
            fn (?string $sortColumn, ?string $sortDirection): Collection => collect([
                1 => ['title' => 'First item'],
                2 => ['title' => 'Second item'],
                3 => ['title' => 'Third item'],
            ])->when(
                filled($sortColumn),
                fn (Collection $data): Collection => $data->sortBy(
                    $sortColumn,
                    SORT_REGULAR,
                    $sortDirection === 'desc',
                ),
            )
        )
        ->columns([
            TextColumn::make('title')
                ->sortable(),
        ]);
}
```

:::info
看起来 Filament 应该为你排序数据，但在许多情况下，最好让你的数据源（如自定义查询或 API 调用）来处理排序。
:::

### 搜索

Filament 的内置[搜索](columns#searching)功能使用 SQL 搜索数据。使用自定义数据时，你需要自己处理搜索。

要访问当前搜索查询，你可以将 `$search` 注入到 `records()` 函数中。如果没有正在使用的搜索查询，此变量为 `null`。

在下面的示例中，使用[集合](https://laravel.com/docs/collections#method-filter)按搜索查询过滤数据。这里返回的是集合而不是数组；Filament 会以相同方式处理二者。不过，使用此功能并不要求你必须使用集合。

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

public function table(Table $table): Table
{
    return $table
        ->records(
            fn (?string $search): Collection => collect([
                1 => ['title' => 'First item'],
                2 => ['title' => 'Second item'],
                3 => ['title' => 'Third item'],
            ])->when(
                filled($search),
                fn (Collection $data): Collection => $data->filter(
                    fn (array $record): bool => str_contains(
                        Str::lower($record['title']),
                        Str::lower($search),
                    ),
                ),
            )
        )
        ->columns([
            TextColumn::make('title'),
        ])
        ->searchable();
}
```

在此示例中，像 `title` 这样的特定列不需要设置 `searchable()`，因为搜索逻辑在 `records()` 函数内处理。但是，如果你想在不为特定列启用搜索的情况下启用搜索字段，可以在整个表格上使用 `searchable()` 方法。

:::info
看起来 Filament 应该为你搜索数据，但在许多情况下，最好让你的数据源（如自定义查询或 API 调用）来处理搜索。
:::

#### 搜索单个列

[单个列搜索](#searching-individually)功能提供了一种为每列单独渲染搜索字段的方式，允许更精确的过滤。使用自定义数据时，你需要自己实现此功能。

你可以将 `$columnSearches` 数组注入到 `records()` 函数中，而不是注入 `$search`，该数组包含每列的搜索查询。

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

public function table(Table $table): Table
{
    return $table
        ->records(
            fn (array $columnSearches): Collection => collect([
                1 => ['title' => 'First item'],
                2 => ['title' => 'Second item'],
                3 => ['title' => 'Third item'],
            ])->when(
                filled($columnSearches['title'] ?? null),
                fn (Collection $data) => $data->filter(
                    fn (array $record): bool => str_contains(
                        Str::lower($record['title']),
                        Str::lower($columnSearches['title'])
                    ),
                ),
            )
        )
        ->columns([
            TextColumn::make('title')
                ->searchable(isIndividual: true),
        ]);
}
```

:::info
看起来 Filament 应该为你搜索数据，但在许多情况下，最好让你的数据源（如自定义查询或 API 调用）来处理搜索。
:::

## 过滤器

Filament 还提供了一种使用[过滤器](filters)过滤数据的方式。使用自定义数据时，你需要自己处理过滤。

Filament 通过将 `$filters` 注入到 `records()` 函数中，让你访问过滤器数据数组。该数组包含过滤器名称作为键，以及过滤器表单本身的值。

在下面的示例中，使用[集合](https://laravel.com/docs/collections#method-where)过滤数据。这里返回的是集合而不是数组；Filament 会以相同方式处理二者。不过，使用此功能并不要求你必须使用集合。

```php
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Collection;

public function table(Table $table): Table
{
    return $table
        ->records(fn (array $filters): Collection => collect([
            1 => [
                'title' => 'What is Filament?',
                'slug' => 'what-is-filament',
                'author' => 'Dan Harrin',
                'is_featured' => true,
                'creation_date' => '2021-01-01',
            ],
            2 => [
                'title' => 'Top 5 best features of Filament',
                'slug' => 'top-5-features',
                'author' => 'Ryan Chandler',
                'is_featured' => false,
                'creation_date' => '2021-03-01',
            ],
            3 => [
                'title' => 'Tips for building a great Filament plugin',
                'slug' => 'plugin-tips',
                'author' => 'Zep Fietje',
                'is_featured' => true,
                'creation_date' => '2023-06-01',
            ],
        ])
            ->when(
                $filters['is_featured']['isActive'] ?? false,
                fn (Collection $data): Collection => $data->where(
                    'is_featured', true
                ),
            )
            ->when(
                filled($author = $filters['author']['value'] ?? null),
                fn (Collection $data): Collection => $data->where(
                    'author', $author
                ),
            )
            ->when(
                filled($date = $filters['creation_date']['date'] ?? null),
                fn (Collection $data): Collection => $data->where(
                    'creation_date', $date
                ),
            )
        )
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('slug'),
            IconColumn::make('is_featured')
                ->boolean(),
            TextColumn::make('author'),
        ])
        ->filters([
            Filter::make('is_featured'),
            SelectFilter::make('author')
                ->options([
                    'Dan Harrin' => 'Dan Harrin',
                    'Ryan Chandler' => 'Ryan Chandler',
                    'Zep Fietje' => 'Zep Fietje',
                ]),
            Filter::make('creation_date')
                ->schema([
                    DatePicker::make('date'),
                ]),
        ]);
}
```

过滤器值不能直接通过 `$filters['filterName']` 访问。相反，每个过滤器包含一个或多个表单字段，这些字段名称用作过滤器数据数组中的键。例如：

- 没有自定义模式的[复选框](filters/overview#introduction)或[开关过滤器](filters/overview#using-a-toggle-button-instead-of-a-checkbox)（例如 featured）使用 `isActive` 作为键：`$filters['featured']['isActive']`

- [选择过滤器](filters/select#introduction)（例如 author）使用 `value`：`$filters['author']['value']`

- [自定义模式过滤器](filters/custom#custom-filter-schemas)（例如 creation_date）使用实际的表单字段名称。如果字段名为 `date`，则这样访问：`$filters['creation_date']['date']`

:::info
看起来 Filament 应该为你过滤数据，但在许多情况下，最好让你的数据源（如自定义查询或 API 调用）来处理过滤。
:::

## 分页

Filament 的内置[分页](overview#pagination)功能使用 SQL 对数据进行分页。使用自定义数据时，你需要自己处理分页。

`$page` 和 `$recordsPerPage` 参数被注入到 `records()` 函数中，你可以使用它们对数据进行分页。`records()` 函数应返回一个 `LengthAwarePaginator`，Filament 将为你处理分页链接和其他分页功能：

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

public function table(Table $table): Table
{
    return $table
        ->records(function (int $page, int $recordsPerPage): LengthAwarePaginator {
            $records = collect([
                1 => ['title' => 'What is Filament?'],
                2 => ['title' => 'Top 5 best features of Filament'],
                3 => ['title' => 'Tips for building a great Filament plugin'],
            ])->forPage($page, $recordsPerPage);

            return new LengthAwarePaginator(
                $records,
                total: 30, // 所有页面的总记录数
                perPage: $recordsPerPage,
                currentPage: $page,
            );
        })
        ->columns([
            TextColumn::make('title'),
        ]);
}
```

在此示例中，使用 `forPage()` 方法对数据进行分页。这可能不是从查询或 API 分页数据的最有效方式，但它是演示如何从自定义数组分页数据的简单方式。

:::info
看起来 Filament 应该为你分页数据，但在许多情况下，最好让你的数据源（如自定义查询或 API 调用）来处理分页。
:::

:::warning
如果你在一个页面上有多个自定义表格，并且使用 `queryStringIdentifier('customIdentifier')` 方法来区分它们，你需要在 `LengthAwarePaginator` 中添加一个 `options` 参数，其中包含 `pageName`，例如 `options: ['pageName' => 'customIdentifierPage']`。请注意，在此处需要将 `Page` 后缀添加到你的自定义标识符中。
:::

## 操作

表格中的[操作](actions)与使用 [Eloquent 模型](https://laravel.com/docs/eloquent)时的工作方式类似。唯一的区别是操作回调函数中的 `$record` 参数将是 `array` 而不是 `Model`。

```php
use Filament\Actions\Action;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Collection;

public function table(Table $table): Table
{
    return $table
        ->records(fn (): Collection => collect([
            1 => [
                'title' => 'What is Filament?',
                'slug' => 'what-is-filament',
            ],
            2 => [
                'title' => 'Top 5 best features of Filament',
                'slug' => 'top-5-features',
            ],
            3 => [
                'title' => 'Tips for building a great Filament plugin',
                'slug' => 'plugin-tips',
            ],
        ]))
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('slug'),
        ])
        ->recordActions([
            Action::make('view')
                ->color('gray')
                ->icon(Heroicon::Eye)
                ->url(fn (array $record): string => route('posts.view', $record['slug'])),
        ]);
}
```

:::warning
使用自定义数据时，操作执行后表格数据不会自动刷新。如果你有一个更改当前分页页面中表格记录状态的操作，应在操作函数中调用 `$this->resetTable()`。
:::

### 批量操作

对于与单个记录交互的操作，记录始终在当前表格页面上，因此可以使用 `records()` 方法来获取数据。然而对于批量操作，记录可以跨分页页面选择。如果你想使用跨页面选择记录的批量操作，你需要给 Filament 一种跨页面获取记录的方式，否则它将只返回当前页面的记录。`resolveSelectedRecordsUsing()` 方法应接受一个具有 `$keys` 参数的函数，并返回记录数据数组：

```php
use Filament\Actions\BulkAction;
use Filament\Tables\Table;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

public function table(Table $table): Table
{
    return $table
        ->records(function (): array {
            // ...
        })
        ->resolveSelectedRecordsUsing(function (array $keys): array {
            return Arr::only([
                1 => [
                    'title' => 'First item',
                    'slug' => 'first-item',
                    'is_featured' => true,
                ],
                2 => [
                    'title' => 'Second item',
                    'slug' => 'second-item',
                    'is_featured' => false,
                ],
                3 => [
                    'title' => 'Third item',
                    'slug' => 'third-item',
                    'is_featured' => true,
                ],
            ], $keys);
        })
        ->columns([
            // ...
        ])
        ->toolbarActions([
            BulkAction::make('feature')
                ->requiresConfirmation()
                ->action(function (Collection $records): void {
                    // 对 `$records` 数据集合执行某些操作
                }),
        ]);
}
```

然而，如果你的用户使用"全选"按钮选择跨分页页面的所有记录，Filament 将在内部切换到跟踪*取消选择*的记录而不是选择的记录。这是在非常大数据集中的高效机制。你可以向 `resolveSelectedRecordsUsing()` 方法注入两个额外参数来处理这种情况：`$isTrackingDeselectedKeys` 和 `$deselectedKeys`。

`$isTrackingDeselectedKeys` 是一个布尔值，指示用户是否正在跟踪取消选择的键。如果为 `true`，`$deselectedKeys` 将包含当前取消选择的记录的键。你可以使用此信息从 `resolveSelectedRecordsUsing()` 方法返回的记录数组中过滤掉取消选择的记录：

```php
use Filament\Actions\BulkAction;
use Filament\Tables\Table;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

public function table(Table $table): Table
{
    return $table
        ->records(function (): array {
            // ...
        })
        ->resolveSelectedRecordsUsing(function (
            array $keys,
            bool $isTrackingDeselectedKeys,
            array $deselectedKeys
        ): array {
            $records = [
                1 => [
                    'title' => 'First item',
                    'slug' => 'first-item',
                    'is_featured' => true,
                ],
                2 => [
                    'title' => 'Second item',
                    'slug' => 'second-item',
                    'is_featured' => false,
                ],
                3 => [
                    'title' => 'Third item',
                    'slug' => 'third-item',
                    'is_featured' => true,
                ],
            ];

            if ($isTrackingDeselectedKeys) {
                return Arr::except(
                    $records,
                    $deselectedKeys,
                );
            }

            return Arr::only(
                $records,
                $keys,
            );
        })
        ->columns([
            // ...
        ])
        ->toolbarActions([
            BulkAction::make('feature')
                ->requiresConfirmation()
                ->action(function (Collection $records): void {
                    // 对 `$records` 数据集合执行某些操作
                }),
        ]);
}
```

## 使用外部 API 作为表格数据源

[Filament 的表格构建器](overview/#introduction)允许你使用从任何外部源获取的数据填充表格——而不仅仅是 [Eloquent 模型](https://laravel.com/docs/eloquent)。当你想显示来自 REST API 或第三方服务的数据时，这特别有用。

### 从外部 API 获取数据

下面的示例演示了如何使用 [DummyJSON](https://dummyjson.com)（一个用于占位符 JSON 的免费假 REST API）获取数据，并在 [Filament 表格](overview/#introduction)中显示它：

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Http;

public function table(Table $table): Table
{
    return $table
        ->records(fn (): array => Http::baseUrl('https://dummyjson.com')
            ->get('products')
            ->collect()
            ->get('products', [])
        )
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('category'),
            TextColumn::make('price')
                ->money(),
        ]);
}
```

`get('products')` 向 [`https://dummyjson.com/products`](https://dummyjson.com/products) 发送 `GET` 请求。`collect()` 方法将 JSON 响应转换为 [Laravel 集合](https://laravel.com/docs/collections#main-content)。最后，`get('products', [])` 从响应中获取产品数组。如果键缺失，它会安全地返回空数组。

:::warning
这是一个仅供演示的基本示例。在使用 API 时，开发者有责任实现适当的身份验证、授权、验证、错误处理、速率限制和其他最佳实践。
:::

:::info
DummyJSON 默认返回 30 个项目。你可以使用 [limit 和 skip](#external-api-pagination) 查询参数来分页所有项目，或使用 [`limit=0`](https://dummyjson.com/docs/products#products-limit_skip) 获取所有项目。
:::

#### 使用 API 数据设置列的状态

[列](#columns)映射到 `records()` 函数返回的数组键。

在列函数中使用当前记录时，将 `$record` 类型设置为 `array` 而不是 `Model`。例如，要使用 [`state()`](columns/overview#setting-the-state-of-a-column) 函数定义列，你可以这样做：

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\Str;

TextColumn::make('category_brand')
    ->label('Category - Brand')
    ->state(function (array $record): string {
        $category = Str::headline($record['category']);
        $brand = Str::title($record['brand'] ?? 'Unknown');

        return "{$category} - {$brand}";
    })
```

:::tip
你可以使用 [`formatStateUsing()`](columns/text#formatting) 方法来格式化文本列的状态，而不改变状态本身。
:::

### 外部 API 排序

即使使用外部 API 作为数据源，你也可以在[列](columns)中启用[排序](columns#sorting)。下面的示例演示了如何将排序参数（`sort_column` 和 `sort_direction`）传递给 [DummyJSON](https://dummyjson.com/docs/products#products-sort) API 以及 API 如何处理它们。

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Http;

public function table(Table $table): Table
{
    return $table
        ->records(function (?string $sortColumn, ?string $sortDirection): array {
            $response = Http::baseUrl('https://dummyjson.com/')
                ->get('products', [
                    'sortBy' => $sortColumn,
                    'order' => $sortDirection,
                ]);

            return $response
                ->collect()
                ->get('products', []);
        })
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('category')
                ->sortable(),
            TextColumn::make('price')
                ->money(),
        ]);
}
```

`get('products')` 向 [`https://dummyjson.com/products`](https://dummyjson.com/products) 发送 `GET` 请求。请求包含两个参数：`sortBy`（指定按哪列排序，例如 category）和 `order`（指定排序方向，例如 asc 或 desc）。`collect()` 方法将 JSON 响应转换为 [Laravel 集合](https://laravel.com/docs/collections#main-content)。最后，`get('products', [])` 从响应中获取产品数组。如果键缺失，它会安全地返回空数组。

:::warning
这是一个仅供演示的基本示例。在使用 API 时，开发者有责任实现适当的身份验证、授权、验证、错误处理、速率限制和其他最佳实践。
:::

:::info
DummyJSON 默认返回 30 个项目。你可以使用 [limit 和 skip](#external-api-pagination) 查询参数来分页所有项目，或使用 [`limit=0`](https://dummyjson.com/docs/products#products-limit_skip) 获取所有项目。
:::

### 外部 API 搜索

即使使用外部 API 作为数据源，你也可以在[列](columns)中启用[搜索](columns#searching)。下面的示例演示了如何将 `search` 参数传递给 [DummyJSON](https://dummyjson.com/docs/products#products-search) API 以及 API 如何处理它。

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Http;

public function table(Table $table): Table
{
    return $table
        ->records(function (?string $search): array {
            $response = Http::baseUrl('https://dummyjson.com/')
                ->get('products/search', [
                    'q' => $search,
                ]);

            return $response
                ->collect()
                ->get('products', []);
        })
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('category'),
            TextColumn::make('price')
                ->money(),
        ])
        ->searchable();
}
```

`get('products/search')` 向 [`https://dummyjson.com/products/search`](https://dummyjson.com/products/search) 发送 `GET` 请求。请求包含 `q` 参数，用于根据搜索查询过滤结果。`collect()` 方法将 JSON 响应转换为 [Laravel 集合](https://laravel.com/docs/collections#main-content)。最后，`get('products', [])` 从响应中获取产品数组。如果键缺失，它会安全地返回空数组。

:::warning
这是一个仅供演示的基本示例。在使用 API 时，开发者有责任实现适当的身份验证、授权、验证、错误处理、速率限制和其他最佳实践。
:::

:::info
DummyJSON 默认返回 30 个项目。你可以使用 [limit 和 skip](#external-api-pagination) 查询参数来分页所有项目，或使用 [`limit=0`](https://dummyjson.com/docs/products#products-limit_skip) 获取所有项目。
:::

### 外部 API 过滤

即使使用外部 API 作为数据源，你也可以在表格中启用[过滤](filters)。下面的示例演示了如何将 `filter` 参数传递给 [DummyJSON](https://dummyjson.com/docs/products#products-search) API 以及 API 如何处理它。

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

public function table(Table $table): Table
{
    return $table
        ->records(function (array $filters): array {
            $category = $filters['category']['value'] ?? null;

            $endpoint = filled($category)
                ? "products/category/{$category}"
                : 'products';

            $response = Http::baseUrl('https://dummyjson.com/')
                ->get($endpoint);

            return $response
                ->collect()
                ->get('products', []);
        })
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('category'),
            TextColumn::make('price')
                ->money(),
        ])
        ->filters([
            SelectFilter::make('category')
                ->label('Category')
                ->options(fn (): Collection => Http::baseUrl('https://dummyjson.com/')
                    ->get('products/categories')
                    ->collect()
                    ->pluck('name', 'slug')
                ),
        ]);
}
```

如果选择了类别过滤器，请求将发送到 `/products/category/{category}`；否则，默认发送到 `/products`。`get()` 方法向适当的端点发送 `GET` 请求。`collect()` 方法将 JSON 响应转换为 [Laravel 集合](https://laravel.com/docs/collections#main-content)。最后，`get('products', [])` 从响应中获取产品数组。如果键缺失，它会安全地返回空数组。

:::warning
这是一个仅供演示的基本示例。在使用 API 时，开发者有责任实现适当的身份验证、授权、验证、错误处理、速率限制和其他最佳实践。
:::

:::info
DummyJSON 默认返回 30 个项目。你可以使用 [limit 和 skip](#external-api-pagination) 查询参数来分页所有项目，或使用 [`limit=0`](https://dummyjson.com/docs/products#products-limit_skip) 获取所有项目。
:::

### 外部 API 分页

使用外部 API 作为表格数据源时，你可以启用[分页](overview#pagination)。Filament 将当前页面和每页记录数传递给你的 `records()` 函数。下面的示例演示了如何手动构建 `LengthAwarePaginator` 并从 [DummyJSON](https://dummyjson.com/docs/products#products-limit_skip) API 获取分页数据，该 API 使用 `limit` 和 `skip` 参数进行分页：

```php
public function table(Table $table): Table
{
    return $table
        ->records(function (int $page, int $recordsPerPage): LengthAwarePaginator {
            $skip = ($page - 1) * $recordsPerPage;

            $response = Http::baseUrl('https://dummyjson.com')
                ->get('products', [
                    'limit' => $recordsPerPage,
                    'skip' => $skip,
                ])
                ->collect();

            return new LengthAwarePaginator(
                items: $response['products'],
                total: $response['total'],
                perPage: $recordsPerPage,
                currentPage: $page
            );
        })
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('category'),
            TextColumn::make('price')
                ->money(),
        ]);
}
```

`$page` 和 `$recordsPerPage` 由 Filament 根据当前分页状态自动注入。
计算出的 `skip` 值告诉 API 在返回当前页面结果之前跳过多少条记录。
响应包含 `products`（分页项目）和 `total`（可用项目总数）。
这些值被传递给 `LengthAwarePaginator`，Filament 使用它来正确渲染分页控件。

:::warning
这是一个仅供演示的基本示例。在使用 API 时，开发者有责任实现适当的身份验证、授权、验证、错误处理、速率限制和其他最佳实践。
:::

### 外部 API 操作

在使用外部 API 的表格中使用[操作](../actions/overview)时，过程与使用 [Eloquent 模型](https://laravel.com/docs/eloquent)几乎相同。主要区别是操作回调函数中的 `$record` 参数将是 `array` 而不是 `Model` 实例。

Filament 提供了多种[内置操作](../actions/overview#available-actions)，你可以在应用程序中使用。但是，你不限于这些。你可以创建针对应用程序需求的[自定义操作](../actions/overview#introduction)。

下面的示例演示了如何使用 [DummyJSON](https://dummyjson.com) 作为模拟 API 源来创建和使用外部 API 的操作。

#### 外部 API 创建操作示例

此示例中的创建操作提供了一个[模态框表单](../actions/modals#rendering-a-form-in-a-modal)，允许用户使用外部 API 创建新产品。当表单提交时，会向 API 发送 `POST` 请求以创建新产品。

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

public function table(Table $table): Table
{
    $baseUrl = 'https://dummyjson.com';

    return $table
        ->records(fn (): array => Http::baseUrl($baseUrl)
            ->get('products')
            ->collect()
            ->get('products', [])
        )
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('category'),
        ])
        ->headerActions([
            Action::make('create')
                ->modalHeading('Create product')
                ->schema([
                    TextInput::make('title')
                        ->required(),
                    Select::make('category')
                        ->options(fn (): Collection => Http::get("{$baseUrl}/products/categories")
                            ->collect()
                            ->pluck('name', 'slug')
                        )
                        ->required(),
                ])
                ->action(function (array $data) use ($baseUrl) {
                    $response = Http::post("{$baseUrl}/products/add", [
                        'title' => $data['title'],
                        'category' => $data['category'],
                    ]);

                    if ($response->failed()) {
                        Notification::make()
                            ->title('Product failed to create')
                            ->danger()
                            ->send();

                        return;
                    }

                    Notification::make()
                        ->title('Product created')
                        ->success()
                        ->send();
                }),
        ]);
}
```

- [`modalHeading()`](../actions/modals#customizing-the-modals-heading-description-and-submit-action-label) 设置操作触发时出现的模态框标题。
- [`schema()`](../actions/modals#rendering-a-schema-in-a-modal) 定义模态框中显示的表单字段。
- `action()` 定义用户提交表单时将执行的逻辑。

:::warning
这是一个仅供演示的基本示例。在使用 API 时，开发者有责任实现适当的身份验证、授权、验证、错误处理、速率限制和其他最佳实践。
:::

:::warning
[`DummyJSON`](https://dummyjson.com/docs/products#products-update) API 不会将其添加到服务器中。它将模拟 `POST` 请求，并返回带有新 ID 的新创建产品。
:::

如果你不需要模态框，可以在用户点击创建操作按钮时直接将其重定向到指定 URL。在这种情况下，你可以定义一个指向产品创建页面的自定义 URL：

```php
use Filament\Actions\Action;

Action::make('create')
    ->url(route('products.create'))
```

#### 外部 API 编辑操作示例

此示例中的编辑操作提供了一个[模态框表单](../actions/modals#rendering-a-form-in-a-modal)，用于编辑从外部 API 获取的产品详情。用户可以更新产品标题和类别等字段，更改将使用 `PUT` 请求发送到外部 API。

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

public function table(Table $table): Table
{
    $baseUrl = 'https://dummyjson.com';

    return $table
        ->records(fn (): array => Http::baseUrl($baseUrl)
            ->get('products')
            ->collect()
            ->get('products', [])
        )
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('category'),
        ])
        ->recordActions([
            Action::make('edit')
                ->icon(Heroicon::PencilSquare)
                ->modalHeading('Edit product')
                ->fillForm(fn (array $record) => $record)
                ->schema([
                    TextInput::make('title')
                        ->required(),
                    Select::make('category')
                        ->options(fn (): Collection => Http::get("{$baseUrl}/products/categories")
                            ->collect()
                            ->pluck('name', 'slug')
                        )
                        ->required(),
                ])
                ->action(function (array $data, array $record) use ($baseUrl) {
                    $response = Http::put("{$baseUrl}/products/{$record['id']}", [
                        'title' => $data['title'],
                        'category' => $data['category'],
                    ]);

                    if ($response->failed()) {
                        Notification::make()
                            ->title('Product failed to save')
                            ->danger()
                            ->send();

                        return;
                    }

                    Notification::make()
                        ->title('Product save')
                        ->success()
                        ->send();
                }),
        ]);
}
```

- `icon()` 定义表格中此操作显示的图标。
- [`modalHeading()`](../actions/modals#customizing-the-modals-heading-description-and-submit-action-label) 设置操作触发时出现的模态框标题。
- [`fillForm()`](../actions/modals#filling-the-form-with-existing-data) 自动使用所选记录的现有值填充表单字段。
- [`schema()`](../actions/modals#rendering-a-schema-in-a-modal) 定义模态框中显示的表单字段。
- `action()` 定义用户提交表单时将执行的逻辑。

:::warning
这是一个仅供演示的基本示例。在使用 API 时，开发者有责任实现适当的身份验证、授权、验证、错误处理、速率限制和其他最佳实践。
:::

:::warning
[`DummyJSON`](https://dummyjson.com/docs/products#products-update) API 不会在服务器中更新它。它将模拟 `PUT`/`PATCH` 请求，并返回带有修改数据的更新产品。
:::

如果你不需要模态框，可以在用户点击操作按钮时直接将其重定向到指定 URL。你可以通过定义一个包含 `record` 参数的动态路由的 URL 来实现：

```php
use Filament\Actions\Action;

Action::make('edit')
    ->url(fn (array $record): string => route('products.edit', ['product' => $record['id']]))
```

#### 外部 API 查看操作示例

此示例中的查看操作打开一个[模态框](../actions/modals)，显示从外部 API 获取的详细产品信息。这允许你使用各种组件（如[文本条目](../infolists/text-entry)和[图片](../infolists/image-entry)）构建用户界面。

```php
use Filament\Actions\Action;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Flex;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Http;

public function table(Table $table): Table
{
    $baseUrl = 'https://dummyjson.com';

    return $table
        ->records(fn (): array => Http::baseUrl($baseUrl)
            ->get('products', [
                'select' => 'id,title,description,brand,category,thumbnail,price',
            ])
            ->collect()
            ->get('products', [])
        )
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('category'),
        ])
        ->recordActions([
            Action::make('view')
                ->color('gray')
                ->icon(Heroicon::Eye)
                ->modalHeading('View product')
                ->schema([
                    Section::make()
                        ->schema([
                            Flex::make([
                                Grid::make(2)
                                    ->schema([
                                        TextEntry::make('title'),
                                        TextEntry::make('category'),
                                        TextEntry::make('brand'),
                                        TextEntry::make('price')
                                            ->money(),
                                    ]),
                                ImageEntry::make('thumbnail')
                                    ->hiddenLabel()
                                    ->grow(false),
                            ])->from('md'),
                            TextEntry::make('description')
                                ->prose(),
                        ]),
                ])
                ->modalSubmitAction(false)
                ->modalCancelActionLabel('Close'),
        ]);
}
```

- `color()` 设置操作按钮的颜色。
- `icon()` 定义表格中此操作显示的图标。
- [`modalHeading()`](../actions/modals#customizing-the-modals-heading-description-and-submit-action-label) 设置操作触发时出现的模态框标题。
- [`schema()`](../actions/modals#rendering-a-schema-in-a-modal) 定义模态框中显示的表单字段。
- [`modalSubmitAction(false)`](../actions/modals#modifying-the-default-modal-footer-action-button) 禁用提交按钮，使其成为只读查看操作。
- [`modalCancelActionLabel()`](../actions/modals#modifying-the-default-modal-footer-action-button) 自定义关闭按钮的标签。

:::warning
这是一个仅供演示的基本示例。在使用 API 时，开发者有责任实现适当的身份验证、授权、验证、错误处理、速率限制和其他最佳实践。
:::

:::info
[`select`](https://dummyjson.com/docs/products#products-limit_skip) 参数用于限制 API 返回的字段。这有助于减少负载大小并提高渲染表格时的性能。
:::

如果你不需要模态框，可以在用户点击操作按钮时直接将其重定向到指定 URL。你可以通过定义一个包含 `record` 参数的动态路由的 URL 来实现：

```php
use Filament\Actions\Action;

Action::make('view')
    ->url(fn (array $record): string => route('products.view', ['product' => $record['id']]))
```

#### 外部 API 删除操作示例

此示例中的删除操作允许用户删除从外部 API 获取的产品。

```php
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Http;

public function table(Table $table): Table
{
    $baseUrl = 'https://dummyjson.com';

    return $table
        ->records(fn (): array => Http::baseUrl($baseUrl)
            ->get('products')
            ->collect()
            ->get('products', [])
        )
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('category'),
            TextColumn::make('price')
                ->money(),
        ])
        ->recordActions([
            Action::make('delete')
                ->color('danger')
                ->icon(Heroicon::Trash)
                ->modalIcon(Heroicon::OutlinedTrash)
                ->modalHeading('Delete Product')
                ->requiresConfirmation()
                ->action(function (array $record) use ($baseUrl) {
                    $response = Http::baseUrl($baseUrl)
                        ->delete("products/{$record['id']}");

                    if ($response->failed()) {
                        Notification::make()
                            ->title('Product failed to delete')
                            ->danger()
                            ->send();

                        return;
                    }

                    Notification::make()
                        ->title('Product deleted')
                        ->success()
                        ->send();
                }),
        ]);
}
```

- `color()` 设置操作按钮的颜色。
- `icon()` 定义表格中此操作显示的图标。
- [`modalIcon()`](../actions/modals#adding-an-icon-inside-the-modal) 设置确认模态框中显示的图标。
- [`modalHeading()`](../actions/modals#customizing-the-modals-heading-description-and-submit-action-label) 设置操作触发时出现的模态框标题。
- [`requiresConfirmation()`](../actions/modals#confirmation-modals) 确保用户必须在执行前确认删除。
- `action()` 定义用户确认提交时将执行的逻辑。

:::warning
这是一个仅供演示的基本示例。在使用 API 时，开发者有责任实现适当的身份验证、授权、验证、错误处理、速率限制和其他最佳实践。
:::

:::warning
[`DummyJSON`](https://dummyjson.com/docs/products#products-update) API 不会在服务器中删除它。它将模拟 `DELETE` 请求，并返回带有 `isDeleted` 和 `deletedOn` 键的已删除产品。
:::

### 外部 API 完整示例

此示例演示了在使用外部 API 作为数据源时如何组合[排序](#external-api-sorting)、[搜索](#external-api-searching)、[类别过滤](#external-api-filtering)和[分页](#external-api-pagination)。此处使用的 API 是 [DummyJSON](https://dummyjson.com)，它单独支持这些功能，但**不允许在单个请求中组合所有这些功能**。这是因为每个功能使用不同的端点：

- [搜索](#external-api-searching)通过 `/products/search` 端点使用 `q` 参数执行。
- [类别过滤](#external-api-filtering)使用 `/products/category/{category}` 端点。
- [排序](#external-api-sorting)通过向 `/products` 端点发送 `sortBy` 和 `order` 参数来处理。

唯一可以与上述每个功能组合的功能是[分页](#external-api-pagination)，因为 `limit` 和 `skip` 参数在所有三个端点中都受支持。

```php
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

public function table(Table $table): Table
{
    $baseUrl = 'https://dummyjson.com/';

    return $table
        ->records(function (
            ?string $sortColumn,
            ?string $sortDirection,
            ?string $search,
            array $filters,
            int $page,
            int $recordsPerPage
        ) use ($baseUrl): LengthAwarePaginator {
            // 从过滤器中获取选定的类别（如果有）
            $category = $filters['category']['value'] ?? null;

            // 根据搜索或过滤选择端点
            $endpoint = match (true) {
                filled($search) => 'products/search',
                filled($category) => "products/category/{$category}",
                default => 'products',
            };

            // 确定跳过偏移量
            $skip = ($page - 1) * $recordsPerPage;

            // 所有请求的基本查询参数
            $params = [
                'limit' => $recordsPerPage,
                'skip' => $skip,
                'select' => 'id,title,brand,category,thumbnail,price,sku,stock',
            ];

            // 如果适用，添加搜索查询
            if (filled($search)) {
                $params['q'] = $search;
            }

            // 添加排序参数
            if ($endpoint === 'products' && $sortColumn) {
                $params['sortBy'] = $sortColumn;
                $params['order'] = $sortDirection ?? 'asc';
            }

            $response = Http::baseUrl($baseUrl)
                ->get($endpoint, $params)
                ->collect();

            return new LengthAwarePaginator(
                items: $response['products'],
                total: $response['total'],
                perPage: $recordsPerPage,
                currentPage: $page
            );
        })
        ->columns([
            ImageColumn::make('thumbnail')
                ->label('Image'),
            TextColumn::make('title')
                ->sortable(),
            TextColumn::make('brand')
                ->state(fn (array $record): string => Str::title($record['brand'] ?? 'Unknown')),
            TextColumn::make('category')
                ->formatStateUsing(fn (string $state): string => Str::headline($state)),
            TextColumn::make('price')
                ->money(),
            TextColumn::make('sku')
                ->label('SKU'),
            TextColumn::make('stock')
                ->label('Stock')
                ->sortable(),
        ])
        ->filters([
            SelectFilter::make('category')
                ->label('Category')
                ->options(fn (): Collection => Http::baseUrl($baseUrl)
                    ->get('products/categories')
                    ->collect()
                    ->pluck('name', 'slug')
                ),
        ])
        ->searchable();
}
```

:::warning
这是一个仅供演示的基本示例。在使用 API 时，开发者有责任实现适当的身份验证、授权、验证、错误处理、速率限制和其他最佳实践。
:::

:::warning
[DummyJSON](https://dummyjson.com) API 不支持在单个请求中组合排序、搜索和类别过滤。
:::

:::info
[`select`](https://dummyjson.com/docs/products#products-limit_skip) 参数用于限制 API 返回的字段。这有助于减少负载大小并提高渲染表格时的性能。
:::

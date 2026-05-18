---
title: 代码质量建议
---

## 使用 schema 和 table 类

由于许多 Filament 方法在一个方法中同时定义了应用的 UI 和功能，因此很容易产生庞大的方法和文件。即使你的代码具有清晰一致的风格，这些代码也可能难以阅读。

Filament 通过在生成资源时提供专用的 schema 和 table 类来尝试缓解这个问题。这些类有一个 `configure()` 方法，接受一个 `$schema` 或 `$table` 参数。然后你可以在任何需要定义 schema 或 table 的地方调用 `configure()` 方法。

例如，如果你有以下 `app/Filament/Resources/Customers/Schemas/CustomerForm.php` 文件：

```php
namespace App\Filament\Resources\Customers\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CustomerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name'),
                // ...
            ]);
    }
}
```

你可以在资源的 `form()` 方法中使用它：

```php
use App\Filament\Resources\Customers\Schemas\CustomerForm;
use Filament\Schemas\Schema;

public static function form(Schema $schema): Schema
{
    return CustomerForm::configure($schema);
}
```

你可以对 `table()` 做同样的操作：

```php
use App\Filament\Resources\Customers\Schemas\CustomersTable;
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return CustomersTable::configure($table);
}
```

或者 `infolist()`：

```php
use App\Filament\Resources\Customers\Schemas\CustomerInfolist;
use Filament\Schemas\Schema;

public static function infolist(Schema $schema): Schema
{
    return CustomerInfolist::configure($schema);
}
```

这些 schema 和 table 类默认故意没有父类或接口。如果 Filament 强制为 `configure()` 方法定义方法签名，你就无法向该方法传递自定义配置变量，而这在你希望在多处重用同一个类但进行微调时会非常有用。

## 使用组件类

即使你使用 [schema 和 table 类](#使用-schema-和-table-类)将 schema 和 table 定义放在独立的文件中，你仍然可能得到一个非常长的 `configure()` 方法。当你在 schema 或 table 中使用大量组件，或者组件需要大量配置时，这种情况尤为明显。

你可以通过为每个组件创建专用类来缓解这个问题。例如，如果你有一个需要大量配置的 `TextInput` 组件，可以为它创建一个专用类：

```php
namespace App\Filament\Resources\Customers\Schemas\Components;

use Filament\Forms\Components\TextInput;

class CustomerNameInput
{
    public static function make(): TextInput
    {
        return TextInput::make('name')
            ->label('Full name')
            ->required()
            ->maxLength(255)
            ->placeholder('Enter your full name')
            ->belowContent('This is the name that will be displayed on your profile.');
    }
}
```

然后你可以在 schema 或 table 中使用这个类：

```php
use App\Filament\Resources\Customers\Schemas\Components\CustomerNameInput;
use Filament\Schemas\Schema;

public static function configure(Schema $schema): Schema
{
    return $schema
        ->components([
            CustomerNameInput::make(),
            // ...
        ]);
}
```

你可以对多种不同类型的组件执行此操作。对于这些组件应该如何命名或存储在哪里，没有强制性规则。但以下是一些建议：

- **Schema 组件**：可以放在资源的 `Schemas/Components` 目录中。可以按它们包装的组件命名，例如 `CustomerNameInput` 或 `CustomerCountrySelect`。
- **Table 列**：可以放在资源的 `Tables/Columns` 目录中。可以按列名加 `Column` 命名，例如 `CustomerNameColumn` 或 `CustomerCountryColumn`。
- **Table 过滤器**：可以放在资源的 `Tables/Filters` 目录中。可以按过滤器名加 `Filter` 命名，例如 `CustomerCountryFilter` 或 `CustomerStatusFilter`。
- **操作**：可以放在资源的 `Actions` 目录中。可以按操作名加 `Action` 或 `BulkAction` 命名，例如 `EmailCustomerAction` 或 `UpdateCustomerCountryBulkAction`。

作为进一步的示例，以下是一个可能的 `EmailCustomerAction` 类：

```php
namespace App\Filament\Resources\Customers\Actions;

use App\Models\Customer;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Support\Icons\Heroicon;

class EmailCustomerAction
{
    public static function make(): Action
    {
        return Action::make('email')
            ->label('Send email')
            ->icon(Heroicon::Envelope)
            ->schema([
                TextInput::make('subject')
                    ->required()
                    ->maxLength(255),
                Textarea::make('body')
                    ->autosize()
                    ->required(),
            ])
            ->action(function (Customer $customer, array $data) {
                // ...
            });
    }
}
```

你可以在页面的 `getHeaderActions()` 中使用它：

```php
use App\Filament\Resources\Customers\Actions\EmailCustomerAction;

protected function getHeaderActions(): array
{
    return [
        EmailCustomerAction::make(),
    ];
}
```

或者在表格行上使用它：

```php
use App\Filament\Resources\Customers\Actions\EmailCustomerAction;
use Filament\Tables\Table;

public static function configure(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->recordActions([
            EmailCustomerAction::make(),
        ]);
}
```

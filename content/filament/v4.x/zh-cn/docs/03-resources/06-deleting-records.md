---
title: 删除记录
---

![删除确认模态框](../../../raw-assets/docs-assets/screenshots/images/light/panels/resources/deleting.jpg)

## 处理软删除

![带有已删除筛选器的资源列表](../../../raw-assets/docs-assets/screenshots/images/light/panels/resources/trashed.jpg)

## 创建支持软删除的资源

默认情况下，你无法在应用中与已删除的记录进行交互。如果你希望在资源中添加恢复、强制删除和筛选已删除记录的功能，请在生成资源时使用 `--soft-deletes` 标志：

```bash
php artisan make:filament-resource Customer --soft-deletes
```

## 为现有资源添加软删除功能

或者，你可以为现有资源添加软删除功能。

首先，你必须更新资源：

```php
use Filament\Actions\BulkActionGroup;
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

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->filters([
            TrashedFilter::make(),
            // ...
        ])
        ->recordActions([
            // You may add these actions to your table if you're using a simple
            // resource, or you just want to be able to delete records without
            // leaving the table.
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

public static function getRecordRouteBindingEloquentQuery(): Builder
{
    return parent::getRecordRouteBindingEloquentQuery()
        ->withoutGlobalScopes([
            SoftDeletingScope::class,
        ]);
}
```

接下来，如果你有编辑页面类，请更新它：

```php
use Filament\Actions;

protected function getHeaderActions(): array
{
    return [
        Actions\DeleteAction::make(),
        Actions\ForceDeleteAction::make(),
        Actions\RestoreAction::make(),
        // ...
    ];
}
```

## 在列表页面上删除记录

默认情况下，你可以在表格中批量删除记录。你也可以使用 `DeleteAction` 来删除单条记录：

```php
use Filament\Actions\DeleteAction;
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->recordActions([
            // ...
            DeleteAction::make(),
        ]);
}
```

## 授权

在授权方面，Filament 会遵循应用中注册的所有[模型策略](https://laravel.com/docs/authorization#creating-policies)。

如果模型策略的 `delete()` 方法返回 `true`，用户可以删除记录。

如果策略的 `deleteAny()` 方法返回 `true`，用户还可以批量删除记录。Filament 使用 `deleteAny()` 方法，因为遍历多条记录并逐一检查 `delete()` 策略的性能较差。

你可以使用 `BulkDeleteAction` 上的 `authorizeIndividualRecords()` 方法来逐条检查每条记录的 `delete()` 策略。

### 软删除的授权

`forceDelete()` 策略方法用于防止单条软删除记录被强制删除。`forceDeleteAny()` 用于防止记录被批量强制删除。Filament 使用 `forceDeleteAny()` 方法，因为遍历多条记录并逐一检查 `forceDelete()` 策略的性能较差。

`restore()` 策略方法用于防止单条软删除记录被恢复。`restoreAny()` 用于防止记录被批量恢复。Filament 使用 `restoreAny()` 方法，因为遍历多条记录并逐一检查 `restore()` 策略的性能较差。

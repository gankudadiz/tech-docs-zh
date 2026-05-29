---
title: 操作
---

## 简介

Filament 的表格可以使用[操作](../actions/overview)。它们是可以添加到[任何表格行末尾](#记录操作)的按钮，甚至可以添加到表格的[头部](#头部操作)或[工具栏](#工具栏操作)中。例如，你可能想要一个在头部"创建"新记录的操作，然后在每一行上有"编辑"和"删除"操作。[批量操作](#批量操作)可用于在表格中的记录被选中时执行代码。此外，操作可以添加到任何[表格列](#列操作)中，使得该列中的每个单元格都成为操作的触发器。

强烈建议你阅读关于[自定义操作触发按钮](../actions/overview)和[操作模态框](../actions/modals)的文档，以了解操作的全部功能。

## 记录操作

操作按钮可以渲染在每一行的末尾。你可以将它们放在 `$table->recordActions()` 方法中：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->recordActions([
            // ...
        ]);
}
```

操作可以使用静态 `make()` 方法创建，传入其唯一名称。

然后你可以传递一个函数给 `action()` 来执行任务，或者传递一个函数给 `url()` 来创建链接：

```php
use App\Models\Post;
use Filament\Actions\Action;

Action::make('edit')
    ->url(fn (Post $record): string => route('posts.edit', $record))
    ->openUrlInNewTab()

Action::make('delete')
    ->requiresConfirmation()
    ->action(fn (Post $record) => $record->delete())
```

操作上的所有方法都接受回调函数，你可以在其中访问被点击的当前表格 `$record`。

![带操作的表格](/assets/filament/v4.x/screenshots/images/light/tables/actions/simple.jpg)

### 将记录操作定位在列之前

默认情况下，表格中的记录操作渲染在每一行的最后一个单元格中。你可以使用 `position` 参数将它们移动到列之前：

```php
use Filament\Tables\Enums\RecordActionsPosition;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->recordActions([
            // ...
        ], position: RecordActionsPosition::BeforeColumns);
}
```

![列之前的操作](/assets/filament/v4.x/screenshots/images/light/tables/actions/before-columns.jpg)

### 将记录操作定位在复选框列之前

默认情况下，表格中的记录操作渲染在每一行的最后一个单元格中。你可以使用 `position` 参数将它们移动到复选框列之前：

```php
use Filament\Tables\Enums\RecordActionsPosition;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->recordActions([
            // ...
        ], position: RecordActionsPosition::BeforeCells);
}
```

### 全局记录操作设置

要自定义未分组记录操作使用的默认配置，你可以在服务提供者的 `boot()` 方法中使用 [`Table::configureUsing()` 函数](overview#全局设置)中的 `modifyUngroupedRecordActionsUsing()`：

```php
use Filament\Actions\Action;
use Filament\Tables\Table;

Table::configureUsing(function (Table $table): void {
    $table
        ->modifyUngroupedRecordActionsUsing(fn (Action $action) => $action->iconButton());
});
```

![单元格之前的操作](/assets/filament/v4.x/screenshots/images/light/tables/actions/before-cells.jpg)

### 访问选中的表格行

你可能希望操作能够访问表格中所有选中的行。通常，这是通过表格头部的[批量操作](#批量操作)完成的。然而，你可能希望使用行操作来完成，其中选中的行为操作提供上下文。

例如，你可能希望有一个行操作，将行数据复制到所有选中的记录。要强制表格可选中（即使没有定义批量操作），你需要使用 `selectable()` 方法。要允许操作访问选中的记录，你需要使用 `accessSelectedRecords()` 方法。然后，你可以在操作中使用 `$selectedRecords` 参数来访问选中的记录：

```php
use Filament\Actions\Action;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

public function table(Table $table): Table
{
    return $table
        ->selectable()
        ->recordActions([
            Action::make('copyToSelected')
                ->accessSelectedRecords()
                ->action(function (Model $record, Collection $selectedRecords) {
                    $selectedRecords->each(
                        fn (Model $selectedRecord) => $selectedRecord->update([
                            'is_active' => $record->is_active,
                        ]),
                    );
                }),
        ]);
}
```

## 批量操作

表格还支持"批量操作"。当用户在表格中选择行时，可以使用这些操作。传统上，当行被选中时，会出现一个"批量操作"按钮。当用户点击此按钮时，会呈现一个操作下拉菜单供选择。你可以将它们放在 `$table->toolbarActions()` 或 `$table->headerActions()` 方法中：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->toolbarActions([
            // ...
        ]);
}
```

批量操作可以使用静态 `make()` 方法创建，传入其唯一名称。然后你应该传递一个回调给 `action()` 来执行任务：

```php
use Filament\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;

BulkAction::make('delete')
    ->requiresConfirmation()
    ->action(fn (Collection $records) => $records->each->delete())
```

该函数允许你访问当前选中的表格 `$records`。它是一个 Eloquent 模型集合。

![带批量操作的表格](/assets/filament/v4.x/screenshots/images/light/tables/actions/bulk.jpg)

### 授权批量操作

使用批量操作时，你可以为每个选中的记录检查策略方法。这对于检查用户是否有权限对每个记录执行操作非常有用。你可以使用 `authorizeIndividualRecords()` 方法，传递策略方法的名称，该方法将为每个记录调用。如果策略拒绝授权，该记录将不会出现在批量操作的 `$records` 参数中：

```php
use Filament\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;

BulkAction::make('delete')
    ->requiresConfirmation()
    ->authorizeIndividualRecords('delete')
    ->action(fn (Collection $records) => $records->each->delete())
```

### 批量操作通知

批量操作完成后，你可能希望向用户发送通知，总结操作的成功情况。如果你对单个记录使用[授权](#授权批量操作)，这尤其有用，因为用户可能不知道实际影响了多少记录。

要在批量操作完成后发送通知，你应该设置 `successNotificationTitle()` 和 `failureNotificationTitle()`：

- `successNotificationTitle()` 用作所有记录成功处理时的通知标题。
- `failureNotificationTitle()` 用作部分或全部记录处理失败时的通知标题。通过向此方法传递函数，你可以注入 `$successCount` 和 `$failureCount` 参数，向用户提供此信息。

例如：

```php
use Filament\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;

BulkAction::make('delete')
    ->requiresConfirmation()
    ->authorizeIndividualRecords('delete')
    ->action(fn (Collection $records) => $records->each->delete())
    ->successNotificationTitle('Deleted users')
    ->failureNotificationTitle(function (int $successCount, int $totalCount): string {
        if ($successCount) {
            return "{$successCount} of {$totalCount} users deleted";
        }

        return 'Failed to delete any users';
    })
```

你还可以在策略方法中使用特殊的[授权响应对象](https://laravel.com/docs/authorization#policy-responses)来提供关于授权失败原因的自定义消息。该特殊对象称为 `DenyResponse`，替代 `Response::deny()`，允许开发者传递一个函数作为消息，该函数可以接收有关该授权检查拒绝了多少记录的信息：

```php
use App\Models\User;
use Filament\Support\Authorization\DenyResponse;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function delete(User $user, User $model): bool | Response
    {
        if (! $model->is_admin) {
            return true;
        }

        return DenyResponse::make('cannot_delete_admin', message: function (int $failureCount, int $totalCount): string {
            if (($failureCount === 1) && ($totalCount === 1)) {
                return 'You cannot delete an admin user.';
            }

            if ($failureCount === $totalCount) {
                return 'All users selected were admin users.';
            }

            if ($failureCount === 1) {
                return 'One of the selected users was an admin user.';
            }

            return "{$failureCount} of the selected users were admin users.";
        });
    }
}
```

`make()` 方法的第一个参数是标识该失败类型的唯一键。如果检测到该键的多个失败，它们将被分组在一起，并且只生成一条消息。如果策略方法中有多个失败点，每个响应对象可以有自己的键，消息将在通知中连接在一起。

#### 报告批量操作处理中的失败

除了[单个记录授权](#授权批量操作)消息外，你还可以报告批量操作处理本身的失败。如果你想为每个因特定原因处理失败的记录提供消息（即使授权通过），这很有用。这是通过将 `Action` 实例注入到 `action()` 函数中，并调用其 `reportBulkProcessingFailure()` 方法来完成的，传递一个类似于 `DenyResponse` 的键和消息函数：

```php
use Filament\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;

BulkAction::make('delete')
    ->requiresConfirmation()
    ->authorizeIndividualRecords('delete')
    ->action(function (BulkAction $action, Collection $records) {
        $records->each(function (Model $record) use ($action) {
            $record->delete() || $action->reportBulkProcessingFailure(
                'deletion_failed',
                message: function (int $failureCount, int $totalCount): string {
                    if (($failureCount === 1) && ($totalCount === 1)) {
                        return 'One user failed to delete.';
                    }

                    if ($failureCount === $totalCount) {
                        return 'All users failed to delete.';
                    }

                    if ($failureCount === 1) {
                        return 'One of the selected users failed to delete.';
                    }

                    return "{$failureCount} of the selected users failed to delete.";
                },
            );
        });
    })
    ->successNotificationTitle('Deleted users')
    ->failureNotificationTitle(function (int $successCount, int $totalCount): string {
        if ($successCount) {
            return "{$successCount} of {$totalCount} users deleted";
        }

        return 'Failed to delete any users';
    })
```

Eloquent 模型上的 `delete()` 方法在删除失败时返回 `false`，因此你可以使用它来确定记录是否成功删除。`reportBulkProcessingFailure()` 方法将向通知添加失败消息，该消息将在操作完成时显示。

`reportBulkProcessingFailure()` 方法可以在操作执行期间因不同原因多次调用，但每个记录只应调用一次。一旦你为特定记录调用了该方法，就不应继续对该记录执行操作。

### 分组批量操作

你可以使用 `BulkActionGroup` 对象将多个批量操作[组合在一起](../actions/grouping-actions)显示在下拉菜单中。任何在 `BulkActionGroup` 之外的批量操作将渲染在下拉菜单触发按钮旁边：

```php
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->toolbarActions([
            BulkActionGroup::make([
                BulkAction::make('delete')
                    ->requiresConfirmation()
                    ->action(fn (Collection $records) => $records->each->delete()),
                BulkAction::make('forceDelete')
                    ->requiresConfirmation()
                    ->action(fn (Collection $records) => $records->each->forceDelete()),
            ]),
            BulkAction::make('export')->button()->action(fn (Collection $records) => ...),
        ]);
}
```

![带分组和未分组批量操作的表格](/assets/filament/v4.x/screenshots/images/light/tables/actions/bulk-not-grouped.jpg)

或者，如果你的所有批量操作都已分组，你可以使用简写 `groupedBulkActions()` 方法：

```php
use Filament\Actions\BulkAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->groupedBulkActions([
            BulkAction::make('delete')
                ->requiresConfirmation()
                ->action(fn (Collection $records) => $records->each->delete()),
            BulkAction::make('forceDelete')
                ->requiresConfirmation()
                ->action(fn (Collection $records) => $records->each->forceDelete()),
        ]);
}
```

### 批量操作完成后取消选择记录

你可以使用 `deselectRecordsAfterCompletion()` 方法在批量操作执行后取消选择记录：

```php
use Filament\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;

BulkAction::make('delete')
    ->action(fn (Collection $records) => $records->each->delete())
    ->deselectRecordsAfterCompletion()
```

### 为某些行禁用批量操作

你可以有条件地为特定记录禁用批量操作：

```php
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

public function table(Table $table): Table
{
    return $table
        ->toolbarActions([
            // ...
        ])
        ->checkIfRecordIsSelectableUsing(
            fn (Model $record): bool => $record->status === Status::Enabled,
        );
}
```

### 限制可选记录的数量

你可以限制用户总共可以选择多少条记录：

```php
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

public function table(Table $table): Table
{
    return $table
        ->toolbarActions([
            // ...
        ])
        ->maxSelectableRecords(4);
}
```

### 防止批量选择所有页面

`selectCurrentPageOnly()` 方法可用于防止用户轻松地一次性批量选择表格中的所有记录，而是只允许他们一次选择一页：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->toolbarActions([
            // ...
        ])
        ->selectCurrentPageOnly();
}
```

### 将批量选择限制为仅分组

`selectGroupsOnly()` 方法可用于将批量选择限制为仅同一组内的记录，防止跨多个组的批量选择：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->toolbarActions([
            // ...
        ])
        ->selectGroupsOnly();
}
```

### 提高批量操作的性能

默认情况下，批量操作会将所有 Eloquent 记录加载到内存中，然后再传递给 `action()` 函数。

如果你正在处理大量记录，你可能希望使用 `chunkSelectedRecords()` 方法一次获取较少数量的记录。这将减少应用程序的内存使用：

```php
use Filament\Actions\BulkAction;
use Illuminate\Support\LazyCollection;

BulkAction::make()
    ->chunkSelectedRecords(250)
    ->action(function (LazyCollection $records) {
        // 处理记录...
    })
```

你仍然可以像正常一样循环 `$records` 集合，但该集合将是 `LazyCollection` 而不是普通集合。

你还可以防止 Filament 首先获取 Eloquent 模型，而是只将选中记录的 ID 传递给 `action()` 函数。如果你正在处理大量记录且不需要将它们加载到内存中，这很有用：

```php
use Filament\Actions\BulkAction;
use Illuminate\Support\Collection;

BulkAction::make()
    ->fetchSelectedRecords(false)
    ->action(function (Collection $records) {
        // 处理记录...
    })
```

## 头部操作

操作和[批量操作](#批量操作)都可以渲染在表格的头部。你可以将它们放在 `$table->headerActions()` 方法中：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->headerActions([
            // ...
        ]);
}
```

这对于"创建"操作等不与任何特定表格行相关的事情，或需要更可见的批量操作很有用。

![带头部操作的表格](/assets/filament/v4.x/screenshots/images/light/tables/actions/header.jpg)

## 工具栏操作

操作和[批量操作](#批量操作)都可以渲染在表格的工具栏中。你可以将它们放在 `$table->toolbarActions()` 方法中：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->toolbarActions([
            // ...
        ]);
}
```

这对于"创建"操作等不与任何特定表格行相关的事情，或需要更可见的批量操作很有用。

![带工具栏操作的表格](/assets/filament/v4.x/screenshots/images/light/tables/actions/toolbar.jpg)

## 列操作

操作可以添加到列中，使得当该列中的单元格被点击时，它充当操作的触发器。你可以在文档中了解更多关于[列操作](columns/overview#触发操作)的信息。

## 分组操作

你可以使用 `ActionGroup` 对象将多个表格操作组合在一起显示在下拉菜单中：

```php
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->recordActions([
            ActionGroup::make([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ]),
            // ...
        ]);
}
```

你可以在[操作文档](../actions/grouping-actions)中了解更多关于自定义操作组的信息。

![带操作组的表格](/assets/filament/v4.x/screenshots/images/light/tables/actions/group.jpg)

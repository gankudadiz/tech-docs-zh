---
title: 恢复操作
---
## 简介

Filament 包含一个能够恢复[软删除](https://laravel.com/docs/eloquent#soft-deleting)的 Eloquent 记录的操作。当触发按钮被点击时，会打开一个模态框要求用户确认。你可以像这样使用它：

```php
use Filament\Actions\RestoreAction;

RestoreAction::make()
```

![恢复操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/restore-action/modal.jpg)

或者如果你想将其添加为表格批量操作，让用户可以选择要恢复哪些行，可以使用 `Filament\Actions\RestoreBulkAction`：

```php
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->toolbarActions([
            RestoreBulkAction::make(),
        ]);
}
```

## 恢复后重定向

你可以使用 `successRedirectUrl()` 方法设置表单提交后的自定义重定向：

```php
use Filament\Actions\RestoreAction;

RestoreAction::make()
    ->successRedirectUrl(route('posts.list'))
```

除了 `$record`，`successRedirectUrl()` 函数还可以注入各种工具作为参数。

## 自定义恢复通知

当记录成功恢复时，会向用户发送一条通知，表示操作成功。

要自定义此通知的标题，请使用 `successNotificationTitle()` 方法：

```php
use Filament\Actions\RestoreAction;

RestoreAction::make()
    ->successNotificationTitle('User restored')
```

除了允许静态值，`successNotificationTitle()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你可以使用 `successNotification()` 方法自定义整个通知：

```php
use Filament\Actions\RestoreAction;
use Filament\Notifications\Notification;

RestoreAction::make()
    ->successNotification(
       Notification::make()
            ->success()
            ->title('User restored')
            ->body('The user has been restored successfully.'),
    )
```

除了允许静态值，`successNotification()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

要完全禁用通知，请使用 `successNotification(null)` 方法：

```php
use Filament\Actions\RestoreAction;

RestoreAction::make()
    ->successNotification(null)
```

## 生命周期钩子

你可以使用 `before()` 和 `after()` 方法在记录恢复前后执行代码：

```php
use Filament\Actions\RestoreAction;

RestoreAction::make()
    ->before(function () {
        // ...
    })
    ->after(function () {
        // ...
    })
```

这些钩子函数可以注入各种工具作为参数。

## 提高批量恢复操作的性能

默认情况下，`RestoreBulkAction` 会将所有 Eloquent 记录加载到内存中，然后逐个循环恢复。

如果你要恢复大量记录，你可能需要使用 `chunkSelectedRecords()` 方法每次获取较少数量的记录。这将减少应用程序的内存使用：

```php
use Filament\Actions\RestoreBulkAction;

RestoreBulkAction::make()
    ->chunkSelectedRecords(250)
```

Filament 在恢复记录前将 Eloquent 记录加载到内存中有两个原因：

- 允许在恢复前使用模型策略对集合中的单个记录进行授权（例如使用 `authorizeIndividualRecords('restore')`）。
- 确保在恢复记录时运行模型事件，例如模型观察者中的 `restoring` 和 `restored` 事件。

如果你不需要单个记录的策略授权和模型事件，可以使用 `fetchSelectedRecords(false)` 方法，该方法不会在恢复前将记录获取到内存中，而是通过单个查询直接恢复：

```php
use Filament\Actions\RestoreBulkAction;

RestoreBulkAction::make()
    ->fetchSelectedRecords(false)
```

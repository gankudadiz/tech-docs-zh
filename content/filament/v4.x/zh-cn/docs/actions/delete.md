---
title: 删除操作
---
## 简介

Filament 包含一个能够删除 Eloquent 记录的操作。当触发按钮被点击时，会打开一个模态框要求用户确认。你可以像这样使用它：

```php
use Filament\Actions\DeleteAction;

// 创建一个删除操作，用于删除单条记录
// 点击后会显示确认模态框，用户确认后才会执行删除
DeleteAction::make()
```

![删除操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/delete-action/modal.jpg)

或者如果你想将其添加为表格批量操作，让用户可以选择要删除哪些行，可以使用 `Filament\Actions\DeleteBulkAction`：

```php
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Table;

// 在表格工具栏中添加批量删除操作
// 用户可以勾选多行，然后一次性删除选中的所有记录
public function table(Table $table): Table
{
    return $table
        ->toolbarActions([
            // 批量删除操作会显示在表格顶部的工具栏中
            DeleteBulkAction::make(),
        ]);
}
```

## 删除后重定向

你可以使用 `successRedirectUrl()` 方法设置记录删除后的自定义重定向：

```php
use Filament\Actions\DeleteAction;

// 设置删除成功后的重定向 URL
// 用户确认删除后会被重定向到文章列表页面
DeleteAction::make()
    ->successRedirectUrl(route('posts.list'))
```

除了 `$record`，`successRedirectUrl()` 函数还可以注入各种工具作为参数。

## 自定义删除通知

当记录成功删除时，会向用户发送一条通知，表示操作成功。

要自定义此通知的标题，请使用 `successNotificationTitle()` 方法：

```php
use Filament\Actions\DeleteAction;

// 自定义删除成功通知的标题
DeleteAction::make()
    ->successNotificationTitle('User deleted')  // 设置通知标题为 "User deleted"
```

除了允许静态值，`successNotificationTitle()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你可以使用 `successNotification()` 方法自定义整个通知：

```php
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;

// 完全自定义成功通知的外观和内容
DeleteAction::make()
    ->successNotification(
       Notification::make()
            ->success()  // 设置通知类型为成功（绿色）
            ->title('User deleted')  // 通知标题
            ->body('The user has been deleted successfully.'),  // 通知正文内容
    )
```

除了允许静态值，`successNotification()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

要完全禁用通知，请使用 `successNotification(null)` 方法：

```php
use Filament\Actions\DeleteAction;

// 完全禁用成功通知
// 用户删除记录后不会看到任何通知消息
DeleteAction::make()
    ->successNotification(null)
```

## 生命周期钩子

你可以使用 `before()` 和 `after()` 方法在记录删除前后执行代码：

```php
use Filament\Actions\DeleteAction;

// 生命周期钩子允许你在删除操作的不同阶段执行自定义代码
DeleteAction::make()
    ->before(function () {
        // 在记录删除之前运行
        // 可以用于检查权限、记录日志或执行前置操作
    })
    ->after(function () {
        // 在记录删除之后运行
        // 可以用于清理关联数据、发送通知或触发后续操作
    })
```

这些钩子函数可以注入各种工具作为参数。

## 提高批量删除操作的性能

默认情况下，`DeleteBulkAction` 会将所有 Eloquent 记录加载到内存中，然后逐个循环删除。

如果你要删除大量记录，你可能需要使用 `chunkSelectedRecords()` 方法每次获取较少数量的记录。这将减少应用程序的内存使用：

```php
use Filament\Actions\DeleteBulkAction;

// 使用 chunkSelectedRecords() 分批处理大量记录
// 每次只从数据库加载 250 条记录到内存，减少内存占用
// 适用于需要删除成千上万条记录的场景
DeleteBulkAction::make()
    ->chunkSelectedRecords(250)  // 每批处理 250 条记录
```

Filament 在删除记录前将 Eloquent 记录加载到内存中有两个原因：

- 允许在删除前使用模型策略对集合中的单个记录进行授权（例如使用 `authorizeIndividualRecords('delete')`）。
- 确保在删除记录时运行模型事件，例如模型观察者中的 `deleting` 和 `deleted` 事件。

如果你不需要单个记录的策略授权和模型事件，可以使用 `fetchSelectedRecords(false)` 方法，该方法不会在删除前将记录获取到内存中，而是通过单个查询直接删除：

```php
use Filament\Actions\DeleteBulkAction;

// 使用 fetchSelectedRecords(false) 直接删除，不加载记录到内存
// 这会跳过单个记录的策略授权检查和模型事件
// 适用于不需要这些功能且需要最高性能的场景
DeleteBulkAction::make()
    ->fetchSelectedRecords(false)  // 禁用记录预加载，直接删除
```

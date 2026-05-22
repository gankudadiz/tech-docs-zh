---
title: 强制删除操作
---
## 简介

Filament 包含一个能够强制删除[软删除](https://laravel.com/docs/eloquent#soft-deleting)的 Eloquent 记录的操作。当触发按钮被点击时，会打开一个模态框要求用户确认。你可以像这样使用它：

```php
use Filament\Actions\ForceDeleteAction;

// 创建一个强制删除操作，用于永久删除软删除的记录
// 与普通删除不同，强制删除会从数据库中完全移除记录
// 点击后会显示确认模态框，用户确认后才会执行删除
ForceDeleteAction::make()
```

![强制删除操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/force-delete-action/modal.jpg)

或者如果你想将其添加为表格批量操作，让用户可以选择要强制删除哪些行，可以使用 `Filament\Actions\ForceDeleteBulkAction`：

```php
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Tables\Table;

// 在表格工具栏中添加批量强制删除操作
// 用户可以勾选多行，然后一次性永久删除选中的所有记录
public function table(Table $table): Table
{
    return $table
        ->toolbarActions([
            // 批量强制删除操作会显示在表格顶部的工具栏中
            ForceDeleteBulkAction::make(),
        ]);
}
```

## 强制删除后重定向

你可以使用 `successRedirectUrl()` 方法设置表单提交后的自定义重定向：

```php
use Filament\Actions\ForceDeleteAction;

// 设置强制删除成功后的重定向 URL
// 用户确认删除后会被重定向到文章列表页面
ForceDeleteAction::make()
    ->successRedirectUrl(route('posts.list'))
```

除了 `$record`，`successRedirectUrl()` 函数还可以注入各种工具作为参数。

## 自定义强制删除通知

当记录成功强制删除时，会向用户发送一条通知，表示操作成功。

要自定义此通知的标题，请使用 `successNotificationTitle()` 方法：

```php
use Filament\Actions\ForceDeleteAction;

// 自定义强制删除成功通知的标题
ForceDeleteAction::make()
    ->successNotificationTitle('User force-deleted')  // 设置通知标题为 "User force-deleted"
```

除了允许静态值，`successNotificationTitle()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你可以使用 `successNotification()` 方法自定义整个通知：

```php
use Filament\Actions\ForceDeleteAction;
use Filament\Notifications\Notification;

// 完全自定义成功通知的外观和内容
ForceDeleteAction::make()
    ->successNotification(
       Notification::make()
            ->success()  // 设置通知类型为成功（绿色）
            ->title('User force-deleted')  // 通知标题
            ->body('The user has been force-deleted successfully.'),  // 通知正文内容
    )
```

除了允许静态值，`successNotification()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

要完全禁用通知，请使用 `successNotification(null)` 方法：

```php
use Filament\Actions\ForceDeleteAction;

// 完全禁用成功通知
// 用户强制删除记录后不会看到任何通知消息
ForceDeleteAction::make()
    ->successNotification(null)
```

## 生命周期钩子

你可以使用 `before()` 和 `after()` 方法在记录强制删除前后执行代码：

```php
use Filament\Actions\ForceDeleteAction;

// 生命周期钩子允许你在强制删除操作的不同阶段执行自定义代码
ForceDeleteAction::make()
    ->before(function () {
        // 在记录强制删除之前运行
        // 可以用于检查权限、记录日志或执行前置操作
    })
    ->after(function () {
        // 在记录强制删除之后运行
        // 可以用于清理关联数据、发送通知或触发后续操作
    })
```

这些钩子函数可以注入各种工具作为参数。

## 提高批量强制删除操作的性能

默认情况下，`ForceDeleteBulkAction` 会将所有 Eloquent 记录加载到内存中，然后逐个循环删除。

如果你要删除大量记录，你可能需要使用 `chunkSelectedRecords()` 方法每次获取较少数量的记录。这将减少应用程序的内存使用：

```php
use Filament\Actions\ForceDeleteBulkAction;

// 使用 chunkSelectedRecords() 分批处理大量记录
// 每次只从数据库加载 250 条记录到内存，减少内存占用
// 适用于需要永久删除成千上万条记录的场景
ForceDeleteBulkAction::make()
    ->chunkSelectedRecords(250)  // 每批处理 250 条记录
```

Filament 在删除记录前将 Eloquent 记录加载到内存中有两个原因：

- 允许在删除前使用模型策略对集合中的单个记录进行授权（例如使用 `authorizeIndividualRecords('forceDelete')`）。
- 确保在删除记录时运行模型事件，例如模型观察者中的 `forceDeleting` 和 `forceDeleted` 事件。

如果你不需要单个记录的策略授权和模型事件，可以使用 `fetchSelectedRecords(false)` 方法，该方法不会在删除前将记录获取到内存中，而是通过单个查询直接删除：

```php
use Filament\Actions\ForceDeleteBulkAction;

// 使用 fetchSelectedRecords(false) 直接删除，不加载记录到内存
// 这会跳过单个记录的策略授权检查和模型事件
// 适用于不需要这些功能且需要最高性能的场景
ForceDeleteBulkAction::make()
    ->fetchSelectedRecords(false)  // 禁用记录预加载，直接删除
```

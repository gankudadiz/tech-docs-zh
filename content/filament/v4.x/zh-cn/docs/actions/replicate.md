---
title: 复制操作
---
## 简介

Filament 包含一个能够[复制](https://laravel.com/docs/eloquent#replicating-models) Eloquent 记录的操作。你可以像这样使用它：

```php
use Filament\Actions\ReplicateAction;

// 创建一个复制操作，用于复制现有记录
// 点击后会显示确认模态框，用户确认后才会执行复制
// 复制的记录会自动填充原记录的数据
ReplicateAction::make()
```

![复制操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/replicate-action/modal.jpg)

## 排除属性

`excludeAttributes()` 方法用于指示操作哪些列应从复制中排除：

```php
use Filament\Actions\ReplicateAction;

// 使用 excludeAttributes() 排除不需要复制的字段
// 例如 slug 通常是唯一的，复制时应该排除
ReplicateAction::make()
    ->excludeAttributes(['slug'])  // 排除 slug 字段，复制后需要重新生成
```

## 在填充表单前自定义数据

你可能希望在将记录数据填充到表单之前对其进行修改。为此，你可以使用 `mutateRecordDataUsing()` 方法来修改 `$data` 数组，并在填充到表单之前返回修改后的版本：

```php
use Filament\Actions\ReplicateAction;

// 使用 mutateRecordDataUsing() 在数据填充到表单之前修改数据
// 这允许你在显示给用户之前调整复制的记录数据
ReplicateAction::make()
    ->mutateRecordDataUsing(function (array $data): array {
        // 将当前登录用户的 ID 添加到复制的记录中
        // 这样复制的记录会关联到当前用户
        $data['user_id'] = auth()->id();

        return $data;  // 返回修改后的数据数组
    })
```

## 复制后重定向

你可以使用 `successRedirectUrl()` 方法设置表单提交后的自定义重定向：

```php
use Filament\Actions\ReplicateAction;

// 设置复制成功后的重定向 URL
// 用户确认复制后会被重定向到文章列表页面
ReplicateAction::make()
    ->successRedirectUrl(route('posts.list'))
```

除了 `$record`，`successRedirectUrl()` 函数还可以注入各种工具作为参数。

## 自定义复制通知

当记录成功复制时，会向用户发送一条通知，表示操作成功。

要自定义此通知的标题，请使用 `successNotificationTitle()` 方法：

```php
use Filament\Actions\ReplicateAction;

// 自定义复制成功通知的标题
ReplicateAction::make()
    ->successNotificationTitle('Category replicated')  // 设置通知标题为 "Category replicated"
```

除了允许静态值，`successNotificationTitle()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你可以使用 `successNotification()` 方法自定义整个通知：

```php
use Filament\Actions\ReplicateAction;
use Filament\Notifications\Notification;

// 完全自定义成功通知的外观和内容
ReplicateAction::make()
    ->successNotification(
       Notification::make()
            ->success()  // 设置通知类型为成功（绿色）
            ->title('Category replicated')  // 通知标题
            ->body('The category has been replicated successfully.'),  // 通知正文内容
    )
```

除了允许静态值，`successNotification()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

要完全禁用通知，请使用 `successNotification(null)` 方法：

```php
use Filament\Actions\ReplicateAction;

// 完全禁用成功通知
// 用户复制记录后不会看到任何通知消息
ReplicateAction::make()
    ->successNotification(null)
```

## 生命周期钩子

钩子可用于在操作生命周期的不同阶段执行代码，例如在副本保存之前。

```php
use Filament\Actions\ReplicateAction;
use Illuminate\Database\Eloquent\Model;

// 生命周期钩子允许你在复制操作的不同阶段执行自定义代码
// 钩子按顺序执行：复制前 → 复制后保存前 → 保存后
ReplicateAction::make()
    ->before(function () {
        // 在记录被复制之前运行
        // 可以用于检查权限、记录日志或执行前置操作
    })
    ->beforeReplicaSaved(function (Model $replica): void {
        // 在记录被复制之后、保存到数据库之前运行
        // $replica 是新创建的副本实例，可以在这里修改副本数据
    })
    ->after(function (Model $replica): void {
        // 在副本保存到数据库之后运行
        // $replica 是已保存的副本实例，可以用于发送通知或触发后续操作
    })
```

这些钩子函数可以注入各种工具作为参数。

## 中止复制过程

任何时候，你都可以在生命周期钩子中调用 `$action->halt()`，这将中止整个复制过程：

```php
use App\Models\Post;
use Filament\Actions\Action;
use Filament\Actions\ReplicateAction;
use Filament\Notifications\Notification;

// 使用 before() 钩子在复制前检查条件
// 如果条件不满足，可以中止操作并显示通知
ReplicateAction::make()
    ->before(function (ReplicateAction $action, Post $record) {
        // 检查用户团队是否已订阅
        if (! $record->team->subscribed()) {
            // 显示警告通知，提示用户需要订阅
            Notification::make()
                ->warning()  // 设置通知类型为警告（黄色）
                ->title('You don\'t have an active subscription!')
                ->body('Choose a plan to continue.')
                ->persistent()  // 通知不会自动关闭，需要用户手动关闭
                ->actions([
                    // 在通知中添加一个订阅按钮
                    Action::make('subscribe')
                        ->button()
                        ->url(route('subscribe'), shouldOpenInNewTab: true),
                ])
                ->send();
        
            // 中止复制操作，副本不会被创建
            $action->halt();
        }
    })
```

如果你还希望操作模态框关闭，可以使用 `cancel()` 完全取消操作，而不是中止：

```php
// 使用 cancel() 方法取消操作并关闭模态框
// 与 halt() 不同，cancel() 会完全关闭模态框
$action->cancel();
```

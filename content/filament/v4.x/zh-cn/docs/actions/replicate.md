---
title: 复制操作
---
## 简介

Filament 包含一个能够[复制](https://laravel.com/docs/eloquent#replicating-models) Eloquent 记录的操作。你可以像这样使用它：

```php
use Filament\Actions\ReplicateAction;

ReplicateAction::make()
```

![复制操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/replicate-action/modal.jpg)

## 排除属性

`excludeAttributes()` 方法用于指示操作哪些列应从复制中排除：

```php
use Filament\Actions\ReplicateAction;

ReplicateAction::make()
    ->excludeAttributes(['slug'])
```

## 在填充表单前自定义数据

你可能希望在将记录数据填充到表单之前对其进行修改。为此，你可以使用 `mutateRecordDataUsing()` 方法来修改 `$data` 数组，并在填充到表单之前返回修改后的版本：

```php
use Filament\Actions\ReplicateAction;

ReplicateAction::make()
    ->mutateRecordDataUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

## 复制后重定向

你可以使用 `successRedirectUrl()` 方法设置表单提交后的自定义重定向：

```php
use Filament\Actions\ReplicateAction;

ReplicateAction::make()
    ->successRedirectUrl(route('posts.list'))
```

除了 `$record`，`successRedirectUrl()` 函数还可以注入各种工具作为参数。

## 自定义复制通知

当记录成功复制时，会向用户发送一条通知，表示操作成功。

要自定义此通知的标题，请使用 `successNotificationTitle()` 方法：

```php
use Filament\Actions\ReplicateAction;

ReplicateAction::make()
    ->successNotificationTitle('Category replicated')
```

除了允许静态值，`successNotificationTitle()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你可以使用 `successNotification()` 方法自定义整个通知：

```php
use Filament\Actions\ReplicateAction;
use Filament\Notifications\Notification;

ReplicateAction::make()
    ->successNotification(
       Notification::make()
            ->success()
            ->title('Category replicated')
            ->body('The category has been replicated successfully.'),
    )
```

除了允许静态值，`successNotification()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

要完全禁用通知，请使用 `successNotification(null)` 方法：

```php
use Filament\Actions\ReplicateAction;

ReplicateAction::make()
    ->successNotification(null)
```

## 生命周期钩子

钩子可用于在操作生命周期的不同阶段执行代码，例如在副本保存之前。

```php
use Filament\Actions\ReplicateAction;
use Illuminate\Database\Eloquent\Model;

ReplicateAction::make()
    ->before(function () {
        // 在记录被复制之前运行。
    })
    ->beforeReplicaSaved(function (Model $replica): void {
        // 在记录被复制之后、保存到数据库之前运行。
    })
    ->after(function (Model $replica): void {
        // 在副本保存到数据库之后运行。
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

ReplicateAction::make()
    ->before(function (ReplicateAction $action, Post $record) {
        if (! $record->team->subscribed()) {
            Notification::make()
                ->warning()
                ->title('You don\'t have an active subscription!')
                ->body('Choose a plan to continue.')
                ->persistent()
                ->actions([
                    Action::make('subscribe')
                        ->button()
                        ->url(route('subscribe'), shouldOpenInNewTab: true),
                ])
                ->send();
        
            $action->halt();
        }
    })
```

如果你还希望操作模态框关闭，可以使用 `cancel()` 完全取消操作，而不是中止：

```php
$action->cancel();
```

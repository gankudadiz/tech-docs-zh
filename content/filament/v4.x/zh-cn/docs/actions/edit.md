---
title: 编辑操作
---
## 简介

Filament 包含一个能够编辑 Eloquent 记录的操作。当触发按钮被点击时，将会打开一个包含表单的模态框。用户填写表单后，数据会被验证并保存到数据库。你可以像这样使用它：

```php
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;

EditAction::make()
    ->schema([
        TextInput::make('title')
            ->required()
            ->maxLength(255),
        // ...
    ])
```

![编辑操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/edit-action/modal.jpg)

## 在填充表单前自定义数据

你可能希望在将记录数据填充到表单之前对其进行修改。为此，你可以使用 `mutateRecordDataUsing()` 方法来修改 `$data` 数组，并在填充到表单之前返回修改后的版本：

```php
use Filament\Actions\EditAction;

EditAction::make()
    ->mutateRecordDataUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

除了 `$data`，`mutateRecordDataUsing()` 函数还可以注入各种工具作为参数。

## 在保存前自定义数据

有时你可能希望在数据最终保存到数据库之前对其进行修改。为此，你可以使用 `mutateDataUsing()` 方法，该方法可以访问 `$data` 数组并返回修改后的版本：

```php
use Filament\Actions\EditAction;

EditAction::make()
    ->mutateDataUsing(function (array $data): array {
        $data['last_edited_by_id'] = auth()->id();

        return $data;
    })
```

除了 `$data`，`mutateDataUsing()` 函数还可以注入各种工具作为参数。

## 自定义保存过程

你可以使用 `using()` 方法调整记录的更新方式：

```php
use Filament\Actions\EditAction;
use Illuminate\Database\Eloquent\Model;

EditAction::make()
    ->using(function (Model $record, array $data): Model {
        $record->update($data);

        return $record;
    })
```

除了 `$record` 和 `$data`，`using()` 函数还可以注入各种工具作为参数。

## 保存后重定向

你可以使用 `successRedirectUrl()` 方法设置表单提交后的自定义重定向：

```php
use Filament\Actions\EditAction;

EditAction::make()
    ->successRedirectUrl(route('posts.list'))
```

如果你想使用更新后的记录进行重定向，请使用 `$record` 参数：

```php
use Filament\Actions\EditAction;
use Illuminate\Database\Eloquent\Model;

EditAction::make()
    ->successRedirectUrl(fn (Model $record): string => route('posts.view', [
        'post' => $record,
    ]))
```

除了 `$record`，`successRedirectUrl()` 函数还可以注入各种工具作为参数。

## 自定义保存通知

当记录成功更新时，会向用户发送一条通知，表示操作成功。

要自定义此通知的标题，请使用 `successNotificationTitle()` 方法：

```php
use Filament\Actions\EditAction;

EditAction::make()
    ->successNotificationTitle('User updated')
```

除了允许静态值，`successNotificationTitle()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你可以使用 `successNotification()` 方法自定义整个通知：

```php
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;

EditAction::make()
    ->successNotification(
       Notification::make()
            ->success()
            ->title('User updated')
            ->body('The user has been saved successfully.'),
    )
```

除了允许静态值，`successNotification()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

要完全禁用通知，请使用 `successNotification(null)` 方法：

```php
use Filament\Actions\EditAction;

EditAction::make()
    ->successNotification(null)
```

## 生命周期钩子

钩子可用于在操作生命周期的不同阶段执行代码，例如在表单保存之前。

有多个可用的钩子：

```php
use Filament\Actions\EditAction;

EditAction::make()
    ->beforeFormFilled(function () {
        // 在表单字段从数据库填充之前运行。
    })
    ->afterFormFilled(function () {
        // 在表单字段从数据库填充之后运行。
    })
    ->beforeFormValidated(function () {
        // 在表单保存时验证表单字段之前运行。
    })
    ->afterFormValidated(function () {
        // 在表单保存时验证表单字段之后运行。
    })
    ->before(function () {
        // 在表单字段保存到数据库之前运行。
    })
    ->after(function () {
        // 在表单字段保存到数据库之后运行。
    })
```

这些钩子函数可以注入各种工具作为参数。

## 中止保存过程

任何时候，你都可以在生命周期钩子或修改方法中调用 `$action->halt()`，这将中止整个保存过程：

```php
use App\Models\Post;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;

EditAction::make()
    ->before(function (EditAction $action, Post $record) {
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

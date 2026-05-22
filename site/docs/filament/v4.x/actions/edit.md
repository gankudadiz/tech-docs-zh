---
title: 编辑操作
---
## 简介

Filament 包含一个能够编辑 Eloquent 记录的操作。当触发按钮被点击时，将会打开一个包含表单的模态框。用户填写表单后，数据会被验证并保存到数据库。你可以像这样使用它：

```php
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;

// 创建一个编辑操作，用于在模态框中编辑现有记录
// 表单会自动填充记录的当前数据
EditAction::make()
    // 定义表单字段，用户将在模态框中编辑这些字段
    ->schema([
        // 创建一个文本输入字段，用于编辑标题
        TextInput::make('title')
            ->required()  // 设置为必填字段
            ->maxLength(255),  // 限制最大长度为 255 个字符
        // ... 可以添加更多表单字段
    ])
```

![编辑操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/edit-action/modal.jpg)

## 在填充表单前自定义数据

你可能希望在将记录数据填充到表单之前对其进行修改。为此，你可以使用 `mutateRecordDataUsing()` 方法来修改 `$data` 数组，并在填充到表单之前返回修改后的版本：

```php
use Filament\Actions\EditAction;

// 使用 mutateRecordDataUsing() 在数据填充到表单之前修改数据
// 这允许你在显示给用户之前调整记录数据
EditAction::make()
    ->mutateRecordDataUsing(function (array $data): array {
        // 自动将当前登录用户的 ID 添加到数据中
        // 这样用户在表单中可以看到或修改这个值
        $data['user_id'] = auth()->id();

        return $data;  // 返回修改后的数据数组
    })
```

除了 `$data`，`mutateRecordDataUsing()` 函数还可以注入各种工具作为参数。

## 在保存前自定义数据

有时你可能希望在数据最终保存到数据库之前对其进行修改。为此，你可以使用 `mutateDataUsing()` 方法，该方法可以访问 `$data` 数组并返回修改后的版本：

```php
use Filament\Actions\EditAction;

// 使用 mutateDataUsing() 在数据保存到数据库之前修改数据
// 与 mutateRecordDataUsing() 不同，这个方法在表单验证后执行
EditAction::make()
    ->mutateDataUsing(function (array $data): array {
        // 记录最后编辑者的 ID
        // 这个值不会显示在表单中，而是直接保存到数据库
        $data['last_edited_by_id'] = auth()->id();

        return $data;  // 返回修改后的数据数组
    })
```

除了 `$data`，`mutateDataUsing()` 函数还可以注入各种工具作为参数。

## 自定义保存过程

你可以使用 `using()` 方法调整记录的更新方式：

```php
use Filament\Actions\EditAction;
use Illuminate\Database\Eloquent\Model;

// 使用 using() 方法完全自定义记录的更新逻辑
EditAction::make()
    ->using(function (Model $record, array $data): Model {
        // $record 是要更新的 Eloquent 模型实例
        // $data 是用户提交的表单数据
        // 这里使用 update() 方法更新记录并返回
        $record->update($data);

        return $record;  // 返回更新后的记录
    })
```

除了 `$record` 和 `$data`，`using()` 函数还可以注入各种工具作为参数。

## 保存后重定向

你可以使用 `successRedirectUrl()` 方法设置表单提交后的自定义重定向：

```php
use Filament\Actions\EditAction;

// 设置编辑成功后的重定向 URL
// 用户提交表单后会被重定向到文章列表页面
EditAction::make()
    ->successRedirectUrl(route('posts.list'))
```

如果你想使用更新后的记录进行重定向，请使用 `$record` 参数：

```php
use Filament\Actions\EditAction;
use Illuminate\Database\Eloquent\Model;

// 使用闭包动态生成重定向 URL
// $record 是刚刚更新的记录实例
// 这里重定向到更新后文章的查看页面
EditAction::make()
    ->successRedirectUrl(fn (Model $record): string => route('posts.view', [
        'post' => $record,  // 将更新后的记录传递给路由参数
    ]))
```

除了 `$record`，`successRedirectUrl()` 函数还可以注入各种工具作为参数。

## 自定义保存通知

当记录成功更新时，会向用户发送一条通知，表示操作成功。

要自定义此通知的标题，请使用 `successNotificationTitle()` 方法：

```php
use Filament\Actions\EditAction;

// 自定义编辑成功通知的标题
EditAction::make()
    ->successNotificationTitle('User updated')  // 设置通知标题为 "User updated"
```

除了允许静态值，`successNotificationTitle()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你可以使用 `successNotification()` 方法自定义整个通知：

```php
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;

// 完全自定义成功通知的外观和内容
EditAction::make()
    ->successNotification(
       Notification::make()
            ->success()  // 设置通知类型为成功（绿色）
            ->title('User updated')  // 通知标题
            ->body('The user has been saved successfully.'),  // 通知正文内容
    )
```

除了允许静态值，`successNotification()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

要完全禁用通知，请使用 `successNotification(null)` 方法：

```php
use Filament\Actions\EditAction;

// 完全禁用成功通知
// 用户编辑记录后不会看到任何通知消息
EditAction::make()
    ->successNotification(null)
```

## 生命周期钩子

钩子可用于在操作生命周期的不同阶段执行代码，例如在表单保存之前。

有多个可用的钩子：

```php
use Filament\Actions\EditAction;

// 生命周期钩子允许你在操作的不同阶段执行自定义代码
// 钩子按顺序执行：表单填充 → 表单验证 → 保存到数据库
EditAction::make()
    ->beforeFormFilled(function () {
        // 在表单字段从数据库填充之前运行
        // 可以用于准备数据或设置默认值
    })
    ->afterFormFilled(function () {
        // 在表单字段从数据库填充之后运行
        // 可以用于修改已填充的数据或触发其他操作
    })
    ->beforeFormValidated(function () {
        // 在表单保存时验证表单字段之前运行
        // 可以用于添加自定义验证逻辑
    })
    ->afterFormValidated(function () {
        // 在表单保存时验证表单字段之后运行
        // 可以用于处理验证后的数据
    })
    ->before(function () {
        // 在表单字段保存到数据库之前运行
        // 最后的机会修改数据或执行前置操作
    })
    ->after(function () {
        // 在表单字段保存到数据库之后运行
        // 可以用于发送通知、记录日志或触发后续操作
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

// 使用 before() 钩子在保存前检查条件
// 如果条件不满足，可以中止操作并显示通知
EditAction::make()
    ->before(function (EditAction $action, Post $record) {
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
        
            // 中止保存操作，数据不会被保存到数据库
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

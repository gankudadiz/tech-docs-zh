---
title: 创建操作
---
## 简介

Filament 包含一个能够创建 Eloquent 记录的操作。当触发按钮被点击时，将会打开一个包含表单的模态框。用户填写表单后，数据会被验证并保存到数据库。你可以像这样使用它：

```php
use Filament\Actions\CreateAction;
use Filament\Forms\Components\TextInput;

CreateAction::make()
    ->schema([
        TextInput::make('title')
            ->required()
            ->maxLength(255),
        // ...
    ])
```

![创建操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/create-action/modal.jpg)

## 在保存前自定义数据

有时你可能希望在数据最终保存到数据库之前对其进行修改。为此，你可以使用 `mutateDataUsing()` 方法，该方法可以访问 `$data` 数组并返回修改后的版本：

```php
use Filament\Actions\CreateAction;

CreateAction::make()
    ->mutateDataUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

除了 `$data`，`mutateDataUsing()` 函数还可以注入各种工具作为参数。

## 自定义创建过程

你可以使用 `using()` 方法调整记录的创建方式：

```php
use Filament\Actions\CreateAction;
use Illuminate\Database\Eloquent\Model;

CreateAction::make()
    ->using(function (array $data, string $model): Model {
        return $model::create($data);
    })
```

`$model` 是模型的类名，但你可以根据需要替换为自己的硬编码类。

除了 `$data` 和 `$model`，`using()` 函数还可以注入各种工具作为参数。

## 创建后重定向

你可以使用 `successRedirectUrl()` 方法设置表单提交后的自定义重定向：

```php
use Filament\Actions\CreateAction;

CreateAction::make()
    ->successRedirectUrl(route('posts.list'))
```

如果你想使用创建的记录进行重定向，请使用 `$record` 参数：

```php
use Filament\Actions\CreateAction;
use Illuminate\Database\Eloquent\Model;

CreateAction::make()
    ->successRedirectUrl(fn (Model $record): string => route('posts.edit', [
        'post' => $record,
    ]))
```

除了 `$record`，`successRedirectUrl()` 函数还可以注入各种工具作为参数。

## 自定义保存通知

当记录成功创建时，会向用户发送一条通知，表示操作成功。

要自定义此通知的标题，请使用 `successNotificationTitle()` 方法：

```php
use Filament\Actions\CreateAction;

CreateAction::make()
    ->successNotificationTitle('User registered')
```

除了允许静态值，`successNotificationTitle()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你可以使用 `successNotification()` 方法自定义整个通知：

```php
use Filament\Actions\CreateAction;
use Filament\Notifications\Notification;

CreateAction::make()
    ->successNotification(
       Notification::make()
            ->success()
            ->title('User registered')
            ->body('The user has been created successfully.'),
    )
```

除了允许静态值，`successNotification()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

要完全禁用通知，请使用 `successNotification(null)` 方法：

```php
use Filament\Actions\CreateAction;

CreateAction::make()
    ->successNotification(null)
```

## 生命周期钩子

钩子可用于在操作生命周期的不同阶段执行代码，例如在表单保存之前。

有多个可用的钩子：

```php
use Filament\Actions\CreateAction;

CreateAction::make()
    ->beforeFormFilled(function () {
        // 在表单字段填充默认值之前运行。
    })
    ->afterFormFilled(function () {
        // 在表单字段填充默认值之后运行。
    })
    ->beforeFormValidated(function () {
        // 在表单提交时验证表单字段之前运行。
    })
    ->afterFormValidated(function () {
        // 在表单提交时验证表单字段之后运行。
    })
    ->before(function () {
        // 在表单字段保存到数据库之前运行。
    })
    ->after(function () {
        // 在表单字段保存到数据库之后运行。
    })
```

这些钩子函数可以注入各种工具作为参数。

## 中止创建过程

任何时候，你都可以在生命周期钩子或修改方法中调用 `$action->halt()`，这将中止整个创建过程：

```php
use App\Models\Post;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Notifications\Notification;

CreateAction::make()
    ->before(function (CreateAction $action, Post $record) {
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

## 使用向导

你可以轻松地将创建过程转换为多步向导。不使用 `schema()`，而是定义一个 `steps()` 数组并传入你的 `Step` 对象：

```php
use Filament\Actions\CreateAction;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Wizard\Step;

CreateAction::make()
    ->steps([
        Step::make('Name')
            ->description('Give the category a unique name')
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->live()
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')
                    ->disabled()
                    ->required()
                    ->unique(Category::class, 'slug'),
            ])
            ->columns(2),
        Step::make('Description')
            ->description('Add some extra details')
            ->schema([
                MarkdownEditor::make('description'),
            ]),
        Step::make('Visibility')
            ->description('Control who can view it')
            ->schema([
                Toggle::make('is_visible')
                    ->label('Visible to customers.')
                    ->default(true),
            ]),
    ])
```

现在，创建一条新记录来看看你的向导效果！编辑操作仍将使用资源类中定义的表单。

如果你想允许自由导航，使所有步骤都可以跳过，请使用 `skippableSteps()` 方法：

```php
use Filament\Actions\CreateAction;

CreateAction::make()
    ->steps([
        // ...
    ])
    ->skippableSteps()
```

## 创建另一条记录

### 修改"再创建一个"操作

如果你想修改"再创建一个"操作，可以使用 `createAnotherAction()` 方法，传入一个返回操作的函数。所有[自定义操作触发按钮](overview)的方法都可以使用：

```php
use Filament\Actions\CreateAction;

CreateAction::make()
    ->createAnotherAction(fn (Action $action): Action => $action->label('Custom create another label'))
```

### 禁用"再创建一个"

如果你想从模态框中移除"再创建一个"按钮，可以使用 `createAnother(false)` 方法：

```php
use Filament\Actions\CreateAction;

CreateAction::make()
    ->createAnother(false)
```

除了允许静态值，`createAnother()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

### 创建另一条记录时保留数据

默认情况下，当用户使用"创建并再创建一个"功能时，所有表单数据会被清除，以便用户重新开始。如果你想保留表单中的部分数据，可以使用 `preserveFormDataWhenCreatingAnother()` 方法，传入要保留的字段数组：

```php
use Filament\Actions\CreateAction;

CreateAction::make()
    ->preserveFormDataWhenCreatingAnother(['is_admin', 'organization'])
```

或者，你可以定义一个函数，返回要保留的 `$data` 数组：

```php
use Filament\Actions\CreateAction;
use Illuminate\Support\Arr;

CreateAction::make()
    ->preserveFormDataWhenCreatingAnother(fn (array $data): array => Arr::only($data, ['is_admin', 'organization']))
```

要保留所有数据，请返回整个 `$data` 数组：

```php
use Filament\Actions\CreateAction;

CreateAction::make()
    ->preserveFormDataWhenCreatingAnother(fn (array $data): array => $data)
```

除了允许静态值，`preserveFormDataWhenCreatingAnother()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

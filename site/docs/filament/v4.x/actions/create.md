---
title: 创建操作
---
## 简介

Filament 包含一个能够创建 Eloquent 记录的操作。当触发按钮被点击时，将会打开一个包含表单的模态框。用户填写表单后，数据会被验证并保存到数据库。你可以像这样使用它：

```php
use Filament\Actions\CreateAction;
use Filament\Forms\Components\TextInput;

// 创建一个创建操作，用于在模态框中创建新记录
CreateAction::make()
    // 定义表单字段，用户将在模态框中填写这些字段
    ->schema([
        // 创建一个文本输入字段，用于输入标题
        TextInput::make('title')
            ->required()  // 设置为必填字段
            ->maxLength(255),  // 限制最大长度为 255 个字符
        // ... 可以添加更多表单字段
    ])
```

![创建操作模态框](/assets/filament/v4.x/screenshots/images/light/actions/create-action/modal.jpg)

## 在保存前自定义数据

有时你可能希望在数据最终保存到数据库之前对其进行修改。为此，你可以使用 `mutateDataUsing()` 方法，该方法可以访问 `$data` 数组并返回修改后的版本：

```php
use Filament\Actions\CreateAction;

// 使用 mutateDataUsing() 在数据保存到数据库之前修改数据
CreateAction::make()
    ->mutateDataUsing(function (array $data): array {
        // 自动将当前登录用户的 ID 添加到数据中
        // 这样就不需要用户手动填写 user_id 字段
        $data['user_id'] = auth()->id();

        return $data;  // 返回修改后的数据数组
    })
```

除了 `$data`，`mutateDataUsing()` 函数还可以注入各种工具作为参数。

## 自定义创建过程

你可以使用 `using()` 方法调整记录的创建方式：

```php
use Filament\Actions\CreateAction;
use Illuminate\Database\Eloquent\Model;

// 使用 using() 方法完全自定义记录的创建逻辑
CreateAction::make()
    ->using(function (array $data, string $model): Model {
        // $data 是用户提交的表单数据
        // $model 是模型的类名（例如 "App\Models\Post"）
        // 这里使用静态 create() 方法创建新记录并返回
        return $model::create($data);
    })
```

`$model` 是模型的类名，但你可以根据需要替换为自己的硬编码类。

除了 `$data` 和 `$model`，`using()` 函数还可以注入各种工具作为参数。

## 创建后重定向

你可以使用 `successRedirectUrl()` 方法设置表单提交后的自定义重定向：

```php
use Filament\Actions\CreateAction;

// 设置创建成功后的重定向 URL
// 用户提交表单后会被重定向到文章列表页面
CreateAction::make()
    ->successRedirectUrl(route('posts.list'))
```

如果你想使用创建的记录进行重定向，请使用 `$record` 参数：

```php
use Filament\Actions\CreateAction;
use Illuminate\Database\Eloquent\Model;

// 使用闭包动态生成重定向 URL
// $record 是刚刚创建的记录实例
// 这里重定向到新创建文章的编辑页面
CreateAction::make()
    ->successRedirectUrl(fn (Model $record): string => route('posts.edit', [
        'post' => $record,  // 将新记录传递给路由参数
    ]))
```

除了 `$record`，`successRedirectUrl()` 函数还可以注入各种工具作为参数。

## 自定义保存通知

当记录成功创建时，会向用户发送一条通知，表示操作成功。

要自定义此通知的标题，请使用 `successNotificationTitle()` 方法：

```php
use Filament\Actions\CreateAction;

// 自定义创建成功通知的标题
CreateAction::make()
    ->successNotificationTitle('User registered')  // 设置通知标题为 "User registered"
```

除了允许静态值，`successNotificationTitle()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你可以使用 `successNotification()` 方法自定义整个通知：

```php
use Filament\Actions\CreateAction;
use Filament\Notifications\Notification;

// 完全自定义成功通知的外观和内容
CreateAction::make()
    ->successNotification(
       Notification::make()
            ->success()  // 设置通知类型为成功（绿色）
            ->title('User registered')  // 通知标题
            ->body('The user has been created successfully.'),  // 通知正文内容
    )
```

除了允许静态值，`successNotification()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

要完全禁用通知，请使用 `successNotification(null)` 方法：

```php
use Filament\Actions\CreateAction;

// 完全禁用成功通知
// 用户创建记录后不会看到任何通知消息
CreateAction::make()
    ->successNotification(null)
```

## 生命周期钩子

钩子可用于在操作生命周期的不同阶段执行代码，例如在表单保存之前。

有多个可用的钩子：

```php
use Filament\Actions\CreateAction;

// 生命周期钩子允许你在操作的不同阶段执行自定义代码
// 钩子按顺序执行：表单填充 → 表单验证 → 保存到数据库
CreateAction::make()
    ->beforeFormFilled(function () {
        // 在表单字段填充默认值之前运行
        // 可以用于准备表单数据或设置默认值
    })
    ->afterFormFilled(function () {
        // 在表单字段填充默认值之后运行
        // 可以用于修改已填充的数据或触发其他操作
    })
    ->beforeFormValidated(function () {
        // 在表单提交时验证表单字段之前运行
        // 可以用于添加自定义验证逻辑
    })
    ->afterFormValidated(function () {
        // 在表单提交时验证表单字段之后运行
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

## 中止创建过程

任何时候，你都可以在生命周期钩子或修改方法中调用 `$action->halt()`，这将中止整个创建过程：

```php
use App\Models\Post;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Notifications\Notification;

// 使用 before() 钩子在保存前检查条件
// 如果条件不满足，可以中止操作并显示通知
CreateAction::make()
    ->before(function (CreateAction $action, Post $record) {
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
        
            // 中止创建操作，数据不会被保存到数据库
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

## 使用向导

你可以轻松地将创建过程转换为多步向导。不使用 `schema()`，而是定义一个 `steps()` 数组并传入你的 `Step` 对象：

```php
use Filament\Actions\CreateAction;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Wizard\Step;

// 使用向导将创建过程分为多个步骤
// 用户可以逐步填写表单，提高用户体验
CreateAction::make()
    ->steps([
        // 第一步：填写名称
        Step::make('Name')
            ->description('Give the category a unique name')  // 步骤描述
            ->schema([
                // 名称输入字段
                TextInput::make('name')
                    ->required()  // 必填
                    ->live()  // 启用实时更新，当值变化时触发 afterStateUpdated
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                    // 当名称变化时，自动生成 slug（URL 友好的标识符）

                // slug 字段，自动生成且不可编辑
                TextInput::make('slug')
                    ->disabled()  // 禁用手动编辑
                    ->required()  // 但仍然是必填字段
                    ->unique(Category::class, 'slug'),  // 确保在数据库中唯一
            ])
            ->columns(2),  // 使用两列布局显示这两个字段

        // 第二步：填写描述
        Step::make('Description')
            ->description('Add some extra details')
            ->schema([
                // 使用 Markdown 编辑器，支持富文本格式
                MarkdownEditor::make('description'),
            ]),

        // 第三步：设置可见性
        Step::make('Visibility')
            ->description('Control who can view it')
            ->schema([
                // 使用开关控制是否对客户可见
                Toggle::make('is_visible')
                    ->label('Visible to customers.')
                    ->default(true),  // 默认可见
            ]),
    ])
```

现在，创建一条新记录来看看你的向导效果！编辑操作仍将使用资源类中定义的表单。

如果你想允许自由导航，使所有步骤都可以跳过，请使用 `skippableSteps()` 方法：

```php
use Filament\Actions\CreateAction;

// 允许用户跳过向导中的任何步骤
// 用户可以自由导航，不必按顺序完成所有步骤
CreateAction::make()
    ->steps([
        // ... 定义向导步骤
    ])
    ->skippableSteps()  // 启用步骤跳过功能
```

## 创建另一条记录

### 修改"再创建一个"操作

如果你想修改"再创建一个"操作，可以使用 `createAnotherAction()` 方法，传入一个返回操作的函数。所有[自定义操作触发按钮](overview)的方法都可以使用：

```php
use Filament\Actions\CreateAction;

// 自定义"再创建一个"按钮的标签
// 默认标签是 "Create & add another"
CreateAction::make()
    ->createAnotherAction(fn (Action $action): Action => $action->label('Custom create another label'))
```

### 禁用"再创建一个"

如果你想从模态框中移除"再创建一个"按钮，可以使用 `createAnother(false)` 方法：

```php
use Filament\Actions\CreateAction;

// 完全禁用"再创建一个"按钮
// 用户创建记录后只能关闭模态框或重定向
CreateAction::make()
    ->createAnother(false)
```

除了允许静态值，`createAnother()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

### 创建另一条记录时保留数据

默认情况下，当用户使用"创建并再创建一个"功能时，所有表单数据会被清除，以便用户重新开始。如果你想保留表单中的部分数据，可以使用 `preserveFormDataWhenCreatingAnother()` 方法，传入要保留的字段数组：

```php
use Filament\Actions\CreateAction;

// 在"再创建一个"时保留指定字段的数据
// 默认情况下，所有表单数据会被清空
// 这里保留 is_admin 和 organization 字段的值
CreateAction::make()
    ->preserveFormDataWhenCreatingAnother(['is_admin', 'organization'])
```

或者，你可以定义一个函数，返回要保留的 `$data` 数组：

```php
use Filament\Actions\CreateAction;
use Illuminate\Support\Arr;

// 使用闭包更灵活地控制要保留的数据
// $data 是当前表单的所有数据
// Arr::only() 辅助函数只返回指定键的数据
CreateAction::make()
    ->preserveFormDataWhenCreatingAnother(fn (array $data): array => Arr::only($data, ['is_admin', 'organization']))
```

要保留所有数据，请返回整个 `$data` 数组：

```php
use Filament\Actions\CreateAction;

// 保留所有表单数据
// 用户点击"再创建一个"后，所有字段的值都会保留
CreateAction::make()
    ->preserveFormDataWhenCreatingAnother(fn (array $data): array => $data)
```

除了允许静态值，`preserveFormDataWhenCreatingAnother()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

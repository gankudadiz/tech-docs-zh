---
title: 操作
---
## 简介

"操作"这个词在 Laravel 社区中使用得相当频繁。传统的操作 PHP 类负责处理应用程序业务逻辑中的"执行"操作，例如用户登录、发送邮件或在数据库中创建新用户记录。

在 Filament 中，操作也负责处理应用中的"执行"操作。然而，它们与传统操作略有不同。它们被设计为在用户界面的上下文中使用。例如，你可能有一个删除客户记录的按钮，点击后会打开一个模态框来确认你的决定。当用户点击模态框中的"删除"按钮时，客户记录就被删除了。这整个工作流程就是一个"操作"。

```php
use Filament\Actions\Action;

// 创建一个删除操作，点击后会弹出确认框
Action::make('delete')                           // 操作名称，用于标识
    ->requiresConfirmation()                      // 启用确认模态框，防止误操作
    ->action(fn () => $this->client->delete())    // 确认后执行的回调，删除当前客户
```

操作还可以从用户那里收集额外信息。例如，你可能有一个给客户发邮件的按钮。当用户点击按钮时，会打开一个模态框来收集邮件主题和正文。当用户点击模态框中的"发送"按钮时，邮件就被发送了：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Facades\Mail;

// 创建一个发送邮件操作，点击后弹出表单收集邮件内容
Action::make('sendEmail')
    ->schema([                                    // 定义模态框中的表单字段
        TextInput::make('subject')->required(),   // 邮件主题输入框，必填
        RichEditor::make('body')->required(),     // 邮件正文富文本编辑器，必填
    ])
    ->action(function (array $data) {             // 表单提交后执行的回调，$data 包含表单数据
        Mail::to($this->client)                   // 发送给当前客户
            ->send(new GenericEmail(              // 发送通用邮件
                subject: $data['subject'],        // 从表单数据中获取主题
                body: $data['body'],              // 从表单数据中获取正文
            ));
    })
```

除了 `$data`，`action()` 函数还可以注入各种工具作为参数。

通常，操作会在不将用户重定向离开页面的情况下执行。这是因为我们广泛使用了 Livewire。然而，操作可以更简单，甚至不需要模态框。你可以向操作传递一个 URL，当用户点击按钮时，他们会被重定向到该页面：

```php
use Filament\Actions\Action;

// 创建一个编辑操作，点击后跳转到编辑页面
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))  // 动态生成跳转 URL
```

除了允许静态值，`url()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

:::danger
如果你将用户控制的数据传递给 `url()` 方法，你应该验证该 URL 是否不使用危险的 scheme，例如 `javascript:` 或 `data:`。否则可能会使你的应用程序暴露于 XSS 攻击。
:::

操作的触发按钮和模态框的整个外观都可以使用流畅的 PHP 方法进行自定义。我们为 UI 提供了合理且一致的样式，但所有这些都可以通过 CSS 进行自定义。

## 可用的操作

Filament 包含多个可以添加到你的应用中的操作。它们旨在简化最常见的 Eloquent 相关操作：

- [创建](create)
- [编辑](edit)
- [查看](view)
- [删除](delete)
- [复制](replicate)
- [强制删除](force-delete)
- [恢复](restore)
- [导入](import)
- [导出](export)

你也可以创建自己的操作来执行任何操作，这些只是我们内置提供的常见操作。

## 选择触发按钮样式

开箱即用，操作触发按钮有 4 种样式——"按钮"、"链接"、"图标按钮"和"徽章"。

"按钮"触发按钮有背景颜色、标签和可选的[图标](#设置图标)。通常，这是默认的按钮样式，但你可以使用 `button()` 方法手动使用它：

```php
use Filament\Actions\Action;

// 使用"按钮"样式触发，有背景颜色
Action::make('edit')
    ->button()                                    // 设置触发按钮样式为普通按钮
```

![按钮触发按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/button.jpg)

"链接"触发按钮没有背景颜色。它们必须有标签和可选的[图标](#设置图标)。它们看起来像嵌入在文本中的链接。你可以使用 `link()` 方法切换到该样式：

```php
use Filament\Actions\Action;

// 使用"链接"样式触发，无背景颜色，像文本链接
Action::make('edit')
    ->link()                                      // 设置触发按钮样式为链接
```

![链接触发按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/link.jpg)

"图标按钮"触发按钮是带有[图标](#设置图标)且没有标签的圆形按钮。你可以使用 `iconButton()` 方法切换到该样式：

```php
use Filament\Actions\Action;

// 使用"图标按钮"样式触发，圆形按钮，只有图标没有标签
Action::make('edit')
    ->icon('heroicon-m-pencil-square')            // 设置图标为铅笔方块
    ->iconButton()                                // 设置触发按钮样式为图标按钮
```

![图标按钮触发按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/icon-button.jpg)

"徽章"触发按钮有背景颜色、标签和可选的[图标](#设置图标)。你可以使用 `badge()` 方法将徽章用作触发按钮：

```php
use Filament\Actions\Action;

// 使用"徽章"样式触发，有背景颜色
Action::make('edit')
    ->badge()                                     // 设置触发按钮样式为徽章
```

![徽章触发按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/badge.jpg)

### 仅在移动设备上使用图标按钮

你可能希望在桌面端使用带有标签的按钮样式，但在移动端移除标签。这将把它转换为图标按钮。你可以使用 `labeledFrom()` 方法来实现，传入你想要添加标签的响应式[断点](https://tailwindcss.com/docs/responsive-design#overview)：

```php
use Filament\Actions\Action;

// 响应式按钮：在 md 及以上屏幕显示标签，在移动端仅显示图标
Action::make('edit')
    ->icon('heroicon-m-pencil-square')            // 设置图标
    ->button()                                    // 使用按钮样式
    ->labeledFrom('md')                           // 从 md 断点开始显示标签（移动端自动转为图标按钮）
```

## 设置标签

默认情况下，触发按钮的标签是从其名称生成的。你可以使用 `label()` 方法进行自定义：

```php
use Filament\Actions\Action;

// 自定义按钮标签为"Edit post"
Action::make('edit')
    ->label('Edit post')                          // 覆盖默认的标签（默认从名称生成）
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
```

除了允许静态值，`label()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

## 设置颜色

按钮可以有[颜色](../styling/colors)来表示其重要性：

```php
use Filament\Actions\Action;

// 设置按钮颜色为危险色（通常为红色），表示破坏性操作
Action::make('delete')
    ->color('danger')                             // 使用 danger 颜色标识删除操作
```

除了允许静态值，`color()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

![红色触发按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/danger.jpg)

## 设置大小

按钮有 3 种尺寸——`Size::Small`、`Size::Medium` 或 `Size::Large`。你可以使用 `size()` 方法更改操作触发按钮的大小：

```php
use Filament\Actions\Action;
use Filament\Support\Enums\Size;

// 设置按钮大小为大号
Action::make('create')
    ->size(Size::Large)                           // 使用 Large 枚举值设置大尺寸按钮
```

除了允许静态值，`size()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

![大号触发按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/large.jpg)

## 设置图标

按钮可以有[图标](../styling/icons)来为 UI 添加更多细节。你可以使用 `icon()` 方法设置图标：

```php
use Filament\Actions\Action;

// 为按钮添加图标，增强视觉识别
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->icon('heroicon-m-pencil-square')            // 使用 Heroicons 的铅笔方块图标
```

除了允许静态值，`icon()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

![带图标的触发按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/icon.jpg)

你还可以使用 `iconPosition()` 方法将图标位置更改为标签之后而不是之前：

```php
use Filament\Actions\Action;
use Filament\Support\Enums\IconPosition;

// 将图标位置设置为标签之后（默认在标签之前）
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->icon('heroicon-m-pencil-square')
    ->iconPosition(IconPosition::After)           // 图标显示在标签右侧
```

除了允许静态值，`iconPosition()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

![图标在标签之后的触发按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/icon-after.jpg)

## 授权

你可以有条件地为某些用户显示或隐藏操作。为此，你可以使用 `visible()` 或 `hidden()` 方法：

```php
use Filament\Actions\Action;

// 方式一：使用 visible() 控制显示（推荐）
// 只有当用户有 update 权限时才显示编辑按钮
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->visible(auth()->user()->can('update', $this->post))  // 有权限时显示

// 方式二：使用 hidden() 控制隐藏
// 当用户没有 update 权限时隐藏编辑按钮
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->hidden(! auth()->user()->can('update', $this->post)) // 无权限时隐藏
```

这对于仅对有权限的用户授权某些操作非常有用。

除了允许静态值，`visible()` 和 `hidden()` 方法还接受函数来动态计算。你可以向这些函数注入各种工具作为参数。

### 使用策略授权

你可以使用策略来授权操作。为此，将策略方法的名称传递给 `authorize()` 方法，Filament 将使用该操作的当前 Eloquent 模型来找到正确的策略：

```php
use Filament\Actions\Action;

// 使用 Laravel 策略进行授权检查
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->authorize('update')                         // 调用 PostPolicy 的 update 方法检查权限
```

:::info
如果你在面板资源或关系管理器中使用操作，你不需要使用 `authorize()` 方法，因为 Filament 会自动根据资源模型读取内置操作（如 `CreateAction`、`EditAction` 和 `DeleteAction`）的策略。更多信息请访问[资源授权](../resources/overview#授权)部分。
:::

如果你的策略方法返回[响应消息](https://laravel.com/docs/authorization#policy-responses)，你可以禁用操作而不是隐藏它，并使用 `authorizationTooltip()` 方法添加包含消息的工具提示：

```php
use Filament\Actions\Action;

// 授权失败时禁用按钮并显示工具提示（而非隐藏）
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->authorize('update')                         // 使用策略检查权限
    ->authorizationTooltip()                      // 授权失败时显示策略返回的消息作为工具提示
```

如果拒绝没有提供消息（例如，你的策略返回普通的 `false`，或 `Gate::before()` 钩子短路了检查），操作将被隐藏。你可以使用 `authorizationMessage()` 提供回退消息来保持操作在这种情况下可见。

![带授权工具提示的禁用操作按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/authorization-tooltip.jpg)

你也可以允许操作在用户未授权的情况下仍然可点击，但使用 `authorizationNotification()` 方法发送包含响应消息的通知：

```php
use Filament\Actions\Action;

// 授权失败时发送通知（按钮保持可点击状态）
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->authorize('update')                         // 使用策略检查权限
    ->authorizationNotification()                 // 授权失败时发送包含策略消息的通知
```

与 `authorizationTooltip()` 一样，如果拒绝没有提供消息，操作将被隐藏，除非你使用 `authorizationMessage()` 提供回退。

### 禁用按钮

如果你想禁用按钮而不是隐藏它，可以使用 `disabled()` 方法：

```php
use Filament\Actions\Action;

// 无条件禁用按钮（按钮可见但不可点击）
Action::make('delete')
    ->disabled()                                  // 禁用状态，用户无法点击
```

你可以通过传递布尔值来有条件地禁用按钮：

```php
use Filament\Actions\Action;

// 条件禁用：当用户没有 delete 权限时禁用按钮
Action::make('delete')
    ->disabled(! auth()->user()->can('delete', $this->post))  // 无权限时禁用
```

除了允许静态值，`disabled()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

![禁用的操作按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/disabled.jpg)

## 注册键盘快捷键

你可以为触发按钮附加键盘快捷键。这些使用与 [Mousetrap](https://craig.is/killing/mice) 相同的键码：

```php
use Filament\Actions\Action;

// 注册键盘快捷键，支持 Mac 和 Windows
Action::make('save')
    ->action(fn () => $this->save())              // 执行保存操作
    ->keyBindings(['command+s', 'ctrl+s'])        // Command+S（Mac）或 Ctrl+S（Windows）
```

除了允许静态值，`keyBindings()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

## 在按钮角上添加徽章

你可以在按钮角上添加徽章来显示任何你想要的内容。它对于显示某些内容的计数或状态指示器很有用：

```php
use Filament\Actions\Action;

// 在按钮角上显示数字徽章，用于显示计数
Action::make('filter')
    ->iconButton()                                // 使用图标按钮样式
    ->icon('heroicon-m-funnel')                   // 漏斗图标（筛选）
    ->badge(5)                                    // 显示数字 5 作为徽章
```

除了允许静态值，`badge()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

![带徽章的触发按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/badged.jpg)

你还可以传递徽章使用的[颜色](../styling/colors)：

```php
use Filament\Actions\Action;

// 自定义徽章颜色为成功色（通常为绿色）
Action::make('filter')
    ->iconButton()
    ->icon('heroicon-m-funnel')
    ->badge(5)                                    // 显示数字 5
    ->badgeColor('success')                       // 徽章背景色为绿色
```

除了允许静态值，`badgeColor()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

![带绿色徽章的触发按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/success-badged.jpg)

## 轮廓按钮样式

当你使用"按钮"触发样式时，你可能希望降低其突出程度。你可以使用不同的[颜色](#设置颜色)，但有时你可能想将其改为轮廓样式。你可以使用 `outlined()` 方法来实现：

```php
use Filament\Actions\Action;

// 使用轮廓样式，降低按钮的视觉突出程度
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->button()                                    // 使用按钮样式
    ->outlined()                                  // 改为轮廓样式（透明背景，有边框）
```

![轮廓触发按钮](/assets/filament/v4.x/screenshots/images/light/actions/trigger-button/outlined.jpg)

你可以选择传递布尔值来控制是否隐藏标签：

```php
use Filament\Actions\Action;

// 条件轮廓样式：根据功能开关决定是否使用轮廓
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->button()
    ->outlined(FeatureFlag::active())             // 当功能开关激活时使用轮廓样式
```

除了允许静态值，`outlined()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

## 为操作添加额外的 HTML 属性

你可以通过 `extraAttributes()` 方法向操作传递额外的 HTML 属性，这些属性将合并到其外部 HTML 元素上。属性应由数组表示，其中键是属性名，值是属性值：

```php
use Filament\Actions\Action;

// 添加额外的 HTML 属性，如 title 工具提示
Action::make('edit')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    ->extraAttributes([                           // 合并到按钮的外部 HTML 元素上
        'title' => 'Edit this post',              // 鼠标悬停时显示的工具提示
    ])
```

除了允许静态值，`extraAttributes()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

:::tip
默认情况下，多次调用 `extraAttributes()` 会覆盖之前的属性。如果你想合并属性，可以向该方法传递 `merge: true`。
:::

## 操作频率限制

你可以使用 `rateLimit()` 方法对操作进行频率限制。该方法接受用户 IP 地址每分钟可以执行的尝试次数。如果用户超出此限制，操作将不会运行，并会显示一条通知：

```php
use Filament\Actions\Action;

// 设置频率限制：每分钟最多执行 5 次
Action::make('delete')
    ->rateLimit(5)                                // 超出限制后显示通知并阻止执行
```

如果操作打开模态框，频率限制将在模态框提交时应用。

如果操作使用参数或针对特定的 Eloquent 记录打开，频率限制将应用于每个操作的每个唯一参数或记录组合。频率限制也仅限于面板中当前的 Livewire 组件/页面。

除了允许静态值，`rateLimit()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

## 自定义频率限制通知

当操作被频率限制时，会向用户发送一条通知，表示频率限制。

要自定义此通知的标题，请使用 `rateLimitedNotificationTitle()` 方法：

```php
use Filament\Actions\DeleteAction;

// 自定义频率限制通知的标题
DeleteAction::make()
    ->rateLimit(5)
    ->rateLimitedNotificationTitle('Slow down!')  // 自定义通知标题
```

除了允许静态值，`rateLimitedNotificationTitle()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

你可以使用 `rateLimitedNotification()` 方法自定义整个通知：

```php
use DanHarrin\LivewireRateLimiting\Exceptions\TooManyRequestsException;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;

// 完全自定义频率限制通知的内容
DeleteAction::make()
    ->rateLimit(5)
    ->rateLimitedNotification(
       fn (TooManyRequestsException $exception): Notification => Notification::make()
            ->warning()                           // 通知类型为警告
            ->title('Slow down!')                 // 自定义标题
            ->body("You can try deleting again in {$exception->secondsUntilAvailable} seconds."),  // 包含等待时间
    )
```

除了允许静态值，`rateLimitedNotification()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

### 自定义频率限制行为

如果你想自定义频率限制行为，可以一起使用 Laravel 的[频率限制](https://laravel.com/docs/rate-limiting#basic-usage)功能和 Filament 的[闪存通知](../notifications/overview)。

如果你想在操作模态框打开时立即进行频率限制，可以在 `mountUsing()` 方法中进行：

```php
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\RateLimiter;

// 自定义频率限制：在模态框打开时立即检查
Action::make('delete')
    ->mountUsing(function () {
        // 生成唯一的频率限制键：delete:用户ID
        if (RateLimiter::tooManyAttempts(
            $rateLimitKey = 'delete:' . auth()->id(),
            maxAttempts: 5,                       // 每分钟最多 5 次
        )) {
            // 超出限制时发送危险通知
            Notification::make()
                ->title('Too many attempts')
                ->body('Please try again in ' . RateLimiter::availableIn($rateLimitKey) . ' seconds.')
                ->danger()
                ->send();
                
            return;                               // 阻止模态框打开
        }
        
         RateLimiter::hit($rateLimitKey);          // 记录一次请求
    })
```

如果你想在操作运行时进行频率限制，可以在 `action()` 方法中进行：

```php
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\RateLimiter;

// 自定义频率限制：在操作执行时检查
Action::make('delete')
    ->action(function () {
        // 生成唯一的频率限制键：delete:用户ID
        if (RateLimiter::tooManyAttempts(
            $rateLimitKey = 'delete:' . auth()->id(),
            maxAttempts: 5,                       // 每分钟最多 5 次
        )) {
            // 超出限制时发送危险通知
            Notification::make()
                ->title('Too many attempts')
                ->body('Please try again in ' . RateLimiter::availableIn($rateLimitKey) . ' seconds.')
                ->danger()
                ->send();
                
            return;                               // 阻止操作执行
        }
        
         RateLimiter::hit($rateLimitKey);          // 记录一次请求
        
        // ... 执行实际的删除逻辑
    })
```

## 在模式中使用操作

操作对象可以插入到[模式](../schemas/overview)中的任何位置，例如[表单字段插槽](../forms/overview#为字段添加额外内容)、[节标题和页脚](../schemas/sections)或与[主要组件](../schemas/primes)一起。当操作在模式中使用时，它可以通过[工具注入](#从模式注入工具)访问模式的状态——你可以在闭包中使用 `$schemaGet` 和 `$schemaSet` 来读取和修改表单字段值。

```php
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;

// 在表单字段中嵌入操作按钮
TextInput::make('title')
    ->afterContent(                               // 在输入框下方添加内容
        // 创建一个生成 slug 的操作按钮
        Action::make('generateSlug')
            ->action(function (Get $schemaGet, Set $schemaSet) {
                // $schemaGet('title') - 获取 title 字段的值
                // $schemaSet('slug', ...) - 设置 slug 字段的值
                $schemaSet('slug', str($schemaGet('title'))->slug());
            })
    )

TextInput::make('slug')                           // slug 输入框，由上面的操作填充
```

### 在模式中添加操作列表

如果你想在模式中单独一行渲染操作按钮列表，而不是附加到特定字段，可以将它们包装在 `Actions` 布局组件中：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Actions;

// 在模式中创建独立的操作按钮列表
Actions::make([                                   // Actions 布局组件包装多个操作
    Action::make('star')                          // 星标操作
        ->icon('heroicon-m-star'),                // 星形图标
    Action::make('resetStars')                    // 重置星标操作
        ->icon('heroicon-m-x-mark')               // X 图标
        ->color('danger'),                        // 危险色（红色）
])
```

![模式中的独立操作](/assets/filament/v4.x/screenshots/images/light/schemas/layout/actions/independent/simple.jpg)

你可以使用 `fullWidth()` 方法使操作跨越模式的整个宽度：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Actions;

// 全宽操作列表，跨越整个模式宽度
Actions::make([
    Action::make('star')
        ->icon('heroicon-m-star'),
    Action::make('resetStars')
        ->icon('heroicon-m-x-mark')
        ->color('danger'),
])->fullWidth()                                   // 操作列表占据整个宽度
```

![模式中的全宽独立操作](/assets/filament/v4.x/screenshots/images/light/schemas/layout/actions/independent/full-width.jpg)

你可以使用 `alignment()` 方法更改操作的水平对齐方式：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Actions;
use Filament\Support\Enums\Alignment;

// 水平居中对齐操作按钮
Actions::make([
    Action::make('star')
        ->icon('heroicon-m-star'),
    Action::make('resetStars')
        ->icon('heroicon-m-x-mark')
        ->color('danger'),
])->alignment(Alignment::Center)                  // 操作按钮在容器中居中显示
```

![模式中居中对齐的独立操作](/assets/filament/v4.x/screenshots/images/light/schemas/layout/actions/independent/horizontally-aligned-center.jpg)

如果 `Actions` 组件与其他组件一起在网格中，你可以使用 `verticalAlignment()` 方法更改其垂直对齐方式：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Actions;
use Filament\Support\Enums\VerticalAlignment;

// 垂直底部对齐（用于网格布局中）
Actions::make([
    Action::make('star')
        ->icon('heroicon-m-star'),
    Action::make('resetStars')
        ->icon('heroicon-m-x-mark')
        ->color('danger'),
])->verticalAlignment(VerticalAlignment::End)     // 操作按钮对齐到容器底部
```

![模式中垂直对齐到底部的独立操作](/assets/filament/v4.x/screenshots/images/light/schemas/layout/actions/independent/vertically-aligned-end.jpg)

### 操作点击时运行 JavaScript

如果你需要一个简单的操作，直接在浏览器中运行 JavaScript 而不需要发起网络请求，可以使用 `actionJs()` 方法。这对于简单的交互很有用，例如即时更新表单字段值：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;

// 使用 actionJs() 直接在浏览器执行 JavaScript，无需服务器请求
TextInput::make('title')
    ->live(onBlur: true)                          // 失去焦点时更新值
    ->afterContent(
        Action::make('generateSlug')
            ->actionJs(<<<'JS'                    // 直接执行客户端 JavaScript
                $set('slug', $get('title').toLowerCase().replaceAll(' ', '-'))
                // $get('title') - 获取 title 字段值
                // $set('slug', ...) - 设置 slug 字段值
                JS)
    )

TextInput::make('slug')                           // slug 输入框，由 JavaScript 自动填充
```

JavaScript 字符串可以访问 `$get()` 和 `$set()` 工具，允许你读取和修改模式中表单字段的状态。

除了允许静态值，`actionJs()` 方法还接受一个函数来动态计算。你可以向该函数注入各种工具作为参数。

:::warning
使用 `actionJs()` 时，操作不能打开模态框或执行任何服务器端处理。它仅用于简单的客户端交互。如果你需要运行 PHP 代码，请使用 `action()` 方法。
:::

:::danger
传递给 `actionJs()` 方法的任何 JavaScript 字符串都将在浏览器中执行，因此你不应该将用户输入直接添加到字符串中，因为这可能导致跨站脚本（XSS）漏洞。来自 `$get()` 的用户输入不应作为 JavaScript 代码求值，但可以安全地用作字符串值。
:::

## 操作工具注入

用于配置操作的绝大多数方法都接受函数作为参数，而不是硬编码值：

```php
use Filament\Actions\Action;

// 工具注入基础示例：闭包可以注入各种工具
Action::make('edit')
    ->label('Edit post')
    ->url(fn (): string => route('posts.edit', ['post' => $this->post]))
    // url() 闭包可以注入 $record、$livewire、$action 等工具
```

仅此一点就解锁了许多自定义可能性。

该包还能够注入许多工具作为这些函数内部的参数。所有接受函数作为参数的自定义方法都可以注入工具。

这些注入的工具需要使用特定的参数名称。否则，Filament 不知道要注入什么。

### 注入当前模态框表单数据

如果你想访问当前[模态框表单数据](modals#在模态框中渲染表单)，请定义 `$data` 参数：

```php
// 注入当前模态框表单数据
function (array $data) {                         // $data 包含模态框中所有表单字段的值
    // ... $data['field_name'] 访问特定字段
}
```

请注意，如果模态框尚未提交，这将是空的。

### 注入 Eloquent 记录

如果你的操作与 Eloquent 记录关联，例如在表格行上，你可以使用 `$record` 参数注入记录：

```php
use Illuminate\Database\Eloquent\Model;

// 注入当前 Eloquent 记录（如表格行对应的数据）
function (Model $record) {                       // $record 是当前操作关联的模型实例
    // ... $record->id、$record->name 等
}
```

### 注入当前参数

如果你想访问传递给操作的[当前参数](../components/action#传递操作参数)，请定义 `$arguments` 参数：

```php
// 注入传递给操作的当前参数
function (array $arguments) {                    // $arguments 包含所有传递的参数
    // ... $arguments['key'] 访问特定参数
}
```

### 从模式注入工具

如果你的操作在模式中定义，你可以访问各种额外的工具：

- `$schema` - 操作所属的模式实例。
- `$schemaComponent` - 操作所属的模式组件实例。
- `$schemaComponentState` - 模式组件的当前值。
- `$schemaState` - 此操作所属模式的当前值，例如当前的重复器项目。
- `$schemaGet` - 从模式数据中检索值的函数。不会对表单字段运行验证。
- `$schemaSet` - 在模式数据中设置值的函数。
- `$schemaOperation` - 模式正在执行的当前操作。通常是 `create`、`edit` 或 `view`。

更多信息，请访问[模式部分](../schemas/overview#组件实用工具注入)。

### 注入当前 Livewire 组件实例

如果你想访问操作所属的当前 Livewire 组件实例，请定义 `$livewire` 参数：

```php
use Livewire\Component;

// 注入当前 Livewire 组件实例
function (Component $livewire) {                 // $livewire 是操作所属的 Livewire 组件
    // ... 访问组件属性和方法
}
```

### 注入当前操作实例

如果你想访问当前操作实例，请定义 `$action` 参数：

```php
// 注入当前操作实例
function (Action $action) {                      // $action 是当前操作对象的实例
    // ... 访问操作的配置和状态
}
```

### 注入多个工具

参数是使用反射动态注入的，因此你可以按任意顺序组合多个参数：

```php
use Livewire\Component;

// 同时注入多个工具（使用反射自动解析）
function (array $arguments, Component $livewire) {  // 可以按任意顺序组合
    // ... $arguments 包含参数，$livewire 是组件实例
}
```

### 从 Laravel 容器注入依赖

你可以像往常一样从 Laravel 容器注入任何内容，与工具一起：

```php
use Illuminate\Http\Request;

// 从 Laravel 容器注入任何依赖（与工具一起使用）
function (Request $request, array $arguments) {   // $request 是 HTTP 请求实例
    // ... $request->input()、$request->user() 等
}
```
